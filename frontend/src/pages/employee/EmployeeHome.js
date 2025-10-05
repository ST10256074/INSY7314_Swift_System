import React from "react";
import { Link } from "react-router-dom";
import "./EmployeeHome.css";

export default function EmployeeHome() {
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
          <div className="status-list">
            <div className="status-item">
              <div className="status-indicator pending"></div>
              <div className="status-info">
                <span className="status-text">Payment Pending</span>
                <span className="status-detail">R 5,000.00 from Client A</span>
              </div>
            </div>
            <div className="status-item">
              <div className="status-indicator pending"></div>
              <div className="status-info">
                <span className="status-text">Payment Pending</span>
                <span className="status-detail">R 3,200.00 from Client B</span>
              </div>
            </div>
            <div className="status-item">
              <div className="status-indicator pending"></div>
              <div className="status-info">
                <span className="status-text">Payment Pending</span>
                <span className="status-detail">R 1,800.00 from Client C</span>
              </div>
            </div>
            <div className="status-item">
              <div className="status-indicator completed"></div>
              <div className="status-info">
                <span className="status-text">Payment Approved</span>
                <span className="status-detail">R 2,500.00 from Client D</span>
              </div>
            </div>
            <div className="status-item">
              <div className="status-indicator completed"></div>
              <div className="status-info">
                <span className="status-text">Payment Approved</span>
                <span className="status-detail">R 4,100.00 from Client E</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}