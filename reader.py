import collections
import os

from bottle import Bottle, run, static_file
from config import Config
from database import Database


# ------------------------------------------------- #
# Setup: Initiate needed objects.
# ------------------------------------------------- #
app = Bottle()
config = Config('reader.conf')
database = Database("data/reader.db")


# ------------------------------------------------- #
# Index: The main reader page.
# ------------------------------------------------- #
@app.route("/")
def reader():
    return static_file("reader.html", root="static")


# ------------------------------------------------- #
# Static: Deliver JavaScript and CSS files.
# ------------------------------------------------- #
@app.route("/static/<filepath:path>")
def files(filepath):
    return static_file(filepath, root="static")


# ------------------------------------------------- #
# Image: The manga page images.
# ------------------------------------------------- #
@app.route("/images/<filepath:path>")
def images(filepath):
    library = os.path.join(config.string("base"), "library")
    return static_file(filepath, root=library)


# ------------------------------------------------- #
# Static: Deliver JavaScript and CSS files.
# ------------------------------------------------- #
@app.route("/mangas")
def mangas():
    path = os.path.join(config.string("base"), "library/")
    mangas = {}

    for root, dirs, files in os.walk(path):
        root = root.replace(path, "")

        if not root or "/" not in root:
            continue

        manga = root[:root.find("/")]
        chapter = root[root.find("/") + 1:]

        if manga not in mangas:
            mangas[manga] = []

        mangas[manga].append({
            "chapter": chapter,
            "pages": sorted(files)
        })

    # Sort manga titles.
    mangas = collections.OrderedDict(sorted(mangas.items()))

    # Sort chapters within manga.
    for manga, chapters in mangas.items():
        mangas[manga] = sorted(chapters, key=lambda c: c["chapter"])

    return mangas


# ------------------------------------------------- #
# JSON: Get last reading bookmark.
# ------------------------------------------------- #
@app.route("/last", method=["GET"])
def last():
    query = "SELECT * FROM reading ORDER BY saved DESC LIMIT 1"
    reading = database.fetchone(query)
    return {"reading": reading}


# ------------------------------------------------- #
# JSON: Get reading info for a given manga title.
# ------------------------------------------------- #
@app.route("/reading/<manga>", method=["GET"])
def reading(manga):
    reading = database.fetchone("SELECT * FROM reading WHERE title = ?", manga)
    return {"reading": reading}


# ------------------------------------------------- #
# Update: Set reading info for a given manga title.
# ------------------------------------------------- #
@app.route("/reading/<title>/<chapter>/<page>", method=["PUT"])
def update(title, chapter, page):
    exists = database.fetchone("SELECT 1 FROM reading WHERE title = ?", title)

    if exists:
        query = """
            UPDATE reading
            SET chapter = ?, page = ?, saved = datetime()
            WHERE title = ?
        """
        database.execute(query, [(chapter, page, title)])
    else:
        query = "INSERT INTO reading(title, chapter, page) VALUES(?, ?, ?)"
        database.execute(query, [(title, chapter, page)])

    reading = database.fetchone("SELECT * FROM reading WHERE title = ?", title)

    return {"manga": reading}


# ------------------------------------------------- #
# Main: Run the application.
# ------------------------------------------------- #
if __name__ == "__main__":
    run(app, host="localhost", port=5000, debug=True)
