import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function BookingDetailsScreen() {
  const { id } = useLocalSearchParams();
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking Details</Text>
      <Text style={styles.text}>Booking ID: {id}</Text>
      <Text style={styles.text}>Restaurant: Mzansi Meals</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#1a1a1a',
  },
  title: {
    fontSize: 24,
    color: '#FFFFFF',
    marginBottom: 20,
  },
  text: {
    fontSize: 16,
    color: '#CCCCCC',
    marginBottom: 10,
  },
});
