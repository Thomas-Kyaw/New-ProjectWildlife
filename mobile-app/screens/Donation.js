import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Linking } from 'react-native';

export default function Donation({ navigation }) {
  const [customAmount, setCustomAmount] = useState('');
  const [name, setName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  const handleDonation = () => {
    // Handle the donation process here
  };

  const handleEmailPress = () => {
    Linking.openURL('mailto:info@orangutanoasis.com');
  };

  const handlePhonePress = () => {
    Linking.openURL('tel:+1234567890');
  };

  const handleSocialMediaPress = (platform) => {
    let url = '';
    switch (platform) {
      case 'Facebook':
        url = 'https://www.facebook.com';
        break;
      case 'Twitter':
        url = 'https://www.twitter.com';
        break;
      case 'Instagram':
        url = 'https://www.instagram.com';
        break;
    }
    Linking.openURL(url);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Support Our Conservation Efforts</Text>
      <Text style={styles.subtitle}>
        Your donation helps us protect endangered wildlife and preserve their habitats.
      </Text>

      {/* Donation Amount Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Donation Amount</Text>
        <View style={styles.amountButtons}>
          {['$10', '$25', '$50', '$100'].map((amount, index) => (
            <TouchableOpacity key={index} style={styles.amountButton}>
              <Text style={styles.amountButtonText}>{amount}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.orText}>Or Enter a Custom Amount</Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          placeholder="Enter custom amount"
          value={customAmount}
          onChangeText={setCustomAmount}
        />
      </View>

      {/* Payment Details Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Enter Your Payment Details</Text>
        <TextInput
          style={styles.input}
          placeholder="Name on Card"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Card Number"
          keyboardType="numeric"
          value={cardNumber}
          onChangeText={setCardNumber}
        />
        <TextInput
          style={styles.input}
          placeholder="Expiration Date (MM/YY)"
          value={expiryDate}
          onChangeText={setExpiryDate}
        />
        <TextInput
          style={styles.input}
          placeholder="CVV"
          keyboardType="numeric"
          value={cvv}
          onChangeText={setCvv}
        />
      </View>

      {/* Donate Button */}
      <TouchableOpacity style={styles.donateButton} onPress={handleDonation}>
        <Text style={styles.donateButtonText}>Donate Now</Text>
      </TouchableOpacity>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerTitle}>Contact Information</Text>

        <TouchableOpacity onPress={handleEmailPress}>
          <Text style={styles.footerText}>Email: info@orangutanoasis.com</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={handlePhonePress}>
          <Text style={styles.footerText}>Phone: +123 456 7890</Text>
        </TouchableOpacity>

        <Text style={styles.footerTitle}>Social Media</Text>
        <View style={styles.socialMediaContainer}>
          <TouchableOpacity onPress={() => handleSocialMediaPress('Facebook')}>
            <Text style={styles.footerText}>Facebook</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSocialMediaPress('Twitter')}>
            <Text style={styles.footerText}> | Twitter</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSocialMediaPress('Instagram')}>
            <Text style={styles.footerText}> | Instagram</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  amountButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  amountButton: {
    backgroundColor: '#1B95E0',
    padding: 15,
    borderRadius: 10,
    width: '22%',
    alignItems: 'center',
  },
  amountButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  orText: {
    textAlign: 'center',
    fontSize: 16,
    marginVertical: 10,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  donateButton: {
    backgroundColor: '#1B95E0',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  donateButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  footerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E8B57',
    marginTop: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
});
