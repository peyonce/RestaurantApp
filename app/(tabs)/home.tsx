  import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import React from 'react';
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useCart } from '../contexts/CartProvider';

interface Category {
  id: string;
  name: string;
  icon: string;
}

interface FoodItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

export default function HomeScreen() {
  const { addToCart } = useCart();

  const categories: Category[] = [
    { id: '1', name: 'Burgers', icon: '🍔' },
    { id: '2', name: 'Pizza', icon: '🍕' },
    { id: '3', name: 'Drinks', icon: '🥤' },
    { id: '4', name: 'Desserts', icon: '🍰' },
    { id: '5', name: 'Salads', icon: '🥗' },
    { id: '6', name: 'Pasta', icon: '🍝' },
  ];

  const popularItems: FoodItem[] = [
    {
      id: '1',
      name: 'Classic Burger',
      description: 'Beef patty with cheese and vegetables',
      price: 12.99,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    },
    {
      id: '2',
      name: 'Pepperoni Pizza',
      description: 'Classic pizza with pepperoni',
      price: 18.99,
      image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?w=400',
    },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Good evening! 👋</Text>
          <Text style={styles.location}>
            <FontAwesome name="map-marker" size={16} color="#FFD700" />
            {' '}Delivery to: Home
          </Text>
        </View>
        <TouchableOpacity 
          style={styles.profileButton}
          onPress={() => router.push('/profile')}
        >
          <FontAwesome name="user-circle" size={32} color="#FFD700" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <TouchableOpacity 
          style={styles.searchBar}
          onPress={() => router.push('/menu')}
        >
          <FontAwesome name="search" size={20} color="#999" />
          <Text style={styles.searchText}>Search food or restaurant...</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContainer}
        >
          {categories.map((category) => (
            <TouchableOpacity 
              key={category.id} 
              style={styles.categoryCard}
              onPress={() => router.push(`/menu?category=${category.name.toLowerCase()}`)}
            >
              <View style={styles.categoryIcon}>
                <Text style={styles.categoryEmoji}>{category.icon}</Text>
              </View>
              <Text style={styles.categoryName}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Items</Text>
          <TouchableOpacity onPress={() => router.push('/menu')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>

        {popularItems.map((item) => (
          <TouchableOpacity 
            key={item.id} 
            style={styles.foodCard}
            onPress={() => router.push(`/menu/${item.id}`)}
          >
            <Image source={{ uri: item.image }} style={styles.foodImage} />
            <View style={styles.foodInfo}>
              <Text style={styles.foodName}>{item.name}</Text>
              <Text style={styles.foodDescription} numberOfLines={2}>
                {item.description}
              </Text>
              <View style={styles.foodFooter}>
                <Text style={styles.foodPrice}>${item.price.toFixed(2)}</Text>
                <TouchableOpacity 
                  style={styles.addButton}
                  onPress={(e) => {
                    e.stopPropagation();
                    addToCart({
                      menuItemId: item.id,
                      name: item.name,
                      price: item.price,
                      quantity: 1,
                      imageUrl: item.image
                    });
                    Alert.alert('Added to Cart', `${item.name} added to cart!`);
                  }}
                >
                  <Text style={styles.addButtonText}>+ Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.features}>
        <View style={styles.featureItem}>
          <FontAwesome name="truck" size={24} color="#FFD700" />
          <Text style={styles.featureTitle}>Fast Delivery</Text>
          <Text style={styles.featureText}>30-45 minutes</Text>
        </View>
        <View style={styles.featureItem}>
          <FontAwesome name="shield" size={24} color="#FFD700" />
          <Text style={styles.featureTitle}>Quality Guarantee</Text>
          <Text style={styles.featureText}>Fresh ingredients</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.menuButton}
        onPress={() => router.push('/menu')}
        activeOpacity={0.6}
      >
        <FontAwesome name="cutlery" size={20} color="#1a1a1a" />
        <Text style={styles.menuButtonText}>Browse Full Menu</Text>
      </TouchableOpacity>

      <Text style={styles.version}>ÉLÉGANCE v1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a1a' },
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 20, paddingTop: 50, paddingBottom: 20 
  },
  greeting: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF' },
  location: { fontSize: 14, color: '#FFD700', marginTop: 4 },
  profileButton: { 
    width: 44, height: 44, borderRadius: 22, 
    backgroundColor: '#2d2d2d', justifyContent: 'center', alignItems: 'center' 
  },
  searchContainer: { paddingHorizontal: 20, marginBottom: 20 },
  searchBar: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#2d2d2d',
    paddingHorizontal: 15, paddingVertical: 12, borderRadius: 10,
    borderWidth: 1, borderColor: '#444' 
  },
  searchText: { marginLeft: 10, fontSize: 16, color: '#999', flex: 1 },
  section: { paddingHorizontal: 20, marginBottom: 25 },
  categoriesContainer: { paddingRight: 20 },
  sectionHeader: { 
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 15 
  },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', color: '#FFFFFF' },
  seeAll: { fontSize: 14, color: '#FFD700', fontWeight: '600' },
  categoryCard: { alignItems: 'center', marginRight: 20, width: 80 },
  categoryIcon: { 
    width: 70, height: 70, borderRadius: 35, backgroundColor: '#2d2d2d',
    justifyContent: 'center', alignItems: 'center', marginBottom: 8,
    borderWidth: 2, borderColor: '#444' 
  },
  categoryEmoji: { fontSize: 30 },
  categoryName: { fontSize: 14, fontWeight: '600', color: '#FFFFFF', textAlign: 'center' },
  foodCard: { 
    flexDirection: 'row', backgroundColor: '#2d2d2d', borderRadius: 12,
    marginBottom: 15, padding: 12, borderWidth: 1, borderColor: '#444' 
  },
  foodImage: { width: 100, height: 100, borderRadius: 8 },
  foodInfo: { flex: 1, marginLeft: 15, justifyContent: 'space-between' },
  foodName: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 4 },
  foodDescription: { fontSize: 14, color: '#999', marginBottom: 10, lineHeight: 18 },
  foodFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  foodPrice: { fontSize: 18, fontWeight: 'bold', color: '#FFD700' },
  addButton: { backgroundColor: '#FFD700', paddingHorizontal: 20, paddingVertical: 8, borderRadius: 8 },
  addButtonText: { color: '#1a1a1a', fontSize: 14, fontWeight: 'bold' },
  features: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 20, paddingBottom: 20 },
  featureItem: { 
    flex: 1, backgroundColor: '#2d2d2d', padding: 20, borderRadius: 12,
    marginHorizontal: 5, alignItems: 'center', borderWidth: 1, borderColor: '#444' 
  },
  featureTitle: { fontSize: 16, fontWeight: 'bold', color: '#FFFFFF', marginTop: 10, marginBottom: 4 },
  featureText: { fontSize: 14, color: '#999', textAlign: 'center' },
  menuButton: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#FFD700', marginHorizontal: 20, marginBottom: 20,
    paddingVertical: 16, borderRadius: 12, gap: 10 
  },
  menuButtonText: { color: '#1a1a1a', fontSize: 16, fontWeight: 'bold' },
  version: { textAlign: 'center', color: '#666', fontSize: 12, paddingVertical: 30 },
});