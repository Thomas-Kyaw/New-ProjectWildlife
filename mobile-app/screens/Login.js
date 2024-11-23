// screens/Login.js
import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

export default function Login({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async () => {
    try {
      console.log("Login started"); // Add this log to see when login starts

      const response = await axios.post(
        "https://new-projectwildlife.onrender.com/api/auth/login",
        {
          email,
          password,
        }
      );

      console.log("Response from server: ", response.data); // Log the response

      if (response.data.token) {
        await AsyncStorage.setItem("token", response.data.token);
        console.log("Token stored, navigating to Main");
        navigation.replace("Main");
      } else {
        console.log("No token received from server");
      }
    } catch (error) {
      console.error("Login error: ", error); // Add this to see what kind of error happens
      setErrorMessage("Invalid credentials, please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {errorMessage ? <Text style={styles.error}>{errorMessage}</Text> : null}
      <Button title="Login" onPress={handleLogin} />
      <Button
        title="Go to Register"
        onPress={() => navigation.navigate("Register")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, textAlign: "center", marginBottom: 20 },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
  error: { color: "red", textAlign: "center" },
});
