import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './LoginPage.css';

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
    <div className="login-page">
      <div className="login-box">
        <div className="login-header">
          <h2>Create Account</h2>
          <p>Join Swift Banking today</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={e => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>ID Number</label>
            <input
              type="text"
              value={idNumber}
              onChange={e => setIdNumber(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Account Number</label>
            <input
              type="text"
              value={accountNumber}
              onChange={e => setAccountNumber(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">Create Account</button>
          
          <div className="or-separator">or</div>

          <Link to="/" className="btn btn-secondary">Back to Login</Link>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;