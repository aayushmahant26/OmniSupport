from django.urls import path

from .views import (
    RetrievalTestView,
    CompanyChatView,
    CompanyComparisonView
)

urlpatterns = [
    path(
        "test/",
        RetrievalTestView.as_view()
    ),

    path(
        "chat/<uuid:company_id>/<uuid:session_id>/",
        CompanyChatView.as_view(),
        name="company-chat"
    ),
    path(
        "compare/",
        CompanyComparisonView.as_view(),
        name="company-compare"
),
]


    
