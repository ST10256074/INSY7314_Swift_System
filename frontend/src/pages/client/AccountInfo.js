import React, { useState } from "react";
import "./AccountInfo.css";

export default function AccountInfo() {
	const [data, setData] = useState({
		accountNumber: "",
		swiftCode: "",
	});

	const handleChange = (e) => {
		const { name, value } = e.target;
		setData((prev) => ({ ...prev, [name]: value }));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		// Basic validation
		if (!data.accountNumber.trim()) {
			alert("Please enter the recipient account number.");
			return;
		}
		if (!data.swiftCode.trim()) {
			alert("Please enter the recipient SWIFT code.");
			return;
		}

		// For now, just show the data. In a real app you'd pass this to the next step.
		alert(
			`Recipient Account: ${data.accountNumber}\nSWIFT Code: ${data.swiftCode}`
		);
	};

	return (
		<div className="account-info-page">
			<div className="account-header">
				<h1>Recipient Account Details</h1>
			</div>

			<form className="account-form" onSubmit={handleSubmit}>
				<section className="section">
					<h2>Recipient Bank Details</h2>
					<div className="section-line"></div>

					<div className="form-grid">
									<div>
										<label htmlFor="recipient-account">Account Number</label>
										<input
											id="recipient-account"
											name="accountNumber"
											value={data.accountNumber}
											onChange={handleChange}
											placeholder="Enter recipient account number"
											required
										/>
									</div>

									<div>
										<label htmlFor="recipient-swift">SWIFT Code</label>
										<input
											id="recipient-swift"
											name="swiftCode"
											value={data.swiftCode}
											onChange={handleChange}
											placeholder="Enter SWIFT/BIC code"
											required
										/>
									</div>
					</div>
				</section>

				<div className="button-row">
					<button type="button" className="cancel-btn">Cancel</button>
					<button type="submit" className="continue-btn">Save</button>
				</div>
			</form>
		</div>
	);
}

