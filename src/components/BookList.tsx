import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import BookCard from './BookCard';

interface Book {
  id: string;
  title: string;
  author: string;
  coverImage: string;
  price?: number;
  isForSale?: boolean;
}

interface BookListProps {
  title: string;
  books: Book[];
}

export default function BookList({ title, books }: BookListProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {books.map((book) => (
          <BookCard
            key={book.id}
            id={book.id}
            title={book.title}
            author={book.author}
            coverImage={book.coverImage}
            price={book.price}
            isForSale={book.isForSale}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: 10,
    marginLeft: 15,
  },
  scrollContent: {
    paddingHorizontal: 15,
  },
}); 