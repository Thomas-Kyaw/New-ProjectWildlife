'''
Script to watch the Google Drive folder for new images shared by a specific user and copy them to the Project WildLife Folder in Google Drive which is set with main.py script.
'''
import uuid
import json
import os
import pickle
import logging
from googleapiclient.discovery import build # type: ignore
from google.oauth2 import service_account
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow # type: ignore
from google.auth.transport.requests import Request
from googleapiclient.http import MediaIoBaseDownload # type: ignore

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler('drive_copy.log'),
        logging.StreamHandler()
    ]
)

# Set up authentication for Drive API using service account key for watch
SCOPES = ['https://www.googleapis.com/auth/drive']
SERVICE_ACCOUNT_FILE = 'credentials/watch-drive.json'

# Authenticate and create the Drive API client
creds = service_account.Credentials.from_service_account_file(
    SERVICE_ACCOUNT_FILE, scopes=SCOPES)
drive_service = build('drive', 'v3', credentials=creds)

# Folder and webhook for watching
folder_id = '1Gr5vH-6qRynMf_4wtOx6UlsplQKhsNpQ'
webhook_url = 'https://d25d-2001-d08-e0-9b06-6df9-922c-9529-e42a.ngrok-free.app'

def watch_drive_folder(folder_id, webhook_url):
    """Sets up webhook to watch for changes in the Google Drive folder."""
    unique_channel_id = str(uuid.uuid4())
    
    request_body = {
        'id': unique_channel_id,
        'type': 'webhook',
        'address': webhook_url,
        'params': {
            'ttl': '3600'  # Set time-to-live for the watch request in seconds (optional)
        }
    }
    response = drive_service.files().watch(fileId=folder_id, body=request_body).execute()
    print('Watch response:', response)

# Drive copier for continuously running task
class DriveImageCopier:
    def __init__(self):
        self.SCOPES = ['https://www.googleapis.com/auth/drive']
        self.DESTINATION_FOLDER_ID = '1Gr5vH-6qRynMf_4wtOx6UlsplQKhsNpQ'
        self.SOURCE_EMAIL = 'paingchanyp@gmail.com'
        self.processed_files_file = 'processed_files.json'
        self.processed_files = self.load_processed_files()
        self.service = self.get_drive_service()

    def load_processed_files(self):
        """Load the list of processed file IDs from JSON file."""
        try:
            with open(self.processed_files_file, 'r') as f:
                return json.load(f)
        except FileNotFoundError:
            return []

    def save_processed_files(self):
        """Save the list of processed file IDs to JSON file."""
        # Keep only the last 1000 files to manage memory
        if len(self.processed_files) > 1000:
            self.processed_files = self.processed_files[-1000:]
        with open(self.processed_files_file, 'w') as f:
            json.dump(self.processed_files, f)

    def get_drive_service(self):
        """Get or create Drive API service."""
        creds = None
        
        # Load existing credentials from token.pickle
        if os.path.exists('credentials/token.pickle'):
            with open('credentials/token.pickle', 'rb') as token:
                creds = pickle.load(token)
        
        # If credentials don't exist or are invalid, get new ones
        if not creds or not creds.valid:
            if creds and creds.expired and creds.refresh_token:
                creds.refresh(Request())
            else:
                flow = InstalledAppFlow.from_client_secrets_file(
                    'credentials/credentials.json', self.SCOPES)
                creds = flow.run_local_server(port=0)
            
            # Save credentials for future use
            with open('credentials/token.pickle', 'wb') as token:
                pickle.dump(creds, token)

        return build('drive', 'v3', credentials=creds)

    def is_shared_by_target_user(self, file_id):
        """Check if the file is shared by the target user."""
        try:
            # Get the file's permissions
            permissions = self.service.permissions().list(
                fileId=file_id,
                fields="permissions(emailAddress,role)"
            ).execute()
            
            # Check if our target email is in the permissions
            for permission in permissions.get('permissions', []):
                if permission.get('emailAddress') == self.SOURCE_EMAIL:
                    return True
            return False
        except Exception as e:
            logging.error(f"Error checking file permissions: {str(e)}")
            return False

    def copy_file(self, file_id, file_name):
        """Copy a file to the destination folder."""
        try:
            # Create a copy of the file
            file_metadata = {
                'name': f'Copy of {file_name}',
                'parents': [self.DESTINATION_FOLDER_ID]
            }
            
            copied_file = self.service.files().copy(
                fileId=file_id,
                body=file_metadata
            ).execute()
            
            logging.info(f"Successfully copied file: {file_name}")
            return copied_file['id']
        except Exception as e:
            logging.error(f"Error copying file {file_name}: {str(e)}")
            return None

    def check_for_new_images(self):
        """Check for new shared images and copy them."""
        try:
            # Query for shared image files
            results = self.service.files().list(
                q="mimeType contains 'image/' and 'me' in readers and not 'me' in owners",
                fields="files(id, name, mimeType)"
            ).execute()
            
            files = results.get('files', [])
            
            for file in files:
                file_id = file['id']
                
                # Skip if already processed
                if file_id in self.processed_files:
                    continue
                
                # Check if the file is shared by our target user
                if self.is_shared_by_target_user(file_id):
                    # Copy the file and mark as processed
                    if self.copy_file(file_id, file['name']):
                        self.processed_files.append(file_id)
                        self.save_processed_files()
                        logging.info(f"Processed file from {self.SOURCE_EMAIL}: {file['name']}")
                
        except Exception as e:
            logging.error(f"Error checking for new images: {str(e)}")

    def run(self):
        """Run the continuous monitoring loop."""
        logging.info(f"Starting Drive Image Copier... Monitoring files from: {self.SOURCE_EMAIL}")
        
        while True:
            try:
                self.check_for_new_images()
            except KeyboardInterrupt:
                logging.info("Stopping Drive Image Copier...")
                break
            except Exception as e:
                logging.error(f"Unexpected error: {str(e)}")

def main():
    # First, set up the folder watch (runs only once)
    watch_drive_folder(folder_id, webhook_url)
    
    # Then, continuously run the image copier (for file monitoring)
    copier = DriveImageCopier()
    copier.run()

if __name__ == '__main__':
    main()