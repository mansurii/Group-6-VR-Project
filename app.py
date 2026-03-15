from flask import Flask, send_from_directory
import os

app = Flask(__name__, static_folder='.', static_url_path='')

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

@app.route('/')
def index():
    return send_from_directory(BASE_DIR, 'index.html')

@app.route('/site1')
def site1():
    return send_from_directory(BASE_DIR, 'site1.html')

@app.route('/site2')
def site2():
    return send_from_directory(BASE_DIR, 'site2.html')

@app.route('/site3')
def site3():
    return send_from_directory(BASE_DIR, 'site3.html')

@app.route('/site4')
def site4():
    return send_from_directory(BASE_DIR, 'site4.html')

if __name__ == '__main__':
    app.run(port=5000)