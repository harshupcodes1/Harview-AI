const express = require('express');
const router = express.Router();
const multer = require('multer');
const pdfParse = require('pdf-parse');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const User = require('../models/User');

// Configure multer to store file in memory
const upload = multer({ storage: multer.memoryStorage() });

router.post('/analyze', upload.single('resume'), async (req, res) => {
    try {
        const { jobDesc, user } = req.body;
        
        // Fix stringified user object from FormData if necessary
        let parsedUser;
        try {
            parsedUser = typeof user === 'string' ? JSON.parse(user) : user;
        } catch(e) {
            parsedUser = user;
        }

        if (!parsedUser || !parsedUser.uid) {
            return res.status(401).json({ success: false, error: "Unauthorized user." });
        }

        if (!req.file) {
            return res.status(400).json({ success: false, error: "Please upload a resume (PDF)." });
        }

        if (!jobDesc) {
            return res.status(400).json({ success: false, error: "Please provide a job description." });
        }

        // Check user tokens (3 tokens required)
        const dbUser = await User.findOne({ firebaseUid: parsedUser.uid });
        if (!dbUser || dbUser.tokens < 3) {
            return res.status(403).json({ success: false, error: "Insufficient Career Credits. 3 tokens required for ATS Analysis." });
        }

        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ success: false, error: "Gemini API key is not configured." });
        }

        // Parse PDF text
        const pdfData = await pdfParse(req.file.buffer);
        const resumeText = pdfData.text;

        if (!resumeText || resumeText.trim().length === 0) {
            return res.status(400).json({ success: false, error: "Could not extract text from the PDF. It might be scanned or image-based." });
        }

        // Initialize Gemini
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY.trim());
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

        const prompt = `You are an expert ATS (Applicant Tracking System) and Technical Recruiter.
        I will provide you with a Job Description and a candidate's Resume text.
        
        Job Description:
        ${jobDesc}
        
        Resume Text:
        ${resumeText}
        
        Perform a deep ATS analysis and return a JSON response with the following strictly formatted structure (do NOT wrap in markdown \`\`\`json):
        {
           "score": 75, // Overall ATS Match Score out of 100
           "summary": "A short 2-line summary of how well the resume matches.",
           "matchingKeywords": ["Python", "React", "APIs"], // array of matched keywords
           "missingKeywords": ["GraphQL", "Docker", "AWS"], // array of important missing keywords
           "suggestions": [
                "Quantify your achievements in the experience section.",
                "Add the keyword 'Docker' as it's highly requested."
           ]
        }
        `;

        const result = await model.generateContent(prompt);
        let aiResponse = result.response.text();
        
        // Cleanup markdown wrap
        aiResponse = aiResponse.replace(/```json/gi, '').replace(/```/g, '').trim();
        const atsResult = JSON.parse(aiResponse);

        // Deduct 3 tokens
        dbUser.tokens -= 3;
        await dbUser.save();

        res.json({ 
            success: true, 
            result: atsResult, 
            tokensRemaining: dbUser.tokens 
        });

    } catch (error) {
        console.error("ATS Error:", error);
        res.status(500).json({ success: false, error: `Failed to analyze resume. Detail: ${error.message}` });
    }
});

module.exports = router;
