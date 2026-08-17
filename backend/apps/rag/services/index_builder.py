# pyrefly: ignore [missing-import]
# This line imports the DocumentChunk model from the documents app.
from apps.documents.models import (
    DocumentChunk
)

# This imports the VectorStoreService from the rag app.
from .vector_store_service import (
    VectorStoreService
)

# This defines a class that is used to build the FAISS index.
class IndexBuilder:

    @staticmethod
    def build_document_index(
        document
    ):
        IndexBuilder.rebuild_company_index(document.company.id)

    @staticmethod
    def rebuild_company_index(
        company_id
    ):
        from .faiss_service import FAISSService

        # Create/reset the FAISS index file for this company
        FAISSService.create_index(company_id)

        # Retrieve all chunks belonging to this company, ordered by faiss_id
        chunks = (
            DocumentChunk.objects
            .filter(
                document__company_id=company_id
            )
            .order_by(
                "faiss_id"
            )
        )

        # Re-embed and store all chunks in the newly initialized index
        for chunk in chunks:

            VectorStoreService.store_chunk(
                company_id,
                chunk
            )