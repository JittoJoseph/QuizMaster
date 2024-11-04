import React, { useState, useEffect, useRef } from 'react';
import { UserCircle } from 'lucide-react';
import PropTypes from 'prop-types';
import { useAuth } from '../context/AuthContext';

const Welcome = ({ onStartClick, onNavigate }) => {
	const { user, login, logout } = useAuth();
	const [showDropdown, setShowDropdown] = useState(false);
	const dropdownRef = useRef(null);

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
				setShowDropdown(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, []);

	const handleAuth = async () => {
		if (!user) {
			try {
				await login();
			} catch (error) {
				console.error('Auth error:', error);
			}
		}
	};

	return (
		<div className="min-h-screen bg-background flex flex-col">
			{/* Navbar */}
			<nav className="px-4 md:px-8 py-4 bg-white/50 backdrop-blur-sm">
				<div className="container mx-auto flex justify-between items-center space-y-4">
					<div className="flex items-center space-x-4">
						<div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
							<span className="text-white font-bold text-2xl">QM</span>
						</div>
						<h1 className="text-3xl font-bold text-primary">QuizMaster</h1>
					</div>

					<div className="relative">
						{/* Account button and dropdown */}
						<button
							onClick={() => user ? setShowDropdown(!showDropdown) : handleAuth()}
							className="flex items-center space-x-2 text-primary/90 hover:text-secondary transition-colors bg-transparent border border-accent hover:border-secondary"
						>
							<UserCircle className="h-6 w-6" />
							<span>{user ? 'Account' : 'Sign In'}</span>
						</button>

						{showDropdown && user && (
							<div
								ref={dropdownRef}
								className="absolute right-0 mt-2 w-48 rounded-md border border-accent bg-white/90 backdrop-blur-sm shadow-lg"
							>
								<div className="py-1">
									<button
										onClick={() => {
											setShowDropdown(false);
											onNavigate('profile');
										}}
										className="block w-full px-4 py-2 text-left text-sm text-primary/90 hover:bg-accent/20 transition-colors bg-transparent"
									>
										My Profile
									</button>
									<button
										onClick={logout}
										className="block w-full px-4 py-2 text-left text-sm text-primary/90 hover:bg-accent/20 transition-colors bg-transparent"
									>
										Sign Out
									</button>
								</div>
							</div>
						)}
					</div>
				</div>
			</nav>

			{/* Main Content */}
			<div className="flex-grow flex flex-col items-center justify-center text-center px-4 md:px-8">
				<div className="max-w-lg mx-auto space-y-8">
					<h2 className="text-4xl md:text-6xl font-bold text-primary mb-4">
						Master Any Topic with Lightning-Fast AI Quizzes
					</h2>
					<p className="text-lg md:text-2xl text-textSecondary mb-8">
						Generate personalized quizzes instantly and track your progress with ease.
					</p>
					<button
						onClick={onStartClick}
						className="px-6 py-3 bg-primary text-white rounded-lg text-lg md:text-xl font-medium hover:bg-primary-dark transition-colors"
					>
						Get Started
					</button>
					<p className="text-sm text-textSecondary mt-4">
						Powered by SambaNova's Meta LLaMA model for lightning-fast question generation.
					</p>
				</div>
			</div>
		</div>
	);
};

Welcome.propTypes = {
	onStartClick: PropTypes.func.isRequired,
	onNavigate: PropTypes.func.isRequired
};

export default Welcome;