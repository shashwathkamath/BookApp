import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Alert, Platform, Linking } from 'react-native';
import { PLACEHOLDER_IMAGES } from '../assets/placeholders';
import { launchImageLibrary, launchCamera, ImagePickerResponse } from 'react-native-image-picker';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';

interface User {
  name: string;
  email: string;
  avatar?: string;
  booksListed: number;
  booksSold: number;
  booksPurchased: number;
}

export default function ProfileScreen() {
  // Dummy user data - replace with real data later
  const [user, setUser] = useState<User>({
    name: 'John Doe',
    email: 'john@example.com',
    avatar: undefined,
    booksListed: 5,
    booksSold: 3,
    booksPurchased: 7,
  });

  const requestCameraPermission = async () => {
    try {
      const permission = Platform.select({
        ios: PERMISSIONS.IOS.CAMERA,
        android: PERMISSIONS.ANDROID.CAMERA,
      });

      if (!permission) {
        console.error('Camera permission not found for platform');
        return false;
      }

      const permissionStatus = await check(permission);
      
      if (permissionStatus === RESULTS.DENIED) {
        const result = await request(permission);
        return result === RESULTS.GRANTED;
      }
      
      return permissionStatus === RESULTS.GRANTED;
    } catch (error) {
      console.error('Error requesting camera permission:', error);
      return false;
    }
  };

  const handleImagePicker = () => {
    Alert.alert(
      'Change Profile Picture',
      'Choose a method to update your profile picture',
      [
        {
          text: 'Take Photo',
          onPress: async () => {
            const hasPermission = await requestCameraPermission();
            if (!hasPermission) {
              Alert.alert(
                'Camera Permission Required',
                'Please grant camera permission to take photos.',
                [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Open Settings', 
                    onPress: () => {
                      if (Platform.OS === 'ios') {
                        Linking.openURL('app-settings:');
                      } else {
                        Linking.openSettings();
                      }
                    }
                  }
                ]
              );
              return;
            }
            
            launchCamera(
              {
                mediaType: 'photo',
                quality: 0.8,
                saveToPhotos: false,
              },
              handleImageResponse
            );
          },
        },
        {
          text: 'Choose from Library',
          onPress: () => {
            launchImageLibrary(
              {
                mediaType: 'photo',
                quality: 0.8,
                selectionLimit: 1,
              },
              handleImageResponse
            );
          },
        },
        {
          text: 'Cancel',
          style: 'cancel',
        },
      ]
    );
  };

  const handleImageResponse = (response: ImagePickerResponse) => {
    if (response.didCancel) {
      return;
    }

    if (response.errorCode) {
      Alert.alert('Error', response.errorMessage || 'Failed to select image');
      return;
    }

    if (response.assets && response.assets[0]) {
      const selectedImage = response.assets[0];
      // Here you would typically upload the image to your server
      // For now, we'll just update the local state
      setUser(prev => ({
        ...prev,
        avatar: selectedImage.uri,
      }));
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <TouchableOpacity onPress={handleImagePicker}>
            <Image
              source={user.avatar ? { uri: user.avatar } : { uri: PLACEHOLDER_IMAGES.avatar }}
              style={styles.avatar}
            />
            <View style={styles.editButton}>
              <Text style={styles.editButtonText}>Edit</Text>
            </View>
          </TouchableOpacity>
        </View>
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.email}>{user.email}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{user.booksListed}</Text>
          <Text style={styles.statLabel}>Listed</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{user.booksSold}</Text>
          <Text style={styles.statLabel}>Sold</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statNumber}>{user.booksPurchased}</Text>
          <Text style={styles.statLabel}>Purchased</Text>
        </View>
      </View>

      <View style={styles.section}>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>My Listings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Purchase History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Sale History</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Settings</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.menuItem}>
          <Text style={styles.menuItemText}>Help & Support</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>Log Out</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  avatarContainer: {
    marginBottom: 16,
    position: 'relative',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editButton: {
    position: 'absolute',
    right: -16,
    bottom: 8,
    backgroundColor: '#e8f5e9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  editButtonText: {
    color: '#1a1a1a',
    fontSize: 14,
    fontWeight: 'bold',
  },
  name: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  email: {
    fontSize: 16,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    backgroundColor: 'white',
    marginTop: 1,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#f4511e',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  section: {
    backgroundColor: 'white',
    marginTop: 20,
    paddingVertical: 8,
  },
  menuItem: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemText: {
    fontSize: 16,
    color: '#333',
  },
  logoutButton: {
    margin: 20,
    backgroundColor: '#e8f5e9',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  logoutButtonText: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 