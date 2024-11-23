import os
import re
import csv
import cv2
import io
import logging
import uvicorn
from pathlib import Path
from fastapi import FastAPI, File, UploadFile, Request, HTTPException
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from google.cloud import vision
from ultralytics import YOLO
from datetime import datetime, timezone
from googleapiclient.discovery import build # type: ignore
from google.oauth2 import service_account
from collections import OrderedDict
from fastapi.responses import StreamingResponse

# MongoDB connection setup
MONGODB_URI = "mongodb+srv://thomaskyaw69:<987654321>@uni-project-cluster.as7yc.mongodb.net/"
DB_NAME = "WildLife"

class ProcessedFilesCache:
    def __init__(self, maxsize=100):
        self.cache = OrderedDict()
        self.maxsize = maxsize
        
    def add(self, file_id, timestamp):
        # Ensure timestamp is timezone-aware
        if timestamp.tzinfo is None:
            timestamp = timestamp.replace(tzinfo=timezone.utc)
        if len(self.cache) >= self.maxsize:
            self.cache.popitem(last=False)
        self.cache[file_id] = timestamp
        
    def was_recently_processed(self, file_id, within_seconds=300):
        if file_id not in self.cache:
            return False
        current_time = datetime.now(timezone.utc)
        time_diff = current_time - self.cache[file_id]
        return time_diff.total_seconds() < within_seconds

    def get_last_processed_time(self, file_id):
        return self.cache.get(file_id)

# Initialize the cache
processed_files = ProcessedFilesCache()

# Set up logging first
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s'
)

# Use the updated paths
WATCH_DRIVE_CREDENTIALS_PATH = '/etc/secrets/WATCH_DRIVE_JSON'
CLOUD_VISION_CREDENTIALS_PATH = '/etc/secrets/CLOUD_VISION_JSON'

# Set up authentication using the service account key
SCOPES = ['https://www.googleapis.com/auth/drive']
SERVICE_ACCOUNT_FILE = 'WATCH_DRIVE_CREDENTIALS_PATH'

# Authenticate and create the Drive API client
creds = service_account.Credentials.from_service_account_file(
    SERVICE_ACCOUNT_FILE, scopes=SCOPES)
drive_service = build('drive', 'v3', credentials=creds)

# Initialize FastAPI app
app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


os.makedirs("static/uploads", exist_ok=True)
os.makedirs("static/annotated", exist_ok=True)

# Directory setup
UPLOAD_DIRECTORY = "static/uploads/"
ANNOTATED_DIRECTORY = "static/annotated/"
OUTPUT_DIRECTORY = "static/annotated/"

for directory in [UPLOAD_DIRECTORY, ANNOTATED_DIRECTORY, OUTPUT_DIRECTORY]:
    os.makedirs(directory, exist_ok=True)

# Serve static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Load YOLOv8 model
model = YOLO("best.pt")

# Set up Google Cloud Vision API credentials
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = 'CLOUD_VISION_CREDENTIALS_PATH'

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

def extract_date_time_temperature(text):
    """
    Extract date, time, and temperature from text with specific formatting.
    Converts Fahrenheit temperatures to Celsius and standardizes temperature storage.
    
    Args:
        text (str): Input text containing date, time and temperature data
        
    Returns:
        list: List of dictionaries containing formatted date, time and standardized temperature data
        
    Example:
        Input: "2024-01-01 14:30:45 77°F"
        Output: [{"Date": "2024-01-01", "Time": "14:30:45", "Temperature": 25}]  # Converted to Celsius
    """
    # Updated patterns to match exact formats
    date_pattern = r'\b(\d{4}-\d{2}-\d{2})\b'
    time_pattern = r'\b(\d{2}:\d{2}:\d{2})\b'
    # Capture number and unit separately
    temp_pattern = r'\b(\d{1,3})(°[CF]?)\b'

    def fahrenheit_to_celsius(temp_f):
        """Convert Fahrenheit to Celsius and round to nearest integer"""
        return round((float(temp_f) - 32) * 5/9)

    # Replace any variant of degree symbol with a standard one
    text = text.replace("�", "°")
    
    # Find all matches
    dates = re.findall(date_pattern, text)
    times = re.findall(time_pattern, text)
    temps_with_symbols = re.findall(temp_pattern, text)
    
    # Create list of dictionaries with properly formatted data
    data = []
    for i in range(min(len(dates), len(times), len(temps_with_symbols))):
        temp_value = temps_with_symbols[i][0]
        temp_unit = temps_with_symbols[i][1]
        
        # Convert temperature if it's Fahrenheit
        if 'F' in temp_unit:
            temperature = fahrenheit_to_celsius(temp_value)
        else:
            temperature = int(temp_value)  # Convert to integer for consistency
            
        data.append({
            "Date": dates[i],
            "Time": times[i],
            "Temperature": temperature  # Store as numeric value
        })
    
    return data

