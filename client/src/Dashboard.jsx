import React, { useState, useEffect } from 'react';
import { auth } from './firebase';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import TokenBadge from './components/TokenBadge';
import HarviewLogo from './components/HarviewLogo';

function Dashboard() {
  const user = auth.currentUser;
  const navigate = useNavigate();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [jobRole, setJobRole] = useState('');
  const [jobDesc, setJobDesc] = useState('');
  const [experience, setExperience] = useState('');
  const [language, setLanguage] = useState('English');
  const [isLoading, setIsLoading] = useState(false);
  const [tokens, setTokens] = useState(0);
  const [history, setHistory] = useState([]);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [showCelebration, setShowCelebration] = useState(false); // New User 10 Token Celebration

  // Sync User, Fetch Tokens & History
  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          // 1. Sync User & Get Tokens
          const syncRes = await fetch('https://harview-ai.onrender.com/api/auth/sync', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              firebaseUid: user.uid,
              email: user.email,
              name: user.displayName,
              profileImage: user.photoURL
            })
          });
          const syncData = await syncRes.json();
          if (syncData.success) {
            setTokens(syncData.user.tokens);
            if (syncData.isNewUser) {
                setShowCelebration(true);
            }
          }

          // 2. Fetch Interview History
          const histRes = await fetch(`https://harview-ai.onrender.com/api/interview/history/${user.uid}`);
          const histData = await histRes.json();
          if (histData.success) {
            setHistory(histData.history);
          }
        } catch(err) {
          console.error("Error fetching user data:", err);
        } finally {
            setIsLoadingData(false);
        }
      };
      fetchData();
    }
  }, [user]);

  const handleStartInterview = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const resp = await fetch('https://harview-ai.onrender.com/api/interview/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
            jobRole, jobDesc, experience, language, 
            user: { uid: user.uid, email: user.email } 
        })
      });
      
      const data = await resp.json();
      if(data.success && data.questions) {
        localStorage.setItem('jobDetails', JSON.stringify({ jobRole, jobDesc, experience }));
        localStorage.setItem('interviewQuestions', JSON.stringify(data.questions));
        localStorage.setItem('interviewLanguage', language);
        navigate('/interview/new');
      } else {
        alert("Failed to generate AI Questions. " + (data.error || ""));
      }
    } catch (err) {
      console.error(err);
      alert("Error reaching the backend!");
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#03020A] text-white">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied.</h2>
          <button onClick={() => navigate('/')} className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg font-bold transition">Return to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#03020A] text-slate-200 font-sans relative overflow-x-hidden flex flex-col items-center">
      {/* Cinematic Background Effects */}
      <div className="fixed inset-0 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] pointer-events-none mix-blend-overlay"></div>
      <div className="fixed top-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-blue-900/40 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="fixed bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-purple-900/30 rounded-full blur-[120px] pointer-events-none"></div>

      {/* NEW USER CELEBRATION MODAL */}
      <AnimatePresence>
        {showCelebration && (
            <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            >
                <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center items-center">
                    {/* Confetti effect background */}
                    <motion.div animate={{ rotate: 360, scale: [1, 1.5, 1] }} transition={{ duration: 10, repeat: Infinity }} className="w-[800px] h-[800px] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-500/20 via-transparent to-transparent opacity-50"></motion.div>
                </div>
                
                <motion.div 
                    initial={{ scale: 0.5, y: 50, rotateX: 20 }}
                    animate={{ scale: 1, y: 0, rotateX: 0 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ type: "spring", bounce: 0.6, duration: 0.8 }}
                    className="relative bg-gradient-to-b from-[#1a1c29] to-[#0A0D1A] border border-yellow-500/30 p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] shadow-[0_0_100px_rgba(234,179,8,0.3)] max-w-lg text-center flex flex-col items-center mx-4"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/20 blur-[40px] rounded-full pointer-events-none"></div>
                    
                    <motion.div 
                        animate={{ y: [0, -15, 0], rotate: [0, 5, -5, 0] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="w-32 h-32 mb-6 rounded-full bg-gradient-to-br from-[#FFDF00] via-[#F4C430] to-[#b8860b] shadow-[0_10px_40px_rgba(255,215,0,0.5),inset_0_-4px_10px_rgba(184,134,11,0.8),inset_0_4px_10px_rgba(255,255,255,0.8)] border border-[#FFDF00]/50 flex items-center justify-center relative"
                    >
                        <span className="relative z-10 font-black text-5xl text-[#8B6508] tracking-tighter" style={{ textShadow: "2px 2px 0 rgba(255,255,255,0.4), -1px -1px 0 rgba(0,0,0,0.1)" }}>HV</span>
                    </motion.div>

                    <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-amber-500 mb-2 drop-shadow-md">You're In!</h2>
                    <h3 className="text-2xl font-bold text-white mb-4">10 Free Career Credits Added</h3>
                    <p className="text-slate-400 mb-8 text-lg font-medium leading-relaxed">Welcome to Harview AI. We've gifted you 10 credits to kickstart your interview prep. Go crack that dream job!</p>
                    
                    <button 
                        onClick={() => setShowCelebration(false)}
                        className="w-full py-4 bg-gradient-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-slate-900 font-black text-lg rounded-2xl shadow-[0_10px_30px_rgba(245,158,11,0.4)] transition transform hover:-translate-y-1 relative overflow-hidden group/btn"
                    >
                        <div className="absolute inset-0 bg-white/30 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out"></div>
                        <span className="relative z-10 flex items-center justify-center gap-2">Let's Go 🚀</span>
                    </button>
                </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-6xl p-6 md:p-10 z-10 relative">
        
        {/* Navbar */}
        <motion.nav 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-center justify-between mb-12 gap-6 md:gap-0"
        >
          {/* Harview AI Logo */}
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/')}>
            <HarviewLogo size={48} className="hover:scale-105 transition-transform drop-shadow-[0_0_14px_rgba(99,102,241,0.7)]" />
            <span className="text-3xl font-black tracking-tight text-white">Harview <span className="text-blue-500">AI</span></span>
          </div>

          {/* User Controls */}
          <div className="flex items-center gap-2 md:gap-4 bg-white/[0.02] border border-white/[0.05] p-2 pr-4 md:pr-6 rounded-full backdrop-blur-md shadow-lg w-full md:w-auto justify-center md:justify-end">
            
            {isLoadingData ? (
                 <div className="w-24 h-10 bg-white/5 animate-pulse rounded-full ml-2"></div>
            ) : (
                <div onClick={() => navigate('/pricing')} className="ml-2 cursor-pointer">
                    <TokenBadge tokens={tokens} />
                </div>
            )}
            
            <div className="w-px h-6 bg-slate-700 mx-2"></div>
            
            <div className="flex items-center gap-3 cursor-pointer hover:bg-white/5 px-2 py-1 rounded-lg transition" onClick={() => navigate('/profile')}>
                <img src={user.photoURL || `https://ui-avatars.com/api/?name=${user.displayName}&background=0D8ABC&color=fff`} alt="User" className="w-9 h-9 rounded-full border border-slate-600 shadow-sm" />
                <span className="font-semibold text-slate-300 hidden md:block text-sm">{user.displayName}</span>
            </div>

            <button 
              onClick={() => { auth.signOut().then(() => navigate('/')) }} 
              className="ml-2 text-slate-500 hover:text-red-400 transition"
              title="Log Out"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
            </button>
          </div>
        </motion.nav>

        {/* Hero Welcome */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-14 text-center md:text-left"
        >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 mb-4 tracking-tight">
                Welcome back, {user.displayName?.split(' ')[0] || 'User'}
            </h1>
            <p className="text-slate-400 text-lg md:text-xl max-w-2xl font-medium">Your AI career co-pilot is ready. Let's elevate your interview skills to the next level.</p>
        </motion.div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
            
            {/* Mock Interview Card */}
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-[#0c1021]/80 to-[#070b14]/80 backdrop-blur-xl border border-blue-500/20 p-8 rounded-[2rem] relative overflow-hidden group hover:border-blue-400/40 transition duration-500 shadow-[0_0_40px_rgba(37,99,235,0.05)] flex flex-col"
            >
                {/* 3D decorative element */}
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-600/20 rounded-full blur-[50px] group-hover:bg-blue-500/30 transition duration-700 pointer-events-none"></div>
                <div className="absolute right-8 top-8 opacity-20 group-hover:opacity-40 transition duration-700 pointer-events-none transform group-hover:rotate-12 group-hover:scale-110">
                   <svg className="w-24 h-24 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                </div>

                <div className="w-16 h-16 bg-blue-500/10 border border-blue-500/30 rounded-2xl flex items-center justify-center mb-6 shadow-inner text-blue-400 backdrop-blur-sm z-10">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
                </div>
                <h2 className="text-3xl font-bold text-white mb-3 tracking-tight z-10">AI Mock Interview</h2>
                <p className="text-blue-200/60 mb-10 max-w-sm text-lg leading-relaxed z-10 flex-1">Simulate a hyper-realistic technical or HR interview. Get instant feedback on your performance, confidence, and accuracy.</p>
                
                <button 
                  onClick={() => {
                      if (tokens < 1) {
                          navigate('/pricing');
                      } else {
                          setIsModalOpen(true);
                      }
                  }}
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-[0_0_30px_rgba(37,99,235,0.3)] transition transform hover:-translate-y-1 relative overflow-hidden group/btn z-10"
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out"></div>
                    <span className="relative z-10 flex items-center justify-center gap-3 text-lg">
                        Start Practice Session <svg className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </span>
                </button>
            </motion.div>

            {/* Resume Analysis Card */}
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-[#0A0D1A]/80 backdrop-blur-xl border border-white/[0.05] p-8 rounded-[2rem] relative overflow-hidden group hover:border-purple-500/30 transition duration-500 flex flex-col"
            >
                <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-purple-600/10 rounded-full blur-[50px] group-hover:bg-purple-500/20 transition duration-700 pointer-events-none"></div>

                <div className="flex justify-between items-start mb-6 z-10">
                    <div className="w-16 h-16 bg-purple-500/10 border border-purple-500/30 rounded-2xl flex items-center justify-center text-purple-400 shadow-inner backdrop-blur-sm">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                    </div>
                    <span className="bg-emerald-500/20 text-emerald-300 text-xs font-bold px-3 py-1.5 rounded-lg border border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]">LIVE NOW</span>
                </div>

                <h2 className="text-3xl font-bold text-white mb-3 tracking-tight z-10">Resume AI Tuner</h2>
                <p className="text-slate-400 mb-10 max-w-sm text-lg leading-relaxed z-10 flex-1">Upload your resume. Harview AI will detect weaknesses, optimize keywords, and tailor it perfectly for your target role to beat ATS systems.</p>
                
                <button 
                  onClick={() => navigate('/ats')}
                  className="w-full py-4 mt-auto bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-[0_0_30px_rgba(168,85,247,0.3)] transition transform hover:-translate-y-1 relative overflow-hidden group/btn z-10"
                >
                    <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out"></div>
                    <span className="relative z-10 flex items-center justify-center gap-3 text-lg">
                        Analyze Resume (3 HV) <svg className="w-5 h-5 transition-transform group-hover/btn:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                    </span>
                </button>
            </motion.div>

        </div>

        {/* History Section */}
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
        >
            <h3 className="font-bold text-white text-2xl mb-6 flex items-center gap-3 tracking-tight">
                <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                Analytics & History
            </h3>
            
            {isLoadingData ? (
                <div className="bg-[#0A0D1A]/60 backdrop-blur-xl border border-white/[0.05] rounded-[2rem] p-12 flex flex-col items-center justify-center text-center shadow-lg animate-pulse">
                    <div className="w-16 h-16 bg-white/5 rounded-full mb-4"></div>
                    <div className="w-48 h-6 bg-white/5 rounded mb-2"></div>
                </div>
            ) : history.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {history.map((hist) => (
                        <div key={hist._id} className="bg-[#0A0D1A]/80 backdrop-blur-md border border-white/10 rounded-[2rem] p-6 hover:border-blue-500/40 transition group cursor-pointer shadow-[0_5px_20px_rgba(0,0,0,0.3)]">
                            <div className="flex justify-between items-start mb-4">
                                <div className="bg-blue-500/10 text-blue-400 font-bold px-3 py-1 rounded-lg text-xs border border-blue-500/20">{new Date(hist.createdAt).toLocaleDateString()}</div>
                                {hist.overallRating && (
                                    <div className={`font-black text-lg ${hist.overallRating >= 8 ? 'text-emerald-400' : hist.overallRating >= 5 ? 'text-yellow-400' : 'text-red-400'}`}>
                                        {hist.overallRating}/10
                                    </div>
                                )}
                            </div>
                            <h4 className="text-xl font-bold text-white mb-1 line-clamp-1">{hist.jobPosition}</h4>
                            <p className="text-slate-400 text-sm mb-4">{hist.experience} Yrs Exp • {hist.language}</p>
                            <button onClick={() => navigate('/feedback/' + hist._id)} className="w-full py-2.5 rounded-xl border border-white/10 text-slate-300 font-semibold group-hover:bg-blue-500/20 group-hover:text-blue-300 transition group-hover:border-blue-500/30">View Analysis →</button>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-[#0A0D1A]/60 backdrop-blur-xl border border-white/[0.05] rounded-[2rem] p-12 flex flex-col items-center justify-center text-center shadow-lg">
                    <div className="w-20 h-20 bg-slate-800/80 rounded-3xl flex items-center justify-center mb-6 border border-slate-700/50 shadow-inner rotate-3">
                        <svg className="w-10 h-10 text-slate-500 -rotate-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                    </div>
                    <h4 className="text-xl font-bold text-slate-200 mb-2">No Past Interviews Found</h4>
                    <p className="text-slate-500 max-w-md text-lg">You haven't completed any mock interviews yet. Start a session to build your personalized AI performance graph.</p>
                </div>
            )}
        </motion.div>

      </div>

      {/* New Interview Modal (Premium 3D Glassmorphism) */}
      <AnimatePresence>
      {isModalOpen && (
        <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-[#03020A]/70 backdrop-blur-2xl flex flex-col items-center justify-center z-50 p-4"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 40, opacity: 0, rotateX: 10 }}
            animate={{ scale: 1, y: 0, opacity: 1, rotateX: 0 }}
            exit={{ scale: 0.9, y: 40, opacity: 0, rotateX: -10 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            style={{ perspective: 1000 }}
            className="bg-gradient-to-br from-[#0f152b]/95 to-[#0A0D1A]/95 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] w-full max-w-xl p-8 md:p-10 shadow-[0_0_80px_rgba(37,99,235,0.2),inset_0_1px_3px_rgba(255,255,255,0.1)] relative overflow-hidden"
          >
            {/* Modal Glow & Abstract shapes */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-blue-500/30 rounded-full blur-[50px] pointer-events-none"></div>
            <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-500/20 rounded-full blur-[50px] pointer-events-none"></div>
            <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-blue-400 to-transparent opacity-70"></div>
            
            <button 
              onClick={() => setIsModalOpen(false)}
              className="absolute top-6 right-6 text-slate-400 hover:text-white transition bg-slate-800/40 hover:bg-slate-700/80 rounded-full p-2.5 backdrop-blur-md border border-white/5 hover:scale-110 active:scale-95"
              disabled={isLoading}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>

            <div className="flex items-center gap-4 mb-3 relative z-10">
               <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center shadow-[inset_0_1px_5px_rgba(255,255,255,0.1)]">
                  <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path></svg>
               </div>
               <h2 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 tracking-tight">Configure Session</h2>
            </div>
            
            <p className="text-slate-400 mb-8 font-medium text-lg leading-relaxed mix-blend-screen relative z-10">Design your AI Co-pilot parameters for hyper-realistic evaluation.</p>
            
            <form onSubmit={handleStartInterview} className="relative z-10">
              <div className="mb-6 group">
                <label className="block text-xs font-bold text-blue-400/80 mb-2 uppercase tracking-widest group-focus-within:text-blue-400 transition-colors">Target Job Role</label>
                <input 
                  type="text" 
                  value={jobRole} 
                  onChange={(e)=>setJobRole(e.target.value)} 
                  required 
                  placeholder="Ex. Senior React Developer" 
                  className="w-full px-5 py-4 bg-[#03020A]/50 rounded-2xl border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:bg-blue-900/10 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]" 
                  disabled={isLoading}
                />
              </div>
              <div className="mb-6 group">
                <label className="block text-xs font-bold text-blue-400/80 mb-2 uppercase tracking-widest group-focus-within:text-blue-400 transition-colors">Tech Stack / Core Skills</label>
                <textarea 
                  value={jobDesc} 
                  onChange={(e)=>setJobDesc(e.target.value)} 
                  required 
                  placeholder="Ex. React, Node.js, System Design, 5 years exp..." 
                  rows="3" 
                  className="w-full px-5 py-4 bg-[#03020A]/50 rounded-2xl border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:bg-blue-900/10 focus:ring-4 focus:ring-blue-500/10 transition-all resize-none shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]"
                  disabled={isLoading}
                ></textarea>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10">
                <div className="group">
                  <label className="block text-xs font-bold text-blue-400/80 mb-2 uppercase tracking-widest group-focus-within:text-blue-400 transition-colors">Experience</label>
                  <div className="relative">
                      <input 
                        type="number" 
                        value={experience} 
                        onChange={(e)=>setExperience(e.target.value)} 
                        required 
                        placeholder="Ex. 3" 
                        min="0" 
                        max="50"
                        className="w-full px-5 py-4 bg-[#03020A]/50 rounded-2xl border border-white/10 text-white placeholder-slate-600 focus:outline-none focus:border-blue-500/50 focus:bg-blue-900/10 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)]" 
                        disabled={isLoading}
                      />
                      <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-500 font-medium pointer-events-none">Yrs</span>
                  </div>
                </div>
                <div className="group">
                  <label className="block text-xs font-bold text-blue-400/80 mb-2 uppercase tracking-widest group-focus-within:text-blue-400 transition-colors">Language</label>
                  <div className="relative">
                    <select 
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full px-5 py-4 bg-[#03020A]/50 rounded-2xl border border-white/10 text-white focus:outline-none focus:border-blue-500/50 focus:bg-blue-900/10 focus:ring-4 focus:ring-blue-500/10 transition-all shadow-[inset_0_2px_10px_rgba(0,0,0,0.5)] appearance-none cursor-pointer"
                      disabled={isLoading}
                    >
                      <option value="English" className="bg-[#0A0D1A]">English</option>
                      <option value="Hindi" className="bg-[#0A0D1A]">हिंदी (Hindi)</option>
                    </select>
                    <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 bg-[#03020A]/50 pl-2">
                        <svg className="w-5 h-5 drop-shadow-md" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col-reverse sm:flex-row gap-4">
                <button 
                  type="button" 
                  onClick={() => setIsModalOpen(false)} 
                  className="w-full sm:w-1/3 py-4 text-slate-300 bg-white/5 hover:bg-white/10 font-bold rounded-2xl transition border border-white/10 hover:border-white/20 shadow-[0_4px_15px_rgba(0,0,0,0.2)]"
                  disabled={isLoading}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isLoading}
                  className="w-full sm:w-2/3 relative py-4 bg-gradient-to-br from-blue-600 to-indigo-700 hover:from-blue-500 hover:to-indigo-600 text-white font-bold text-lg rounded-2xl shadow-[0_10px_30px_rgba(37,99,235,0.4),inset_0_2px_0_rgba(255,255,255,0.2)] hover:shadow-[0_10px_40px_rgba(37,99,235,0.6),inset_0_2px_0_rgba(255,255,255,0.4)] transition-all transform hover:-translate-y-1 overflow-hidden group/btn disabled:opacity-50 disabled:transform-none"
                >
                  <div className="absolute inset-0 bg-white/20 translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300 ease-out"></div>
                  {isLoading ? (
                      <span className="relative z-10 flex items-center justify-center gap-2">Initializing AI <span className="animate-spin text-xl">⚙️</span></span>
                  ) : (
                      <span className="relative z-10 flex items-center justify-center gap-2">Initialize Session <svg className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg></span>
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
      </AnimatePresence>

      {/* 3D Fullscreen Loading Overlay (Dark Theme) */}
      <AnimatePresence>
        {isLoading && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-[#03020A]/95 backdrop-blur-2xl"
          >
            <div className="relative w-40 h-40 mb-12 flex items-center justify-center perspective-[1000px]">
              {/* Outer 3D Ring */}
              <motion.div 
                animate={{ rotateX: 360, rotateZ: 180 }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-[3px] border-t-blue-500 border-r-indigo-500 border-b-transparent border-l-transparent rounded-full shadow-[0_0_30px_rgba(59,130,246,0.3)]"
                style={{ transformStyle: 'preserve-3d' }}
              />
              {/* Inner 3D Ring */}
              <motion.div 
                animate={{ rotateY: -360, rotateZ: 180 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 border-[4px] border-b-purple-500 border-l-pink-500 border-t-transparent border-r-transparent rounded-full shadow-[0_0_30px_rgba(168,85,247,0.3)]"
                style={{ transformStyle: 'preserve-3d' }}
              />
              {/* Pulsing AI Core */}
              <motion.div 
                animate={{ scale: [1, 1.2, 1], opacity: [0.7, 1, 0.7] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="w-16 h-16 bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 rounded-full shadow-[0_0_80px_rgba(139,92,246,0.8)] flex items-center justify-center"
              >
                  <div className="w-8 h-8 bg-white/30 rounded-full blur-[4px]"></div>
              </motion.div>
            </div>
            
            <motion.h2 
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400 mb-4 tracking-tight text-center"
            >
              Synthesizing Brainpower...
            </motion.h2>
            
            <p className="text-slate-400 font-medium text-xl text-center max-w-lg mt-2 leading-relaxed">
              Analyzing your role parameters.<br/>Generating hyper-realistic questions via Harview AI.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

export default Dashboard;
