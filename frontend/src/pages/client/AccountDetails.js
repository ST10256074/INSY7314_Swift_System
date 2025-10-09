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
							<input 
								type="text" 
								value={fullName || 'N/A'} 
								readOnly 
								className="readonly-input"
							/>
						</div>
						<div>
							<label>ID Number</label>
							<input 
								type="text" 
								value={idNumber || 'N/A'} 
								readOnly 
								className="readonly-input"
							/>
						</div>

						<div>
							<label>Username</label>
							<input 
								type="text" 
								value={username || 'N/A'} 
								readOnly 
								className="readonly-input"
							/>
						</div>
						<div>
							<label>Account Number</label>
							<input 
								type="text" 
								value={accountNumber || 'N/A'} 
								readOnly 
								className="readonly-input"
							/>
						</div>

						<div>
							<label>Password</label>
							<div className="password-row">
								<input
									type={showPassword ? "text" : "password"}
									value={showPassword ? password : '••••••••'}
									readOnly
									className="readonly-input"
								/>
								
							</div>
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

