
import './App.css';

import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ROUTES } from './utils/navigation.js';
import { AuthProvider } from './contexts/AuthContext.js';
import Navbar from './components/Navbar.js';
import ProtectedRoute from './components/ProtectedRoute.js';
import LoginPage from './pages/auth/LoginPage.js';
import RegisterPage from './pages/auth/RegisterPage.js';
import PaymentPage from './pages/client/PaymentPage.js';
import TransactionsPage from './pages/client/TransactionsPage.js';
import PendingPayments from './pages/employee/PendingPayments.js';
import ClientHome from './pages/client/ClientHome.js';
import EmployeeHome from './pages/employee/EmployeeHome.js';
import AccountDetails from './pages/client/AccountDetails.js';
import InspectTransaction from './pages/client/InspectTransaction.js';

function AppContent() {
  const location = useLocation();
  const hideNavbarRoutes = ['/', '/register'];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);
  
  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <Routes>
        {/* Public routes */}
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        
        {/* Home routes */}
        <Route path={ROUTES.CLIENT_HOME} element={<ClientHome />} />
        <Route path={ROUTES.EMPLOYEE_HOME} element={<EmployeeHome />} />
        
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
          path={ROUTES.ACCOUNT_DETAILS} 
          element={
            <ProtectedRoute requireClient={true}>
              <AccountDetails />
            </ProtectedRoute>
          } 
        />
        <Route 
          path={ROUTES.INSPECT_TRANSACTION} 
          element={
            <ProtectedRoute requireClient={true}>
              <InspectTransaction />
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
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}
export default App;