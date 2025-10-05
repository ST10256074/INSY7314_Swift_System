import React from "react";
import "./PendingPayments.css";

export default function PendingPayments() {
  // Mock data
  const payments = [
    { id: 1, amount: "250 USD", provider: "PayPal", account: "ACC12345", date: "2025-10-01" },
    { id: 2, amount: "100 EUR", provider: "Stripe", account: "ACC67890", date: "2025-09-29" },
    { id: 3, amount: "500 ZAR", provider: "Bank Transfer", account: "ACC24680", date: "2025-09-27" },
    { id: 4, amount: "75 GBP", provider: "Square", account: "ACC13579", date: "2025-09-26" },
    { id: 5, amount: "300 USD", provider: "PayPal", account: "ACC98765", date: "2025-09-25" },
  ];

  const handleApprove = (id) => {
    alert(`Approved transaction ${id}`);
  };

  const handleDeny = (id) => {
    alert(`Denied transaction ${id}`);
  };

  return (
    <div className="pending-payments-page">
      <div className="pending-payments-box">
        <div className="pending-payments-header">
          <h2>Payment Portal</h2>
        </div>
        <table className="payments-table">
          <thead>
            <tr>
              <th>Amount</th>
              <th>Provider</th>
              <th>Account</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.amount}</td>
                <td>{payment.provider}</td>
                <td>{payment.account}</td>
                <td>{payment.date}</td>
                <td>
                  <button
                    className="action-btn approve-btn"
                    onClick={() => handleApprove(payment.id)}
                  >
                    Approve
                  </button>
                  <button
                    className="action-btn deny-btn"
                    onClick={() => handleDeny(payment.id)}
                  >
                    Deny
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}