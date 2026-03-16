const express = require('express');
const router = express.Router();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const User = require('../models/User');
const Interview = require('../models/Interview');

router.post('/generate', async (req, res) => {
    try {
        const { jobRole, jobDesc, experience, language = "English", user } = req.body;

        if (!user || !user.uid) {
            return res.status(401).json({ error: "Unauthorized user." });
        }

        const dbUser = await User.findOne({ firebaseUid: user.uid });
        if (!dbUser || dbUser.tokens < 1) {
            return res.status(403).json({ success: false, error: "Insufficient Career Credits. Please purchase more." });
        }

        if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY.includes('yahan_')) {
            return res.status(400).json({ error: "Gemini API key is missing properly in .env" });
        }

        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY.trim());
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

        const prompt = `You are a highly experienced HR and Technical Interviewer. 
        Create exactly 5 interview questions and their ideal detailed answers for the position of '${jobRole}'.
        The candidate has ${experience} years of experience.
        The job description and technologies are: ${jobDesc}.
        
        CRITICAL INSTRUCTION: The interview language requested is '${language}'. 
        If '${language}' is 'Hindi', you MUST write all questions and answers in Hinglish (Hindi written in English alphabet) or simple Devanagari Hindi so an Indian user can understand easily. Do NOT return pure English if Hindi is chosen.
        
        Return the response ONLY as a pure JSON array of objects. Do not use quotes around the array and do not wrap in markdown \`\`\`json. 
        Each object must strictly match this format:
        [
          {
            "question": "The interview question",
            "answer": "The ideal detailed answer"
          }
        ]`;

        const result = await model.generateContent(prompt);
        let aiResponse = result.response.text();
        
        // Safety cleanup if Gemini adds markdown tags
        aiResponse = aiResponse.replace(/```json/gi, '').replace(/```/g, '').trim();
        
        const questionsJson = JSON.parse(aiResponse);

        // Deduct 1 token upon successful generation
        dbUser.tokens -= 1;
        await dbUser.save();

        res.status(200).json({ success: true, questions: questionsJson });

    } catch (error) {
        console.error("Gemini AI Error:", error);
        res.status(500).json({ error: `Failed to generate AI Questions. Detail: ${error.message || 'Check terminal logs'}` });
    }
});

router.post('/submit', async (req, res) => {
    try {
        const { jobRole, jobDesc, experience, language = "English", answers, user } = req.body;

        if (!process.env.GEMINI_API_KEY) {
            return res.status(400).json({ error: "Gemini API key is missing" });
        }

        // 1. Sync User using Firebase Data
        let dbUser = await User.findOne({ firebaseUid: user.uid });
        if (!dbUser) {
            return res.status(404).json({ error: "User profile not synced to DB." });
        }

        // 2. Evaluate with Gemini
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY.trim());
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

        const prompt = `You are an expert HR and Technical Interviewer. 
        You conducted an interview for '${jobRole}' (Experience: ${experience} years, Job Desc: ${jobDesc}).
        Here are the 5 questions we asked, the ideal expected answers, and the candidate's actual answers:
        
        ${JSON.stringify(answers, null, 2)}
        
        Evaluate the candidate's actual answers compared to the ideal answers. Be encouraging but realistic.
        Provide your response ONLY as pure JSON strings without markdown wrappers. Exactly matching this structure:
        {
           "overallRating": 8, // A number between 1 to 10
           "overallFeedback": "Overall feedback paragraph about how they did and what to improve.",
           "evaluations": [
              {
                 "question": "question text",
                 "userAnswer": "what the user answered",
                 "idealAnswer": "the ideal answer to compare against",
                 "rating": 7, // rating for this specific answer out of 10
                 "feedback": "Specific feedback for this answer."
              }
           ]
        }
        
        CRITICAL: The written feedback MUST be in ${language === 'Hindi' ? 'Hinglish or simple Hindi' : 'English'} depending on the candidate's choice.
        `;

        const result = await model.generateContent(prompt);
        let aiResponse = result.response.text();
        aiResponse = aiResponse.replace(/```json/gi, '').replace(/```/g, '').trim();
        
        const evaluationJson = JSON.parse(aiResponse);

        // 3. Save Interview Result
        const newInterview = new Interview({
            userId: dbUser._id,
            jobPosition: jobRole,
            jobDescription: jobDesc,
            experience,
            language,
            questions: evaluationJson.evaluations,
            overallRating: evaluationJson.overallRating,
            overallFeedback: evaluationJson.overallFeedback
        });
        await newInterview.save();

        // 4. Return interview ID
        res.json({ success: true, interviewId: newInterview._id });

    } catch (error) {
        console.error("Submission Error:", error);
        res.status(500).json({ error: `Failed to evaluate answers. Detail: ${error.message || 'Check terminal logs'}` });
    }
});

router.get('/history/:uid', async (req, res) => {
    try {
        const dbUser = await User.findOne({ firebaseUid: req.params.uid });
        if (!dbUser) {
            return res.json({ success: true, history: [] });
        }
        
        // Find all interviews sorted by newest first
        const history = await Interview.find({ userId: dbUser._id }).sort({ createdAt: -1 });
        res.json({ success: true, history });
    } catch (err) {
        console.error("Error fetching history:", err);
        res.status(500).json({ error: "Server Error fetching history" });
    }
});

router.get('/feedback/:id', async (req, res) => {
    try {
        const interview = await Interview.findById(req.params.id);
        if (!interview) {
            return res.status(404).json({ error: "Interview not found" });
        }
        res.status(200).json({ success: true, interview });
    } catch(err) {
        console.error("Error fetching feedback:", err);
        res.status(500).json({ error: "Server Error fetching feedback report" });
    }
});

module.exports = router;
