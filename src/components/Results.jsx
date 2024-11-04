import React, { useState, useEffect, useRef } from 'react'; // Add useRef here
import PropTypes from 'prop-types';
import Confetti from 'react-confetti';
import { useAuth } from '../context/AuthContext';
import { saveQuizResult } from '../services/firebase';

const Results = ({
	score,
	totalQuestions,
	topic,
	difficulty,
	onNewQuiz,
	onNavigate,
}) => {
	// Add saveAttempted ref before other state declarations
	const saveAttempted = useRef(false);

	const [saving, setSaving] = useState(false);
	const [saveError, setSaveError] = useState(null);
	const [saved, setSaved] = useState(false);
	const { user, login } = useAuth();

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
			// Check saveAttempted.current here
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

	const handleSignIn = async () => {
		try {
			await login();
		} catch (error) {
			console.error('Login error:', error);
		}
	};

	return (
		<div className="min-h-screen bg-background flex flex-col overflow-hidden">
			{isExcellentScore && (
				<div className="fixed inset-0 pointer-events-none">
					<Confetti
						width={window.innerWidth}
						height={window.innerHeight}
						recycle={false}
						numberOfPieces={200}
					/>
				</div>
			)}

			{/* Header - Hidden on mobile, visible on sm and up */}
			<nav className="hidden sm:block px-4 md:px-8 py-4 bg-white/50 backdrop-blur-sm">
				<div className="container mx-auto flex justify-between items-center">
					<div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
						<span className="text-white font-bold text-2xl">QM</span>
					</div>
				</div>
			</nav>

			{/* Main Content */}
			<div className="flex-grow flex items-center justify-center">
				<div className="w-full max-w-lg mx-auto px-4">
					<div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-accent">
						<h2 className="text-3xl font-bold text-primary mb-6">Quiz Complete!</h2>

						{/* Score Circle */}
						<div className="w-48 h-48 mx-auto mb-8 relative">
							<div className="absolute inset-0 flex items-center justify-center">
								<div className="text-center">
									<div className="text-5xl font-bold text-primary">{percentage}%</div>
									<div className="text-primary/70 mt-2">Score</div>
								</div>
							</div>
							<svg className="w-full h-full" viewBox="0 0 100 100">
								<circle
									cx="50"
									cy="50"
									r="45"
									fill="none"
									stroke="#FFE0B2"
									strokeWidth="10"
								/>
								<circle
									cx="50"
									cy="50"
									r="45"
									fill="none"
									stroke="#D84315"
									strokeWidth="10"
									strokeDasharray={`${percentage * 2.83} 283`}
									transform="rotate(-90 50 50)"
								/>
							</svg>
						</div>

						{/* Stats */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8 px-4 sm:px-0">
							<div className="bg-accent/20 rounded-xl p-4">
								<div className="text-primary/70">Correct Answers</div>
								<div className="text-2xl font-bold text-primary">
									{score} / {totalQuestions}
								</div>
							</div>
							<div className="bg-accent/20 rounded-xl p-4">
								<div className="text-primary/70">Topic</div>
								<div className="text-2xl font-bold text-primary truncate">
									{topic}
								</div>
							</div>
						</div>

						{/* Actions */}
						<div className="flex flex-col gap-3 px-4 sm:px-0 sm:flex-row sm:justify-center sm:space-x-3">
							<button
								onClick={() => onNavigate('welcome')}
								className="w-full sm:w-auto px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
							>
								Back to Home
							</button>
							<button
								onClick={() => onNavigate('profile')}
								className="w-full sm:w-auto px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
							>
								View Profile
							</button>
							<button
								onClick={onNewQuiz}
								className="w-full sm:w-auto px-6 py-3 border-2 border-primary text-primary bg-transparent rounded-lg hover:bg-accent/20 transition-colors"
							>
								New Quiz
							</button>
						</div>

						{/* Auth/Save Section */}
						<div className="mt-6 space-y-4">
							{!user ? (
								<div className="p-4 bg-accent/20 rounded-lg text-center">
									<p className="text-primary mb-2">Sign in to save your progress</p>
									<button
										onClick={handleSignIn}
										className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
									>
										Sign in with Google
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
	);
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