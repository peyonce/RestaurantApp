import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image 
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function OrdersScreen() {
  const orders = [
    {
      id: '1',
      restaurant: 'Le Gourmet Français',
      date: '2024-01-15',
      total: 89.97,
      status: 'Delivered',
      items: ['Truffle Burger', 'Craft Cocktail', 'Chocolate Lava Cake'],
    },
    {
      id: '2',
      restaurant: 'Sakura Sushi',
      date: '2024-01-10',
      total: 64.50,
      status: 'Delivered',
      items: ['Salmon Sushi Platter', 'Green Tea'],
    },
    {
      id: '3',
      restaurant: 'La Pasta Fresca',
      date: '2024-01-05',
      total: 42.99,
      status: 'Cancelled',
      items: ['Truffle Pasta'],
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return '#4CAF50';
      case 'Preparing': return '#FF9800';
      case 'Cancelled': return '#F44336';
      default: return '#999';
    }
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Orders</Text>
        <Text style={styles.subtitle}>Track your orders and history</Text>
      </View>

      {/* Order List */}
      <View style={styles.ordersContainer}>
        {orders.map((order) => (
          <TouchableOpacity 
            key={order.id} 
            style={styles.orderCard}
            onPress={() => router.push(`/order-details/${order.id}`)}
          >
            <View style={styles.orderHeader}>
              <View>
                <Text style={styles.restaurantName}>{order.restaurant}</Text>
                <Text style={styles.orderDate}>{order.date}</Text>
              </View>
              <View style={styles.orderTotalContainer}>
                <Text style={styles.orderTotal}>${order.total.toFixed(2)}</Text>
              </View>
            </View>

            <View style={styles.orderItems}>
              <FontAwesome name="shopping-bag" size={16} color="#999" />
              <Text style={styles.itemsText}>
                {order.items.join(', ')}
              </Text>
            </View>

            <View style={styles.orderFooter}>
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '20' }]}>
                <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                  {order.status}
                </Text>
              </View>
              <TouchableOpacity style={styles.reorderButton}>
                <FontAwesome name="repeat" size={14} color="#FFD700" />
                <Text style={styles.reorderText}>Reorder</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Empty State (if no orders) */}
      {orders.length === 0 && (
        <View style={styles.emptyState}>
          <FontAwesome name="shopping-bag" size={64} color="#444" />
          <Text style={styles.emptyTitle}>No orders yet</Text>
          <Text style={styles.emptyText}>
            Your order history will appear here after you place an order
          </Text>
          <TouchableOpacity 
            style={styles.browseButton}
            onPress={() => router.push('/(tabs)/home')}
          >
            <Text style={styles.browseButtonText}>Browse Menu</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Need help with an order?</Text>
        <TouchableOpacity>
          <Text style={styles.contactSupport}>Contact Support</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
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
    paddingBottom: 30,
    backgroundColor: '#2d2d2d',
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
  },
  ordersContainer: {
    padding: 20,
  },
  orderCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 20,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#444',
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  orderDate: {
    fontSize: 14,
    color: '#999',
  },
  orderTotalContainer: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#444',
  },
  orderTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFD700',
  },
  orderItems: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  itemsText: {
    flex: 1,
    fontSize: 14,
    color: '#999',
    marginLeft: 10,
    lineHeight: 20,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  reorderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
    gap: 6,
  },
  reorderText: {
    color: '#FFD700',
    fontSize: 12,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    padding: 40,
    marginTop: 20,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginTop: 20,
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 24,
  },
  browseButton: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 10,
  },
  browseButtonText: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    alignItems: 'center',
    padding: 30,
    borderTopWidth: 1,
    borderTopColor: '#444',
    marginTop: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#999',
    marginBottom: 10,
  },
  contactSupport: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
  },
});
