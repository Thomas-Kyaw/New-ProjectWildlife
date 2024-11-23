import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';

export default function Tourism() {
  const handleLearnMore = () => {
    alert('More information on sustainable tourism is coming soon!');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Explore Sustainable Tourism</Text>
      <Text style={styles.subtitle}>
        Discover the beauty of Semenggoh Nature Reserve and participate in eco-friendly activities that promote wildlife conservation and sustainable tourism.
      </Text>

      {/* Activities Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Tourist Activities</Text>
        
        {/* Activity Images */}
        <Image source={require('../assets/orangutan_feeding.jpg')} style={styles.sectionImage} />
        <Image source={require('../assets/jungle_trek.jpg')} style={styles.sectionImage} />

        <Text style={styles.sectionContent}>
          - Orangutan Feeding Sessions: Experience the joy of watching orangutans during their feeding times.{'\n'}
          - Guided Jungle Treks: Explore the rainforest with experienced guides who share insights on the flora and fauna of Borneo.{'\n'}
          - Bird Watching: Enjoy spotting exotic bird species in their natural habitat.
        </Text>
      </View>

      {/* Attractions Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Nearby Attractions</Text>
        
        {/* Attraction Images */}
        <Image source={require('../assets/cultural_village.jpg')} style={styles.sectionImage} />
        <Image source={require('../assets/kubah_national_park.jpg')} style={styles.sectionImage} />

        <Text style={styles.sectionContent}>
          - Sarawak Cultural Village: Learn about the culture and heritage of Sarawak’s indigenous tribes.{'\n'}
          - Kubah National Park: Discover stunning waterfalls and rare plant species in the nearby national park.{'\n'}
          - Annah Rais Longhouse: Visit an authentic Bidayuh longhouse and experience the traditional lifestyle of the locals.
        </Text>
      </View>

      {/* Sustainability Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Sustainable Tourism Practices</Text>

        {/* Sustainability Image */}
        <Image source={require('../assets/sustainability.jpg')} style={styles.sectionImage} />

        <Text style={styles.sectionContent}>
          At Semenggoh Nature Reserve, we promote sustainable tourism by encouraging visitors to:{'\n'}
          - Respect the wildlife by keeping a safe distance and not feeding the animals.{'\n'}
          - Stay on designated paths to avoid damaging fragile ecosystems.{'\n'}
          - Minimize waste by using reusable bottles and avoiding plastic.
        </Text>
        <TouchableOpacity style={styles.button} onPress={handleLearnMore}>
          <Text style={styles.buttonText}>Learn More About Sustainability</Text>
        </TouchableOpacity>
      </View>

      {/* Contact Information */}
      <View style={styles.contactInfo}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        <Text style={styles.sectionContent}>Email: tourism@orangutanoasis.com</Text>
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
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B95E0',
    marginBottom: 10,
  },
  sectionContent: {
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
  },
  sectionImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#1B95E0',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
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
