from rest_framework import serializers

from .models import (
    ChatSession,
    ChatMessage
)

class ChatMessageSerializer(
    serializers.ModelSerializer
):

    class Meta: # This is a configuration class for the serializer

        model = ChatMessage # This represent the model to be serialized

        # This represent the fields that will be serialized and returned to frontend
        fields = [
            "id",
            "role",
            "content",
            "feedback",
            "feedback_missing_data",
            "missing_data_summary",
            "created_at"
        ]

class ChatSessionSerializer(
    serializers.ModelSerializer
):

    # This will serialize the messages in the chat session
    messages = (
        ChatMessageSerializer(
            many=True,  # This mean that the serializer will serialize multiple messages
            read_only=True  # This mean that the serializer will only serialize the messages, not create or update them
        )
    )

    class Meta: # This is a configuration class for the serializer

        model = ChatSession # This represent the model to be serialized

        # This represent the fields that will be serialized and returned to frontend
        fields = [
            "id",
            "company",
            "topic",
            "created_at",
            "updated_at",
            "messages"
        ]
        