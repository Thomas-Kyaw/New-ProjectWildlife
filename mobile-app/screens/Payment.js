import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function Payment() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complete Your Donation</Text>
      <Text style={styles.description}>
        Please choose your preferred payment method to complete your donation.
      </Text>

      {/* Simulate different payment options */}
      <TouchableOpacity style={styles.button} onPress={() => alert('Pay via Credit/Debit Card')}>
        <Text style={styles.buttonText}>Pay with Credit/Debit Card</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => alert('Pay via PayPal')}>
        <Text style={styles.buttonText}>Pay with PayPal</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => alert('Pay via Bank Transfer')}>
        <Text style={styles.buttonText}>Pay via Bank Transfer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E8B57',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#1B95E0',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
