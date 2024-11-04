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

					<div className="relative" ref={dropdownRef}>
						<button
							onClick={user ? () => setShowDropdown(!showDropdown) : handleAuth}
							className="px-6 py-3 bg-transparent border-2 border-primary rounded-lg 
    hover:bg-primary/10 transition-colors flex items-center space-x-2 
    text-primary font-medium focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/50"
						>
							{user ? (
								<>
									<UserCircle className="w-8 h-8" />
									<span>{user.displayName}</span>
								</>
							) : (
								<span>Sign In</span>
							)}
						</button>
						{showDropdown && (
							<div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg">
								<button
									onClick={logout}
									className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100"
								>
									Sign Out
								</button>
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
	onNavigate: PropTypes.func.isRequired,
};

export default Welcome;