import React, { useState } from "react";
import styles from "../styles/UploadImage.module.css";

const UploadImage = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [csvUrl, setCsvUrl] = useState("");

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await fetch("http://localhost:8000/process-image/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Upload failed");
      }

      const result = await response.json();
      setImageUrl(`http://localhost:8000${result.image_path}`);
      setCsvUrl(`http://localhost:8000${result.csv_path}`);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div className={styles.uploadContainer}>
      <h1 className={styles.centeredHeading}>Upload and Process Your Image</h1>
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
          disabled={!selectedFile}
        >
          Upload Image
        </button>
      </div>
      {imageUrl && (
        <div className={styles.imageWrapper}>
          <h3>Annotated Image</h3>
          <img
            src={imageUrl}
            alt="Annotated"
            className={styles.image}
          />
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
