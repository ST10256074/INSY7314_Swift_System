import React, { useState } from "react";
import { useAppNavigation } from '../../utils/navigation.js';
import apiService from '../../utils/api.js';
import "./PaymentPage.css";

export default function PaymentPage() {
  const navigation = useAppNavigation();
  const [formData, setFormData] = useState({
    recipientName: "",
    accountNumber: "",
    swiftCode: "",
    amount: "",
    currency: "USD",
    paymentProvider: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validateForm = () => {
    const { recipientName, accountNumber, swiftCode, amount, currency, paymentProvider } = formData;
    
    if (!recipientName.trim()) return "Recipient name is required";
    if (!accountNumber.trim()) return "Account number is required";
    if (!swiftCode.trim()) return "SWIFT code is required";
    if (!amount || parseFloat(amount) <= 0) return "Amount must be a positive number";
    if (!currency.trim()) return "Currency is required";
    if (!paymentProvider.trim()) return "Payment provider is required";
    
    // Validate SWIFT code format (8 or 11 characters)
    const swiftRegex = /^[A-Z]{6}[A-Z0-9]{2}([A-Z0-9]{3})?$/;
    if (!swiftRegex.test(swiftCode.toUpperCase())) {
      return "Invalid SWIFT code format. Must be 8 or 11 characters (e.g., DEUTDEFF or DEUTDEFF123)";
    }
    
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }
    
    setLoading(true);
    
    try {
      const paymentData = {
        recipientName: formData.recipientName.trim(),
        accountNumber: formData.accountNumber.trim(),
        swiftCode: formData.swiftCode.toUpperCase().trim(),
        amount: parseFloat(formData.amount),
        currency: formData.currency.toUpperCase().trim(),
        paymentProvider: formData.paymentProvider.trim()
      };
      
      const response = await apiService.submitPayment(paymentData);
      
      // Success 
      alert(`Payment application submitted successfully! Application ID: ${response.applicationId}`);
      // navigation.accountInfo();
      
    } catch (error) {
      console.error('Payment submission error:', error);
      setError(error.message || 'Failed to submit payment application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-page">
      <div className="payment-header">
        <h1>Payment</h1>
      </div>

      {error && (
        <div className="error-message" style={{ 
          color: 'red', 
          background: '#ffe6e6', 
          padding: '10px', 
          borderRadius: '4px', 
          margin: '10px 0',
          border: '1px solid red' 
        }}>
          {error}
        </div>
      )}

      <form className="payment-form" onSubmit={handleSubmit}>
        <section className="section">
          <h2>Recipient Details</h2>
          <div className="section-line"></div>

          <div className="form-grid">
            <div>
              <label>Recipient Name *</label>
              <input
                name="recipientName"
                value={formData.recipientName}
                onChange={handleChange}
                placeholder="Enter recipient full name"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label>Account Number *</label>
              <input
                name="accountNumber"
                value={formData.accountNumber}
                onChange={handleChange}
                placeholder="Enter recipient account number"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label>SWIFT Code *</label>
              <input
                name="swiftCode"
                value={formData.swiftCode}
                onChange={handleChange}
                placeholder="e.g., DEUTDEFF or DEUTDEFF123"
                maxLength="11"
                style={{ textTransform: 'uppercase' }}
                required
                disabled={loading}
              />
            </div>
            <div>
              <label>Payment Provider *</label>
              <input
                name="paymentProvider"
                value={formData.paymentProvider}
                onChange={handleChange}
                placeholder="Enter payment provider name"
                required
                disabled={loading}
              />
            </div>
          </div>
        </section>

        <section className="section">
          <h2>Payment Details</h2>
          <div className="section-line"></div>

          <div className="form-grid">
            <div>
              <label>Amount *</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Enter amount"
                min="0.01"
                step="0.01"
                required
                disabled={loading}
              />
            </div>
            <div>
              <label>Currency *</label>
              <select
                name="currency"
                value={formData.currency}
                onChange={handleChange}
                required
                disabled={loading}
              >
                <option value="USD">USD - US Dollar</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
                <option value="ZAR">ZAR - South African Rand</option>
                <option value="JPY">JPY - Japanese Yen</option>
                <option value="CAD">CAD - Canadian Dollar</option>
                <option value="AUD">AUD - Australian Dollar</option>
              </select>
            </div>
          </div>
        </section>

        <div className="button-row">
          <button 
            type="button" 
            className="cancel-btn"
            onClick={() => navigation.accountInfo()}
            disabled={loading}
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="continue-btn"
            disabled={loading}
          >
            {loading ? 'Submitting...' : 'Submit Payment'}
          </button>
        </div>
      </form>
    </div>
  );
}