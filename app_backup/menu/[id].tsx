 import { FontAwesome } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { useCart } from '../contexts/CartProvider';

// Define MenuItem type
interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  ingredients: string[];
}

// Menu data - should match the data in index.tsx
const menuData: MenuItem[] = [
  { id: '1', name: 'Truffle Burger', price: 28.99, description: 'Premium beef burger with truffle aioli, caramelized onions, and aged cheddar on a brioche bun', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', category: 'burgers', ingredients: ['Premium Beef', 'Truffle Aioli', 'Caramelized Onions', 'Aged Cheddar', 'Brioche Bun', 'Lettuce', 'Tomato'] },
  { id: '2', name: 'Cheeseburger', price: 22.99, description: 'Classic burger with aged cheddar cheese, lettuce, tomato, and special sauce', image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400', category: 'burgers', ingredients: ['Beef Patty', 'Aged Cheddar', 'Lettuce', 'Tomato', 'Onion', 'Pickles', 'Special Sauce'] },
  { id: '3', name: 'BBQ Bacon Burger', price: 24.99, description: 'Juicy beef burger with crispy bacon, BBQ sauce, and smoked gouda', image: 'https://placehold.co/400x300/8B4513/FFFFFF?text=BBQ+Burger', category: 'burgers', ingredients: ['Beef Patty', 'Crispy Bacon', 'BBQ Sauce', 'Smoked Gouda', 'Onion Rings', 'Brioche Bun'] },
  { id: '4', name: 'Craft Cocktail', price: 16.99, description: 'Signature craft cocktail with premium spirits and fresh ingredients', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400', category: 'drinks', ingredients: ['Premium Spirit', 'Fresh Citrus', 'Herbal Syrup', 'Soda Water', 'Ice'] },
  { id: '5', name: 'Fresh Lemonade', price: 8.99, description: 'Homemade lemonade with fresh lemons and a hint of mint', image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400', category: 'drinks', ingredients: ['Fresh Lemons', 'Pure Cane Sugar', 'Filtered Water', 'Mint Leaves', 'Ice'] },
  { id: '6', name: 'Craft Beer', price: 12.99, description: 'Local craft beer with unique hops and malts', image: 'https://placehold.co/400x300/FFD700/000000?text=Craft+Beer', category: 'drinks', ingredients: ['Malted Barley', 'Hops', 'Yeast', 'Water'] },
  { id: '7', name: 'Grilled Steak', price: 32.99, description: 'Prime steak grilled to perfection with herb butter', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400', category: 'meat', ingredients: ['Prime Ribeye', 'Sea Salt', 'Black Pepper', 'Herb Butter', 'Garlic'] },
  { id: '8', name: 'BBQ Ribs', price: 26.99, description: 'Slow-cooked pork ribs with homemade BBQ sauce', image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400', category: 'meat', ingredients: ['Pork Ribs', 'BBQ Sauce', 'Spices', 'Brown Sugar', 'Apple Cider Vinegar'] },
  { id: '9', name: 'Chocolate Cake', price: 14.99, description: 'Warm chocolate lava cake with vanilla ice cream', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', category: 'desserts', ingredients: ['Dark Chocolate', 'Flour', 'Eggs', 'Sugar', 'Butter', 'Vanilla Ice Cream'] },
  { id: '10', name: 'New York Cheesecake', price: 13.99, description: 'Classic New York style cheesecake with berry compote', image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400', category: 'desserts', ingredients: ['Cream Cheese', 'Graham Cracker Crust', 'Eggs', 'Sugar', 'Sour Cream', 'Berry Compote'] },
];

export default function MenuItemDetailScreen() {
  const params = useLocalSearchParams();
  const id = typeof params.id === 'string' ? params.id : params.id?.[0] || '';
  
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [menuItem, setMenuItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true); // Changed from false to true

  useEffect(() => {
    if (id) {
      loadMenuItem();
    } else {
      setLoading(false);
    }
  }, [id]);

  const loadMenuItem = () => {
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const item = menuData.find(item => item.id === id);
      if (item) {
        setMenuItem(item);
      }
      setLoading(false);
    }, 500);
  };

  const handleAddToCart = () => {
    if (!menuItem) return;
    
    // Create cart item matching CartItem type from CartProvider
    const cartItem = {
      menuItemId: menuItem.id,  // Changed from 'id' to 'menuItemId'
      name: menuItem.name,
      price: menuItem.price,
      quantity: quantity,
      imageUrl: menuItem.image  // Changed from 'image' to 'imageUrl'
    };
    
    console.log('Adding to cart:', cartItem);
    
    // Call addToCart with correct parameters
    addToCart(cartItem);
    
    Alert.alert(
      'Added to Cart',
      `${quantity} x ${menuItem.name} added to your cart`,
      [
        { text: 'Continue Shopping', style: 'cancel' },
        { text: 'View Cart', onPress: () => router.push('/cart') } // Fixed router path
      ]
    );
  };

  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => prev > 1 ? prev - 1 : 1);

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContainer]}>
        <ActivityIndicator size="large" color="#FFD700" />
        <Text style={styles.loadingText}>Loading item details...</Text>
      </View>
    );
  }

  if (!menuItem) {
    return (
      <View style={[styles.container, styles.centerContainer]}>
        <FontAwesome name="exclamation-circle" size={50} color="#FF6B6B" />
        <Text style={styles.errorText}>Item not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back to Menu</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Image */}
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: menuItem.image }} 
          style={styles.headerImage} 
          resizeMode="cover"
        />
        
        {/* Back Button */}
        <TouchableOpacity 
          style={styles.backButtonTop} 
          onPress={() => router.back()}
        >
          <FontAwesome name="arrow-left" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <View style={styles.content}>
        {/* Name and Price */}
        <View style={styles.titleRow}>
          <Text style={styles.itemName}>{menuItem.name}</Text>
          <Text style={styles.itemPrice}>${menuItem.price.toFixed(2)}</Text>
        </View>

        {/* Category Tag */}
        <View style={styles.categoryTag}>
          <Text style={styles.categoryText}>
            {menuItem.category.charAt(0).toUpperCase() + menuItem.category.slice(1)}
          </Text>
        </View>

        {/* Description */}
        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{menuItem.description}</Text>

        {/* Ingredients */}
        <Text style={styles.sectionTitle}>Ingredients</Text>
        <View style={styles.ingredientsContainer}>
          {menuItem.ingredients.map((ingredient: string, index: number) => (
            <View key={index} style={styles.ingredientTag}>
              <Text style={styles.ingredientText}>{ingredient}</Text>
            </View>
          ))}
        </View>

        {/* Quantity Selector */}
        <Text style={styles.sectionTitle}>Quantity</Text>
        <View style={styles.quantityContainer}>
          <TouchableOpacity 
            style={styles.quantityButton} 
            onPress={decrementQuantity}
          >
            <Text style={styles.quantityButtonText}>-</Text>
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>{quantity}</Text>
          
          <TouchableOpacity 
            style={styles.quantityButton} 
            onPress={incrementQuantity}
          >
            <Text style={styles.quantityButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        {/* Add to Cart Button */}
        <TouchableOpacity 
          style={styles.addToCartButton} 
          onPress={handleAddToCart}
        >
          <FontAwesome name="shopping-cart" size={20} color="#1a1a1a" style={styles.cartIcon} />
          <Text style={styles.addToCartText}>
            Add to Cart - ${(menuItem.price * quantity).toFixed(2)}
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
  centerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    color: '#FFFFFF',
    marginTop: 20,
    fontSize: 16,
  },
  errorText: {
    color: '#FF6B6B',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 30,
  },
  imageContainer: {
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: 300,
  },
  backButtonTop: {
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
  titleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemName: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
    marginRight: 10,
  },
  itemPrice: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  categoryTag: {
    backgroundColor: '#2d2d2d',
    alignSelf: 'flex-start',
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 15,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#444',
  },
  categoryText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 25,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#CCCCCC',
    lineHeight: 24,
  },
  ingredientsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 5,
  },
  ingredientTag: {
    backgroundColor: '#2d2d2d',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#444',
  },
  ingredientText: {
    color: '#FFFFFF',
    fontSize: 14,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 15,
    marginBottom: 30,
  },
  quantityButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#2d2d2d',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444',
  },
  quantityButtonText: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: 'bold',
  },
  quantityText: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginHorizontal: 30,
    minWidth: 40,
    textAlign: 'center',
  },
  addToCartButton: {
    backgroundColor: '#FFD700',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 12,
    marginTop: 10,
  },
  cartIcon: {
    marginRight: 10,
  },
  addToCartText: {
    color: '#1a1a1a',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
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
});