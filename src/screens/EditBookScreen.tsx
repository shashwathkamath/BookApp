import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { RootStackScreenProps } from '../navigation/types';
import { Book } from '../types/book';

export default function EditBookScreen({ 
  route,
  navigation 
}: RootStackScreenProps<'EditBook'>) {
  const { bookId } = route.params;
  const [loading, setLoading] = useState(true);
  const [book, setBook] = useState<Book | null>(null);

  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [publishedDate, setPublishedDate] = useState('');
  const [genre, setGenre] = useState('');
  const [rating, setRating] = useState('');
  const [isRead, setIsRead] = useState(false);

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
        setTitle(mockBook.title);
        setAuthor(mockBook.author);
        setDescription(mockBook.description);
        setPublishedDate(mockBook.publishedDate || '');
        setGenre(mockBook.genre?.join(', ') || '');
        setRating(mockBook.rating?.toString() || '');
        setIsRead(mockBook.isRead);
      } catch (error) {
        console.error('Error fetching book:', error);
        Alert.alert('Error', 'Failed to load book details');
      } finally {
        setLoading(false);
      }
    };

    fetchBook();
  }, [bookId]);

  const handleSubmit = () => {
    if (!title.trim() || !author.trim() || !description.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const updatedBook: Book = {
      id: bookId,
      title: title.trim(),
      author: author.trim(),
      description: description.trim(),
      publishedDate: publishedDate.trim(),
      genre: genre.trim().split(',').map(g => g.trim()).filter(g => g),
      rating: rating ? parseFloat(rating) : undefined,
      isRead,
    };

    // TODO: Implement actual book update logic
    console.log('Updated book:', updatedBook);
    navigation.goBack();
  };

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
      <View style={styles.form}>
        <Text style={styles.label}>Title *</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter book title"
        />

        <Text style={styles.label}>Author *</Text>
        <TextInput
          style={styles.input}
          value={author}
          onChangeText={setAuthor}
          placeholder="Enter author name"
        />

        <Text style={styles.label}>Description *</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Enter book description"
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>Published Date</Text>
        <TextInput
          style={styles.input}
          value={publishedDate}
          onChangeText={setPublishedDate}
          placeholder="YYYY-MM-DD"
        />

        <Text style={styles.label}>Genres (comma-separated)</Text>
        <TextInput
          style={styles.input}
          value={genre}
          onChangeText={setGenre}
          placeholder="Fiction, Fantasy, Adventure"
        />

        <Text style={styles.label}>Rating (1-5)</Text>
        <TextInput
          style={styles.input}
          value={rating}
          onChangeText={setRating}
          placeholder="Enter rating"
          keyboardType="numeric"
        />

        <View style={styles.switchContainer}>
          <Text style={styles.label}>Read Status</Text>
          <Switch
            value={isRead}
            onValueChange={setIsRead}
            trackColor={{ false: '#767577', true: '#81b0ff' }}
            thumbColor={isRead ? '#4caf50' : '#f4f4f4'}
          />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Save Changes</Text>
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
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  submitButton: {
    backgroundColor: '#4caf50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 