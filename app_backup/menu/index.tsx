import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  TextInput,
  FlatList,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';

// Menu categories
const categories = ['All', 'Burgers', 'Drinks', 'Meat', 'Desserts'];

// Menu items - South African cuisine for Mzansi Meals
const menuItems = [
  {
    id: '1',
    name: 'Bunny Chow',
    price: 28.99,
    description: 'Hollowed-out bread loaf filled with curry',
    image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b',
    category: 'burgers',
  },
  {
    id: '2',
    name: 'Boerewors Roll',
    price: 22.99,
    description: 'Grilled boerewors sausage in a fresh roll',
    image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9',
    category: 'burgers',
  },
  {
    id: '3',
    name: 'Chakalaka Burger',
    price: 24.99,
    description: 'Burger with spicy South African relish',
    image: 'https://placehold.co/400x300/8B4513/FFFFFF?text=Chakalaka+Burger',
    category: 'burgers',
  },
  {
    id: '4',
    name: 'Rooibos Tea',
    price: 16.99,
    description: 'Traditional South African herbal tea',
    image: 'https://images.unsplash.com/photo-1591261730799-ee4e6c2d16d7',
    category: 'drinks',
  },
  {
    id: '5',
    name: 'Magoenyana (Sorghum Beer)',
    price: 8.99,
    description: 'Traditional sorghum-based African beer',
    image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b',
    category: 'drinks',
  },
  {
    id: '6',
    name: 'Umqombothi',
    price: 12.99,
    description: 'Traditional African maize beer',
    image: 'https://placehold.co/400x300/FFD700/000000?text=Umqombothi',
    category: 'drinks',
  },
  {
    id: '7',
    name: 'Braaied Steak',
    price: 32.99,
    description: 'Steak prepared on traditional braai',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d',
    category: 'meat',
  },
  {
    id: '8',
    name: 'Braaied Ribs',
    price: 26.99,
    description: 'Ribs prepared on traditional braai',
    image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba',
    category: 'meat',
  },
  {
    id: '9',
    name: 'Melktert',
    price: 14.99,
    description: 'South African milk tart dessert',
    image: 'https://images.unsplash.com/photo-1563729785-e5f1fac3e7bf',
    category: 'desserts',
  },
  {
    id: '10',
    name: 'Koeksister',
    price: 13.99,
    description: 'South African sweet, syrup-coated doughnut',
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad',
    category: 'desserts',
  },
];

export default function MenuScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const router = useRouter();

  const filteredItems = menuItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const renderMenuItem = ({ item }: { item: typeof menuItems[0] }) => (
    <Link href={`/menu/${item.id}`} asChild>
      <TouchableOpacity style={styles.menuItem}>
        <Image source={{ uri: item.image }} style={styles.itemImage} />
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemDescription} numberOfLines={2}>
            {item.description}
          </Text>
          <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
        </View>
        <FontAwesome name="chevron-right" size={16} color="#999" />
      </TouchableOpacity>
    </Link>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mzansi Meals Menu</Text>
        <Text style={styles.headerSubtitle}>Authentic South African Cuisine</Text>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search menu items..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <FontAwesome name="times-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {/* Categories */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoriesContainer}
      >
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            style={[
              styles.categoryButton,
              selectedCategory === category && styles.categoryButtonActive,
            ]}
            onPress={() => setSelectedCategory(category)}
          >
            <Text
              style={[
                styles.categoryText,
                selectedCategory === category && styles.categoryTextActive,
              ]}
            >
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Menu Items */}
      <FlatList
        data={filteredItems}
        renderItem={renderMenuItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.menuList}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <FontAwesome name="search" size={50} color="#444" />
            <Text style={styles.emptyText}>No items found</Text>
            <Text style={styles.emptySubtext}>Try a different search or category</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#2d2d2d',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#FFD700',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d2d2d',
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#444',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    height: 50,
    color: '#FFFFFF',
    fontSize: 16,
  },
  categoriesContainer: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  categoryButton: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#2d2d2d',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#444',
  },
  categoryButtonActive: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  categoryText: {
    color: '#999',
    fontWeight: '500',
  },
  categoryTextActive: {
    color: '#1a1a1a',
    fontWeight: 'bold',
  },
  menuList: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#444',
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
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  itemDescription: {
    fontSize: 14,
    color: '#999',
    marginBottom: 8,
    lineHeight: 18,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 20,
    color: '#FFFFFF',
    marginTop: 20,
    marginBottom: 10,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#999',
  },
});
