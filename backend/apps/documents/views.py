from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from rest_framework.parsers import MultiPartParser

# pyrefly: ignore [missing-import]
from apps.companies.models import Company

from .models import Document
from .serializers import DocumentSerializer

# pyrefly: ignore [missing-import]
from apps.rag.services.pdf_parser import PDFParser
# pyrefly: ignore [missing-import]
from apps.rag.services.text_splitter import TextSplitter
# pyrefly: ignore [missing-import]
from apps.rag.services.chunk_storage import ChunkStorageService
# pyrefly: ignore [missing-import]
from apps.rag.services.document_processor import DocumentProcessor

class DocumentUploadView(generics.CreateAPIView): # CreateAPIView means POST request

    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated] # Only logged in user can upload documents

    parser_classes = [MultiPartParser] # Allows file uploads

    def perform_create(self, serializer): # this method is called when a POST request is made

        if self.request.user.role != "company": # check if the user is a company
            raise PermissionDenied(
                "Only company users can upload documents."
            )

        try:
            company = Company.objects.get(
                owner=self.request.user
            )
        except Company.DoesNotExist:
            raise PermissionDenied(
                "Please create your company profile before uploading documents."
            )

        # File format and size validation
        uploaded_file = self.request.FILES.get("file")
        if uploaded_file:
            ext = uploaded_file.name.lower().split('.')[-1]
            if ext not in ['pdf', 'txt']:
                from rest_framework.exceptions import ValidationError
                raise ValidationError({"file": "Only PDF and TXT documents are supported."})
            if uploaded_file.size > 25 * 1024 * 1024:
                from rest_framework.exceptions import ValidationError
                raise ValidationError({"file": "File size exceeds the 25MB limit."})

        # save the document
        document = serializer.save(
            company=company # sets the foreign key automatically
        )

        # process the document
        DocumentProcessor.process_document(
            document
        )

class CompanyDocumentListView(generics.ListAPIView): # ListAPIView means GET request

    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated] # Only logged in user can list their documents

    def get_queryset(self): # this method is called when a GET request is made
        if self.request.user.role != "company":
            return Document.objects.none()

        try:
            company = Company.objects.get(
                owner=self.request.user
            )
            return Document.objects.filter(
                company=company
            )
        except Company.DoesNotExist:
            return Document.objects.none()

class DeleteDocumentView(generics.DestroyAPIView): # DestroyAPIView means DELETE request

    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self): 
        if self.request.user.role != "company":
            return Document.objects.none()

        try:
            company = Company.objects.get(
                owner=self.request.user
            )
            return Document.objects.filter(
                company=company
            )
        except Company.DoesNotExist:
            return Document.objects.none()

    def perform_destroy(self, instance): # this method is called when a DELETE request is made

        company_id = instance.company.id

        # Delete physical file from disk to avoid orphan uploads
        if instance.file:
            try:
                import os
                if os.path.isfile(instance.file.path):
                    os.remove(instance.file.path)
            except Exception:
                pass

        instance.delete()

        # pyrefly: ignore [missing-import]
        from apps.rag.services.index_builder import IndexBuilder

        # delete the document and chunks from the FAISS index
        IndexBuilder.rebuild_company_index(company_id)


# Public view to fetch all documents of a company (e.g., for AI agent)
class PublicCompanyDocumentListView(generics.ListAPIView):
    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        
        # Get company ID from URL parameter
        company_id = self.kwargs["company_id"]
        return Document.objects.filter(company_id=company_id)   