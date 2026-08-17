# That is the database table where your conversations' individual messages are stored.
from .models import (
    ChatMessage
)

class ChatHistoryService:

    @staticmethod
    # This method saves the user message in the database.
    def save_user_message(
        session,
        content
    ):

        return (
            ChatMessage.objects.create(
                session=session,
                role="USER",
                content=content
            )
        )
    
    # This method saves the AI Assistant message in the database.
    @staticmethod
    def save_assistant_message(
        session,
        content
    ):

        return (
            ChatMessage.objects.create(
                session=session,
                role="ASSISTANT",
                content=content
            )
        )