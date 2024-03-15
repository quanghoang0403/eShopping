from flask import Flask, request, jsonify
import os
from dotenv import load_dotenv
from clip_handler.clip_handler import CLIPHandler
from PIL import Image
from io import BytesIO
from flask_cors import CORS
import uuid
import time

load_dotenv()

app = Flask(__name__)
CORS(app) 
clip_handler = CLIPHandler()

@app.route('/upload_image', methods=['POST'])
def upload_image():
    start_time = time.time()
    if 'image' not in request.files:
        return jsonify({"error": "No image provided"}), 400
    image_file = request.files['image']
    try:
        unique_id = uuid.uuid4()
        filename, extension = os.path.splitext(image_file.filename)
        unique_filename = f"{filename}_{unique_id}{extension}"
        static_file = os.path.join(os.getenv("DATASET_PATH"), unique_filename) 
        image_file.save(static_file)
        image = Image.open(static_file)
        clip_handler.insert_item(image, unique_filename)
        end_time = time.time()  # Record end time
        duration = end_time - start_time  # Calculate duration
        print("duration_seconds upload_image", duration)
        return jsonify(static_file), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/delete_image', methods=['POST'])
def delete_image():
    start_time = time.time()
    request_data = request.get_json()
    id = request_data['id']
    url = request_data['url']
    try:
        clip_handler.remove_item(id, url)
        file_path = os.path.join(os.getenv("DATASET_PATH"), url)
        if os.path.exists(file_path):
            os.remove(file_path)
        end_time = time.time()  # Record end time
        duration = end_time - start_time  # Calculate duration
        print("duration_seconds delete_image", duration)
        return jsonify({}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/search_by_image', methods=['POST'])
def search_by_image():
    start_time = time.time()
    if 'image' not in request.files:
        return jsonify({"error": "No image provided"}), 400
    image_file = request.files['image']
    try:
        query_image = Image.open(BytesIO(image_file.read()))
        response = clip_handler.search_items_by_image(query_image)
        end_time = time.time()  # Record end time
        duration = end_time - start_time  # Calculate duration
        print("duration_seconds search_by_image", duration)
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/search_by_text', methods=['POST'])
def search_by_text():
    try:
        start_time = time.time()
        request_data = request.get_json()
        query_text = request_data['text']
        response = clip_handler.search_items_by_text(query_text)
        end_time = time.time()  # Record end time
        duration = end_time - start_time  # Calculate duration
        print("duration_seconds search_by_text", duration)
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/save', methods=['GET'])
def save():
    try:
        clip_handler.save()
        return jsonify(), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route('/recalculate', methods=['GET'])
def recalculate():
    try:
        start_time = time.time()
        clip_handler.recalculate()
        end_time = time.time()  # Record end time
        duration = end_time - start_time  # Calculate duration
        print("duration_seconds recalculate", duration)
        return jsonify(), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)