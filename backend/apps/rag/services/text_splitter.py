class TextSplitter:

    @staticmethod
    def split_text( # this method is called to split the extracted text into chunks
        text,
        chunk_size=1000, # every chunk will contain atmost 1000 characters (not words)
        overlap=200 # the overlap between consecutive chunks is 200 characters
    ):

        # list to store the chunks
        chunks = []

        # starting index of the chunk
        start = 0

        # loop through the text
        while start < len(text):

            # calculate the ending index of the chunk
            end = start + chunk_size

            # store the chunk in the list
            chunk = text[start:end]
            chunks.append(chunk)

            # update the starting index for the next chunk
            start += chunk_size - overlap

        # return the list of chunks
        return chunks