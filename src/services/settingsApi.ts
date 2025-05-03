import axios from 'axios';
import { API_BASE_URL } from '../config';

export interface UserSettings {
  notifications: boolean;
  darkMode: boolean;
  fontSize: number;
  language: string;
  autoSync: boolean;
}

export interface NotificationSettings {
  emailNotifications: boolean;
  pushNotifications: boolean;
  marketingEmails: boolean;
  soundEnabled: boolean;
}

export interface PrivacySettings {
  profileVisibility: 'public' | 'private' | 'friends';
  showReadingHistory: boolean;
  showBookmarks: boolean;
  showReviews: boolean;
}

class SettingsApi {
  private baseUrl: string;

  constructor() {
    this.baseUrl = `${API_BASE_URL}/settings`;
  }

  // Get user settings
  async getUserSettings(): Promise<UserSettings> {
    try {
      const response = await axios.get(`${this.baseUrl}/user`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user settings:', error);
      throw error;
    }
  }

  // Update user settings
  async updateUserSettings(settings: Partial<UserSettings>): Promise<UserSettings> {
    try {
      const response = await axios.put(`${this.baseUrl}/user`, settings);
      return response.data;
    } catch (error) {
      console.error('Error updating user settings:', error);
      throw error;
    }
  }

  // Get notification settings
  async getNotificationSettings(): Promise<NotificationSettings> {
    try {
      const response = await axios.get(`${this.baseUrl}/notifications`);
      return response.data;
    } catch (error) {
      console.error('Error fetching notification settings:', error);
      throw error;
    }
  }

  // Update notification settings
  async updateNotificationSettings(settings: Partial<NotificationSettings>): Promise<NotificationSettings> {
    try {
      const response = await axios.put(`${this.baseUrl}/notifications`, settings);
      return response.data;
    } catch (error) {
      console.error('Error updating notification settings:', error);
      throw error;
    }
  }

  // Get privacy settings
  async getPrivacySettings(): Promise<PrivacySettings> {
    try {
      const response = await axios.get(`${this.baseUrl}/privacy`);
      return response.data;
    } catch (error) {
      console.error('Error fetching privacy settings:', error);
      throw error;
    }
  }

  // Update privacy settings
  async updatePrivacySettings(settings: Partial<PrivacySettings>): Promise<PrivacySettings> {
    try {
      const response = await axios.put(`${this.baseUrl}/privacy`, settings);
      return response.data;
    } catch (error) {
      console.error('Error updating privacy settings:', error);
      throw error;
    }
  }

  // Reset settings to default
  async resetSettings(): Promise<void> {
    try {
      await axios.post(`${this.baseUrl}/reset`);
    } catch (error) {
      console.error('Error resetting settings:', error);
      throw error;
    }
  }
}

export const settingsApi = new SettingsApi(); 