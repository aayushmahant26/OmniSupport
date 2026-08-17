from django.urls import path

from .views import (
    CreateCompanyView,
    MyCompanyView,
    CompanyListView,
    CompanyDetailView,
    CompanyByCategoryView,
    CompanyLogoUploadView,
    UpdateCompanyView,
    FavoriteCompanyView,
    CompanyAnalyticsView,
    CompanyAnalyticsReportView
)

urlpatterns = [

    path(
        "analytics/report/",
        CompanyAnalyticsReportView.as_view(),
        name="company-analytics-report"
    ),

    path(
        "analytics/",
        CompanyAnalyticsView.as_view(),
        name="company-analytics"
    ),

    path(
        "favorites/",
        FavoriteCompanyView.as_view(),
        name="company-favorites"
    ),

    path(
        "",
        CompanyListView.as_view(),
        name="company-list"
    ),

    path(
        "create/",
        CreateCompanyView.as_view(),
        name="company-create"
    ),

    path(
        "me/",
        MyCompanyView.as_view(),
        name="my-company"
    ),

    path(
        "<uuid:pk>/",
        CompanyDetailView.as_view(),
        name="company-detail"
    ),

    path(
        "category/<str:category>/",
        CompanyByCategoryView.as_view(),
        name="company-category"
    ),

    path(
         "logo/",
        CompanyLogoUploadView.as_view(),
        name="company-logo"
    ),

    path(
        "update/",
        UpdateCompanyView.as_view(),
        name="company-update"
    ),
]