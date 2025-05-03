import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, ScrollView } from 'react-native';
import { settingsApi } from '../services/settingsApi';
import { UserSettings, NotificationSettings, PrivacySettings } from '../services/settingsApi';

export const SettingsTestScreen = () => {
  const [userSettings, setUserSettings] = useState<UserSettings | null>(null);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings | null>(null);
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchAllSettings = async () => {
    try {
      setError(null);
      const [user, notifications, privacy] = await Promise.all([
        settingsApi.getUserSettings(),
        settingsApi.getNotificationSettings(),
        settingsApi.getPrivacySettings(),
      ]);
      setUserSettings(user);
      setNotificationSettings(notifications);
      setPrivacySettings(privacy);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const updateUserSettings = async () => {
    try {
      setError(null);
      const updatedSettings = await settingsApi.updateUserSettings({
        darkMode: !userSettings?.darkMode,
        fontSize: (userSettings?.fontSize || 16) + 2,
      });
      setUserSettings(updatedSettings);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  const resetSettings = async () => {
    try {
      setError(null);
      await settingsApi.resetSettings();
      await fetchAllSettings();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  useEffect(() => {
    fetchAllSettings();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Settings API Test</Text>

      {error && <Text style={styles.error}>Error: {error}</Text>}

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>User Settings</Text>
        <Text>{JSON.stringify(userSettings, null, 2)}</Text>
        <Button title="Toggle Dark Mode & Increase Font Size" onPress={updateUserSettings} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notification Settings</Text>
        <Text>{JSON.stringify(notificationSettings, null, 2)}</Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Privacy Settings</Text>
        <Text>{JSON.stringify(privacySettings, null, 2)}</Text>
      </View>

      <Button title="Reset All Settings" onPress={resetSettings} />
      <Button title="Refresh All Settings" onPress={fetchAllSettings} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  section: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  error: {
    color: 'red',
    marginBottom: 16,
  },
}); 