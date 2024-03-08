import base64
import os
from io import BytesIO
import cv2
import faiss
import numpy as np
import requests
from PIL import Image
import json
import supervision as sv
from faiss import IDSelectorBatch

API_KEY = "rf_w9u9cZ1SjCMrxWILZPouHoLQ14r2"
PRIVATE_KEY = "bbH8SXQ4Z2qFvfZTh7NI"
DATASET_PATH = "./data"
# INFERENCE_ENDPOINT = "https://infer.roboflow.com"
INFERENCE_ENDPOINT = "http://localhost:9001"

def get_image_embedding(image: str) -> dict:
    image = image.convert("RGB")

    buffer = BytesIO()
    image.save(buffer, format="JPEG")
    image = base64.b64encode(buffer.getvalue()).decode("utf-8")

    payload = {
        # "body": PRIVATE_KEY,
        "image": {"type": "base64", "value": image},
    }

    data = requests.post(
    	INFERENCE_ENDPOINT + "/clip/embed_image?api_key=" + PRIVATE_KEY, json=payload
    )

    response = data.json()
    embedding = response["embeddings"]
    return embedding

# Handle embedding
# index = faiss.IndexFlatL2(512)
# file_names = []

# for frame_name in os.listdir(DATASET_PATH):
#     try:
#         frame = Image.open(os.path.join(DATASET_PATH, frame_name))
#     except IOError:
#         print("error computing embedding for", frame_name)
#         continue

#     embedding = get_image_embedding(frame)

#     index.add(np.array(embedding).astype(np.float32))

#     file_names.append(frame_name)

# faiss.write_index(index, "index.bin")

# with open("index.json", "w") as f:
#     json.dump(file_names, f)

# Predict
FILE_NAME = "./data/Shoe (999).jpg"
RESULTS_NUM = 7
index = faiss.read_index('index.bin')
index.remove_ids(np.array([14999], dtype=np.int64))
print(index.ntotal)
file_names = []
with open('index.json', "r") as f:
    file_names = json.load(f)
query = get_image_embedding(Image.open(FILE_NAME))
D, I = index.search(np.array(query).astype(np.float32), RESULTS_NUM)
print(I[0])
for i in I[0]:
    print(file_names[i])
images = [cv2.imread(os.path.join(DATASET_PATH, file_names[i])) for i in I[0]]

sv.plot_images_grid(images, (3, 3))

