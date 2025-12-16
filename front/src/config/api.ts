// API Configuration
// In Docker, Nginx proxies /api to backend
// In local dev, Vite proxy forwards to localhost:8080
const API_BASE_URL = import.meta.env.PROD 
  ? ''  // Production: use relative URLs (Nginx handles proxying)
  : 'http://localhost:8080';  // Development: direct to backend

// You can easily change this for different environments
export const getApiBaseUrl = (): string => {
  return import.meta.env.VITE_API_BASE_URL || API_BASE_URL;
};

export const API_ENDPOINTS = {
  BOOKS: {
    SAVE_BOOK: '/api/books/createBook',
    INVENTORY: '/api/books/inventory',
    UPDATE_PRICES: '/api/books/updateBook',
    DELETE_BOOK: '/api/books/DeleteBook',
    DISPLAY_ALL: '/api/books/displayAllBooks',
    SEARCH_TITLE: '/api/books/search/title',
    SEARCH_AUTHOR: '/api/books/search/author',
    SEARCH_ISBN: '/api/books/search/isbn',
    SEARCH_CATEGORY: '/api/books/search/category',
  },
  AUTHORS: {
    BASE: '/api/authors',
    BY_ID: (id: number) => `/api/authors/${id}`,
  },
  PUBLISHERS: {
    BASE: '/api/publishers',
    BY_ID: (id: number) => `/api/publishers/${id}`,
  },
} as const;
