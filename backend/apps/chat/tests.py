from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from apps.companies.models import Company
from apps.chat.models import ChatSession, ChatMessage
from apps.documents.models import Document, DocumentChunk

User = get_user_model()


class ChatSecurityAndFeedbackTests(TestCase):

    def setUp(self):
        self.client = APIClient()

        # Create company user and company
        self.company_user = User.objects.create_user(
            email="company@test.com",
            password="password123",
            role="company"
        )
        self.company = Company.objects.create(
            owner=self.company_user,
            name="Test Corp",
            category="SAAS",
            description="Test Description"
        )

        # Create customer user
        self.customer = User.objects.create_user(
            email="customer@test.com",
            password="password123",
            role="customer"
        )

        # Create unauthorized user (attacker)
        self.attacker = User.objects.create_user(
            email="attacker@test.com",
            password="password123",
            role="customer"
        )

        # Create dummy document and chunk so session can be initialized
        self.doc = Document.objects.create(
            company=self.company,
            title="Test Policy",
            file="documents/test.txt"
        )
        self.chunk = DocumentChunk.objects.create(
            document=self.doc,
            chunk_text="Test policy content for customer support.",
            chunk_index=0,
            faiss_id=1
        )

    def test_session_creation_by_customer(self):
        self.client.force_authenticate(user=self.customer)
        response = self.client.post(f"/api/chat/session/{self.company.id}/")
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(ChatSession.objects.filter(customer=self.customer).count(), 1)

    def test_unauthorized_user_cannot_access_chat_session(self):
        # Create session belonging to customer
        session = ChatSession.objects.create(
            customer=self.customer,
            company=self.company
        )

        # Attacker tries to send message into customer's session
        self.client.force_authenticate(user=self.attacker)
        response = self.client.post(
            f"/api/rag/chat/{self.company.id}/{session.id}/",
            {"question": "Can I read this chat?"},
            format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)

    def test_feedback_resets_missing_data_summary_when_helpful(self):
        session = ChatSession.objects.create(
            customer=self.customer,
            company=self.company
        )
        assistant_msg = ChatMessage.objects.create(
            session=session,
            role="ASSISTANT",
            content="Support response.",
            feedback="unhelpful",
            feedback_missing_data=True,
            missing_data_summary="Missing policy details"
        )

        self.client.force_authenticate(user=self.customer)
        # Update feedback to helpful
        response = self.client.post(
            f"/api/chat/message/{assistant_msg.id}/feedback/",
            {"feedback": "helpful", "feedback_missing_data": False},
            format="json"
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        assistant_msg.refresh_from_db()
        self.assertEqual(assistant_msg.feedback, "helpful")
        self.assertFalse(assistant_msg.feedback_missing_data)
        self.assertIsNone(assistant_msg.missing_data_summary)
