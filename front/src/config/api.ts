// API Configuration
// Supports multiple deployment scenarios:
// 1. Cloud deployment (Railway, Render, etc.) - uses VITE_API_URL env variable
// 2. Docker local - uses relative URLs with Nginx proxy
// 3. Local development - uses localhost:8080

const getApiBaseUrl = (): string => {
  // Priority 1: Explicit API URL from environment (for cloud deployments)
  if (import.meta.env.VITE_API_URL) {
    console.log('Using API URL from environment:', import.meta.env.VITE_API_URL);
    return import.meta.env.VITE_API_URL;
  }
  
  // Priority 2: Production mode (Docker with Nginx proxy)
  if (import.meta.env.PROD) {
    console.log('Production mode: using relative URLs (Nginx proxy)');
    return '';  // Nginx handles proxying
  }
  
  // Priority 3: Development mode
  console.log('Development mode: using localhost:8080');
  return 'http://localhost:8080';
};

// Export the function for dynamic API URL
export { getApiBaseUrl };

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
