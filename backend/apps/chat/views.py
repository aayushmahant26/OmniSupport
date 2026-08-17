from django.shortcuts import (
    get_object_or_404
)

from rest_framework.views import (
    APIView
)

from rest_framework.response import (
    Response
)

from rest_framework.permissions import (
    IsAuthenticated
)


# pyrefly: ignore [missing-import]
from apps.companies.models import (
    Company
)

from .models import (
    ChatSession,
    ChatMessage
)

from .serializers import (
    ChatSessionSerializer
)

from .models import (
    ChatSession,
    ChatMessage
)

from .serializers import (
    ChatSessionSerializer
)

class CreateSessionView(APIView):

    # this makes sure only logged-in user create chat sessions
    permission_classes = [
        IsAuthenticated
    ]

    def post(
        self,
        request,
        company_id
    ):

        # this makes sure the company exists. If it doesn't exist, return 404 error
        company = (
            get_object_or_404(
                Company,
                id=company_id
            )
        )

        # pyrefly: ignore [missing-import]
        from apps.documents.models import DocumentChunk
        # this makes sure the company has uploaded documents. If not, return 400 error
        if not DocumentChunk.objects.filter(document__company=company).exists():
            return Response(
                {"error": "This company has not uploaded or successfully parsed any knowledge base documents."},
                status=400
            )

        # this creates a new chat session for the logged-in user and the company
        session = (
            ChatSession.objects.create(
                customer=request.user,
                company=company
            )
        )

        # this serializes the new chat session
        serializer = (
            ChatSessionSerializer(
                session
            )
        )

        # this returns the serialized chat session
        return Response(
            serializer.data
        )
    
class SessionDetailView(APIView):

    # this makes sure only logged-in user can view chat sessions
    permission_classes = [
        IsAuthenticated
    ]

    def get(
        self,
        request,
        session_id
    ):

        # this retrieves a chat session for the logged-in user and the company. If it doesn't exist, return 404 error
        session = (
            get_object_or_404(
                ChatSession,
                id=session_id,
                customer=request.user
            )
        )

        # this serializes the chat session
        serializer = (
            ChatSessionSerializer(
                session
            )
        )

        # this returns the serialized chat session
        return Response(
            serializer.data
        )
    
class SessionListView(APIView):

    # this makes sure only logged-in user can view chat sessions
    permission_classes = [
        IsAuthenticated
    ]

    def get(
        self,
        request
    ):

        # this retrieves all chat sessions for the logged-in user
        sessions = (
            ChatSession.objects
            .filter(
                customer=request.user
            )
            .order_by(
                "-updated_at"
            )
        )

        # This serializes the chat sessions
        serializer = (
            ChatSessionSerializer(
                sessions,
                many=True
            )
        )

        # This returns the serialized chat sessions
        return Response(
            serializer.data
        )
    
class DeleteSessionView(APIView):

    # this makes sure only logged-in user can delete chat sessions
    permission_classes = [
        IsAuthenticated
    ]

    def delete(
        self,
        request,
        session_id
    ):

        # this retrieves a chat session for the logged-in user and the company. If it doesn't exist, return 404 error
        session = (
            get_object_or_404(
                ChatSession,
                id=session_id,
                customer=request.user
            )
        )

        # this deletes the chat session
        session.delete()

        # this returns a response indicating that the session was deleted
        return Response({
            "message":
            "Session deleted"
        })
    
class ChatMessageFeedbackView(APIView):

    # this makes sure only logged-in user can give feedback on chat messages
    permission_classes = [
        IsAuthenticated
    ]

    # this allows user to give feedback on chat messages.
    def post(self, request, message_id):

        # this retrieves a chat message for the logged-in user and the company. If it doesn't exist, return 404 error
        message = get_object_or_404(
            ChatMessage,
            id=message_id,
            session__customer=request.user
        )

        # this gets the feedback from the request
        feedback = request.data.get("feedback")

        # this gets the missing data from the frontend. If frontend doesn't send this , false is used as default
        feedback_missing_data = request.data.get("feedback_missing_data", False)

        # this checks if the feedback is valid
        if feedback not in ["helpful", "unhelpful"]:
            return Response(
                {"error": "Invalid feedback. Must be 'helpful' or 'unhelpful'."},
                status=400
            )

        # this saves the feedback
        message.feedback = feedback
        
        # this saves missing data boolean value
        message.feedback_missing_data = bool(feedback_missing_data)
        
        # this checks if the feedback is unhelpful and if the missing data is true
        if feedback == "unhelpful" and message.feedback_missing_data:
            
            # this gets the user message from the chat session
            user_msg = ChatMessage.objects.filter(
                session=message.session,
                role="USER",
                created_at__lt=message.created_at
            ).order_by("-created_at").first()
            
            # this summarizes the missing data
            if user_msg:
                # pyrefly: ignore [missing-import]
                from apps.rag.services.ollama_service import OllamaService
                message.missing_data_summary = OllamaService.summarize_missing_data(user_msg.content)
            else:
                
                # this sets the missing data summary to a default message
                message.missing_data_summary = "Customer query missing information"

        # this updates the chat message with the feedback
        message.save(update_fields=["feedback", "feedback_missing_data", "missing_data_summary"])

        # this returns a response indicating that the feedback was updated successfully along with the updated feedback data
        return Response({
            "message": "Feedback updated successfully.",
            "feedback": message.feedback,
            "feedback_missing_data": message.feedback_missing_data,
            "missing_data_summary": message.missing_data_summary
        })
