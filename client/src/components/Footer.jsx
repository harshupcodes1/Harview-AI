import React from 'react';
import { useNavigate } from 'react-router-dom';
import HarviewLogo from './HarviewLogo';

function Footer() {
    const navigate = useNavigate();
    
    return (
        <footer className="w-full bg-[#050512] border-t border-slate-800/60 pt-16 pb-8 relative z-50 text-slate-400 font-sans">
            <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                <div className="col-span-1 md:col-span-2">
                    <div className="flex items-center gap-3 mb-6">
                        <HarviewLogo size={40} className="drop-shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                        <span className="text-2xl font-black text-white tracking-tight">Harview <span className="text-blue-500">AI</span></span>
                    </div>
                    <p className="max-w-sm text-sm leading-relaxed mb-6">
                        The ultimate AI-powered mock interview platform connecting talent with hyper-realistic proctoring environments to secure top-tier job offers.
                    </p>
                    <div className="flex gap-4">
                        <a href="mailto:support@harview.ai" className="w-10 h-10 rounded-full bg-slate-800/50 border border-slate-700 flex items-center justify-center hover:bg-blue-600/20 hover:text-blue-400 hover:border-blue-500/50 transition duration-300">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
                        </a>
                    </div>
                </div>
                
                <div>
                    <h4 className="text-white font-bold mb-6 tracking-wide uppercase text-sm">Product</h4>
                    <ul className="space-y-4">
                        <li><span className="text-slate-400">Mock Interviews</span></li>
                        <li><span className="text-slate-400">Resume ATS Check</span></li>
                        <li><span className="text-slate-400">Buy Career Credits</span></li>
                        <li><span className="text-slate-400">User Profile</span></li>
                    </ul>
                </div>

                <div>
                    <h4 className="text-white font-bold mb-6 tracking-wide uppercase text-sm">Legal</h4>
                    <ul className="space-y-4">
                        <li><span onClick={() => navigate('/terms')} className="hover:text-white cursor-pointer transition text-sm">Terms & Conditions</span></li>
                        <li><span onClick={() => navigate('/privacy')} className="hover:text-white cursor-pointer transition text-sm">Privacy Policy</span></li>
                        <li><span onClick={() => navigate('/refund')} className="hover:text-white cursor-pointer transition text-sm">Cancellation & Refund Policy</span></li>
                        <li><span onClick={() => navigate('/contact')} className="hover:text-white cursor-pointer transition text-sm">Contact Us</span></li>
                    </ul>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 pt-8 border-t border-slate-800/40 flex flex-col md:flex-row justify-between items-center text-xs gap-4">
                <p>&copy; {new Date().getFullYear()} Harview AI. All rights reserved.</p>
                <p className="text-slate-500 font-medium">Developed with ❤️ by <span className="text-slate-300 font-bold">Harsh Upadhyay</span></p>
                <div className="flex gap-4 mt-2 md:mt-0">
                    <span>Secured with Razorpay Enterprise</span>
                    <span>100% Encrypted Mocks</span>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
