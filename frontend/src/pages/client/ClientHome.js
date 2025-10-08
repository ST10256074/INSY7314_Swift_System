import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { ROUTES } from "../../utils/navigation";
import apiService from "../../utils/api.js";
import "./ClientHome.css";

export default function ClientHome() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await apiService.getMyPayments();
      const userTransactions = response.applications || [];
      
      setTransactions(userTransactions);
      
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate(ROUTES.LOGIN);
  };

  const formatAmount = (amount, currency = 'ZAR') => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-ZA', {
      style: 'currency',
      currency: currency
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'Invalid Date';
    }
  };

  // Get recent approved payments only (last 3)
  const recentTransactions = transactions
    .filter(t => t.status === 'approved')
    .sort((a, b) => new Date(b.submittedAt) - new Date(a.submittedAt))
    .slice(0, 3);

  // Get pending and completed transactions for status display
  const pendingTransactions = transactions.filter(t => t.status === 'pending').slice(0, 2);
  const completedTransactions = transactions.filter(t => t.status === 'approved').slice(0, 2);

  return (
    <div className="client-home">
      <div className="home-header">
        <h1>Welcome to Swift Banking{user?.name ? `, ${user.name}` : ''}</h1>
        <p>Manage your international payments with ease and security.</p>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <h3>Recent Approved Payments</h3>
          </div>
          <div className="payment-list">
            {loading ? (
              <div className="loading-message">Loading recent payments...</div>
            ) : recentTransactions.length > 0 ? (
              recentTransactions.map((transaction, index) => (
                <div key={transaction._id || index} className="payment-item">
                  <div className="payment-info">
                    <span className="payment-recipient">{transaction.recipientName}</span>
                    <span className="payment-date">{formatDate(transaction.submittedAt)}</span>
                  </div>
                  <div className="payment-details">
                    <span className="payment-amount">
                      {formatAmount(transaction.amount, transaction.currency)}
                    </span>
                    <span className={`payment-status ${transaction.status}`}>
                      {transaction.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="empty-message">No approved payments found.</div>
            )}
          </div>

        </div>

        <div className="card">
          <div className="card-header">
            <h3>Quick Actions</h3>
          </div>
          <div className="action-buttons">
            <Link to={ROUTES.PAYMENT} className="action-btn primary">
              Make Payment
            </Link>
            <Link to={ROUTES.ACCOUNT_INFO} className="action-btn secondary">
              Account Info
            </Link>
            <button onClick={handleLogout} className="action-btn secondary">
              Logout
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Payment Status</h3>
          </div>
          <div className="status-list">
            {loading ? (
              <div className="loading-message">Loading payment status...</div>
            ) : (
              <>
                {pendingTransactions.map((transaction, index) => (
                  <div key={`pending-${transaction._id || index}`} className="status-item">
                    <div className="status-indicator pending"></div>
                    <div className="status-info">
                      <span className="status-text">Payment Pending</span>
                      <span className="status-detail">
                        {formatAmount(transaction.amount, transaction.currency)} to {transaction.recipientName}
                      </span>
                    </div>
                  </div>
                ))}
                {completedTransactions.map((transaction, index) => (
                  <div key={`completed-${transaction._id || index}`} className="status-item">
                    <div className="status-indicator completed"></div>
                    <div className="status-info">
                      <span className="status-text">Payment Completed</span>
                      <span className="status-detail">
                        {formatAmount(transaction.amount, transaction.currency)} to {transaction.recipientName}
                      </span>
                    </div>
                  </div>
                ))}
                {pendingTransactions.length === 0 && completedTransactions.length === 0 && (
                  <div className="empty-message">
                    No recent payment status to show.
                  </div>
                )}
              </>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}