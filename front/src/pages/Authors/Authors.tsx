import React, { useState } from 'react';
import { useAuthors, useCreateAuthor, useDeleteAuthor } from '../../hooks/useBookApi';
import './Authors.css';

const Authors: React.FC = () => {
  const { data: authors, isLoading, error, refetch } = useAuthors();
  const createAuthorMutation = useCreateAuthor();
  const deleteAuthorMutation = useDeleteAuthor();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
  });
  const [formError, setFormError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim()) {
      setFormError('All fields are required');
      return;
    }

    try {
      await createAuthorMutation.mutateAsync(formData);
      setFormData({ name: '', email: '' });
      setIsFormOpen(false);
      setFormError('');
    } catch (err: any) {
      setFormError(err.message || 'Failed to create author');
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete author "${name}"?`)) {
      try {
        await deleteAuthorMutation.mutateAsync(id);
      } catch (err: any) {
        alert(err.message || 'Failed to delete author');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="authors-page">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading authors...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="authors-page">
        <div className="error-container">
          <h2>Error Loading Authors</h2>
          <p>{(error as any).message}</p>
          <button onClick={() => refetch()} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="authors-page">
      <div className="page-header">
        <h1>Authors Management</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setIsFormOpen(!isFormOpen)}
        >
          {isFormOpen ? '✕ Cancel' : '+ Add New Author'}
        </button>
      </div>

      {isFormOpen && (
        <div className="form-card">
          <h2>Add New Author</h2>
          <form onSubmit={handleSubmit}>
            {formError && <div className="form-error">{formError}</div>}
            
            <div className="form-group">
              <label htmlFor="name">Author Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter author name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="author@example.com"
                required
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setIsFormOpen(false);
                  setFormData({ name: '', email: '' });
                  setFormError('');
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={createAuthorMutation.isPending}
              >
                {createAuthorMutation.isPending ? 'Creating...' : 'Create Author'}
              </button>
            </div>
          </form>
        </div>
      )}

      {authors && authors.length === 0 ? (
        <div className="empty-state">
          <p>No authors found. Add your first author to get started!</p>
        </div>
      ) : (
        <div className="authors-grid">
          {authors?.map((author) => (
            <div key={author.id} className="author-card">
              <div className="author-info">
                <h3>{author.name}</h3>
                <p className="author-email">{author.email}</p>
                <span className="author-id">ID: {author.id}</span>
              </div>
              <div className="author-actions">
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(author.id!, author.name)}
                  disabled={deleteAuthorMutation.isPending}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Authors;
