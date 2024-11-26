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

# Logging Configuration
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[
        logging.FileHandler("app.log"),  # Save logs to a file
        logging.StreamHandler()  # Output logs to the console
    ]
)

# Use the updated paths
WATCH_DRIVE_CREDENTIALS_PATH = '/etc/secrets/WATCH_DRIVE_JSON'
CLOUD_VISION_CREDENTIALS_PATH = '/etc/secrets/CLOUD_VISION_JSON'

# Set up authentication using the service account key
SCOPES = ['https://www.googleapis.com/auth/drive']
SERVICE_ACCOUNT_FILE = WATCH_DRIVE_CREDENTIALS_PATH

# Authenticate and create the Drive API client
creds = service_account.Credentials.from_service_account_file(
    SERVICE_ACCOUNT_FILE, scopes=SCOPES)
drive_service = build('drive', 'v3', credentials=creds)

# Initialize FastAPI app
app = FastAPI()

# Allowed origins
origins = [
    "https://new-projectwildlife-website.onrender.com/",  # Your React frontend URL
    "http://localhost:3000",  # Allow localhost for development purposes
]

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,  # Allow specific origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all HTTP headers
)


os.makedirs("static/uploads", exist_ok=True)
os.makedirs("static/annotated", exist_ok=True)

# Directory setup
UPLOAD_DIRECTORY = "static/uploads/"
ANNOTATED_DIRECTORY = "static/annotated/"
OUTPUT_DIRECTORY = "static/csv/"

for directory in [UPLOAD_DIRECTORY, ANNOTATED_DIRECTORY, OUTPUT_DIRECTORY]:
    os.makedirs(directory, exist_ok=True)

# Serve static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Load YOLOv8 model
model = YOLO("best.pt")

# Set up Google Cloud Vision API credentials
os.environ['GOOGLE_APPLICATION_CREDENTIALS'] = CLOUD_VISION_CREDENTIALS_PATH

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}


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



# Save to CSV
def save_to_csv(data, output_file, species_data=None):
    headers = ["Date", "Time", "Temperature"]
    if species_data:
        headers += ["Species", "Confidence"]

    rows = [headers]
    max_len = max(len(data), len(species_data or []))

    for i in range(max_len):
        row = []
        if i < len(data):
            row += [data[i].get("Date", ""), data[i].get("Time", ""), data[i].get("Temperature", "")]
        else:
            row += ["", "", ""]
        if species_data and i < len(species_data):
            row += [species_data[i].get("Species", ""), species_data[i].get("Confidence", "")]
        else:
            row += ["", ""]
        rows.append(row)

    with open(output_file, "w", newline="", encoding="utf-8") as f:
        writer = csv.writer(f)
        writer.writerows(rows)

# Extract Date, Time, and Temperature
def extract_date_time_temperature(text):
    date_pattern = r"\b(\d{4}-\d{2}-\d{2})\b"
    time_pattern = r"(\d{1,2}:\d{2}:\d{2}(?:\s*[APap][Mm])?)"
    temp_pattern = r"(\d+(?:\.\d+)?)\s*(?:°|degrees?|deg)?\s*([FC])"

    def convert_to_celsius(temp_f):
        return round((float(temp_f) - 32) * 5 / 9)

    dates = re.findall(date_pattern, text)
    times = re.findall(time_pattern, text)
    temps = re.findall(temp_pattern, text)

    data = []
    for i in range(max(len(dates), len(times), len(temps))):
        entry = {
            "Date": dates[i] if i < len(dates) else "",
            "Time": times[i] if i < len(times) else "",
            "Temperature": (
                convert_to_celsius(float(temps[i][0])) if temps[i][1].upper() == "F" else float(temps[i][0])
            ) if i < len(temps) else ""
        }
        data.append(entry)

    return data

# Process Image and Generate CSV
def process_image_and_generate_csv(image_path):
    try:
        image = cv2.imread(image_path)
        if image is None:
            raise Exception(f"Invalid image file: {image_path}")

        results = model(image)
        annotated_image = results[0].plot()
        detected_species = [
            {"Species": model.names[int(result.cls)], "Confidence": round(result.conf[0] * 100, 2)}
            for result in results[0].boxes
        ]

        detected_text = detect_text(image_path)
        extracted_data = extract_date_time_temperature(detected_text)

        base_name = Path(image_path).stem
        annotated_image_path = os.path.join(ANNOTATED_DIRECTORY, f"annotated_{base_name}.jpg")
        csv_path = os.path.join(OUTPUT_DIRECTORY, f"{base_name}.csv")

        cv2.imwrite(annotated_image_path, annotated_image)
        save_to_csv(extracted_data, csv_path, detected_species)

        return annotated_image_path, csv_path
    except Exception as e:
        logging.error(f"Error processing image: {e}")
        raise

# Text Extraction Using Google Vision
def detect_text(image_path):
    client = vision.ImageAnnotatorClient()
    try:
        with open(image_path, 'rb') as image_file:
            content = image_file.read()
        image = vision.Image(content=content)
        response = client.text_detection(image=image)

        if response.error.message:
            raise Exception(f"Google Vision API Error: {response.error.message}")

        texts = response.text_annotations
        return texts[0].description if texts else ""
    except Exception as e:
        logging.error(f"Error in detect_text: {e}")
        return ""
        
    except Exception as e:
        logging.error(f"Error in detect_text: {str(e)}")
        return ""
    
# Process Image Endpoint
@app.post("/process-image/")
async def process_image(file: UploadFile = File(...)):
    try:
        if not file.content_type.startswith("image/"):
            raise HTTPException(status_code=400, detail="Invalid file type. Please upload an image.")

        file_path = os.path.join(UPLOAD_DIRECTORY, file.filename)
        with open(file_path, "wb") as buffer:
            buffer.write(await file.read())

        annotated_path, csv_path = process_image_and_generate_csv(file_path)
        return {
            "image_path": annotated_path.replace("static/", "/static/"),
            "csv_path": csv_path.replace("static/", "/static/")
        }
    except Exception as e:
        logging.error(f"Error processing image: {e}")
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