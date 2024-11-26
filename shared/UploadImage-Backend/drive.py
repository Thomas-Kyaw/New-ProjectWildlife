import uuid
import json
import os
import logging
import time
from threading import Thread
from flask import Flask, jsonify
from googleapiclient.discovery import build
from google.oauth2.service_account import Credentials

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler("/tmp/drive_copy.log"),
        logging.StreamHandler()
    ]
)

# Constants
SCOPES = ["https://www.googleapis.com/auth/drive"]
SERVICE_ACCOUNT_JSON = json.loads(os.environ.get("WATCH_DRIVE_JSON", "{}"))
PROCESSED_FILES_PATH = "/tmp/processed_files.json"

# Google Drive settings
folder_id = "1Gr5vH-6qRynMf_4wtOx6UlsplQKhsNpQ"
webhook_url = os.environ.get("WEBHOOK_URL", "https://new-projectwildlife-python-drivepy.onrender.com")
SOURCE_EMAIL = "clementchangcheng@gmail.com"
DESTINATION_FOLDER_ID = "1Gr5vH-6qRynMf_4wtOx6UlsplQKhsNpQ"

# Dummy web server
app = Flask(__name__)


@app.route("/")
def health_check():
    return jsonify({"status": "running", "message": "Google Drive Watcher is active!"})


def get_drive_service():
    """Authenticate and return the Google Drive API service."""
    creds = Credentials.from_service_account_info(SERVICE_ACCOUNT_JSON, scopes=SCOPES)
    return build("drive", "v3", credentials=creds)


def watch_drive_folder(folder_id, webhook_url):
    """Sets up a webhook to watch for changes in the specified Google Drive folder."""
    drive_service = get_drive_service()
    unique_channel_id = str(uuid.uuid4())

    request_body = {
        "id": unique_channel_id,
        "type": "webhook",
        "address": webhook_url,
        "params": {"ttl": "3600"}
    }
    response = drive_service.files().watch(fileId=folder_id, body=request_body).execute()
    logging.info(f"Watch response: {response}")


class DriveImageCopier:
    def __init__(self):
        self.service = get_drive_service()
        self.processed_files = self.load_processed_files()

    def load_processed_files(self):
        """Load the list of processed file IDs from a JSON file."""
        try:
            with open(PROCESSED_FILES_PATH, "r") as f:
                return json.load(f)
        except FileNotFoundError:
            return []

    def save_processed_files(self):
        """Save the list of processed file IDs to a JSON file."""
        if len(self.processed_files) > 1000:
            self.processed_files = self.processed_files[-1000:]
        with open(PROCESSED_FILES_PATH, "w") as f:
            json.dump(self.processed_files, f)

    def is_shared_by_target_user(self, file_id):
        """Check if the file is shared by the target user."""
        try:
            permissions = self.service.permissions().list(
                fileId=file_id,
                fields="permissions(emailAddress,role)"
            ).execute()
            for permission in permissions.get("permissions", []):
                if permission.get("emailAddress") == SOURCE_EMAIL:
                    return True
            return False
        except Exception as e:
            logging.error(f"Error checking file permissions: {e}")
            return False

    def copy_file(self, file_id, file_name):
        """Copy a file to the destination folder."""
        try:
            file_metadata = {
                "name": f"Copy of {file_name}",
                "parents": [DESTINATION_FOLDER_ID]
            }
            copied_file = self.service.files().copy(
                fileId=file_id,
                body=file_metadata
            ).execute()
            logging.info(f"Successfully copied file: {file_name}")
            return copied_file["id"]
        except Exception as e:
            logging.error(f"Error copying file {file_name}: {e}")
            return None

    def check_for_new_images(self):
        """Check for new shared images and copy them."""
        try:
            results = self.service.files().list(
                q="mimeType contains 'image/' and 'me' in readers and not 'me' in owners",
                fields="files(id, name)"
            ).execute()
            files = results.get("files", [])
            for file in files:
                file_id = file["id"]
                if file_id in self.processed_files:
                    continue
                if self.is_shared_by_target_user(file_id):
                    if self.copy_file(file_id, file["name"]):
                        self.processed_files.append(file_id)
                        self.save_processed_files()
                        logging.info(f"Processed file from {SOURCE_EMAIL}: {file['name']}")
        except Exception as e:
            logging.error(f"Error checking for new images: {e}")

    def run(self):
        """Run the continuous monitoring loop."""
        logging.info(f"Starting Drive Image Copier... Monitoring files from: {SOURCE_EMAIL}")
        while True:
            try:
                self.check_for_new_images()
                time.sleep(10)  # Check every 10 seconds
            except KeyboardInterrupt:
                logging.info("Stopping Drive Image Copier...")
                break
            except Exception as e:
                logging.error(f"Unexpected error: {e}")


def start_copier():
    """Start the Drive watcher in a separate thread."""
    copier = DriveImageCopier()
    copier.run()


def main():
    """Main entry point to start the web server and the Drive watcher."""
    # Set up the folder watch (only once)
    watch_drive_folder(folder_id, webhook_url)

    # Start the Drive watcher in a separate thread
    thread = Thread(target=start_copier)
    thread.start()

    # Start the Flask web server
    app.run(host="0.0.0.0", port=8080)


if __name__ == "__main__":
    main()
