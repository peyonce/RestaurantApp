import { Stack } from "expo-router";

export default function RootStack() {
  return (
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
  );
}
