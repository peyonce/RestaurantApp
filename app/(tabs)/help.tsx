import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HelpScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Mzansi Meals Help</Text>
      <Text style={styles.text}>Email: support@mzansimeals.com</Text>
      <Text style={styles.text}>Phone: 123-456-7890</Text>
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
