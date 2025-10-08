
import './App.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ROUTES } from './utils/navigation.js';
import { AuthProvider } from './contexts/AuthContext.js';
import Navbar from './components/Navbar.js';
import ProtectedRoute from './components/ProtectedRoute.js';
import LoginPage from './pages/auth/LoginPage.js';
import RegisterPage from './pages/auth/RegisterPage.js';
import PaymentPage from './pages/client/PaymentPage.js';
import TransactionsPage from './pages/client/TransactionsPage.js';
import PendingPayments from './pages/employee/PendingPayments.js';
import AccountInfo from './pages/client/AccountInfo.js';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* Public routes */}
          <Route path={ROUTES.LOGIN} element={<LoginPage />} />
          <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
          
          {/* Protected routes */}
          <Route 
            path={ROUTES.PAYMENT} 
            element={
              <ProtectedRoute requireClient={true}>
                <PaymentPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path={ROUTES.TRANSACTIONS} 
            element={
              <ProtectedRoute requireClient={true}>
                <TransactionsPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path={ROUTES.ACCOUNT_INFO} 
            element={
              <ProtectedRoute requireClient={true}>
                <AccountInfo />
              </ProtectedRoute>
            } 
          />
          <Route 
            path={ROUTES.PENDING_PAYMENTS} 
            element={
              <ProtectedRoute requireEmployee={true}>
                <PendingPayments />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
export default App;
