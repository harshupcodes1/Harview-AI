<div align="center">
  <img src="https://ui-avatars.com/api/?name=H+V&size=128&background=0D8ABC&color=fff&bold=true" alt="Harview AI Logo" width="100"/>
  <h1>🚀 Harview AI (InterviewIQ)</h1>
  <p><strong>The Ultimate AI-Powered Interview Co-Pilot & ATS Analyzer</strong></p>

  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
  [![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
</div>

<br />

## 🌟 Overview
**Harview AI** is a next-generation mock interview and resume analysis platform. It leverages Google's Gemini 1.5 AI and TensorFlow Face Detection to simulate hyper-realistic interview environments. It evaluates candidates on technical accuracy, communication skills, and provides instant actionable feedback to help secure top-tier job offers.

## ✨ Key Features
- **🤖 AI Mock Interviews:** Real-time conversational AI interviews tailored to any specific Job Description and Experience level.
- **👁️ Anti-Cheat AI Proctoring:** Uses TensorFlow (`Blazeface`) to ensure the user is looking at the camera during the interview.
- **🎙️ Voice-to-Text Integration:** Answer questions naturally using your microphone with real-time transcription (Supports English & Hindi).
- **📝 Resume ATS Matcher:** Upload your PDF resume against a Job Description and instantly get a Match Percentage and missing keyword analysis.
- **💳 Razorpay Integration:** fully functioning gateway for purchasing 'Career Credits' (Tokens).
- **🛡️ Secure Authentication:** Google Firebase Auth integration for seamless login.
- **📊 Performance Analytics:** Track your average AI scores and past interview matrices from a dynamic user dashboard.

## 🛠️ Tech Stack
- **Frontend:** React.js, Tailwind CSS, Framer Motion, Vite
- **Backend:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **AI & ML:** Google Gen AI (Gemini 1.5 Flash), TensorFlow.js (Blazeface)
- **Authentication:** Firebase
- **Payment Gateway:** Razorpay

---

## 🚀 Run Locally

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/InterviewIQ.git
cd InterviewIQ
```

### 2. Setup the Backend (Terminal 1)
```bash
cd server
npm install
```
Create a `.env` file in the `server` folder with the following keys:
```env
PORT=5000
MONGO_URI=your_mongodb_cluster_uri
GEMINI_API_KEY=your_google_gemini_key
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
```
Run the server:
```bash
npm start
```

### 3. Setup the Frontend (Terminal 2)
```bash
cd client
npm install
```
Create a `.env` file in the `client` folder (if you use specific frontend env variables like Firebase).
Run the frontend:
```bash
npm run dev
```

## 📸 Screenshots
*(Coming Soon)*
![alt text](<Screenshot 2026-03-15 233304.png>)
![alt text](<Screenshot 2026-03-15 233346.png>)
<br />

---
<div align="center">
  <p>Developed with ❤️ by <strong>Harsh Upadhyay</strong></p>
</div>
