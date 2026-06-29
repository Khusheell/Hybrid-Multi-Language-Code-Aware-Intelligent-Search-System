import ast


def parse_python_file(file_path):
    data = {
        "functions": [],
        "classes": [],
        "variables": [],
        "imports": [],
        "comments": [],
        "snippets": []
    }

    try:
        with open(file_path, "r", encoding="utf-8") as f:
            code = f.read()

        lines = code.splitlines()

        # comments
        for line in lines:
            if line.strip().startswith("#"):
                data["comments"].append(line.strip())

        tree = ast.parse(code)

        for node in ast.walk(tree):

            # ---------- FUNCTIONS ----------
            if isinstance(node, ast.FunctionDef):

                data["functions"].append(node.name)

                start = node.lineno - 1
                end = getattr(node, "end_lineno", node.lineno)

                snippet = "\n".join(lines[start:end])

                data["snippets"].append({
                    "type": "function",
                    "title": node.name,
                    "start": start + 1,
                    "end": end,
                    "code": snippet
                })

            # ---------- CLASSES ----------
            elif isinstance(node, ast.ClassDef):

                data["classes"].append(node.name)

                start = node.lineno - 1
                end = getattr(node, "end_lineno", node.lineno)

                snippet = "\n".join(lines[start:end])

                data["snippets"].append({
                    "type": "class",
                    "title": node.name,
                    "start": start + 1,
                    "end": end,
                    "code": snippet
                })

            # ---------- VARIABLES ----------
            elif isinstance(node, ast.Name):
                data["variables"].append(node.id)

            # ---------- IMPORTS ----------
            elif isinstance(node, ast.Import):
                for alias in node.names:
                    data["imports"].append(alias.name)

            elif isinstance(node, ast.ImportFrom):
                if node.module:
                    data["imports"].append(node.module)

        return data

    except:
        return data