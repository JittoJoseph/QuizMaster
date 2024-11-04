// src/services/ai.js

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

	// Validate and fix questions
	const validQuestions = data.questions.filter(question => {
		// Must have exactly 4 options
		return question.options?.length === 4 &&
			question.correct >= 0 &&
			question.correct < 4;
	});

	if (validQuestions.length < 10) {
		throw new Error('Not enough valid questions received');
	}

	// Shuffle options for valid questions
	const shuffledQuestions = validQuestions.map(question => {
		const { shuffled, indexMap } = shuffleArray([...question.options]);
		return {
			...question,
			options: shuffled,
			correct: indexMap.indexOf(question.correct)
		};
	});

	return { questions: shuffledQuestions };
};

const generateQuestions = async (topic, difficulty) => {
	try {
		const systemMessage = `You are a quiz generator. Generate exactly 10 questions with exactly 4 options each. Format: {"questions":[{"question":"","options":["","","",""],"correct":0}]}. Ensure 'correct' is 0-3. No additional text.`;

		const userMessage = `Generate 10 multiple choice questions about ${topic} at ${difficulty} level. Each question must have exactly 4 options. Keep it simple, no formatting, just raw JSON.`;

		const response = await fetch('/api/chat', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				model: 'Meta-Llama-3.1-70B-Instruct',
				messages: [
					{ role: 'system', content: systemMessage },
					{ role: 'user', content: userMessage }
				],
				temperature: 0.5,
				top_p: 0.7
			})
		});

		if (!response.ok) {
			throw new Error(`API request failed: ${response.status}`);
		}

		const data = await response.json();
		let text = data.choices[0].message.content;

		// Enhanced cleanup
		text = text
			.replace(/[\u201C\u201D\u2018\u2019]/g, '"') // Fix smart quotes
			.replace(/```json\s*|\s*```/g, '') // Remove code blocks
			.replace(/\n/g, '') // Remove newlines
			.replace(/,\s*([}\]])/g, '$1') // Remove trailing commas
			.replace(/([{,]\s*)(\w+)(:)/g, '$1"$2"$3') // Ensure property names are quoted
			.trim();

		// Validate JSON structure
		if (!text.startsWith('{') || !text.endsWith('}')) {
			throw new Error('Invalid JSON structure in AI response');
		}

		try {
			const parsed = JSON.parse(text);

			// Validate structure
			if (!parsed.questions || !Array.isArray(parsed.questions)) {
				throw new Error('Invalid response structure: missing questions array');
			}

			// Validate each question
			parsed.questions.forEach((q, i) => {
				if (!q.question || !Array.isArray(q.options) || q.correct === undefined) {
					throw new Error(`Invalid question structure at index ${i}`);
				}
				if (q.options.length !== 4) {
					throw new Error(`Question ${i} must have exactly 4 options`);
				}
			});

			return validateResponse(parsed);
		} catch (parseError) {
			console.error('JSON Parse Error:', parseError);
			console.error('Cleaned text:', text);
			throw new Error('Invalid JSON response from AI model');
		}

	} catch (error) {
		console.error('Error generating questions:', error);
		throw new Error(`Failed to fetch questions: ${error.message}`);
	}
};

export { generateQuestions };