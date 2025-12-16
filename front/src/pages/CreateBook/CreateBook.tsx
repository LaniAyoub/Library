import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateBook } from '@/hooks/useBookApi';
import { CreateBookRequest } from '@/types';
import './CreateBook.css';

interface FormData {
  title: string;
  isbn: string;
  price: string;
  quantity: string;
  category: string;
  authorName: string;
  publisherName: string;
  tagNames: string;
}

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

const CreateBook: React.FC = () => {
  const navigate = useNavigate();
  const createBookMutation = useCreateBook();
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    isbn: '',
    price: '',
    quantity: '',
    category: '',
    authorName: '',
    publisherName: '',
    tagNames: '',
  });

  const [errors, setErrors] = useState<Partial<FormData>>({});
  const [submitError, setSubmitError] = useState<string>('');

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.isbn.trim()) {
      newErrors.isbn = 'ISBN is required';
    } else if (!/^\d{2}-\d{3}-\d{3}$/.test(formData.isbn)) {
      newErrors.isbn = 'Invalid ISBN format. Must be xx-xxx-xxx';
    }

    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
      newErrors.price = 'Price must be a positive number';
    }

    if (!formData.quantity.trim()) {
      newErrors.quantity = 'Quantity is required';
    } else if (isNaN(Number(formData.quantity)) || Number(formData.quantity) < 0) {
      newErrors.quantity = 'Quantity must be a non-negative integer';
    }

    if (!formData.category) {
      newErrors.category = 'Category is required';
    }

    if (!formData.authorName.trim()) {
      newErrors.authorName = 'Author name is required';
    }

    if (!formData.publisherName.trim()) {
      newErrors.publisherName = 'Publisher name is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError('');

    if (!validateForm()) {
      return;
    }

    try {
      const request: CreateBookRequest = {
        title: formData.title.trim(),
        isbn: formData.isbn.trim(),
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        category: formData.category,
        authorName: formData.authorName.trim(),
        publisherName: formData.publisherName.trim(),
        tagNames: formData.tagNames
          ? formData.tagNames.split(',').map(tag => tag.trim()).filter(Boolean)
          : []
      };

      await createBookMutation.mutateAsync(request);
      
      // Success - navigate back to books list
      navigate('/books');
    } catch (error) {
      setSubmitError((error as Error).message || 'Failed to create book. Please try again.');
    }
  };

  const handleCancel = () => {
    navigate('/books');
  };

  return (
    <div className="create-book">
      <div className="header-section">
        <h1>Add New Book</h1>
      </div>

      <div className="form-container">
        <form onSubmit={handleSubmit} className="book-form">
          {submitError && (
            <div className="error-message">
              {submitError}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Title <span className="required">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`form-input ${errors.title ? 'error' : ''}`}
              placeholder="Enter book title"
            />
            {errors.title && <span className="field-error">{errors.title}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="isbn" className="form-label">
              ISBN <span className="required">*</span>
            </label>
            <input
              type="text"
              id="isbn"
              name="isbn"
              value={formData.isbn}
              onChange={handleInputChange}
              className={`form-input ${errors.isbn ? 'error' : ''}`}
              placeholder="e.g., 00-000-000"
            />
            {errors.isbn && <span className="field-error">{errors.isbn}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="price" className="form-label">
                Price <span className="required">*</span>
              </label>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                className={`form-input ${errors.price ? 'error' : ''}`}
                placeholder="0.00"
                step="0.01"
                min="0"
              />
              {errors.price && <span className="field-error">{errors.price}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="quantity" className="form-label">
                Quantity <span className="required">*</span>
              </label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                className={`form-input ${errors.quantity ? 'error' : ''}`}
                placeholder="0"
                min="0"
              />
              {errors.quantity && <span className="field-error">{errors.quantity}</span>}
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="category" className="form-label">
              Category <span className="required">*</span>
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className={`form-select ${errors.category ? 'error' : ''}`}
            >
              <option value="">Select a category</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && <span className="field-error">{errors.category}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="authorName" className="form-label">
              Author Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="authorName"
              name="authorName"
              value={formData.authorName}
              onChange={handleInputChange}
              className={`form-input ${errors.authorName ? 'error' : ''}`}
              placeholder="Enter author's full name"
            />
            {errors.authorName && <span className="field-error">{errors.authorName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="publisherName" className="form-label">
              Publisher Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="publisherName"
              name="publisherName"
              value={formData.publisherName}
              onChange={handleInputChange}
              className={`form-input ${errors.publisherName ? 'error' : ''}`}
              placeholder="Enter publisher name"
            />
            {errors.publisherName && <span className="field-error">{errors.publisherName}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="tagNames" className="form-label">
              Tags (optional)
            </label>
            <input
              type="text"
              id="tagNames"
              name="tagNames"
              value={formData.tagNames}
              onChange={handleInputChange}
              className="form-input"
              placeholder="Enter tags separated by commas (e.g., bestseller, award-winning)"
            />
            <small className="form-help">Separate multiple tags with commas</small>
          </div>

          <div className="form-actions">
            <button
              type="button"
              onClick={handleCancel}
              className="btn btn-secondary"
              disabled={createBookMutation.isPending}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={createBookMutation.isPending}
            >
              {createBookMutation.isPending ? 'Creating...' : 'Create Book'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBook;
