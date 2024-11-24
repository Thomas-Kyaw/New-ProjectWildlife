import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import axios from "axios";

export default function Register({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async () => {
    try {
      const response = await axios.post(
        "https://new-projectwildlife.onrender.com/api/auth/register",
        {
          email,
          password,
        }
      );

      if (response.status === 201) {
        navigation.replace("Login"); // Redirect to login after successful registration
      } else {
        setErrorMessage("Unexpected response. Please try again.");
      }
    } catch (error) {
      setErrorMessage("Failed to register, please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
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
      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.navigate("Login")}
      >
        <Text style={styles.secondaryButtonText}>Go to Login</Text>
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
