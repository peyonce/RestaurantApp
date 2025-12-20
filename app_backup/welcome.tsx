import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from 'react-native';
import { Link } from 'expo-router';
import { FontAwesome } from '@expo/vector-icons';

export default function HomeScreen() {
  return (
    <ImageBackground 
      source={{ uri: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200' }}
      style={styles.container}
      blurRadius={3}
    >
      {/* Overlay */}
      <View style={styles.overlay} />
      
      {/* Content */}
      <View style={styles.content}>
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Text style={styles.logoIcon}>🍽️</Text>
          <Text style={styles.logoText}>Mzansi Meals</Text>
          <Text style={styles.logoSubtext}>Authentic South African Cuisine</Text>
        </View>
        
        {/* Tagline */}
        <Text style={styles.tagline}>
          Create your Mzansi Meals account{'\n'}and enjoy authentic South African cuisine
        </Text>
        
        {/* Features */}
        <View style={styles.features}>
          <View style={styles.featureItem}>
            <FontAwesome name="star" size={20} color="#FFD700" />
            <Text style={styles.featureText}>South African-inspired</Text>
          </View>
          <View style={styles.featureItem}>
            <FontAwesome name="truck" size={20} color="#FFD700" />
            <Text style={styles.featureText}>Authentic delivery</Text>
          </View>
          <View style={styles.featureItem}>
            <FontAwesome name="shield" size={20} color="#FFD700" />
            <Text style={styles.featureText}>Authenticity guaranteed</Text>
          </View>
        </View>
        
        {/* Buttons */}
        <View style={styles.buttonContainer}>
          <Link href="/login" asChild>
            <TouchableOpacity style={styles.primaryButton}>
              <Text style={styles.primaryButtonText}>Explore Mzansi Meals</Text>
              <FontAwesome name="arrow-right" size={16} color="#1a1a1a" />
            </TouchableOpacity>
          </Link>
          
          <Link href="/register" asChild>
            <TouchableOpacity style={styles.secondaryButton}>
              <Text style={styles.secondaryButtonText}>Join Mzansi Meals</Text>
            </TouchableOpacity>
          </Link>
        </View>
        
        {/* Footer */}
        <Text style={styles.footerText}>
          By continuing, you agree to our Terms & Privacy
        </Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(26, 26, 26, 0.85)',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 30,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logoIcon: {
    fontSize: 60,
    marginBottom: 10,
  },
  logoText: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#FFD700',
    letterSpacing: 4,
  },
  logoSubtext: {
    fontSize: 14,
    color: '#ffffff',
    letterSpacing: 8,
    marginTop: 5,
  },
  tagline: {
    fontSize: 18,
    color: '#ffffff',
    textAlign: 'center',
    lineHeight: 26,
    marginBottom: 40,
    fontFamily: 'serif',
  },
  features: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 40,
    width: '100%',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 8,
  },
  featureText: {
    color: '#ffffff',
    fontSize: 16,
    marginLeft: 15,
    fontWeight: '500',
  },
  buttonContainer: {
    width: '100%',
    gap: 15,
    marginBottom: 30,
  },
  primaryButton: {
    backgroundColor: '#FFD700',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 15,
    gap: 10,
    shadowColor: '#FFD700',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  primaryButtonText: {
    color: '#1a1a1a',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    paddingVertical: 18,
    borderRadius: 15,
    borderWidth: 2,
    borderColor: '#FFD700',
    alignItems: 'center',
  },
  secondaryButtonText: {
    color: '#FFD700',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  footerText: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 12,
    textAlign: 'center',
    marginTop: 20,
  },
});
