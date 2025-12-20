import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useCart } from '@/contexts/CartProvider';

// Sample specials data
const mzansiSpecials = [
  {
    id: 'special-1',
    name: 'Family Feast',
    description: 'Bunny Chow, Boerewors, Pap & Chakalaka for 4',
    price: 499.99,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
    items: [
      { name: 'Bunny Chow (Large)', quantity: 1 },
      { name: 'Boerewors Roll', quantity: 4 },
      { name: 'Pap & Wors', quantity: 2 },
      { name: 'Chakalaka & Bread', quantity: 1 },
    ]
  },
  {
    id: 'special-2', 
    name: 'Braai Bundle',
    description: 'Everything you need for a proper South African braai',
    price: 349.99,
    image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&fit=crop',
    items: [
      { name: 'Braaied Steak', quantity: 4 },
      { name: 'Boerewors', quantity: 6 },
      { name: 'Pap', quantity: 1 },
      { name: 'Chakalaka', quantity: 1 },
    ]
  },
  {
    id: 'special-3',
    name: 'Dessert Platter',
    description: 'Sweet treats for the whole family',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400',
    items: [
      { name: 'Melktert', quantity: 1 },
      { name: 'Koeksister', quantity: 6 },
      { name: 'Malva Pudding', quantity: 1 },
    ]
  }
];

export default function HomeScreen() {
  const router = useRouter();
  const { addToCart } = useCart();

  const handleOrderSpecial = (special: typeof mzansiSpecials[0]) => {
    console.log('🎯 Ordering special:', special.name);
    
    // Add the entire special as ONE cart item with the correct price
    addToCart({
      id: special.id,
      name: special.name + " (Bundle)",
      price: special.price,
      image: special.image,
      quantity: 1
    });
    
    // Navigate to cart
    router.push('/(tabs)/cart');
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Hero Section */}
      <View style={styles.hero}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1200' }}
          style={styles.heroImage}
        />
        <View style={styles.heroOverlay}>
          <Text style={styles.heroTitle}>Mzansi Meals</Text>
          <Text style={styles.heroSubtitle}>Authentic South African Cuisine Delivered</Text>
          <TouchableOpacity 
            style={styles.heroButton}
            onPress={() => Alert.alert('Braai Specials', 'Our braai menu is coming soon! For now, check out our Mzansi Specials above.')}
          >
            <Text style={styles.heroButtonText}>Order Now</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Mzansi Specials */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mzansi Specials</Text>
        <Text style={styles.sectionSubtitle}>Curated bundles for the ultimate South African experience</Text>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.specialsScroll}>
          {mzansiSpecials.map((special) => (
            <View key={special.id} style={styles.specialCard}>
              <Image source={{ uri: special.image }} style={styles.specialImage} />
              <View style={styles.specialContent}>
                <Text style={styles.specialName}>{special.name}</Text>
                <Text style={styles.specialDescription}>{special.description}</Text>
                
                <View style={styles.specialItems}>
                  {special.items.map((item, index) => (
                    <Text key={index} style={styles.specialItem}>
                      • {item.quantity}x {item.name}
                    </Text>
                  ))}
                </View>
                
                <View style={styles.specialFooter}>
                  <Text style={styles.specialPrice}>R {special.price.toFixed(2)}</Text>
                  <TouchableOpacity 
                    style={styles.specialButton}
                    onPress={() => handleOrderSpecial(special)}
                  >
                    <Text style={styles.specialButtonText}>Add to Cart</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Featured Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Featured Categories</Text>
        
        <View style={styles.categories}>
          <TouchableOpacity 
            style={styles.categoryCard}
            onPress={() => Alert.alert('Braai Specials', 'Our braai menu is coming soon! For now, check out our Mzansi Specials above.')}
          >
            <View style={[styles.categoryIcon, { backgroundColor: '#8B4513' }]}>
              <FontAwesome name="fire" size={30} color="#FFD700" />
            </View>
            <Text style={styles.categoryName}>Braai Specials</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.categoryCard}
            onPress={() => Alert.alert('Braai Specials', 'Our braai menu is coming soon! For now, check out our Mzansi Specials above.')}
          >
            <View style={[styles.categoryIcon, { backgroundColor: '#D2691E' }]}>
              <FontAwesome name="birthday-cake" size={30} color="#FFD700" />
            </View>
            <Text style={styles.categoryName}>Desserts</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.categoryCard}
            onPress={() => Alert.alert('Braai Specials', 'Our braai menu is coming soon! For now, check out our Mzansi Specials above.')}
          >
            <View style={[styles.categoryIcon, { backgroundColor: '#228B22' }]}>
              <FontAwesome name="glass" size={30} color="#FFD700" />
            </View>
            <Text style={styles.categoryName}>Drinks</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  hero: {
    height: 400,
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: '100%',
  },
  heroOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    padding: 30,
  },
  heroTitle: {
    color: '#FFD700',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  heroSubtitle: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 20,
  },
  heroButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    alignSelf: 'flex-start',
  },
  heroButtonText: {
    color: '#1a1a1a',
    fontSize: 18,
    fontWeight: 'bold',
  },
  section: {
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  sectionTitle: {
    color: '#FFD700',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionSubtitle: {
    color: '#ccc',
    fontSize: 16,
    marginBottom: 20,
  },
  specialsScroll: {
    marginHorizontal: -20,
  },
  specialCard: {
    width: 300,
    backgroundColor: '#2a2a2a',
    borderRadius: 15,
    marginRight: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#333',
  },
  specialImage: {
    width: '100%',
    height: 150,
  },
  specialContent: {
    padding: 20,
  },
  specialName: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  specialDescription: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 15,
    lineHeight: 20,
  },
  specialItems: {
    marginBottom: 15,
  },
  specialItem: {
    color: '#999',
    fontSize: 12,
    marginBottom: 3,
  },
  specialFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  specialPrice: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: 'bold',
  },
  specialButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  specialButtonText: {
    color: '#1a1a1a',
    fontSize: 14,
    fontWeight: 'bold',
  },
  stepsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  step: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  stepIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#2a2a2a',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  stepTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  stepDescription: {
    color: '#999',
    fontSize: 12,
    textAlign: 'center',
    lineHeight: 16,
  },
  categories: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  categoryCard: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  categoryIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});
