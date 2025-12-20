import React from 'react';
import { TouchableOpacity, Text, Alert, StyleSheet } from 'react-native';
import { useCart } from '@contexts/CartProvider';

interface WorkingAddButtonProps {
  item: {
    id: string;
    name: string;
    price: number;
    image?: string;
  };
}

const WorkingAddButton: React.FC<WorkingAddButtonProps> = ({ item }) => {
  const { addToCart, itemCount } = useCart();

  const handlePress = () => {
    console.log('WorkingAddButton: Adding item to cart:', item.name);
    
    try {
      // Create a proper CartItem object (without id since addToCart expects Omit<CartItem, "id">)
      const cartItem = {
        menuItemId: item.id, // Use item.id as menuItemId
        name: item.name,
        price: item.price,
        quantity: 1, // Default quantity
        image: item.image || '',
        imageUrl: item.image || '',
        specialInstructions: ''
      };
      
      addToCart(cartItem); // This is line 28, not 21
      Alert.alert(
        'Success!',
        `${item.name} added to cart\nTotal items: ${itemCount + 1}`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Error', 'Failed to add item to cart');
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      style={styles.button}
    >
      <Text style={styles.text}>Add to Cart</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#FFD700',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: '600' as const,
  },
});

export default WorkingAddButton;
