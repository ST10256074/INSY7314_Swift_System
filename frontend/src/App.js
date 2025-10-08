
import './App.css';

import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { ROUTES } from './utils/navigation.js';
import Navbar from './components/Navbar.js';
import LoginPage from './pages/auth/LoginPage.js';
import RegisterPage from './pages/auth/RegisterPage.js';
import PaymentPage from './pages/client/PaymentPage.js';
import PendingPayments from './pages/employee/PendingPayments.js';
import AccountInfo from './pages/client/AccountInfo.js';
import ClientHome from './pages/client/ClientHome.js';
import EmployeeHome from './pages/employee/EmployeeHome.js';

function AppContent() {
  const location = useLocation();
  const hideNavbarRoutes = ['/', '/register'];
  const shouldHideNavbar = hideNavbarRoutes.includes(location.pathname);
  return (
    <>
      {!shouldHideNavbar && <Navbar />}
      <Routes>
        <Route path={ROUTES.CLIENT_HOME} element={<ClientHome />} />
        <Route path={ROUTES.EMPLOYEE_HOME} element={<EmployeeHome />} />
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        <Route path={ROUTES.PAYMENT} element={<PaymentPage />} />
        <Route path={ROUTES.ACCOUNT_INFO} element={<AccountInfo />} />
        <Route path={ROUTES.PENDING_PAYMENTS} element={<PendingPayments />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
export default App;