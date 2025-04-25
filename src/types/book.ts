export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverImage?: string;
  rating?: number;
  publishedDate?: string;
  genre?: string[];
  isRead: boolean;
}

export interface BookList {
  [key: string]: Book;
} 