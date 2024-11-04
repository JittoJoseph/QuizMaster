const shuffleArray = (array) => {
	// Create index map to track original positions
	const indexMap = array.map((_, i) => i);

	// Fisher-Yates shuffle
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[array[i], array[j]] = [array[j], array[i]];
		[indexMap[i], indexMap[j]] = [indexMap[j], indexMap[i]];
	}
	return { shuffled: array, indexMap };
};

const validateResponse = (data) => {
	if (!data?.questions?.length) {
		throw new Error('Invalid response format from API');
	}

	// Shuffle options for each question
	const shuffledQuestions = data.questions.map(question => {
		const { shuffled, indexMap } = shuffleArray([...question.options]);
		return {
			...question,
			options: shuffled,
			correct: indexMap.indexOf(question.correct) // Fix: Find where original correct index went
		};
	});

	return { questions: shuffledQuestions };
};

const generateQuestions = async (topic, difficulty) => {
	try {
		const systemMessage = `You are a helpful assistant. Respond with pure JSON format without any additional text or formatting. The JSON should be structured as follows: {"questions":[{"question":"","options":["","","",""],"correct":0}]}.`;
		const userMessage = `Generate 10 multiple choice questions about ${topic} at ${difficulty} level.`;

		const response = await fetch('/api/chat', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				model: 'Meta-Llama-3.1-8B-Instruct',
				messages: [
					{
						role: 'system',
						content: systemMessage
					},
					{
						role: 'user',
						content: userMessage
					}
				],
				temperature: 0.1,
				top_p: 0.1
			})
		});

		if (!response.ok) {
			throw new Error(`API request failed: ${response.status}`);
		}

		const data = await response.json();
		const parsedData = JSON.parse(data.choices[0].message.content);
		return validateResponse(parsedData);

	} catch (error) {
		console.error('Error generating questions:', error);
		throw new Error(`Failed to fetch questions: ${error.message}`);
	}
};

export { generateQuestions };