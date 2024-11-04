// src/config/firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: "quizmaster-3e02c.firebaseapp.com",
	projectId: "quizmaster-3e02c",
	storageBucket: "quizmaster-3e02c.firebasestorage.app",
	messagingSenderId: "6288920088",
	appId: "1:6288920088:web:13f423bd26be3256a03d6d",
	measurementId: "G-XWR6XLJJY2"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);