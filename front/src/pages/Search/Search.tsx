import React, { useState } from 'react';
import { Book } from '../../types';
import { bookApi } from '../../api/bookApi';
import './Search.css';

type SearchType = 'title' | 'author' | 'isbn' | 'category';

const Search: React.FC = () => {
  const [searchType, setSearchType] = useState<SearchType>('title');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Book[] | Book | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      setError('Please enter a search query');
      return;
    }

    setIsLoading(true);
    setError('');
    setSearchResults(null);

    try {
      let results;
      
      switch (searchType) {
        case 'title':
          results = await bookApi.searchByTitle(searchQuery);
          break;
        case 'author':
          results = await bookApi.searchByAuthor(searchQuery);
          break;
        case 'isbn':
          results = await bookApi.searchByIsbn(searchQuery);
          break;
        case 'category':
          results = await bookApi.searchByCategory(searchQuery);
          break;
        default:
          results = [];
      }

      setSearchResults(results);
    } catch (err: any) {
      setError(err.message || 'Failed to search books');
      setSearchResults(null);
    } finally {
      setIsLoading(false);
    }
  };

  const renderResults = () => {
    if (!searchResults) return null;

    const results = Array.isArray(searchResults) ? searchResults : [searchResults];

    if (results.length === 0) {
      return (
        <div className="no-results">
          <p>No books found matching your search criteria.</p>
        </div>
      );
    }

    return (
      <div className="search-results">
        <h2>Search Results ({results.length} {results.length === 1 ? 'book' : 'books'} found)</h2>
        <div className="books-grid">
          {results.map((book: Book) => (
            <div key={book.id} className="book-card">
              <div className="book-header">
                <h3>{book.title}</h3>
                <span className="category-badge">{book.category}</span>
              </div>
              <div className="book-details">
                <div className="detail-row">
                  <span className="label">ISBN:</span>
                  <span className="value isbn">{book.isbn}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Author:</span>
                  <span className="value">{book.author.name}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Publisher:</span>
                  <span className="value">{book.publisher.name}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Price:</span>
                  <span className="value price">${book.price.toFixed(2)}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Quantity:</span>
                  <span className={`value quantity ${book.quantity < 5 ? 'low-stock' : ''}`}>
                    {book.quantity} {book.quantity < 5 && '⚠️'}
                  </span>
                </div>
                {book.tags && book.tags.length > 0 && (
                  <div className="tags">
                    {book.tags.map((tag: any) => (
                      <span key={tag.id} className="tag">{tag.name}</span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="search-page">
      <div className="search-header">
        <h1>🔍 Search Books</h1>
        <p>Find books by title, author, ISBN, or category</p>
      </div>

      <div className="search-container">
        <form onSubmit={handleSearch} className="search-form">
          <div className="search-type-selector">
            <label>Search by:</label>
            <div className="radio-group">
              <label className="radio-label">
                <input
                  type="radio"
                  value="title"
                  checked={searchType === 'title'}
                  onChange={(e) => setSearchType(e.target.value as SearchType)}
                />
                <span>Title</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  value="author"
                  checked={searchType === 'author'}
                  onChange={(e) => setSearchType(e.target.value as SearchType)}
                />
                <span>Author</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  value="isbn"
                  checked={searchType === 'isbn'}
                  onChange={(e) => setSearchType(e.target.value as SearchType)}
                />
                <span>ISBN</span>
              </label>
              <label className="radio-label">
                <input
                  type="radio"
                  value="category"
                  checked={searchType === 'category'}
                  onChange={(e) => setSearchType(e.target.value as SearchType)}
                />
                <span>Category</span>
              </label>
            </div>
          </div>

          <div className="search-input-group">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setError('');
              }}
              placeholder={`Enter ${searchType}...`}
              className="search-input"
            />
            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              {isLoading ? 'Searching...' : 'Search'}
            </button>
          </div>

          {error && <div className="search-error">{error}</div>}
        </form>
      </div>

      {isLoading && (
        <div className="loading">
          <div className="spinner"></div>
          <p>Searching...</p>
        </div>
      )}

      {!isLoading && renderResults()}
    </div>
  );
};

export default Search;
