from rest_framework import serializers
from .models import Company

class CompanySerializer(serializers.ModelSerializer):

    has_kb = serializers.SerializerMethodField()

    class Meta:
        model = Company

        fields = [
            "id",
            "name",
            "category",
            "description",
            "logo",
            "created_at",
            "has_kb"
        ]

        read_only_fields = [ # read only fields cannot be modified by the user. They are auto generated .
            "id",
            "created_at"
        ]

    def get_has_kb(self, obj):
        
        # pyrefly: ignore [missing-import]
        from apps.documents.models import DocumentChunk
        return DocumentChunk.objects.filter(document__company=obj).exists()

class CompanyLogoSerializer(serializers.ModelSerializer):

    class Meta:
        model = Company

        fields = ["logo"]