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
        <MaterialIcons name="search" size={24} color="#8CAB68" />
        <TextInput 
          style={styles.searchInput} 
          placeholder="Search for animals or activities" 
          placeholderTextColor="#a0a0a0"
        />
      </View>

      {/* Featured Animals Section */}
      <View style={styles.featuredSection}>
        <Text style={styles.sectionTitle}>Featured Animals</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
    backgroundColor: '#F7F5ED', // Light Cream Background
  },
  contentContainer: {
    paddingBottom: 100, // Padding for bottom navigation
    paddingHorizontal: 16, // Padding for content
  },
  header: {
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'DynaPuff', // Use custom font
    color: '#213D30', // Forest Green
    textAlign: 'center',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: 'FuzzyBubbles-Regular', // Use custom font
    color: '#4B4033', // Muted Brown
    textAlign: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E8E8E8',
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
    fontFamily: 'Atma-Bold',
    color: '#213D30', // Forest Green
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
    fontFamily: 'FuzzyBubbles-Regular',
    color: '#4B4033', // Muted Brown
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
    fontFamily: 'FuzzyBubbles-Regular',
    color: '#213D30', // Forest Green
  },
  viewMoreText: {
    color: '#8CAB68', // Olive Green
    fontWeight: 'bold',
    fontFamily: 'Atma-Bold',
    textAlign: 'right',
  },
  exploreSection: {
    marginBottom: 20,
    alignItems: 'center',
  },
  exploreButton: {
    backgroundColor: '#8CAB68', // Olive Green
    padding: 15,
    borderRadius: 10,
  },
  exploreButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontFamily: 'Atma-Bold',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    backgroundColor: '#E8E8E8', // Light Gray Background
    padding: 15,
    borderRadius: 10,
    width: '30%',
    alignItems: 'center',
  },
  actionText: {
    fontSize: 14,
    fontWeight: 'bold',
    fontFamily: 'Atma-Bold',
    color: '#4B4033', // Muted Brown
  },
});
