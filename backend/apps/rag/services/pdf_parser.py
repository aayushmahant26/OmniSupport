# pyrefly: ignore [missing-import]
import fitz # fitz is the Python module provided by the PyMuPDF library.

class PDFParser:

    @staticmethod
    def extract_text(pdf_path): # this method is called to extract text from a PDF document

        # open the PDF document
        document = fitz.open(pdf_path)

        # initialize an empty string to store the extracted text
        text = "" 

        # loop through each page in the PDF document
        for page in document:

            # extract text from the current page and append it to the text variable
            text += page.get_text()

        # close the PDF document
        document.close()

        # return the extracted text
        return text