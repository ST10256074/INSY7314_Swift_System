import React, { useState } from 'react';
import './AccountDetails.css';
import { useAuth } from '../../contexts/AuthContext.js';

export default function AccountDetails() {
	const { user } = useAuth();
	const [showPassword, setShowPassword] = useState(false);

	if (!user) {
		return (
			<div className="account-info-page">
				<div className="account-header">
					<h1>Account Details</h1>
				</div>
				<div className="account-form">
					<p>No user data available. Please log in.</p>
				</div>
			</div>
		);
	}


	const fullName = user.full_name || user.fullName || user.name || '';
	const idNumber = user.IDNumber || user.idNumber || user.ID || '';
	const username = user.username || '';
	const accountNumber = user.accountNumber || '';
	const password = user.password || '********'; 

	return (
		<div className="account-info-page">
			<div className="account-header">
				<h1>Account Details</h1>
			</div>

			<div className="account-form">
				<section className="section">
					<h2>Your Information</h2>
					<div className="section-line"></div>

					<div className="form-grid details-grid">
						<div>
							<label>Full Name</label>
						</div>
						<div>
							<span className="value">{fullName || 'N/A'}</span>
						</div>

						<div>
							<label>ID Number</label>
						</div>
						<div>
							<span className="value">{idNumber || 'N/A'}</span>
						</div>

						<div>
							<label>Username</label>
						</div>
						<div>
							<span className="value">{username || 'N/A'}</span>
						</div>

						<div>
							<label>Account Number</label>
						</div>
						<div>
							<span className="value">{accountNumber || 'N/A'}</span>
						</div>

						<div>
							<label>Password</label>
						</div>
						<div className="password-row">
							<span className="value">{showPassword ? password : ''}</span>
							<button
								type="button"
								className="show-password-btn"
								onClick={() => setShowPassword(s => !s)}
							>
								{showPassword ? 'Hide' : 'Show'}
							</button>
						</div>
					</div>
				</section>

				<div className="button-row">
				
					<button type="button" className="cancel-btn" onClick={() => window.history.back()}>
						Back
					</button>
				</div>
			</div>
		</div>
	);
}

