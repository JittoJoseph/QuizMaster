// src/components/QuizSetup.jsx
import React, { useState } from 'react';

const QuizSetup = ({ onSubmit }) => {
	const [formData, setFormData] = useState({
		topic: '',
		difficulty: 'intermediate'
	});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');

	const handleSubmit = async (e) => {
		e.preventDefault();
		if (!formData.topic.trim()) {
			setError('Please enter a topic');
			return;
		}

		setIsLoading(true);
		setError('');

		try {
			await onSubmit(formData);
		} catch (error) {
			setError('Failed to generate quiz. Please try again.');
			setIsLoading(false);
		}
	};

	return (
		<div className="min-h-screen bg-background flex flex-col">
			{/* Navbar */}
			<nav className="px-4 md:px-8 py-4 bg-white/50 backdrop-blur-sm">
				<div className="container mx-auto flex justify-between items-center">
					<div className="flex items-center space-x-2">
						<div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
							<span className="text-white font-bold text-xl">QM</span>
						</div>
						<h1 className="text-2xl font-bold text-primary">QuizMaster</h1>
					</div>
				</div>
			</nav>

			{/* Main Content */}
			<div className="flex-grow flex flex-col items-center justify-center text-center px-4 md:px-8">
				<div className="max-w-md w-full bg-white/90 p-8 rounded-lg shadow-md">
					<h2 className="text-2xl font-bold text-primary mb-4">Setup Your Quiz</h2>
					<form onSubmit={handleSubmit} className="space-y-6">
						<div>
							<label htmlFor="topic" className="block text-left text-text font-medium mb-2">Topic</label>
							<input
								type="text"
								id="topic"
								placeholder="Enter quiz topic"
								value={formData.topic}
								onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-primary focus:outline-none focus:border-primary"
							/>
						</div>
						<div>
							<label htmlFor="difficulty" className="block text-left text-text font-medium mb-2">Difficulty</label>
							<select
								id="difficulty"
								value={formData.difficulty}
								onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
								className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-white text-primary focus:outline-none focus:border-primary"
							>
								<option value="beginner">Beginner</option>
								<option value="intermediate">Intermediate</option>
								<option value="advanced">Advanced</option>
							</select>
						</div>
						{error && <p className="text-red-500 text-sm">{error}</p>}
						<button
							type="submit"
							disabled={isLoading}
							className="w-full px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
						>
							{isLoading ? 'Generating...' : 'Generate Quiz'}
						</button>
					</form>
				</div>
			</div>
		</div>
	);
};

export default QuizSetup;