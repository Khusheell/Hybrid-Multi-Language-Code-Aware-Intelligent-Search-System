# utils/file_loader.py

import os


SUPPORTED_EXTENSIONS = (
    ".py",
    ".java",
    ".cpp",
    ".cc",
    ".cxx",
    ".h",
    ".hpp"
)


def load_code_files(repo_path):

    code_files = []

    for root, dirs, files in os.walk(repo_path):

        # Skip heavy/unwanted folders
        dirs[:] = [
            d for d in dirs
            if d not in {
                ".git",
                "__pycache__",
                "node_modules",
                "venv",
                ".idea",
                ".vscode"
            }
        ]

        for file in files:

            if file.lower().endswith(SUPPORTED_EXTENSIONS):

                full_path = os.path.join(root, file)
                code_files.append(full_path)

    print(f"[INFO] Loaded {len(code_files)} code files")

    return code_files