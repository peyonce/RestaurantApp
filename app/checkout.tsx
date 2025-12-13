import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function CheckoutScreen() {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [deliveryAddress, setDeliveryAddress] = useState('123 Main Street, New York, NY 10001');
  const [tipAmount, setTipAmount] = useState(5);

  const orderSummary = {
    subtotal: 89.97,
    deliveryFee: 5.99,
    serviceFee: 2.99,
    tip: tipAmount,
    total: 89.97 + 5.99 + 2.99 + tipAmount,
  };

  const handlePlaceOrder = () => {
    Alert.alert(
      'Confirm Order',
      `Total: $${orderSummary.total.toFixed(2)}\n\nProceed with payment?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Place Order',
          style: 'default',
          onPress: () => {
            Alert.alert('Success!', 'Your order has been placed successfully.');
            router.replace('/order-details/1');
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Delivery Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          <View style={styles.addressCard}>
            <FontAwesome name="map-marker" size={20} color="#FFD700" />
            <TextInput
              style={styles.addressInput}
              value={deliveryAddress}
              onChangeText={setDeliveryAddress}
              placeholder="Enter delivery address"
              placeholderTextColor="#999"
              multiline
            />
          </View>
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          <TouchableOpacity
            style={[
              styles.paymentCard,
              paymentMethod === 'card' && styles.paymentCardSelected,
            ]}
            onPress={() => setPaymentMethod('card')}
          >
            <FontAwesome name="credit-card" size={24} color="#FFD700" />
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentTitle}>Credit/Debit Card</Text>
              <Text style={styles.paymentDescription}>Pay with your card</Text>
            </View>
            {paymentMethod === 'card' && (
              <FontAwesome name="check-circle" size={24} color="#4CAF50" />
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.paymentCard,
              paymentMethod === 'cash' && styles.paymentCardSelected,
            ]}
            onPress={() => setPaymentMethod('cash')}
          >
            <FontAwesome name="money" size={24} color="#FFD700" />
            <View style={styles.paymentInfo}>
              <Text style={styles.paymentTitle}>Cash on Delivery</Text>
              <Text style={styles.paymentDescription}>Pay when you receive</Text>
            </View>
            {paymentMethod === 'cash' && (
              <FontAwesome name="check-circle" size={24} color="#4CAF50" />
            )}
          </TouchableOpacity>
        </View>

        {/* Tip Selection */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add a Tip</Text>
          <View style={styles.tipContainer}>
            {[0, 5, 10, 15, 20].map((tip) => (
              <TouchableOpacity
                key={tip}
                style={[
                  styles.tipButton,
                  tipAmount === tip && styles.tipButtonSelected,
                ]}
                onPress={() => setTipAmount(tip)}
              >
                <Text
                  style={[
                    styles.tipText,
                    tipAmount === tip && styles.tipTextSelected,
                  ]}
                >
                  {tip === 0 ? 'No tip' : `${tip}%`}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>
                ${orderSummary.subtotal.toFixed(2)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>
                ${orderSummary.deliveryFee.toFixed(2)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Service Fee</Text>
              <Text style={styles.summaryValue}>
                ${orderSummary.serviceFee.toFixed(2)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tip</Text>
              <Text style={styles.summaryValue}>
                ${orderSummary.tip.toFixed(2)}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                ${orderSummary.total.toFixed(2)}
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Place Order Button */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.placeOrderButton} onPress={handlePlaceOrder}>
          <Text style={styles.placeOrderText}>Place Order</Text>
          <Text style={styles.orderTotal}>${orderSummary.total.toFixed(2)}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#2d2d2d',
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  backButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  headerPlaceholder: {
    width: 34,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 15,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 15,
    borderWidth: 1,
    borderColor: '#444',
  },
  addressInput: {
    flex: 1,
    marginLeft: 15,
    color: '#FFFFFF',
    fontSize: 16,
    lineHeight: 22,
  },
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 20,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#444',
  },
  paymentCardSelected: {
    borderColor: '#FFD700',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
  },
  paymentInfo: {
    flex: 1,
    marginLeft: 15,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  paymentDescription: {
    fontSize: 14,
    color: '#999',
  },
  tipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  tipButton: {
    backgroundColor: '#2d2d2d',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#444',
    minWidth: 80,
  },
  tipButtonSelected: {
    backgroundColor: '#FFD700',
    borderColor: '#FFD700',
  },
  tipText: {
    fontSize: 16,
    color: '#FFFFFF',
    textAlign: 'center',
    fontWeight: '500',
  },
  tipTextSelected: {
    color: '#1a1a1a',
    fontWeight: 'bold',
  },
  summaryCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: '#444',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#999',
  },
  summaryValue: {
    fontSize: 16,
    color: '#FFFFFF',
  },
  divider: {
    height: 1,
    backgroundColor: '#444',
    marginVertical: 15,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  totalValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  footer: {
    padding: 20,
    backgroundColor: '#2d2d2d',
    borderTopWidth: 1,
    borderTopColor: '#444',
  },
  placeOrderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFD700',
    paddingHorizontal: 25,
    paddingVertical: 18,
    borderRadius: 12,
  },
  placeOrderText: {
    color: '#1a1a1a',
    fontSize: 18,
    fontWeight: 'bold',
  },
  orderTotal: {
    color: '#1a1a1a',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
