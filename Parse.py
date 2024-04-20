import os

IGNORE_NAMES = {".git", ".gitattributes", "__pycache__", ".vs", "bin", "obj", "Properties", ".gitignore", ".dockerignore"}
IGNORE_EXTS = {".csproj", ".user", ".http", ".gitattributes", ".sln", ".md", ".cd"} 

def print_tree(root, prefix=""):
    items = sorted(os.listdir(root))
    filtered = []
    for i in items:
        path = os.path.join(root, i)
        name, ext = os.path.splitext(i)
        if i in IGNORE_NAMES or ext in IGNORE_EXTS:
            continue
        filtered.append(i)

    pointers = ["├── "] * (len(filtered) - 1) + ["└── "]

    for pointer, item in zip(pointers, filtered):
        path = os.path.join(root, item)
        print(prefix + pointer + item)
        if os.path.isdir(path):
            extension = "│   " if pointer == "├── " else "    "
            print_tree(path, prefix + extension)

if __name__ == "__main__":
    project_root = r"D:\Project\VS\AutoRentalSystem"  # путь к папке
    print(os.path.basename(os.path.abspath(project_root)) + "/")
    print_tree(project_root)
