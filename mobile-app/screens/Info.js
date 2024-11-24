import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function Info() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Visitor Information</Text>

      {/* Opening Hours */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Opening Hours</Text>
        <Text style={styles.sectionContent}>
          Monday to Sunday: 9:00 AM - 5:00 PM{'\n'}
          Closed on public holidays.
        </Text>
      </View>

      {/* Ticket Pricing */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Ticket Pricing</Text>
        <Text style={styles.sectionContent}>
          Adults: $10.00{'\n'}
          Children (Under 12): $5.00{'\n'}
          Students & Senior Citizens: $7.00
        </Text>
      </View>

      {/* Guidelines */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Visitor Guidelines</Text>
        <Text style={styles.sectionContent}>
          - Stay on marked trails.{'\n'}
          - Respect the wildlife. Do not feed or disturb the animals.{'\n'}
          - Use designated viewing platforms for wildlife observation.{'\n'}
          - Photography is allowed but avoid using flash.
        </Text>
      </View>

      {/* Map and Facilities */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Map & Facilities</Text>
        <Text style={styles.sectionContent}>
          - Restrooms are available at the entrance and near the visitor center.{'\n'}
          - A café is located near the visitor center for refreshments.{'\n'}
          - Guided tours are available daily at 10:00 AM and 2:00 PM.
        </Text>
      </View>

      {/* FAQ */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        <Text style={styles.sectionContent}>
          Q: What is the best time to visit the reserve?{'\n'}
          A: Early morning or late afternoon is ideal for wildlife sightings.{'\n\n'}
          Q: Are there any special events?{'\n'}
          A: Check the calendar for special guided tours and conservation talks.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#F7F5ED', // Light cream background
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#2E8B57', // Forest green
    textAlign: 'center',
    fontFamily: 'DynaPuff-Bold', // Elegant font for the title
    marginBottom: 20,
  },
  section: {
    marginBottom: 25,
    padding: 15,
    backgroundColor: '#FFFFFF', // White background for sections
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3, // Elevation for Android
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1B95E0', // Sky blue for section titles
    marginBottom: 10,
    fontFamily: 'Atma-Bold', // Bold and attention-grabbing font
  },
  sectionContent: {
    fontSize: 16,
    color: '#555', // Muted gray for text
    lineHeight: 24,
    fontFamily: 'FuzzyBubbles-Regular', // Readable and soft font
  },
});
