import uuid
import json
import os
import logging
from googleapiclient.discovery import build
from google.oauth2 import service_account

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler("drive_copy.log"),
        logging.StreamHandler()
    ]
)

# Set up authentication for Drive API using service account credentials from environment
SCOPES = ["https://www.googleapis.com/auth/drive"]

# Load WATCH_DRIVE_JSON and CREDENTIALS_JSON from Render environment variables
WATCH_DRIVE_JSON = json.loads(os.environ.get("WATCH_DRIVE_JSON", "{}"))
CREDENTIALS_JSON = json.loads(os.environ.get("CREDENTIALS_JSON", "{}"))


def get_drive_service():
    """Authenticate and return the Drive API service using a service account."""
    credentials = service_account.Credentials.from_service_account_info(
        WATCH_DRIVE_JSON, scopes=SCOPES
    )
    return build("drive", "v3", credentials=credentials)


# Folder and webhook for watching
folder_id = "1Gr5vH-6qRynMf_4wtOx6UlsplQKhsNpQ"  # Replace with your target folder ID
webhook_url = os.environ.get(
    "WEBHOOK_URL", "https://new-projectwildlife-python-drivepy.onrender.com"
)


def watch_drive_folder(folder_id, webhook_url):
    """Sets up webhook to watch for changes in the Google Drive folder."""
    drive_service = get_drive_service()
    unique_channel_id = str(uuid.uuid4())

    request_body = {
        "id": unique_channel_id,
        "type": "webhook",
        "address": webhook_url,
        "params": {
            "ttl": "3600"  # Set time-to-live for the watch request in seconds (optional)
        }
    }
    response = drive_service.files().watch(fileId=folder_id, body=request_body).execute()
    print("Watch response:", response)


def main():
    # Set up the folder watch
    watch_drive_folder(folder_id, webhook_url)


if __name__ == "__main__":
    main()
