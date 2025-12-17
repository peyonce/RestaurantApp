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
    { id: '2', name: 'Braai', icon: '🔥' },
    { id: '3', name: 'Mains', icon: '🍛' },
    { id: '4', name: 'Sides', icon: '🍟' },
    { id: '5', name: 'Drinks', icon: '🥤' },
    { id: '6', name: 'Desserts', icon: '🍰' },
  ];

  const popularItems: FoodItem[] = [
    {
      id: '1',
      name: 'Boerewors Burger',
      description: 'Traditional SA sausage with chakalaka relish',
      price: 89.99,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400',
    },
    {
      id: '2',
      name: 'Braai Platter',
      description: 'Mixed grill with boerewors, steak and pap',
      price: 189.99,
      image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w-400',
    },
    {
      id: '3',
      name: 'Bobotie Bowl',
      description: 'Cape Malay minced meat bake with yellow rice',
      price: 125.99,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
    },
    {
      id: '4',
      name: 'Koeksisters',
      description: 'Traditional syrup-coated doughnuts',
      price: 28.99,
      image: 'https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400',
    },
  ];

  const handleAddToCart = (item: FoodItem) => {
    addToCart({
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      quantity: 1,
      image: item.image,
      imageUrl: item.image
    });
    Alert.alert('Added!', `${item.name} added to cart`);
  };

  const handleCategoryPress = (category: Category) => {
    router.push(`/menu?category=${category.name}`);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Welcome to</Text>
          <Text style={styles.restaurantName}>Mzansi Meals</Text>
          <Text style={styles.slogan}>Taste the Rainbow Nation 🇿🇦</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/profile')}>
          <FontAwesome name="user-circle" size={40} color="#FFD700" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <TouchableOpacity 
        style={styles.searchBar}
        onPress={() => router.push('/menu')}
      >
        <FontAwesome name="search" size={20} color="#999" />
        <Text style={styles.searchText}>Search Mzansi dishes...</Text>
      </TouchableOpacity>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={styles.categoryCard}
              onPress={() => handleCategoryPress(category)}
            >
              <Text style={styles.categoryIcon}>{category.icon}</Text>
              <Text style={styles.categoryName}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Popular Items */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Popular Now</Text>
          <TouchableOpacity onPress={() => router.push('/menu')}>
            <Text style={styles.seeAll}>See All</Text>
          </TouchableOpacity>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {popularItems.map((item) => (
            <View key={item.id} style={styles.foodCard}>
              <Image source={{ uri: item.image }} style={styles.foodImage} />
              <View style={styles.foodInfo}>
                <Text style={styles.foodName}>{item.name}</Text>
                <Text style={styles.foodDescription} numberOfLines={2}>
                  {item.description}
                </Text>
                <View style={styles.foodFooter}>
                  <Text style={styles.foodPrice}>R{item.price.toFixed(2)}</Text>
                  <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => handleAddToCart(item)}
                  >
                    <FontAwesome name="plus" size={16} color="#1a1a1a" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Special Offers */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mzansi Specials</Text>
        <View style={styles.offerCard}>
          <View style={styles.offerContent}>
            <Text style={styles.offerTitle}>Free Delivery!</Text>
            <Text style={styles.offerText}>
              Orders over R200 get FREE delivery
            </Text>
            <TouchableOpacity style={styles.orderButton}>
              <Text style={styles.orderButtonText}>Order Now</Text>
            </TouchableOpacity>
          </View>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400' }}
            style={styles.offerImage}
          />
        </View>
      </View>

      {/* Quick Actions */}
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/bookings')}>
          <FontAwesome name="calendar" size={24} color="#FFD700" />
          <Text style={styles.actionText}>Book Table</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/orders')}>
          <FontAwesome name="history" size={24} color="#FFD700" />
          <Text style={styles.actionText}>My Orders</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.actionButton} onPress={() => router.push('/settings')}>
          <FontAwesome name="cog" size={24} color="#FFD700" />
          <Text style={styles.actionText}>Settings</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  welcomeText: {
    color: '#fff',
    fontSize: 16,
    opacity: 0.8,
  },
  restaurantName: {
    color: '#FFD700',
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 4,
  },
  slogan: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.7,
    marginTop: 2,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d2d2d',
    marginHorizontal: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 24,
  },
  searchText: {
    color: '#999',
    fontSize: 16,
    marginLeft: 12,
  },
  section: {
    marginBottom: 32,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  seeAll: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
  },
  categoryCard: {
    alignItems: 'center',
    backgroundColor: '#2d2d2d',
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    minWidth: 80,
  },
  categoryIcon: {
    fontSize: 28,
    marginBottom: 8,
  },
  categoryName: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  foodCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 16,
    marginRight: 16,
    width: 220,
    overflow: 'hidden',
  },
  foodImage: {
    width: '100%',
    height: 140,
  },
  foodInfo: {
    padding: 16,
  },
  foodName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  foodDescription: {
    color: '#999',
    fontSize: 14,
    marginBottom: 12,
    lineHeight: 18,
  },
  foodFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  foodPrice: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#FFD700',
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  offerCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 16,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  offerContent: {
    flex: 1,
  },
  offerTitle: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  offerText: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 16,
    lineHeight: 20,
  },
  orderButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  orderButtonText: {
    color: '#1a1a1a',
    fontSize: 14,
    fontWeight: 'bold',
  },
  offerImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginLeft: 16,
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
  },
  actionButton: {
    alignItems: 'center',
  },
  actionText: {
    color: '#fff',
    fontSize: 12,
    marginTop: 8,
  },
});
