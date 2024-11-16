// src/components/Profile.jsx
import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useAuth } from '../context/AuthContext';
import { getUserHistory, cleanupOldQuizzes } from '../services/firebase';
import { ArrowLeft, Trophy, Star, Circle } from 'lucide-react'; // Add icons import
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Add this component above your main Profile component
const ProfileImage = ({ src, alt = "Profile picture", size = "md" }) => {
	const [imageError, setImageError] = useState(false);

	const sizeClasses = {
		sm: "w-8 h-8",
		md: "w-12 h-12",
		lg: "w-16 h-16"
	};

	return (
		<div className={`${sizeClasses[size]} rounded-full overflow-hidden`}>
			<img
				src={imageError ? "/default-avatar.png" : src}
				alt={alt}
				className="w-full h-full object-cover"
				onError={() => setImageError(true)}
				loading="lazy"
			/>
		</div>
	);
};

const Profile = ({ onNavigate }) => {
	const { user } = useAuth();
	const [history, setHistory] = useState([]);
	const [loading, setLoading] = useState(true);
	const [chartLoading, setChartLoading] = useState(true);
	const [isExpanded, setIsExpanded] = useState(false);

	useEffect(() => {
		const fetchHistory = async () => {
			try {
				setLoading(true);
				// Clean up and get latest 10 quizzes
				const results = await cleanupOldQuizzes(user.uid);
				setHistory(results);
			} catch (error) {
				console.error('Failed to fetch history:', error);
			} finally {
				setLoading(false);
			}
		};

		if (user) {
			fetchHistory();
		}
	}, [user]);

	const getChartData = (history) => {
		const sortedHistory = [...history]
			.sort((a, b) => b.timestamp - a.timestamp)
			.slice(0, 6)
			.reverse()
			.map(quiz => ({
				name: quiz.topic.length > 20 ? quiz.topic.substring(0, 20) + '...' : quiz.topic,
				score: quiz.score,
				average: quiz.totalQuestions / 2 // Adding baseline for comparison
			}));
		return sortedHistory;
	};

	// Add score indicator function
	const getScoreIndicator = (score, total) => {
		const percentage = (score / total) * 100;

		if (percentage >= 90) {
			return <Trophy className="w-5 h-5 text-yellow-500" />;
		} else if (percentage >= 70) {
			return <Star className="w-5 h-5 text-gray-400" />;
		} else if (percentage >= 50) {
			return <Circle className="w-5 h-5 text-amber-700" />;
		}
		return null;
	};

	// Custom Tooltip
	const CustomTooltip = ({ active, payload, label }) => {
		if (active && payload && payload.length) {
			return (
				<div className="bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border border-accent">
					<p className="text-primary font-semibold mb-1">{label}</p>
					<p className="text-primary/70">Score: {payload[0].value}</p>
				</div>
			);
		}
		return null;
	};

	// Update displayedHistory to show latest entries
	const displayedHistory = isExpanded
		? [...history].sort((a, b) => b.timestamp - a.timestamp).slice(0, 20) // Latest 20
		: [...history].sort((a, b) => b.timestamp - a.timestamp).slice(0, 5); // Latest 5

	return (
		<div className="min-h-screen bg-background flex flex-col">
			{/* Navbar - matched to Welcome */}
			<nav className="px-4 md:px-8 py-4 bg-white/50 backdrop-blur-sm">
				<div className="container mx-auto flex items-center">
					<button
						onClick={() => onNavigate('welcome')}
						className="text-primary/90 hover:text-secondary flex items-center space-x-2 bg-transparent border border-accent hover:border-secondary transition-colors px-4 py-2 rounded-lg"
					>
						<ArrowLeft className="w-5 h-5" />
						<span>Back</span>
					</button>
				</div>
			</nav>

			<div className="container mx-auto px-4 md:px-8 py-8">
				{/* Profile Card */}
				<div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg mb-8 border border-accent">
					<div className="flex items-center space-x-4">
						<ProfileImage
							src={user?.photoURL}
							alt={`${user?.displayName}'s profile`}
							size="md"
						/>
						<div>
							<h2 className="text-2xl font-bold text-primary">{user?.displayName}</h2>
							<p className="text-primary/70">{user?.email}</p>
						</div>
					</div>
				</div>

				{/* Quiz History Card */}
				<div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg animate-fade-in-up border border-accent">
					<h3 className="text-xl font-bold text-primary mb-4">Quiz History</h3>
					{loading ? (
						<div className="flex justify-center py-8">
							<div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
						</div>
					) : history.length > 0 ? (
						<>
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead>
										<tr className="border-b-2 border-accent/20">
											<th className="py-3 px-2 text-left text-primary/90 w-10"></th>
											<th className="py-3 px-2 text-left text-primary/90">Topic</th>
											<th className="py-3 px-2 text-left text-primary/90">Score</th>
											<th className="py-3 px-2 text-left text-primary/90 hidden sm:table-cell">Difficulty</th>
											<th className="py-3 px-2 text-left text-primary/90 hidden sm:table-cell">Date</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-blue-50">
										{displayedHistory.map((quiz) => (
											<tr key={quiz.id} className="hover:bg-blue-50/50 transition-colors">
												<td className="py-3 px-2">
													{getScoreIndicator(quiz.score, quiz.totalQuestions)}
												</td>
												<td className="py-3 px-2 text-blue-900 max-w-[150px] sm:max-w-none truncate">
													{quiz.topic}
												</td>
												<td className="py-3 px-2 whitespace-nowrap">
													<span className="px-2 py-1 bg-blue-100 rounded text-blue-800">
														{quiz.score}/{quiz.totalQuestions}
													</span>
												</td>
												<td className="py-3 px-2 capitalize text-blue-700 hidden sm:table-cell">
													{quiz.difficulty}
												</td>
												<td className="py-3 px-2 text-blue-600 hidden sm:table-cell">
													{new Date(quiz.timestamp).toLocaleDateString()}
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>
							{history.length > 5 && (
								<button
									onClick={() => setIsExpanded(!isExpanded)}
									className="w-full text-center mt-4 bg-primary hover:bg-primary-dark text-white px-4 py-2 rounded-lg transition-all duration-200 font-semibold"
								>
									{isExpanded ? 'Show less' : 'Show more'}
								</button>
							)}
						</>
					) : (
						<div className="text-center py-12">
							<p className="text-lg text-primary/90">No quiz history yet</p>
							<p className="text-sm mt-2 text-primary/70">Complete some quizzes to see them here!</p>
						</div>
					)}
				</div>

				{history.length > 0 && (
					<div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 shadow-lg mt-8 border border-accent">
						<h3 className="text-xl font-bold text-primary mb-6">Performance Overview</h3>
						<div className="h-[400px] -mx-6 sm:mx-0"> {/* Negative margin on mobile */}
							<ResponsiveContainer width="100%" height="100%">
								<AreaChart
									data={getChartData(history)}
									margin={{
										top: 20,
										right: 10,
										left: 0,
										bottom: 40 // Increased bottom margin for desktop
									}}
								>
									<defs>
										<linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
											<stop offset="5%" stopColor="#FF7043" stopOpacity={0.2} />
											<stop offset="95%" stopColor="#FF7043" stopOpacity={0} />
										</linearGradient>
									</defs>
									<CartesianGrid strokeDasharray="3 3" stroke="#FFCC80" opacity={0.2} />
									<XAxis
										dataKey="name"
										stroke="#D84315"
										fontSize={12}
										tickMargin={10}
										interval={0}
										height={40} // Increased height for text
										opacity={0.7}
										className="hidden sm:block" // Hide on mobile, show on desktop
									/>
									<YAxis
										stroke="#D84315"
										opacity={0.7}
										domain={[0, 10]}
										ticks={[0, 2, 4, 6, 8, 10]}
									/>
									<Tooltip content={<CustomTooltip />} />
									<Area
										type="monotone"
										dataKey="score"
										stroke="#FF7043"
										strokeWidth={2}
										strokeOpacity={0.7}
										fill="url(#scoreGradient)"
										animationDuration={1000}
										activeDot={{ r: 6, fill: "#FF7043", opacity: 0.8 }}
									/>
								</AreaChart>
							</ResponsiveContainer>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

Profile.propTypes = {
	onNavigate: PropTypes.func.isRequired
};

export default Profile;