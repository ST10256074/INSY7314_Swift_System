import React, { useState } from "react";
import { Link } from 'react-router-dom';
import { ROUTES } from '../../utils/navigation.js';
import './LoginPage.css';

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Username: ${username}\nAccount: ${accountNumber}\nPassword: ${password}`);
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
          <button type="submit" className="btn btn-primary">Sign In</button>
          
          <div className="or-separator">or</div>

          <Link to={ROUTES.REGISTER} className="btn btn-secondary">Create New Account</Link>
        </form>
      </div>
    </div>
  );
}