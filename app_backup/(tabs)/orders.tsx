import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity,
  Image,
  ActivityIndicator
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function OrdersScreen() {
  const orders = [
    {
      id: '1',
      restaurant: 'Mzansi Meals',
      date: '2024-01-15',
      total: 189.97,
      status: 'Delivered',
      items: [
        { name: 'Boerewors Burger', quantity: 1, price: 89.99 },
        { name: 'Pap & Sheba', quantity: 1, price: 45.99 },
        { name: 'Rooibos Iced Tea', quantity: 2, price: 65.98 }
      ]
    },
    {
      id: '2',
      restaurant: 'Mzansi Meals',
      date: '2024-01-10',
      total: 125.99,
      status: 'Delivered',
      items: [
        { name: 'Bobotie Bowl', quantity: 1, price: 125.99 }
      ]
    },
    {
      id: '3',
      restaurant: 'Mzansi Meals',
      date: '2024-01-05',
      total: 265.97,
      status: 'Preparing',
      items: [
        { name: 'Braai Platter', quantity: 1, price: 189.99 },
        { name: 'Koeksisters', quantity: 2, price: 57.98 },
        { name: 'Chakalaka Salad', quantity: 1, price: 38.99 }
      ]
    },
    {
      id: '4',
      restaurant: 'Mzansi Meals',
      date: '2024-01-02',
      total: 85.99,
      status: 'Cancelled',
      items: [
        { name: 'Bunny Chow Burger', quantity: 1, price: 85.99 }
      ]
    }
  ];

  const formatCurrency = (amount: number) => {
    return `R${amount.toFixed(2)}`;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return '#4CAF50';
      case 'preparing': return '#FFA000';
      case 'on the way': return '#2196F3';
      case 'cancelled': return '#F44336';
      default: return '#999';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered': return 'check-circle';
      case 'preparing': return 'clock-o';
      case 'on the way': return 'motorcycle';
      case 'cancelled': return 'times-circle';
      default: return 'question-circle';
    }
  };

  const handleOrderPress = (orderId: string) => {
    router.push(`/order-details/${orderId}`);
  };

  const handleReorder = (order: any) => {
    // In a real app, this would re-add items to cart
    alert(`Reordering from ${order.restaurant} - ${formatCurrency(order.total)}`);
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mzansi Meals Orders</Text>
        <Text style={styles.headerSubtitle}>Your South African food journey</Text>
      </View>

      {orders.length === 0 ? (
        <View style={styles.emptyState}>
          <FontAwesome name="history" size={80} color="#666" />
          <Text style={styles.emptyTitle}>No orders yet</Text>
          <Text style={styles.emptyText}>
            Your Mzansi Meals orders will appear here. Time for some South African flavor!
          </Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => router.push('/menu')}
          >
            <Text style={styles.browseButtonText}>Order from Mzansi Meals</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.statsCard}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{orders.length}</Text>
              <Text style={styles.statLabel}>Total Orders</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {orders.filter(o => o.status === 'Delivered').length}
              </Text>
              <Text style={styles.statLabel}>Completed</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>
                {formatCurrency(orders.reduce((sum, order) => sum + order.total, 0))}
              </Text>
              <Text style={styles.statLabel}>Total Spent</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Recent Orders</Text>
          
          {orders.map((order) => (
            <TouchableOpacity
              key={order.id}
              style={styles.orderCard}
              onPress={() => handleOrderPress(order.id)}
              activeOpacity={0.7}
            >
              <View style={styles.orderHeader}>
                <View>
                  <Text style={styles.orderId}>Order #{order.id}</Text>
                  <Text style={styles.orderDate}>{order.date}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(order.status) + '20' }]}>
                  <FontAwesome 
                    name={getStatusIcon(order.status)} 
                    size={14} 
                    color={getStatusColor(order.status)} 
                    style={styles.statusIcon}
                  />
                  <Text style={[styles.statusText, { color: getStatusColor(order.status) }]}>
                    {order.status}
                  </Text>
                </View>
              </View>

              <View style={styles.orderItems}>
                {order.items.slice(0, 2).map((item, index) => (
                  <View key={index} style={styles.orderItem}>
                    <Text style={styles.itemName}>{item.name}</Text>
                    <Text style={styles.itemQuantity}>×{item.quantity}</Text>
                  </View>
                ))}
                {order.items.length > 2 && (
                  <Text style={styles.moreItems}>+{order.items.length - 2} more items</Text>
                )}
              </View>

              <View style={styles.orderFooter}>
                <Text style={styles.orderTotal}>{formatCurrency(order.total)}</Text>
                <TouchableOpacity
                  style={styles.reorderButton}
                  onPress={() => handleReorder(order)}
                >
                  <FontAwesome name="repeat" size={16} color="#FFD700" />
                  <Text style={styles.reorderText}>Reorder</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}

          <TouchableOpacity style={styles.viewAllButton}>
            <Text style={styles.viewAllText}>View All Orders</Text>
            <FontAwesome name="arrow-right" size={16} color="#FFD700" />
          </TouchableOpacity>

          <View style={styles.helpCard}>
            <FontAwesome name="question-circle" size={24} color="#FFD700" />
            <View style={styles.helpContent}>
              <Text style={styles.helpTitle}>Need help with an order?</Text>
              <Text style={styles.helpText}>
                Contact Mzansi Meals support at +27 11 123 4567
              </Text>
            </View>
          </View>
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    paddingTop: 70,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#2d2d2d',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: '#999',
    fontSize: 14,
    marginTop: 4,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 8,
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
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#2d2d2d',
    borderRadius: 16,
    padding: 20,
    marginTop: 20,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    color: '#FFD700',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    color: '#999',
    fontSize: 12,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#444',
    marginHorizontal: 10,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  orderCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  orderId: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orderDate: {
    color: '#999',
    fontSize: 14,
    marginTop: 4,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusIcon: {
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  orderItems: {
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  itemName: {
    color: '#fff',
    fontSize: 14,
    flex: 1,
  },
  itemQuantity: {
    color: '#999',
    fontSize: 14,
    marginLeft: 12,
  },
  moreItems: {
    color: '#FFD700',
    fontSize: 12,
    marginTop: 4,
  },
  orderFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#444',
    paddingTop: 16,
  },
  orderTotal: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
  },
  reorderButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFD700',
  },
  reorderText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '600',
    marginLeft: 8,
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2d2d2d',
    padding: 16,
    borderRadius: 12,
    marginBottom: 20,
  },
  viewAllText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  helpCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  helpContent: {
    flex: 1,
    marginLeft: 16,
  },
  helpTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  helpText: {
    color: '#999',
    fontSize: 14,
  },
});
