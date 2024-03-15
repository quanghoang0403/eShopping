import base64
import os
from io import BytesIO
import faiss
import numpy as np
import requests
import json
from dotenv import load_dotenv
from PIL import Image
from mongo_handler.mongo_handler import MongoDBHandler

class CLIPHandler:
    def __init__(self):
        load_dotenv()
        self.dataset_path = os.getenv("DATASET_PATH")
        self.inference_endpoint = os.getenv("INFERENCE_ENDPOINT")
        self.private_key = os.getenv("PRIVATE_KEY")
        self.total = 10
        self.mongo_handler = MongoDBHandler()
        self.index = faiss.read_index('./clip_handler/index.bin')

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
        payload = { "text": text }
        data = requests.post(
            self.inference_endpoint + "/clip/embed_text?api_key=" + self.private_key,
            json=payload
        )
        response = data.json()
        embedding = response["embeddings"]
        return embedding
    
    def search_items_by_image(self, query_image):
        query_embedding = self.get_image_embedding(query_image)
        D, I = self.index.search(np.array(query_embedding).astype(np.float32), int(os.getenv("TOTAL_ITEM")))
        res = self.mongo_handler.search_items_by_index(I[0])
        return res
    
    def search_items_by_text(self, query_text):
        query_embedding = self.get_text_embedding(query_text)
        D, I = self.index.search(np.array(query_embedding).astype(np.float32), int(os.getenv("TOTAL_ITEM")))
        res = self.mongo_handler.search_items_by_index(I[0])
        return res

    def insert_item(self, image, image_path):
        embedding = self.get_image_embedding(image)
        self.index.add(np.array(embedding).astype(np.float32))
        self.mongo_handler.insert_item(image_path)
        self.save()
        return
    
    def remove_item(self, id, image_path):
        self.index.remove_ids(np.array([id], dtype=np.int64))
        self.mongo_handler.remove_item(image_path)
        self.save()
        return
    
    def save(self):
        faiss.write_index(self.index, "./clip_handler/index.bin")
        return

    def recalculate(self):
        index = faiss.IndexFlatL2(512)
        documents = []
        for frame_name in os.listdir(self.dataset_path):
            try:
                frame = Image.open(os.path.join(self.dataset_path, frame_name))
            except IOError:
                print("error computing embedding for", frame_name)
                continue

            embedding = self.get_image_embedding(frame)
            index.add(np.array(embedding).astype(np.float32))
            documents.append({ 'url': frame_name})

        faiss.write_index(index, "./clip_handler/index.bin")
        self.index = index
        self.mongo_handler.delete_all_item()
        self.mongo_handler.insert_list_item(documents)
        return documents
