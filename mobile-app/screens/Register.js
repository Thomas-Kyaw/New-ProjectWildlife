// screens/Register.js
import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import axios from "axios";

export default function Register({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async () => {
    try {
      console.log("Registration started"); // Log when registration starts

      const response = await axios.post(
        "https://new-projectwildlife.onrender.com/api/auth/register",
        {
          email,
          password,
        }
      );

      console.log("Response from server: ", response.data); // Log the server response

      if (response.status === 201) {
        // Registration was successful
        console.log("User registered successfully, redirecting to Login");
        navigation.replace("Login"); // Redirect to login after successful registration
      } else {
        console.log("Unexpected response status: ", response.status); // Log unexpected status
      }
    } catch (error) {
      console.error("Registration error: ", error); // Log any errors
      setErrorMessage("Failed to register, please try again.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Register</Text>
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
      <Button title="Register" onPress={handleRegister} />
      <Button
        title="Go to Login"
        onPress={() => navigation.navigate("Login")}
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
