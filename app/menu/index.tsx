import { useRouter } from 'expo-router';
import React from 'react';
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

const menuItems = [
  {
    id: '1',
    name: 'Bunny Chow',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400',
  },
  {
    id: '2', 
    name: 'Boerewors Roll',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400',
  },
];

export default function MenuScreen() {
  const router = useRouter();

  const handleBack = () => {
    router.back();
  };

  const handleAddToCart = (itemName: string) => {
    Alert.alert('Success!', `Added ${itemName} to cart`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Menu Items</Text>
      
      <FlatList
        data={menuItems}
        renderItem={({item}) => (
          <View style={styles.itemCard}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>R {item.price.toFixed(2)}</Text>
            </View>
            <TouchableOpacity 
              style={styles.cartButton}
              onPress={() => handleAddToCart(item.name)}
            >
              <Text style={styles.cartButtonText}>ADD</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50',
  },
  list: {
    paddingBottom: 20,
  },
  itemCard: {
    flexDirection: 'row',
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#eaeaea',
  },
  itemImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 15,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  cartButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  cartButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
