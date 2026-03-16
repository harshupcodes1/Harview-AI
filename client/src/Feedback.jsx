import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function Feedback() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [feedbackData, setFeedbackData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeedback = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/interview/feedback/${id}`);
                const data = await res.json();
                if(data.success) {
                    setFeedbackData(data.interview);
                }
            } catch(e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        fetchFeedback();
    }, [id]);

    if(loading) return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center font-sans text-center px-4">
            <div>
                 <div className="w-16 h-16 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mx-auto mb-6"></div>
                 <h2 className="text-3xl font-bold text-white mb-2">AI is Grinding Your Report...</h2>
                 <p className="text-slate-400">Evaluating your answers and finding insights 🧠</p>
            </div>
        </div>
    );
    
    if(!feedbackData) return <div className="min-h-screen bg-slate-50 text-center font-bold text-red-500 flex items-center justify-center">Feedback Snapshot Not Found!</div>;

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-10 font-sans text-slate-800 pb-20">
            <div className="max-w-4xl mx-auto">
                <button onClick={() => navigate('/dashboard')} className="text-blue-600 font-bold mb-6 hover:underline flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                    Back to Dashboard
                </button>
                
                {/* Hero Results Banner */}
                <div className="bg-white rounded-3xl p-8 md:p-10 shadow-xl mb-10 border border-slate-100 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-100 rounded-full blur-3xl -mr-20 -mt-20 opacity-50 pointer-events-none"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-100 rounded-full blur-3xl -ml-20 -mb-20 opacity-40 pointer-events-none"></div>
                    
                    <h1 className="text-4xl font-black text-slate-900 mb-2 relative z-10">Interview Results 🎉</h1>
                    <p className="text-lg text-slate-500 mb-8 relative z-10">Here is your AI-generated detailed report card for <span className="font-bold text-slate-700">{feedbackData.jobPosition}</span>.</p>
                    
                    <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
                        {/* Big Rating Badge */}
                        <div className={`w-36 h-36 rounded-[2rem] flex items-center justify-center flex-col shadow-xl text-white flex-shrink-0 ${feedbackData.overallRating >= 7 ? 'bg-gradient-to-br from-emerald-400 to-emerald-600 shadow-emerald-500/30' : feedbackData.overallRating >= 4 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 shadow-yellow-500/30' : 'bg-gradient-to-br from-red-400 to-red-600 shadow-red-500/30'}`}>
                            <span className="text-5xl font-black">{feedbackData.overallRating}/10</span>
                            <span className="font-bold text-xs tracking-widest uppercase mt-2 opacity-80">Overall</span>
                        </div>
                        
                        {/* Overall Feedback Text */}
                        <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200/60 shadow-inner flex-1 w-full text-left">
                            <h3 className="font-bold text-slate-700 mb-2 flex items-center gap-2">
                                <span className="bg-blue-600 text-white rounded p-1"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg></span>
                                Executive Summary
                            </h3>
                            <p className="text-slate-700 leading-relaxed font-medium">{feedbackData.overallFeedback}</p>
                        </div>
                    </div>
                </div>

                {/* Drill-down of Questions */}
                <div className="space-y-8">
                    <h2 className="text-2xl font-bold text-slate-800 ml-2">Question Breakdown</h2>
                    {feedbackData.questions.map((q, i) => (
                        <div key={i} className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            {/* Question Header */}
                            <div className="bg-slate-50 p-6 border-b border-slate-200">
                                <div className="flex justify-between items-start gap-4">
                                    <h3 className="text-lg font-bold text-slate-800 flex-1 leading-snug">
                                       <span className="text-blue-600 mr-2 bg-blue-100 rounded px-2 py-0.5 text-sm">Q{i+1}</span> 
                                       {q.question || q.questionText}
                                    </h3>
                                    <div className="flex flex-col items-center">
                                        <span className={`px-4 py-1.5 rounded-xl font-black text-sm border ${q.rating >= 8 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : q.rating >= 5 ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : 'bg-red-50 text-red-700 border-red-200'}`}>
                                            {q.rating}/10
                                        </span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-6 md:p-8 space-y-8">
                                {/* Candidate Answer */}
                                <div>
                                    <h4 className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                                        Your Answer
                                    </h4>
                                    <p className="text-slate-600 bg-slate-50 p-5 rounded-2xl border border-slate-100 text-[15px] leading-relaxed relative">
                                        <span className="absolute left-0 top-0 bottom-0 w-1 bg-slate-300 rounded-l-2xl"></span>
                                        {q.userAnswer || "No answer provided"}
                                    </p>
                                </div>
                                
                                {/* Ideal Answer */}
                                <div>
                                    <h4 className="flex items-center gap-2 text-xs font-bold text-emerald-500 uppercase tracking-widest mb-3">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                        Ideal Expected Answer
                                    </h4>
                                    <p className="text-emerald-800 bg-emerald-50/50 p-5 rounded-2xl border border-emerald-100/50 text-[15px] leading-relaxed relative">
                                        <span className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-400 rounded-l-2xl"></span>
                                        {q.idealAnswer || "Reference answer missing"}
                                    </p>
                                </div>

                                {/* Deep-dive Feedback */}
                                <div className="pt-6 border-t border-slate-100">
                                    <h4 className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-3 flex items-center gap-2">
                                        <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                                        AI Tailored Feedback
                                    </h4>
                                    <div className="bg-blue-50/50 p-5 rounded-2xl border-l-4 border-l-blue-400">
                                        <p className="text-slate-700 font-medium leading-relaxed">{q.feedback}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Feedback;
