import React, { useState, useEffect } from 'react';
import './AccountDetails.css';
import { useAuth } from '../../contexts/AuthContext.js';
import apiService from '../../utils/api.js';

export default function AccountDetails() {
	const { user } = useAuth();
	const [profileData, setProfileData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchProfile = async () => {
			try {
				setLoading(true);
				const response = await apiService.getUserProfile();
				setProfileData(response.user);
				setError(null);
			} catch (error) {
				console.error('Error fetching profile:', error);
				setError('Failed to load profile data');
			} finally {
				setLoading(false);
			}
		};

		if (user) {
			fetchProfile();
		} else {
			setLoading(false);
		}
	}, [user]);

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

	if (loading) {
		return (
			<div className="account-info-page">
				<div className="account-header">
					<h1>Account Details</h1>
				</div>
				<div className="account-form">
					<p>Loading profile data...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="account-info-page">
				<div className="account-header">
					<h1>Account Details</h1>
				</div>
				<div className="account-form">
					<p style={{color: 'red'}}>{error}</p>
					<button onClick={() => window.location.reload()} className="retry-btn">
						Retry
					</button>
				</div>
			</div>
		);
	}

	const fullName = profileData?.full_name || '';
	const idNumber = profileData?.IDNumber || '';
	const username = profileData?.username || '';
	const accountNumber = profileData?.accountNumber || '';
	const password = '********'; 

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
									type="text"
									value={'••••••••'}
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

