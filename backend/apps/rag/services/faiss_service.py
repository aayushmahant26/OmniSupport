# faiss is a library designed for efficiently searching large collections of vectors.
import faiss

# It makes working with file and directory paths easier and more platform-independent than manually concatenating strings.
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parents[3] # This resolves the absolute path to the directory containing the current file.

FAISS_DIR = BASE_DIR / "faiss_indexes" # This creates a path to the faiss_indexes directory.

FAISS_DIR.mkdir(exist_ok=True) # This creates the faiss_indexes directory if it doesn't exist.


class FAISSService:

    DIMENSION = 384 # we used 384 dimensions because our embedding model (all-MiniLM-L6-v2) outputs 384 values (dimensions) for each text.

    # This is a class method that creates a new FAISS index for a specific company.
    @classmethod
    def create_index(
        cls,
        company_id
    ):

        # This creates a new FAISS index using IndexFlatIP.
        # IndexFlatIP is a simple FAISS index that stores all vectors and performs an exhaustive inner product search.
        index = faiss.IndexFlatIP(
            cls.DIMENSION
        )

        # This creates a file path for the index.
        path = (
            FAISS_DIR /
            f"{company_id}.index"
        )

        # this saves the FAISS index to the specified file path.
        faiss.write_index(
            index,
            str(path)
        )

        # This returns the created index.
        return index

    # This is a class method that loads an existing FAISS index for a specific company.
    # If no index exists, it creates a new one.
    @classmethod
    def load_index(
        cls,
        company_id
    ):

        path = (
            FAISS_DIR /
            f"{company_id}.index"
        )

        # This checks if the index file exists.
        if not path.exists():

            # If it doesn't exist, it creates a new one.
            return cls.create_index(
                company_id
            )

        # This reads the existing index from disk.
        return faiss.read_index(
            str(path)
        )

    # This is a class method that saves a FAISS index to disk.
    @classmethod
    def save_index(
        cls,
        company_id,
        index
    ):

        # This determines where to save the index file.
        path = (
            FAISS_DIR /
            f"{company_id}.index"
        )

        # It serializes the FAISS index (converting it into a byte stream) 
        # and saves it to the file specified by 'path'.
        faiss.write_index(
            index,
            str(path)
        )

    # This is a class method that adds a new vector to the FAISS index.
    @classmethod
    def add_vector(
        cls,
        company_id,
        vector
    ):

        # This loads the existing index for the company, or creates a new one if it doesn't exist.
        index = cls.load_index(
            company_id
        )

        # This adds the new vector to the FAISS index.
        index.add(
            vector
        )

        # This saves the updated index back to disk.
        cls.save_index(
            company_id,
            index
        )

    # This is a class method that searches the FAISS index for the most relevant vectors.
    @classmethod
    def search(
        cls,
        company_id,
        query_vector,
        top_k=5
    ):

        # This loads the existing index for the company, or creates a new one if it doesn't exist.
        index = cls.load_index(
            company_id
        )

        # This searches the FAISS index for the most relevant vectors.
        distances, indices = index.search(
            query_vector,
            top_k
        )

        # This returns the indices of the most relevant vectors.
        return indices[0]