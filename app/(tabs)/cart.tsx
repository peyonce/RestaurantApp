 import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useCart } from '../contexts/CartProvider';

export default function CartScreen() {
  const { items, total, removeItem, clearCart, updateQuantity, loading } = useCart();
  const [removing, setRemoving] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const handleCheckout = () => {
    if (items.length === 0) {
      Alert.alert('Empty Cart', 'Add items to cart first');
      return;
    }
    router.push('/checkout');
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Cart',
      'Remove all items from cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear', 
          style: 'destructive',
          onPress: async () => {
            try {
              await clearCart();
            } catch (error) {
              Alert.alert('Error', 'Failed to clear cart');
            }
          }
        }
      ]
    );
  };

  const handleRemoveItem = async (itemId: string) => {
    setRemoving(itemId);
    try {
      await removeItem(itemId);
    } catch (error) {
      Alert.alert('Error', 'Failed to remove item');
    } finally {
      setRemoving(null);
    }
  };

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setUpdating(itemId);
    try {
      await updateQuantity(itemId, newQuantity);
    } catch (error) {
      Alert.alert('Error', 'Failed to update quantity');
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFD700" />
        <Text style={styles.loadingText}>Loading cart...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Cart</Text>
        {items.length > 0 && (
          <TouchableOpacity onPress={handleClearCart} style={styles.clearButton}>
            <FontAwesome name="trash" size={20} color="#FF4444" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {items.length === 0 ? (
          <View style={styles.emptyCart}>
            <FontAwesome name="shopping-cart" size={60} color="#666" />
            <Text style={styles.emptyText}>Your cart is empty</Text>
            <TouchableOpacity 
              style={styles.browseButton}
              onPress={() => router.push('/menu')}
            >
              <Text style={styles.browseText}>Browse Menu</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {items.map((item) => (
              <View key={item.id} style={styles.cartItem}>
                <View style={styles.itemInfo}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemPrice}>R{item.price.toFixed(2)} each</Text>
                  
                  {/* Quantity Selector */}
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity 
                      style={styles.quantityButton}
                      onPress={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      disabled={updating === item.id}
                    >
                      <Text style={styles.quantityButtonText}>-</Text>
                    </TouchableOpacity>
                    
                    <View style={styles.quantityDisplay}>
                      {updating === item.id ? (
                        <ActivityIndicator size="small" color="#FFD700" />
                      ) : (
                        <Text style={styles.quantityText}>{item.quantity}</Text>
                      )}
                    </View>
                    
                    <TouchableOpacity 
                      style={styles.quantityButton}
                      onPress={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                      disabled={updating === item.id}
                    >
                      <Text style={styles.quantityButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                
                <View style={styles.itemRight}>
                  <Text style={styles.itemTotal}>
                    R{(item.price * item.quantity).toFixed(2)}
                  </Text>
                  <TouchableOpacity 
                    onPress={() => handleRemoveItem(item.id)}
                    disabled={removing === item.id}
                    style={styles.removeButton}
                  >
                    {removing === item.id ? (
                      <ActivityIndicator size="small" color="#FF4444" />
                    ) : (
                      <FontAwesome name="times" size={18} color="#FF4444" />
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            ))}
            
            {/* Order Summary */}
            <View style={styles.summaryContainer}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>R{total.toFixed(2)}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery Fee</Text>
                <Text style={styles.summaryValue}>R{30.00.toFixed(2)}</Text>
              </View>
              <View style={[styles.summaryRow, styles.totalRow]}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalAmount}>R{(total + 30.00).toFixed(2)}</Text>
              </View>
            </View>
          </>
        )}
      </ScrollView>

      {items.length > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.checkoutButton}
            onPress={handleCheckout}
          >
            <Text style={styles.checkoutText}>Proceed to Checkout</Text>
            <Text style={styles.checkoutTotal}>R{(total + 30.00).toFixed(2)}</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.continueButton}
            onPress={() => router.push('/menu')}
          >
            <Text style={styles.continueText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#2d2d2d',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  clearButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  emptyCart: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyText: {
    color: '#fff',
    fontSize: 18,
    marginTop: 20,
    marginBottom: 30,
  },
  browseButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseText: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#2d2d2d',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  itemPrice: {
    color: '#999',
    fontSize: 14,
    marginTop: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#3d3d3d',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityDisplay: {
    width: 40,
    alignItems: 'center',
  },
  quantityText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  itemRight: {
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginLeft: 15,
  },
  itemTotal: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
  },
  removeButton: {
    padding: 8,
  },
  summaryContainer: {
    backgroundColor: '#2d2d2d',
    borderRadius: 10,
    padding: 20,
    marginTop: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryLabel: {
    color: '#ccc',
    fontSize: 16,
  },
  summaryValue: {
    color: '#fff',
    fontSize: 16,
  },
  totalRow: {
    marginTop: 10,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#444',
  },
  totalLabel: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  totalAmount: {
    color: '#FFD700',
    fontSize: 22,
    fontWeight: 'bold',
  },
  footer: {
    padding: 20,
    backgroundColor: '#2d2d2d',
    borderTopWidth: 1,
    borderTopColor: '#444',
  },
  checkoutButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFD700',
    paddingHorizontal: 25,
    paddingVertical: 18,
    borderRadius: 12,
    marginBottom: 10,
  },
  checkoutText: {
    color: '#1a1a1a',
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkoutTotal: {
    color: '#1a1a1a',
    fontSize: 20,
    fontWeight: 'bold',
  },
  continueButton: {
    backgroundColor: '#3d3d3d',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  continueText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});