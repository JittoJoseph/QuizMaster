// src/components/QuizInterface.jsx
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { CheckCircle, XCircle } from 'lucide-react';

const QuizInterface = ({
	question,
	currentQuestion,
	totalQuestions,
	onAnswerSubmit,
	onComplete
}) => {
	const [selectedAnswer, setSelectedAnswer] = useState(null);
	const [answered, setAnswered] = useState(false);
	const [showExplanation, setShowExplanation] = useState(false);
	const [score, setScore] = useState(0);

	const handleNext = () => {
		if (selectedAnswer === null) return;

		const isCorrect = selectedAnswer === question.correct;
		if (isCorrect) {
			setScore(prev => prev + 1);
		}
		onAnswerSubmit(isCorrect);
		setSelectedAnswer(null);
		setAnswered(false);

		if (currentQuestion + 1 === totalQuestions) {
			onComplete();
		}
	};

	const handleAnswerSelect = (index) => {
		setSelectedAnswer(index);
		setAnswered(true);
	};

	const getOptionClass = (index) => {
		if (!answered) return selectedAnswer === index ? 'bg-blue-100 border-2 border-blue-600' : 'hover:bg-blue-50 border-2 border-transparent';
		if (index === question.correct) return 'bg-green-100 border-2 border-green-600';
		if (selectedAnswer === index) return 'bg-red-100 border-2 border-red-600';
		return 'opacity-50 border-2 border-transparent';
	};

	const getAnswerIcon = (index) => {
		if (index === question.correct) {
			return <CheckCircle className="w-5 h-5 text-green-600" />;
		}
		if (selectedAnswer === index) {
			return <XCircle className="w-5 h-5 text-red-600" />;
		}
		return null;
	};

	if (!question) return null;

	return (
		<div className="min-h-screen bg-background flex flex-col">
			{/* Header with Progress */}
			<nav className="px-4 md:px-8 py-4 bg-white/50 backdrop-blur-sm">
				<div className="container mx-auto">
					<div className="flex justify-between items-center mb-4">
						<div className="flex items-center space-x-4">
							<div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
								<span className="text-white font-bold text-2xl">QM</span>
							</div>
							<h1 className="text-3xl font-bold text-primary">QuizMaster</h1>
						</div>
						<div className="flex items-center space-x-6 text-primary/70">
							<div className="flex items-center space-x-2">
								<span className="font-medium">Score:</span>
								<span className="px-3 py-1 bg-primary/10 rounded-full font-semibold">
									{score}/{totalQuestions}
								</span>
							</div>
							<div>
								Question {currentQuestion + 1} of {totalQuestions}
							</div>
						</div>
					</div>

					{/* Progress Bar */}
					<div className="w-full h-2 bg-accent/30 rounded-full overflow-hidden">
						<div
							className="h-full bg-primary transition-all duration-300 rounded-full"
							style={{ width: `${((currentQuestion + 1) / totalQuestions) * 100}%` }}
						/>
					</div>
				</div>
			</nav>

			{/* Main Content - Centered */}
			<div className="flex-grow container mx-auto px-4 md:px-8 py-8 flex items-center justify-center">
				<div className="w-full max-w-3xl">
					<div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg border border-accent">
						{/* Question */}
						<h2 className="text-2xl font-bold text-primary mb-6">
							{question.question}
						</h2>

						{/* Options */}
						<div className="space-y-4">
							{question.options.map((option, index) => (
								<button
									key={index}
									onClick={() => {
										if (!answered) {
											setSelectedAnswer(index);
											setAnswered(true);
										}
									}}
									className={`w-full p-4 rounded-lg border-2 transition-all duration-200 text-left bg-transparent
										${answered
											? index === question.correct
												? 'bg-green-50 border-green-500'
												: index === selectedAnswer
													? 'bg-red-50 border-red-500'
													: 'opacity-50 border-transparent'
											: selectedAnswer === index
												? 'bg-accent/20 border-accent'
												: 'hover:bg-accent/10 border-transparent'
										}`}
								>
									<div className="flex items-center space-x-3">
										<span className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-semibold">
											{String.fromCharCode(65 + index)}
										</span>
										<span className="text-primary/90">{option}</span>
										{answered && getAnswerIcon(index)}
									</div>
								</button>
							))}
						</div>

						{/* Next Button */}
						<div className="mt-6 flex justify-end">
							<button
								onClick={handleNext}
								disabled={selectedAnswer === null}
								className="px-6 py-3 bg-primary text-white rounded-lg text-lg font-medium 
									hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
							>
								{currentQuestion + 1 === totalQuestions ? 'Finish' : 'Next'}
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

QuizInterface.propTypes = {
	question: PropTypes.object.isRequired,
	currentQuestion: PropTypes.number.isRequired,
	totalQuestions: PropTypes.number.isRequired,
	onAnswerSubmit: PropTypes.func.isRequired,
	onComplete: PropTypes.func.isRequired
};

export default QuizInterface;