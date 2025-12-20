import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter } from 'expo-router';

export default function MenuTab() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Menu Tab</Text>
      
      <TouchableOpacity 
        style={styles.button}
        onPress={() => {
          console.log('Opening menu...');
          router.push('/menu');
        }}
        activeOpacity={0.3}
      >
        <Text style={styles.buttonText}>Open Menu</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.button, {backgroundColor: 'green'}]}
        onPress={() => Alert.alert('Test', 'Tab button works!')}
        activeOpacity={0.3}
      >
        <Text style={styles.buttonText}>Test Alert</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#FFD700',
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 10,
    marginBottom: 20,
    width: '80%',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  buttonText: {
    color: '#000',
    fontSize: 20,
    fontWeight: 'bold',
  },
});
