'''
Script to watch the static/annotated folder for new images and corresponding CSV files and upload them to MongoDB WildLife collection of WildLife database.
'''
import base64
import os
import time
from pymongo import MongoClient  # type: ignore
from watchdog.observers import Observer # type: ignore
from watchdog.events import FileSystemEventHandler # type: ignore

# MongoDB connection details
mongo_url = "mongodb://localhost:27017"
db_name = "WildLife"  # Replace with your database name
collection_name = "WildLife"  # Replace with your collection name
watch_folder = "static/annotated"  # Path to the folder you want to watch for both images and CSVs

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

    # Insert both files into MongoDB
    result = collection.insert_one({
        "image_filename": os.path.basename(image_path),
        "image_data": image_base64,
        "csv_filename": os.path.basename(csv_path),
        "csv_data": csv_base64
    })
    print(f"Files uploaded successfully with Document ID: {result.inserted_id}")

    client.close()

# Event Handler for File System Changes
class FileChangeHandler(FileSystemEventHandler):
    def on_created(self, event):
        # Triggered when a file is created
        if event.is_directory:
            return

        # Check if the new file is an image
        file_extension = os.path.splitext(event.src_path)[1].lower()
        if file_extension in ['.jpg', '.jpeg', '.png', '.gif']:  # Add more image formats if needed
            image_path = event.src_path
            base_name = os.path.basename(image_path).replace('annotated_', '').split('.')[0]  # Extract the base name
            csv_path = os.path.join(watch_folder, f"data_{base_name}.csv")  # Find the corresponding CSV file

            print(f"New image detected: {image_path}. Waiting for the corresponding CSV file...")
            # Wait for some time (e.g., 5 seconds) before checking for the corresponding CSV file
            time.sleep(5)  # Wait for 5 seconds

            # Check if the corresponding CSV file exists after the wait
            if os.path.exists(csv_path):
                print(f"Corresponding CSV found: {csv_path}. Uploading both files...")
                upload_files_as_base64(image_path, csv_path)  # Upload both image and CSV
            else:
                print(f"Corresponding CSV still not found for image: {image_path}. Try again later.")
        elif file_extension == '.csv':
            print(f"New CSV file detected: {event.src_path}")
        else:
            print(f"New non-supported file detected: {event.src_path}")

# Set up observer to watch for changes in the specified folder
def start_watching():
    event_handler = FileChangeHandler()

    # Watch for both images and CSVs in the same folder
    observer = Observer()
    observer.schedule(event_handler, path=watch_folder, recursive=False)
    observer.start()
    print(f"Watching folder: {watch_folder}")
    
    try:
        while True:
            pass  # Keep the script running to watch for changes
    except KeyboardInterrupt:
        observer.stop()
        print("Stopped watching folder")
    observer.join()

# Start the watcher
start_watching()