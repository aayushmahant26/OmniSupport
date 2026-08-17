from django.db import models
from django.conf import settings
import uuid

class Company(models.Model):

    CATEGORY_CHOICES = (
        ("ECOMMERCE", "Ecommerce"),
        ("FINANCE", "Finance"),
        ("BANKING", "Banking"),
        ("INSURANCE", "Insurance"),
        ("EDUCATION", "Education"),
        ("EDTECH", "EdTech"),
        ("HEALTHCARE", "Healthcare"),
        ("HOSPITAL", "Hospital"),
        ("PHARMACY", "Pharmacy"),
        ("FOOD_DELIVERY", "Food Delivery"),
        ("RESTAURANT", "Restaurant"),
        ("TRAVEL", "Travel"),
        ("HOTEL", "Hotel"),
        ("AIRLINE", "Airline"),
        ("LOGISTICS", "Logistics"),
        ("SHIPPING", "Shipping"),
        ("TELECOM", "Telecom"),
        ("SOFTWARE", "Software"),
        ("SAAS", "SaaS"),
        ("IT_SERVICES", "IT Services"),
        ("CYBERSECURITY", "Cybersecurity"),
        ("REAL_ESTATE", "Real Estate"),
        ("AUTOMOBILE", "Automobile"),
        ("MEDIA", "Media"),
        ("ENTERTAINMENT", "Entertainment"),
        ("STREAMING", "Streaming"),
        ("GAMING", "Gaming"),
        ("MANUFACTURING", "Manufacturing"),
        ("RETAIL", "Retail"),
        ("FITNESS", "Fitness"),
        ("SPORTS", "Sports"),
        ("NGO", "NGO"),
        ("GOVERNMENT", "Government"),
        ("LEGAL", "Legal"),
        ("CONSULTING", "Consulting"),
        ("RECRUITMENT", "Recruitment"),
        ("MARKETING", "Marketing"),
    )

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

    owner = models.OneToOneField( # one user can only own one company
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="company"
    )

    name = models.CharField(
        max_length=255
    )

    category = models.CharField(
        max_length=50,
        choices=CATEGORY_CHOICES
    )

    description = models.TextField()

    logo = models.ImageField(
        upload_to="company_logos/",
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.name


class FavoriteCompanyCategory(models.Model):
    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )
    user = models.ForeignKey( # Many favorite records can belong to one user.
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="favorite_categories"
    )
    category = models.CharField(
        max_length=50
    )
    company = models.ForeignKey( # Many users can favorite the same company.
        Company,
        on_delete=models.CASCADE,
        related_name="favorites"
    )

    class Meta:
        unique_together = ("user", "category") # A user can have only one favorite company per category.

    def __str__(self):
        return f"{self.user.email} - {self.category}: {self.company.name}"
