import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface PaymentMethodProps {
  method: 'cash' | 'card';
  onMethodChange: (method: 'cash' | 'card') => void;
  disabled?: boolean;
}

export const PaymentMethod: React.FC<PaymentMethodProps> = ({
  method,
  onMethodChange,
  disabled = false
}) => {
  const methods = [
    { id: 'cash', icon: 'money', title: 'Cash on Delivery', description: 'Pay when food arrives' },
    { id: 'card', icon: 'credit-card', title: 'Card Payment', description: 'Pay now with card' },
  ] as const;

  return (
    <>
      {methods.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={[styles.paymentCard, method === item.id && styles.paymentCardSelected]}
          onPress={() => onMethodChange(item.id as 'cash' | 'card')}
          activeOpacity={0.7}
          disabled={disabled}
        >
          <FontAwesome name={item.icon as any} size={24} color="#FFD700" />
          <View style={styles.paymentInfo}>
            <Text style={styles.paymentTitle}>{item.title}</Text>
            <Text style={styles.paymentDescription}>{item.description}</Text>
          </View>
          {method === item.id && (
            <FontAwesome name="check-circle" size={24} color="#4CAF50" />
          )}
        </TouchableOpacity>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  paymentCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2d2d2d',
    borderRadius: 10,
    padding: 18,
    marginBottom: 10,
  },
  paymentCardSelected: { borderWidth: 2, borderColor: '#FFD700' },
  paymentInfo: { flex: 1, marginLeft: 15 },
  paymentTitle: { color: '#fff', fontSize: 16, fontWeight: 'bold', marginBottom: 5 },
  paymentDescription: { color: '#999', fontSize: 14 },
});