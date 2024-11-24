import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
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

        const response = await axios.get(
          "https://new-projectwildlife.onrender.com/api/auth/profile",
          {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 5000, // Timeout after 5 seconds
          }
        );

        setUserData(response.data);
        setErrorMessage("");
      } catch (error) {
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
        <ActivityIndicator size="large" color="#1B95E0" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <Text style={styles.profileText}>Email: {userData.email || "Not available"}</Text>
      <Text style={styles.profileText}>Name: {userData.displayName || "Not available"}</Text>
      <Text style={styles.profileText}>Role: {userData.role || "Not available"}</Text>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#F7F5ED",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    color: "#2E8B57",
    fontFamily: "DynaPuff",
    marginBottom: 20,
  },
  profileText: {
    fontSize: 18,
    color: "#555",
    marginBottom: 10,
    textAlign: "center",
    fontFamily: "FuzzyBubbles-Regular",
  },
  error: {
    color: "red",
    textAlign: "center",
    fontSize: 16,
    fontFamily: "FuzzyBubbles-Regular",
    marginBottom: 10,
  },
  logoutButton: {
    backgroundColor: "#1B95E0",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 20,
  },
  logoutButtonText: {
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 16,
    fontFamily: "Atma-Bold",
  },
});
