import time
import math

from search.snippet_ranker import rank_snippets
from embeddings.semantic_model import semantic_rerank


def is_relevant(result, relevant_titles):
    title = result["title"].lower()
    for rel in relevant_titles:
        if rel.lower() in title:
            return True
    return False


def dcg(relevances):
    score = 0
    for i, rel in enumerate(relevances, start=1):
        score += rel / math.log2(i + 1)
    return score


def evaluate(snippet_db, benchmark_queries):
    total_precision = 0
    total_recall = 0
    total_mrr = 0
    total_ndcg = 0

    top1_hits = 0
    top5_hits = 0

    total_latency = 0

    structural_wins = 0
    hybrid_wins = 0
    ties = 0

    n = len(benchmark_queries)

    print("\nRunning Evaluation...\n")

    for item in benchmark_queries:
        query = item["query"]
        relevant = item["relevant"]

        start = time.time()

        _, structural = rank_snippets(
            query=query,
            snippet_db=snippet_db,
            top_k=25
        )

        structural_copy = [dict(x) for x in structural]

        hybrid = semantic_rerank(
            query=query,
            ranked_results=structural_copy,
            top_k=5
        )

        latency = time.time() - start
        total_latency += latency

        top5 = hybrid[:5]

        matched_relevant = set()
        rel_flags = []

        for r in top5:
            hit = False

            for rel in relevant:
                if rel.lower() in r["title"].lower():
                    matched_relevant.add(rel.lower())
                    hit = True
                    break

            rel_flags.append(1 if hit else 0)

        retrieved_relevant = len(matched_relevant)
        total_relevant = len(relevant)

        precision = sum(rel_flags) / 5
        total_precision += precision

        recall = retrieved_relevant / total_relevant if total_relevant else 0
        recall = min(recall, 1.0)
        total_recall += recall

        rr = 0
        for idx, r in enumerate(hybrid, start=1):
            if is_relevant(r, relevant):
                rr = 1 / idx
                break

        total_mrr += rr

        actual_dcg = dcg(rel_flags)
        ideal = sorted(rel_flags, reverse=True)
        ideal_dcg = dcg(ideal)

        ndcg = actual_dcg / ideal_dcg if ideal_dcg > 0 else 0
        total_ndcg += ndcg

        if hybrid and is_relevant(hybrid[0], relevant):
            top1_hits += 1

        if any(is_relevant(r, relevant) for r in top5):
            top5_hits += 1

        structural_rank = 999
        hybrid_rank = 999

        for i, r in enumerate(structural[:5], start=1):
            if is_relevant(r, relevant):
                structural_rank = i
                break

        for i, r in enumerate(hybrid[:5], start=1):
            if is_relevant(r, relevant):
                hybrid_rank = i
                break

        if hybrid_rank < structural_rank:
            hybrid_wins += 1
        elif structural_rank < hybrid_rank:
            structural_wins += 1
        else:
            ties += 1

        print(f"Query: {query}")
        print(f" Precision@5 = {precision:.2f}")
        print(f" Recall@5    = {recall:.2f}")
        print(f" MRR         = {rr:.2f}")
        print(f" NDCG@5      = {ndcg:.2f}")
        print(f" Latency     = {latency:.3f} sec")
        print("-" * 50)

    avg_precision = total_precision / n
    avg_recall = total_recall / n
    avg_mrr = total_mrr / n
    avg_ndcg = total_ndcg / n
    avg_top1 = top1_hits / n
    avg_top5 = top5_hits / n
    avg_latency = total_latency / n

    hybrid_gain = ((hybrid_wins - structural_wins) / n) * 100

    print("\n========== FINAL METRICS ==========\n")
    print(f"Precision@5     : {avg_precision:.3f}")
    print(f"Recall@5        : {avg_recall:.3f}")
    print(f"MRR             : {avg_mrr:.3f}")
    print(f"NDCG@5          : {avg_ndcg:.3f}")
    print(f"Top-1 Hit Rate  : {avg_top1:.3f}")
    print(f"Top-5 Hit Rate  : {avg_top5:.3f}")
    print(f"Avg Latency     : {avg_latency:.3f} sec")
    print(f"Hybrid Gain %   : {hybrid_gain:.1f}%")

    print("\nWins:")
    print(" Hybrid Better     :", hybrid_wins)
    print(" Structural Better :", structural_wins)
    print(" Tie               :", ties)

    return {
        "precision_at_5": round(avg_precision, 3),
        "recall_at_5": round(avg_recall, 3),
        "mrr": round(avg_mrr, 3),
        "ndcg_at_5": round(avg_ndcg, 3),
        "top1_hit_rate": round(avg_top1, 3),
        "top5_hit_rate": round(avg_top5, 3),
        "avg_latency_ms": round(avg_latency * 1000),
        "hybrid_gain_pct": round(hybrid_gain, 1),
        "hybrid_wins": hybrid_wins,
        "structural_wins": structural_wins,
        "ties": ties
    }