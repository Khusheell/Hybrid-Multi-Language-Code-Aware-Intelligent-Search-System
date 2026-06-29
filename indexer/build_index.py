from sklearn.feature_extraction.text import TfidfVectorizer

def build_search_index(parsed_docs):
    """
    parsed_docs = list of dicts:
    {
        file_path,
        text
    }
    """

    corpus = [doc["text"] for doc in parsed_docs]

    vectorizer = TfidfVectorizer(stop_words="english")
    matrix = vectorizer.fit_transform(corpus)

    return vectorizer, matrix