import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { seedSampleData } from './services/seedData';

export default function TestSeedScreen() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSeedData = async () => {
    setLoading(true);
    const result = await seedSampleData();
    setLoading(false);
    setSuccess(result);
    
    if (result) {
      Alert.alert('Success', 'Sample data added to Firestore!');
    } else {
      Alert.alert('Error', 'Failed to add sample data');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Sample Data to Firestore</Text>
      <Text style={styles.description}>
        This will add sample categories and menu items to your Firestore database.
        Run this only once.
      </Text>
      
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleSeedData}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Adding Data...' : 'Add Sample Data'}
        </Text>
      </TouchableOpacity>
      
      {success && (
        <Text style={styles.successText}>
          ✅ Data added successfully! Check Firebase Console.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#1a1a1a',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: '#1a1a1a',
    fontSize: 18,
    fontWeight: 'bold',
  },
  successText: {
    color: '#4CAF50',
    fontSize: 16,
    marginTop: 20,
    textAlign: 'center',
  },
});
