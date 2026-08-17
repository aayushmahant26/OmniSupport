# pyrefly: ignore [missing-import]
from apps.documents.models import DocumentChunk


class ChunkStorageService:

    @staticmethod
    def save_chunks(document, chunks): # this method is called to save the chunks in the database

        # delete existing chunks
        # filter documents by faiss_id and order them by faiss_id in descending order
        DocumentChunk.objects.filter(
            document=document
        ).delete()

        # exclude chunks with no faiss_id and get the last chunk
        last_chunk = (
            DocumentChunk.objects
            .exclude(faiss_id=None)
            .order_by("-faiss_id")
            .first()
        )

        next_faiss_id = 1

        # get the last chunk
        if last_chunk:
            next_faiss_id = (
                last_chunk.faiss_id + 1
            )

        # save the chunks in the database
        for index, chunk in enumerate(chunks):

            DocumentChunk.objects.create(
                document=document,
                chunk_text=chunk,
                chunk_index=index,
                faiss_id=next_faiss_id
            )

            next_faiss_id += 1