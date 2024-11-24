import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Linking } from 'react-native';

export default function ContactUs() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    if (!name || !email || !subject || !message) {
      alert('Please fill out all fields before sending your message.');
      return;
    }

    alert(`Message Sent:\nName: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  const handleEmailPress = () => {
    Linking.openURL('mailto:info@orangutanoasis.com');
  };

  const handlePhonePress = () => {
    Linking.openURL('tel:+1234567890');
  };

  const handleSocialMediaPress = (platform) => {
    const urls = {
      Facebook: 'https://www.facebook.com',
      Twitter: 'https://www.twitter.com',
      Instagram: 'https://www.instagram.com',
    };

    if (urls[platform]) {
      Linking.openURL(urls[platform]);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Contact Us</Text>
      <Text style={styles.subtitle}>
        We’d love to hear from you! Please fill out the form below and we’ll get in touch with you shortly.
      </Text>

      {/* Form */}
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        keyboardType="email-address"
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Subject"
        value={subject}
        onChangeText={setSubject}
      />
      <TextInput
        style={[styles.input, styles.messageInput]}
        placeholder="Message"
        value={message}
        multiline
        numberOfLines={4}
        onChangeText={setMessage}
      />
      <TouchableOpacity style={styles.button} onPress={handleSendMessage}>
        <Text style={styles.buttonText}>Send Message</Text>
      </TouchableOpacity>

      {/* Contact Information */}
      <View style={styles.contactInfo}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <TouchableOpacity onPress={handleEmailPress}>
          <Text style={styles.sectionContent}>Email: info@orangutanoasis.com</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handlePhonePress}>
          <Text style={styles.sectionContent}>Phone: +123 456 7890</Text>
        </TouchableOpacity>
        <Text style={styles.sectionContent}>Address: Semenggoh Nature Reserve, Borneo</Text>

        {/* Social Media Links */}
        <Text style={styles.sectionTitle}>Follow Us</Text>
        <View style={styles.socialMediaContainer}>
          <TouchableOpacity onPress={() => handleSocialMediaPress('Facebook')}>
            <Text style={styles.socialMediaText}>Facebook</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSocialMediaPress('Twitter')}>
            <Text style={styles.socialMediaText}> | Twitter</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleSocialMediaPress('Instagram')}>
            <Text style={styles.socialMediaText}> | Instagram</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F7F5ED', // Light cream background
  },
  title: {
    fontSize: 26,
    fontFamily: 'DynaPuff',
    color: '#2E8B57', // Forest Green
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'FuzzyBubbles-Regular',
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    fontFamily: 'FuzzyBubbles-Regular',
    backgroundColor: '#FFF',
    marginBottom: 16,
  },
  messageInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#1B95E0',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#FFF',
    fontSize: 18,
    fontFamily: 'Atma-Bold',
  },
  contactInfo: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#DDD',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'DynaPuff',
    color: '#2E8B57',
    marginBottom: 10,
    textAlign: 'center',
  },
  sectionContent: {
    fontSize: 14,
    fontFamily: 'FuzzyBubbles-Regular',
    color: '#555',
    marginTop: 5,
  },
  socialMediaContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  socialMediaText: {
    fontSize: 14,
    fontFamily: 'Atma-Bold',
    color: '#1B95E0',
  },
});
