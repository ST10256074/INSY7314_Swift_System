import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.js';
import { ROUTES } from '../utils/navigation.js';

const ProtectedRoute = ({ children, requireEmployee = false, requireClient = false }) => {
  const { isAuthenticated, isEmployee, isClient, loading } = useAuth();
  const location = useLocation();

  // Show loading while checking authentication
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px'
      }}>
        Loading...
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated()) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  // Check role-based access
  if (requireEmployee && !isEmployee()) {
    return <Navigate to={ROUTES.PAYMENT} replace />;
  }

  if (requireClient && !isClient()) {
    return <Navigate to={ROUTES.PENDING_PAYMENTS} replace />;
  }

  return children;
};

export default ProtectedRoute;
