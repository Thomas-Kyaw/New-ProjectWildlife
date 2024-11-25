import os
import time
import base64
from datetime import datetime
from pymongo import MongoClient
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

# Environment variables for MongoDB and folder paths
mongo_url = os.environ.get("MONGO_URL", "mongodb+srv://thomaskyaw69:<987654321>@uni-project-cluster.as7yc.mongodb.net/")
db_name = "WildLife"
collection_name = "WildLife"
watch_folder = os.environ.get("WATCH_FOLDER", "static/annotated")

# Ensure the watch folder exists
os.makedirs(watch_folder, exist_ok=True)

# Function to upload files as base64 to MongoDB
def upload_files_as_base64(image_path, csv_path):
    client = MongoClient(mongo_url)
    db = client[db_name]
    collection = db[collection_name]

    # Read image and encode as base64
    with open(image_path, "rb") as image_file:
        image_base64 = base64.b64encode(image_file.read()).decode("utf-8")

    # Read CSV file and encode as base64
    with open(csv_path, "rb") as csv_file:
        csv_base64 = base64.b64encode(csv_file.read()).decode("utf-8")

    # Insert both files with createdAt timestamp into MongoDB
    result = collection.insert_one({
        "image_filename": os.path.basename(image_path),
        "image_data": image_base64,
        "csv_filename": os.path.basename(csv_path),
        "csv_data": csv_base64,
        "createdAt": datetime.utcnow().isoformat(timespec='milliseconds') + "Z"
    })
    print(f"Files uploaded successfully with Document ID: {result.inserted_id}")

    client.close()

# Event handler for filesystem changes
class FileChangeHandler(FileSystemEventHandler):
    def on_created(self, event):
        if event.is_directory:
            return

        file_extension = os.path.splitext(event.src_path)[1].lower()
        if file_extension in ['.jpg', '.jpeg', '.png', '.gif']:
            image_path = event.src_path
            base_name = os.path.basename(image_path).replace('annotated_', '').split('.')[0]
            csv_path = os.path.join(watch_folder, f"data_{base_name}.csv")

            print(f"New image detected: {image_path}. Waiting for the corresponding CSV file...")
            time.sleep(5)  # Wait for the corresponding CSV file

            if os.path.exists(csv_path):
                print(f"Corresponding CSV found: {csv_path}. Uploading both files...")
                upload_files_as_base64(image_path, csv_path)
            else:
                print(f"Corresponding CSV still not found for image: {image_path}. Try again later.")
        elif file_extension == '.csv':
            print(f"New CSV file detected: {event.src_path}")
        else:
            print(f"New non-supported file detected: {event.src_path}")

# Start the file watcher
def start_watching():
    event_handler = FileChangeHandler()
    observer = Observer()
    observer.schedule(event_handler, path=watch_folder, recursive=False)
    observer.start()
    print(f"Watching folder: {watch_folder}")

    try:
        while True:
            time.sleep(1)  # Keep the script running
    except KeyboardInterrupt:
        observer.stop()
        print("Stopped watching folder")
    observer.join()

if __name__ == "__main__":
    print("Starting file watcher service...")
    start_watching()
