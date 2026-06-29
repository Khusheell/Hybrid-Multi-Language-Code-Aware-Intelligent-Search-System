from sentence_transformers import SentenceTransformer, util

# -----------------------------------
# LOAD MODEL ONCE
# -----------------------------------
model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")


# -----------------------------------
# NORMALIZE STRUCTURAL SCORE
# -----------------------------------
def normalize_structural(score, max_score):
    if max_score <= 0:
        return 0.0
    return score / max_score


# -----------------------------------
# WEIGHTED FUSION RERANKER
# -----------------------------------
def semantic_rerank(query, ranked_results, top_k=10,
                    structural_weight=0.80,
                    semantic_weight=0.20):

    if not ranked_results:
        return []

    # use top candidates only for speed
    candidates = ranked_results[:25]

    texts = []

    for r in candidates:
        text = f"{r['title']} {r['code'][:600]}"
        texts.append(text)

    # embeddings
    query_emb = model.encode(query, convert_to_tensor=True)
    doc_embs = model.encode(texts, convert_to_tensor=True)

    sims = util.cos_sim(query_emb, doc_embs)[0]

    max_struct = max(r["score"] for r in candidates)

    fused = []

    for i, r in enumerate(candidates):

        semantic_score = float(sims[i])   # usually -1 to +1
        semantic_norm = (semantic_score + 1) / 2   # convert to 0..1

        structural_norm = normalize_structural(r["score"], max_struct)

        final_score = (
            structural_norm * structural_weight +
            semantic_norm * semantic_weight
        ) * 100

        item = dict(r)
        item["semantic_score"] = round(semantic_score, 4)
        item["final_score"] = round(final_score, 2)

        fused.append(item)

    fused.sort(key=lambda x: x["final_score"], reverse=True)

    return fused[:top_k]