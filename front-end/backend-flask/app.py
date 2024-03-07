from flask import Flask, request, jsonify
import os
import pyodbc
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)

@app.route('/upload_images', methods=['POST'])
def upload_images():
    # Check if the POST request contains any files
    if 'files[]' not in request.files:
        return jsonify({'error': 'No files part'}), 400

    files = request.files.getlist('files[]')

    # Check if any files are selected
    if len(files) == 0:
        return jsonify({'error': 'No selected files'}), 400

    # Iterate through each uploaded file
    filenames = []
    for file in files:
        # Check if the file name is empty
        if file.filename == '':
            return jsonify({'error': 'No selected file'}), 400

        # Save the uploaded file to the specified upload folder
        file.save(os.path.join(app.config['UPLOAD_FOLDER'], file.filename))
        filenames.append(file.filename)

    # Handle calculate and save to DB
    return jsonify({'message': 'Files uploaded successfully', 'filenames': filenames}), 200

@app.route('/search_by_image', methods=['POST'])
def search_image():
    return jsonify({}), 200

@app.route('/search_by_text', methods=['GET'])
def search_text():
    jsonify({}), 200

if __name__ == '__main__':
    app.run(debug=True)