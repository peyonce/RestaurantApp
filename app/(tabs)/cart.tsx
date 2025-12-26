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
import { useCart } from '../../contexts/CartProvider';

export default function CartScreen() {
  const { items, total, removeItem, clearCart, updateQuantity, loading } = useCart();
  const [removing, setRemoving] = useState<string | null>(null);
  const [updating, setUpdating] = useState<string | null>(null);

  const handleCheckout = () => {
    if (items.length === 0) {
      Alert.alert('Cart Empty', 'Add some Mzansi dishes to your cart first!');
      return;
    }
    router.push('/checkout');
  };

  const handleClearCart = () => {
    Alert.alert(
      'Clear Mzansi Cart',
      'Are you sure you want to remove all items from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: () => clearCart(),
        },
      ]
    );
  };

  const handleRemoveItem = (itemId: string) => {
    setRemoving(itemId);
    removeItem(itemId);
    setTimeout(() => setRemoving(null), 500);
  };

  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity < 1) {
      handleRemoveItem(itemId);
      return;
    }
    setUpdating(itemId);
    updateQuantity(itemId, newQuantity);
    setTimeout(() => setUpdating(null), 300);
  };

  const formatCurrency = (amount: number) => {
    return `R${amount.toFixed(2)}`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FFD700" />
        <Text style={styles.loadingText}>Loading your Mzansi cart...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mzansi Meals Cart</Text>
        <TouchableOpacity onPress={handleClearCart} disabled={items.length === 0}>
          <Text style={[styles.clearButton, items.length === 0 && styles.clearButtonDisabled]}>
            Clear
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Cart Items */}
        {items.length === 0 ? (
          <View style={styles.emptyCart}>
            <FontAwesome name="shopping-cart" size={80} color="#666" />
            <Text style={styles.emptyTitle}>Your Mzansi cart is empty</Text>
            <Text style={styles.emptyText}>
              Explore our delicious South African dishes and add them to your cart!
            </Text>
            <TouchableOpacity
              style={styles.browseButton}
              onPress={() => router.push('/menu')}
            >
              <Text style={styles.browseButtonText}>Browse Mzansi Menu</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <View style={styles.cartItems}>
              {items.map((item) => (
                <View key={item.id} style={styles.cartItem}>
                  <View style={styles.itemInfo}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemPrice}>{formatCurrency(item.price)} each</Text>
                  </View>
                  
                  <View style={styles.quantityContainer}>
                    <TouchableOpacity
                      style={styles.quantityButton}
                      onPress={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                      disabled={updating === item.id}
                    >
                      <FontAwesome name="minus" size={16} color="#FFD700" />
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
                      <FontAwesome name="plus" size={16} color="#FFD700" />
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.itemTotalContainer}>
                    <Text style={styles.itemTotal}>
                      {formatCurrency(item.price * item.quantity)}
                    </Text>
                    <TouchableOpacity
                      style={styles.removeButton}
                      onPress={() => handleRemoveItem(item.id)}
                      disabled={removing === item.id}
                    >
                      {removing === item.id ? (
                        <ActivityIndicator size="small" color="#FF6B6B" />
                      ) : (
                        <FontAwesome name="trash" size={18} color="#FF6B6B" />
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>

            {/* Order Summary */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Order Summary</Text>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>{formatCurrency(total)}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Delivery Fee</Text>
                <Text style={styles.summaryValue}>
                  {total > 200 ? 'FREE' : formatCurrency(25)}
                </Text>
              </View>
              
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Estimated Total</Text>
                <Text style={styles.summaryTotal}>
                  {formatCurrency(total > 200 ? total : total + 25)}
                </Text>
              </View>
              
              <Text style={styles.deliveryNote}>
                {total > 200 
                  ? '🎉 You qualify for FREE delivery!'
                  : `Add R${(200 - total).toFixed(2)} more for FREE delivery`
                }
              </Text>
            </View>

            {/* Special Offer */}
            {total < 200 && (
              <View style={styles.offerCard}>
                <FontAwesome name="gift" size={24} color="#FFD700" />
                <View style={styles.offerContent}>
                  <Text style={styles.offerTitle}>Free Delivery Offer!</Text>
                  <Text style={styles.offerText}>
                    Order R{Math.max(0, 200 - total).toFixed(2)} more to get FREE delivery
                  </Text>
                </View>
              </View>
            )}
          </>
        )}

        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* Checkout Button */}
      {items.length > 0 && (
        <View style={styles.footer}>
          <TouchableOpacity 
            style={styles.checkoutButton}
            onPress={handleCheckout}
          >
            <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
            <View style={styles.checkoutTotal}>
              <Text style={styles.checkoutTotalText}>
                {formatCurrency(total > 200 ? total : total + 25)}
              </Text>
              <FontAwesome name="arrow-right" size={18} color="#1a1a1a" />
            </View>
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
    fontSize: 16,
    marginTop: 10,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#2d2d2d',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  clearButton: {
    color: '#FF6B6B',
    fontSize: 16,
    fontWeight: '600',
    padding: 8,
  },
  clearButtonDisabled: {
    color: '#666',
    opacity: 0.5,
  },
  scrollContent: {
    paddingBottom: 140,
  },
  emptyCart: {
    alignItems: 'center',
    padding: 60,
    paddingTop: 100,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 12,
  },
  emptyText: {
    color: '#999',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  browseButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 12,
  },
  browseButtonText: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cartItems: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d2d2d',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  itemPrice: {
    color: '#999',
    fontSize: 14,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  quantityButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: '#FFD700',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityDisplay: {
    minWidth: 40,
    alignItems: 'center',
  },
  quantityText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemTotalContainer: {
    alignItems: 'flex-end',
  },
  itemTotal: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  removeButton: {
    padding: 6,
  },
  summaryCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 20,
    marginTop: 24,
  },
  summaryTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  summaryLabel: {
    color: '#999',
    fontSize: 16,
  },
  summaryValue: {
    color: '#fff',
    fontSize: 16,
  },
  summaryTotal: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: 'bold',
  },
  deliveryNote: {
    color: '#FFD700',
    fontSize: 14,
    marginTop: 16,
    textAlign: 'center',
    fontWeight: '500',
  },
  offerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginTop: 16,
    borderWidth: 2,
    borderColor: '#FFD700',
  },
  offerContent: {
    flex: 1,
    marginLeft: 16,
  },
  offerTitle: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  offerText: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.8,
  },
  bottomSpacer: {
    height: 20,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: '#2d2d2d',
    borderTopWidth: 1,
    borderTopColor: '#444',
  },
  checkoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFD700',
    paddingHorizontal: 25,
    paddingVertical: 18,
    borderRadius: 12,
  },
  checkoutButtonText: {
    color: '#1a1a1a',
    fontSize: 18,
    fontWeight: 'bold',
  },
  checkoutTotal: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  checkoutTotalText: {
    color: '#1a1a1a',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
