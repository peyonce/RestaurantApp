 import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useCart } from '../contexts/CartProvider';

// Define MenuItem type
interface MenuItem {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
}

// Define AddToCartButton props
interface AddToCartButtonProps {
  item: MenuItem;
}

// Add to Cart Button Component
const AddToCartButton: React.FC<AddToCartButtonProps> = ({ item }) => {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  const handlePress = () => {
    const cartItem = {
      menuItemId: item.id,  // Changed from 'id' to 'menuItemId'
      name: item.name,
      price: item.price,
      quantity: 1,  // Added quantity
      imageUrl: item.image  // Changed from 'image' to 'imageUrl'
    };
    
    addToCart(cartItem);
    setAdded(true);
    
    setTimeout(() => {
      setAdded(false);
    }, 1000);
  };

  return (
    <TouchableOpacity 
      onPress={handlePress} 
      style={[
        styles.addButton,
        added && styles.addedButton
      ]}
      disabled={added}
    >
      <Text style={styles.addButtonText}>
        {added ? '✅ Added!' : 'Add to Cart'}
      </Text>
    </TouchableOpacity>
  );
};

export default function MenuScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // All menu items
  const allItems: MenuItem[] = [
    { id: '1', name: 'Truffle Burger', price: 28.99, description: 'Premium beef burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400', category: 'burgers' },
    { id: '2', name: 'Cheeseburger', price: 22.99, description: 'Aged cheddar cheese burger', image: 'https://images.unsplash.com/photo-1572802419224-296b0aeee0d9?w=400', category: 'burgers' },
    { id: '3', name: 'BBQ Bacon Burger', price: 24.99, description: 'Beef burger with bacon', image: 'https://placehold.co/400x300/8B4513/FFFFFF?text=BBQ+Burger', category: 'burgers' },
    { id: '4', name: 'Craft Cocktail', price: 16.99, description: 'Signature cocktail drink', image: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=400', category: 'drinks' },
    { id: '5', name: 'Fresh Lemonade', price: 8.99, description: 'Homemade lemon drink', image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400', category: 'drinks' },
    { id: '6', name: 'Craft Beer', price: 12.99, description: 'Local craft beer drink', image: 'https://placehold.co/400x300/FFD700/000000?text=Craft+Beer', category: 'drinks' },
    { id: '7', name: 'Grilled Steak', price: 32.99, description: 'Prime steak meat', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=400', category: 'meat' },
    { id: '8', name: 'BBQ Ribs', price: 26.99, description: 'Slow-cooked pork ribs meat', image: 'https://images.unsplash.com/photo-1529692236671-f1f6cf9683ba?w=400', category: 'meat' },
    { id: '9', name: 'Chocolate Cake', price: 14.99, description: 'Warm chocolate dessert', image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', category: 'desserts' },
    { id: '10', name: 'New York Cheesecake', price: 13.99, description: 'Creamy cheesecake dessert', image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=400', category: 'desserts' },
  ];

  // Category type definition
  interface Category {
    id: string;
    name: string;
    items: MenuItem[];
  }

  // BETTER SEARCH FUNCTION
  const getFilteredItems = (): MenuItem[] => {
    let filtered = [...allItems];
    
    // 1. Filter by category
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(item => item.category === selectedCategory);
    }
    
    // 2. Filter by search query - IMPROVED
    if (searchQuery.trim() !== '') {
      const query = searchQuery.toLowerCase().trim();
      
      filtered = filtered.filter(item => {
        // Search in name
        if (item.name.toLowerCase().includes(query)) return true;
        
        // Search in description
        if (item.description.toLowerCase().includes(query)) return true;
        
        // Search in category name
        const categoryNames: Record<string, string> = {
          'burgers': 'burger',
          'drinks': 'drink',
          'meat': 'meat',
          'desserts': 'dessert'
        };
        const categoryKeyword = categoryNames[item.category];
        if (categoryKeyword && categoryKeyword.includes(query)) return true;
        
        // Search for synonyms
        const synonyms: Record<string, string[]> = {
          'drink': ['drinks', 'beverage', 'beverages', 'cocktail', 'beer', 'lemonade'],
          'burger': ['burgers', 'cheeseburger'],
          'cake': ['cakes', 'dessert', 'desserts'],
          'steak': ['steaks', 'meat'],
          'ribs': ['rib', 'meat']
        };
        
        // Check synonyms
        for (const [key, words] of Object.entries(synonyms)) {
          if (words.some(word => word.includes(query))) {
            if (item.name.toLowerCase().includes(key) || item.description.toLowerCase().includes(key)) {
              return true;
            }
          }
        }
        
        return false;
      });
    }
    
    return filtered;
  };

  // Group filtered items by category
  const getGroupedItems = (): Category[] => {
    const filtered = getFilteredItems();
    
    // Group by category
    const grouped: Record<string, Category> = {};
    filtered.forEach(item => {
      if (!grouped[item.category]) {
        grouped[item.category] = {
          id: item.category,
          name: getCategoryName(item.category),
          items: []
        };
      }
      grouped[item.category].items.push(item);
    });
    
    return Object.values(grouped);
  };

  // Helper to get category display name
  const getCategoryName = (categoryId: string): string => {
    const names: Record<string, string> = {
      'burgers': 'Burgers',
      'drinks': 'Drinks',
      'meat': 'Meat',
      'desserts': 'Desserts'
    };
    return names[categoryId] || categoryId;
  };

  const categories = [
    { id: 'all', name: 'All' },
    { id: 'burgers', name: 'Burgers' },
    { id: 'drinks', name: 'Drinks' },
    { id: 'meat', name: 'Meat' },
    { id: 'desserts', name: 'Desserts' },
  ];

  const groupedItems = getGroupedItems();

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Our Menu</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Search Box */}
      <View style={styles.searchBox}>
        <FontAwesome name="search" size={20} color="#999" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search food or drinks..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <FontAwesome name="times" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {/* Search Examples */}
      {searchQuery.length === 0 && (
        <View style={styles.searchExamples}>
          <Text style={styles.examplesTitle}>Try searching:</Text>
          <View style={styles.exampleTags}>
            <TouchableOpacity onPress={() => setSearchQuery('burger')}>
              <Text style={styles.exampleTag}>burger</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSearchQuery('drink')}>
              <Text style={styles.exampleTag}>drink</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSearchQuery('cake')}>
              <Text style={styles.exampleTag}>cake</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setSearchQuery('steak')}>
              <Text style={styles.exampleTag}>steak</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Category Tabs */}
      <ScrollView horizontal style={styles.tabContainer} showsHorizontalScrollIndicator={false}>
        {categories.map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[styles.tab, selectedCategory === cat.id && styles.activeTab]}
            onPress={() => setSelectedCategory(cat.id)}
          >
            <Text style={[styles.tabText, selectedCategory === cat.id && styles.activeTabText]}>
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Menu Items */}
      <View style={styles.menuContainer}>
        {groupedItems.length === 0 ? (
          <View style={styles.emptyContainer}>
            <FontAwesome name="search" size={50} color="#666" />
            <Text style={styles.emptyText}>No items found</Text>
            <Text style={styles.emptySubText}>
              {searchQuery ? `No results for "${searchQuery}"` : 'Try a different category'}
            </Text>
            <Text style={styles.emptyHint}>Try: burger, drink, cake, steak, ribs</Text>
          </View>
        ) : (
          groupedItems.map((category) => (
            <View key={category.id} style={styles.categorySection}>
              <Text style={styles.categoryTitle}>{category.name}</Text>
              
              {category.items.map((item) => (
                <View key={item.id} style={styles.menuItem}>
                  {/* Item Row */}
                  <TouchableOpacity
                    onPress={() => router.push(`/menu/${item.id}`)}
                    style={styles.itemRow}
                  >
                    <Image source={{ uri: item.image }} style={styles.itemImage} />
                    <View style={styles.itemInfo}>
                      <Text style={styles.itemName}>{item.name}</Text>
                      <Text style={styles.itemDesc}>{item.description}</Text>
                      <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
                    </View>
                    <FontAwesome name="chevron-right" size={16} color="#999" />
                  </TouchableOpacity>
                  
                  {/* Add to Cart Button */}
                  <AddToCartButton item={item} />
                </View>
              ))}
            </View>
          ))
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#1a1a1a' 
  },
  header: { 
    paddingTop: 50, 
    padding: 20, 
    backgroundColor: '#2d2d2d',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  title: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#FFFFFF' 
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d2d2d',
    margin: 20,
    marginBottom: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#444'
  },
  searchInput: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
    marginLeft: 10,
    marginRight: 10
  },
  searchExamples: {
    marginHorizontal: 20,
    marginBottom: 15
  },
  examplesTitle: {
    color: '#999',
    fontSize: 14,
    marginBottom: 8
  },
  exampleTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8
  },
  exampleTag: {
    backgroundColor: '#2d2d2d',
    color: '#FFD700',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    fontSize: 14
  },
  tabContainer: {
    paddingLeft: 20,
    marginBottom: 20
  },
  tab: {
    backgroundColor: '#2d2d2d',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#444'
  },
  activeTab: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700'
  },
  tabText: {
    color: '#FFFFFF',
    fontWeight: '500'
  },
  activeTabText: {
    color: '#000000',
    fontWeight: 'bold'
  },
  menuContainer: {
    padding: 20,
    minHeight: 400
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 50
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
    marginBottom: 10
  },
  emptySubText: {
    fontSize: 16,
    color: '#999',
    marginBottom: 10
  },
  emptyHint: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic'
  },
  categorySection: {
    marginBottom: 30
  },
  categoryTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 15
  },
  menuItem: {
    backgroundColor: '#2d2d2d',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 15
  },
  itemInfo: {
    flex: 1
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF'
  },
  itemDesc: {
    fontSize: 14,
    color: '#999',
    marginVertical: 5
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700'
  },
  addButton: {
    backgroundColor: '#FFD700',
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center'
  },
  addedButton: {
    backgroundColor: '#4CAF50',
  },
  addButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold' as const,
  }
});