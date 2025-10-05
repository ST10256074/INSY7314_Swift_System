import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-link">Login</Link>
        <Link to="/register" className="navbar-link">Register</Link>
        <Link to="/payment" className="navbar-link">Payment</Link>
        <Link to="/pendingPayments" className="navbar-link">Pending Payments</Link>
      </div>
    </nav>
  );
}

export default Navbar;