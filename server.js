// server.js
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const port = 3001;

// SambaNova API configuration
const SAMBANOVA_API_URL = 'https://api.sambanova.ai/v1/chat/completions';
const API_TIMEOUT = 30000; // 30 seconds

app.use(cors());
app.use(express.json());

app.post('/api/chat', async (req, res) => {
	console.log('Received request body:', JSON.stringify(req.body, null, 2));

	try {
		if (!process.env.SAMBANOVA_API_KEY) {
			throw new Error('SAMBANOVA_API_KEY is not defined');
		}

		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), API_TIMEOUT);

		const response = await fetch(SAMBANOVA_API_URL, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${process.env.SAMBANOVA_API_KEY}`,
				'Accept': 'application/json',
				'X-API-Version': '1'
			},
			body: JSON.stringify(req.body),
			signal: controller.signal
		});

		clearTimeout(timeout);

		if (!response.ok) {
			const errorText = await response.text();
			console.error('SambaNova API Error:', {
				status: response.status,
				statusText: response.statusText,
				error: errorText,
				url: SAMBANOVA_API_URL
			});
			throw new Error(`API request failed: ${response.status} - ${errorText}`);
		}

		const data = await response.json();
		console.log('SambaNova API Response:', data);
		res.json(data);

	} catch (error) {
		console.error('Detailed Error:', {
			message: error.message,
			stack: error.stack,
			cause: error.cause,
			name: error.name
		});

		// Handle specific error types
		if (error.name === 'AbortError') {
			return res.status(504).json({ error: 'Request timeout' });
		}

		res.status(500).json({
			error: error.message,
			details: process.env.NODE_ENV === 'development' ? error.stack : undefined
		});
	}
});

app.listen(port, () => {
	console.log(`API server running on http://localhost:${port}`);
	console.log('Environment variables loaded:', {
		hasSambanovaKey: !!process.env.SAMBANOVA_API_KEY,
		apiUrl: SAMBANOVA_API_URL
	});
});