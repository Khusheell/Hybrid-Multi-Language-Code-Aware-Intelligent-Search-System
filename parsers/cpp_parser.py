# parsers/cpp_parser.py

import re


def parse_cpp_file(file_path):
    data = {
        "functions": [],
        "classes": [],
        "variables": [],
        "imports": [],
        "comments": [],
        "snippets": []
    }

    try:
        with open(file_path, "r", encoding="utf-8", errors="ignore") as f:
            code = f.read()

        lines = code.splitlines()

        # -----------------------------------
        # COMMENTS
        # -----------------------------------
        for line in lines:
            if line.strip().startswith("//"):
                data["comments"].append(line.strip())

        # -----------------------------------
        # IMPORTS
        # -----------------------------------
        include_pattern = r'#include\s*[<"]([^>"]+)[>"]'

        for match in re.finditer(include_pattern, code):
            data["imports"].append(match.group(1))

        # -----------------------------------
        # CLASSES / STRUCTS
        # -----------------------------------
        class_pattern = r'\b(class|struct)\s+([A-Za-z_]\w*)'

        for match in re.finditer(class_pattern, code):

            name = match.group(2)

            data["classes"].append(name)

            line_no = code[:match.start()].count("\n") + 1
            start = max(0, line_no - 1)
            end = min(start + 25, len(lines))

            snippet = "\n".join(lines[start:end])

            data["snippets"].append({
                "type": "class",
                "title": name,
                "start": start + 1,
                "end": end,
                "code": snippet
            })

        # -----------------------------------
        # FUNCTION DETECTION
        # -----------------------------------

        # banned control words
        banned = {
            "if", "for", "while", "switch",
            "catch", "return", "else",
            "do"
        }

        func_pattern = re.compile(
            r'''
            (?:template\s*<[^>]+>\s*)?                # optional template
            (?:[\w:\<\>\&\*\s]+?)                    # return type
            \s+
            ([A-Za-z_]\w*)                           # function name
            \s*
            \(
                [^\)]*
            \)
            \s*
            (?:const\s*)?
            \{
            ''',
            re.VERBOSE | re.MULTILINE
        )

        for match in func_pattern.finditer(code):

            name = match.group(1)

            # skip invalid names
            if name.lower() in banned:
                continue

            # skip class names already captured
            if name in data["classes"]:
                continue

            data["functions"].append(name)

            line_no = code[:match.start()].count("\n") + 1
            start = max(0, line_no - 1)
            end = min(start + 20, len(lines))

            snippet = "\n".join(lines[start:end])

            data["snippets"].append({
                "type": "function",
                "title": name,
                "start": start + 1,
                "end": end,
                "code": snippet
            })

        # -----------------------------------
        # VARIABLES
        # -----------------------------------
        var_pattern = re.compile(
            r'''
            \b
            (?:int|float|double|char|bool|
               long|short|size_t|string|auto)
            \s+
            ([A-Za-z_]\w*)
            \s*
            (?:=|;)
            ''',
            re.VERBOSE
        )

        for match in var_pattern.finditer(code):

            name = match.group(1)

            if name not in data["variables"]:
                data["variables"].append(name)

        # remove duplicates
        data["functions"] = list(dict.fromkeys(data["functions"]))
        data["classes"] = list(dict.fromkeys(data["classes"]))
        data["imports"] = list(dict.fromkeys(data["imports"]))

        return data

    except:
        return data