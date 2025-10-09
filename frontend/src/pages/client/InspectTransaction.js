import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiService from '../../utils/api.js';
import { useAuth } from '../../contexts/AuthContext.js';
import { ROUTES } from '../../utils/navigation.js';
import './InspectTransaction.css';

const InspectTransaction = () => {
  const { transactionId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [transaction, setTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTransaction = async () => {
      if (!isAuthenticated()) {
        setError('You must be logged in to view transaction details.');
        setLoading(false);
        return;
      }

      if (!transactionId) {
        setError('No transaction ID provided.');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError('');
        const response = await apiService.getPaymentById(transactionId);
        setTransaction(response);
      } catch (err) {
        console.error('Error fetching transaction:', err);
        
      
      } finally {
        setLoading(false);
      }
    };

    fetchTransaction();
  }, [transactionId, isAuthenticated]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'status-approved';
      case 'rejected':
        return 'status-rejected';
      case 'pending':
        return 'status-pending';
      default:
        return 'status-unknown';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return '✓';
      case 'rejected':
        return '✗';
      case 'pending':
        return '⏳';
      default:
        return '?';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  const formatAmount = (amount, currency = 'USD') => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount);
  };

  const handleGoBack = () => {
    navigate(ROUTES.TRANSACTIONS);
  };

  if (loading) {
    return (
      <div className="inspect-transaction-page">
        <div className="inspect-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading transaction details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="inspect-transaction-page">
        <div className="inspect-container">
          <div className="error-container">
            <div className="error-icon">⚠️</div>
            <h2>Unable to Load Transaction</h2>
            <p>{error}</p>
            <div className="error-actions">
              <button onClick={handleGoBack} className="back-btn">
                Back to Transactions
              </button>
              <button onClick={() => window.location.reload()} className="retry-btn">
                Retry
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!transaction) {
    return (
      <div className="inspect-transaction-page">
        <div className="inspect-container">
          <div className="error-container">
            <div className="error-icon">📄</div>
            <h2>Transaction Not Found</h2>
            <p>The requested transaction could not be found.</p>
            <button onClick={handleGoBack} className="back-btn">
              Back to Transactions
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="inspect-transaction-page">
      <div className="inspect-container">
        {/* Header */}
        <div className="inspect-header">
          <button onClick={handleGoBack} className="back-button">
            ← Back to Transactions
          </button>
          <h1>Transaction Details</h1>
          <p>View complete information for this payment application</p>
        </div>

        {/* Transaction Card */}
        <div className="transaction-detail-card">
          {/* Status Header */}
          <div className="transaction-status-header">
            <div className="transaction-id-section">
              <span className="label">Transaction ID</span>
              <span className="value">{transaction._id || 'N/A'}</span>
            </div>
            <div className={`transaction-status-badge ${getStatusColor(transaction.status)}`}>
              <span className="status-icon">{getStatusIcon(transaction.status)}</span>
              <span className="status-text">{transaction.status || 'Unknown'}</span>
            </div>
          </div>

          {/* Main Details */}
          <section className="detail-section">
            <h2>Payment Information</h2>
            <div className="section-line"></div>
            <div className="details-grid">
              <div className="detail-item">
                <span className="label">Amount</span>
                <span className="value highlight">{formatAmount(transaction.amount, transaction.currency)}</span>
              </div>
              <div className="detail-item">
                <span className="label">Currency</span>
                <span className="value">{transaction.currency || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="label">Payment Provider</span>
                <span className="value">{transaction.paymentProvider || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="label">Submitted Date</span>
                <span className="value">{formatDate(transaction.submittedAt || transaction.createdAt || transaction.date)}</span>
              </div>
            </div>
          </section>

          {/* Recipient Details */}
          <section className="detail-section">
            <h2>Recipient Details</h2>
            <div className="section-line"></div>
            <div className="details-grid">
              <div className="detail-item">
                <span className="label">Recipient Name</span>
                <span className="value">{transaction.recipientName || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="label">Account Number</span>
                <span className="value">{transaction.accountNumber || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="label">SWIFT Code</span>
                <span className="value">{transaction.swiftCode || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="label">Bank/Institution</span>
                <span className="value">{transaction.bankName || 'N/A'}</span>
              </div>
            </div>
          </section>

          {/* Sender Information */}
          <section className="detail-section">
            <h2>Sender Information</h2>
            <div className="section-line"></div>
            <div className="details-grid">
              <div className="detail-item">
                <span className="label">Your Name</span>
                <span className="value">{user?.full_name || user?.username || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="label">Your Account</span>
                <span className="value">{user?.accountNumber || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="label">Application ID</span>
                <span className="value">{transaction.applicationId || transaction._id || 'N/A'}</span>
              </div>
              <div className="detail-item">
                <span className="label">Reference Number</span>
                <span className="value">{transaction.referenceNumber || 'N/A'}</span>
              </div>
            </div>
          </section>

          {/* Processing Information */}
          {(transaction.processedAt || transaction.reviewedBy || transaction.notes) && (
            <section className="detail-section">
              <h2>Processing Information</h2>
              <div className="section-line"></div>
              <div className="details-grid">
                {transaction.processedAt && (
                  <div className="detail-item">
                    <span className="label">Processed Date</span>
                    <span className="value">{formatDate(transaction.processedAt)}</span>
                  </div>
                )}
                {transaction.reviewedBy && (
                  <div className="detail-item">
                    <span className="label">Reviewed By</span>
                    <span className="value">{transaction.reviewedBy}</span>
                  </div>
                )}
                {transaction.estimatedCompletion && (
                  <div className="detail-item">
                    <span className="label">Estimated Completion</span>
                    <span className="value">{formatDate(transaction.estimatedCompletion)}</span>
                  </div>
                )}
                {transaction.fees && (
                  <div className="detail-item">
                    <span className="label">Processing Fees</span>
                    <span className="value">{formatAmount(transaction.fees, transaction.currency)}</span>
                  </div>
                )}
              </div>
              
              {transaction.notes && (
                <div className="transaction-notes">
                  <span className="label">Processing Notes</span>
                  <div className="notes-content">{transaction.notes}</div>
                </div>
              )}
            </section>
          )}

          {/* Actions */}
          <div className="action-buttons">
            <button onClick={handleGoBack} className="secondary-btn">
              Back to Transactions
            </button>
            <button 
              onClick={() => window.print()} 
              className="primary-btn"
            >
              Print Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InspectTransaction;