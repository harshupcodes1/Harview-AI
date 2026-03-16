import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { auth, provider } from './firebase';
import { signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

function AuthPage() {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleAuth = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (isLogin) {
                await signInWithEmailAndPassword(auth, email, password);
                navigate('/dashboard');
            } else {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                await updateProfile(userCredential.user, { displayName: name });
                // Force sign out so they have to login
                await auth.signOut();
                alert("Account created successfully! Please log in.");
                setIsLogin(true);
                setPassword('');
            }
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleGoogle = async () => {
        try {
            await signInWithPopup(auth, provider);
            navigate('/dashboard');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden font-sans">
            {/* 3D Floating Glowing Orbs */}
            <motion.div animate={{ rotate: 360 }} transition={{ duration: 40, repeat: Infinity, ease: "linear" }} className="absolute -top-[20%] -left-[10%] w-[500px] h-[500px] bg-blue-600/30 rounded-full mix-blend-screen filter blur-[120px] pointer-events-none"></motion.div>
            <motion.div animate={{ rotate: -360 }} transition={{ duration: 50, repeat: Infinity, ease: "linear" }} className="absolute -bottom-[20%] -right-[10%] w-[500px] h-[500px] bg-purple-600/30 rounded-full mix-blend-screen filter blur-[120px] pointer-events-none"></motion.div>

            <button onClick={() => navigate('/')} className="absolute top-8 left-8 text-white font-bold flex items-center gap-2 hover:text-blue-400 transition z-50 bg-black/20 px-4 py-2 rounded-full backdrop-blur-md border border-white/10">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                Back to Home
            </button>

            {/* 3D Scene Wrapper */}
            <div className="w-full max-w-[28rem] h-[650px] perspective-1000 relative z-10">
                <motion.div 
                    initial={false}
                    animate={{ rotateY: isLogin ? 0 : 180 }}
                    transition={{ duration: 0.9, type: "spring", bounce: 0.4 }}
                    className="w-full h-full relative"
                    style={{ transformStyle: "preserve-3d" }}
                >
                    {/* Front: Login Form */}
                    <div className="absolute inset-0 w-full h-full backface-hidden bg-slate-800/60 backdrop-blur-2xl border border-slate-700/50 rounded-[2.5rem] p-10 shadow-[0_0_60px_rgba(37,99,235,0.2)] flex flex-col justify-center">
                        <div className="text-center mb-10">
                            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-blue-500/40">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z"></path></svg>
                            </div>
                            <h2 className="text-4xl font-black text-white tracking-tight mb-2">Welcome Back</h2>
                            <p className="text-blue-300/80 font-medium">Log in to ace your next interview</p>
                        </div>

                        <form onSubmit={handleAuth} className="space-y-5">
                            <div>
                                <input type="email" placeholder="Email Address" required value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-2xl px-5 py-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition shadow-inner font-medium" />
                            </div>
                            <div>
                                <input type="password" placeholder="Password" required value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-2xl px-5 py-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition shadow-inner font-medium" />
                            </div>
                            <button disabled={loading} type="submit" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black text-lg py-4 rounded-2xl shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] hover:-translate-y-0.5 transition-all transform disabled:opacity-50 disabled:cursor-not-allowed mt-2">
                                {loading ? "Authenticating..." : "Secure Login"}
                            </button>
                        </form>

                        <div className="my-8 flex items-center justify-center gap-4">
                            <div className="h-px bg-slate-700 flex-1"></div>
                            <span className="text-slate-500 text-xs font-black uppercase tracking-widest">Or</span>
                            <div className="h-px bg-slate-700 flex-1"></div>
                        </div>

                        <button onClick={handleGoogle} className="w-full bg-slate-200 hover:bg-white text-slate-800 font-bold py-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg transition-all transform hover:-translate-y-0.5">
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="Google" />
                            Continue with Google
                        </button>

                        <p className="text-center text-slate-400 mt-8 font-medium">
                            Don't have an account? <button onClick={() => setIsLogin(false)} className="text-blue-400 font-bold hover:text-blue-300 transition hover:underline">Register Here</button>
                        </p>
                    </div>

                    {/* Back: Register Form */}
                    <div className="absolute inset-0 w-full h-full backface-hidden bg-slate-800/60 backdrop-blur-2xl border border-slate-700/50 rounded-[2.5rem] p-10 shadow-[0_0_60px_rgba(168,85,247,0.2)] flex flex-col justify-center" style={{ transform: "rotateY(180deg)" }}>
                        <div className="text-center mb-10">
                            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl mx-auto mb-6 flex items-center justify-center shadow-lg shadow-purple-500/40">
                                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path></svg>
                            </div>
                            <h2 className="text-4xl font-black text-white tracking-tight mb-2">Join Harview AI</h2>
                            <p className="text-purple-300/80 font-medium">Create an account to get Free Tokens</p>
                        </div>

                        <form onSubmit={handleAuth} className="space-y-4">
                            <div>
                                <input type="text" placeholder="Full Name" required value={name} onChange={(e)=>setName(e.target.value)} className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-2xl px-5 py-4 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition shadow-inner font-medium" />
                            </div>
                            <div>
                                <input type="email" placeholder="Email Address" required value={email} onChange={(e)=>setEmail(e.target.value)} className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-2xl px-5 py-4 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition shadow-inner font-medium" />
                            </div>
                            <div>
                                <input type="password" placeholder="Create Password" required value={password} onChange={(e)=>setPassword(e.target.value)} className="w-full bg-slate-900/50 border border-slate-700 text-white rounded-2xl px-5 py-4 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition shadow-inner font-medium" />
                            </div>
                            <button disabled={loading} type="submit" className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-lg py-4 rounded-2xl shadow-[0_0_20px_rgba(168,85,247,0.4)] hover:shadow-[0_0_30px_rgba(168,85,247,0.6)] hover:-translate-y-0.5 transition-all transform disabled:opacity-50 disabled:cursor-not-allowed mt-2">
                                {loading ? "Creating..." : "Create Account"}
                            </button>
                        </form>

                        <div className="my-6 flex items-center justify-center gap-4">
                            <div className="h-px bg-slate-700 flex-1"></div>
                            <span className="text-slate-500 text-xs font-black uppercase tracking-widest">Or</span>
                            <div className="h-px bg-slate-700 flex-1"></div>
                        </div>

                        <button onClick={handleGoogle} className="w-full bg-slate-200 hover:bg-white text-slate-800 font-bold py-4 rounded-2xl flex items-center justify-center gap-3 shadow-lg transition-all transform hover:-translate-y-0.5">
                            <img src="https://www.svgrepo.com/show/475656/google-color.svg" className="w-6 h-6" alt="Google" />
                            Register with Google
                        </button>

                        <p className="text-center text-slate-400 mt-6 font-medium">
                            Already have an account? <button onClick={() => setIsLogin(true)} className="text-purple-400 font-bold hover:text-purple-300 transition hover:underline">Log In</button>
                        </p>
                    </div>
                </motion.div>
            </div>
            
            {/* Styles for preserving 3D Context in Tailwind */}
            <style dangerouslySetInnerHTML={{__html: `
                .perspective-1000 { perspective: 1000px; }
                .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
            `}} />
        </div>
    );
}
export default AuthPage;
