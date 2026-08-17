from .pdf_parser import PDFParser
from .text_splitter import TextSplitter
from .chunk_storage import ChunkStorageService
from .index_builder import IndexBuilder

class DocumentProcessor:

    @staticmethod # It means the method belongs to the class but does not need an object.
    def process_document(document): # this method is called when a document is uploaded

        # extract the file path of the uploaded document
        file_path = document.file.path

        # call the PDF parser to extract text from the uploaded PDF document
        if file_path.lower().endswith('.pdf'):
            text = PDFParser.extract_text(file_path)

        # Read the text from the uploaded document if it is not a PDF
        else:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                text = f.read()

        # call the text splitter to split the extracted text into chunks
        chunks = TextSplitter.split_text(text)

        # save the chunks in the database
        ChunkStorageService.save_chunks(
            document,
            chunks
        )

        # build the FAISS index for the document
        IndexBuilder.build_document_index(document)

        return len(chunks)