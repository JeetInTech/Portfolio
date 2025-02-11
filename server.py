from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS
import os

app = Flask(__name__, static_folder='html')  # Change this if your frontend is in a different folder
CORS(app)

# Serve static files
@app.route('/')
def serve_index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/')
def serve_static(path):
    return send_from_directory(app.static_folder, path)

# API route
@app.route('/backend/app', methods=['GET'])
def get_data():
    return jsonify({"message": "Hello from Flask!", "status": "success"})
app.run(debug=True, port=5000)  # Ensure Flask runs on a different port

if __name__ == '__main__':
    app.run(debug=True, port=5000)
