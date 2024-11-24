import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator } from 'react-native';

export default function Sightings({ navigation }) {
  const [sightingsData, setSightingsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = [
      {
        id: '1',
        name: 'Orangutan Family',
        description: 'Spotted near the riverbank.',
        image: require('../assets/orangutan-1.jpg'),
      },
      {
        id: '2',
        name: 'Bornean Elephant',
        description: 'Seen roaming in the dense forest.',
        image: require('../assets/elephant-1.jpg'),
      },
      {
        id: '3',
        name: 'Hornbill Bird',
        description: 'Flying across the reserve.',
        image: require('../assets/hornbill.jpg'),
      },
    ];

    setTimeout(() => {
      setSightingsData(data);
      setLoading(false);
    }, 1500);
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#1B95E0" />
      </View>
    );
  }

  const renderSighting = ({ item }) => (
    <TouchableOpacity
      style={styles.sightingCard}
      onPress={() => navigation.navigate('AnimalDetails', { sighting: item })}
    >
      <Image source={item.image} style={styles.sightingImage} />
      <View style={styles.sightingInfo}>
        <Text style={styles.sightingName}>{item.name}</Text>
        <Text style={styles.sightingDescription}>{item.description}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Recent Sightings</Text>
      <FlatList
        data={sightingsData}
        keyExtractor={(item) => item.id}
        renderItem={renderSighting}
        contentContainerStyle={styles.listContainer}
      />
      
      <TouchableOpacity 
        style={styles.uploadButton}
        onPress={() => navigation.navigate('UploadImage')}
      >
        <Text style={styles.uploadButtonText}>Upload Your Image</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F7F5ED', // Light cream background
    padding: 16,
  },
  title: {
    fontSize: 26,
    fontFamily: 'DynaPuff',
    color: '#2E8B57', // Forest Green
    marginBottom: 20,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 100, // Ensure content isn't hidden by the button
  },
  sightingCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    marginBottom: 15,
    padding: 10,
    elevation: 3, // Add shadow for a card-like feel
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  sightingImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 15,
  },
  sightingInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  sightingName: {
    fontSize: 18,
    fontFamily: 'Atma-Bold',
    color: '#213D30', // Dark Forest Green
    marginBottom: 4,
  },
  sightingDescription: {
    fontSize: 14,
    fontFamily: 'FuzzyBubbles-Regular',
    color: '#4B4033', // Muted Brown
  },
  loader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  uploadButton: {
    backgroundColor: '#1B95E0',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Atma-Bold',
  },
});
