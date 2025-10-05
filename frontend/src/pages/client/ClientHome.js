import React from "react";
import { Link } from "react-router-dom";
import "./ClientHome.css";

export default function ClientHome() {
  return (
    <div className="client-home">
      <div className="home-header">
        <h1>Welcome to Swift Banking</h1>
        <p>Manage your international payments with ease and security.</p>
      </div>

      <div className="dashboard-grid">
           <div className="card">
          <div className="card-header">
            <h3>Recent Payments</h3>
          </div>
          <div className="payment-list">
            <div className="payment-item">
              <div className="payment-info">
                <span className="payment-recipient">International Transfer</span>
                <span className="payment-date">Oct 4, 2025</span>
              </div>
              <span className="payment-amount">-R 2,500.00</span>
            </div>
            <div className="payment-item">
              <div className="payment-info">
                <span className="payment-recipient">Wire Transfer</span>
                <span className="payment-date">Oct 3, 2025</span>
              </div>
              <span className="payment-amount">-R 1,200.00</span>
            </div>
          </div>
          <Link to="#" className="card-link">
            View All Transactions →
          </Link>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Quick Actions</h3>
          </div>
          <div className="action-buttons">
            <Link to="/payment" className="action-btn primary">
              Make Payment
            </Link>
            <Link to="/" className="action-btn secondary">
              Logout
            </Link>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3>Payment Status</h3>
          </div>
          <div className="status-list">
            <div className="status-item">
              <div className="status-indicator pending"></div>
              <div className="status-info">
                <span className="status-text">Payment Pending</span>
                <span className="status-detail">R 3,000.00 to USD Account</span>
              </div>
            </div>
            <div className="status-item">
              <div className="status-indicator completed"></div>
              <div className="status-info">
                <span className="status-text">Payment Completed</span>
                <span className="status-detail">R 1,500.00 to EUR Account</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}