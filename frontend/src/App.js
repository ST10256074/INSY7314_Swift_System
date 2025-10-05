
import './App.css';

import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
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
        <Route path="/" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/client-home" element={<ClientHome />} />
        <Route path="/employee-home" element={<EmployeeHome />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/accountInfo" element={<AccountInfo />} />
        <Route path="/pendingPayments" element={<PendingPayments />} />
       
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
