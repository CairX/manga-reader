import json

from flask import Flask, jsonify, send_from_directory

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "Hello world!"

@app.route("/test")
def test():
    path = "/home/cairns/workspace/manga-downloader/.index/index.json"
    with open(path, 'r') as file:
        entries = json.load(file)
        entries = {"entries": entries}
        return jsonify(entries)

@app.route("/reader")
def reader():
    return app.send_static_file("reader.html")

@app.route('/files/<path:path>')
def files(path):
    return send_from_directory('static', path)

if __name__ == "__main__":
    app.debug = True
    app.run()
