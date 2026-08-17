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

        # Document needs a company
        # Frontend doesn't send company ID.
        # Backend figures it out from the logged-in user.
        company = Company.objects.get(
            owner=self.request.user
        )

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

        # Document needs a company
        # Frontend doesn't send company ID.
        # Backend figures it out from the logged-in user.
        company = Company.objects.get(
            owner=self.request.user
        )

        # Get all documents for this company
        return Document.objects.filter(
            company=company
        )

class DeleteDocumentView(generics.DestroyAPIView): # DestroyAPIView means DELETE request

    serializer_class = DocumentSerializer
    permission_classes = [IsAuthenticated]

    # This method returns only documents belonging to the logged-in company.
    # That means a company cannot delete another company's document,
    # because DRF will only look for the object inside this filtered queryset.
    def get_queryset(self): 

        company = Company.objects.get(
            owner=self.request.user
        )

        # Get all documents for this company
        return Document.objects.filter(
            company=company
        )

    def perform_destroy(self, instance): # this method is called when a DELETE request is made

        company_id = instance.company.id
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