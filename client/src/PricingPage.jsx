import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import TokenBadge from './components/TokenBadge';
import { auth } from './firebase';
import HarviewLogo from './components/HarviewLogo';

function PricingPage() {
    const navigate = useNavigate();
    const [loadingPlan, setLoadingPlan] = useState(null);
    const [paymentStatus, setPaymentStatus] = useState(null); // 'success' | 'error' | null

    const handlePayment = async (amountINR, credits, planName) => {
        if (!auth.currentUser) {
            alert("Please login first to purchase credits.");
            navigate('/auth');
            return;
        }

        setLoadingPlan(planName);
        setPaymentStatus(null);
        
        try {
            // 1. Create Order on Backend
            const res = await fetch('https://harview-ai.onrender.com/api/payment/create-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    amount: amountINR,
                    credits: credits,
                    firebaseUid: auth.currentUser.uid
                })
            });

            const data = await res.json();
            
            if (!data.success) {
                alert("Failed to create order: " + data.error);
                setLoadingPlan(null);
                return;
            }

            // 2. Open Razorpay Checkout
            const options = {
                key: "rzp_test_SRV8PXooWRM3QG", // Test Key ID (Safe to expose on frontend for creating popup)
                amount: data.order.amount, 
                currency: "INR",
                name: "Harview AI",
                description: `${credits} Career Credits Purchase`,
                image: "https://ui-avatars.com/api/?name=H&background=0D8ABC&color=fff", // Fake logo
                order_id: data.order.id, 
                handler: async function (response) {
                    try {
                        // 3. Verify Payment Signature
                        const verifyRes = await fetch('https://harview-ai.onrender.com/api/payment/verify', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature,
                                firebaseUid: auth.currentUser.uid,
                                credits: data.credits
                            })
                        });

                        const verifyData = await verifyRes.json();
                        
                        if (verifyData.success) {
                            setPaymentStatus('success');
                            window.dispatchEvent(new Event('tokensUpdated')); // Update TokenBadge
                        } else {
                            setPaymentStatus('error');
                            alert("Payment verification failed!");
                        }
                    } catch (err) {
                        console.error(err);
                        setPaymentStatus('error');
                    }
                },
                prefill: {
                    name: auth.currentUser.displayName || "User",
                    email: auth.currentUser.email || ""
                },
                theme: { color: "#6366f1" } // Indigo to match UI
            };

            const rzp = new window.Razorpay(options);
            rzp.on('payment.failed', function (response){
                alert("Payment Failed. Reason: " + response.error.description);
                setPaymentStatus('error');
            });
            rzp.open();

        } catch (error) {
            console.error(error);
            alert("Payment gateway connection error.");
        } finally {
            setLoadingPlan(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#03020A] text-slate-200 font-sans relative overflow-x-hidden pt-10 pb-20">
            {/* Cinematic Background */}
            <div className="fixed inset-0 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] pointer-events-none mix-blend-overlay"></div>
            <div className="absolute top-0 right-0 w-[50vw] h-[50vw] bg-purple-900/40 rounded-full blur-[150px] pointer-events-none"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-900/30 rounded-full blur-[150px] pointer-events-none"></div>

            <nav className="relative z-10 max-w-7xl mx-auto px-6 mb-16 flex justify-between items-center">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate('/dashboard')}>
                    <HarviewLogo size={48} className="hover:scale-105 transition-transform drop-shadow-[0_0_14px_rgba(99,102,241,0.7)]" />
                    <span className="text-3xl font-black tracking-tight text-white">Harview <span className="text-blue-500">AI</span></span>
                </div>
                <button onClick={() => navigate('/dashboard')} className="px-6 py-2.5 bg-white/5 border border-white/10 text-white rounded-full hover:bg-white/10 transition font-bold">Back to Dashboard</button>
            </nav>

            <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-block mb-4 px-4 py-2 rounded-full border border-amber-500/30 bg-amber-500/10 text-amber-300 font-bold uppercase tracking-widest text-xs shadow-[0_0_20px_rgba(245,158,11,0.2)]"
                >
                    Unlock Your Potential
                </motion.div>
                <motion.h1 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-slate-200 to-slate-400 mb-6 tracking-tight"
                >
                    Invest in your <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-orange-500 drop-shadow-[0_0_30px_rgba(245,158,11,0.4)]">Career Credits</span>
                </motion.h1>
                <motion.p 
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-lg md:text-xl text-slate-400 max-w-3xl mx-auto mb-20 leading-relaxed"
                >
                    Stop leaving interviews to chance. 1 Career Credit = 1 Hyper-realistic AI Mock Interview. Secure your dream job faster with targeted, data-driven practice.
                </motion.p>

                {/* 3D Pricing Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto items-center">
                    
                    {/* Basic Tier */}
                    <motion.div 
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-[#0A0D1A]/80 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] relative overflow-hidden group hover:border-blue-500/30 transition duration-500 shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col items-center"
                    >
                        <h3 className="text-2xl font-bold text-slate-300 mb-2">Starter Boost</h3>
                        <div className="text-5xl font-black text-white mb-6">₹99</div>
                        <div className="flex items-center gap-3 mb-8">
                            <span className="text-2xl font-bold text-amber-400">10</span>
                            <span className="text-slate-400 font-medium">Career Credits</span>
                        </div>
                        <p className="text-slate-500 text-sm mb-10 text-center">Perfect for prepping for an upcoming interview loop.</p>
                        <button 
                            disabled={loadingPlan === 'starter'}
                            onClick={() => handlePayment(99, 10, 'starter')}
                            className="w-full py-4 rounded-2xl border border-blue-500/50 text-blue-400 font-bold hover:bg-blue-500/10 transition hover:shadow-[0_0_20px_rgba(37,99,235,0.2)] disabled:opacity-50"
                        >
                            {loadingPlan === 'starter' ? 'Processing...' : 'Buy 10 Credits'}
                        </button>
                    </motion.div>

                    {/* Pro Tier (Popular) */}
                    <motion.div 
                        initial={{ opacity: 0, y: 40, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1.05 }}
                        transition={{ delay: 0.4 }}
                        className="bg-gradient-to-b from-[#111827] to-[#0A0D1A] backdrop-blur-3xl border border-amber-500/40 p-12 rounded-[2.5rem] relative overflow-hidden group hover:border-amber-400 transition duration-500 shadow-[0_20px_80px_rgba(245,158,11,0.2),inset_0_2px_10px_rgba(255,255,255,0.1)] flex flex-col items-center z-10"
                    >
                        <div className="absolute top-0 right-0 bg-gradient-to-bl from-amber-500 to-orange-500 text-white font-black text-xs uppercase tracking-widest px-6 py-2 rounded-bl-2xl shadow-lg">Most Popular</div>
                        
                        {/* 3D Floating Coin inside pricing */}
                        <motion.div 
                            animate={{ y: [0, -10, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                            className="w-24 h-24 mb-6 rounded-full bg-gradient-to-br from-[#FFDF00] via-[#F4C430] to-[#b8860b] shadow-[0_10px_30px_rgba(255,215,0,0.4),inset_0_-4px_10px_rgba(184,134,11,0.8),inset_0_4px_10px_rgba(255,255,255,0.8)] border border-[#FFDF00]/50 flex items-center justify-center relative group-hover:rotate-12 transition-transform duration-500"
                        >
                            <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-blue-500/20 rounded-full blur-[8px] animate-pulse"></div>
                            <span className="relative z-10 font-black text-3xl text-[#8B6508] tracking-tighter" style={{ textShadow: "1px 1px 0 rgba(255,255,255,0.4), -1px -1px 0 rgba(0,0,0,0.1)" }}>HV</span>
                        </motion.div>

                        <h3 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500 mb-2">Pro Mastery</h3>
                        <div className="text-6xl font-black text-white mb-2">₹249</div>
                        <div className="text-emerald-400 font-bold text-sm mb-6 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20">Save 20% + 5 Bonus Credits</div>
                        
                        <div className="flex items-center gap-3 mb-8">
                            <span className="text-3xl font-black text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">30</span>
                            <span className="text-amber-300 font-bold text-lg">Career Credits</span>
                        </div>
                        
                        <p className="text-slate-400 text-sm mb-10 text-center">Unlock deep ATS insights and unlimited AI proctoring parameters.</p>
                        
                        <button 
                            disabled={loadingPlan === 'pro'}
                            onClick={() => handlePayment(249, 30, 'pro')}
                            className="w-full py-5 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white font-black text-lg hover:shadow-[0_15px_40px_rgba(245,158,11,0.4)] transition-all transform hover:-translate-y-1 relative overflow-hidden group/btn disabled:opacity-50 disabled:transform-none"
                        >
                             <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.3)_50%,transparent_75%)] bg-[length:250%_250%] group-hover/btn:animate-[shimmer_2s_infinite]"></div>
                             <span className="relative z-10">{loadingPlan === 'pro' ? 'Initializing...' : 'Buy 30 Credits'}</span>
                        </button>
                    </motion.div>

                    {/* Enterprise Tier */}
                    <motion.div 
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="bg-[#0A0D1A]/80 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] relative overflow-hidden group hover:border-purple-500/30 transition duration-500 shadow-[0_0_40px_rgba(0,0,0,0.5)] flex flex-col items-center"
                    >
                        <h3 className="text-2xl font-bold text-purple-300 mb-2">Career Switcher</h3>
                        <div className="text-5xl font-black text-white mb-6">₹499</div>
                        <div className="flex items-center gap-3 mb-8">
                            <span className="text-2xl font-bold text-purple-400">100</span>
                            <span className="text-slate-400 font-medium">Career Credits</span>
                        </div>
                        <p className="text-slate-500 text-sm mb-10 text-center">Massive value for active job seekers applying to multiple domains.</p>
                        <button 
                            disabled={loadingPlan === 'enterprise'}
                            onClick={() => handlePayment(499, 100, 'enterprise')}
                            className="w-full py-4 rounded-2xl border border-purple-500/50 text-purple-400 font-bold hover:bg-purple-500/10 transition hover:shadow-[0_0_20px_rgba(168,85,247,0.2)] disabled:opacity-50"
                        >
                            {loadingPlan === 'enterprise' ? 'Processing...' : 'Buy 100 Credits'}
                        </button>
                    </motion.div>

                </div>

                {/* Success Message Banner */}
                <AnimatePresence>
                    {paymentStatus === 'success' && (
                        <motion.div 
                            initial={{ opacity: 0, y: 50, scale: 0.9 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="fixed bottom-10 left-1/2 -translate-x-1/2 z-50 bg-emerald-900/90 border border-emerald-500/50 p-6 rounded-2xl shadow-[0_20px_50px_rgba(16,185,129,0.3)] backdrop-blur-xl max-w-md w-full"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                                </div>
                                <div>
                                    <h4 className="text-lg font-bold text-white text-left">Payment Verified!</h4>
                                    <p className="text-emerald-200/80 text-sm text-left">Your Career Credits have been successfully updated. Let's get back to practice.</p>
                                </div>
                                <button onClick={()=>setPaymentStatus(null)} className="ml-auto text-emerald-500 hover:text-white transition">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

export default PricingPage;
