from django.db import models
import uuid

# pyrefly: ignore [missing-import]
from apps.companies.models import Company


class Document(models.Model):

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

    company = models.ForeignKey( # this creates one-to-many relationship . One company can upload many documents
        Company,
        on_delete=models.CASCADE,
        related_name="documents"
    )

    # Stores the document name
    title = models.CharField(
        max_length=255
    )

    # stores the path of uploaded file , and upload the actual document in media/documents/
    file = models.FileField(
        upload_to="documents/"
    )

    # automatically set the time when the document is uploaded
    uploaded_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.title
    
class DocumentChunk(models.Model):

    id = models.UUIDField(
        primary_key=True,
        default=uuid.uuid4,
        editable=False
    )

    document = models.ForeignKey( # this creates one-to-many relationship . One document can have multiple chunks
        Document,
        on_delete=models.CASCADE,
        related_name="chunks"
    )

    # stores the text of the chunk
    chunk_text = models.TextField()

    # stores the chunk index
    chunk_index = models.IntegerField()

    # stores the id of the chunk in the faiss index
    faiss_id = models.BigIntegerField(
        unique=True,
        null=True,
        blank=True
    )

    def __str__(self):
        return f"{self.document.title} - Chunk {self.chunk_index}"