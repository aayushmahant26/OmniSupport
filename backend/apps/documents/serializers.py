from rest_framework import serializers
from .models import Document

class DocumentSerializer(serializers.ModelSerializer):

    class Meta:
        model = Document

        # the fields that are allowed to be sent to the API
        fields = [
            "id",
            "title",
            "file",
            "uploaded_at"
        ]

        # this means that these fields will be set by the model and cannot be set by the user
        read_only_fields = [
            "id",
            "uploaded_at"
        ]