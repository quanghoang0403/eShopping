from flask import Flask, request, jsonify
import os
import pyodbc
from dotenv import load_dotenv
from clip_handler.clip_handler import CLIPHandler
from mongo_handler.mongo_handler import MongoDBHandler
from PIL import Image
from io import BytesIO

load_dotenv()

app = Flask(__name__)
mongo_handler = MongoDBHandler()
clip_handler = CLIPHandler()

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
        filenames.append(file.filename)

        # Save to file
        file.save(os.path.join(os.getenv("DATASET_PATH"), file.filename))
        
        # Add record to query CLIP
        clip_handler.insert_item(file.filename)

        # Add record to mongoDB
        mongo_handler.insert_item(file.filename)

    # Handle calculate and save to DB
    return jsonify({'message': 'Files uploaded successfully', 'filenames': filenames}), 200

@app.route('/delete_image', methods=['DELETE'])
def delete_image():
    url = request.args.get('url')
    try:
        id = mongo_handler.get_index_by_url(url)
        mongo_handler.remove_item(id)
        clip_handler.remove_item(id)
        return jsonify({{'message': 'Files uploaded successfully', 'filenames': url}}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/search_by_image', methods=['POST'])
def search_by_image():
    if 'image' not in request.files:
        return jsonify({"error": "No image provided"}), 400
    image_file = request.files['image']
    try:
        query_image = Image.open(BytesIO(image_file.read()))
        total_items = request.args.get('total', type=int)
        ids = clip_handler.search_items_by_image(query_image, total_items)
        response = mongo_handler.search_items_by_index(ids)
        return jsonify({response}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/search_by_text', methods=['GET'])
def search_by_text():
    try:
        query_text = request.args.get('text', type=int)
        total_items = request.args.get('total', type=int)
        ids = clip_handler.search_items_by_text(query_text, total_items)
        response = mongo_handler.search_items_by_index(ids)
        return jsonify({response}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)