import React, { useState } from 'react';
import { useInventory } from '@/hooks/useBookApi';
import './Inventory.css';

const CATEGORIES = [
  'Fiction',
  'Non-Fiction',
  'Science',
  'Technology',
  'History',
  'Biography',
  'Children',
  'Education',
  'Business',
  'Health',
  'Other'
];

const Inventory: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [searchTriggered, setSearchTriggered] = useState<boolean>(false);
  
  const { 
    data: count, 
    isLoading, 
    error, 
    refetch 
  } = useInventory(selectedCategory, searchTriggered && !!selectedCategory);

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setSearchTriggered(false); // Reset search state when category changes
  };

  const handleSearch = () => {
    if (!selectedCategory) {
      alert('Please select a category first.');
      return;
    }
    setSearchTriggered(true);
  };

  const handleRefresh = () => {
    if (selectedCategory && searchTriggered) {
      refetch();
    }
  };

  return (
    <div className="inventory">
      <div className="header-section">
        <h1>Book Inventory</h1>
        <p className="subtitle">Check book count by category</p>
      </div>

      <div className="search-container">
        <div className="search-form">
          <div className="form-group">
            <label htmlFor="category" className="form-label">
              Select Category:
            </label>
            <select
              id="category"
              value={selectedCategory}
              onChange={handleCategoryChange}
              className="form-select"
            >
              <option value="">-- Choose a category --</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="search-actions">
            <button
              onClick={handleSearch}
              className="btn btn-primary"
              disabled={!selectedCategory || isLoading}
            >
              {isLoading ? 'Searching...' : 'Search'}
            </button>
            
            {searchTriggered && selectedCategory && (
              <button
                onClick={handleRefresh}
                className="btn btn-secondary"
                disabled={isLoading}
              >
                Refresh
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="results-container">
        {error && searchTriggered && (
          <div className="error-message">
            <h3>Error</h3>
            <p>Failed to fetch inventory: {(error as Error).message}</p>
            <button onClick={handleRefresh} className="btn btn-primary btn-sm">
              Try Again
            </button>
          </div>
        )}

        {searchTriggered && selectedCategory && !error && (
          <div className="results">
            <div className="result-card">
              <div className="result-header">
                <h3>Inventory Results</h3>
                <span className="category-name">{selectedCategory}</span>
              </div>
              
              <div className="result-content">
                {isLoading ? (
                  <div className="loading-state">
                    <div className="spinner"></div>
                    <p>Loading inventory count...</p>
                  </div>
                ) : (
                  <div className="count-display">
                    <div className="count-number">{count ?? 0}</div>
                    <div className="count-label">
                      {count === 1 ? 'Book' : 'Books'} in {selectedCategory}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {!searchTriggered && (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h3>Ready to Search</h3>
            <p>Select a category and click "Search" to see the inventory count for that category.</p>
          </div>
        )}
      </div>

      <div className="info-section">
        <div className="info-card">
          <h4>About Inventory Search</h4>
          <ul>
            <li>Select any category from the dropdown menu</li>
            <li>Click "Search" to get the current book count for that category</li>
            <li>Use "Refresh" to update the count with the latest data</li>
            <li>The count includes all books currently in stock for the selected category</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Inventory;
