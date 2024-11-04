/** @type {import('tailwindcss').Config} */
export default {
	content: [
		"./index.html",
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			colors: {
				primary: '#D84315', // Dark orange primary color
				secondary: '#FF7043', // Light orange secondary color
				accent: '#FFCC80', // Light orange accent color
				background: '#FFE0B2', // More visible orange background color
				text: '#3E2723', // Dark brown text color for contrast
				textSecondary: '#795548', // Lighter brown text color for secondary text
			},
		},
	},
	plugins: [],
}