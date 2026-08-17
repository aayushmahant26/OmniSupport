from django.urls import path

from .views import (
    DocumentUploadView,
    CompanyDocumentListView,
    DeleteDocumentView,
    PublicCompanyDocumentListView
)

urlpatterns = [

    path(
        "upload/",
        DocumentUploadView.as_view(),
        name="document-upload"
    ),

    path(
        "",
        CompanyDocumentListView.as_view(),
        name="document-list"
    ),

    path(
        "company/<uuid:company_id>/",
        PublicCompanyDocumentListView.as_view(),
        name="public-document-list"
    ),

    path(
        "<uuid:pk>/",
        DeleteDocumentView.as_view(),
        name="document-delete"
    ),
]