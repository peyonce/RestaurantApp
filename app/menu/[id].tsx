import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, ActivityIndicator 
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useCart } from '../contexts/CartProvider';
import { getMenuItem } from '../services/database';

type MenuItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  ingredients: string[];
  category: string;
};

export default function MenuItemScreen() {
  const { id } = useLocalSearchParams();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMenuItem();
  }, [id]);

  const loadMenuItem = async () => {
    try {
      if (id) {
        const item = await getMenuItem(id as string);
        setMenuItem(item);
      }
    } catch (error) {
      console.error('Error loading menu item:', error);
      Alert.alert('Error', 'Failed to load menu item details');
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = () => {
    if (!menuItem) return;
    
    const item = {
      id: id as string,
      name: menuItem.name,
      price: menuItem.price,
      quantity: quantity,
      image: menuItem.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400'
    };
    
    addToCart(item);
    Alert.alert(
      'Added to Cart',
      `${quantity} x ${menuItem.name} added to your cart`,
      [
        { text: 'Continue Shopping', style: 'cancel' },
        { text: 'View Cart', onPress: () => router.push('/(tabs)/cart') }
      ]
    );
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#FFD700" />
        <Text style={styles.loadingText}>Loading item details...</Text>
      </View>
    );
  }

  if (!menuItem) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.errorText}>Item not found</Text>
        <TouchableOpacity style={styles.backButtonFull} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Image 
        source={{ uri: menuItem.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400' }} 
        style={styles.headerImage} 
      />
      
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Text style={styles.backButtonText}>←</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        <Text style={styles.itemName}>{menuItem.name}</Text>
        <Text style={styles.itemPrice}>${menuItem.price?.toFixed(2) || '0.00'}</Text>
        
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{menuItem.description}</Text>
        
        <Text style={styles.sectionTitle}>Ingredients</Text>
        <View style={styles.ingredients}>
          {(menuItem.ingredients || []).map((ingredient, index) => (
            <View key={index} style={styles.ingredientTag}>
              <Text style={styles.ingredientText}>{ingredient}</Text>
            </View>
          ))}
        </View>

        <View style={styles.quantitySelector}>
          <Text style={styles.sectionTitle}>Quantity</Text>
          <View style={styles.quantityControls}>
            <TouchableOpacity style={styles.quantityButton} onPress={decrementQuantity}>
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantity}>{quantity}</Text>
            <TouchableOpacity style={styles.quantityButton} onPress={incrementQuantity}>
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
          <Text style={styles.addToCartText}>
            Add to Cart - ${((menuItem.price || 0) * quantity).toFixed(2)}
          </Text>
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
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 20,
    fontSize: 16,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 18,
    marginBottom: 20,
  },
  backButtonFull: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
  },
  backButtonText: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: 'bold',
  },
  headerImage: {
    width: '100%',
    height: 300,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  itemName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 24,
    color: '#FFD700',
    fontWeight: 'bold',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#999',
    lineHeight: 24,
  },
  ingredients: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  ingredientTag: {
    backgroundColor: '#2d2d2d',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#444',
  },
  ingredientText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  quantitySelector: {
    marginTop: 30,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#2d2d2d',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444',
  },
  quantityButtonText: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: 'bold',
  },
  quantity: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginHorizontal: 20,
    minWidth: 40,
    textAlign: 'center',
  },
  addToCartButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 30,
  },
  addToCartText: {
    color: '#1a1a1a',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
