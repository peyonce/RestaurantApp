import React, { useState } from 'react';
import { 
  View, Text, StyleSheet, Image, TouchableOpacity, 
  ScrollView, Alert 
} from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';
import { useCart } from '@/contexts/CartProvider';

const menuItems = {
  '1': {
    id: '1',
    name: 'Bunny Chow',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
    description: 'Hollowed-out bread loaf filled with curry',
  },
  '2': {
    id: '2',
    name: 'Bobotie',
    price: 149.99,
    image: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400',
    description: 'Spiced minced meat with egg topping',
  },
  '3': {
    id: '3',
    name: 'Boerewors Roll',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1553979459-d2229ba7433?w=400',
    description: 'Traditional sausage in a fresh roll',
  },
};

export default function MenuItemDetailScreen() {
  const params = useLocalSearchParams();
  const id = params.id as string;
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const menuItem = menuItems[id as keyof typeof menuItems] || menuItems['1'];

  const handleAddToCart = () => {
    console.log('🎯 Add to Cart clicked for:', menuItem.name);
    
    addToCart({
      menuItemId: menuItem.id,
      name: menuItem.name,
      price: menuItem.price,
      image: menuItem.image,
      quantity: quantity
    });
    
    Alert.alert('✅ Added!', `${quantity}x ${menuItem.name} added to cart`);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={20} color="#FFD700" />
        </TouchableOpacity>
        <Text style={styles.title}>{menuItem.name}</Text>
      </View>

      <Image source={{ uri: menuItem.image }} style={styles.image} />
      
      <View style={styles.content}>
        <Text style={styles.price}>R {menuItem.price.toFixed(2)}</Text>
        <Text style={styles.description}>{menuItem.description}</Text>

        <View style={styles.quantityRow}>
          <TouchableOpacity 
            style={styles.qtyBtn}
            onPress={() => setQuantity(q => q > 1 ? q - 1 : 1)}
            activeOpacity={0.7}
          >
            <FontAwesome name="minus" size={18} color="#fff" />
          </TouchableOpacity>
          
          <Text style={styles.qtyText}>{quantity}</Text>
          
          <TouchableOpacity 
            style={styles.qtyBtn}
            onPress={() => setQuantity(q => q + 1)}
            activeOpacity={0.7}
          >
            <FontAwesome name="plus" size={18} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* FIXED: Better button styling */}
        <TouchableOpacity 
          style={styles.addBtn}
          onPress={handleAddToCart}
          activeOpacity={0.7}
        >
          <FontAwesome name="shopping-cart" size={20} color="#000" />
          <Text style={styles.addBtnText}>
            Add {quantity}x to Cart - R {(menuItem.price * quantity).toFixed(2)}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a1a' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 20, 
    paddingTop: 60, 
    backgroundColor: '#2a2a2a' 
  },
  backButton: { padding: 10 },
  title: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#FFD700', 
    marginLeft: 20,
    flex: 1 
  },
  image: { width: '100%', height: 250 },
  content: { padding: 20 },
  price: { 
    fontSize: 28, 
    color: '#FFD700', 
    fontWeight: 'bold',
    marginBottom: 15 
  },
  description: { 
    fontSize: 16, 
    color: '#ccc', 
    marginBottom: 30,
    lineHeight: 22 
  },
  quantityRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    marginBottom: 30 
  },
  qtyBtn: { 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    backgroundColor: '#333', 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  qtyText: { 
    fontSize: 24, 
    color: '#fff', 
    marginHorizontal: 30,
    minWidth: 40,
    textAlign: 'center' 
  },
  addBtn: { 
    backgroundColor: '#FFD700', 
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 18, 
    borderRadius: 10, 
    marginTop: 10 
  },
  addBtnText: { 
    color: '#000', 
    fontSize: 18, 
    fontWeight: 'bold', 
    marginLeft: 10 
  },
});
