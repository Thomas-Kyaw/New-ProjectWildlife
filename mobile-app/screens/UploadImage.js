import React, { useState } from "react";
import {
  View,
  Button,
  Image,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";

const UploadImage = () => {
  const [imageUri, setImageUri] = useState(null);
  const [annotatedImageUri, setAnnotatedImageUri] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [csvUrl, setCsvUrl] = useState(null);

  // Function to select an image from the gallery
  const selectImage = async () => {
    try {
      // Request permission to access media library
      const permissionResult =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (permissionResult.granted === false) {
        Alert.alert(
          "Permission Required",
          "Permission to access gallery is required!"
        );
        return;
      }

      // Open image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImageUri(result.assets[0].uri);
        // Reset other states when new image is selected
        setAnnotatedImageUri(null);
        setCsvUrl(null);
        setError(null);
      }
    } catch (error) {
      console.error("Error selecting image:", error);
      Alert.alert("Error", "Failed to select image");
    }
  };

  // Function to upload the image
  const uploadImage = async () => {
    if (!imageUri) {
      Alert.alert("Error", "Please select an image first");
      return;
    }

    setUploading(true);
    setError(null);

    try {
      // Get file extension from URI
      const uriParts = imageUri.split(".");
      const fileType = uriParts[uriParts.length - 1] || "jpg";

      const formData = new FormData();
      formData.append("file", {
        uri: imageUri,
        name: `photo.${fileType}`,
        type: `image/${fileType}`,
      });

      // Make API call to your server
      const response = await axios.post(
        "http://172.17.16.161:5002/api/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Accept: "application/json",
          },
          timeout: 30000, // 30 second timeout
        }
      );

      if (response.data.annotatedImageUrl) {
        setAnnotatedImageUri(response.data.annotatedImageUrl);
      }

      if (response.data.csvUrl) {
        setCsvUrl(response.data.csvUrl);
      }

      Alert.alert("Success", "Image processed successfully");
    } catch (error) {
      console.error("Upload error:", error);
      const errorMessage =
        error.response?.data?.error || "Failed to upload and process image";
      setError(errorMessage);
      Alert.alert("Error", errorMessage);
    } finally {
      setUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Button title="Select Image" onPress={selectImage} />

      {imageUri && (
        <View style={styles.imageContainer}>
          <Text style={styles.label}>Selected Image:</Text>
          <Image source={{ uri: imageUri }} style={styles.image} />
        </View>
      )}

      <Button
        title="Upload and Process Image"
        onPress={uploadImage}
        disabled={uploading || !imageUri}
      />

      {uploading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#0000ff" />
          <Text style={styles.loadingText}>Processing image...</Text>
        </View>
      )}

      {annotatedImageUri && (
        <View style={styles.imageContainer}>
          <Text style={styles.label}>Annotated Image:</Text>
          <Image source={{ uri: annotatedImageUri }} style={styles.image} />
        </View>
      )}

      {csvUrl && <Text style={styles.response}>CSV File: {csvUrl}</Text>}

      {error && <Text style={styles.error}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  imageContainer: {
    marginVertical: 10,
    alignItems: "center",
  },
  image: {
    width: 200,
    height: 200,
    marginVertical: 5,
    borderRadius: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  loadingContainer: {
    marginVertical: 10,
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 14,
    color: "#666",
  },
  response: {
    marginTop: 20,
    fontSize: 16,
    color: "green",
  },
  error: {
    marginTop: 10,
    fontSize: 14,
    color: "red",
    textAlign: "center",
  },
});

export default UploadImage;
