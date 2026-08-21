# NumPy is used here to convert the question embedding into a numerical array in the format expected by FAISS.
import numpy as np

# This imports the database model containing your stored chunks.
from ...documents.models import DocumentChunk 

# This service converts text into vector embeddings (vectors).
from .embedding_service import EmbeddingService 

# This is used to search the FAISS index for the most relevant chunks.
from .faiss_service import FAISSService

# Retrieves the most relevant document chunks from the FAISS index based on the question embedding.
class RetrievalService:

    # This method retrieves the top k most relevant document chunks for a given question.
    @staticmethod
    def retrieve_chunks(
        company_id,
        question,
        top_k=5
    ):

        # this converts the user's question into a vector embedding using the EmbeddingService.
        embedding = (
            EmbeddingService
            .generate_embedding(
                question
            )
        )

        # this converts the embedding into a numpy array in the format expected by FAISS.
        query_vector = np.array(
            [embedding]
        ).astype(
            "float32" # converts the values to 32-bit floating point numbers because FAISS commonly expects vectors in float32 format.
        )

        # Normalize query vector for Cosine Similarity (Inner Product)
        import faiss
        faiss.normalize_L2(query_vector)

        # this searches the FAISS index for the most relevant chunks.
        chunk_positions = (
            FAISSService.search(
                company_id,
                query_vector,
                top_k
            )
        )

        # this retrieves the document chunks from the database using the chunk positions. 
        # the chunks are ordered by faiss_id to ensure that the chunks are retrieved in the correct order.
        chunks = list(
            DocumentChunk.objects.filter(
                document__company_id=company_id
            )
            .order_by("faiss_id")
        )

        results = [] # used to store the most relevant document chunks.

        # iterate through the chunk positions.
        for position in chunk_positions:

            # this checks if the chunk position is valid.
            if (
                position >= 0
                and position < len(chunks)
            ):
                results.append(
                    chunks[position]
                )
        
        return results

    # This method takes the retrieved chunks and turns them into one text block.
    # this method builds the context for the question by joining the chunk texts.
    @staticmethod
    def build_context(
        chunks
    ):

        # used to join the chunk texts.
        return "\n\n".join(

            chunk.chunk_text

            for chunk in chunks
        )

        