import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import Confetti from 'react-confetti';
import { useAuth } from '../context/AuthContext';
import { saveQuizResult } from '../services/firebase';

const CircleProgress = ({ percentage }) => (
	<div className="relative w-48 h-48">
		<svg className="w-full h-full" viewBox="0 0 100 100">
			{/* Background circle */}
			<circle
				className="text-accent/30 stroke-current"
				strokeWidth="8"
				cx="50"
				cy="50"
				r="45"
				fill="none"
			/>
			{/* Progress circle */}
			<circle
				className="text-primary stroke-current"
				strokeWidth="8"
				strokeLinecap="round"
				cx="50"
				cy="50"
				r="45"
				fill="none"
				transform="rotate(-90 50 50)"
				strokeDasharray={`${percentage * 2.83} ${283 - percentage * 2.83}`}
			/>
		</svg>
		<div className="absolute inset-0 flex flex-col items-center justify-center">
			<span className="text-5xl font-bold text-primary">{percentage}%</span>
		</div>
	</div>
);


const Results = ({
	score,
	totalQuestions,
	topic,
	difficulty,
	onNewQuiz,
	onNavigate,
}) => {
	const saveAttempted = useRef(false);
	const [saving, setSaving] = useState(false);
	const [saveError, setSaveError] = useState(null);
	const [saved, setSaved] = useState(false);
	const [isSigningIn, setIsSigningIn] = useState(false);
	const { user, login } = useAuth();
	const [showConfetti, setShowConfetti] = useState(true);
	const [isGeneratingConfetti, setIsGeneratingConfetti] = useState(true);

	const percentage = totalQuestions > 0 ? Math.round((score / totalQuestions) * 100) : 0;
	const isExcellentScore = percentage >= 90;
	const googleColors = ['#4285F4', '#DB4437', '#F4B400', '#0F9D58'];


	const saveResult = async (currentUser) => {
		if (!currentUser || saving || saved) return;

		try {
			setSaving(true);
			const quizResult = {
				topic,
				score,
				totalQuestions,
				difficulty,
				timestamp: Date.now()
			};
			await saveQuizResult(currentUser.uid, quizResult);
			setSaved(true);
		} catch (error) {
			console.error('Save error:', error);
			setSaveError(error.message);
		} finally {
			setSaving(false);
		}
	};

	useEffect(() => {
		let mounted = true;

		const save = async () => {
			if (user && !saving && !saved && !saveAttempted.current) {
				saveAttempted.current = true;
				if (mounted) {
					await saveResult(user);
				}
			}
		};

		save();

		return () => {
			mounted = false;
		};
	}, [user]);

	useEffect(() => {
		if (isExcellentScore) {
			const timer = setTimeout(() => {
				setShowConfetti(false);
			}, 3000); // 3 seconds

			return () => clearTimeout(timer);
		}
	}, []);

	useEffect(() => {
		if (isExcellentScore) {
			const timer = setTimeout(() => {
				setIsGeneratingConfetti(false); // Stop generating new pieces
			}, 3000);

			return () => clearTimeout(timer);
		}
	}, []);

	const handleViewProfile = async () => {
		if (!user) {
			try {
				setIsSigningIn(true);
				await login();
				// Only navigate after successful login
				if (user) {
					onNavigate('profile');
				}
			} catch (error) {
				console.error('Login error:', error);
				setSaveError('Failed to sign in. Please try again.');
			} finally {
				setIsSigningIn(false);
			}
		} else {
			onNavigate('profile');
		}
	};

	return (
		<div className="min-h-screen bg-background flex flex-col overflow-hidden">
			{isExcellentScore && (
				<div className="fixed inset-0 pointer-events-none">
					<Confetti
						width={window.innerWidth}
						height={window.innerHeight}
						colors={googleColors}
						recycle={isGeneratingConfetti} // Only generate new pieces while true
						numberOfPieces={200}
					/>
				</div>
			)}

			<div className="flex-grow flex flex-col items-center justify-center px-4 py-8">
				<div className="w-full max-w-2xl">
					<div className="bg-white/90 rounded-lg shadow-lg p-8">
						<h2 className="text-3xl font-bold text-primary mb-8 text-center">
							Quiz Results
						</h2>

						<div className="space-y-8">
							{/* Score Circle */}
							<div className="flex flex-col items-center">
								<CircleProgress percentage={percentage} />
								<p className="mt-4 text-lg text-primary/70">
									You scored <span className="font-semibold">{score}</span> out of{" "}
									<span className="font-semibold">{totalQuestions}</span>
								</p>
							</div>

							{/* Quiz Details */}
							<div className="bg-accent/10 rounded-lg p-6 space-y-3">
								<div className="flex justify-between items-center">
									<span className="text-primary/70">Topic</span>
									<span className="font-semibold text-primary">{topic}</span>
								</div>
								<div className="flex justify-between items-center">
									<span className="text-primary/70">Difficulty</span>
									<span className="font-semibold text-primary capitalize">
										{difficulty}
									</span>
								</div>
							</div>

							{/* Action Buttons */}
							<div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
								<button
									onClick={() => onNavigate('welcome')}
									className="w-full sm:w-auto px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
								>
									Back to Home
								</button>
								<button
									onClick={handleViewProfile}
									disabled={isSigningIn}
									className={`w-full sm:w-auto px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors ${isSigningIn ? 'opacity-50 cursor-not-allowed' : ''
										}`}
								>
									{isSigningIn ? 'Signing In...' : 'View Profile'}
								</button>
								<button
									onClick={onNewQuiz}
									className="w-full sm:w-auto px-6 py-3 border-2 border-primary text-primary bg-transparent rounded-lg hover:bg-accent/20 transition-colors"
								>
									New Quiz
								</button>
							</div>

							{/* Auth/Save Section */}
							<div className="space-y-4">
								{!user ? (
									<div className="p-4 bg-accent/20 rounded-lg text-center">
										<p className="text-primary mb-2">Sign in to save your progress</p>
										<button
											onClick={handleViewProfile}
											disabled={isSigningIn}
											className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
										>
											{isSigningIn ? 'Signing In...' : 'Sign in with Google'}
										</button>
									</div>
								) : saving ? (
									<div className="text-primary font-medium text-center">
										Saving your result...
									</div>
								) : saved ? (
									<div className="text-primary font-medium text-center">
										Result saved successfully!
									</div>
								) : null}

								{saveError && (
									<div className="text-red-600 font-medium text-center">
										{saveError}
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

CircleProgress.propTypes = {
	percentage: PropTypes.number.isRequired,
};

Results.propTypes = {
	score: PropTypes.number.isRequired,
	totalQuestions: PropTypes.number.isRequired,
	topic: PropTypes.string.isRequired,
	difficulty: PropTypes.string,
	onNewQuiz: PropTypes.func.isRequired,
	onNavigate: PropTypes.func.isRequired,
};

export default Results;