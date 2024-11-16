// src/services/firebase.js
import { auth, db } from '../config/firebase';
import {
	collection,
	addDoc,
	query,
	where,
	getDocs,
	orderBy,
	deleteDoc,
	limit,
	doc,
	writeBatch
} from 'firebase/firestore';
import {
	GoogleAuthProvider,
	signInWithPopup,
	signOut
} from 'firebase/auth';

// Auth
export const signInWithGoogle = async () => {
	try {
		return await signInWithPopup(auth, new GoogleAuthProvider());
	} catch (error) {
		console.error('Auth error:', error);
		throw error;
	}
};

export const logOut = async () => {
	try {
		await signOut(auth);
	} catch (error) {
		console.error('Logout error:', error);
		throw error;
	}
};

// Quiz Data
export const saveQuizResult = async (userId, quizData) => {
	try {
		return await addDoc(collection(db, 'quizResults'), {
			userId,
			topic: quizData.topic,
			score: quizData.score,
			totalQuestions: quizData.totalQuestions,
			difficulty: quizData.difficulty,
			timestamp: new Date()
		});
	} catch (error) {
		console.error('Save error:', error);
		throw error;
	}
};

export const getUserHistory = async (userId) => {
	try {
		const q = query(
			collection(db, 'quizResults'),
			where('userId', '==', userId),
			orderBy('timestamp', 'desc')
		);
		const snapshot = await getDocs(q);
		return snapshot.docs.map(doc => ({
			id: doc.id,
			...doc.data(),
			timestamp: doc.data().timestamp.toDate()
		}));
	} catch (error) {
		console.error('Get history error:', error);
		throw error;
	}
};

export const cleanupOldQuizzes = async (userId) => {
	try {
		const quizRef = collection(db, 'quizResults');

		const q = query(
			quizRef,
			where('userId', '==', userId),
			orderBy('timestamp', 'desc')
		);

		const snapshot = await getDocs(q);
		const quizzes = snapshot.docs.map(doc => ({
			id: doc.id,
			...doc.data(),
			timestamp: doc.data().timestamp.toDate()
		}));

		if (quizzes.length <= 10) return quizzes;

		// Process deletions in smaller batches
		const toDelete = quizzes.slice(10);
		const batchSize = 100; // Reduced batch size for better reliability

		for (let i = 0; i < toDelete.length; i += batchSize) {
			const batch = writeBatch(db);
			const chunk = toDelete.slice(i, i + batchSize);

			for (const quiz of chunk) {
				// Verify ownership before adding to batch
				if (quiz.userId === userId) {
					const docRef = doc(db, 'quizResults', quiz.id);
					batch.delete(docRef);
				}
			}

			try {
				await batch.commit();
			} catch (error) {
				console.warn(`Batch delete attempt failed: ${error.message}`);
				// Continue with next batch despite errors
			}
		}

		return quizzes.slice(0, 10);
	} catch (error) {
		console.error('Cleanup operation failed:', error);
		// Return whatever we successfully fetched
		return [];
	}
};