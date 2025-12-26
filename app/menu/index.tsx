import { useRouter } from 'expo-router';
import React, { useState } from 'react';
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
    id: "1",
    name: "Bunny Chow",
    price: 129.99,
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400",
    category: "Main Course",
    description: "Curry served in a hollowed-out loaf of bread"
  },
  {
    id: "2",
    name: "Bobotie",
    price: 149.99,
    image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=400",
    category: "Main Course",
    description: "Spiced minced meat with egg-based topping"
  },
  {
    id: "3",
    name: "Boerewors Roll",
    price: 89.99,
    image: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400",
    category: "Street Food",
    description: "Traditional sausage in a fresh roll"
  },
  {
    id: "4",
    name: "Pap & Wors",
    price: 119.99,
    image: "https://images.unsplash.com/photo-1556228578-9c360e1d8d34?w=400",
    category: "Traditional",
    description: "Maize meal with grilled sausage"
  },
  {
    id: "5",
    name: "Biltong Platter",
    price: 99.99,
    image: "https://images.unsplash.com/photo-1589923186741-b7d59d6b2c4d?w=400",
    category: "Starter",
    description: "Assorted dried cured meats"
  },
  {
    id: "6",
    name: "Melktert",
    price: 69.99,
    image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400",
    category: "Dessert",
    description: "Traditional milk tart"
  },
  {
    id: "7",
    name: "Koeksisters",
    price: 49.99,
    image: "https://images.unsplash.com/photo-1578985545067-53d6d7c50a4e?w=400",
    category: "Dessert",
    description: "Sweet, syrupy plaited doughnuts"
  },
  {
    id: "8",
    name: "Rooibos Tea",
    price: 29.99,
    image: "https://images.unsplash.com/photo-1561047029-3000c68339ca?w=400",
    category: "Drinks",
    description: "Traditional South African herbal tea"
  },
  {
    id: "9",
    name: "Savanna Dry",
    price: 39.99,
    image: "https://images.unsplash.com/photo-1514362545859-b0e562f62f7e?w=400",
    category: "Drinks",
    description: "South African cider"
  },
  {
    id: "10",
    name: "Amarula Cream",
    price: 59.99,
    image: "https://images.unsplash.com/photo-1470338745628-171a8e17658c?w=400",
    category: "Drinks",
    description: "Cream liqueur from marula fruit"
  },
];

export default function MenuScreen() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const categories = ['All', 'Main Course', 'Street Food', 'Traditional', 'Starter', 'Dessert', 'Drinks'];
  
  const filteredItems = selectedCategory === 'All' 
    ? menuItems 
    : menuItems.filter(item => item.category === selectedCategory);

  const handleBack = () => {
    router.back();
  };

  const handleAddToCart = (itemName: string) => {
    Alert.alert('Success!', `Added ${itemName} to cart`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Mzansi Meals Menu</Text>
      
      <View style={styles.categoriesContainer}>
        {categories.map(cat => (
          <TouchableOpacity
            key={cat}
            style={[
              styles.categoryButton,
              selectedCategory === cat && styles.categoryButtonActive
            ]}
            onPress={() => setSelectedCategory(cat)}
          >
            <Text style={[
              styles.categoryText,
              selectedCategory === cat && styles.categoryTextActive
            ]}>{cat}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      <FlatList
        data={filteredItems}
        renderItem={({item}) => (
          <View style={styles.itemCard}>
            <Image source={{ uri: item.image }} style={styles.itemImage} />
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemDescription}>{item.description}</Text>
              <Text style={styles.itemCategory}>{item.category}</Text>
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
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#2c3e50',
    textAlign: 'center',
  },
  categoriesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
    justifyContent: 'center',
  },
  categoryButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#eaeaea',
  },
  categoryButtonActive: {
    backgroundColor: '#e74c3c',
    borderColor: '#e74c3c',
  },
  categoryText: {
    color: '#7f8c8d',
    fontSize: 12,
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#fff',
    fontWeight: 'bold',
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
    marginBottom: 4,
  },
  itemDescription: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  itemCategory: {
    fontSize: 11,
    color: '#e74c3c',
    fontWeight: '500',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
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
