import { Stack } from "expo-router";
import { AuthProvider } from "./contexts/AuthProvider";
import { CartProvider } from "./contexts/CartProvider";

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
