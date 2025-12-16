import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import BookList from '@/pages/BookList';
import CreateBook from '@/pages/CreateBook';
import Inventory from '@/pages/Inventory';
import PriceUpdate from '@/pages/PriceUpdate';
import Authors from '@/pages/Authors';
import Publishers from '@/pages/Publishers';
import Search from '@/pages/Search';
import './App.css';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

const App: React.FC = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/books" replace />} />
            <Route path="/books" element={<BookList />} />
            <Route path="/books/new" element={<CreateBook />} />
            <Route path="/search" element={<Search />} />
            <Route path="/authors" element={<Authors />} />
            <Route path="/publishers" element={<Publishers />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/admin/price-update" element={<PriceUpdate />} />
            <Route path="*" element={<Navigate to="/books" replace />} />
          </Routes>
        </Layout>
      </Router>
    </QueryClientProvider>
  );
};

export default App;
