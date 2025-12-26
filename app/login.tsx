 import { FontAwesome } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import React, { useEffect, useState } from 'react';
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
import { useAuth } from '../contexts/AuthProvider';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [hasRedirected, setHasRedirected] = useState(false);

  const { signIn, user } = useAuth();

  useEffect(() => {
    if (user && !hasRedirected) {
      setHasRedirected(true);
      console.log('User already logged in, redirecting...');
      const timer = setTimeout(() => {
        router.replace('/(tabs)/home');
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [user, hasRedirected]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      console.log('Attempting login for:', email);
      
      const result = await signIn(email, password);
      
      console.log('Login result:', result);
      
      if (result && result.success) {
        Alert.alert('Success', 'Logged in successfully!', [
          { 
            text: 'OK', 
            onPress: () => {
              setTimeout(() => {
                if (user) {
                  router.replace('/(tabs)/home');
                }
              }, 1000);
            }
          }
        ]);
      } else {
        Alert.alert('Login Failed', result?.message || 'Invalid email or password');
      }
    } catch (error: any) {
      console.error('Login error:', error);
      Alert.alert('Login Failed', error.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGuestLogin = () => {
    console.log('Guest login clicked');
    router.replace('/(tabs)/home');
  };

  if (hasRedirected && user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e74c3c" />
        <Text style={styles.loadingText}>Welcome back! Redirecting...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to access your Mzansi Meals account</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <FontAwesome name="envelope" size={20} color="#999" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              editable={!loading}
            />
          </View>

          <View style={styles.inputContainer}>
            <FontAwesome name="lock" size={20} color="#999" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
              editable={!loading}
            />
            <TouchableOpacity
              onPress={() => setShowPassword(!showPassword)}
              style={styles.passwordToggle}
              disabled={loading}
            >
              <FontAwesome
                name={showPassword ? 'eye-slash' : 'eye'}
                size={20}
                color="#999"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading || !email || !password}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.loginButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <Link href="/register" asChild>
              <TouchableOpacity disabled={loading}>
                <Text style={styles.registerLink}>Sign Up</Text>
              </TouchableOpacity>
            </Link>
          </View>

          <View style={styles.guestContainer}>
            <Text style={styles.guestText}>Or continue as </Text>
            <TouchableOpacity 
              disabled={loading}
              onPress={handleGuestLogin}
            >
              <Text style={styles.guestLink}>Guest</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: '#eaeaea',
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    paddingVertical: 15,
    fontSize: 16,
    color: '#333',
  },
  passwordToggle: {
    padding: 5,
  },
  forgotPassword: {
    alignSelf: 'flex-end',
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#e74c3c',
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  loginButtonDisabled: {
    backgroundColor: '#f1948a',
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  registerText: {
    color: '#7f8c8d',
    fontSize: 16,
  },
  registerLink: {
    color: '#e74c3c',
    fontSize: 16,
    fontWeight: '600',
  },
  guestContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  guestText: {
    color: '#7f8c8d',
    fontSize: 16,
  },
  guestLink: {
    color: '#e74c3c',
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    color: '#2c3e50',
  },
});