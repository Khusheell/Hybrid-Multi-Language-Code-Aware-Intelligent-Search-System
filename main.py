# main.py

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


# -----------------------------------
# PARSE FILE BY LANGUAGE
# -----------------------------------
def parse_file(file_path):

    lower = file_path.lower()

    if lower.endswith(".py"):
        return parse_python_file(file_path)

    elif lower.endswith(".java"):
        return parse_java_file(file_path)

    elif lower.endswith((".cpp", ".cc", ".cxx", ".hpp", ".h")):
        return parse_cpp_file(file_path)

    return None


# -----------------------------------
# BUILD DOCUMENTS
# -----------------------------------
def build_documents(files):

    parsed_docs = []

    for file_path in files:

        result = parse_file(file_path)

        if result:
            result["file_path"] = file_path
            parsed_docs.append(result)

    return parsed_docs


# -----------------------------------
# LOAD SINGLE REPO
# -----------------------------------
def load_single_repo(repo_url):

    repo_path = clone_repo(repo_url)

    if not repo_path:
        return []

    files = load_code_files(repo_path)

    parsed_docs = build_documents(files)

    snippets = build_snippets(parsed_docs)

    repo_name = repo_url.rstrip("/").split("/")[-1]

    for s in snippets:
        s["repo_name"] = repo_name

    print(f"[INFO] Indexed {len(snippets)} snippets from {repo_name}")

    return snippets


# -----------------------------------
# DISPLAY RESULTS
# -----------------------------------
def show_results(results):

    for i, r in enumerate(results, start=1):

        print("\n" + "=" * 75)
        print(f"Rank #{i}")
        print("Repository       :", r.get("repo_name", "Unknown"))
        print("Snippet Title    :", r["title"])
        print("Type             :", r["type"])
        print("Language         :", r["language"])
        print("Structural Score :", r["score"])
        print("Semantic Score   :", r.get("semantic_score", 0))
        print("Final Score      :", r.get("final_score", r["score"]))
        print("Confidence       :", r["confidence"])
        print("File Path        :", r["file"])
        print("Lines            :", r["start"], "-", r["end"])

        print("\nMatched Zones :", ", ".join(r["zones"]))

        print("\nRelevant Code Snippet:\n")
        print(r["code"][:700])

        print("\nWhy Relevant:")

        if r["reasons"]:
            for reason in r["reasons"]:
                print("-", reason)
        else:
            print("- Semantic relevance")


# -----------------------------------
# MAIN
# -----------------------------------
if __name__ == "__main__":

    print("=" * 75)
    print("MULTI-LANGUAGE MULTI-REPOSITORY CODE SEARCH ENGINE")
    print("Python + Java + C++ + Semantic Search")
    print("=" * 75)

    print("\nEnter GitHub repositories one by one.")
    print("Type done when finished.\n")

    all_snippets = []

    # -----------------------------------
    # LOAD REPOSITORIES
    # -----------------------------------
    while True:

        repo_url = input("Repo URL: ").strip()

        if repo_url.lower() == "done":
            break

        if repo_url:
            snippets = load_single_repo(repo_url)
            all_snippets.extend(snippets)

    print(f"\nTotal Indexed Snippets: {len(all_snippets)}")

    print("\nCommands:")
    print(" - Type any query to search")
    print(" - metrics   => run evaluation report")
    print(" - help      => show commands")
    print(" - exit      => quit")

    # -----------------------------------
    # SEARCH LOOP
    # -----------------------------------
    while True:

        query = input("\nSearch Query: ").strip()

        if not query:
            continue

        cmd = query.lower()

        # -----------------------------------
        # COMMANDS
        # -----------------------------------
        if cmd == "exit":
            print("Goodbye.")
            break

        elif cmd == "help":
            print("\nCommands:")
            print(" metrics  => run benchmark metrics")
            print(" help     => show commands")
            print(" exit     => quit")
            continue

        elif cmd == "metrics":
            evaluate(all_snippets, benchmark_queries)
            continue

        # -----------------------------------
        # QUERY MODE SELECTOR
        # -----------------------------------
        print("\nChoose Search Mode:")
        print("1 = Auto Detect")
        print("2 = Keyword Search")
        print("3 = Intent Search")
        print("4 = Code Search")

        choice = input("Enter choice: ").strip()

        forced_mode = None

        if choice == "2":
            forced_mode = "keyword"

        elif choice == "3":
            forced_mode = "intent"

        elif choice == "4":
            forced_mode = "code"

        # -----------------------------------
        # STRUCTURAL SEARCH
        # -----------------------------------
        query_type, results = rank_snippets(
            query=query,
            snippet_db=all_snippets,
            top_k=25,
            forced_mode=forced_mode
        )

        # -----------------------------------
        # SEMANTIC RERANK
        # -----------------------------------
        results = semantic_rerank(query, results, top_k=10)

        if not results:
            print("\nNo relevant results found.")
            continue

        print("\nDetected Query Type:", query_type)

        show_results(results)