import os
from git import Repo

def clone_repo(repo_url, save_path="data/"):
    try:
        repo_name = repo_url.split("/")[-1].replace(".git", "")
        repo_path = os.path.join(save_path, repo_name)

        if os.path.exists(repo_path):
            print(f"[INFO] Repo already exists: {repo_path}")
            return repo_path

        print(f"[INFO] Cloning {repo_url}...")
        Repo.clone_from(repo_url, repo_path)

        print(f"[SUCCESS] Cloned to {repo_path}")
        return repo_path

    except Exception as e:
        print(f"[ERROR] {e}")
        return None