import React, { useState, useEffect } from "react";
import "./PendingPayments.css";
import apiService from "../../utils/api";

export default function PendingPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch payments data from backend on component mount
  useEffect(() => {
    const fetchPayments = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await apiService.getAllPayments();
        
        if (response.applications) {
          // Filter for pending payments only for the employee review interface
          const pendingPayments = response.applications.filter(app => app.status === 'pending');
          setPayments(pendingPayments);
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

  const handleApprove = async (id) => {
    try {
      const response = await apiService.reviewPayment(id, { 
        status: 'approved', 
        comments: 'Payment approved by employee' 
      });
      
      if (response.application) {
        // Remove the approved payment from the pending list
        setPayments(prevPayments => prevPayments.filter(payment => payment._id !== id));
        alert(`Payment application approved successfully`);
      }
    } catch (error) {
      console.error('Error approving payment:', error);
      alert('Failed to approve payment. Please try again.');
    }
  };

  const handleDeny = async (id) => {
    const reason = prompt("Please provide a reason for denial:");
    if (reason === null) return; // User cancelled
    
    try {
      const response = await apiService.reviewPayment(id, { 
        status: 'rejected', 
        comments: reason || 'Payment rejected by employee' 
      });
      
      if (response.application) {
        // Remove the rejected payment from the pending list
        setPayments(prevPayments => prevPayments.filter(payment => payment._id !== id));
        alert(`Payment application rejected successfully`);
      }
    } catch (error) {
      console.error('Error rejecting payment:', error);
      alert('Failed to reject payment. Please try again.');
    }
  };

  const handleSwiftCheck = (swiftCode) => {
    // Simple SWIFT code validation using the same regex as backend
    const swiftCodeRegex = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
    const isValid = swiftCodeRegex.test(swiftCode);
    
    alert(`SWIFT Code: ${swiftCode}\nStatus: ${isValid ? 'Valid Format' : 'Invalid Format'}\n\nValid SWIFT codes should be 8 or 11 characters:\n- First 6 characters: Bank code (letters)\n- Next 2 characters: Country code (letters)\n- Optional 3 characters: Branch code (letters/numbers)`);
  };

  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="pending-payments-page">
        <div className="pending-payments-box">
          <div className="pending-payments-header">
            <h2>Payment Portal</h2>
          </div>
          <div style={{ padding: '20px', textAlign: 'center' }}>
            <p>Loading payment applications...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pending-payments-page">
        <div className="pending-payments-box">
          <div className="pending-payments-header">
            <h2>Payment Portal</h2>
          </div>
          <div style={{ padding: '20px', textAlign: 'center', color: '#d32f2f' }}>
            <p>{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              style={{ 
                marginTop: '10px', 
                padding: '8px 16px', 
                backgroundColor: '#1976d2', 
                color: 'white', 
                border: 'none', 
                borderRadius: '4px', 
                cursor: 'pointer' 
              }}
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pending-payments-page">
      <div className="pending-payments-box">
        <div className="pending-payments-header">
          <h2>Payment Portal</h2>
          <p style={{ margin: '5px 0', fontSize: '14px', color: '#666' }}>
            {payments.length} pending payment{payments.length !== 1 ? 's' : ''} awaiting review
          </p>
        </div>
        
        {payments.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
            <p>No pending payment applications found.</p>
            <p>All payments have been processed or no new applications have been submitted.</p>
          </div>
        ) : (
          <table className="payments-table">
            <thead>
              <tr>
                <th>Recipient</th>
                <th>Amount</th>
                <th>Provider</th>
                <th>Account</th>
                <th>Date Submitted</th>
                <th>SWIFT Code</th>
                <th>Swift Check</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {payments.map((payment) => (
                <tr key={payment._id}>
                  <td>{payment.recipientName}</td>
                  <td>{payment.amount} {payment.currency}</td>
                  <td>{payment.paymentProvider}</td>
                  <td>{payment.accountNumber}</td>
                  <td>{formatDate(payment.submittedAt)}</td>
                  <td>{payment.swiftCode}</td>
                  <td>
                    <button
                      className="action-btn swift-check-btn"
                      onClick={() => handleSwiftCheck(payment.swiftCode)}
                    >
                      Check Swift
                    </button>
                  </td>
                  <td>
                    <button
                      className="action-btn approve-btn"
                      onClick={() => handleApprove(payment._id)}
                    >
                      Approve
                    </button>
                    <button
                      className="action-btn deny-btn"
                      onClick={() => handleDeny(payment._id)}
                    >
                      Deny
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}