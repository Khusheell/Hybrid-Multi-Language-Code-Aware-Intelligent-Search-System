# snippets/extractor.py

def detect_language(file_path):

    file_path = file_path.lower()

    if file_path.endswith(".py"):
        return "Python"

    elif file_path.endswith(".java"):
        return "Java"

    elif file_path.endswith((".cpp", ".cc", ".cxx", ".h", ".hpp")):
        return "C++"

    return "Unknown"


def build_snippets(parsed_docs):

    snippet_db = []

    for doc in parsed_docs:

        file_path = doc["file_path"]
        language = detect_language(file_path)

        for snip in doc.get("snippets", []):

            snippet_db.append({
                "file_path": file_path,
                "language": language,
                "type": snip["type"],
                "title": snip["title"],
                "code": snip["code"],
                "start": snip["start"],
                "end": snip["end"]
            })

        # fallback if snippets empty
        if not doc.get("snippets"):

            for cls in doc.get("classes", []):
                snippet_db.append({
                    "file_path": file_path,
                    "language": language,
                    "type": "class",
                    "title": cls,
                    "code": cls,
                    "start": 0,
                    "end": 0
                })

            for fn in doc.get("functions", []):
                snippet_db.append({
                    "file_path": file_path,
                    "language": language,
                    "type": "function",
                    "title": fn,
                    "code": fn,
                    "start": 0,
                    "end": 0
                })

    return snippet_db