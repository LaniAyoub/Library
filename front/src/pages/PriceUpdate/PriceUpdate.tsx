import React, { useState } from 'react';
import { useUpdateAllPrices } from '@/hooks/useBookApi';
import './PriceUpdate.css';

const PriceUpdate: React.FC = () => {
  const updatePricesMutation = useUpdateAllPrices();
  const [showConfirmation, setShowConfirmation] = useState<boolean>(false);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date | null>(null);

  const handleUpdatePrices = async () => {
    try {
      await updatePricesMutation.mutateAsync();
      setLastUpdateTime(new Date());
      setShowConfirmation(false);
    } catch (error) {
      console.error('Failed to update prices:', error);
    }
  };

  const handleConfirm = () => {
    setShowConfirmation(true);
  };

  const handleCancel = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="price-update">
      <div className="header-section">
        <h1>Bulk Price Update</h1>
        <p className="subtitle">Update all book prices by 10%</p>
      </div>

      <div className="content-container">
        <div className="warning-card">
          <div className="warning-icon">⚠️</div>
          <h3>Important Notice</h3>
          <p>
            This action will increase the price of <strong>ALL books</strong> in the system by 10%. 
            This operation cannot be undone.
          </p>
          <ul className="warning-list">
            <li>All book prices will be multiplied by 1.1 (increased by 10%)</li>
            <li>This affects every book in the database</li>
            <li>The change is permanent and cannot be automatically reversed</li>
            <li>Please ensure this is the intended action</li>
          </ul>
        </div>

        {!showConfirmation ? (
          <div className="action-section">
            <div className="action-card">
              <h3>Ready to Update Prices?</h3>
              <p>Click the button below to start the bulk price update process.</p>
              
              <button
                onClick={handleConfirm}
                className="btn btn-warning btn-lg"
                disabled={updatePricesMutation.isPending}
              >
                {updatePricesMutation.isPending ? 'Processing...' : 'Update All Prices (+10%)'}
              </button>
            </div>
          </div>
        ) : (
          <div className="confirmation-section">
            <div className="confirmation-card">
              <div className="confirmation-icon">❓</div>
              <h3>Confirm Price Update</h3>
              <p>
                Are you absolutely sure you want to increase all book prices by 10%?
              </p>
              <p className="confirmation-warning">
                <strong>This action cannot be undone!</strong>
              </p>
              
              <div className="confirmation-actions">
                <button
                  onClick={handleCancel}
                  className="btn btn-secondary"
                  disabled={updatePricesMutation.isPending}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdatePrices}
                  className="btn btn-danger"
                  disabled={updatePricesMutation.isPending}
                >
                  {updatePricesMutation.isPending ? 'Updating Prices...' : 'Yes, Update Prices'}
                </button>
              </div>
            </div>
          </div>
        )}

        {updatePricesMutation.error && (
          <div className="error-section">
            <div className="error-card">
              <div className="error-icon">❌</div>
              <h3>Update Failed</h3>
              <p>
                Failed to update prices: {(updatePricesMutation.error as Error).message}
              </p>
              <button
                onClick={() => {
                  updatePricesMutation.reset();
                  setShowConfirmation(false);
                }}
                className="btn btn-primary"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {updatePricesMutation.isSuccess && lastUpdateTime && (
          <div className="success-section">
            <div className="success-card">
              <div className="success-icon">✅</div>
              <h3>Prices Updated Successfully!</h3>
              <p>
                All book prices have been increased by 10%.
              </p>
              <p className="update-time">
                Last updated: {lastUpdateTime.toLocaleString()}
              </p>
              <div className="success-actions">
                <button
                  onClick={() => window.location.href = '/books'}
                  className="btn btn-primary"
                >
                  View Updated Books
                </button>
                <button
                  onClick={() => {
                    updatePricesMutation.reset();
                    setLastUpdateTime(null);
                  }}
                  className="btn btn-secondary"
                >
                  Update Prices Again
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="info-section">
          <div className="info-card">
            <h4>How the Price Update Works</h4>
            <div className="info-grid">
              <div className="info-item">
                <h5>Calculation</h5>
                <p>New Price = Current Price × 1.1</p>
              </div>
              <div className="info-item">
                <h5>Example</h5>
                <p>$10.00 → $11.00</p>
              </div>
              <div className="info-item">
                <h5>Rounding</h5>
                <p>Prices are rounded to 2 decimal places</p>
              </div>
              <div className="info-item">
                <h5>Scope</h5>
                <p>Affects all books in the database</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceUpdate;
