import os

WEIGHTS = {
    "filename": 25,
    "classes": 20,
    "functions": 18,
    "keywords": 15,
    "variables": 8,
    "metadata": 7,
    "comments": 7
}


def score_match(words, targets, max_score):
    score = 0
    hits = []

    joined = " ".join(targets).lower()

    for word in words:
        if word in joined:
            score += max_score / len(words)
            hits.append(word)

    return min(score, max_score), hits


def hierarchical_search(query, parsed_docs, top_k=5):

    words = query.lower().split()

    results = []

    for doc in parsed_docs:

        file_path = doc["file_path"]
        filename = os.path.basename(file_path).lower()

        scores = {}
        reasons = []

        # Filename
        f_score, hits = score_match(words, [filename], WEIGHTS["filename"])
        scores["filename"] = round(f_score, 2)
        if hits:
            reasons.append(f"Filename matched: {', '.join(hits)}")

        # Classes
        c_score, hits = score_match(words, doc["classes"], WEIGHTS["classes"])
        scores["classes"] = round(c_score, 2)
        if hits:
            reasons.append(f"Class matched: {', '.join(hits)}")

        # Functions
        fn_score, hits = score_match(words, doc["functions"], WEIGHTS["functions"])
        scores["functions"] = round(fn_score, 2)
        if hits:
            reasons.append(f"Function matched: {', '.join(hits)}")

        # Variables
        v_score, hits = score_match(words, doc["variables"], WEIGHTS["variables"])
        scores["variables"] = round(v_score, 2)
        if hits:
            reasons.append(f"Variable matched: {', '.join(hits)}")

        # Metadata/imports
        m_score, hits = score_match(words, doc["imports"], WEIGHTS["metadata"])
        scores["metadata"] = round(m_score, 2)
        if hits:
            reasons.append(f"Metadata matched: {', '.join(hits)}")

        # Comments
        com_score, hits = score_match(words, doc["comments"], WEIGHTS["comments"])
        scores["comments"] = round(com_score, 2)
        if hits:
            reasons.append(f"Comment matched: {', '.join(hits)}")

        # Keyword raw body
        raw_text = " ".join(
            doc["functions"] +
            doc["classes"] +
            doc["variables"] +
            doc["imports"] +
            doc["comments"]
        )

        k_score, hits = score_match(words, [raw_text], WEIGHTS["keywords"])
        scores["keywords"] = round(k_score, 2)
        if hits:
            reasons.append(f"Keyword matched: {', '.join(hits)}")

        overall = round(sum(scores.values()), 2)

        results.append({
            "file": file_path,
            "overall_score": overall,
            "scores": scores,
            "reasons": reasons
        })

    results.sort(
        key=lambda x: x["overall_score"],
        reverse=True
    )

    return results[:top_k]