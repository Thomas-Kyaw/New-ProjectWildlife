import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function Profile({ navigation }) {
  const [userData, setUserData] = useState({ email: "", displayName: "User" });
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await AsyncStorage.getItem("token");
        if (!token) {
          setErrorMessage("No token found. Please log in again.");
          setLoading(false);
          return;
        }

        console.log("Token:", token);

        const response = await axios.get(
          "http://172.17.16.161:5002/api/auth/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            timeout: 5000, // Add timeout
          }
        );

        console.log("Profile response:", response.data);
        setUserData(response.data);
        setErrorMessage("");
      } catch (error) {
        console.error("Error fetching profile:", error);

        if (error.code === "ECONNABORTED") {
          setErrorMessage("Connection timeout. Please try again.");
        } else if (error.response) {
          switch (error.response.status) {
            case 401:
              setErrorMessage("Session expired. Please log in again.");
              await handleLogout();
              break;
            case 404:
              setErrorMessage("User profile not found.");
              break;
            case 403:
              setErrorMessage("Access denied. Please log in again.");
              await handleLogout();
              break;
            default:
              setErrorMessage("An error occurred while fetching the profile.");
          }
        } else if (error.request) {
          setErrorMessage("Network error. Please check your connection.");
        } else {
          setErrorMessage("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
      navigation.replace("Login");
    } catch (error) {
      console.error("Error during logout:", error);
      setErrorMessage("Error during logout. Please try again.");
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <Text style={styles.profileText}>
        Email: {userData.email || "Not available"}
      </Text>
      <Text style={styles.profileText}>
        Name: {userData.displayName || "Not available"}
      </Text>
      <Text style={styles.profileText}>
        Role: {userData.role || "Not available"}
      </Text>
      <Button title="Logout" onPress={handleLogout} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 20,
    fontWeight: "bold",
  },
  profileText: {
    fontSize: 18,
    marginBottom: 10,
    textAlign: "center",
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
    fontSize: 16,
  },
});
