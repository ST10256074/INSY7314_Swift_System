import { useNavigate } from 'react-router-dom';

// Navigation utility hook
export const useAppNavigation = () => {
  const navigate = useNavigate();

  const navigateTo = {
    // Auth routes
    login: () => navigate('/'),
    register: () => navigate('/register'),
    
    // Client routes
    clientHome: () => navigate('/ClientHome'),
    payment: () => navigate('/payment'),
    accountInfo: () => navigate('/account-info'),
    
    // Employee routes
    employeeHome: () => navigate('/EmployeeHome'),
    pendingPayments: () => navigate('/pendingPayments'),
    
    // Generic navigation
    goTo: (path) => navigate(path),
    goBack: () => navigate(-1),
    goForward: () => navigate(1),
  };

  return navigateTo;
};

// Route constants for consistent path management
export const ROUTES = {
  LOGIN: '/',
  REGISTER: '/register',
  PAYMENT: '/payment',
  ACCOUNT_INFO: '/account-info',
  PENDING_PAYMENTS: '/pendingPayments',
};
