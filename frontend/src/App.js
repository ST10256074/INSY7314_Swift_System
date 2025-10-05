
import './App.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ROUTES } from './utils/navigation.js';
import Navbar from './components/Navbar.js';
import LoginPage from './pages/auth/LoginPage.js';
import RegisterPage from './pages/auth/RegisterPage.js';
import PaymentPage from './pages/client/PaymentPage.js';
import PendingPayments from './pages/employee/PendingPayments.js';
import AccountInfo from './pages/client/AccountInfo.js';

function App() {
  return (
   <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
        <Route path={ROUTES.PAYMENT} element={<PaymentPage />} />
        <Route path={ROUTES.ACCOUNT_INFO} element={<AccountInfo />} />
        <Route path={ROUTES.PENDING_PAYMENTS} element={<PendingPayments />} />
      </Routes>
    </BrowserRouter>
  );
}
export default App;
