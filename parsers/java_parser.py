import javalang


def parse_java_file(file_path):
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

        for line in lines:
            if line.strip().startswith("//"):
                data["comments"].append(line.strip())

        tree = javalang.parse.parse(code)

        for path, node in tree:

            # ---------- CLASS ----------
            if isinstance(node, javalang.tree.ClassDeclaration):

                data["classes"].append(node.name)

                line_no = node.position.line if node.position else 1
                start = line_no - 1
                end = min(start + 25, len(lines))

                snippet = "\n".join(lines[start:end])

                data["snippets"].append({
                    "type": "class",
                    "title": node.name,
                    "start": start + 1,
                    "end": end,
                    "code": snippet
                })

            # ---------- METHODS ----------
            elif isinstance(node, javalang.tree.MethodDeclaration):

                data["functions"].append(node.name)

                line_no = node.position.line if node.position else 1
                start = line_no - 1
                end = min(start + 20, len(lines))

                snippet = "\n".join(lines[start:end])

                data["snippets"].append({
                    "type": "function",
                    "title": node.name,
                    "start": start + 1,
                    "end": end,
                    "code": snippet
                })

            # ---------- VARIABLES ----------
            elif isinstance(node, javalang.tree.FieldDeclaration):
                for d in node.declarators:
                    data["variables"].append(d.name)

            elif isinstance(node, javalang.tree.Import):
                data["imports"].append(node.path)

        return data

    except:
        return data