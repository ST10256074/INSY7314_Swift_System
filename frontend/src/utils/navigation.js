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
    transactions: () => navigate('/transactions'),
    accountDetails: () => navigate('/account-details'),
    inspectTransaction: (transactionId) => navigate(`/inspect-transaction/${transactionId}`),

    // Employee routes
    employeeHome: () => navigate('/EmployeeHome'),
    pendingPayments: () => navigate('/pendingPayments'),
    inspectPayment: (paymentId) => navigate(`/inspect-payment/${paymentId}`),
    
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
  CLIENT_HOME: '/ClientHome',
  EMPLOYEE_HOME: '/EmployeeHome',
  PAYMENT: '/payment',
  TRANSACTIONS: '/transactions',
  PENDING_PAYMENTS: '/pendingPayments',
  ACCOUNT_DETAILS: '/account-details',
  INSPECT_TRANSACTION: '/inspect-transaction/:transactionId',
  INSPECT_PAYMENT: '/inspect-payment/:paymentId'
};
