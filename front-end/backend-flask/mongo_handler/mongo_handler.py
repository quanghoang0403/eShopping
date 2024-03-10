import pymongo
import os
from dotenv import load_dotenv

class MongoDBHandler:
    def __init__(self):
        load_dotenv()
        print(os.getenv("MONGO_URI"))
        try:
            self.client = pymongo.MongoClient(os.getenv("MONGO_URI"))
            self.db = self.client[os.getenv("MONGO_DB")]
            self.collection = self.db[os.getenv("MONGO_COLLECTION")]
            print("Connected to MongoDB successfully!")
        except Exception as e:
            print("Failed to connect to MongoDB:", e)

    def insert_list_item(self, list_item):
        try:
            result = self.collection.insert_many(list_item)
            print(f"Inserted item with _id: {result.inserted_ids}")
            return result.inserted_ids
        except Exception as e:
            print(f"Error inserting item: {e}")

    def delete_all_item(self):
        try:
            self.collection.delete_many({})
            return True
        except Exception as e:
            return False

    def insert_item(self, image_path):
        try:
            result = self.collection.insert_one({ 'url': image_path})
            print(f"Inserted item with _id: {result.inserted_id}")
            return result.inserted_id
        except Exception as e:
            print(f"Error inserting item: {e}")

    def remove_item(self, image_path):
        try:
            result = self.collection.delete_one({"url": image_path})
            if result.deleted_count > 0:
                print(f"Deleted item with _id: {image_path}")
                return True
            else:
                print("Item not found")
                return False
        except Exception as e:
            print(f"Error removing item: {e}")
            return False
    
    def search_items_by_index(self, item_ids):
        try:
            res = []
            for id in item_ids:
                document = self.collection.find().skip(int(id)).limit(1)
                res.append({"id": int(id), "url": document[0]["url"]})
            return res
        except Exception as e:
            print(f"Error retrieving documents: {e}")
            return []
