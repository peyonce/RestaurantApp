import { ActivityIndicator, View, Text } from 'react-native';
import { Redirect } from 'expo-router';
import { useAuth } from './contexts/AuthProvider';

export default function Index() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a1a' }}>
        <ActivityIndicator size="large" color="#FFD700" />
        <Text style={{ color: '#FFFFFF', marginTop: 10 }}>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return <Redirect href="/welcome" />;
  }

  return <Redirect href="/(tabs)/home" />;
}
