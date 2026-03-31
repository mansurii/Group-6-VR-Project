import os
from flask import Flask, send_from_directory, abort

BASE = os.path.dirname(os.path.abspath(__file__))

app = Flask(__name__, static_folder=None)


# Landing page
@app.route('/')
def index():
    return send_from_directory(BASE, 'index.html')


# VR Tour
@app.route('/LsbuTour')
@app.route('/LsbuTour.html')
def lsbu_tour():
    return send_from_directory(BASE, 'LsbuTour.html')


# CSS
@app.route('/css/<path:filename>')
def css(filename):
    return send_from_directory(os.path.join(BASE, 'css'), filename)


# JavaScript
@app.route('/js/<path:filename>')
def js(filename):
    return send_from_directory(os.path.join(BASE, 'js'), filename)


# Libraries (A-Frame, environment.js)
@app.route('/lib/<path:filename>')
def lib(filename):
    return send_from_directory(os.path.join(BASE, 'lib'), filename)


# Assets

@app.route('/assets/images/<path:filename>')
def assets_images(filename):
    return send_from_directory(os.path.join(BASE, 'assets', 'images'), filename)

@app.route('/assets/video/<path:filename>')
def assets_video(filename):
    return send_from_directory(os.path.join(BASE, 'assets', 'video'), filename)

@app.route('/assets/anims/<path:filename>')
def assets_anims(filename):
    return send_from_directory(os.path.join(BASE, 'assets', 'anims'), filename)

@app.route('/assets/audio/<path:filename>')
def assets_audio(filename):
    return send_from_directory(os.path.join(BASE, 'assets', 'audio'), filename)


@app.route('/<path:filename>')
def catch_all(filename):
    filepath = os.path.join(BASE, filename)
    if os.path.isfile(filepath):
        directory = os.path.dirname(filepath)
        name      = os.path.basename(filepath)
        return send_from_directory(directory, name)
    abort(404)


# Run locally
if __name__ == '__main__':
    print()
    print('  Group 6 VR Project')
    print('  Running at: http://localhost:5000')
    print('  Press Ctrl+C to stop.')
    print()
    app.run(host='0.0.0.0', port=5000, debug=True)
