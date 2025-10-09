import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utils/navigation.js';
import apiService from '../../utils/api.js';
import './RegisterPage.css';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [idNumber, setIdNumber] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      //const response = await apiService.register({...});
      await apiService.register({
        username: username,
        full_name: fullName,
        IDNumber: idNumber,
        accountNumber: accountNumber,
        password: password
      });

      alert('Registration successful! Please login with your credentials.');
      navigate(ROUTES.LOGIN);
    } catch (error) {
      setError(error.message || 'Registration failed. Please try again.');
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
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
              <label>Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="3-16 characters, letters, numbers, underscores only"
                required
              />
            </div>
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
                placeholder="13-digit ID number"
                maxLength="13"
                pattern="[0-9]{13}"
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
                placeholder="Min 6 chars, include letters and numbers"
                minLength="6"
                required
              />
            </div>
          </div>
        </div>
          {error && <div className="error-message" style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
        
        <div className="button-row">
          <button type="submit" className="continue-btn" disabled={loading}>
            {loading ? 'Creating Account...' : 'Next'}
          </button>
          <Link to={ROUTES.LOGIN} className="cancel-btn">
            Back 
          </Link>
        </div>
      </form>
    </div>
  );
}

export default RegisterPage;
