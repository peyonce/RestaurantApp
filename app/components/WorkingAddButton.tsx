import React from 'react';
import { TouchableOpacity, Text, Alert } from 'react-native';
import { useCart } from '@/app/contexts/CartProvider';

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
      addToCart(item);
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
      style={{
        backgroundColor: '#FFD700',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
        marginTop: 10,
        alignItems: 'center',
      }}
    >
      <Text style={{ 
        color: '#000000', 
        fontSize: 16, 
        fontWeight: 'bold' 
      }}>
        Add to Cart
      </Text>
    </TouchableOpacity>
  );
};

export default WorkingAddButton;
