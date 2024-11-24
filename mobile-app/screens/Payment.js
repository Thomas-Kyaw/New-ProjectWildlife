import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function Payment() {
  const handlePaymentOption = (method) => {
    alert(`Pay via ${method}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Complete Your Donation</Text>
      <Text style={styles.description}>
        Please choose your preferred payment method to complete your donation.
      </Text>

      {/* Simulate different payment options */}
      <TouchableOpacity style={styles.button} onPress={() => handlePaymentOption('Credit/Debit Card')}>
        <Text style={styles.buttonText}>Pay with Credit/Debit Card</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => handlePaymentOption('PayPal')}>
        <Text style={styles.buttonText}>Pay with PayPal</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={() => handlePaymentOption('Bank Transfer')}>
        <Text style={styles.buttonText}>Pay via Bank Transfer</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#F7F5ED', // Light cream background
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2E8B57', // Forest green
    fontFamily: 'DynaPuff', // Elegant font
    marginBottom: 20,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    color: '#555', // Muted gray
    fontFamily: 'FuzzyBubbles-Regular', // Readable font
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#1B95E0', // Sky blue for buttons
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 16,
    color: '#FFF', // White text for contrast
    fontWeight: 'bold',
    fontFamily: 'Atma-Bold', // Bold, attention-grabbing font
  },
});
