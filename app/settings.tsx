import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { Dispatch, SetStateAction, useState } from 'react';
import {
  Alert, Linking,
  ScrollView, StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

// Define types for settings items
type SettingItem = 
  | { 
      icon: string; 
      label: string; 
      type: 'switch'; 
      value: boolean; 
      action: Dispatch<SetStateAction<boolean>>;
    }
  | {
      icon: string;
      label: string;
      type: 'link';
      action: () => void;
    }
  | {
      icon: string;
      label: string;
      type: 'info';
      value: string;
    };

export default function SettingsScreen() {
  // App Settings
  const [darkMode, setDarkMode] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [locationAccess, setLocationAccess] = useState(true);
  const [biometricAuth, setBiometricAuth] = useState(false);
  const [autoPlayVideos, setAutoPlayVideos] = useState(false);
  const [dataSaver, setDataSaver] = useState(false);

  // Mzansi Meals Settings
  const [promoNotifications, setPromoNotifications] = useState(true);
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [newDishAlerts, setNewDishAlerts] = useState(true);
  const [tableBookingReminders, setTableBookingReminders] = useState(true);

  const handleRateApp = () => {
    Alert.alert(
      'Rate Mzansi Meals',
      'Enjoying our South African cuisine? Please rate us on the app store!',
      [
        { text: 'Maybe Later', style: 'cancel' },
        { text: 'Rate Now', onPress: () => Linking.openURL('https://apps.apple.com') }
      ]
    );
  };

  const handleContactSupport = () => {
    Alert.alert(
      'Contact Mzansi Meals',
      'Choose how you\'d like to contact us:',
      [
        { text: 'Call: +27 11 123 4567', onPress: () => Linking.openURL('tel:+27111234567') },
        { text: 'Email: support@mzansimeals.co.za', onPress: () => Linking.openURL('mailto:support@mzansimeals.co.za') },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  const handleAboutMzansi = () => {
    Alert.alert(
      'About Mzansi Meals',
      '🍽️ **Taste the Rainbow Nation**\n\n' +
      'Mzansi Meals brings authentic South African cuisine to your doorstep. ' +
      'From traditional braai platters to modern Cape Malay fusion, ' +
      'we celebrate the diverse flavors of South Africa.\n\n' +
      '📍 Orlando West, Soweto\n' +
      '📞 +27 11 123 4567\n' +
      '✉️ info@mzansimeals.co.za\n\n' +
      '**Operating Hours:**\n' +
      'Mon-Fri: 10:00 - 22:00\n' +
      'Saturday: 10:00 - 23:00\n' +
      'Sunday: 10:00 - 20:00',
      [{ text: '🇿🇦 Amandla!', style: 'default' }]
    );
  };

  const handlePrivacyPolicy = () => {
    Alert.alert(
      'Privacy Policy',
      'Your privacy is important to Mzansi Meals. We collect only necessary data to provide our services and never share your personal information with third parties without consent.\n\n' +
      'For detailed information, visit: mzansimeals.co.za/privacy',
      [{ text: 'OK', style: 'default' }]
    );
  };

  const handleTermsConditions = () => {
    Alert.alert(
      'Terms & Conditions',
      'By using Mzansi Meals, you agree to our terms of service. Orders are subject to availability. Delivery times are estimates. Payments are processed securely.\n\n' +
      'Full terms: mzansimeals.co.za/terms',
      [{ text: 'OK', style: 'default' }]
    );
  };

  const handleClearCache = () => {
    Alert.alert(
      'Clear Cache',
      'This will remove temporary data and may improve app performance.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear Cache', 
          style: 'destructive',
          onPress: () => Alert.alert('Cache Cleared', 'Mzansi Meals cache has been cleared')
        }
      ]
    );
  };

  const appSettings: SettingItem[] = [
    { icon: 'moon-o', label: 'Dark Mode', type: 'switch', value: darkMode, action: setDarkMode },
    { icon: 'bell-o', label: 'Push Notifications', type: 'switch', value: notifications, action: setNotifications },
    { icon: 'location-arrow', label: 'Location Access', type: 'switch', value: locationAccess, action: setLocationAccess },
    { icon: 'fingerprint', label: 'Biometric Login', type: 'switch', value: biometricAuth, action: setBiometricAuth },
    { icon: 'video-camera', label: 'Auto-play Videos', type: 'switch', value: autoPlayVideos, action: setAutoPlayVideos },
    { icon: 'signal', label: 'Data Saver Mode', type: 'switch', value: dataSaver, action: setDataSaver },
  ];

  const mzansiSettings: SettingItem[] = [
    { icon: 'gift', label: 'Promotions & Offers', type: 'switch', value: promoNotifications, action: setPromoNotifications },
    { icon: 'shopping-cart', label: 'Order Updates', type: 'switch', value: orderUpdates, action: setOrderUpdates },
    { icon: 'cutlery', label: 'New Dish Alerts', type: 'switch', value: newDishAlerts, action: setNewDishAlerts },
    { icon: 'calendar', label: 'Booking Reminders', type: 'switch', value: tableBookingReminders, action: setTableBookingReminders },
  ];

  const infoItems: SettingItem[] = [
    { icon: 'info-circle', label: 'App Version', type: 'info', value: '2.1.0' },
    { icon: 'database', label: 'Storage Used', type: 'info', value: '124 MB' },
    { icon: 'user-circle', label: 'Account Created', type: 'info', value: '15 Jan 2024' },
  ];

  const actionItems = [
    { icon: 'star', label: 'Rate Mzansi Meals', action: handleRateApp },
    { icon: 'question-circle', label: 'Help & FAQ', action: () => router.push('/help') },
    { icon: 'phone', label: 'Contact Support', action: handleContactSupport },
    { icon: 'shield', label: 'Privacy Policy', action: handlePrivacyPolicy },
    { icon: 'file-text', label: 'Terms & Conditions', action: handleTermsConditions },
    { icon: 'trash', label: 'Clear Cache', action: handleClearCache },
    { icon: 'globe', label: 'About Mzansi Meals', action: handleAboutMzansi },
  ];

  const renderSettingItem = (item: SettingItem, index: number) => {
    if (item.type === 'switch') {
      return (
        <View key={index} style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <FontAwesome name={item.icon as any} size={22} color="#FFD700" style={styles.settingIcon} />
            <Text style={styles.settingLabel}>{item.label}</Text>
          </View>
          <Switch
            value={item.value}
            onValueChange={item.action}
            trackColor={{ false: '#767577', true: '#4CAF50' }}
            thumbColor={item.value ? '#FFD700' : '#f4f3f4'}
          />
        </View>
      );
    } else if (item.type === 'info') {
      return (
        <View key={index} style={styles.settingItem}>
          <View style={styles.settingLeft}>
            <FontAwesome name={item.icon as any} size={22} color="#FFD700" style={styles.settingIcon} />
            <Text style={styles.settingLabel}>{item.label}</Text>
          </View>
          <Text style={styles.settingValue}>{item.value}</Text>
        </View>
      );
    }
    return null;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Mzansi Meals Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* App Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Preferences</Text>
        <View style={styles.settingsCard}>
          {appSettings.map(renderSettingItem)}
        </View>
      </View>

      {/* Mzansi Meals Settings */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mzansi Meals Preferences</Text>
        <View style={styles.settingsCard}>
          {mzansiSettings.map(renderSettingItem)}
        </View>
      </View>

      {/* App Information */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>App Information</Text>
        <View style={styles.settingsCard}>
          {infoItems.map(renderSettingItem)}
        </View>
      </View>

      {/* Actions */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support & Legal</Text>
        <View style={styles.settingsCard}>
          {actionItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.actionItem}
              onPress={item.action}
            >
              <View style={styles.settingLeft}>
                <FontAwesome name={item.icon as any} size={22} color="#FFD700" style={styles.settingIcon} />
                <Text style={styles.settingLabel}>{item.label}</Text>
              </View>
              <FontAwesome name="chevron-right" size={16} color="#999" />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Mzansi Meals Info */}
      <View style={styles.mzansiInfoCard}>
        <View style={styles.mzansiHeader}>
          <FontAwesome name="flag" size={24} color="#FFD700" />
          <Text style={styles.mzansiTitle}>Mzansi Meals</Text>
        </View>
        <Text style={styles.mzansiDescription}>
          Bringing authentic South African cuisine to your doorstep. 
          Taste the flavors of the Rainbow Nation! 🇿🇦
        </Text>
        <View style={styles.mzansiContact}>
          <TouchableOpacity 
            style={styles.contactButton}
            onPress={() => Linking.openURL('tel:+27111234567')}
          >
            <FontAwesome name="phone" size={16} color="#FFD700" />
            <Text style={styles.contactText}>Call Us</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.contactButton}
            onPress={() => Linking.openURL('mailto:info@mzansimeals.co.za')}
          >
            <FontAwesome name="envelope" size={16} color="#FFD700" />
            <Text style={styles.contactText}>Email</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={styles.contactButton}
            onPress={() => Linking.openURL('https://instagram.com/mzansi_meals')}
          >
            <FontAwesome name="instagram" size={16} color="#FFD700" />
            <Text style={styles.contactText}>Instagram</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>© 2024 Mzansi Meals</Text>
        <Text style={styles.footerSubtext}>Version 2.1.0 • Made with ❤️ in South Africa</Text>
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#2d2d2d',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  section: {
    marginTop: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  settingsCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 16,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  actionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: 16,
    width: 24,
  },
  settingLabel: {
    color: '#fff',
    fontSize: 16,
    flex: 1,
  },
  settingValue: {
    color: '#999',
    fontSize: 16,
  },
  mzansiInfoCard: {
    backgroundColor: '#2d2d2d',
    borderRadius: 16,
    marginHorizontal: 20,
    marginTop: 24,
    padding: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#FFD700',
  },
  mzansiHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  mzansiTitle: {
    color: '#FFD700',
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 12,
  },
  mzansiDescription: {
    color: '#fff',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 16,
  },
  mzansiContact: {
    flexDirection: 'row',
    gap: 12,
  },
  contactButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFD700',
    gap: 8,
  },
  contactText: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: '500',
  },
  footer: {
    alignItems: 'center',
    padding: 24,
    marginTop: 24,
  },
  footerText: {
    color: '#999',
    fontSize: 14,
    marginBottom: 4,
  },
  footerSubtext: {
    color: '#666',
    fontSize: 12,
  },
  bottomSpacer: {
    height: 20,
  },
});
