from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from django.shortcuts import get_object_or_404

from django.utils import timezone
from datetime import timedelta
from django.db.models import Count, Min, Max
# pyrefly: ignore [missing-import]
from apps.chat.models import ChatSession, ChatMessage

from .models import Company, FavoriteCompanyCategory
from rest_framework.parsers import MultiPartParser
from .serializers import (
    CompanySerializer,
    CompanyLogoSerializer
)

# this prevents customer form creating company profile and also prevents same company user to create multiple company profiles
class CreateCompanyView(generics.CreateAPIView):

    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):

        if self.request.user.role != "company":
            raise PermissionDenied(
                "Only company users can create company profiles."
            )

        if Company.objects.filter(owner=self.request.user).exists():
            raise PermissionDenied(
                "Company profile already exists."
            )

        serializer.save(
            owner=self.request.user
        )

class MyCompanyView(generics.RetrieveAPIView):

    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        if self.request.user.role != "company":
            raise PermissionDenied("Only company users can access company profile details.")

        return get_object_or_404(
            Company,
            owner=self.request.user
        )
    
class CompanyListView(generics.ListAPIView):

    # Returns the list of all companies stored in the database.
    queryset = Company.objects.all()
    serializer_class = CompanySerializer

class CompanyDetailView(generics.RetrieveAPIView):

    # Returns the details of a specific company.
    queryset = Company.objects.all()
    serializer_class = CompanySerializer

class CompanyByCategoryView(generics.ListAPIView):

    # Returns the list of all companies in a specific category.
    serializer_class = CompanySerializer

    def get_queryset(self):

        category = self.kwargs["category"]

        return Company.objects.filter(
            category=category
        )
    
class CompanyLogoUploadView(generics.UpdateAPIView):

    serializer_class = CompanyLogoSerializer
    permission_classes = [IsAuthenticated]

    parser_classes = [MultiPartParser] # Allows file uploads

    def get_object(self):
        if self.request.user.role != "company":
            raise PermissionDenied("Only company users can upload a company logo.")

        # Returns the company owned by the logged-in user.
        return get_object_or_404(
            Company,
            owner=self.request.user
        )

class UpdateCompanyView(generics.UpdateAPIView):

    serializer_class = CompanySerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        if self.request.user.role != "company":
            raise PermissionDenied("Only company users can update company details.")

        return get_object_or_404(
            Company,
            owner=self.request.user
        )


class FavoriteCompanyView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request): # Returns all favorite companies of the logged-in user.
        favorites = FavoriteCompanyCategory.objects.filter(user=request.user)
        data = {fav.category: str(fav.company_id) for fav in favorites}
        return Response(data, status=status.HTTP_200_OK)

    def post(self, request): # Used for adding or updating a favorite company.
        category = request.data.get("category")
        company_id = request.data.get("company_id")

        if not category: # checks if the category is provided. If not, it returns an error.
            return Response({"error": "Category is required."}, status=status.HTTP_400_BAD_REQUEST)

        if company_id is None or company_id == "": # checks if the company_id is provided. If not, it removes the favorite.
            FavoriteCompanyCategory.objects.filter(user=request.user, category=category).delete()
            return Response({"message": "Favorite cleared."}, status=status.HTTP_200_OK)

        # checks if the company exists.
        try:
            company = Company.objects.get(id=company_id)
        except Company.DoesNotExist:
            return Response({"error": "Company not found."}, status=status.HTTP_404_NOT_FOUND)

        # this update_or_create method updates the favorite company if it exists and creates it if it doesn't exist.
        fav, created = FavoriteCompanyCategory.objects.update_or_create(
            user=request.user,
            category=category,
            defaults={"company": company}
        )

        # returns the favorite company.
        return Response({
            "category": fav.category,
            "company_id": str(fav.company_id)
        }, status=status.HTTP_200_OK if not created else status.HTTP_201_CREATED)


class CompanyAnalyticsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        # checks if the user is a company user
        if request.user.role != "company":
            raise PermissionDenied("Only company users can view analytics.")
        
        # gets the company owned by the logged-in user.
        try:
            company = Company.objects.get(owner=request.user)
        except Company.DoesNotExist:
            return Response({"error": "Company profile not found."}, status=status.HTTP_404_NOT_FOUND)

        # This counts how many customers favorited the company
        total_favorited = FavoriteCompanyCategory.objects.filter(
            company=company
        ).count()

        # This counts the total number of unique customer users.
        total_customers = ChatSession.objects.filter(
            company=company
        ).values("customer").distinct().count()

        # This counts the total number of unique active customer users in the last 7 days
        seven_days_ago = timezone.now() - timedelta(days=7)
        active_customers_7d = ChatSession.objects.filter(
            company=company,
            updated_at__gte=seven_days_ago
        ).values("customer").distinct().count()

        # This counts how many helpful responses the assistant has given.
        helpful_responses = ChatMessage.objects.filter(
            session__company=company,
            role="ASSISTANT",
            feedback="helpful"
        ).count()

        # This counts how many unhelpful responses the assistant has given.
        unhelpful_responses = ChatMessage.objects.filter(
            session__company=company,
            role="ASSISTANT",
            feedback="unhelpful"
        ).count()

        # This counts how many missing data responses the assistant has given.
        missing_data = ChatMessage.objects.filter(
            session__company=company,
            role="ASSISTANT",
            feedback="unhelpful",
            feedback_missing_data=True
        ).count()

        # --- Detail List Extractions for Gaps / Click Actions ---
        
        # This counts how many customers favorited the company
        favorites_query = FavoriteCompanyCategory.objects.filter(
            company=company
        ).select_related('user').order_by('user__email')

        favorited_by_list = [
            {
                "id": str(fav.id),
                "email": fav.user.email,
                "category": fav.category,
                "created_at": None
            }
            for fav in favorites_query
        ]

        # 2. Total Customers List
        unique_customers = ChatSession.objects.filter(
            company=company
        ).values("customer__id", "customer__email").annotate(
            first_chat=Min("created_at"),
            last_chat=Max("updated_at"),
            session_count=Count("id")
        ).order_by("-last_chat")[:100]

        total_customers_list = [
            {
                "id": str(cust["customer__id"]),
                "email": cust["customer__email"],
                "first_chat": cust["first_chat"].isoformat() if cust["first_chat"] else None,
                "last_chat": cust["last_chat"].isoformat() if cust["last_chat"] else None,
                "session_count": cust["session_count"]
            }
            for cust in unique_customers
        ]

        # 3. Active Customers List
        active_customers = ChatSession.objects.filter(
            company=company,
            updated_at__gte=seven_days_ago
        ).values("customer__id", "customer__email").annotate(
            first_chat=Min("created_at"),
            last_chat=Max("updated_at"),
            session_count=Count("id")
        ).order_by("-last_chat")[:100]

        active_customers_list = [
            {
                "id": str(cust["customer__id"]),
                "email": cust["customer__email"],
                "first_chat": cust["first_chat"].isoformat() if cust["first_chat"] else None,
                "last_chat": cust["last_chat"].isoformat() if cust["last_chat"] else None,
                "session_count": cust["session_count"]
            }
            for cust in active_customers
        ]

        # 4. Fetch last 100 helpful answers list
        helpful_msgs = list(ChatMessage.objects.filter(
            session__company=company,
            role="ASSISTANT",
            feedback="helpful"
        ).order_by("-created_at")[:100])

        # 5. Fetch last 100 unhelpful answers list
        unhelpful_msgs = list(ChatMessage.objects.filter(
            session__company=company,
            role="ASSISTANT",
            feedback="unhelpful"
        ).order_by("-created_at")[:100])

        # 6. Fetch last 50 Missing Data (Gaps) List
        gaps = list(ChatMessage.objects.filter(
            session__company=company,
            role="ASSISTANT",
            feedback="unhelpful",
            feedback_missing_data=True
        ).order_by("-created_at")[:50])

        # OPTIMIZATION: Batch-fetch all preceding user questions in ONE single query to eliminate 250+ N+1 queries
        all_session_ids = (
            {m.session_id for m in helpful_msgs} |
            {m.session_id for m in unhelpful_msgs} |
            {g.session_id for g in gaps}
        )

        user_messages_by_session = {}
        if all_session_ids:
            user_msgs_qs = ChatMessage.objects.filter(
                session_id__in=all_session_ids,
                role="USER"
            ).order_by("session_id", "created_at").values("session_id", "content", "created_at")

            for u in user_msgs_qs:
                user_messages_by_session.setdefault(u["session_id"], []).append(u)

        def find_preceding_question(session_id, assistant_created_at):
            msgs = user_messages_by_session.get(session_id, [])
            latest_q = None
            for u in msgs:
                if u["created_at"] < assistant_created_at:
                    latest_q = u["content"]
                else:
                    break
            return latest_q or "Unknown question"

        helpful_list = [
            {
                "id": str(msg.id),
                "question": find_preceding_question(msg.session_id, msg.created_at),
                "answer": msg.content,
                "created_at": msg.created_at.isoformat()
            }
            for msg in helpful_msgs
        ]

        unhelpful_list = [
            {
                "id": str(msg.id),
                "question": find_preceding_question(msg.session_id, msg.created_at),
                "answer": msg.content,
                "feedback_missing_data": msg.feedback_missing_data,
                "created_at": msg.created_at.isoformat()
            }
            for msg in unhelpful_msgs
        ]

        gaps_list = [
            {
                "id": str(gap.id),
                "session_id": str(gap.session_id),
                "summary": gap.missing_data_summary or (
                    find_preceding_question(gap.session_id, gap.created_at)[:80] + "..."
                ),
                "created_at": gap.created_at.isoformat()
            }
            for gap in gaps
        ]

        # --- Charts Data ---
        # Top 10 Most Asked Topics (grouping similar ones on the fly for cleaner reporting)
        top_topics_query = ChatSession.objects.filter(
            company=company
        ).values("topic").annotate(
            count=Count("id")
        ).order_by("-count")

        normalized_topics = {}
        for q in top_topics_query:
            raw_topic = q["topic"] or "General Query"
            cnt = q["count"]
            
            # Group similar terms
            lower_topic = raw_topic.lower()
            if "cancel" in lower_topic:
                clean_name = "Order Cancellations"
            elif "refund" in lower_topic or "return" in lower_topic:
                clean_name = "Returns & Refunds"
            elif "billing" in lower_topic or "invoice" in lower_topic or "payment" in lower_topic or "price" in lower_topic:
                clean_name = "Payments & Billing"
            elif "shipping" in lower_topic or "delivery" in lower_topic or "track" in lower_topic:
                clean_name = "Shipping & Delivery"
            elif "account" in lower_topic or "login" in lower_topic or "tech" in lower_topic:
                clean_name = "Account & Tech Support"
            elif "product" in lower_topic or "stock" in lower_topic:
                clean_name = "Product Information"
            elif "hour" in lower_topic or "location" in lower_topic or "info" in lower_topic:
                clean_name = "General Information"
            else:
                clean_name = raw_topic.strip().title()
                if not clean_name:
                    clean_name = "General Query"

            normalized_topics[clean_name] = normalized_topics.get(clean_name, 0) + cnt

        top_topics = [
            {"topic": k, "count": v}
            for k, v in sorted(normalized_topics.items(), key=lambda x: x[1], reverse=True)[:10]
        ]

        return Response({
            "cards": {
                "total_favorited": total_favorited,
                "total_customers": total_customers,
                "active_customers_7d": active_customers_7d,
                "helpful_responses": helpful_responses,
                "unhelpful_responses": unhelpful_responses,
                "missing_data": missing_data
            },
            "favorited_by_list": favorited_by_list,
            "total_customers_list": total_customers_list,
            "active_customers_list": active_customers_list,
            "helpful_list": helpful_list,
            "unhelpful_list": unhelpful_list,
            "missing_data_list": gaps_list,
            "charts": {
                "top_topics": top_topics
            }
        })


