import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export default function ContactUs() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');

  const handleSendMessage = () => {
    // Logic to handle form submission
    alert(`Message Sent: \nName: ${name}\nEmail: ${email}\nSubject: ${subject}\nMessage: ${message}`);
    // Reset form fields
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
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
        <Text style={styles.sectionContent}>Email: info@orangutanoasis.com</Text>
        <Text style={styles.sectionContent}>Phone: +123 456 7890</Text>
        <Text style={styles.sectionContent}>Address: Semenggoh Nature Reserve, Borneo</Text>

        {/* Social Media Links */}
        <Text style={styles.sectionTitle}>Follow Us</Text>
        <View style={styles.socialMediaContainer}>
          <TouchableOpacity onPress={() => alert('Opening Facebook')}>
            <Text style={styles.socialMediaText}>Facebook</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => alert('Opening Twitter')}>
            <Text style={styles.socialMediaText}> | Twitter</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => alert('Opening Instagram')}>
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
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E8B57',
    textAlign: 'center',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  messageInput: {
    height: 100,
    textAlignVertical: 'top',
  },
  button: {
    backgroundColor: '#1B95E0',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  contactInfo: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2E8B57',
    marginTop: 10,
  },
  sectionContent: {
    fontSize: 14,
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
    color: '#1B95E0',
  },
});
