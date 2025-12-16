import axios, { AxiosResponse } from 'axios';
import { Book, CreateBookRequest, ApiError, Author, CreateAuthorRequest, Publisher, CreatePublisherRequest } from '@/types';
import { getApiBaseUrl, API_ENDPOINTS } from '@/config/api';

// Create axios instance with base configuration
const apiClient = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for adding auth headers if needed
apiClient.interceptors.request.use(
  (config) => {
    // Add authorization header if token exists
    // const token = localStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    const apiError: ApiError = {
      message: error.response?.data?.message || error.message || 'An unknown error occurred',
      status: error.response?.status,
    };
    return Promise.reject(apiError);
  }
);

// Book API functions
export const bookApi = {
  // Get all books
  getAllBooks: async (): Promise<Book[]> => {
    const response = await apiClient.get<Book[]>(API_ENDPOINTS.BOOKS.DISPLAY_ALL);
    return response.data;
  },

  // Save book (simple)
  saveBook: async (book: Book): Promise<void> => {
    await apiClient.post(API_ENDPOINTS.BOOKS.SAVE_BOOK, book);
  },

  // Create book (now using SAVE_BOOK endpoint)
  createBook: async (request: CreateBookRequest): Promise<Book> => {
    const response = await apiClient.post<Book>(API_ENDPOINTS.BOOKS.SAVE_BOOK, request);
    return response.data;
  },

  // Get inventory count by category
  getInventoryByCategory: async (category: string): Promise<number> => {
    const response = await apiClient.get<number>(API_ENDPOINTS.BOOKS.INVENTORY, {
      params: { category },
    });
    return response.data;
  },

  // Update all book prices by 10%
  updateAllPrices: async (): Promise<void> => {
    await apiClient.put(API_ENDPOINTS.BOOKS.UPDATE_PRICES);
  },

  // Delete book by ISBN
  deleteBookByIsbn: async (isbn: string): Promise<void> => {
    await apiClient.delete(`${API_ENDPOINTS.BOOKS.DELETE_BOOK}/${isbn}`);
  },

  // Search books by title
  searchByTitle: async (title: string): Promise<Book[]> => {
    const response = await apiClient.get<Book[]>(API_ENDPOINTS.BOOKS.SEARCH_TITLE, {
      params: { title },
    });
    return response.data;
  },

  // Search books by author
  searchByAuthor: async (authorName: string): Promise<Book[]> => {
    const response = await apiClient.get<Book[]>(API_ENDPOINTS.BOOKS.SEARCH_AUTHOR, {
      params: { authorName },
    });
    return response.data;
  },

  // Search book by ISBN
  searchByIsbn: async (isbn: string): Promise<Book> => {
    const response = await apiClient.get<Book>(API_ENDPOINTS.BOOKS.SEARCH_ISBN, {
      params: { isbn },
    });
    return response.data;
  },

  // Search books by category
  searchByCategory: async (category: string): Promise<Book[]> => {
    const response = await apiClient.get<Book[]>(API_ENDPOINTS.BOOKS.SEARCH_CATEGORY, {
      params: { category },
    });
    return response.data;
  },
};

// Author API functions
export const authorApi = {
  // Get all authors
  getAllAuthors: async (): Promise<Author[]> => {
    const response = await apiClient.get<Author[]>(API_ENDPOINTS.AUTHORS.BASE);
    return response.data;
  },

  // Get author by ID
  getAuthorById: async (id: number): Promise<Author> => {
    const response = await apiClient.get<Author>(API_ENDPOINTS.AUTHORS.BY_ID(id));
    return response.data;
  },

  // Create author
  createAuthor: async (request: CreateAuthorRequest): Promise<Author> => {
    const response = await apiClient.post<Author>(API_ENDPOINTS.AUTHORS.BASE, request);
    return response.data;
  },

  // Delete author
  deleteAuthor: async (id: number): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.AUTHORS.BY_ID(id));
  },
};

// Publisher API functions
export const publisherApi = {
  // Get all publishers
  getAllPublishers: async (): Promise<Publisher[]> => {
    const response = await apiClient.get<Publisher[]>(API_ENDPOINTS.PUBLISHERS.BASE);
    return response.data;
  },

  // Get publisher by ID
  getPublisherById: async (id: number): Promise<Publisher> => {
    const response = await apiClient.get<Publisher>(API_ENDPOINTS.PUBLISHERS.BY_ID(id));
    return response.data;
  },

  // Create publisher
  createPublisher: async (request: CreatePublisherRequest): Promise<Publisher> => {
    const response = await apiClient.post<Publisher>(API_ENDPOINTS.PUBLISHERS.BASE, request);
    return response.data;
  },

  // Delete publisher
  deletePublisher: async (id: number): Promise<void> => {
    await apiClient.delete(API_ENDPOINTS.PUBLISHERS.BY_ID(id));
  },
};

export default apiClient;
