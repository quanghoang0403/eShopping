import pymongo
import os
from dotenv import load_dotenv

class MongoDBHandler:
    def __init__(self):
        load_dotenv()
        self.client = pymongo.MongoClient(os.getenv("MONGO_URI"))
        self.db = self.client[os.getenv("MONGO_DB")]
        self.collection = self.db[os.getenv("MONGO_COLLECTION")]

    def insert_item(self, item):
        try:
            result = self.collection.insert_one(item)
            print(f"Inserted item with _id: {result.inserted_id}")
            return result.inserted_id
        except Exception as e:
            print(f"Error inserting item: {e}")
            return None

    def remove_item(self, item_id):
        try:
            result = self.collection.delete_one({"_id": item_id})
            if result.deleted_count > 0:
                print(f"Deleted item with _id: {item_id}")
                return True
            else:
                print("Item not found")
                return False
        except Exception as e:
            print(f"Error removing item: {e}")
            return False

    def get_item_by_index(self, item_id):
        try:
            item = self.collection.find_one({"_id": item_id})
            if item:
                return item
            else:
                print("Item not found")
                return None
        except Exception as e:
            print(f"Error getting item: {e}")
            return None
        
    def get_index_by_url(self, url):
        try:
            # Find the document with the specified name
            document = self.collection.find_one({"url": url})
            if document:
                # Get the index of the document in the collection
                index = list(self.collection.find({"url": url})).index(document)
                return index
            else:
                print(f"No document found with url '{url}'")
                return None
        except Exception as e:
            print(f"Error retrieving index: {e}")
            return None
    
    def search_items_by_index(self, item_ids):
        try:
            # Find documents where the _id field matches any of the given document_ids
            cursor = self.collection.find({"_id": {"$in": item_ids}})
            # Convert cursor to a list of documents
            documents = list(cursor)
            return documents
        except Exception as e:
            print(f"Error retrieving documents: {e}")
            return []
