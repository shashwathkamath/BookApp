import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import { RootStackScreenProps } from '../navigation/types';
import { Book } from '../types/book';

export default function BookDetailsScreen({ 
  route, 
  navigation 
}: RootStackScreenProps<'BookDetails'>) {
  const { bookId } = route.params;
  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // TODO: Replace with actual API call
    const fetchBook = async () => {
      try {
        // Simulated API call
        const mockBook: Book = {
          id: bookId,
          title: 'Sample Book',
          author: 'Sample Author',
          description: 'This is a sample book description.',
          genre: ['Fiction', 'Adventure'],
          publishedDate: '2023-01-01',
          rating: 4.5,
          isRead: true,
        };
        setBook(mockBook);
      } catch (error) {
        console.error('Error fetching book:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [bookId]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4caf50" />
      </View>
    );
  }

  if (!book) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Book not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>{book.title}</Text>
        <Text style={styles.author}>by {book.author}</Text>
        
        {book.genre && book.genre.length > 0 && (
          <View style={styles.genreContainer}>
            {book.genre.map((genre, index) => (
              <View key={index} style={styles.genreTag}>
                <Text style={styles.genreText}>{genre}</Text>
              </View>
            ))}
          </View>
        )}

        <Text style={styles.sectionTitle}>Description</Text>
        <Text style={styles.description}>{book.description}</Text>

        {book.publishedDate && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Published: </Text>
            <Text style={styles.value}>{book.publishedDate}</Text>
          </View>
        )}

        {book.rating && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Rating: </Text>
            <Text style={styles.value}>{book.rating}/5</Text>
          </View>
        )}

        <View style={styles.readStatus}>
          <Text style={[styles.readStatusText, book.isRead ? styles.read : styles.unread]}>
            {book.isRead ? 'Read' : 'Not Read'}
          </Text>
        </View>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => navigation.navigate('EditBook', { bookId: book.id })}
        >
          <Text style={styles.editButtonText}>Edit Book</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
    color: '#666',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 8,
  },
  author: {
    fontSize: 18,
    color: '#666',
    marginBottom: 16,
  },
  genreContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  genreTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    marginBottom: 8,
  },
  genreText: {
    color: '#666',
    fontSize: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    marginTop: 20,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  infoRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  label: {
    fontSize: 16,
    color: '#666',
    fontWeight: 'bold',
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
  readStatus: {
    marginTop: 20,
    paddingVertical: 10,
  },
  readStatusText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  read: {
    color: '#4caf50',
  },
  unread: {
    color: '#ff9800',
  },
  editButton: {
    backgroundColor: '#4caf50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 