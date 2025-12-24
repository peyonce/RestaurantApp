import React, { useState } from 'react';
import { TouchableOpacity, Text, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { useCart } from '@contexts/CartProvider';

export default function AddToCartButton({ item }: any) {
  const { addToCart } = useCart();
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    if (!item || !item.id || !item.name || !item.price) {
      Alert.alert('Error', 'Invalid item data');
      return;
    }
    
    setLoading(true);
    try {
        await addToCart({
          name: item.name,
          price: Number(item.price) || 0,
          quantity: 1,
          image: item.image || item.imageUrl || "default-image",
          menuItemId: item.id
        });
    } catch (error) {
      console.error('Add to cart error:', error);
      Alert.alert('Error', 'Failed to add to cart');
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableOpacity 
      style={[styles.button, loading && styles.buttonDisabled]}
      onPress={handleAdd}
      disabled={loading}
    >
      {loading ? (
        <ActivityIndicator color="#1a1a1a" size="small" />
      ) : (
        <>
          <FontAwesome name="cart-plus" size={18} color="#000" />
          <Text style={styles.text}>Add to Cart</Text>
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center',
    backgroundColor: '#FFD700', 
    paddingHorizontal: 16, 
    paddingVertical: 10, 
    borderRadius: 8,
    gap: 8 
  },
  buttonDisabled: {
    backgroundColor: '#666',
  },
  text: { 
    color: '#000', 
    fontSize: 14, 
    fontWeight: '600' as const // Changed from 'bold' to '600'
  }
});
