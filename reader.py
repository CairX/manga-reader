import json
import os
import re

from flask import Flask, jsonify, send_from_directory

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
    path = "/home/cairns/workspace/manga-downloader/.index/index.json"
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

@app.route('/files/<path:path>')
def files(path):
    return send_from_directory('static', path)

@app.route('/images/<path:path>')
def images(path):
    return send_from_directory('/home/cairns/workspace/manga-downloader/library/horimiya', path)


if __name__ == "__main__":
    app.debug = True
    app.run()
