export async function generateQuestions(topic, difficulty) {
	try {
		const apiKey = import.meta.env.VITE_SAMBANOVA_API_KEY;
		if (!apiKey) {
			throw new Error('SambaNova API key is not configured');
		}

		const systemMessage = `You are a helpful assistant. Respond with pure JSON format without any additional text or formatting. The JSON should be structured as follows: {"questions":[{"question":"","options":["","","",""],"correct":0}]}.`;
		const userMessage = `Generate 10 multiple choice questions about ${topic} at ${difficulty} level.`;

		const response = await fetch('https://api.sambanova.ai/v1/chat/completions', {
			method: 'POST',
			headers: {
				'Authorization': `Bearer ${apiKey}`,
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
				]
			})
		});

		if (!response.ok) {
			throw new Error('Failed to fetch from SambaNova API');
		}

		const result = await response.json();
		if (!result?.choices?.[0]?.message?.content) {
			throw new Error('No response from AI');
		}

		let text = result.choices[0].message.content.trim();
		text = text
			.replace(/[\u201C\u201D\u2018\u2019]/g, '"')
			.replace(/```json\s*|\s*```/g, '')
			.replace(/\n/g, '')
			.replace(/,\s*([}\]])/g, '$1')
			.replace(/([{,]\s*)(\w+)(:)/g, '$1"$2"$3')
			.trim();

		if (!text.startsWith('{') || !text.endsWith('}')) {
			throw new Error('Invalid JSON structure in AI response');
		}

		try {
			const parsed = JSON.parse(text);
			if (!parsed.questions || !Array.isArray(parsed.questions)) {
				throw new Error('Invalid response structure: missing questions array');
			}
			return parsed;
		} catch (error) {
			throw new Error('Failed to parse JSON');
		}
	} catch (error) {
		console.error('Error generating questions:', error);
		throw error;
	}
}