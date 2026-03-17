import React, { useEffect, useState } from 'react';
import { auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import HarviewLogo from './components/HarviewLogo';

function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  const handleGetStarted = () => navigate(user ? '/dashboard' : '/auth');

  // Animation configurations
  const floatAnim = (delay) => ({
    y: [0, -15, 0],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: "easeInOut",
      delay: delay
    }
  });

  return (
    <div className="min-h-screen bg-[#03020A] font-sans selection:bg-purple-500/30 overflow-hidden text-white relative">
        
        {/* --- PREMIUM CINEMATIC BACKGROUND --- */}
        <div className="fixed inset-0 z-0 pointer-events-none">
            {/* Dark Navy to Deep Purple Base Gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/30 via-[#03020A] to-[#03020A]"></div>
            
            {/* Subtle Grid Lines */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_60%_at_50%_0%,#000_70%,transparent_110%)]"></div>
            
            {/* Glowing Light Rays / Soft Animated Gradients (Optimized for performance) */}
            <div className="absolute -top-[30%] -left-[10%] w-[70vw] h-[70vw] bg-blue-600/5 rounded-full blur-[80px] transform-gpu pointer-events-none z-[-1]"></div>
            <div className="absolute top-[20%] -right-[20%] w-[60vw] h-[60vw] bg-purple-600/5 rounded-full blur-[80px] transform-gpu pointer-events-none z-[-1]"></div>
            
            {/* Holographic Circles Behind Hero */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-[600px] h-[600px] rounded-full border border-white/5 opacity-50 transform-gpu z-[-1]"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] w-[800px] h-[800px] rounded-full border border-white/5 border-dashed opacity-20 transform-gpu z-[-1]"></div>

            {/* Neural Network Lines (SVG) (Optimized Static) */}
            <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none z-[-1]" xmlns="http://www.w3.org/2000/svg">
                <path d="M 15vw 25vh C 30vw 30vh, 40vw 10vh, 50vw 50vh" fill="none" stroke="#3b82f6" strokeWidth="1" strokeDasharray="10 20" />
                <path d="M 85vw 20vh C 70vw 40vh, 60vw 60vh, 80vw 80vh" fill="none" stroke="#8b5cf6" strokeWidth="1" strokeDasharray="5 15" />
                <path d="M 20vw 75vh Q 50vw 90vh, 60vw 50vh" fill="none" stroke="#c084fc" strokeWidth="1" strokeDasharray="15 25" />
            </svg>
            
            {/* Floating Particles */}
            {[...Array(20)].map((_, i) => (
                <motion.div 
                    key={i}
                    className="absolute w-1 h-1 bg-blue-300 rounded-full shadow-[0_0_10px_#93c5fd]"
                    initial={{ x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight, opacity: Math.random() * 0.5 + 0.1 }}
                    animate={{ y: [null, Math.random() * -200], opacity: [null, 0] }}
                    transition={{ duration: Math.random() * 10 + 10, repeat: Infinity, ease: "linear" }}
                />
            ))}
        </div>

      {/* --- NAVBAR --- */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="flex items-center justify-between p-6 max-w-7xl mx-auto relative z-50"
      >
        <div className="flex items-center gap-3 cursor-pointer">
            <HarviewLogo size={40} className="hover:scale-105 transition-transform drop-shadow-[0_0_12px_rgba(99,102,241,0.6)]" />
            <span className="text-2xl font-black tracking-tight text-white">Harview <span className="text-blue-500">AI</span></span>
        </div>
        <div>
          {user ? (
            <button onClick={() => navigate('/dashboard')} className="font-semibold text-blue-400 hover:text-white transition-colors flex items-center gap-2 px-5 py-2.5 rounded-full hover:bg-slate-800/50 backdrop-blur-md">
                Dashboard <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
            </button>
          ) : (
            <button onClick={() => navigate('/auth')} className="px-6 py-2.5 bg-white/5 border border-white/10 backdrop-blur-lg text-white font-bold rounded-full hover:bg-white/10 transition-all transform flex items-center gap-2 group">
                Join Now Free
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path></svg>
            </button>
          )}
        </div>
      </motion.nav>

      {/* --- HERO SECTION --- */}
      <main className="max-w-7xl mx-auto px-6 h-[calc(100vh-100px)] min-h-[700px] flex flex-col justify-center items-center text-center relative z-20">
        
        {/* --- 3D FLOATING CARDS (PARALLAX + ANTI-GRAVITY) --- */}
        <div className="absolute inset-0 pointer-events-none w-full h-full max-w-7xl mx-auto">
            
            {/* Card 1: AI Feedback (Top Left) */}
            <motion.div 
                initial={{ opacity: 0, x: -50, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1, ...floatAnim(0) }}
                className="hidden lg:flex absolute top-[15%] left-[2%] xl:left-[5%] w-64 p-5 rounded-[2rem] bg-indigo-950/40 border border-white/10 backdrop-blur-md shadow-xl transform -rotate-[6deg] flex-col will-change-transform"
            >
                <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 border border-blue-500/30">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                    </div>
                    <div>
                        <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">AI Insight</div>
                        <div className="text-[10px] text-emerald-400 font-medium">+15% Confidence</div>
                    </div>
                </div>
                <div className="space-y-3">
                    <div className="h-2 bg-blue-500/50 rounded-full w-4/5 shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                    <div className="h-2 bg-white/10 rounded-full w-full"></div>
                    <div className="h-2 bg-white/10 rounded-full w-2/3"></div>
                </div>
            </motion.div>

            {/* Card 2: Code Editor (Bottom Left) */}
            <motion.div 
                initial={{ opacity: 0, x: -50, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1, ...floatAnim(1) }}
                className="hidden md:flex absolute bottom-[20%] left-[5%] xl:left-[10%] w-72 p-6 rounded-[2rem] bg-[#0A0D18]/90 border border-slate-700/50 backdrop-blur-md shadow-2xl transform rotate-[4deg] flex-col will-change-transform"
            >
                <div className="flex gap-2 mb-5 border-b border-slate-800 pb-4">
                    <div className="w-3 h-3 rounded-full bg-red-500/80 shadow-[0_0_8px_rgba(239,68,68,0.5)]"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500/80 shadow-[0_0_8px_rgba(234,179,8,0.5)]"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500/80 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
                </div>
                <div className="font-mono text-sm leading-relaxed">
                    <span className="text-purple-400">async function</span> <span className="text-blue-400">evaluate()</span> {'{'} <br/>
                    &nbsp;&nbsp;<span className="text-slate-400">const</span> <span className="text-white">score</span> = <span className="text-yellow-300">await</span> <span className="text-emerald-300">AI</span>;<br/>
                    &nbsp;&nbsp;<span className="text-purple-400">return</span> <span className="text-blue-300">"Hired"</span>;<br/>
                    {'}'}
                </div>
            </motion.div>

            {/* Card 3: Analytics Dashboard (Top Right) */}
            <motion.div 
                initial={{ opacity: 0, x: 50, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1, ...floatAnim(0.5) }}
                className="hidden lg:flex absolute top-[20%] right-[2%] xl:right-[5%] w-64 p-6 rounded-[2rem] bg-slate-900/60 border border-white/5 backdrop-blur-md shadow-xl transform rotate-[5deg] flex-col will-change-transform"
            >
                <div className="text-xs font-black text-slate-300 uppercase tracking-widest mb-4 flex justify-between">
                    Performance
                    <span className="text-purple-400">Top 5%</span>
                </div>
                {/* Mini Chart */}
                <div className="flex items-end gap-2 h-16 mt-2 relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-purple-500/10 to-transparent"></div>
                    {[40, 60, 45, 80, 50, 95].map((h, i) => (
                        <div key={i} className={`flex-1 rounded-t-sm ${i === 5 ? 'bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.8)]' : 'bg-white/20'}`} style={{ height: `${h}%` }}></div>
                    ))}
                </div>
            </motion.div>
            
            {/* Card 4: AI Brain Icon (Bottom Right) */}
            <motion.div 
                initial={{ opacity: 0, x: 50, scale: 0.8 }}
                animate={{ opacity: 1, x: 0, scale: 1, ...floatAnim(1.5) }}
                className="hidden md:flex absolute bottom-[25%] right-[5%] xl:right-[12%] w-24 h-24 rounded-[2rem] bg-gradient-to-br from-indigo-900/80 to-purple-900/60 border border-purple-500/30 backdrop-blur-md shadow-xl transform -rotate-[10deg] items-center justify-center pointer-events-auto hover:scale-110 transition-transform cursor-pointer will-change-transform"
            >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(168,85,247,0.4)_0%,transparent_70%)] rounded-[2rem]"></div>
                <svg className="w-12 h-12 text-purple-300 drop-shadow-[0_0_15px_rgba(216,180,254,0.8)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
            </motion.div>
        </div>

        {/* --- MAIN HERO CONTENT --- */}
        <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-3 px-5 py-2 rounded-full border border-blue-500/20 bg-blue-500/10 text-blue-300 text-sm font-semibold mb-8 backdrop-blur-md shadow-[0_0_30px_rgba(59,130,246,0.15)] relative"
        >
            <span className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_10px_rgba(96,165,250,1)] animate-pulse"></span>
            Powered by Enterprise Intelligence
        </motion.div>
        
        <motion.h1 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-5xl md:text-7xl lg:text-[5.5rem] font-black tracking-tight leading-[1.1] mb-8 max-w-5xl"
        >
          Crack your dream job with <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#4F46E5] via-[#8B5CF6] to-[#EC4899] drop-shadow-[0_0_40px_rgba(139,92,246,0.4)]">
            AI Precision
          </span>
        </motion.h1>
        
        <motion.p 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-xl md:text-2xl text-slate-400 max-w-2xl mb-14 leading-relaxed font-normal"
        >
          Experience hyper-realistic mock interviews tailored exactly to your target role. Get instant, detailed feedback on every answer.
        </motion.p>
        
        <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row gap-6 w-full justify-center relative z-50"
        >
          {/* Primary CTA: Glassmorphism + Glowing Border */}
          <button onClick={handleGetStarted} className="relative group px-10 py-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 hover:border-blue-500/50 transition-all duration-300 flex items-center justify-center gap-3 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
            {/* Animated glowing border effect */}
            <div className="absolute -inset-[1px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl opacity-0 group-hover:opacity-40 blur transition-opacity duration-300 -z-10"></div>
            
            <span className="relative text-white font-bold text-lg tracking-wide">Start Practicing Now</span>
            <svg className="w-5 h-5 text-white relative group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
          </button>
          
          {/* Secondary CTA */}
          <button onClick={() => navigate('/auth')} className="px-10 py-5 bg-transparent text-slate-300 font-bold rounded-2xl border border-slate-700 hover:bg-slate-800 transition-all flex items-center justify-center gap-3 text-lg hover:text-white">
            Join Now Free
          </button>
        </motion.div>

      </main>
    </div>
  );
}

export default App;
