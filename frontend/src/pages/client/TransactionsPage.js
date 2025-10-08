import React, { useState, useEffect } from 'react';
import apiService from '../../utils/api.js';
import './TransactionsPage.css';

const TransactionsPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all'); // all, pending, approved, rejected

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await apiService.getMyPayments();
      // The API returns { message: "...", applications: [...] }
      setTransactions(response.applications || []);
    } catch (err) {
      setError('Failed to load transactions. Please try again.');
      console.error('Error fetching transactions:', err);
      setTransactions([]); // Ensure transactions is always an array
    } finally {
      setLoading(false);
    }
  };

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
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
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

  const filteredTransactions = transactions.filter(transaction => {
    if (filter === 'all') return true;
    return transaction.status?.toLowerCase() === filter;
  });

  if (loading) {
    return (
      <div className="transactions-page">
        <div className="transactions-container">
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Loading your transactions...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="transactions-page">
      <div className="transactions-container">
        <div className="transactions-header">
          <h1>My Transactions</h1>
          <p>View and track your payment history</p>
        </div>

        {error && (
          <div className="error-banner">
            <span>{error}</span>
            <button onClick={fetchTransactions} className="retry-btn">
              Retry
            </button>
          </div>
        )}

        <div className="transactions-controls">
          <div className="filter-tabs">
            <button 
              className={`filter-tab ${filter === 'all' ? 'active' : ''}`}
              onClick={() => setFilter('all')}
            >
              All ({transactions.length})
            </button>
            <button 
              className={`filter-tab ${filter === 'pending' ? 'active' : ''}`}
              onClick={() => setFilter('pending')}
            >
              Pending ({transactions.filter(t => t.status?.toLowerCase() === 'pending').length})
            </button>
            <button 
              className={`filter-tab ${filter === 'approved' ? 'active' : ''}`}
              onClick={() => setFilter('approved')}
            >
              Approved ({transactions.filter(t => t.status?.toLowerCase() === 'approved').length})
            </button>
            <button 
              className={`filter-tab ${filter === 'rejected' ? 'active' : ''}`}
              onClick={() => setFilter('rejected')}
            >
              Rejected ({transactions.filter(t => t.status?.toLowerCase() === 'rejected').length})
            </button>
          </div>
        </div>

        <div className="transactions-content">
          {filteredTransactions.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No transactions found</h3>
              <p>
                {filter === 'all' 
                  ? "You haven't made any transactions yet." 
                  : `No ${filter} transactions found.`
                }
              </p>
            </div>
          ) : (
            <div className="transactions-list">
              {filteredTransactions.map((transaction, index) => (
                <div key={transaction._id || index} className="transaction-card">
                  <div className="transaction-header">
                    <div className="transaction-id">
                      <span className="label">Transaction ID:</span>
                      <span className="value">{transaction._id || 'N/A'}</span>
                    </div>
                    <div className={`transaction-status ${getStatusColor(transaction.status)}`}>
                      <span className="status-icon">{getStatusIcon(transaction.status)}</span>
                      <span className="status-text">{transaction.status || 'Unknown'}</span>
                    </div>
                  </div>

                  <div className="transaction-details">
                    <div className="detail-row">
                      <span className="label">Recipient:</span>
                      <span className="value">{transaction.recipientName || 'N/A'}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Account Number:</span>
                      <span className="value">{transaction.recipientAccountNumber || 'N/A'}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Amount:</span>
                      <span className="value amount">{formatAmount(transaction.amount, transaction.currency)}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Payment Provider:</span>
                      <span className="value">{transaction.paymentProvider || 'N/A'}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">SWIFT Code:</span>
                      <span className="value">{transaction.swiftCode || 'N/A'}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Date:</span>
                      <span className="value">{formatDate(transaction.createdAt || transaction.date)}</span>
                    </div>
                  </div>

                  {transaction.notes && (
                    <div className="transaction-notes">
                      <span className="label">Notes:</span>
                      <span className="value">{transaction.notes}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransactionsPage;
