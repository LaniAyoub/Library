import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { bookApi, authorApi, publisherApi } from '../api/bookApi';

// Query keys for React Query
export const QUERY_KEYS = {
  BOOKS: 'books',
  INVENTORY: 'inventory',
  AUTHORS: 'authors',
  PUBLISHERS: 'publishers',
  SEARCH_BOOKS: 'search-books',
} as const;

// Hook to fetch all books
export const useBooks = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.BOOKS],
    queryFn: bookApi.getAllBooks,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// Hook to get inventory by category
export const useInventory = (category: string, enabled = true) => {
  return useQuery({
    queryKey: [QUERY_KEYS.INVENTORY, category],
    queryFn: () => bookApi.getInventoryByCategory(category),
    enabled: enabled && !!category,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });
};

// Hook to create a book
export const useCreateBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bookApi.createBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BOOKS] });
    },
  });
};

// Hook to save a book (simple version)
export const useSaveBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bookApi.saveBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BOOKS] });
    },
  });
};

// Hook to update all prices
export const useUpdateAllPrices = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bookApi.updateAllPrices,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BOOKS] });
    },
  });
};

// Hook to delete a book
export const useDeleteBook = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: bookApi.deleteBookByIsbn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.BOOKS] });
    },
  });
};

// Search hooks
export const useSearchBooksByTitle = (title: string, enabled = false) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_BOOKS, 'title', title],
    queryFn: () => bookApi.searchByTitle(title),
    enabled: enabled && !!title,
    staleTime: 1 * 60 * 1000,
  });
};

export const useSearchBooksByAuthor = (authorName: string, enabled = false) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_BOOKS, 'author', authorName],
    queryFn: () => bookApi.searchByAuthor(authorName),
    enabled: enabled && !!authorName,
    staleTime: 1 * 60 * 1000,
  });
};

export const useSearchBookByIsbn = (isbn: string, enabled = false) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_BOOKS, 'isbn', isbn],
    queryFn: () => bookApi.searchByIsbn(isbn),
    enabled: enabled && !!isbn,
    staleTime: 1 * 60 * 1000,
  });
};

export const useSearchBooksByCategory = (category: string, enabled = false) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SEARCH_BOOKS, 'category', category],
    queryFn: () => bookApi.searchByCategory(category),
    enabled: enabled && !!category,
    staleTime: 1 * 60 * 1000,
  });
};

// Author hooks
export const useAuthors = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.AUTHORS],
    queryFn: authorApi.getAllAuthors,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreateAuthor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authorApi.createAuthor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.AUTHORS] });
    },
  });
};

export const useDeleteAuthor = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: authorApi.deleteAuthor,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.AUTHORS] });
    },
  });
};

// Publisher hooks
export const usePublishers = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.PUBLISHERS],
    queryFn: publisherApi.getAllPublishers,
    staleTime: 5 * 60 * 1000,
  });
};

export const useCreatePublisher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: publisherApi.createPublisher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PUBLISHERS] });
    },
  });
};

export const useDeletePublisher = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: publisherApi.deletePublisher,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.PUBLISHERS] });
    },
  });
};
