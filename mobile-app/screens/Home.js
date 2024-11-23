import React from 'react';
import { View, Text, StyleSheet, Image, TextInput, ScrollView, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

export default function Home({ navigation }) {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Welcome and Search */}
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to Semenggoh Nature Reserve</Text>
        <Text style={styles.subtitle}>Explore wildlife and learn more about sustainable tourism</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <MaterialIcons name="search" size={24} color="gray" />
        <TextInput 
          style={styles.searchInput} 
          placeholder="Search for animals or activities" 
        />
      </View>

      {/* Featured Animals Section */}
      <View style={styles.featuredSection}>
        <Text style={styles.sectionTitle}>Featured Animals</Text>
        <ScrollView horizontal>
          <TouchableOpacity style={styles.animalCard}>
          <Image source={require('../assets/orangutan-1.jpg')} style={styles.animalImage} />
            <Text style={styles.animalText}>Orangutan</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.animalCard}>
          <Image source={require('../assets/elephant-1.jpg')} style={styles.animalImage} />  
            <Text style={styles.animalText}>Bornean Elephant</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Recent Sightings Section */}
      <View style={styles.sightingsSection}>
        <Text style={styles.sectionTitle}>Recent Sightings</Text>
        <TouchableOpacity style={styles.sightingCard} onPress={() => navigation.navigate('Sightings')}>
          <Image source={require('../assets/orangutan-2.jpg')} style={styles.sightingImage} />
          <Text style={styles.sightingText}>Spotted: Orangutan Family</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Sightings')}>
          <Text style={styles.viewMoreText}>View More Sightings</Text>
        </TouchableOpacity>
      </View>

      {/* Explore Tourism Section */}
      <View style={styles.exploreSection}>
        <Text style={styles.sectionTitle}>Explore Tourism</Text>
        <TouchableOpacity 
          style={styles.exploreButton} 
          onPress={() => navigation.navigate('Tourism')}
        >
          <Text style={styles.exploreButtonText}>Explore Tourism</Text>
        </TouchableOpacity>
      </View>

      {/* Action Buttons Section */}
      <View style={styles.actionButtons}>
        <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('Donation')}>
          <Text style={styles.actionText}>Donate</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('ContactUs')}>
          <Text style={styles.actionText}>Contact Us</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionCard} onPress={() => navigation.navigate('AboutUs')}>
          <Text style={styles.actionText}>About Us</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  contentContainer: {
    paddingBottom: 100, // Add bottom padding so content isn't hidden by Tab Navigator
  },
  header: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E8B57', // Dark green
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 10,
    marginVertical: 15,
  },
  searchInput: {
    marginLeft: 10,
    fontSize: 16,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginVertical: 15,
  },
  featuredSection: {
    marginBottom: 20,
  },
  animalCard: {
    width: 120,
    marginRight: 15,
  },
  animalImage: {
    width: '100%',
    height: 100,
    borderRadius: 10,
  },
  animalText: {
    marginTop: 5,
    fontSize: 14,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  sightingsSection: {
    marginBottom: 20,
  },
  sightingCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  sightingImage: {
    width: 60,
    height: 60,
    borderRadius: 10,
    marginRight: 10,
  },
  sightingText: {
    fontSize: 16,
  },
  viewMoreText: {
    color: '#1B95E0',
    fontWeight: 'bold',
    textAlign: 'right',
  },
  exploreSection: {
    marginBottom: 20,
    alignItems: 'center',
  },
  exploreButton: {
    backgroundColor: '#1B95E0',
    padding: 15,
    borderRadius: 10,
  },
  exploreButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 10,
    width: '30%',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});
