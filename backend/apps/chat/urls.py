from django.urls import path

from .views import (
    CreateSessionView,
    SessionDetailView,
    SessionListView,
    DeleteSessionView,
    ChatMessageFeedbackView
)

urlpatterns = [

    path(

        "session/<uuid:company_id>/",

        CreateSessionView.as_view(),

        name="create-session"
    ),

    path(
        "session-detail/<uuid:session_id>/",
        SessionDetailView.as_view(),
        name="session-detail"
    ),

    path(
        "sessions/",
        SessionListView.as_view(),
        name="session-list"
    ),

    path(
        "session-delete/<uuid:session_id>/",
        DeleteSessionView.as_view(),
        name="session-delete"
    ),

    path(
        "message/<uuid:message_id>/feedback/",
        ChatMessageFeedbackView.as_view(),
        name="message-feedback"
    ),
]