import uuid

from django.db import models

# pyre-ignore [missing-import]
from apps.accounts.models import User
# pyre-ignore [missing-import]
from apps.companies.models import Company

class ChatSession(models.Model):

    # This give unique ID for every chat session
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

    # This represent the customer who is chatting with the AI helper
    customer = models.ForeignKey( # This builts one-to-many relationship. One user can have multiple chat sessions
        User,
        on_delete=models.CASCADE,
        related_name="chat_sessions"
    )

    # This represent the company to which the AI helper belongs
    company = models.ForeignKey( # This builts one-to-many relationship. One company can have multiple chat sessions
        Company,
        on_delete=models.CASCADE,
        related_name="chat_sessions"
    )

    # This will store the topic of the chat
    topic = models.CharField(
        max_length=100,
        default="General Query"
    )

    # This will store the timestamp of when the chat session was created
    created_at = models.DateTimeField(
        auto_now_add=True
    )

    # This will store the timestamp of when the chat session was last updated
    updated_at = models.DateTimeField(
        auto_now=True
    )

    def __str__(self):
        return f"{self.customer.email} - {self.company.name}"
    
class ChatMessage(models.Model):

    # This represent the role of the sender.
    ROLE_CHOICES = [

        ("USER", "User"),

        ("ASSISTANT", "Assistant")
    ]

    # This give unique ID for every chat message
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

    # This represent the chat session to which the chat message belongs. 
    session = models.ForeignKey( # This builts one-to-many relationship. One chat session can have multiple chat messages
        ChatSession,
        on_delete=models.CASCADE,
        related_name="messages"
    )

    # This represent the role of the sender.
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES
    )

    # This will store the content of the chat message
    content = models.TextField()

    # This will store the feedback of the chat message
    feedback = models.CharField(
        max_length=20,
        choices=[("helpful", "Helpful"), ("unhelpful", "Unhelpful")],
        null=True,
        blank=True
    )

    # This will store whether the chat message contains missing data
    feedback_missing_data = models.BooleanField(
        default=False
    )

    # This will store the summary of the missing data
    missing_data_summary = models.CharField(
        max_length=255,
        blank=True,
        null=True
    )

    # This will store the timestamp of when the chat message was created
    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return f"{self.role}"