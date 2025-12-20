import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';

export default function OrderDetailsScreen() {
  const { id } = useLocalSearchParams();

  // Mock order data - WITH MZANSI MEALS BRANDING
  const order = {
    id: id || '1',
    restaurant: 'Mzansi Meals',
    date: '2024-01-15',
    time: '19:30',
    total: 89.97,
    status: 'Delivered',
    deliveryAddress: '123 Vilakazi Street, Orlando West, Johannesburg, Gauteng 2000',
    paymentMethod: 'Standard Bank Card',
    items: [
      {
        id: '1',
        name: 'Bunny Chow',
        price: 28.99,
        quantity: 2,
        image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b',
      },
      {
        id: '2',
        name: 'Rooibos Tea',
        price: 16.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1591261730799-ee4e6c2d16d7',
      },
      {
        id: '3',
        name: 'Melktert',
        price: 12.99,
        quantity: 1,
        image: 'https://images.unsplash.com/photo-1563729785-e5f1fac3e7bf',
      },
    ],
    orderNumber: '#ORD-2024-0015',
    estimatedDelivery: '30-45 min',
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return '#4CAF50';
      case 'Preparing': return '#FF9800';
      case 'On the way': return '#2196F3';
      case 'Cancelled': return '#F44336';
      default: return '#999';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered': return 'check-circle';
      case 'Preparing': return 'clock-o';
      case 'On the way': return 'motorcycle';
      case 'Cancelled': return 'times-circle';
      default: return 'question-circle';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <FontAwesome name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
        <View style={styles.headerPlaceholder} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Order Status Banner */}
        <View style={[styles.statusBanner, { backgroundColor: getStatusColor(order.status) + '20' }]}>
          <FontAwesome name={getStatusIcon(order.status)} size={24} color={getStatusColor(order.status)} />
          <View style={styles.statusInfo}>
            <Text style={[styles.statusTitle, { color: getStatusColor(order.status) }]}>
              {order.status}
            </Text>
            <Text style={styles.statusSubtitle}>
              {order.status === 'Delivered' ? 'Delivered on ' + order.date : 'Estimated: ' + order.estimatedDelivery}
            </Text>
          </View>
        </View>

        {/* Order Info */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Order Number</Text>
            <Text style={styles.infoValue}>{order.orderNumber}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Order Date</Text>
            <Text style={styles.infoValue}>{order.date} at {order.time}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Restaurant</Text>
            <Text style={styles.infoValue}>{order.restaurant}</Text>
          </View>
        </View>

        {/* Order Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          {order.items.map((item) => (
            <View key={item.id} style={styles.itemCard}>
              <Image source={{ uri: item.image }} style={styles.itemImage} />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <View style={styles.itemDetails}>
                  <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
                  <Text style={styles.itemPrice}>R{item.price.toFixed(2)} each</Text>
                </View>
              </View>
              <Text style={styles.itemTotal}>
                R{(item.price * item.quantity).toFixed(2)}
              </Text>
            </View>
          ))}
        </View>

        {/* Delivery & Payment */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery & Payment</Text>
          <View style={styles.infoCard}>
            <FontAwesome name="map-marker" size={20} color="#FFD700" />
            <View style={styles.infoCardContent}>
              <Text style={styles.infoCardTitle}>Delivery Address</Text>
              <Text style={styles.infoCardText}>{order.deliveryAddress}</Text>
            </View>
          </View>
          <View style={styles.infoCard}>
            <FontAwesome name="credit-card" size={20} color="#FFD700" />
            <View style={styles.infoCardContent}>
              <Text style={styles.infoCardTitle}>Payment Method</Text>
              <Text style={styles.infoCardText}>{order.paymentMethod}</Text>
            </View>
          </View>
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Subtotal</Text>
            <Text style={styles.summaryValue}>
              R{(order.total - 5.99 - 2.99).toFixed(2)}
            </Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Delivery Fee</Text>
            <Text style={styles.summaryValue}>R5.99</Text>
          </View>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Service Fee</Text>
            <Text style={styles.summaryValue}>R2.99</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>R{order.total.toFixed(2)}</Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.reorderButton}>
            <FontAwesome name="repeat" size={20} color="#FFD700" />
            <Text style={styles.reorderButtonText}>Reorder</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.supportButton}>
            <FontAwesome name="headphones" size={20} color="#FFFFFF" />
            <Text style={styles.supportButtonText}>Get Help</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    margin: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#444',
  },
  statusInfo: {
    marginLeft: 15,
    flex: 1,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  statusSubtitle: {
    fontSize: 14,
    color: '#999',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 20,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  infoLabel: {
    fontSize: 14,
    color: '#999',
  },
  infoValue: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '500',
  },
  itemCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#444',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 15,
  },
  itemInfo: {
    flex: 1,
  },
  itemName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  itemDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemQuantity: {
    fontSize: 14,
    color: '#999',
    marginRight: 15,
  },
  itemPrice: {
    fontSize: 14,
    color: '#FFD700',
  },
  itemTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#444',
  },
  infoCardContent: {
    flex: 1,
    marginLeft: 15,
  },
  infoCardTitle: {
    fontSize: 14,
    color: '#999',
    marginBottom: 5,
  },
  infoCardText: {
    fontSize: 16,
    color: '#FFFFFF',
    lineHeight: 22,
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
  actions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 40,
    gap: 15,
  },
  reorderButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingVertical: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    gap: 10,
  },
  reorderButtonText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '600',
  },
  supportButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2d2d2d',
    paddingVertical: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#444',
    gap: 10,
  },
  supportButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
