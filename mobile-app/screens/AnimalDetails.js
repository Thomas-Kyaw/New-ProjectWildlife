import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';

export default function AnimalDetails({ route }) {
  const { sighting } = route.params; // Get the sighting data from navigation params

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={sighting.image} style={styles.sightingImage} />
      <View style={styles.infoContainer}>
        <Text style={styles.sightingName}>{sighting.name}</Text>
        <Text style={styles.sightingDescription}>{sighting.description}</Text>
        <Text style={styles.sightingDetail}>
          Learn more about the {sighting.name} and its unique characteristics. This section can include additional details,
          such as its habitat, behavior, and importance to the ecosystem.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#F7F5ED', // Light cream background for readability
  },
  sightingImage: {
    width: '100%',
    height: 250,
    borderRadius: 15,
    marginBottom: 20,
  },
  infoContainer: {
    padding: 16,
    backgroundColor: '#fff', // White card for content
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3, // Android shadow
  },
  sightingName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2E8B57', // Forest green for emphasis
    marginBottom: 10,
    fontFamily: 'DynaPuff-Bold', // Elegant font for title
  },
  sightingDescription: {
    fontSize: 18,
    color: '#555', // Muted gray for readability
    marginBottom: 15,
    fontFamily: 'FuzzyBubbles-Regular', // Soft and readable font
  },
  sightingDetail: {
    fontSize: 16,
    color: '#333', // Darker text for details
    lineHeight: 24,
    fontFamily: 'FuzzyBubbles-Regular',
  },
});
