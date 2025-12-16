import React, { useState } from 'react';
import { useBooks, useDeleteBook } from '@/hooks/useBookApi';
import { Book } from '@/types';
import './BookList.css';

const BookList: React.FC = () => {
  const { data: books = [], isLoading, error, refetch } = useBooks();
  const deleteBookMutation = useDeleteBook();
  const [deletingIsbn, setDeletingIsbn] = useState<string | null>(null);

  const handleDeleteBook = async (isbn: string) => {
    if (!window.confirm(`Are you sure you want to delete the book with ISBN: ${isbn}?`)) {
      return;
    }

    try {
      setDeletingIsbn(isbn);
      await deleteBookMutation.mutateAsync(isbn);
    } catch (error) {
      console.error('Failed to delete book:', error);
      alert('Failed to delete book. Please try again.');
    } finally {
      setDeletingIsbn(null);
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  if (isLoading) {
    return (
      <div className="book-list">
        <div className="loading">Loading books...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="book-list">
        <div className="error">
          <p>Error loading books: {(error as Error).message}</p>
          <button onClick={handleRefresh} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="book-list">
      <div className="header-section">
        <h1>All Books</h1>
        <div className="actions">
          <button 
            onClick={handleRefresh} 
            className="btn btn-secondary"
            disabled={isLoading}
          >
            {isLoading ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
      </div>

      {books.length === 0 ? (
        <div className="empty-state">
          <p>No books found. Add some books to get started!</p>
        </div>
      ) : (
        <div className="table-container">
          <table className="books-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>ISBN</th>
                <th>Category</th>
                <th>Author</th>
                <th>Publisher</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((book: Book) => (
                <tr key={book.id || book.isbn}>
                  <td className="title-cell">
                    <strong>{book.title}</strong>
                  </td>
                  <td className="isbn-cell">{book.isbn}</td>
                  <td className="category-cell">
                    <span className="category-badge">{book.category}</span>
                  </td>
                  <td className="author-cell">{book.author?.name || 'Unknown'}</td>
                  <td className="publisher-cell">{book.publisher?.name || 'Unknown'}</td>
                  <td className="price-cell">${book.price.toFixed(2)}</td>
                  <td className="quantity-cell">
                    <span className={`quantity-badge ${book.quantity < 5 ? 'low-stock' : ''}`}>
                      {book.quantity}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button
                      onClick={() => handleDeleteBook(book.isbn)}
                      className="btn btn-danger btn-sm"
                      disabled={deletingIsbn === book.isbn}
                    >
                      {deletingIsbn === book.isbn ? 'Deleting...' : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="summary">
        <p>Total books: <strong>{books.length}</strong></p>
      </div>
    </div>
  );
};

export default BookList;
