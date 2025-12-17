import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function OrderDetailScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Order Details Screen</Text>
      <Text>Minimal working version</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  text: {
    color: '#FFFFFF',
    fontSize: 20,
  },
});
