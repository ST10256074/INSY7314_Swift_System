import React, { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { ROUTES } from '../../utils/navigation.js';
import { useAuth } from '../../contexts/AuthContext.js';
import './LoginPage.css';

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated()) {
      navigate(ROUTES.PAYMENT);
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await login({
        name: username,
        accountNumber: accountNumber,
        password: password
      });

      // Navigate based on user type
      if (response.user.userType === 'Employee') {
        navigate(ROUTES.EMPLOYEE_HOME);
      } else {
        navigate(ROUTES.CLIENT_HOME);
      }

      alert('Login successful!');
    } catch (error) {
      setError(error.message || 'Login failed. Please check your credentials.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-header">
          <h2>Welcome Back!</h2>
          <p>Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={e => setUsername(e.target.value)}
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
          {error && <div className="error-message" style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
          
          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
          
          <div className="or-separator">or</div>

          <Link to={ROUTES.REGISTER} className="btn btn-secondary">Create New Account</Link>
        </form>
      </div>
    </div>
  );
}