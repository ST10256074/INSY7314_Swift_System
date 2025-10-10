import React from "react";
import { Link } from "react-router-dom";
import { ROUTES } from "../utils/navigation.js";
import { useAuth } from "../contexts/AuthContext.js";
import LogoutModal from "./LogoutModal.js";
import "./Navbar.css";

function Navbar() {
  const { user, isAuthenticated, logout, isEmployee, isClient } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);

  const handleLogoutClick = () => {
    setShowLogoutModal(true);
  };

  const handleLogoutConfirm = () => {
    logout();
    setShowLogoutModal(false);
  };

  const handleLogoutCancel = () => {
    setShowLogoutModal(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-left">
          <Link to={ROUTES.LOGIN} className="navbar-brand">
            Swift Payment System
          </Link>
        </div>
        
        <div className="navbar-right">
          {isAuthenticated() ? (
            <>
              {/* Show user info */}
              <span className="navbar-user">
                Welcome, {user?.full_name || user?.username}
              </span>
              
              {/* Role-based navigation */}
              {isClient() && (
                <>
                  <Link to={ROUTES.CLIENT_HOME} className="navbar-link">Home</Link>
                  <Link to={ROUTES.PAYMENT} className="navbar-link">Payment</Link>
                  <Link to={ROUTES.TRANSACTIONS} className="navbar-link">Transactions</Link>
                  <Link to={ROUTES.ACCOUNT_DETAILS} className="navbar-link">Account Details</Link>
                </>
              )}
              
              {isEmployee() && (
                <>
                  <Link to={ROUTES.EMPLOYEE_HOME} className="navbar-link">Home</Link>
                  <Link to={ROUTES.PENDING_PAYMENTS} className="navbar-link">Pending Payments</Link>
                </>
              )}
              
              {/* Logout button */}
              <button onClick={handleLogoutClick} className="navbar-logout">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to={ROUTES.LOGIN} className="navbar-link">Login</Link>
              <Link to={ROUTES.REGISTER} className="navbar-link">Register</Link>
            </>
          )}
        </div>
      </div>
      
      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={showLogoutModal}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
      />
    </nav>
  );
}

export default Navbar;