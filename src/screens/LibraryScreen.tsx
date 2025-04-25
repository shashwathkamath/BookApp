import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text } from 'react-native';
import { TabScreenProps } from '../navigation/types';
import BookList from '../components/BookList';
import Ionicons from 'react-native-vector-icons/Ionicons';

// Mock data - replace with actual data from your backend/state management
const mockBooks = [
  {
    id: '1',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    coverImage: 'https://covers.openlibrary.org/b/id/8155273-L.jpg',
    price: 15.99,
    isForSale: true,
  },
  {
    id: '2',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    coverImage: 'https://covers.openlibrary.org/b/id/8155273-L.jpg',
  },
  // Add more mock books as needed
];

const mockFavorites = [
  {
    id: '3',
    title: '1984',
    author: 'George Orwell',
    coverImage: 'https://covers.openlibrary.org/b/id/8155273-L.jpg',
  },
  // Add more mock favorites as needed
];

export default function LibraryScreen({ navigation }: TabScreenProps<'Library'>) {
  const [activeTab, setActiveTab] = useState<'myBooks' | 'favorites'>('myBooks');

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'myBooks' && styles.activeTab]}
            onPress={() => setActiveTab('myBooks')}
          >
            <Text style={[styles.tabText, activeTab === 'myBooks' && styles.activeTabText]}>
              My Books
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'favorites' && styles.activeTab]}
            onPress={() => setActiveTab('favorites')}
          >
            <Text style={[styles.tabText, activeTab === 'favorites' && styles.activeTabText]}>
              Favorites
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {activeTab === 'myBooks' ? (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Books for Sale</Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => navigation.navigate('AddBook')}
              >
                <Ionicons name="add-circle" size={24} color="#fff" />
                <Text style={styles.addButtonText}>Add Book</Text>
              </TouchableOpacity>
            </View>
            <BookList title="" books={mockBooks.filter(book => book.isForSale)} />
            
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>My Collection</Text>
            </View>
            <BookList title="" books={mockBooks.filter(book => !book.isForSale)} />
          </>
        ) : (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Favorites</Text>
            </View>
            <BookList title="" books={mockFavorites} />
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  tab: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: '#eee',
  },
  activeTab: {
    borderBottomColor: '#4caf50',
  },
  tabText: {
    fontSize: 16,
    color: '#666',
  },
  activeTabText: {
    color: '#4caf50',
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    marginTop: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4caf50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  addButtonText: {
    marginLeft: 6,
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
}); 