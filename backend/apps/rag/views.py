from rest_framework.views import APIView
from rest_framework.response import Response

# pyrefly: ignore [missing-import]
from apps.companies.models import Company

from .services.retrieval_service import (
    RetrievalService
)

from .services.ollama_service import (
    OllamaService
)

from django.shortcuts import get_object_or_404

    
# pyrefly: ignore [missing-import]
from apps.chat.models import (
    ChatSession,
    ChatMessage
)
from rest_framework.permissions import IsAuthenticated

# pyrefly: ignore [missing-import]
from apps.chat.services import (
    ChatHistoryService
)

from .services.comparison_service import (
    ComparisonService
)

class RetrievalTestView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        company = Company.objects.first()

        question = request.data.get(
            "question"
        )

        chunks = (
            RetrievalService
            .retrieve_chunks(
                company.id,
                question
            )
        )

        return Response({

            "chunks": [

                chunk.chunk_text[:300]

                for chunk in chunks
            ]
        })
    
class CompanyChatView(APIView):
    permission_classes = [IsAuthenticated]

    def post(
        self,
        request,
        company_id,
        session_id
    ):

        company = get_object_or_404(
            Company,
            id=company_id
        )

        session = get_object_or_404(
            ChatSession,
            id=session_id
        )

        # Enforce customer ownership to prevent IDOR / session hijacking
        if session.customer != request.user:
            return Response(
                {"error": "You do not have permission to access this chat session."},
                status=403
            )

        if session.company_id != company.id:
            return Response(
                {"error": "This chat session does not belong to the requested company."},
                status=400
            )

        question = request.data.get(
            "question"
        )

        # pyrefly: ignore [missing-import]
        from apps.documents.models import DocumentChunk

        if not DocumentChunk.objects.filter(document__company=company).exists():
            answer = "No company knowledge is present at this time."
        else:
            chunks = (
                RetrievalService
                .retrieve_chunks(
                    company.id,
                    question
                )
            )

            context = (
                RetrievalService
                .build_context(
                    chunks
                )
            )

            answer = (
                OllamaService
                .generate_answer(
                    question,
                    context
                )
            )

        # Classify topic on initial query
        if session.topic == "General Query" or not session.topic:
            session.topic = OllamaService.classify_topic(question)

        # Touch and save session so updated_at is always updated for analytics and sorting
        session.save()

        ChatHistoryService.save_user_message(
            session,
            question
        )

        assistant_msg = ChatHistoryService.save_assistant_message(
            session,
            answer
        )

        return Response({

            "company": company.name,

            "answer": answer,

            "assistant_message_id": str(assistant_msg.id)
        })
    
class CompanyComparisonView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        company_ids = request.data.get("company_ids", [])
        question = request.data.get("question")

        if not company_ids:
            return Response({"error": "At least one company must be selected."}, status=400)
        if not question:
            return Response({"error": "Question is required."}, status=400)

        # Check if all selected companies have knowledge base documents
        # pyrefly: ignore [missing-import]
        from apps.documents.models import DocumentChunk
        for c_id in company_ids:
            if not DocumentChunk.objects.filter(document__company_id=c_id).exists():
                try:
                    comp = Company.objects.get(id=c_id)
                    name = comp.name
                except Company.DoesNotExist:
                    name = "Selected company"
                return Response({"error": f"{name} has not uploaded or successfully parsed any knowledge base documents. Please select another company."}, status=400)

        # Generate comparison answer
        context = ComparisonService.build_comparison_context(
            company_ids,
            question
        )
        answer = OllamaService.generate_comparison(
            question,
            context
        )

        # For each compared company, find or create a ChatSession and record the messages
        messages = []
        for c_id in company_ids:
            try:
                company = Company.objects.get(id=c_id)
            except Company.DoesNotExist:
                continue

            # Get or create the comparison session for this customer & company
            session, created = ChatSession.objects.get_or_create(
                customer=request.user,
                company=company,
                topic="Policy Comparison"
            )

            # Record customer question
            ChatMessage.objects.create(
                session=session,
                role="USER",
                content=question
            )

            # Record assistant comparison answer
            assistant_msg = ChatMessage.objects.create(
                session=session,
                role="ASSISTANT",
                content=answer
            )

            # Touch session so updated_at reflects recent activity
            session.save()

            messages.append({
                "company_id": str(c_id),
                "message_id": str(assistant_msg.id)
            })

        return Response({
            "answer": answer,
            "messages": messages
        })