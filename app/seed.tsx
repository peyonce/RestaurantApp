import { router } from 'expo-router';
import React, { useState } from 'react';
import { Button, Text, View } from 'react-native';

// Import your seed functions
const seedFirebase = async () => {
  try {
    // Dynamically import your seed function
    const seedModule = await import('./services/seedFirebase');
    if (seedModule.seedMenuItems) {
      await seedModule.seedMenuItems();
      return true;
    }
    return false;
  } catch (error) {
    console.error('Seed error:', error);
    return false;
  }
};

export default function SeedScreen() {
  const [seeding, setSeeding] = useState(false);
  const [message, setMessage] = useState('');

  const handleSeed = async () => {
    setSeeding(true);
    setMessage('Seeding Firebase...');
    
    try {
      const success = await seedFirebase();
      if (success) {
        setMessage('✅ Firebase seeded successfully!');
      } else {
        setMessage('❌ Seed function not found');
      }
    } catch (error: any) {
      setMessage(`❌ Error: ${error.message}`);
    } finally {
      setSeeding(false);
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a1a', padding: 20 }}>
      <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Firebase Setup</Text>
      
      <Text style={{ color: '#FFD700', fontSize: 16, marginBottom: 30, textAlign: 'center' }}>
        This will populate your Firebase with sample menu items
      </Text>
      
      <Button 
        title={seeding ? "Seeding..." : "Seed Mzansi Meals Data"} 
        onPress={handleSeed}
        disabled={seeding}
      />
      
      {message ? (
        <Text style={{ 
          color: message.includes('✅') ? '#4CAF50' : '#FF4444', 
          marginTop: 20, 
          textAlign: 'center',
          fontSize: 16 
        }}>
          {message}
        </Text>
      ) : null}
      
      <View style={{ marginTop: 40 }}>
        <Button 
          title="Go to Menu" 
          onPress={() => router.replace('/menu')}
        />
      </View>
    </View>
  );
}
