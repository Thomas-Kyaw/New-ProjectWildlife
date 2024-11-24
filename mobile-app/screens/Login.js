// screens/Login.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "https://new-projectwildlife.onrender.com/api/auth/login",
        {
          email,
          password,
        }
      );

      if (response.data.token) {
        await AsyncStorage.setItem("token", response.data.token);
        navigation.replace("Main");
      } else {
        setErrorMessage("Login failed. Please try again.");
      }
    } catch (error) {
      setErrorMessage("Invalid credentials, please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="#A0A0A0"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="#A0A0A0"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.secondaryButton} onPress={() => navigation.navigate("Register")}>
        <Text style={styles.secondaryButtonText}>Go to Register</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#F7F5ED", // Light Cream Background
  },
  title: {
    fontSize: 28,
    fontFamily: "DynaPuff",
    color: "#213D30", // Forest Green
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 50,
    borderColor: "#8CAB68", // Olive Green Border
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    fontSize: 16,
    fontFamily: "FuzzyBubbles-Regular",
    color: "#4B4033", // Muted Brown Text
    backgroundColor: "#FFFFFF", // White Input Background
    marginBottom: 15,
  },
  error: {
    color: "#F44336", // Red for Error Message
    textAlign: "center",
    fontFamily: "Atma-Bold",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#8CAB68", // Olive Green Button Background
    paddingVertical: 15,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontFamily: "Atma-Bold",
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: "#E8E8E8", // Light Gray Button
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  secondaryButtonText: {
    color: "#4B4033", // Muted Brown Text
    fontFamily: "Atma-Bold",
    fontSize: 16,
  },
});
