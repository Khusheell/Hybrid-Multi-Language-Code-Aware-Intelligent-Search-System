from sklearn.metrics.pairwise import cosine_similarity
import os

def search_query(query, vectorizer, matrix, parsed_docs, top_k=5):

    query_words = query.lower().split()

    query_vec = vectorizer.transform([query])
    scores = cosine_similarity(query_vec, matrix).flatten()

    ranked_results = []

    for idx, base_score in enumerate(scores):

        file_path = parsed_docs[idx]["file_path"]
        filename = os.path.basename(file_path).lower()
        text = parsed_docs[idx]["text"].lower()

        final_score = float(base_score)
        reasons = []

        match_count = 0

        for word in query_words:

            # exact filename boost
            if word in filename:
                final_score += 0.20
                reasons.append(f"Filename match: {word}")
                match_count += 1

            # text match
            elif word in text:
                final_score += 0.08
                reasons.append(f"Matched keyword: {word}")
                match_count += 1

        # multi-keyword boost
        if match_count >= 2:
            final_score += 0.15
            reasons.append("Multiple query terms matched")

        # controller boost
        if "controller" in filename:
            final_score += 0.12
            reasons.append("Controller filename boost")

        # production code boost
        if "src\\main" in file_path.lower() or "src/main" in file_path.lower():
            final_score += 0.05
            reasons.append("Production code boost")

        # test penalty
        if "test" in file_path.lower():
            final_score -= 0.12
            reasons.append("Test file penalty")

        ranked_results.append({
            "file": file_path,
            "score": round(final_score, 4),
            "text": parsed_docs[idx]["text"],
            "reasons": reasons
        })

    ranked_results.sort(key=lambda x: x["score"], reverse=True)

    return ranked_results[:top_k]