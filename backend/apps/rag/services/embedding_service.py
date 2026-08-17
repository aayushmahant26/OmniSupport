class EmbeddingService:
    _model = None # for laze loading. Model is loaded only once , then used again and again without loading repeatedly.

    @classmethod
    def get_model(cls):
        if cls._model is None:

            # This library provides pretrained models specifically designed to convert text into meaningful vector representations.
            from sentence_transformers import SentenceTransformer

            # this loads the pre-trained "all-MiniLM-L6-v2" model from huggingface.
            cls._model = SentenceTransformer("all-MiniLM-L6-v2")
        
        # returns the model.
        return cls._model

    # this generates an embedding for a given text.
    @classmethod
    def generate_embedding(
        cls,
        text
    ):

        # this gets the model.
        model = cls.get_model()

        # this converts the text into a vector embedding using the model.
        embedding = model.encode(
            text,
            convert_to_numpy=True # This tells Sentence Transformers to return the embedding as a numpy array
        )

        # returns the embedding.
        return embedding
