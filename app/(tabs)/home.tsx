import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';

const featuredItems = [
  { 
    id: '1', 
    name: 'Bunny Chow', 
    price: 129.99, 
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
    description: 'Our signature curry served in fresh bread',
    category: 'Main Course'
  },
  { 
    id: '5', 
    name: 'Biltong Platter', 
    price: 99.99, 
    image: 'https://images.unsplash.com/photo-1589923186741-b7d59d6b2c4d?w=400',
    description: 'Assorted traditional dried cured meats',
    category: 'Starter'
  },
  { 
    id: '6', 
    name: 'Melktert', 
    price: 69.99, 
    image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400',
    description: 'Classic South African milk tart dessert',
    category: 'Dessert'
  },
  { 
    id: '8', 
    name: 'Rooibos Tea', 
    price: 29.99, 
    image: 'https://images.unsplash.com/photo-1561047029-3000c68339ca?w=400',
    description: 'Traditional herbal tea from South Africa',
    category: 'Drink'
  },
];

export default function HomeScreen() {
  return (
    <ScrollView style={styles.container}>
      {/* Hero Section */}
      <View style={styles.hero}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=1200&fit=crop' }}
          style={styles.heroImage}
          resizeMode="cover"
        />
        <View style={styles.heroOverlay}>
          <Text style={styles.heroTitle}>Mzansi Meals</Text>
          <Text style={styles.heroSubtitle}>Experience Authentic South African Flavors</Text>
          <TouchableOpacity style={styles.ctaButton}>
            <Link href="/menu" asChild>
              <Text style={styles.ctaText}>View Full Menu →</Text>
            </Link>
          </TouchableOpacity>
        </View>
      </View>

      {/* Welcome Section */}
      <View style={styles.welcomeSection}>
        <Text style={styles.welcomeTitle}>Welcome to Mzansi Meals</Text>
        <Text style={styles.welcomeText}>
          Indulge in the rich, diverse flavors of South Africa. From traditional 
          Bunny Chow to delicious Melktert, we bring the taste of the Rainbow 
          Nation to your table.
        </Text>
      </View>

      {/* Featured Items */}
      <Text style={styles.menuTitle}>Chef\'s Recommendations</Text>
      
      {featuredItems.map((item) => (
        <Link key={item.id} href={`/menu/${item.id}`} asChild>
          <TouchableOpacity style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.info}>
              <View style={styles.headerRow}>
                <Text style={styles.name}>{item.name}</Text>
                <Text style={styles.category}>{item.category}</Text>
              </View>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={styles.price}>R {item.price.toFixed(2)}</Text>
            </View>
          </TouchableOpacity>
        </Link>
      ))}

      {/* Call to Action */}
      <View style={styles.ctaSection}>
        <Text style={styles.ctaTitle}>Ready to Taste South Africa?</Text>
        <Text style={styles.ctaSubtitle}>Explore our full menu or book a table</Text>
        <View style={styles.buttonRow}>
          <Link href="/menu" asChild>
            <TouchableOpacity style={[styles.actionButton, styles.menuButton]}>
              <Text style={styles.actionButtonText}>View Full Menu</Text>
            </TouchableOpacity>
          </Link>
          <Link href="/(tabs)/bookings" asChild>
            <TouchableOpacity style={[styles.actionButton, styles.bookButton]}>
              <Text style={styles.actionButtonText}>Book a Table</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a1a' },
  hero: { height: 300, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  heroOverlay: {
    position: 'absolute', bottom: 0, left: 0, right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)', padding: 25,
  },
  heroTitle: { color: '#FFD700', fontSize: 32, fontWeight: 'bold', marginBottom: 5 },
  heroSubtitle: { color: '#fff', fontSize: 18, marginBottom: 15 },
  ctaButton: { 
    backgroundColor: '#FFD700', 
    paddingHorizontal: 20, 
    paddingVertical: 12, 
    borderRadius: 25,
    alignSelf: 'flex-start',
  },
  ctaText: { 
    color: '#1a1a1a', 
    fontWeight: 'bold', 
    fontSize: 14 
  },
  welcomeSection: {
    padding: 25,
    backgroundColor: '#2a2a2a',
    marginVertical: 20,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 10,
  },
  welcomeText: {
    fontSize: 16,
    color: '#ccc',
    lineHeight: 24,
  },
  menuTitle: { 
    fontSize: 26, 
    fontWeight: 'bold', 
    color: '#FFD700', 
    margin: 20, 
    marginBottom: 10 
  },
  card: { 
    backgroundColor: '#2a2a2a', 
    marginHorizontal: 20, 
    marginBottom: 15, 
    borderRadius: 10, 
    overflow: 'hidden', 
    flexDirection: 'row',
  },
  itemImage: { width: 100, height: 100 },
  info: { flex: 1, padding: 15, justifyContent: 'center' },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  name: { fontSize: 18, fontWeight: 'bold', color: '#fff' },
  category: { 
    fontSize: 11, 
    color: '#FFD700', 
    backgroundColor: 'rgba(255,215,0,0.1)', 
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  description: { fontSize: 12, color: '#ccc', marginBottom: 8 },
  price: { fontSize: 16, fontWeight: 'bold', color: '#FFD700' },
  ctaSection: {
    backgroundColor: '#2a2a2a',
    margin: 20,
    padding: 25,
    borderRadius: 10,
    alignItems: 'center',
  },
  ctaTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 8,
    textAlign: 'center',
  },
  ctaSubtitle: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  actionButton: {
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 25,
    marginHorizontal: 8,
    marginBottom: 10,
    minWidth: 140,
    alignItems: 'center',
  },
  menuButton: {
    backgroundColor: '#FFD700',
  },
  bookButton: {
    backgroundColor: '#e74c3c',
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
