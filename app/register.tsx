import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { Link, useRouter } from 'expo-router';
import { useAuth } from './contexts/AuthProvider';

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
  const [isButtonDisabled, setIsButtonDisabled] = useState(false);
  const router = useRouter();

  console.log('DEBUG - isLoading:', isLoading);
  console.log('DEBUG - showSuccess:', showSuccess);
  console.log('DEBUG - formData:', formData);
  console.log('DEBUG - All fields filled:', 
    formData.name && formData.surname && formData.email && 
    formData.password && formData.confirmPassword
  );

  // Check if user is logged in and redirect
  useEffect(() => {
    if (user) {
      console.log('DEBUG - User detected, redirecting...');
      router.replace('/(tabs)');
    }
  }, [user]);

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
      
      // Show success message
      Alert.alert('Success', result.message || 'Account created successfully!');
      
      // Automatically redirect after 2 seconds
      setTimeout(() => {
        router.replace('/(tabs)');
      }, 2000);
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

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.header}>
          <FontAwesome name="user-plus" size={80} color="#FFD700" />
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Join ÉLÉGANCE today</Text>
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
              (!isFormValid() || isLoading || showSuccess) && styles.disabledButton
            ]} 
            onPress={handleSignup}
            disabled={!isFormValid() || isLoading || showSuccess}
          >
            {isLoading ? (
              <ActivityIndicator color="#1a1a1a" />
            ) : showSuccess ? (
              <>
                <FontAwesome name="check-circle" size={24} color="#1a1a1a" />
                <Text style={styles.signupButtonText}>Account Created!</Text>
              </>
            ) : (
              <>
                <Text style={styles.signupButtonText}>
                  {isFormValid() ? 'Create Account' : 'Fill All Fields'}
                </Text>
                {isFormValid() && <FontAwesome name="arrow-right" size={20} color="#1a1a1a" />}
              </>
            )}
          </TouchableOpacity>

          {isFormValid() && (
            <Text style={styles.readyText}>✓ All fields are valid. Press "Create Account"</Text>
          )}

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>Already have an account?</Text>
            <View style={styles.dividerLine} />
          </View>

          <Link href="/login" asChild>
            <TouchableOpacity style={styles.loginButton} disabled={isLoading || showSuccess}>
              <Text style={styles.loginButtonText}>Sign In Instead</Text>
              <FontAwesome name="sign-in" size={16} color="#FFD700" />
            </TouchableOpacity>
          </Link>
        </View>

        <View style={styles.footer}>
          <Text style={styles.termsText}>
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </Text>
          <Text style={styles.footerText}>ÉLÉGANCE Restaurant App</Text>
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
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFD700',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#999',
    marginTop: 10,
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
    backgroundColor: '#2d2d2d',
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
    color: '#FFFFFF',
    fontSize: 16,
    paddingVertical: 15,
  },
  signupButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFD700',
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
    gap: 10,
  },
  disabledButton: {
    backgroundColor: '#666',
    opacity: 0.6,
  },
  signupButtonText: {
    color: '#1a1a1a',
    fontSize: 18,
    fontWeight: 'bold',
  },
  readyText: {
    color: '#4CAF50',
    textAlign: 'center',
    marginTop: 10,
    fontSize: 14,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#444',
  },
  dividerText: {
    color: '#999',
    paddingHorizontal: 10,
    fontSize: 14,
  },
  loginButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    borderRadius: 10,
    padding: 15,
    borderWidth: 1,
    borderColor: '#FFD700',
    gap: 10,
  },
  loginButtonText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    marginTop: 40,
  },
  termsText: {
    color: '#666',
    fontSize: 12,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 18,
  },
  footerText: {
    color: '#FFA000',
    fontSize: 12,
  },
});
