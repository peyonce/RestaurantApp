import { FontAwesome } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, TextInput, View } from 'react-native';

interface DeliveryFormProps {
  formData: {
    address: string;
    phone: string;
    specialInstructions: string;
  };
  updateForm: (field: string, value: string) => void;
  disabled?: boolean;
}

export const DeliveryForm: React.FC<DeliveryFormProps> = ({ formData, updateForm, disabled }) => {
  const fields = [
    { 
      key: 'address', icon: 'map-marker', placeholder: 'Delivery Address *',
      multiline: true, lines: 3 
    },
    { 
      key: 'phone', icon: 'phone', placeholder: 'Phone Number *',
      keyboardType: 'phone-pad' 
    },
    { 
      key: 'specialInstructions', icon: 'sticky-note', 
      placeholder: 'Special Instructions (optional)', multiline: true, lines: 2 
    },
  ];

  return (
    <>
      {fields.map((field) => (
        <View key={field.key} style={styles.inputContainer}>
          <FontAwesome name={field.icon as any} size={20} color="#FFD700" style={styles.inputIcon} />
          <TextInput
            style={styles.input}
            placeholder={field.placeholder}
            placeholderTextColor="#999"
            value={formData[field.key as keyof typeof formData]}
            onChangeText={(text) => updateForm(field.key, text)}
            multiline={field.multiline}
            numberOfLines={field.lines}
            keyboardType={field.keyboardType as any}
            editable={!disabled}
          />
        </View>
      ))}
    </>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#2d2d2d',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  inputIcon: { marginTop: 12, marginRight: 10 },
  input: { flex: 1, color: '#fff', fontSize: 16, minHeight: 40 },
});