import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { auth } from './firebase';

export default function ATSChecker() {
    const navigate = useNavigate();
    const [file, setFile] = useState(null);
    const [jobDesc, setJobDesc] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [result, setResult] = useState(null);

    const handleFileChange = (e) => {
        if (e.target.files[0]) {
            setFile(e.target.files[0]);
            setError(null);
        }
    };

    const handleAnalyze = async () => {
        if (!auth.currentUser) {
            setError("Please login to use the ATS Analyzer.");
            return;
        }
        if (!file || !file.name.endsWith('.pdf')) {
            setError("Please upload a valid PDF resume.");
            return;
        }
        if (!jobDesc.trim()) {
            setError("Please provide a Job Description to match against.");
            return;
        }

        setLoading(true);
        setError(null);

        const formData = new FormData();
        formData.append('resume', file);
        formData.append('jobDesc', jobDesc);
        formData.append('user', JSON.stringify({ uid: auth.currentUser.uid }));

        try {
            const res = await fetch('https://harview-ai.onrender.com/api/ats/analyze', {
                method: 'POST',
                body: formData
            });
            const data = await res.json();

            if (data.success) {
                setResult(data.result);
                // Dispatch event to update navbar tokens
                window.dispatchEvent(new Event('tokensUpdated'));
            } else {
                setError(data.error || "Failed to analyze resume.");
            }
        } catch (err) {
            setError("Server connection failed.");
        } finally {
            setLoading(false);
        }
    };

    // Circular Progress Component
    const CircularProgress = ({ score }) => {
        const radius = 60;
        const circumference = 2 * Math.PI * radius;
        const strokeDashoffset = circumference - (score / 100) * circumference;
        
        let color = "text-red-500";
        if (score >= 50) color = "text-amber-500";
        if (score >= 80) color = "text-emerald-500";

        return (
            <div className="relative flex items-center justify-center w-40 h-40">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
                    <circle cx="70" cy="70" r={radius} stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-800" />
                    <motion.circle 
                        initial={{ strokeDashoffset: circumference }}
                        animate={{ strokeDashoffset }}
                        transition={{ duration: 2, ease: "easeOut" }}
                        cx="70" cy="70" r={radius} stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={circumference} 
                        className={`${color} drop-shadow-[0_0_15px_currentColor]`} strokeLinecap="round" 
                    />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                    <span className={`text-4xl font-black ${color}`}>{score}%</span>
                    <span className="text-xs text-slate-400 font-bold uppercase tracking-widest mt-1">Match</span>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-slate-950 font-sans text-slate-200 relative">
            <button onClick={() => navigate('/dashboard')} className="absolute top-6 left-6 flex items-center gap-2 text-slate-400 hover:text-white transition group z-50">
                <div className="bg-slate-900 border border-slate-700 p-2 rounded-xl group-hover:border-indigo-500/50 transition shadow-lg">
                    <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                </div>
                <span className="font-bold tracking-widest uppercase text-xs">Back to Hub</span>
            </button>
            
            <div className="max-w-6xl mx-auto px-6 py-12 pt-24">
                <div className="text-center mb-12">
                    <motion.div initial={{opacity:0, y:-20}} animate={{opacity:1, y:0}} className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 font-bold text-sm mb-6">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                        AI powered Resume Analysis
                    </motion.div>
                    <h1 className="text-4xl md:text-5xl font-black text-white mb-4">ATS <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Score Matcher</span></h1>
                    <p className="text-slate-400 max-w-2xl mx-auto text-lg">Upload your resume and the job description to see how well you match the role. Find missing keywords before you apply.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    
                    {/* INPUT SECTION */}
                    <motion.div initial={{opacity:0, x:-30}} animate={{opacity:1, x:0}} className="bg-slate-900 border border-slate-800 p-8 rounded-[2rem] shadow-xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 blur-[80px] rounded-full group-hover:bg-indigo-500/10 transition duration-700"></div>
                        
                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 relative z-10">
                            <span className="bg-slate-800 text-indigo-400 w-8 h-8 rounded-full flex items-center justify-center text-sm">1</span>
                            Upload Resume (PDF)
                        </h2>
                        
                        <div className="relative z-10 mb-8">
                            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-slate-700 rounded-2xl cursor-pointer hover:bg-slate-800/50 hover:border-indigo-500/50 transition bg-slate-950/50">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg className={`w-10 h-10 mb-3 ${file ? 'text-indigo-400' : 'text-slate-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                                    <p className="mb-2 text-sm text-slate-400 font-bold">
                                        {file ? <span className="text-indigo-300">{file.name}</span> : <span>Click to upload or drag and drop</span>}
                                    </p>
                                    {!file && <p className="text-xs text-slate-500 uppercase tracking-widest">PDF format only</p>}
                                </div>
                                <input type="file" className="hidden" accept="application/pdf" onChange={handleFileChange} />
                            </label>
                        </div>

                        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2 relative z-10">
                            <span className="bg-slate-800 text-purple-400 w-8 h-8 rounded-full flex items-center justify-center text-sm">2</span>
                            Paste Job Description
                        </h2>

                        <div className="relative z-10 mb-8">
                            <textarea 
                                rows="6" 
                                value={jobDesc}
                                onChange={(e)=>setJobDesc(e.target.value)}
                                className="w-full bg-slate-950 border border-slate-700 rounded-2xl p-5 text-slate-200 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 transition resize-none custom-scrollbar"
                                placeholder="Paste the full job description here..."
                            ></textarea>
                        </div>

                        {error && (
                            <motion.div initial={{opacity:0, height:0}} animate={{opacity:1, height:'auto'}} className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-xl text-sm font-bold mb-6 text-center">
                                {error}
                            </motion.div>
                        )}

                        <button 
                            onClick={handleAnalyze} 
                            disabled={loading}
                            className={`w-full relative group overflow-hidden bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-black text-lg py-5 rounded-2xl shadow-[0_10px_30px_rgba(99,102,241,0.3)] hover:shadow-[0_10px_40px_rgba(99,102,241,0.5)] transition-all border border-indigo-400/50 flex justify-center items-center gap-3 z-10 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        >
                            <div className="absolute inset-0 w-full h-full bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out skew-x-12"></div>
                            {loading ? (
                                <>
                                    <svg className="animate-spin w-6 h-6 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                                    ANALYZING...
                                </>
                            ) : (
                                "SCAN TOKENS & ANALYZE"
                            )}
                            {!loading && <span className="bg-white/20 px-3 py-1 rounded-lg text-xs tracking-widest uppercase ml-2 flex items-center gap-1 shadow-inner"><svg className="w-3 h-3 text-amber-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z"></path></svg>Cost: 3 HV</span>}
                        </button>
                    </motion.div>

                    {/* RESULT SECTION */}
                    <div className="relative h-full min-h-[500px]">
                        <AnimatePresence mode="wait">
                            {!result && !loading && (
                                <motion.div key="empty" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 border-2 border-dashed border-slate-800 rounded-[2rem] flex flex-col items-center justify-center text-slate-500 p-10 text-center">
                                    <svg className="w-20 h-20 mb-6 opacity-20" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd"></path></svg>
                                    <h3 className="text-xl font-bold text-slate-400 mb-2">Awaiting Parameters</h3>
                                    <p className="text-sm">Upload your files and click Analyze to generate an deep technical breakdown of your ATS match rate.</p>
                                </motion.div>
                            )}

                            {loading && (
                                <motion.div key="loading" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="absolute inset-0 bg-slate-900 border border-slate-800 rounded-[2rem] shadow-xl flex flex-col items-center justify-center p-10 relative overflow-hidden">
                                    <div className="absolute inset-x-0 bottom-0 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-[pulse_2s_ease-in-out_infinite]"></div>
                                    <div className="w-24 h-24 mb-8 relative">
                                        <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
                                        <div className="absolute inset-0 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                                        <div className="absolute inset-2 border-4 border-purple-500 border-b-transparent rounded-full animate-[spin_1.5s_linear_infinite_reverse]"></div>
                                    </div>
                                    <h3 className="text-2xl font-black text-white tracking-widest mb-2">EXTRACTING MATRICES...</h3>
                                    <p className="text-slate-400 font-mono text-xs">Running highly-dense contextual matching via Gemini Cortex.</p>
                                </motion.div>
                            )}

                            {result && !loading && (
                                <motion.div key="result" initial={{opacity:0, scale:0.95}} animate={{opacity:1, scale:1}} className="absolute inset-0 bg-slate-900 border border-slate-800 rounded-[2rem] shadow-2xl p-8 overflow-y-auto custom-scrollbar">
                                    <div className="flex flex-col md:flex-row items-center gap-8 mb-8 pb-8 border-b border-slate-800">
                                        <CircularProgress score={result.score} />
                                        <div className="flex-1 text-center md:text-left">
                                            <h3 className="text-2xl font-black text-white mb-2">Analysis Complete</h3>
                                            <p className="text-slate-400 text-sm leading-relaxed">{result.summary}</p>
                                        </div>
                                    </div>

                                    <div className="space-y-8">
                                        <div>
                                            <h4 className="text-sm font-bold uppercase tracking-widest text-emerald-400 mb-4 flex items-center gap-2">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                                Keywords Identified
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {result.matchingKeywords?.map((kw, i) => (
                                                    <span key={i} className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-3 py-1.5 rounded-lg text-sm font-medium">{kw}</span>
                                                ))}
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-bold uppercase tracking-widest text-red-400 mb-4 flex items-center gap-2">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                                                Missing Core Skills
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {result.missingKeywords?.map((kw, i) => (
                                                    <span key={i} className="bg-red-500/10 border border-red-500/30 text-red-400 px-3 py-1.5 rounded-lg text-sm font-medium">{kw}</span>
                                                ))}
                                                {(!result.missingKeywords || result.missingKeywords.length === 0) && (
                                                    <span className="text-sm text-slate-500">No critical keywords missing. Excellent match!</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="bg-indigo-500/5 border border-indigo-500/20 rounded-2xl p-6">
                                            <h4 className="text-sm font-bold uppercase tracking-widest text-indigo-400 mb-4 flex items-center gap-2">
                                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                Improvement Architectures
                                            </h4>
                                            <ul className="space-y-3">
                                                {result.suggestions?.map((sug, i) => (
                                                    <li key={i} className="flex gap-3 text-sm text-slate-300">
                                                        <span className="text-indigo-500 font-bold mt-0.5">•</span>
                                                        <span>{sug}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    </div>
                                    
                                    <div className="mt-8 pt-6 border-t border-slate-800 text-center">
                                        <button onClick={()=>setResult(null)} className="text-slate-500 hover:text-white font-bold text-sm tracking-widest uppercase transition">Analyze Another Role</button>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                </div>
            </div>
            
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(99, 102, 241, 0.3); border-radius: 20px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: rgba(99, 102, 241, 0.6); }
            `}</style>
        </div>
    );
}
