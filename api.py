# api.py

from fastapi import FastAPI
from pydantic import BaseModel
from typing import List

from utils.github_loader import clone_repo
from utils.file_loader import load_code_files

from parsers.python_parser import parse_python_file
from parsers.java_parser import parse_java_file
from parsers.cpp_parser import parse_cpp_file

from snippets.extractor import build_snippets

from search.snippet_ranker import rank_snippets
from embeddings.semantic_model import semantic_rerank

from evaluation.evaluator import evaluate
from evaluation.benchmark_queries import benchmark_queries

from fastapi.middleware.cors import CORSMiddleware
# ==================================================
# APP
# ==================================================
app = FastAPI(title="Hybrid Code Search Engine API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# in-memory db
ALL_SNIPPETS = []


# ==================================================
# MODELS
# ==================================================
class RepoRequest(BaseModel):
    repos: List[str]


class SearchRequest(BaseModel):
    query: str
    mode: str = "auto"   # auto / keyword / intent / code


# ==================================================
# HELPERS
# ==================================================
def parse_file(file_path):

    lower = file_path.lower()

    if lower.endswith(".py"):
        return parse_python_file(file_path)

    elif lower.endswith(".java"):
        return parse_java_file(file_path)

    elif lower.endswith((".cpp", ".cc", ".cxx", ".hpp", ".h")):
        return parse_cpp_file(file_path)

    return None


def build_documents(files):

    parsed_docs = []

    for file_path in files:

        result = parse_file(file_path)

        if result:
            result["file_path"] = file_path
            parsed_docs.append(result)

    return parsed_docs


def load_single_repo(repo_url):

    repo_path = clone_repo(repo_url)

    files = load_code_files(repo_path)

    parsed_docs = build_documents(files)

    snippets = build_snippets(parsed_docs)

    repo_name = repo_url.rstrip("/").split("/")[-1]

    for s in snippets:
        s["repo_name"] = repo_name

    return snippets


# ==================================================
# ROOT
# ==================================================
@app.get("/")
def root():
    return {
        "message": "Hybrid Code Search Engine API Running"
    }


# ==================================================
# LOAD REPOS
# ==================================================
@app.post("/load-repos")
def load_repositories(req: RepoRequest):

    global ALL_SNIPPETS

    ALL_SNIPPETS = []

    loaded = []

    for repo in req.repos:

        try:
            snippets = load_single_repo(repo)
            ALL_SNIPPETS.extend(snippets)

            loaded.append({
                "repo": repo,
                "snippets": len(snippets),
                "status": "loaded"
            })

        except Exception as e:

            loaded.append({
                "repo": repo,
                "status": f"failed: {str(e)}"
            })

    return {
        "repositories": loaded,
        "total_snippets": len(ALL_SNIPPETS)
    }


# ==================================================
# SEARCH
# ==================================================
@app.post("/search")
def search(req: SearchRequest):

    if not ALL_SNIPPETS:
        return {
            "error": "No repositories loaded."
        }

    forced_mode = None

    if req.mode in ["keyword", "intent", "code"]:
        forced_mode = req.mode

    query_type, results = rank_snippets(
        query=req.query,
        snippet_db=ALL_SNIPPETS,
        top_k=25,
        forced_mode=forced_mode
    )

    results = semantic_rerank(
        query=req.query,
        ranked_results=results,
        top_k=10
    )

    return {
        "query": req.query,
        "detected_mode": query_type,
        "count": len(results),
        "results": results
    }


# ==================================================
# METRICS
# ==================================================
@app.get("/metrics")
def metrics():

    if not ALL_SNIPPETS:
        return {
            "error": "No repositories loaded."
        }

    results = evaluate(ALL_SNIPPETS, benchmark_queries)

    return results