import collections
import json
import os

from config import Config
from database import Database
from flask import Flask, jsonify, send_from_directory

config = Config('reader.conf')
app = Flask(__name__)
database = Database("data/reader.db")


@app.route("/")
def reader():
    return app.send_static_file("reader.html")


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

    return jsonify(mangas)


@app.route("/static/<path:path>")
def files(path):
    return send_from_directory("static", path)


@app.route("/images/<path:path>")
def images(path):
    base = os.path.join(config.string("base"), "library")
    return send_from_directory(base, path)


@app.route("/reading/<manga>", methods=["GET"])
def reading(manga):
    reading = database.fetchone("SELECT * FROM reading WHERE title = ?", manga)
    return jsonify({"reading": reading})


@app.route("/reading/<title>/<chapter>/<page>", methods=["PUT"])
def update(title, chapter, page):
    exists = database.fetchone("SELECT 1 FROM reading WHERE title = ?", title)

    if exists:
        query = "UPDATE reading SET chapter = ?, page = ? WHERE title = ?"
        database.execute(query, [(chapter, page, title)])
    else:
        query = "INSERT INTO reading(title, chapter, page) VALUES(?, ?, ?)"
        database.execute(query, [(title, chapter, page)])

    reading = database.fetchone("SELECT * FROM reading WHERE title = ?", title)

    return jsonify({"manga": reading})


if __name__ == "__main__":
    app.debug = True
    app.run()
