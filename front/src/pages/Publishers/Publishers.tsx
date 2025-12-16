import React, { useState } from 'react';
import { usePublishers, useCreatePublisher, useDeletePublisher } from '../../hooks/useBookApi';
import './Publishers.css';

const Publishers: React.FC = () => {
  const { data: publishers, isLoading, error, refetch } = usePublishers();
  const createPublisherMutation = useCreatePublisher();
  const deletePublisherMutation = useDeletePublisher();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    address: '',
  });
  const [formError, setFormError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.address.trim()) {
      setFormError('All fields are required');
      return;
    }

    try {
      await createPublisherMutation.mutateAsync(formData);
      setFormData({ name: '', address: '' });
      setIsFormOpen(false);
      setFormError('');
    } catch (err: any) {
      setFormError(err.message || 'Failed to create publisher');
    }
  };

  const handleDelete = async (id: number, name: string) => {
    if (window.confirm(`Are you sure you want to delete publisher "${name}"?`)) {
      try {
        await deletePublisherMutation.mutateAsync(id);
      } catch (err: any) {
        alert(err.message || 'Failed to delete publisher');
      }
    }
  };

  if (isLoading) {
    return (
      <div className="publishers-page">
        <div className="loading">
          <div className="spinner"></div>
          <p>Loading publishers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="publishers-page">
        <div className="error-container">
          <h2>Error Loading Publishers</h2>
          <p>{(error as any).message}</p>
          <button onClick={() => refetch()} className="btn btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="publishers-page">
      <div className="page-header">
        <h1>Publishers Management</h1>
        <button 
          className="btn btn-primary"
          onClick={() => setIsFormOpen(!isFormOpen)}
        >
          {isFormOpen ? '✕ Cancel' : '+ Add New Publisher'}
        </button>
      </div>

      {isFormOpen && (
        <div className="form-card">
          <h2>Add New Publisher</h2>
          <form onSubmit={handleSubmit}>
            {formError && <div className="form-error">{formError}</div>}
            
            <div className="form-group">
              <label htmlFor="name">Publisher Name *</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter publisher name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Address *</label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                placeholder="Enter publisher address"
                rows={3}
                required
              />
            </div>

            <div className="form-actions">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => {
                  setIsFormOpen(false);
                  setFormData({ name: '', address: '' });
                  setFormError('');
                }}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={createPublisherMutation.isPending}
              >
                {createPublisherMutation.isPending ? 'Creating...' : 'Create Publisher'}
              </button>
            </div>
          </form>
        </div>
      )}

      {publishers && publishers.length === 0 ? (
        <div className="empty-state">
          <p>No publishers found. Add your first publisher to get started!</p>
        </div>
      ) : (
        <div className="publishers-grid">
          {publishers?.map((publisher: any) => (
            <div key={publisher.id} className="publisher-card">
              <div className="publisher-info">
                <h3>{publisher.name}</h3>
                <p className="publisher-address">{publisher.address || publisher.adress}</p>
                <span className="publisher-id">ID: {publisher.id}</span>
              </div>
              <div className="publisher-actions">
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDelete(publisher.id!, publisher.name)}
                  disabled={deletePublisherMutation.isPending}
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

export default Publishers;
