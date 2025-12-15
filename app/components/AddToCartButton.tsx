import React, { useState } from 'react';
import { TouchableOpacity, Text, StyleSheet, Alert, View } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useCart } from '../contexts/CartProvider';

interface AddToCartButtonProps {
  menuItemId: string;
  name: string;
  price: number;
  imageUrl: string;
}

export default function AddToCartButton({ menuItemId, name, price, imageUrl }: AddToCartButtonProps) {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);

  const handleAddToCart = async () => {
    try {
      setAdding(true);
      await addToCart({
        menuItemId,
        name,
        price,
        quantity: 1,
        imageUrl,
      });
      Alert.alert('Success', `${name} added to cart!`);
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Failed to add to cart');
    } finally {
      setAdding(false);
    }
  };

  return (
    <TouchableOpacity 
      style={styles.button} 
      onPress={handleAddToCart}
      disabled={adding}
    >
      <View style={styles.buttonContent}>
        <FontAwesome name="cart-plus" size={18} color="#1a1a1a" />
        <Text style={styles.buttonText}>
          {adding ? 'Adding...' : 'Add to Cart'}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    marginTop: 10,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: {
    color: '#1a1a1a',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
