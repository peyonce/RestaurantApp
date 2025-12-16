import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { CartItem } from '../services/database';

interface OrderSummaryProps {
  items: CartItem[];
  total: number;
  deliveryFee: number;
  tipAmount: number;
  tipValue: number;
  orderTotal: number;
}

export const OrderSummary: React.FC<OrderSummaryProps> = ({
  items,
  total,
  deliveryFee,
  tipAmount,
  tipValue,
  orderTotal
}) => {
  const formatCurrency = (amount: number) => `R${amount.toFixed(2)}`;

  return (
    <View style={styles.summaryCard}>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Subtotal ({items.length} items)</Text>
        <Text style={styles.summaryValue}>{formatCurrency(total)}</Text>
      </View>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Delivery Fee</Text>
        <Text style={styles.summaryValue}>
          {deliveryFee === 0 ? 'FREE' : formatCurrency(deliveryFee)}
        </Text>
      </View>
      <View style={styles.summaryRow}>
        <Text style={styles.summaryLabel}>Tip ({tipAmount}%)</Text>
        <Text style={styles.summaryValue}>{formatCurrency(tipValue)}</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.totalRow}>
        <Text style={styles.totalLabel}>Total</Text>
        <Text style={styles.totalValue}>{formatCurrency(orderTotal)}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  summaryCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 10,
    padding: 20,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryLabel: { color: '#999', fontSize: 16 },
  summaryValue: { color: '#fff', fontSize: 16 },
  divider: { height: 1, backgroundColor: '#444', marginVertical: 15 },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  totalValue: { color: '#FFD700', fontSize: 24, fontWeight: 'bold' },
});