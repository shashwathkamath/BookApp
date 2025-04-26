import React, { useState, useEffect, useCallback } from 'react';
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
  Platform,
} from 'react-native';
import { Camera, useCameraDevice, useCodeScanner } from 'react-native-vision-camera';
import { RootStackScreenProps } from '../navigation/types';
import { check, PERMISSIONS, request, RESULTS } from 'react-native-permissions';

export default function AddBookScreen({ navigation }: RootStackScreenProps<'AddBook'>) {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [publishedDate, setPublishedDate] = useState('');
  const [genre, setGenre] = useState('');
  const [rating, setRating] = useState('');
  const [isRead, setIsRead] = useState(false);

  const device = useCameraDevice('back');

  const codeScanner = useCodeScanner({
    codeTypes: ['ean-13', 'ean-8'],
    onCodeScanned: (codes) => {
      if (scanned) return;
      const code = codes[0];
      if (code && typeof code.value === 'string') {
        handleBarCodeScanned({ data: code.value });
      }
    }
  });

  useEffect(() => {
    (async () => {
      try {
        const cameraPermission = Platform.select({
          ios: PERMISSIONS.IOS.CAMERA,
          android: PERMISSIONS.ANDROID.CAMERA,
        });

        if (!cameraPermission) {
          console.error('Camera permission not found for platform');
          return;
        }

        const permissionStatus = await check(cameraPermission);
        
        if (permissionStatus === RESULTS.DENIED) {
          const permissionResult = await request(cameraPermission);
          setHasPermission(permissionResult === RESULTS.GRANTED);
        } else {
          setHasPermission(permissionStatus === RESULTS.GRANTED);
        }
      } catch (error) {
        console.error('Error requesting camera permission:', error);
        Alert.alert('Error', 'Failed to access camera. Please check your permissions.');
      }
    })();
  }, []);

  const handleBarCodeScanned = async ({ data }: { data: string }) => {
    if (scanned) return;
    setScanned(true);
    setIsLoading(true);
    
    try {
      // Using Open Library API to fetch book details
      const response = await fetch(`https://openlibrary.org/api/books?bibkeys=ISBN:${data}&format=json&jscmd=data`);
      const result = await response.json();
      
      if (result[`ISBN:${data}`]) {
        const bookData = result[`ISBN:${data}`];
        setTitle(bookData.title || '');
        setAuthor(bookData.authors?.[0]?.name || '');
        setDescription(bookData.subtitle || bookData.notes || '');
        setPublishedDate(bookData.publish_date || '');
        setGenre(bookData.subjects?.join(', ') || '');
      } else {
        Alert.alert('Error', 'Book not found. Please try scanning again or enter details manually.');
      }
    } catch (error) {
      console.error('Error fetching book details:', error);
      Alert.alert('Error', 'Failed to fetch book details. Please try again or enter details manually.');
    } finally {
      setIsLoading(false);
      setShowCamera(false);
    }
  };

  const handleSubmit = () => {
    if (!title.trim() || !author.trim() || !description.trim()) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const newBook = {
      id: Date.now().toString(),
      title: title.trim(),
      author: author.trim(),
      description: description.trim(),
      publishedDate: publishedDate.trim(),
      genre: genre.trim().split(',').map(g => g.trim()).filter(g => g),
      rating: rating ? parseInt(rating, 10) : undefined,
      isRead,
    };

    // We'll add the actual book saving logic later
    console.log('New book:', newBook);
    navigation.goBack();
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4caf50" />
        <Text style={styles.loadingText}>Fetching book details...</Text>
      </View>
    );
  }

  if (showCamera) {
    if (hasPermission === null) {
      return (
        <View style={styles.cameraContainer}>
          <Text style={styles.cameraText}>Requesting camera permission...</Text>
        </View>
      );
    }
    if (hasPermission === false) {
      return (
        <View style={styles.cameraContainer}>
          <Text style={styles.cameraText}>No access to camera</Text>
          <TouchableOpacity
            style={styles.closeCameraButton}
            onPress={() => setShowCamera(false)}
          >
            <Text style={styles.closeCameraButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      );
    }

    if (device == null) {
      return (
        <View style={styles.cameraContainer}>
          <Text style={styles.cameraText}>No camera device found</Text>
          <TouchableOpacity
            style={styles.closeCameraButton}
            onPress={() => setShowCamera(false)}
          >
            <Text style={styles.closeCameraButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.cameraContainer}>
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={true}
          codeScanner={codeScanner}
        />
        <TouchableOpacity
          style={styles.closeCameraButton}
          onPress={() => setShowCamera(false)}
        >
          <Text style={styles.closeCameraButtonText}>Close Camera</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <TouchableOpacity
          style={styles.scanButton}
          onPress={() => {
            setScanned(false);
            setShowCamera(true);
          }}
        >
          <Text style={styles.scanButtonText}>Scan Book ISBN</Text>
        </TouchableOpacity>

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
          maxLength={1}
        />

        <View style={styles.switchContainer}>
          <Text style={styles.label}>Have you read this book?</Text>
          <Switch value={isRead} onValueChange={setIsRead} />
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Add Book</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fafafa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fafafa',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#666',
  },
  form: {
    padding: 24,
  },
  label: {
    fontSize: 14,
    color: '#1a1a1a',
    marginBottom: 8,
    fontWeight: '700',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    opacity: 0.8,
  },
  input: {
    borderWidth: 1.5,
    borderColor: '#e0e0e0',
    borderRadius: 20,
    padding: 16,
    fontSize: 16,
    marginBottom: 20,
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
    transform: [{ scale: 1 }],
  },
  textArea: {
    height: 120,
    textAlignVertical: 'top',
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 24,
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  submitButton: {
    backgroundColor: '#e8f5e9',
    padding: 18,
    borderRadius: 20,
    alignItems: 'center',
    marginTop: 24,
    shadowColor: '#e8f5e9',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    transform: [{ scale: 1 }],
    borderWidth: 0,
    borderColor: 'rgba(232, 245, 233, 0.2)',
  },
  submitButtonText: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  scanButton: {
    backgroundColor: '#e8f5e9',
    padding: 18,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 24,
    shadowColor: '#e8f5e9',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    transform: [{ scale: 1 }],
    borderWidth: 0,
    borderColor: 'rgba(232, 245, 233, 0.2)',
  },
  scanButtonText: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  cameraContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'flex-end',
    backgroundColor: '#000000',
  },
  cameraText: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
  },
  closeCameraButton: {
    backgroundColor: 'rgba(232, 245, 233, 0.95)',
    padding: 18,
    borderRadius: 20,
    alignItems: 'center',
    margin: 24,
    shadowColor: '#e8f5e9',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    transform: [{ scale: 1 }],
    borderWidth: 0,
    borderColor: 'rgba(232, 245, 233, 0.2)',
  },
  closeCameraButtonText: {
    color: '#1a1a1a',
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
}); 