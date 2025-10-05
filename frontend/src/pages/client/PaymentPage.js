import React, { useState } from "react";
import "./PaymentPage.css";

export default function PaymentPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    surname: "",
    idType: "South African ID",
    idNumber: "",
    cellphone: "",
    email: "",
    account: "Main Account - 62004522927",
    amount: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Payment submitted successfully!");
  };

  return (
    <div className="payment-page">
      <div className="payment-header">
        <h1>Payment</h1>
      </div>

      <form className="payment-form" onSubmit={handleSubmit}>
        <section className="section">
          <h2>Settlement Account</h2>
          <div className="section-line"></div>

          <div className="form-row">
            <label>Account to be debited:</label>
            <span>{formData.account}</span>
          </div>
        </section>

        <section className="section">
          <h2>Applicant Details</h2>
          <div className="section-line"></div>

          <div className="form-grid">
            <div>
              <label>First Name</label>
              <input
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Surname</label>
              <input
                name="surname"
                value={formData.surname}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>ID Number</label>
              <input
                name="idNumber"
                value={formData.idNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Amount</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Enter amount"
                required
              />
            </div>
          </div>
        </section>

        <div className="button-row">
          <button type="button" className="cancel-btn">Cancel</button>
          <button type="submit" className="continue-btn">Continue</button>
        </div>
      </form>
    </div>
  );
}