import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import "./EmployeeHome.css";
import apiService from "../../utils/api";

export default function EmployeeHome() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

   useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiService.getAllPayments();
        
        if (response.applications) {
         //using same filter of pending payments as in PendingPayments.js
         //added splice to see top 5 
          const pendingPayments = response.applications.filter(app => app.status === 'pending');
          setPayments(pendingPayments.slice(0, 5)); 
        } else {
          setPayments([]);
        }
      } catch (error) {
        console.error('Error fetching payments:', error);
        setError('Failed to load payment applications. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  return (
    <div className="employee-home">
      <div className="home-header">
        <h1>Employee Dashboard</h1>
        <p>Welcome back! Here's your overview for today.</p>
      </div>

      <div className="dashboard-grid">
        <div className="card">
          <div className="card-header">
            <h3>Pending Payments</h3>
            <span className="count-badge">12</span>
          </div>
          <p>Payments awaiting your approval</p>
          <Link to="/pendingPayments" className="action-btn primary">
            Review Pending Payments
          </Link>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Payment Status</h3>
          </div>
          {/* views pending payments */}
         <div className="status-list">
  {loading ? (
    <div className="status-item">
      <div className="status-info">
        <span className="status-text">Loading...</span>
      </div>
    </div>
  ) : error ? (
    <div className="status-item">
      <div className="status-info">
        <span className="status-text" style={{ color: "#ef4444" }}>{error}</span>
      </div>
    </div>
  ) : payments.length === 0 ? (
    <div className="status-item">
      <div className="status-info">
        <span className="status-text">No payments found.</span>
      </div>
    </div>
  ) : (
    payments.map((payment) => (
      <div className="status-item" key={payment._id}>
        <div className={`status-indicator ${payment.status}`}></div>
        <div className="status-info">
          <span className="status-text">
            {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
          </span>
          <span className="status-detail">
            {payment.currency} {payment.amount} from {payment.recipientName}
          </span>
        </div>
      </div>
    ))
  )}
</div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Session</h3>
          </div>
       
          <Link to="/" className="action-btn secondary">
            Logout
          </Link>
        </div>
      </div>
    </div>
  );
}
