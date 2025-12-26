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
  const [testLog, setTestLog] = useState('No clicks yet');

   
  const handleBack = () => {
    console.log('BACK button CLICKED at:', new Date().toISOString());
    setTestLog('Back button clicked at ' + new Date().toLocaleTimeString());
    setTimeout(() => {
      router.back();
    }, 100);
  };

  const handleAddToCart = (itemName: string) => {
    console.log(' ADD TO CART clicked for:', itemName, 'at', new Date().toISOString());
    setTestLog(`Added ${itemName} at ` + new Date().toLocaleTimeString());
    Alert.alert('Success!', `Added ${itemName} to cart`);
  };

  const handleTestDirect = () => {
    console.log('DIRECT TEST button clicked at:', new Date().toISOString());
    setTestLog('Test button clicked at ' + new Date().toLocaleTimeString());
    Alert.alert('Direct Test', 'This button works directly!');
  };

  console.log(' MenuScreen rendered at:', new Date().toISOString());

  return (
    <View style={styles.container}>
      
      <View style={styles.testPanel}>
        <Text style={styles.testTitle}>TOUCH TEST PANEL</Text>
        <Text style={styles.testLog}>Last action: {testLog}</Text>
        
        <TouchableOpacity 
          style={[styles.testButton, {backgroundColor: '#FF0000'}]}
          onPress={handleTestDirect}
          activeOpacity={0.3}
          hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
        >
          <Text style={styles.testButtonText}>🔴 TEST DIRECT</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.testButton, {backgroundColor: '#00FF00'}]}
          onPress={handleBack}
          activeOpacity={0.3}
          hitSlop={{top: 20, bottom: 20, left: 20, right: 20}}
        >
          <Text style={styles.testButtonText}>🟢 GO BACK</Text>
        </TouchableOpacity>
      </View>

       
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
              activeOpacity={0.3}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
            >
              <Text style={styles.cartButtonText}>ADD</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />

      <View style={styles.debugInfo}>
        <Text style={styles.debugText}>Debug Info:</Text>
        <Text style={styles.debugText}>• React Native TouchableOpacity</Text>
        <Text style={styles.debugText}>• Direct event handlers</Text>
        <Text style={styles.debugText}>• No external dependencies</Text>
        <Text style={styles.debugText}>• Check browser console (F12)</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    paddingTop: 40,
  },
  testPanel: {
    backgroundColor: '#2a2a2a',
    padding: 20,
    margin: 20,
    borderRadius: 10,
    borderWidth: 3,
    borderColor: '#FFD700',
  },
  testTitle: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  testLog: {
    color: '#fff',
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'center',
    backgroundColor: '#333',
    padding: 10,
    borderRadius: 5,
  },
  testButton: {
    padding: 20,
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  testButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  sectionTitle: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: 'bold',
    marginLeft: 20,
    marginBottom: 15,
  },
  list: {
    paddingHorizontal: 20,
  },
  itemCard: {
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    marginBottom: 15,
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#444',
  },
  itemImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 15,
    marginRight: 15,
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  itemPrice: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  cartButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#fff',
  },
  cartButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  debugInfo: {
    backgroundColor: '#333',
    padding: 15,
    margin: 20,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#666',
  },
  debugText: {
    color: '#ccc',
    fontSize: 14,
    marginBottom: 5,
  },
});