def save_to_csv(data, output_file):
    """
    Save the extracted data to CSV in the exact specified format.
    """
    if not data:
        return
        
    # Ensure the output directory exists
    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    
    # Write to CSV with specific formatting
    with open(output_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        # Write header
        writer.writerow(["Date", "Time", "Temperature"])
        # Write data rows
        for entry in data:
            writer.writerow([
                entry["Date"],
                entry["Time"],
                entry["Temperature"]
            ])




def store_image_in_mongodb(file_path, filename):
    """
    Store an image in MongoDB using GridFS.
    """
    with open(file_path, "rb") as file_data:
        file_id = fs.put(file_data, filename=filename)
    return file_id

@app.post("/detect/")
async def detect(file: UploadFile = File(...)):
    try:
        # Validate the uploaded file
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")

        # Call process_image and pass the uploaded file
        result = await process_image(file)
        return result

    except Exception as e:
        logging.error(f"Error in detect endpoint: {e}")
        raise HTTPException(status_code=500, detail=str(e))


def detect_text(image_path):
    """
    Detect text from image using Google Cloud Vision API with enhanced error handling.
    """
    client = vision.ImageAnnotatorClient()
    
    try:
        with open(image_path, 'rb') as image_file:
            content = image_file.read()
        
        image = vision.Image(content=content)
        response = client.text_detection(image=image)
        
        if response.error.message:
            logging.error(f"Error in text detection: {response.error.message}")
            return ""
            
        texts = response.text_annotations
        if not texts:
            logging.warning("No text detected in the image")
            return ""
            
        return texts[0].description
        
    except Exception as e:
        logging.error(f"Error in detect_text: {str(e)}")
        return ""

def process_image_and_generate_csv(image_path):
    """
    Processes an image, annotates it, and extracts text to generate a CSV file.
    Added enhanced logging and error handling.
    """
    try:
        # Load and validate image
        image = cv2.imread(image_path)
        if image is None:
            raise Exception(f"Failed to read image file: {image_path}")

        # Process with YOLO
        results = model(image)
        annotated_image = results[0].plot()

        # Save annotated image
        annotated_filename = f"annotated_{Path(image_path).stem}.jpg"
        annotated_image_path = os.path.join(ANNOTATED_DIRECTORY, annotated_filename)
        cv2.imwrite(annotated_image_path, annotated_image)
        logging.info(f"Saved annotated image to {annotated_image_path}")

        # Detect text
        logging.info("Starting text detection...")
        detected_text = detect_text(image_path)
        if not detected_text:
            logging.warning("No text detected in the image")
            # Create empty CSV with headers even if no text is detected
            extracted_data = []
        else:
            logging.info(f"Detected text: {detected_text}")
            extracted_data = extract_date_time_temperature(detected_text)
            logging.info(f"Extracted data: {extracted_data}")

        # Save CSV
        csv_filename = f"data_{Path(image_path).stem}.csv"
        csv_output_path = os.path.join(OUTPUT_DIRECTORY, csv_filename)
        
        # Ensure the output directory exists
        os.makedirs(os.path.dirname(csv_output_path), exist_ok=True)
        
        # Write CSV with headers even if no data
        with open(csv_output_path, 'w', newline='', encoding='utf-8') as f:
            writer = csv.writer(f)
            writer.writerow(["Date", "Time", "Temperature"])
            for entry in extracted_data:
                writer.writerow([
                    entry["Date"],
                    entry["Time"],
                    entry["Temperature"]
                ])
        
        logging.info(f"Saved CSV file to {csv_output_path}")
        
        return annotated_image_path, csv_output_path

    except Exception as e:
        logging.error(f"Error in process_image_and_generate_csv: {str(e)}")
        raise

@app.post("/process-image/")
async def process_image(file: UploadFile = File(...)):
    """
    Process an uploaded image with enhanced error handling and validation.
    """
    try:
        # Validate file type
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Create temporary file
        temp_path = f"{UPLOAD_DIRECTORY}{file.filename}"
        os.makedirs(os.path.dirname(temp_path), exist_ok=True)
        
        # Save uploaded file
        with open(temp_path, "wb") as temp_file:
            content = await file.read()
            temp_file.write(content)
        
        logging.info(f"Saved uploaded file to {temp_path}")
        
        # Process the image
        try:
            annotated_image_path, csv_output_path = process_image_and_generate_csv(temp_path)
            
            # Verify files were created
            if not os.path.exists(annotated_image_path):
                raise Exception("Annotated image was not created")
            if not os.path.exists(csv_output_path):
                raise Exception("CSV file was not created")
                
            return {
                "image_path": annotated_image_path.replace("static/", "/static/"),
                "csv_path": csv_output_path.replace("static/", "/static/")
            }
            
        finally:
            # Cleanup temporary file
            if os.path.exists(temp_path):
                os.remove(temp_path)
                logging.info(f"Cleaned up temporary file: {temp_path}")

    except Exception as e:
        logging.error(f"Error processing image: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/files/{file_id}")
async def get_file(file_id: str):
    """
    Retrieve a file from MongoDB by its ID.
    """
    file_data = fs.get(file_id)
    return StreamingResponse(io.BytesIO(file_data.read()), media_type=file_data.contentType)

async def process_drive_image(resource_id):
    try:
        logging.info(f"Processing notification for resource: {resource_id}")
        
        folder_id = '1Gr5vH-6qRynMf_4wtOx6UlsplQKhsNpQ'
        
        response = drive_service.files().list(
            q=f"'{folder_id}' in parents",
            orderBy="modifiedTime desc",
            pageSize=5,
            fields="files(id, name, mimeType, modifiedTime)"
        ).execute()
        
        files = response.get("files", [])
        if not files:
            logging.warning("No files found in the monitored folder.")
            return

        for file_info in files:
            file_id = file_info["id"]
            # Parse the datetime and ensure it's timezone-aware
            modified_time = datetime.fromisoformat(
                file_info["modifiedTime"].replace('Z', '+00:00')
            )
            
            last_processed_time = processed_files.get_last_processed_time(file_id)
            
            if last_processed_time:
                # Ensure both datetimes are timezone-aware for comparison
                if last_processed_time.tzinfo is None:
                    last_processed_time = last_processed_time.replace(tzinfo=timezone.utc)
                if modified_time.tzinfo is None:
                    modified_time = modified_time.replace(tzinfo=timezone.utc)
                    
                if modified_time <= last_processed_time:
                    logging.info(f"Skipping already processed file {file_id} (last processed at {last_processed_time})")
                    continue
            
            logging.info(f"Processing file - ID: {file_id}, Name: {file_info['name']}, Modified: {modified_time}")
            
            # Add the file to our processed cache with timezone-aware timestamp
            processed_files.add(file_id, datetime.now(timezone.utc))
            
            if not file_info['mimeType'].startswith('image/'):
                logging.warning(f"File {file_id} is not an image: {file_info['mimeType']}")
                continue
            
            # Process the image
            image_path = os.path.join(UPLOAD_DIRECTORY, f"{file_id}.jpg")
            
            try:
                # Download the file
                downloader = drive_service.files().get_media(fileId=file_id)
                content = downloader.execute()
                
                with open(image_path, "wb") as f:
                    f.write(content)
                
                logging.info(f"Downloaded file successfully to {image_path}")
                
                # Process with YOLO
                image = cv2.imread(image_path)
                if image is None:
                    raise Exception(f"Failed to read image file: {image_path}")
                
                results = model(image)
                annotated_image = results[0].plot()
                
                annotated_filename = f"annotated_{file_id}.jpg"
                output_annotated_path = os.path.join(ANNOTATED_DIRECTORY, annotated_filename)
                cv2.imwrite(output_annotated_path, annotated_image)
                
                # Process text and save to CSV
                detected_text = detect_text(image_path)
                extracted_data = extract_date_time_temperature(detected_text)
                output_csv_file = os.path.join(OUTPUT_DIRECTORY, f'data_{file_id}.csv')
                save_to_csv(extracted_data, output_csv_file)
                
                logging.info(f"Successfully processed file {file_id}")
                
            finally:
                # Cleanup
                if os.path.exists(image_path):
                    os.remove(image_path)
                    logging.info(f"Cleaned up temporary file: {image_path}")

    except Exception as e:
        logging.error(f"Error processing notification: {str(e)}")
        raise

# Add root endpoint handler
@app.post("/")
async def root_webhook(request: Request):
    """Handle webhook notifications at the root path"""
    return await drive_webhook_post(request)

@app.post("/drive-webhook")
async def drive_webhook_post(request: Request):
    try:
        headers = dict(request.headers)
        logging.info("=== Webhook Request Details ===")
        logging.info(f"Headers: {headers}")
        
        resource_state = headers.get('x-goog-resource-state')
        if not resource_state:
            logging.warning("Missing resource state in webhook request")
            return JSONResponse(status_code=400, content={"status": "error", "message": "Invalid webhook request"})
        
        if resource_state not in ['changes', 'update', 'sync']:
            logging.info(f"Ignoring notification with resource state: {resource_state}")
            return JSONResponse(status_code=200, content={"status": "ignored"})
        
        changed = headers.get('x-goog-changed', '')
        resource_id = headers.get('x-goog-resource-id')
        channel_id = headers.get('x-goog-channel-id')
        
        logging.info(f"Processing notification - Resource ID: {resource_id}, Channel ID: {channel_id}")
        
        if resource_id:
            await process_drive_image(resource_id)
        
        return JSONResponse(status_code=200, content={"status": "success"})
    
    except Exception as e:
        logging.error(f"Error in webhook handler: {str(e)}")
        return JSONResponse(status_code=500, content={"status": "error", "message": str(e)})


if __name__ == "__main__":
    # Configure more detailed logging
    logging.basicConfig(
        level=logging.INFO,
        format='%(asctime)s - %(levelname)s - %(message)s',
        handlers=[
            logging.StreamHandler(),
            logging.FileHandler('drive_webhook.log')
        ]
    )
    
    # Get the port from the environment variable or default to 8000
    port = int(os.environ.get("PORT", 8000))
    
    # Run the server
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=port,
        log_level="info"
    )