import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RootStackScreenProps } from '../navigation/types';
import { PLACEHOLDER_IMAGES } from '../assets/placeholders';

interface BookCardProps {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  price?: number;
  isForSale?: boolean;
}

export default function BookCard({ id, title, author, coverImage, price, isForSale }: BookCardProps) {
  const navigation = useNavigation<RootStackScreenProps<'BookDetails'>['navigation']>();

  return (
    <TouchableOpacity 
      style={styles.container}
      onPress={() => navigation.navigate('BookDetails', { bookId: id })}
    >
      <Image 
        source={{ uri: coverImage || PLACEHOLDER_IMAGES.book }} 
        style={styles.coverImage}
      />
      <View style={styles.details}>
        <Text style={styles.title} numberOfLines={2}>{title}</Text>
        <Text style={styles.author}>{author}</Text>
        {isForSale && price && (
          <Text style={styles.price}>${price.toFixed(2)}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 150,
    marginRight: 15,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  coverImage: {
    width: '100%',
    height: 200,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
  },
  details: {
    padding: 10,
  },
  title: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  author: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  price: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#4caf50',
  },
}); 