const validateResponse = (data) => {
	if (!data?.questions?.length) {
		throw new Error('Invalid response format from API');
	}
	return data;
};

const generateQuestions = async (topic, difficulty) => {
	try {
		const systemMessage = `You are a helpful assistant. Respond with pure JSON format without any additional text or formatting. The JSON should be structured as follows: {"questions":[{"question":"","options":["","","",""],"correct":0}]}.`;
		const userMessage = `Generate 10 multiple choice questions about ${topic} at ${difficulty} level.`;

		const response = await fetch('https://api.sambanova.ai/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${import.meta.env.VITE_SAMBANOVA_API_KEY}`,
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