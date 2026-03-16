import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Webcam from 'react-webcam';
import useSpeechToText from 'react-hook-speech-to-text';
import * as tf from '@tensorflow/tfjs';
import * as blazeface from '@tensorflow-models/blazeface';
import { motion, AnimatePresence } from 'framer-motion';

function InterviewRoom() {
    const navigate = useNavigate();
    const [questions, setQuestions] = useState([]);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [webcamEnabled, setWebcamEnabled] = useState(false);
    const [userAnswerText, setUserAnswerText] = useState('');
    
    // AI Proctor States
    const webcamRef = useRef(null);
    const [isFaceVisible, setIsFaceVisible] = useState(true); 
    const [isModelLoading, setIsModelLoading] = useState(false);

    // Which language did they select?
    const interviewLanguage = localStorage.getItem('interviewLanguage') || 'English';
    const langCode = interviewLanguage === 'Hindi' ? 'hi-IN' : 'en-US';

    // Speech to text configuration
    const {
        error: speechError,
        interimResult,
        isRecording,
        results,
        setResults,
        startSpeechToText,
        stopSpeechToText,
    } = useSpeechToText({
        continuous: true,
        useLegacyResults: false,
        speechRecognitionProperties: {
            lang: langCode,
            interimResults: true
        }
    });

    useEffect(() => {
        const stored = localStorage.getItem('interviewQuestions');
        if (stored) {
            setQuestions(JSON.parse(stored));
        } else {
            console.warn("No questions found, redirecting to Dashboard");
            navigate('/dashboard');
        }
    }, [navigate]);

    // Live sync transcript into the text area so user can edit their spoken words
    const transcript = results.map(r => r.transcript).join(' ') + (interimResult ? ' ' + interimResult : '');
    
    useEffect(() => {
        if (isRecording) {
            setUserAnswerText(transcript);
        }
    }, [transcript, isRecording]);

    // Load AI Proctor (Blazeface Face Detection)
    useEffect(() => {
        let model = null;
        let interval = null;

        const loadProctor = async () => {
            try {
                setIsModelLoading(true);
                await tf.ready();
                model = await blazeface.load();
                setIsModelLoading(false);

                // Start checking the webcam video every 1 second
                interval = setInterval(async () => {
                    if (webcamRef.current && webcamRef.current.video && webcamRef.current.video.readyState === 4) {
                        const video = webcamRef.current.video;
                        const predictions = await model.estimateFaces(video, false);
                        
                        if (predictions.length > 0) {
                            setIsFaceVisible(true);
                        } else {
                            setIsFaceVisible(false);
                        }
                    }
                }, 1000); 

            } catch (error) {
                console.error("AI Proctor failed to load:", error);
                setIsModelLoading(false);
                setIsFaceVisible(true); // Fallback: Don't permanently block them if tfjs fails
            }
        };

        if (webcamEnabled) {
            loadProctor();
        } else {
            setIsFaceVisible(false); // Webcam must be ON to answer!
            setIsModelLoading(false);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [webcamEnabled]);


    const [allUserAnswers, setAllUserAnswers] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSaveAndNext = async () => {
        if(isRecording) {
            stopSpeechToText();
        }

        const finalAnswer = userAnswerText.trim();
        
        if (finalAnswer.length < 5) {
            alert("Please provide a longer answer before moving to the next question.");
            return;
        }

        const newAnswerRecord = {
            question: questions[currentQuestionIndex].question,
            answer: finalAnswer,
            idealAnswer: questions[currentQuestionIndex].answer
        };

        const updatedAnswers = [...allUserAnswers, newAnswerRecord];
        setAllUserAnswers(updatedAnswers);

        if (currentQuestionIndex < questions.length - 1) {
            // Save & proceed to next
            if(setResults) setResults([]); // clear mic array for next answer
            setUserAnswerText(''); // clear text box
            setCurrentQuestionIndex(prev => prev + 1);
        } else {
            // Submit entire interview
            setIsSubmitting(true);
            try {
                const { auth } = await import('./firebase');
                const user = auth.currentUser;
                const jobDetailsRaw = localStorage.getItem('jobDetails');
                const jobDetails = jobDetailsRaw ? JSON.parse(jobDetailsRaw) : { jobRole: 'Mock', jobDesc: 'Mock', experience: '0' };

                const resp = await fetch('https://harview-ai.onrender.com/api/interview/submit', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        jobRole: jobDetails.jobRole,
                        jobDesc: jobDetails.jobDesc,
                        experience: jobDetails.experience,
                        language: interviewLanguage,
                        answers: updatedAnswers,
                        user: {
                            uid: user.uid,
                            email: user.email,
                            displayName: user.displayName,
                            photoURL: user.photoURL
                        }
                    })
                });

                const data = await resp.json();
                if(data.success) {
                    navigate(`/feedback/${data.interviewId}`);
                } else {
                    alert("Submission failed: " + data.error);
                }
            } catch (err) {
                console.error(err);
                alert("Server error running AI Evaluation!");
            } finally {
                setIsSubmitting(false);
            }
        }
    };

    if (questions.length === 0) return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white font-sans">
            <h2 className="text-2xl animate-pulse text-blue-400 font-bold tracking-widest">LOADING AI INTERVIEW...</h2>
        </div>
    );

    const currentQ = questions[currentQuestionIndex];

    // Block inputs if face is missing or camera is off
    const isInputDisabled = !webcamEnabled || (!isFaceVisible && !isModelLoading);

    return (
        <div className="min-h-screen bg-slate-900 text-white flex flex-col md:flex-row p-6 gap-6 font-sans">
            
            {/* Left Side: Video Avatar & Controls */}
            <div className="flex-[1.2] min-h-[400px] md:min-h-0 rounded-3xl overflow-hidden bg-black shadow-[0_0_40px_rgba(37,99,235,0.15)] relative border border-slate-700/50 flex flex-col justify-center items-center">
                
                {webcamEnabled && isModelLoading && (
                    <div className="absolute top-6 right-6 bg-blue-900/60 backdrop-blur-md text-blue-300 px-4 py-2 rounded-lg text-sm z-30 flex items-center gap-3 border border-blue-500/30">
                        <span className="w-2.5 h-2.5 bg-blue-400 rounded-full animate-ping"></span>
                        Starting AI Proctor...
                    </div>
                )}

                {/* Anti-Cheat Overlay */}
                {webcamEnabled && !isModelLoading && !isFaceVisible && (
                    <div className="absolute inset-0 bg-red-950/80 backdrop-blur-md z-30 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
                        <svg className="w-20 h-20 text-red-500 mb-6 animate-bounce drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                        <h2 className="text-3xl font-black text-white mb-3 tracking-wide">FACE NOT DETECTED</h2>
                        <p className="text-red-200 font-medium text-lg max-w-sm">Please look directly at the camera to continue your interview. Submissions are temporarily locked.</p>
                    </div>
                )}
                
                {webcamEnabled ? (
                    <Webcam
                        ref={webcamRef}
                        audio={false}
                        mirrored={true}
                        className="h-full w-full object-cover z-10"
                    />
                ) : (
                    <div className="absolute inset-0 bg-slate-800 flex flex-col items-center justify-center z-0 p-10 text-center">
                        <svg className="w-24 h-24 text-slate-600 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                        <h3 className="text-xl font-bold text-slate-400 mb-2">Webcam is Required</h3>
                        <p className="text-slate-500 max-w-sm">Enable your webcam to verify your identity and start the AI Proctor.</p>
                    </div>
                )}
                
                {/* Control Hud overlay */}
                <div className="absolute bottom-6 md:bottom-8 left-0 right-0 flex flex-col sm:flex-row justify-center items-center gap-3 sm:gap-6 z-40 px-4">
                    <button onClick={() => navigate('/dashboard')} className="w-full sm:w-auto bg-slate-800/80 backdrop-blur-md px-6 py-3 rounded-full shadow-lg hover:bg-red-600 transition border border-slate-600 group text-white font-bold flex items-center justify-center gap-2" title="Exit Interview">
                        ❌ Exit Interview
                    </button>
                    
                    <button 
                        onClick={() => setWebcamEnabled(!webcamEnabled)} 
                        className={`w-full sm:w-auto backdrop-blur-md text-white font-bold px-8 py-3 rounded-full shadow-lg transition border flex items-center justify-center gap-2 ${webcamEnabled ? 'bg-red-600/90 hover:bg-red-500 border-red-500/50' : 'bg-blue-600/90 hover:bg-blue-500 border-blue-500/50'}`}
                    >
                        {webcamEnabled ? 'Stop Webcam' : 'Enable Webcam'}
                    </button>
                </div>
            </div>

            {/* Right Side: Questions, Recording & Feedback */}
            <div className="flex-1 md:max-w-[450px] lg:max-w-[550px] flex flex-col gap-5 relative">
                
                {/* Visual Block for entire right panel if cheating is detected */}
                {isInputDisabled && (
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-[2px] z-50 rounded-3xl flex items-center justify-center">
                         <span className="bg-red-600 text-white font-bold px-4 py-2 rounded-lg shadow-xl animate-pulse">
                            Action Blocked by AI Proctor
                         </span>
                    </div>
                )}

                <div className={`bg-slate-800/80 backdrop-blur-sm p-5 md:p-8 rounded-3xl border border-slate-700/50 shadow-2xl flex-1 flex flex-col transition ${isInputDisabled ? 'opacity-50 grayscale pt-[blur]' : ''}`}>
                    <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-700/50">
                        <div className="flex items-center gap-3">
                            <span className="w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.8)]"></span>
                            <h2 className="text-blue-400 font-bold tracking-widest text-xs uppercase">Question {currentQuestionIndex + 1} of {questions.length}</h2>
                        </div>
                        <span className="bg-emerald-900/30 text-emerald-300 text-xs px-3 py-1 rounded-full border border-emerald-700/50 font-medium">
                            {isInputDisabled ? "🔴 Proctor Locked" : "🟢 Proctor Active"}
                        </span>
                    </div>
                    
                    <p className="text-xl font-semibold leading-relaxed mb-6 text-slate-100 italic">
                        "{currentQ.question}"
                    </p>

                    <div className="bg-black/40 p-5 rounded-2xl border border-slate-600/50 mb-6 flex-1 flex flex-col">
                        <div className="flex justify-between items-center mb-3">
                            <span className="text-slate-400 text-xs font-bold uppercase tracking-wider">Your Answer ({interviewLanguage})</span>
                            
                            {!speechError ? (
                                <button 
                                    disabled={isInputDisabled}
                                    onClick={isRecording ? stopSpeechToText : startSpeechToText} 
                                    className={`px-4 py-2 rounded-lg font-bold text-sm shadow-md transition flex items-center gap-2 ${isInputDisabled ? 'cursor-not-allowed opacity-50' : ''} ${isRecording ? 'bg-red-600/20 text-red-500 border border-red-500/50 animate-pulse' : 'bg-blue-600/20 text-blue-400 border border-blue-500/50 hover:bg-blue-600/30'}`}
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
                                    {isRecording ? 'Stop Recording' : 'Record Answer'}
                                </button>
                            ) : (
                                <span className="bg-red-900/40 text-red-200 border border-red-700/50 px-3 py-1 rounded text-xs font-bold">
                                    ⚠️ Please use Google Chrome to enable Mic
                                </span>
                            )}
                        </div>
                        
                        <textarea 
                            disabled={isInputDisabled}
                            value={userAnswerText}
                            onChange={(e) => setUserAnswerText(e.target.value)}
                            className={`w-full flex-1 bg-slate-900/50 border border-slate-700 focus:border-blue-500 focus:outline-none rounded-xl p-4 text-slate-200 resize-none ${isInputDisabled ? 'cursor-not-allowed opacity-70' : ''}`}
                            placeholder={speechError ? "Type your answer here..." : "Record your voice using the button, or type your answer here manually..."}
                            rows="4"
                        ></textarea>
                    </div>
                    
                    {/* Navigation Buttons */}
                    <div className="mt-auto flex flex-col sm:flex-row justify-between gap-4">
                        <button 
                            disabled={currentQuestionIndex === 0 || isInputDisabled}
                            onClick={() => { if(setResults) setResults([]); setUserAnswerText(''); setCurrentQuestionIndex(prev => prev - 1); }}
                            className="w-full sm:w-auto sm:flex-[0.8] py-4 bg-slate-700/80 text-slate-300 font-bold text-lg rounded-2xl disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-600 transition shadow-inner"
                        >
                            Back
                        </button>
                        
                        <button 
                            disabled={isInputDisabled || isSubmitting}
                            onClick={handleSaveAndNext}
                            className={`w-full sm:w-auto sm:flex-[1.2] py-4 font-bold text-lg rounded-2xl transition flex items-center justify-center gap-2 ${isInputDisabled || isSubmitting ? 'bg-slate-700 text-slate-500 cursor-not-allowed border border-slate-600' : 'bg-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:bg-emerald-500'}`}
                        >
                            {isSubmitting ? "Generating Score... 🤖" : (currentQuestionIndex < questions.length - 1 ? 'Save & Next' : 'Finish Interview')}
                        </button>
                    </div>
                </div>
            </div>

            {/* 3D Fullscreen Loading Overlay (Light Theme) for Evaluation */}
            <AnimatePresence>
                {isSubmitting && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/90 backdrop-blur-2xl"
                >
                    <div className="relative w-40 h-40 mb-12 flex items-center justify-center perspective-[1000px]">
                    {/* Outer 3D Ring */}
                    <motion.div 
                        animate={{ rotateX: 360, rotateZ: 180 }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-0 border-[5px] border-t-blue-500 border-r-indigo-500 border-b-transparent border-l-transparent rounded-full shadow-[0_0_30px_rgba(59,130,246,0.3)]"
                        style={{ transformStyle: 'preserve-3d' }}
                    />
                    {/* Inner 3D Ring */}
                    <motion.div 
                        animate={{ rotateY: 360, rotateZ: -180 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-4 border-[5px] border-b-blue-600 border-l-indigo-600 border-t-transparent border-r-transparent rounded-full shadow-[0_0_30px_rgba(79,70,229,0.3)]"
                        style={{ transformStyle: 'preserve-3d' }}
                    />
                    {/* Pulsing AI Core */}
                    <motion.div 
                        animate={{ scale: [1, 1.2, 1], opacity: [0.8, 1, 0.8] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                        className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full shadow-[0_0_60px_rgba(59,130,246,0.5)]"
                    />
                    </div>
                    
                    <motion.h2 
                    animate={{ opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-700 mb-4 tracking-tight text-center"
                    >
                    Evaluating Performance...
                    </motion.h2>
                    
                    <p className="text-slate-600 font-bold text-xl text-center max-w-lg mt-2 leading-relaxed">
                    Gemini AI is analyzing your answers.<br/>Generating detailed feedback and scores.
                    </p>
                </motion.div>
                )}
            </AnimatePresence>

        </div>
    );
}

export default InterviewRoom;
