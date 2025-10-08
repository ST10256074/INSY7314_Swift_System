import { Link } from "react-router-dom";
import { ROUTES } from "../utils/navigation.js";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to={ROUTES.CLIENT_HOME} className="navbar-link">Client Home</Link>
        <Link to={ROUTES.EMPLOYEE_HOME} className="navbar-link">Employee Home</Link>
        <Link to={ROUTES.LOGIN} className="navbar-link">Login</Link>
        <Link to={ROUTES.REGISTER} className="navbar-link">Register</Link>
        <Link to={ROUTES.PAYMENT} className="navbar-link">Payment</Link>
        <Link to={ROUTES.PENDING_PAYMENTS} className="navbar-link">Pending Payments</Link>
      </div>
    </nav>
  );
}

export default Navbar;