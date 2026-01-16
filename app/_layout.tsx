  // app/_layout.tsx - ENHANCED FIX
// ============== EARLIER EXECUTION ==============
if (typeof window !== 'undefined' && window.CSSStyleDeclaration) {
  // Execute immediately when script loads
  (function() {
    try {
      const descriptor = Object.getOwnPropertyDescriptor(window.CSSStyleDeclaration.prototype, 'setProperty');
      if (!descriptor || descriptor.configurable) {
        const original = window.CSSStyleDeclaration.prototype.setProperty;
        window.CSSStyleDeclaration.prototype.setProperty = function(property, value, priority) {
          if (property && property.startsWith('--')) {
            return original.call(this, property, value, priority);
          }
          // Silently skip non-custom properties
          return '';
        };
      }
    } catch (e) {
      // Ignore errors in patching
    }
  })();
}
// ================================================

import { AuthProvider } from "@contexts/AuthProvider";
import { CartProvider } from "@contexts/CartProvider";
import { Stack } from "expo-router";
import 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <AuthProvider>
      <CartProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="welcome" />
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
          <Stack.Screen name="modal" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="menu/index" />
          <Stack.Screen name="menu/[id]" />
          <Stack.Screen name="order-details/[id]" />
          <Stack.Screen name="checkout" />
          <Stack.Screen name="payment" />
        </Stack>
      </CartProvider>
    </AuthProvider>
  );
}









 