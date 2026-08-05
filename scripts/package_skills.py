#!/usr/bin/env python3
"""
Packages superforge skills into standalone .skill ZIP archives in dist/
"""

import sys
import os
import zipfile

REPO_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
SKILLS_DIR = os.path.join(REPO_DIR, "skills")
DIST_DIR = os.path.join(REPO_DIR, "dist")

def package_skill(skill_folder):
    skill_name = os.path.basename(skill_folder)
    os.makedirs(DIST_DIR, exist_ok=True)
    out_zip = os.path.join(DIST_DIR, f"{skill_name}.skill")

    with zipfile.ZipFile(out_zip, 'w', zipfile.ZIP_DEFLATED) as zipf:
        for root, _, files in os.walk(skill_folder):
            for file in files:
                if file.startswith("."):
                    continue
                file_path = os.path.join(root, file)
                arcname = os.path.relpath(file_path, skill_folder)
                zipf.write(file_path, arcname)

    print(f"Packaged {skill_name} -> {out_zip}")
    return out_zip

def package_all():
    if not os.path.exists(SKILLS_DIR):
        print("Skills directory not found.")
        return

    for entry in sorted(os.listdir(SKILLS_DIR)):
        full_path = os.path.join(SKILLS_DIR, entry)
        if os.path.isdir(full_path) and os.path.exists(os.path.join(full_path, "SKILL.md")):
            package_skill(full_path)

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] != "--all":
        target = os.path.abspath(sys.argv[1])
        package_skill(target)
    else:
        package_all()
