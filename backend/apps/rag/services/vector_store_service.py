import numpy as np

from .embedding_service import (
    EmbeddingService
)

from .faiss_service import (
    FAISSService
)

class VectorStoreService:

    # This method takes a company ID and a document chunk and stores the chunk in the FAISS index.
    @staticmethod
    def store_chunk(
        company_id,
        chunk
    ):

        # This generates an embedding for the chunk text.
        embedding = (
            EmbeddingService
            .generate_embedding(
                chunk.chunk_text
            )
        )

        # This converts the embedding into a numpy array.
        vector = np.array(
            [embedding]
        ).astype(
            "float32"
        )

        # Normalize vector for Cosine Similarity (Inner Product)
        import faiss
        faiss.normalize_L2(vector)

        # This adds the vector to the FAISS index.
        FAISSService.add_vector(
            company_id,
            vector
        )