import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

const menuItems = [
  { id: '1', name: 'Bunny Chow', price: 129.99, image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400' },
  { id: '2', name: 'Bobotie', price: 149.99, image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400' },
  { id: '3', name: 'Boerewors Roll', price: 89.99, image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433?w=400' },
];

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.hero}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1200&fit=crop' }}
          style={styles.heroImage}
        />
        <View style={styles.heroOverlay}>
          <Text style={styles.heroTitle}>Mzansi Grill</Text>
          <Text style={styles.heroSubtitle}>Premium South African Dining</Text>
        </View>
      </View>

      <Text style={styles.menuTitle}>Featured Dishes</Text>
      
      {menuItems.map((item) => (
        <Link key={item.id} href={`/menu/${item.id}`} asChild>
          <TouchableOpacity style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.info}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.price}>R {item.price.toFixed(2)}</Text>
            </View>
          </TouchableOpacity>
        </Link>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a1a' },
  hero: { height: 250, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  heroOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)', padding: 20,
  },
  heroTitle: { color: '#FFD700', fontSize: 28, fontWeight: 'bold' },
  heroSubtitle: { color: '#fff', fontSize: 16, marginTop: 5 },
  menuTitle: { 
    fontSize: 24, fontWeight: 'bold', color: '#FFD700', 
    margin: 20, marginBottom: 10 
  },
  card: { 
    backgroundColor: '#2a2a2a', marginHorizontal: 20, marginBottom: 15, 
    borderRadius: 10, overflow: 'hidden', flexDirection: 'row',
  },
  itemImage: { width: 100, height: 100 },
  info: { flex: 1, padding: 15, justifyContent: 'center' },
  name: { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 5 },
  price: { fontSize: 16, fontWeight: 'bold', color: '#FFD700' },
});
