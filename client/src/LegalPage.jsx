import React from 'react';
import { useNavigate } from 'react-router-dom';

function LegalPage({ title, date, content }) {
    const navigate = useNavigate();
    
    return (
        <div className="min-h-screen bg-slate-950 text-slate-300 font-sans relative overflow-x-hidden pt-20 pb-24">
            {/* Background Effects */}
            <div className="fixed inset-0 z-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none mix-blend-overlay"></div>
            <div className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] bg-indigo-900/20 rounded-full blur-[120px] pointer-events-none"></div>
            
            <div className="max-w-4xl mx-auto px-6 relative z-10">
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-indigo-400 hover:text-white transition mb-12">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    <span className="font-bold">Back</span>
                </button>
                
                <h1 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">{title}</h1>
                <p className="text-slate-500 mb-12 font-medium">Last Updated: {date}</p>
                
                <div className="space-y-8 text-slate-400 leading-relaxed bg-white/[0.02] border border-white/[0.05] p-8 md:p-12 rounded-[2rem] shadow-2xl backdrop-blur-sm">
                    {content.map((section, idx) => (
                        <div key={idx}>
                            <h2 className="text-xl font-bold text-white mb-3">{section.heading}</h2>
                            <p className="whitespace-pre-line">{section.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export const Terms = () => (
    <LegalPage 
        title="Terms & Conditions" 
        date="October 25, 2026"
        content={[
            { heading: "1. Acceptance of Terms", text: "By accessing Harview AI, you agree to be bound by these Terms of Service. If you disagree with any part of the terms, you may not access the service." },
            { heading: "2. Career Credits & Usage", text: "Career Credits are virtual tokens used to generate AI Mocks. They are non-transferable and can only be used within the Harview platform." },
            { heading: "3. User Accounts", text: "You must provide accurate information when creating an account. You are responsible for safeguarding your password and any activities under your account." }
        ]}
    />
);

export const Privacy = () => (
    <LegalPage 
        title="Privacy Policy" 
        date="October 25, 2026"
        content={[
            { heading: "1. Information We Collect", text: "We collect email addresses, names, and resumes strictly to provide and improve the Harview AI interviewing experience." },
            { heading: "2. Data Storage & Security", text: "All interview transcripts and ATS data are securely stored and never shared with third-party employers without explicit consent." },
            { heading: "3. Payment Information", text: "Payment processing is handled entirely by Razorpay. Harview AI does not store your credit card or banking details." }
        ]}
    />
);

export const Refund = () => (
    <LegalPage 
        title="Cancellation & Refund Policy" 
        date="October 25, 2026"
        content={[
            { heading: "1. Refund Eligibility", text: "Refunds for Career Credits are only applicable within 7 days of purchase IF no credits from that transaction have been utilized." },
            { heading: "2. Process", text: "To request a refund, contact support@harview.ai. Approved refunds will be credited back to the original payment method within 5-7 business days." },
            { heading: "3. Account Termination", text: "If your account is terminated for violating Terms of Service, any unused credits are forfeited and non-refundable." }
        ]}
    />
);

export const Contact = () => (
    <LegalPage 
        title="Contact Us" 
        date="October 25, 2026"
        content={[
            { heading: "Get in Touch", text: "For any queries, billing issues, or feedback, we are here to help." },
            { heading: "Email Support", text: "Send us an email at: support@harview.ai\nWe aim to respond to all inquiries within 24 hours." },
            { heading: "Business Address", text: "Harview AI Operations\nTech Park, Sector 62\nNoida, India" }
        ]}
    />
);
