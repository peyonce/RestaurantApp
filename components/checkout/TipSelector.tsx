import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface TipSelectorProps {
  tipAmount: number;
  onTipChange: (tip: number) => void;
  disabled?: boolean;
}

export const TipSelector: React.FC<TipSelectorProps> = ({
  tipAmount,
  onTipChange,
  disabled = false
}) => {
  const tips = [0, 5, 10, 15, 20];

  return (
    <View style={styles.tipContainer}>
      {tips.map((tip) => (
        <TouchableOpacity
          key={tip}
          style={[styles.tipButton, tipAmount === tip && styles.tipButtonSelected]}
          onPress={() => onTipChange(tip)}
          activeOpacity={0.7}
          disabled={disabled}
        >
          <Text style={[styles.tipText, tipAmount === tip && styles.tipTextSelected]}>
            {tip === 0 ? 'No tip' : `${tip}%`}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tipContainer: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  tipButton: {
    backgroundColor: '#2d2d2d',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 80,
  },
  tipButtonSelected: { backgroundColor: '#FFD700' },
  tipText: { color: '#fff', fontSize: 16, textAlign: 'center', fontWeight: '500' },
  tipTextSelected: { color: '#1a1a1a', fontWeight: 'bold' },
});