import collections
import json
import os
import re

from config import Config
from flask import Flask, jsonify, send_from_directory

config = Config('reader.conf')
app = Flask(__name__)


def natural(l):
    convert = lambda text: int(text) if text.isdigit() else text
    alphanum = lambda key: [convert(c) for c in re.split('([0-9]+)', key)]
    l.sort(key=alphanum)


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


@app.route("/chapters")
def chapters():
    path = "/home/cairns/workspace/manga-downloader/library/horimiya"
    chapters = []

    for root, dirs, files in os.walk(path):
        number = root.replace(path, '')[1:]
        if number:
            chapter = {
                "number": number,
                "pages": sorted(files)
            }
            chapters.append(chapter)

    chapters = sorted(chapters, key=lambda k: k["number"])
    return jsonify({"chapters": chapters})


@app.route("/mangas")
def mangas():
    path = os.path.join(config.string("base"), "library/")
    print(path)
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


@app.route("/files/<path:path>")
def files(path):
    return send_from_directory("static", path)


@app.route("/images/<path:path>")
def images(path):
    base = os.path.join(config.string("base"), "library")
    return send_from_directory(base, path)


if __name__ == "__main__":
    app.debug = True
    app.run()
