import { FontAwesome } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import React, { useEffect, useState, useRef } from 'react'; // Added useRef
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '../../contexts/AuthProvider';

export default function RegisterScreen() {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const { signUp: register, loading: isLoading, user } = useAuth();
  const [showSuccess, setShowSuccess] = useState(false);
  const [hasRedirected, setHasRedirected] = useState(false); // NEW: Track redirects
  const redirectTimeoutRef = useRef<NodeJS.Timeout | null>(null); // NEW: Track timeout
  const router = useRouter();

  console.log('DEBUG - isLoading:', isLoading);
  console.log('DEBUG - showSuccess:', showSuccess);
  console.log('DEBUG - formData:', formData);
  console.log('DEBUG - All fields filled:', 
    formData.name && formData.surname && formData.email && 
    formData.password && formData.confirmPassword
  );

  // FIXED: Check if user is logged in and redirect (with protection)
  useEffect(() => {
    // Only redirect if user exists AND we haven't redirected already
    if (user && !hasRedirected) {
      console.log('DEBUG - User detected, will redirect...');
      setHasRedirected(true);
      
      // Clear any existing timeout
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
      
      // Set a new timeout for redirect
      redirectTimeoutRef.current = setTimeout(() => {
        console.log('DEBUG - Redirecting to home...');
        router.replace('/(tabs)');
      }, 1000);
    }
    
    // Cleanup function
    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, [user, hasRedirected, router]);

  const handleSignup = async () => {
    console.log('DEBUG - handleSignup called');
    
    const { name, surname, email, password, confirmPassword } = formData;

    // Validation
    if (!name || !surname || !email || !password || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    console.log('DEBUG - Calling register function...');
    const result = await register({ 
      email,
      password,
      name,
      surname,
      phone: '',
      address: ''
    });

    console.log('DEBUG - Register result:', result);

    if (result.success) {
      // Show success tick
      setShowSuccess(true);
      
      // Show success message but don't auto-redirect here
      // The useEffect will handle the redirect when user state updates
      Alert.alert('Success', result.message || 'Account created successfully!', [
        { text: 'OK' }
      ]);
      
      // DON'T set a redirect timeout here - let the useEffect handle it
    } else {
      Alert.alert('Signup Failed', result.message || 'Failed to create account');
    }
  };

  // Calculate if button should be disabled
  const isFormValid = () => {
    const { name, surname, email, password, confirmPassword } = formData;
    return name && surname && email && password && confirmPassword && 
           password === confirmPassword && 
           password.length >= 6;
  };

  // Show loading/redirecting screen
  if (hasRedirected && user) {
    return (
      <View style={styles.loadingScreen}>
        <ActivityIndicator size="large" color="#FFD700" />
        <Text style={styles.loadingText}>Welcome to Mzansi! Redirecting...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <FontAwesome name="user-plus" size={80} color="#FFD700" />
          <Text style={styles.title}>Create Your Mzansi Meals Account</Text>
          <Text style={styles.subtitle}>Create Your Mzansi Meals Account today</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.row}>
            <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
              <FontAwesome name="user" size={20} color="#FFD700" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="First Name"
                placeholderTextColor="#999"
                value={formData.name}
                onChangeText={(text) => setFormData({...formData, name: text})}
                editable={!isLoading && !showSuccess}
              />
            </View>

            <View style={[styles.inputContainer, { flex: 1 }]}>
              <TextInput
                style={styles.input}
                placeholder="Last Name"
                placeholderTextColor="#999"
                value={formData.surname}
                onChangeText={(text) => setFormData({...formData, surname: text})}
                editable={!isLoading && !showSuccess}
              />
            </View>
          </View>

          <View style={styles.inputContainer}>
            <FontAwesome name="envelope" size={20} color="#FFD700" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              value={formData.email}
              onChangeText={(text) => setFormData({...formData, email: text})}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!isLoading && !showSuccess}
            />
          </View>

          <View style={styles.inputContainer}>
            <FontAwesome name="lock" size={20} color="#FFD700" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password (min. 6 characters)"
              placeholderTextColor="#999"
              value={formData.password}
              onChangeText={(text) => setFormData({...formData, password: text})}
              secureTextEntry
              editable={!isLoading && !showSuccess}
            />
          </View>

          <View style={styles.inputContainer}>
            <FontAwesome name="lock" size={20} color="#FFD700" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Confirm Password"
              placeholderTextColor="#999"
              value={formData.confirmPassword}
              onChangeText={(text) => setFormData({...formData, confirmPassword: text})}
              secureTextEntry
              editable={!isLoading && !showSuccess}
            />
          </View>

          <TouchableOpacity 
            style={[
              styles.signupButton, 
              (!isFormValid() || isLoading || showSuccess || hasRedirected) && styles.disabledButton
            ]} 
            onPress={handleSignup}
            disabled={!isFormValid() || isLoading || showSuccess || hasRedirected}
          >
            {isLoading ? (
              <ActivityIndicator color="#1a1a1a" />
            ) : showSuccess ? (
              <>
                <FontAwesome name="check" size={20} color="#1a1a1a" />
                <Text style={styles.signupButtonText}>Account Created!</Text>
              </>
            ) : (
              <Text style={styles.signupButtonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginLinkContainer}>
            <Text style={styles.loginLinkText}>Already have an account? </Text>
            <Link href="/login" asChild>
              <TouchableOpacity>
                <Text style={styles.loginLink}>Sign In</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFD700',
    textAlign: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#ccc',
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  row: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2a2a2a',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#444',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    paddingVertical: 15,
  },
  signupButton: {
    backgroundColor: '#FFD700',
    borderRadius: 10,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 25,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  disabledButton: {
    backgroundColor: '#666',
    opacity: 0.7,
  },
  signupButtonText: {
    color: '#1a1a1a',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  loginLinkContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginLinkText: {
    color: '#ccc',
    fontSize: 16,
  },
  loginLink: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  loadingText: {
    color: '#FFD700',
    fontSize: 18,
    marginTop: 20,
    fontWeight: '600',
  },
});
