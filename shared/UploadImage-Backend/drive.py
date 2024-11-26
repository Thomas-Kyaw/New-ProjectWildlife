import uuid
import json
import os
import logging
import time
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from google_auth_oauthlib.flow import InstalledAppFlow

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler("/tmp/drive_copy.log"),  # Save log file in a writable directory
        logging.StreamHandler()
    ]
)

# Constants
SCOPES = ["https://www.googleapis.com/auth/drive"]
CREDENTIALS_JSON = json.loads(os.environ.get("CREDENTIALS_JSON", "{}"))  # Loaded from Render secrets
TOKEN_JSON_PATH = "/tmp/token.json"  # Writable path for token.json
PROCESSED_FILES_PATH = "/tmp/processed_files.json"  # Writable path for processed files

# Google Drive settings
folder_id = "1Gr5vH-6qRynMf_4wtOx6UlsplQKhsNpQ"  # Replace with your target folder ID
webhook_url = os.environ.get("WEBHOOK_URL", "https://new-projectwildlife-python-drivepy.onrender.com")
SOURCE_EMAIL = "clementchangcheng@gmail.com"  # Email of the user sharing files
DESTINATION_FOLDER_ID = "1Gr5vH-6qRynMf_4wtOx6UlsplQKhsNpQ"  # Replace with your destination folder ID


def get_drive_service():
    """
    Authenticate and return the Google Drive API service.
    Uses the token.json for refreshed tokens and CREDENTIALS_JSON for the initial flow.
    """
    creds = None

    # Load existing credentials from token.json
    if os.path.exists(TOKEN_JSON_PATH):
        with open(TOKEN_JSON_PATH, "r") as token_file:
            creds_info = json.load(token_file)
            creds = Credentials.from_authorized_user_info(creds_info, SCOPES)

    # If credentials are invalid or missing, use InstalledAppFlow
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            flow = InstalledAppFlow.from_client_config(CREDENTIALS_JSON, SCOPES)
            creds = flow.run_local_server(port=0)

        # Save the new token to token.json
        with open(TOKEN_JSON_PATH, "w") as token_file:
            json.dump(json.loads(creds.to_json()), token_file)

    return build("drive", "v3", credentials=creds)


def watch_drive_folder(folder_id, webhook_url):
    """
    Sets up a webhook to watch for changes in the specified Google Drive folder.
    """
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
        """
        Load the list of processed file IDs from a JSON file.
        """
        try:
            with open(PROCESSED_FILES_PATH, "r") as f:
                return json.load(f)
        except FileNotFoundError:
            return []

    def save_processed_files(self):
        """
        Save the list of processed file IDs to a JSON file.
        """
        if len(self.processed_files) > 1000:
            self.processed_files = self.processed_files[-1000:]
        with open(PROCESSED_FILES_PATH, "w") as f:
            json.dump(self.processed_files, f)

    def is_shared_by_target_user(self, file_id):
        """
        Check if the file is shared by the target user.
        """
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
        """
        Copy a file to the destination folder.
        """
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
        """
        Check for new shared images and copy them.
        """
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
        """
        Run the continuous monitoring loop.
        """
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


def main():
    # First, set up the folder watch (runs only once)
    watch_drive_folder(folder_id, webhook_url)

    # Then, continuously run the image copier (for file monitoring)
    copier = DriveImageCopier()
    copier.run()


if __name__ == "__main__":
    main()
