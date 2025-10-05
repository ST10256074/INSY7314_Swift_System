import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './RegisterPage.css';

function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Registration logic here
    alert(`Full Name: ${fullName}\nID Number: ${idNumber}\nAccount Number: ${accountNumber}\nPassword: ${password}`);
  };

  return (
    <div className="payment-page">
      <div className="payment-header">
        <h1>Register</h1>
      </div>
      <form className="payment-form" onSubmit={handleSubmit}>
        <div className="section">
          <h2>Create your account</h2>
          <div className="section-line"></div>
          <div className="form-grid">
            <div>
              <label>Full Name</label>
              <input
                type="text"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                required
              />
            </div>
            <div>
              <label>ID Number</label>
              <input
                type="text"
                value={idNumber}
                onChange={e => setIdNumber(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Account Number</label>
              <input
                type="text"
                value={accountNumber}
                onChange={e => setAccountNumber(e.target.value)}
                required
              />
            </div>
            <div>
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
        </div>
        <div className="button-row">
          <button type="submit" className="continue-btn">Next</button>
          <Link to="/" className="cancel-btn">
  Back 
</Link>
        </div>
      </form>
    </div>
  );
}

export default RegisterPage;