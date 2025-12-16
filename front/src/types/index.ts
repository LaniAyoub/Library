// Author entity
export interface Author {
  id?: number;
  name: string;
  email?: string;
}

// Publisher entity
export interface Publisher {
  id?: number;
  name: string;
  address?: string;
  adress?: string; // Backend uses 'adress' (typo)
}

// Tag entity
export interface Tag {
  id?: number;
  name: string;
}

// Main Book entity
export interface Book {
  id?: number;
  title: string;
  isbn: string;
  price: number;
  quantity: number;
  category: string;
  author: Author;
  publisher: Publisher;
  tags?: Tag[];
}

// DTO for creating a book
export interface CreateBookRequest {
  title: string;
  isbn: string;
  price: number;
  quantity: number;
  category: string;
  authorName: string;
  publisherName: string;
  tagNames?: string[];
}

// DTO for creating an author
export interface CreateAuthorRequest {
  name: string;
  email: string;
}

// DTO for creating a publisher
export interface CreatePublisherRequest {
  name: string;
  address: string;
}

// API response types
export interface ApiError {
  message: string;
  status?: number;
}

export interface InventoryResponse {
  count: number;
  category: string;
}
