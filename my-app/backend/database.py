from pymongo import MongoClient

# Connect to local MongoDB (default URI)
client = MongoClient("mongodb://localhost:27017/")

# Choose (or create) a database called vitefait
db = client["vitefait"]
