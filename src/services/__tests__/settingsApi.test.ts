import axios from 'axios';
import { settingsApi } from '../settingsApi';
import { API_BASE_URL } from '../../config';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('SettingsApi', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
  });

  describe('getUserSettings', () => {
    it('should fetch user settings successfully', async () => {
      // Mock response data
      const mockSettings = {
        notifications: true,
        darkMode: false,
        fontSize: 16,
        language: 'en',
        autoSync: true,
      };

      // Mock axios get response
      mockedAxios.get.mockResolvedValueOnce({ data: mockSettings });

      // Call the API
      const result = await settingsApi.getUserSettings();

      // Verify the result
      expect(result).toEqual(mockSettings);
      expect(mockedAxios.get).toHaveBeenCalledWith(`${API_BASE_URL}/settings/user`);
    });

    it('should handle errors when fetching user settings', async () => {
      // Mock error
      const error = new Error('Network error');
      mockedAxios.get.mockRejectedValueOnce(error);

      // Verify that the error is thrown
      await expect(settingsApi.getUserSettings()).rejects.toThrow('Network error');
    });
  });

  describe('updateUserSettings', () => {
    it('should update user settings successfully', async () => {
      // Mock update data
      const updateData = {
        darkMode: true,
        fontSize: 18,
      };

      // Mock response data
      const mockResponse = {
        notifications: true,
        darkMode: true,
        fontSize: 18,
        language: 'en',
        autoSync: true,
      };

      // Mock axios put response
      mockedAxios.put.mockResolvedValueOnce({ data: mockResponse });

      // Call the API
      const result = await settingsApi.updateUserSettings(updateData);

      // Verify the result
      expect(result).toEqual(mockResponse);
      expect(mockedAxios.put).toHaveBeenCalledWith(
        `${API_BASE_URL}/settings/user`,
        updateData
      );
    });
  });

  describe('getNotificationSettings', () => {
    it('should fetch notification settings successfully', async () => {
      // Mock response data
      const mockSettings = {
        emailNotifications: true,
        pushNotifications: true,
        marketingEmails: false,
        soundEnabled: true,
      };

      // Mock axios get response
      mockedAxios.get.mockResolvedValueOnce({ data: mockSettings });

      // Call the API
      const result = await settingsApi.getNotificationSettings();

      // Verify the result
      expect(result).toEqual(mockSettings);
      expect(mockedAxios.get).toHaveBeenCalledWith(`${API_BASE_URL}/settings/notifications`);
    });
  });

  describe('getPrivacySettings', () => {
    it('should fetch privacy settings successfully', async () => {
      // Mock response data
      const mockSettings = {
        profileVisibility: 'public',
        showReadingHistory: true,
        showBookmarks: true,
        showReviews: false,
      };

      // Mock axios get response
      mockedAxios.get.mockResolvedValueOnce({ data: mockSettings });

      // Call the API
      const result = await settingsApi.getPrivacySettings();

      // Verify the result
      expect(result).toEqual(mockSettings);
      expect(mockedAxios.get).toHaveBeenCalledWith(`${API_BASE_URL}/settings/privacy`);
    });
  });

  describe('resetSettings', () => {
    it('should reset settings successfully', async () => {
      // Mock axios post response
      mockedAxios.post.mockResolvedValueOnce({});

      // Call the API
      await settingsApi.resetSettings();

      // Verify the call
      expect(mockedAxios.post).toHaveBeenCalledWith(`${API_BASE_URL}/settings/reset`);
    });
  });
}); 