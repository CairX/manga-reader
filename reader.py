import collections
import json
import os

from config import Config
from flask import Flask, jsonify, send_from_directory

config = Config('reader.conf')
app = Flask(__name__)


@app.route("/")
def reader():
    return app.send_static_file("reader.html")


@app.route("/test")
def test():
    path = os.path.join(config.string("base"), ".index/index.json")
    with open(path, 'r') as file:
        entries = json.load(file)
        entries = {"entries": entries}
        return jsonify(entries)


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


if __name__ == "__main__":
    app.debug = True
    app.run()
