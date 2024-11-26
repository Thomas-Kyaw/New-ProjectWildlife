import React, { useState } from "react";
import styles from "../styles/UploadImage.module.css";

const UploadImage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [csvUrl, setCsvUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setIsLoading(true);
    setErrorMessage("");

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch(
        "https://new-projectwildlife-python-backend.onrender.com/process-image/",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Upload failed");
      }

      const result = await response.json();
      setImageUrl(
        `https://new-projectwildlife-python-backend.onrender.com${result.image_path}`
      );
      setCsvUrl(
        `https://new-projectwildlife-python-backend.onrender.com${result.csv_path}`
      );
    } catch (error) {
      console.error("Error uploading file:", error);
      setErrorMessage("Failed to process the image. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.uploadContainer}>
      <h1 className={styles.centeredHeading}>Upload and Process Your Image</h1>

      {errorMessage && <p className={styles.error}>{errorMessage}</p>}

      <label htmlFor="file-upload" className={styles.dropzone}>
        <p className={styles.instructions}>
          Drag and drop your file here or click to select a file
        </p>
        <input
          id="file-upload"
          type="file"
          onChange={handleFileChange}
          className={styles.fileInput}
        />
      </label>

      <div className={styles.buttonContainer}>
        <button
          onClick={handleUpload}
          className={styles.uploadButton}
          disabled={!selectedFile || isLoading}
        >
          {isLoading ? "Uploading..." : "Upload Image"}
        </button>
      </div>

      {imageUrl && (
        <div className={styles.imageWrapper}>
          <h3>Annotated Image</h3>
          <img src={imageUrl} alt="Annotated" className={styles.image} />
        </div>
      )}

      {csvUrl && (
        <div className={styles.csvWrapper}>
          <h3>Extracted Data CSV</h3>
          <a
            href={csvUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.csvLink}
          >
            Download CSV
          </a>
        </div>
      )}
    </div>
  );
};

export default UploadImage;
