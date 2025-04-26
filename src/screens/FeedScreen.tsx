import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { PLACEHOLDER_IMAGES } from '../assets/placeholders';

type BookListing = {
  id: string;
  title: string;
  author: string;
  price: number;
  condition: string;
  seller: string;
  image?: string;
};

export default function FeedScreen() {
  // Dummy data - replace with real data later
  const listings: BookListing[] = [
    {
      id: '1',
      title: 'The Great Gatsby',
      author: 'F. Scott Fitzgerald',
      price: 8.99,
      condition: 'Good',
      seller: 'John Doe',
      image: undefined,
    },
    {
      id: '2',
      title: 'To Kill a Mockingbird',
      author: 'Harper Lee',
      price: 10.99,
      condition: 'Like New',
      seller: 'Jane Smith',
      image: undefined,
    },
    // Add more dummy data here
  ];

  const renderItem = ({ item }: { item: BookListing }) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          source={item.image ? { uri: item.image } : { uri: PLACEHOLDER_IMAGES.book }}
          style={styles.image}
        />
      </View>
      <View style={styles.details}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.author}>by {item.author}</Text>
        <Text style={styles.price}>${item.price.toFixed(2)}</Text>
        <Text style={styles.condition}>Condition: {item.condition}</Text>
        <Text style={styles.seller}>Seller: {item.seller}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={listings}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  imageContainer: {
    width: 120,
    height: 160,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  details: {
    flex: 1,
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  author: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#f4511e',
    marginBottom: 8,
  },
  condition: {
    fontSize: 14,
    color: '#444',
    marginBottom: 4,
  },
  seller: {
    fontSize: 14,
    color: '#666',
  },
}); 