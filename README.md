# QuizMaster 🎯

**QuizMaster** is an AI-powered quiz generation platform that creates personalized learning experiences using Meta's LLaMA 3.1 70B model through SambaNova's API. Generate custom quizzes on any topic instantly, tailored to your selected difficulty level, and track your learning progress with ease.

## Features

- **User-Defined Topics**: Enter any topic you desire, and the AI will generate a unique quiz tailored to that subject.
- **Multiple Difficulty Levels**: Choose between Beginner, Intermediate, and Advanced levels.
- **Real-Time Question Generation**: Leverages SambaNova's API to interact with Meta's LLaMA 3.1 model, generating multiple-choice questions on the fly.
- **Immediate Feedback**: Receive instant responses to your answers for an engaging learning experience.
- **Progress Tracking**: Monitor your learning journey with detailed statistics and performance analytics.
- **User Profiles**: Save quiz history and revisit past quizzes.
- **Responsive Design**: Enjoy a seamless experience across all devices.

## Tech Stack

- **Frontend**:
  - React 18
  - Vite
  - Tailwind CSS
- **Backend Services**:
  - Firebase Authentication
  - Firebase Firestore
- **AI Integration**:
  - SambaNova API (Meta LLaMA 3.1)
- **Deployment**:
  - Vercel (Edge Runtime)

## Prerequisites

- **Node.js** version 16 or higher installed on your machine.
- **Firebase Account** for authentication and database services.
- **SambaNova API Access** to utilize the AI model (Meta's LLaMA 3.1).

## Setup Instructions

### 1. Clone the Repository

Clone the repository to your local machine using:

```bash
git clone https://github.com/yourusername/QuizMaster.git
cd QuizMaster
```

### 2. Install Dependencies

Install the required dependencies using npm:

```bash
npm install
```

### 3. Firebase Setup

**a. Create a Firebase Project**

- Go to the [Firebase Console](https://console.firebase.google.com).
- Click **Add project** and follow the prompts to create a new project.

**b. Enable Authentication**

- In your Firebase project, navigate to **Authentication** > **Sign-in method**.
- Enable **Google Sign-in** under **Sign-in providers**.

**c. Create Firestore Database**

- Navigate to **Firestore Database** in the Firebase console.
- Click **Create database** and select **Start in test mode** (ensure appropriate security rules for production).

**d. Register a Web App and Obtain Config**

- Go to **Project settings** (the gear icon).
- In the **General** tab, scroll down to **Your apps**.
- Click on the **</>** icon to add a web app.
- Register the app (you can name it "QuizMaster") and click **Register app**.
- Copy the provided Firebase configuration (you'll need this in the next step).

### 4. SambaNova API Setup

Ensure you have access to the SambaNova API to utilize Meta's LLaMA 3.1 model. Obtain your `SAMBANOVA_API_KEY` from your SambaNova account.

### 5. Environment Setup

Create a .env file in the root directory of your project and add the following environment variables:

```env
# .env
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
SAMBANOVA_API_KEY=your_sambanova_api_key
```

*Replace all placeholder values with the actual configuration details from your Firebase project and SambaNova account.*


### 6. Start the Development Server

Run the following command to start the development server:

```bash
npm run dev
```

The application should now be running on `http://localhost:3000/` (or the port specified in your terminal).

## Deployment

### 1. Push Code to GitHub

Commit your changes and push the code to a GitHub repository.

### 2. Deploy on Vercel

**a. Sign Up or Log In**

- Go to [Vercel](https://vercel.com) and sign up or log in with your GitHub account.

**b. Import Your Repository**

- Click on **New Project** and import your QuizMaster repository.

**c. Configure Project Settings**

- **Framework Preset**: Select **Vite**.
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

**d. Set Environment Variables**

- In the **Environment Variables** section, add all the environment variables from your .env file.
- Be sure to include `SAMBANOVA_API_KEY` and all the `VITE_FIREBASE_*` variables.

**e. Deploy**

- Click **Deploy** to start the deployment process.
- Once deployed, your application will be available at the provided Vercel URL.

## Important Notes

- **Firebase Security Rules**: If you plan to use the application in production, update your Firebase Firestore security rules to restrict unauthorized access.
- **SambaNova API Usage**: Be mindful of the usage limits and costs associated with the SambaNova API.

## License

This project is licensed under the Apache License 2.0 - see the LICENSE file for details.

## Contact

For any inquiries or support, please contact:

- **Jitto Joseph** - [@JittoJoseph50](https://twitter.com/JittoJoseph50)