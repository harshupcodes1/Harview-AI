import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from './firebase';
import HarviewLogo from './components/HarviewLogo';

export default function Profile() {
    const navigate = useNavigate();
    const [userContext, setUserContext] = useState(null);
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            if (user) {
                try {
                    // Sync User to get tokens
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
                    setUserContext(syncData.user);

                    // Fetch History
                    const histRes = await fetch(`https://harview-ai.onrender.com/api/interview/history/${user.uid}`);
                    const histData = await histRes.json();
                    if (histData.success) {
                        setHistory(histData.history);
                    }
                } catch (err) {
                    console.error("Failed to load profile", err);
                } finally {
                    setLoading(false);
                }
            } else {
                navigate('/');
            }
        });
        return () => unsubscribe();
    }, [navigate]);

    if (loading) return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center">
            <div className="w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-950 font-sans text-slate-200 overflow-hidden relative">
            <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-indigo-600/10 blur-[120px] rounded-full mix-blend-screen pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-purple-600/10 blur-[100px] rounded-full mix-blend-screen pointer-events-none"></div>

            {/* Navbar Placeholder - usually you'd extract this to a Layout component */}
            <nav className="border-b border-white/5 bg-slate-900/50 backdrop-blur-xl relative z-10 sticky top-0">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link to="/" className="text-xl font-black text-white flex items-center gap-2">
                        <HarviewLogo size={34} className="drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" />
                        Harview AI
                    </Link>
                    <div className="flex items-center gap-4">
                        <div className="bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700 font-bold text-amber-400 flex items-center gap-2 shadow-inner">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12z"></path></svg>
                            {userContext?.tokens !== undefined ? userContext.tokens : 0} Credits
                        </div>
                        <Link to="/ats" className="text-sm font-bold text-slate-300 hover:text-white transition">ATS Check</Link>
                        <Link to="/dashboard" className="text-sm font-bold text-slate-300 hover:text-white transition">Dashboard</Link>
                    </div>
                </div>
            </nav>

            <main className="max-w-6xl mx-auto px-6 py-12 relative z-10">

                {/* Professional Profile Header */}
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="bg-[#0A0D1A] border border-white/5 rounded-3xl shadow-lg flex flex-col items-center justify-center py-12 px-6 mb-12 relative overflow-hidden">
                    
                    {/* Subtle grid background */}
                    <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] pointer-events-none mix-blend-overlay"></div>
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>

                    <div className="relative mb-6">
                        <img 
                            src={userContext?.profileImage || auth.currentUser?.photoURL || `https://ui-avatars.com/api/?name=${userContext?.name || auth.currentUser?.displayName || auth.currentUser?.email || 'User'}&size=256&background=0D8ABC&color=fff`} 
                            alt="Profile Avatar" 
                            className="w-32 h-32 rounded-full border-[3px] border-indigo-500/30 relative z-10 shadow-md object-cover bg-slate-900"
                        />
                        <div className="absolute bottom-1 right-1 w-6 h-6 bg-emerald-500 border-[3px] border-[#0A0D1A] rounded-full z-20 shadow-sm" title="Online"></div>
                    </div>

                    <div className="text-center relative z-10">
                        <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">
                            {userContext?.name || auth.currentUser?.displayName || auth.currentUser?.email?.split('@')[0] || "User"}
                        </h1>
                        <p className="text-slate-400 font-medium text-sm mb-8 flex items-center justify-center gap-2">
                            <svg className="w-4 h-4 text-slate-500" fill="currentColor" viewBox="0 0 20 20"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207"></path></svg>
                            {userContext?.email || auth.currentUser?.email || "No email linked"}
                        </p>
                        
                        <div className="flex flex-wrap items-center justify-center gap-4">
                            <div className="bg-slate-900 border border-slate-700 px-5 py-2.5 rounded-xl flex items-center gap-3 shadow-inner">
                                <div className="w-6 h-6 rounded-md bg-blue-500/10 text-blue-400 flex items-center justify-center">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                                </div>
                                <div className="text-left">
                                    <p className="font-semibold text-slate-300 text-sm">Harview Member</p>
                                </div>
                            </div>
                            
                            <Link to="/pricing" className="bg-blue-600 hover:bg-blue-500 text-white font-semibold flex items-center gap-2 px-6 py-2.5 rounded-xl shadow-md transition-colors border border-blue-500/50">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                                Add Credits
                            </Link>
                        </div>
                    </div>
                </motion.div>

                {/* Statistics Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-3xl border border-slate-800 shadow-xl flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-blue-500/20 border border-blue-500/50 text-blue-400 flex items-center justify-center shadow-[0_0_20px_rgba(59,130,246,0.3)]">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                        </div>
                        <div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Mocks Attempted</p>
                            <h3 className="text-4xl font-black text-white drop-shadow-md">{history.length}</h3>
                        </div>
                    </motion.div>

                    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }} className="bg-gradient-to-br from-slate-900 to-slate-800 p-6 rounded-3xl border border-slate-800 shadow-xl flex items-center gap-6">
                        <div className="w-16 h-16 rounded-2xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 flex items-center justify-center shadow-[0_0_20px_rgba(16,185,129,0.3)]">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"></path></svg>
                        </div>
                        <div>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Avg AI Score</p>
                            <h3 className="text-4xl font-black text-white drop-shadow-md">
                                {history.length > 0
                                    ? (history.reduce((a, b) => a + (b.overallRating || 0), 0) / history.filter(h => h.overallRating).length || 0).toFixed(1)
                                    : "0.0"} <span className="text-xl text-slate-500">/10</span>
                            </h3>
                        </div>
                    </motion.div>
                </div>

                {/* Interview History Log */}
                <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-[2rem] p-8 shadow-2xl">
                    <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3">
                        <svg className="w-6 h-6 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        Generated Matrices (History)
                    </h2>

                    <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                        <AnimatePresence>
                            {history.length > 0 ? history.map((interview, i) => (
                                <motion.div
                                    initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }}
                                    key={interview._id}
                                    className="bg-slate-950/80 border border-slate-800 p-5 rounded-2xl hover:border-indigo-500/40 transition-all group flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden"
                                >
                                    <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-indigo-500 to-purple-500 transform scale-y-0 group-hover:scale-y-100 transition-transform origin-top"></div>

                                    <div className="flex-1 space-y-1 pl-2">
                                        <h3 className="text-lg font-bold text-slate-100">{interview.jobPosition}</h3>
                                        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400 font-medium">
                                            <span className="bg-slate-800 px-2 py-1 rounded text-slate-300">{interview.language}</span>
                                            <span>•</span>
                                            <span className="flex items-center gap-1">
                                                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                {new Date(interview.createdAt).toLocaleDateString()}
                                            </span>
                                            <span>•</span>
                                            <span>{interview.experience} yrs exp.</span>
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:items-end gap-2">
                                        {interview.overallRating ? (
                                            <span className="text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 rounded-lg shadow-inner text-sm flex items-center gap-2">
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                                Score: {interview.overallRating}/10
                                            </span>
                                        ) : (
                                            <span className="text-slate-500 bg-slate-800 border border-slate-700 px-3 py-1 rounded-lg text-sm font-medium">
                                                Incomplete Simulation
                                            </span>
                                        )}
                                        {interview.overallRating && (
                                            <Link to={`/feedback/${interview._id}`} className="text-indigo-400 hover:text-white text-xs font-bold uppercase tracking-widest transition group-hover:underline">
                                                Load Feedback Report
                                            </Link>
                                        )}
                                    </div>
                                </motion.div>
                            )) : (
                                <div className="text-center py-16 px-4">
                                    <div className="w-20 h-20 bg-slate-900 border-2 border-dashed border-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-500">
                                        <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-300 mb-2">No Matrices Attempted</h3>
                                    <p className="text-slate-500 mb-6 max-w-sm mx-auto">Generate your first AI interview to establish a baseline proficiency score.</p>
                                    <Link to="/dashboard" className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg transition transform hover:scale-105 inline-block">
                                        Initialize Simulation
                                    </Link>
                                </div>
                            )}
                        </AnimatePresence>
                    </div>
                </motion.div>
            </main>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 6px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background-color: rgba(99, 102, 241, 0.3); border-radius: 20px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background-color: rgba(99, 102, 241, 0.6); }
            `}</style>
        </div>
    );
}
