import React, { useState } from 'react';
import { 
  View, Text, ScrollView, StyleSheet, TouchableOpacity, 
  Switch, Alert, Linking 
} from 'react-native';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';

export default function SettingsScreen() {
  const [darkMode, setDarkMode] = useState(true);
  const [autoUpdate, setAutoUpdate] = useState(true);
  const [dataSaver, setDataSaver] = useState(false);
  const [language, setLanguage] = useState('English');

  const settingsCategories = [
    {
      title: 'App Settings',
      items: [
        { icon: 'moon-o', label: 'Dark Mode', type: 'switch', value: darkMode, action: setDarkMode },
        { icon: 'refresh', label: 'Auto Update', type: 'switch', value: autoUpdate, action: setAutoUpdate },
        { icon: 'wifi', label: 'Data Saver', type: 'switch', value: dataSaver, action: setDataSaver },
        { icon: 'language', label: 'Language', type: 'select', value: language, action: () => Alert.alert('Language', 'Select language') },
      ]
    },
    {
      title: 'Preferences',
      items: [
        { icon: 'volume-up', label: 'Sound & Haptics', type: 'nav', action: () => Alert.alert('Sound', 'Sound settings') },
        { icon: 'picture-o', label: 'Appearance', type: 'nav', action: () => Alert.alert('Appearance', 'Appearance settings') },
        { icon: 'shield', label: 'Privacy Settings', type: 'nav', action: () => router.push('/privacy') },
      ]
    },
    {
      title: 'Support',
      items: [
        { icon: 'question-circle', label: 'Help Center', type: 'nav', action: () => Linking.openURL('https://help.restaurant.com') },
        { icon: 'envelope', label: 'Contact Us', type: 'nav', action: () => Linking.openURL('mailto:support@restaurant.com') },
        { icon: 'info-circle', label: 'About', type: 'nav', action: () => Alert.alert('About', 'Food App v1.0.0\n© 2024 Restaurant Inc.') },
      ]
    },
    {
      title: 'Account',
      items: [
        { icon: 'user', label: 'Account Information', type: 'nav', action: () => router.back() },
        { icon: 'credit-card', label: 'Payment Methods', type: 'nav', action: () => router.back() },
        { icon: 'bell', label: 'Notifications', type: 'nav', action: () => router.back() },
      ]
    }
  ];

  const handleClearCache = () => {
    Alert.alert('Clear Cache', 'Are you sure?', [
      { text: 'Cancel' },
      { text: 'Clear', onPress: () => Alert.alert('Success', 'Cache cleared') }
    ]);
  };

  const handleLogoutAll = () => {
    Alert.alert('Logout All Devices', 'Logout from all devices?', [
      { text: 'Cancel' },
      { text: 'Logout', onPress: () => Alert.alert('Success', 'Logged out from all devices') }
    ]);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <FontAwesome name="arrow-left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <Text style={styles.title}>Settings</Text>
      </View>

      <View style={styles.content}>
        {settingsCategories.map((category, categoryIndex) => (
          <View key={categoryIndex} style={styles.category}>
            <Text style={styles.categoryTitle}>{category.title}</Text>
            <View style={styles.categoryContent}>
              {category.items.map((item, itemIndex) => (
                <TouchableOpacity
                  key={itemIndex}
                  style={styles.settingItem}
                  onPress={() => item.type === 'nav' && item.action()}
                  disabled={item.type === 'switch'}
                >
                  <View style={styles.settingLeft}>
                    <FontAwesome name={item.icon as any} size={20} color="#FFD700" />
                    <Text style={styles.settingLabel}>{item.label}</Text>
                  </View>
                  
                  {item.type === 'switch' ? (
                    <Switch
                      value={item.value}
                      onValueChange={item.action}
                      trackColor={{ false: '#767577', true: '#81b0ff' }}
                      thumbColor={item.value ? '#FFD700' : '#f4f3f4'}
                    />
                  ) : item.type === 'select' ? (
                    <View style={styles.selectContainer}>
                      <Text style={styles.selectText}>{item.value}</Text>
                      <FontAwesome name="chevron-right" size={14} color="#999" />
                    </View>
                  ) : (
                    <FontAwesome name="chevron-right" size={16} color="#999" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ))}

        {/* Action Buttons */}
        <View style={styles.category}>
          <Text style={styles.categoryTitle}>Actions</Text>
          <View style={styles.categoryContent}>
            <TouchableOpacity style={styles.actionButton} onPress={handleClearCache}>
              <Text style={styles.actionText}>Clear Cache</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionButton} onPress={handleLogoutAll}>
              <Text style={styles.actionText}>Logout All Devices</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>Food App</Text>
          <Text style={styles.versionNumber}>Version 1.0.0 (Build 2024.12)</Text>
          <Text style={styles.copyright}>© 2024 Restaurant Inc. All rights reserved.</Text>
        </View>
      </View>
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
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: '#2d2d2d',
    borderBottomWidth: 1,
    borderBottomColor: '#444',
  },
  backButton: {
    marginRight: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  content: {
    padding: 20,
  },
  category: {
    marginBottom: 25,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFD700',
    marginBottom: 10,
    marginLeft: 5,
  },
  categoryContent: {
    backgroundColor: '#2d2d2d',
    borderRadius: 12,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    color: '#FFFFFF',
    marginLeft: 15,
    flex: 1,
  },
  selectContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  selectText: {
    color: '#999',
    fontSize: 14,
  },
  actionButton: {
    backgroundColor: 'rgba(255, 215, 0, 0.1)',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 215, 0, 0.3)',
  },
  actionText: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: '600',
  },
  versionContainer: {
    alignItems: 'center',
    padding: 30,
  },
  versionText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 5,
  },
  versionNumber: {
    fontSize: 14,
    color: '#999',
    marginBottom: 10,
  },
  copyright: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
});
