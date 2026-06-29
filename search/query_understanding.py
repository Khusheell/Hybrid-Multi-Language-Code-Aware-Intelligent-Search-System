import re


# -----------------------------------
# DOMAIN SYNONYMS
# -----------------------------------
EXPANSIONS = {
    "user": [
        "users", "account", "accounts",
        "auth", "profile", "member"
    ],

    "users": [
        "user", "account", "accounts",
        "auth", "profile"
    ],

    "login": [
        "signin", "auth", "authenticate",
        "route", "handler"
    ],

    "owner": [
        "owners", "customer", "client"
    ],

    "vet": [
        "vets", "doctor", "doctors",
        "physician"
    ],

    "doctors": [
        "doctor", "vet", "vets",
        "physician"
    ],

    "search": [
        "find", "lookup", "query"
    ],

    "tree": [
        "binarytree", "bst", "node"
    ],

    "graph": [
        "graphs", "adjacency", "node"
    ]
}


# -----------------------------------
# ACTION WORDS
# -----------------------------------
ACTION_MAP = {
    "where": ["find", "locate", "fetch", "get"],
    "show": ["display", "list", "get"],
    "create": ["add", "insert", "register"],
    "delete": ["remove", "drop"],
    "update": ["edit", "modify"],
}


# -----------------------------------
# TOKENIZER
# -----------------------------------
def tokenize(text):
    return re.findall(r"[a-z0-9_]+", text.lower())


# -----------------------------------
# EXPAND QUERY
# -----------------------------------
def expand_query(query):

    words = tokenize(query)

    expanded = []

    for w in words:

        expanded.append(w)

        # action expansions
        if w in ACTION_MAP:
            expanded.extend(ACTION_MAP[w])

        # synonym expansions
        if w in EXPANSIONS:
            expanded.extend(EXPANSIONS[w])

    # remove duplicates while preserving order
    seen = set()
    final = []

    for x in expanded:
        if x not in seen:
            seen.add(x)
            final.append(x)

    return " ".join(final)
