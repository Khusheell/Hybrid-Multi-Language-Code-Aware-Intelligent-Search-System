# search/snippet_ranker.py

import re

# -----------------------------------
# STOPWORDS
# -----------------------------------
STOPWORDS = {
    "is", "are", "am", "was", "were",
    "by", "how", "where", "what", "when",
    "to", "the", "a", "an", "of", "for",
    "in", "on", "at", "with", "and", "or"
}

# -----------------------------------
# LANGUAGE KEYWORDS TO IGNORE IN CODE MODE
# -----------------------------------
PYTHON_KEYWORDS = {
    "from", "import", "def", "class", "return",
    "lambda", "self", "none", "true", "false"
}

CPP_KEYWORDS = {
    "void", "int", "float", "double", "char",
    "const", "std", "include", "namespace",
    "return", "auto", "bool", "size_t"
}

JAVA_KEYWORDS = {
    "public", "private", "protected", "class",
    "static", "void", "return", "new",
    "package", "import"
}


# -----------------------------------
# TOKENIZER
# -----------------------------------
def tokenize(text):
    text = re.sub(r'([a-z])([A-Z])', r'\1 \2', text)
    text = text.replace("_", " ")
    text = text.lower()
    return re.findall(r"[a-z0-9]+", text)


# -----------------------------------
# QUERY TYPE
# -----------------------------------
def classify_query(query):

    q = query.strip()

    if (
        "\n" in q
        or any(sym in q for sym in ["(", ")", "{", "}", ";", "::", "=="])
        or "import " in q.lower()
        or "from " in q.lower()
    ):
        return "code"

    elif len(q.split()) >= 3:
        return "intent"

    return "keyword"


# -----------------------------------
# CONFIDENCE
# -----------------------------------
def confidence(score):

    if score >= 250:
        return "High"

    elif score >= 120:
        return "Medium"

    return "Low"


# -----------------------------------
# HELPERS
# -----------------------------------
def compact(text):
    return re.sub(r"\s+", "", text.lower())


def unique_keep_order(items):
    seen = set()
    out = []

    for x in items:
        if x not in seen:
            seen.add(x)
            out.append(x)

    return out


# -----------------------------------
# MAIN
# -----------------------------------
def rank_snippets(query, snippet_db, top_k=10, forced_mode=None):

    query_type = forced_mode if forced_mode else classify_query(query)

    raw_words = tokenize(query)
    query_words = [w for w in raw_words if w not in STOPWORDS]

    if not query_words:
        query_words = raw_words

    query_compact = compact(query)

    called_funcs = re.findall(r'([A-Za-z_]\w*)\s*\(', query)
    namespaces = re.findall(r'([A-Za-z_]\w*)::', query)
    nums = re.findall(r'\b\d+\b', query)

    results = []

    for snippet in snippet_db:

        title = snippet["title"]
        code = snippet["code"]
        file_path = snippet["file_path"]
        language = snippet["language"]
        stype = snippet["type"].lower()

        title_tokens = tokenize(title)
        code_tokens = tokenize(code)
        path_tokens = tokenize(file_path)

        score = 0
        reasons = []
        zones = set()

        # -----------------------------------
        # CODE MODE TOKEN FILTERING
        # -----------------------------------
        effective_query_words = list(query_words)

        if query_type == "code":

            if language == "Python":
                effective_query_words = [
                    w for w in query_words if w not in PYTHON_KEYWORDS
                ]

            elif language == "C++":
                effective_query_words = [
                    w for w in query_words if w not in CPP_KEYWORDS
                ]

            elif language == "Java":
                effective_query_words = [
                    w for w in query_words if w not in JAVA_KEYWORDS
                ]

            if not effective_query_words:
                effective_query_words = query_words

        matched_terms = 0

        # -----------------------------------
        # BASIC MATCHING
        # -----------------------------------
        for word in effective_query_words:

            local_hit = False

            if word in title_tokens:
                score += 60
                zones.add("Identifier")
                reasons.append(f"Matched title: {word}")
                local_hit = True

            if word in path_tokens:
                score += 35
                zones.add("File Path")
                local_hit = True

            if word in code_tokens:
                score += 15
                zones.add("Code Body")
                local_hit = True

            if local_hit:
                matched_terms += 1

        if score == 0:
            continue

        # -----------------------------------
        # CODE MODE PRECISION
        # -----------------------------------
        if query_type == "code":

            code_compact = compact(code)

            if query_compact in code_compact:
                score += 500
                zones.add("Exact Match")
                reasons.append("Exact code pattern match")

            for fn in called_funcs:

                if fn.lower() == title.lower():
                    score += 180
                    reasons.append(f"Matched called function: {fn}")

                elif fn.lower() in code.lower():
                    score += 80

            for ns in namespaces:

                # ignore common namespaces like std
                if ns.lower() in {"std"}:
                    continue

                if ns.lower() in code.lower():
                    score += 60
                    reasons.append(f"Matched namespace: {ns}")

            for n in nums:
                if n in code:
                    score += 20

            if stype == "function":
                score += 40
                reasons.append("Function preferred for code query")

        # -----------------------------------
        # INTENT MODE
        # -----------------------------------
        elif query_type == "intent":

            if stype == "function":
                score += 25
                reasons.append("Function preferred for intent query")

            if matched_terms >= 2:
                score += 25
                reasons.append("Multiple query terms matched")

        # -----------------------------------
        # KEYWORD MODE
        # -----------------------------------
        else:

            if stype == "class":
                score += 15
                reasons.append("Class preferred for keyword query")

        # -----------------------------------
        # LANGUAGE BOOSTS
        # -----------------------------------
        path = file_path.lower()

        if language == "Java":

            if "controller" in path:
                score += 20

            if "repository" in path:
                score += 20

        elif language == "Python":

            if any(x in path for x in ["views", "routes", "router", "api"]):
                score += 25

        elif language == "C++":

            if any(x in path for x in ["algorithm", "search", "sorting"]):
                score += 25

            if "data_structures" in path:
                score += 20

        # -----------------------------------
        # QUALITY RULES
        # -----------------------------------
        if "test" in path:
            score -= 60
            reasons.append("Test file penalty")

        score = max(score, 0)

        if score < 35:
            continue

        # deduplicate reasons
        reasons = unique_keep_order(reasons)

        results.append({
            "repo_name": snippet.get("repo_name", "Unknown"),
            "file": file_path,
            "language": language,
            "type": snippet["type"],
            "title": title,
            "score": score,
            "confidence": confidence(score),
            "zones": list(zones),
            "reasons": reasons,
            "code": code,
            "start": snippet["start"],
            "end": snippet["end"]
        })

    results.sort(key=lambda x: x["score"], reverse=True)

    return query_type, results[:top_k]