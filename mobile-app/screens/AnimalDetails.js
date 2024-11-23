import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

export default function AnimalDetails({ route }) {
  const { sighting } = route.params;  // Get the sighting data from navigation params

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={sighting.image} style={styles.sightingImage} />
      <View style={styles.infoContainer}>
        <Text style={styles.sightingName}>{sighting.name}</Text>
        <Text style={styles.sightingDescription}>{sighting.description}</Text>
        <Text style={styles.sightingDetail}>
          More detailed information about the sighting can go here. You can expand this based on actual data available.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  sightingImage: {
    width: '100%',
    height: 250,
    borderRadius: 10,
  },
  infoContainer: {
    marginTop: 20,
  },
  sightingName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2E8B57',
    marginBottom: 10,
  },
  sightingDescription: {
    fontSize: 16,
    color: '#555',
    marginBottom: 20,
  },
  sightingDetail: {
    fontSize: 14,
    color: '#333',
    lineHeight: 22,
  },
});
