import base64
import os
from io import BytesIO
import faiss
import numpy as np
import requests
import json
from dotenv import load_dotenv
from PIL import Image

class CLIPHandler:
    def __init__(self):
        load_dotenv()
        self.dataset_path = os.getenv("DATASET_PATH")
        self.inference_endpoint = os.getenv("INFERENCE_ENDPOINT")
        self.private_key = os.getenv("PRIVATE_KEY")

        # Load index and file_names
        self.index = faiss.read_index('index.bin')
        with open('index.json', "r") as f:
            self.file_names = json.load(f)

    def get_image_embedding(self, image: Image) -> np.ndarray:
        image = image.convert("RGB")
        buffer = BytesIO()
        image.save(buffer, format="JPEG")
        image_data = base64.b64encode(buffer.getvalue()).decode("utf-8")
        payload = {
            "image": {"type": "base64", "value": image_data},
        }
        data = requests.post(
            self.inference_endpoint + "/clip/embed_image?api_key=" + self.private_key,
            json=payload
        )
        response = data.json()
        embedding = response["embeddings"]
        return embedding

    def get_text_embedding(self, text: str) -> np.ndarray:
        payload = {
            "text": text  # Provide the text data here
        }
        data = requests.post(
            self.inference_endpoint + "/clip/embed_text?api_key=" + self.private_key,
            json=payload
        )
        response = data.json()
        embedding = response["embeddings"]
        return embedding
    
    def search_items_by_image(self, query_image, results_num=100):
        query_embedding = self.get_image_embedding(query_image)
        D, I = self.index.search(np.array(query_embedding).astype(np.float32), results_num)
        return I[0]
    
    def search_items_by_text(self, query_text, results_num=100):
        query_embedding = self.get_text_embedding(query_text)
        D, I = self.index.search(np.array(query_embedding).astype(np.float32), results_num)
        return I[0]

    def insert_item(self, image_path):
        embedding = self.get_image_embedding(image_path)
        self.index.add(np.array(embedding).astype(np.float32))
        return
    
    def remove_item(self, id):
        self.index.remove_ids(np.array([id], dtype=np.int64))
        return
    
    def save(self):
        faiss.write_index(self.index, "index.bin")
        return

    def recalculate(self):
        index = faiss.IndexFlatL2(512)
        file_names = []
        for frame_name in os.listdir(self.dataset_path):
            try:
                frame = Image.open(os.path.join(self.dataset_path, frame_name))
            except IOError:
                print("error computing embedding for", frame_name)
                continue

            embedding = self.get_image_embedding(frame)
            index.add(np.array(embedding).astype(np.float32))
            file_names.append(frame_name)

        faiss.write_index(index, "index.bin")
        self.index = index
        return file_names
