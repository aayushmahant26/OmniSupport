# This is a custom user model . 
# Insted of using django's default user model ( username , password , etc)
# we have created our own model so user can log in using email and can have either a company role or customer role 

from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser, # used for password hashing 
    PermissionsMixin, # support for superuser , groups and permissions 
    BaseUserManager # used to create users 
)
import uuid

class UserManager(BaseUserManager):

    def create_user(self, email, password=None, **extra_fields):

        if not email:
            raise ValueError("Email is required")

        email = self.normalize_email(email)

        user = self.model(
            email=email,
            **extra_fields
        )

        user.set_password(password)  # Hashes the password using PBKDF2 Algo . 
        user.save(using=self._db) # saves password in DB

        return user

    def create_superuser(self, email, password=None, **extra_fields):

        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        return self.create_user(
            email,
            password,
            **extra_fields
        )
    
class User(AbstractBaseUser, PermissionsMixin):

    ROLE_CHOICES = (
        ("company", "Company"),
        ("customer", "Customer"),
    )

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

    email = models.EmailField(
        unique=True
    )

    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES
    )

    is_active = models.BooleanField(
        default=True
    )

    is_staff = models.BooleanField(
        default=False
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    objects = UserManager()

    USERNAME_FIELD = "email"

    REQUIRED_FIELDS = []

    def __str__(self):
        return self.email