class CompanyAnalyticsReportView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        if request.user.role != "company":
            raise PermissionDenied("Only company users can generate reports.")
        
        try:
            company = Company.objects.get(owner=request.user) # Find the company profile owned by the logged-in user.
        except Company.DoesNotExist:
            return Response({"error": "Company profile not found."}, status=status.HTTP_404_NOT_FOUND)

        # Verify customer interactions exist
        total_customers = ChatSession.objects.filter(
            company=company
        ).values("customer").distinct().count()

        if total_customers == 0:
            return Response(
                {"error": "No customer interactions have occurred yet. The AI support analysis report cannot be generated until customers have interacted with your knowledge base."},
                status=status.HTTP_400_BAD_REQUEST
            )

        # This counts every customer question.
        total_questions = ChatMessage.objects.filter(
            session__company=company,
            role="USER"
        ).count()

         # This counts every helpful responses.
        helpful_responses = ChatMessage.objects.filter(
            session__company=company,
            role="ASSISTANT",
            feedback="helpful"
        ).count()

        # This counts every unhelpful responses.
        unhelpful_responses = ChatMessage.objects.filter(
            session__company=company,
            role="ASSISTANT",
            feedback="unhelpful"
        ).count()

        # This counts missing knowledge.
        missing_data = ChatMessage.objects.filter(
            session__company=company,
            role="ASSISTANT",
            feedback="unhelpful",
            feedback_missing_data=True
        ).count()

        # Calculates satisfaction score
        total_rated = helpful_responses + unhelpful_responses
        satisfaction_score = (helpful_responses / total_rated * 100) if total_rated > 0 else 100.0

        # Fetch last 15 unhelpful QA pairs to feed LLM context
        unhelpful_examples = list(ChatMessage.objects.filter(
            session__company=company,
            role="ASSISTANT",
            feedback="unhelpful"
        ).order_by("-created_at")[:15])

        # Batch query user questions for the report
        unhelpful_session_ids = {item.session_id for item in unhelpful_examples}
        report_user_msgs = {}
        if unhelpful_session_ids:
            for u in ChatMessage.objects.filter(
                session_id__in=unhelpful_session_ids,
                role="USER"
            ).order_by("session_id", "created_at").values("session_id", "content", "created_at"):
                report_user_msgs.setdefault(u["session_id"], []).append(u)

        unhelpful_text = "" # stores last 15 assistant answers that users disliked.
        for idx, item in enumerate(unhelpful_examples):
            q_text = "N/A"
            for u in report_user_msgs.get(item.session_id, []):
                if u["created_at"] < item.created_at:
                    q_text = u["content"]
                else:
                    break
            unhelpful_text += f"{idx+1}. Question: {q_text}\n   Answer Given: {item.content}\n   Flagged Missing Knowledge Base: {item.feedback_missing_data}\n\n"

        # pyrefly: ignore [missing-import]
        from apps.rag.services.ollama_service import OllamaService

        try:
            report_content = OllamaService.generate_analytics_report(
                company_name=company.name,
                total_questions=total_questions,
                satisfaction_score=satisfaction_score,
                helpful_responses=helpful_responses,
                unhelpful_responses=unhelpful_responses,
                missing_data=missing_data,
                unhelpful_text=unhelpful_text
            )
        except Exception as e:
            return Response(
                {"error": f"Failed to generate AI report: {str(e)}"},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        return Response({
            "satisfaction_score": satisfaction_score,
            "total_rated": total_rated,
            "helpful_count": helpful_responses,
            "unhelpful_count": unhelpful_responses,
            "report": report_content
        })
