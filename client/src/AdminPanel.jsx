import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function AdminPanel() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [secretKey, setSecretKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const [stats, setStats] = useState({ totalUsers: 0, totalInterviews: 0, circulatingTokens: 0 });
    const [users, setUsers] = useState([]);
    const [recentInterviews, setRecentInterviews] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [tokenAmount, setTokenAmount] = useState('');

    const fetchDashboardData = async () => {
        const token = localStorage.getItem('adminToken');
        if (!token) return;
        try {
            const [statsRes, usersRes] = await Promise.all([
                fetch('https://harview-ai.onrender.com/api/admin/stats', { headers: { 'Authorization': `Bearer ${token}` } }),
                fetch('https://harview-ai.onrender.com/api/admin/users', { headers: { 'Authorization': `Bearer ${token}` } })
            ]);
            const statsData = await statsRes.json();
            const usersData = await usersRes.json();
            if (statsData.success) {
                setStats(statsData.stats);
                setRecentInterviews(statsData.recentInterviews);
            }
            if (usersData.success) {
                setUsers(usersData.users);
            }
        } catch (err) { console.error(err); }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch('https://harview-ai.onrender.com/api/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ secretKey })
            });
            const data = await res.json();
            if (data.success) {
                localStorage.setItem('adminToken', data.token);
                setIsAuthenticated(true);
                fetchDashboardData();
            } else {
                setError(data.error);
            }
        } catch (err) {
            setError('Server connection failed.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('adminToken');
        if (token) {
            setSecretKey(token);
            setIsAuthenticated(true);
            fetchDashboardData();
        }
    }, []);

    const logout = () => {
        localStorage.removeItem('adminToken');
        setIsAuthenticated(false);
        navigate('/');
    };

    const handleTokenUpdate = async (action) => {
        if (!selectedUser || !tokenAmount) return;
        const token = localStorage.getItem('adminToken');
        try {
            const res = await fetch(`https://harview-ai.onrender.com/api/admin/users/${selectedUser._id}/tokens`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ action, amount: parseInt(tokenAmount) })
            });
            const data = await res.json();
            if (data.success) {
                setUsers(users.map(u => u._id === selectedUser._id ? { ...u, tokens: data.user.tokens } : u));
                setSelectedUser(null);
                setTokenAmount('');
                fetchDashboardData(); 
            } else { alert(data.error); }
        } catch (err) { alert('Failed to update tokens.'); }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
                {/* Dark Radial Background Override */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 to-black z-0 pointer-events-none"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/20 blur-3xl rounded-full pointer-events-none z-0"></div>

                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-blue-500/30 p-10 rounded-3xl shadow-2xl relative z-10"
                >
                    <div className="flex justify-center mb-6">
                        <div className="w-16 h-16 rounded-full bg-blue-500/20 shadow-[0_0_20px_rgba(59,130,246,0.5)] border border-blue-500/50 flex items-center justify-center text-blue-400">
                            <svg className="w-8 h-8 font-bold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z"></path></svg>
                        </div>
                    </div>
                    
                    <h2 className="text-3xl font-black text-white text-center mb-2 tracking-widest drop-shadow-lg">GOD <span className="text-blue-500">MODE</span></h2>
                    <p className="text-slate-400 text-center text-xs mb-8">RESTRICTED ACCESS TERMINAL</p>

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <input 
                                type="password" 
                                placeholder="Enter Direct Override Key" 
                                required 
                                value={secretKey} 
                                onChange={(e)=>setSecretKey(e.target.value)} 
                                className="w-full bg-slate-950/80 border border-slate-700 text-white rounded-xl px-5 py-4 focus:outline-none focus:border-blue-500 focus:shadow-[0_0_15px_rgba(59,130,246,0.3)] transition text-center" 
                            />
                        </div>
                        {error && <p className="text-red-400 text-sm text-center font-semibold bg-red-500/10 py-2 rounded-lg">{error}</p>}
                        
                        <button disabled={loading} type="submit" className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl shadow-[0_0_20px_rgba(37,99,235,0.4)] transition transform hover:scale-[1.02] active:scale-95">
                            {loading ? "DECRYPTING..." : "INITIALIZE PROTOCOL"}
                        </button>
                    </form>
                    <button onClick={()=>navigate('/')} className="w-full text-center text-slate-500 hover:text-white mt-6 text-sm transition">Abort connection</button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-950 font-sans text-slate-200">
            {/* Dark background hack to override stray light mode styles */}
            <div className="fixed inset-0 bg-slate-950 -z-50"></div>
            
            <div className="border-b border-slate-800 bg-slate-900 sticky top-0 z-50 shadow-md">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-900 rounded-xl flex items-center justify-center font-black shadow-[0_0_15px_rgba(59,130,246,0.5)] border border-blue-400/50 text-white">
                            HV
                        </div>
                        <div>
                            <h1 className="text-xl font-black text-white">System <span className="text-blue-500">Overwatch</span></h1>
                            <p className="text-xs text-blue-400 uppercase tracking-widest hidden sm:block">God Mode Terminal</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-emerald-400 text-xs font-bold flex items-center gap-2 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/30">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            Live Sync
                        </span>
                        <button onClick={logout} className="text-slate-300 hover:text-white font-bold bg-slate-800 border border-slate-700 hover:bg-red-500/20 hover:border-red-500 hover:text-red-400 px-4 py-2 rounded-lg transition shadow-sm">
                            Terminate
                        </button>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-6 py-10 relative z-10 w-full overflow-hidden">
                
                {/* STATS OVERVIEW CARDS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                    <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group shadow-xl">
                        <div className="absolute right-0 top-0 p-4 opacity-10">
                            <svg className="w-24 h-24 text-blue-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"></path></svg>
                        </div>
                        <h3 className="text-slate-400 font-semibold mb-2 text-sm uppercase tracking-wider flex items-center gap-2">Total Operatives</h3>
                        <div className="text-5xl font-black text-white">{stats.totalUsers}</div>
                    </motion.div>

                    <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.1}} className="bg-slate-900 border border-slate-800 p-6 rounded-2xl relative overflow-hidden group shadow-xl">
                        <div className="absolute right-0 top-0 p-4 opacity-10">
                            <svg className="w-24 h-24 text-purple-500" fill="currentColor" viewBox="0 0 20 20"><path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path></svg>
                        </div>
                        <h3 className="text-slate-400 font-semibold mb-2 text-sm uppercase tracking-wider">Interviews Generated</h3>
                        <div className="text-5xl font-black text-white">{stats.totalInterviews}</div>
                    </motion.div>

                    <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} transition={{delay:0.2}} className="bg-gradient-to-br from-slate-900 to-slate-800 border fill border-amber-500/30 p-6 rounded-2xl relative overflow-hidden shadow-[0_4px_30px_rgba(245,158,11,0.15)] group">
                        <div className="absolute right-0 top-0 p-4 opacity-20">
                            <svg className="w-24 h-24 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM8 7a1 1 0 112 0v2.586l1.707 1.707a1 1 0 01-1.414 1.414l-2-2A1 1 0 018 10V7z" clipRule="evenodd"></path></svg>
                        </div>
                        <h3 className="text-amber-500 font-semibold mb-2 text-sm uppercase tracking-wider">Tokens in Circulation</h3>
                        <div className="text-5xl font-black text-white flex items-center gap-3">
                            {stats.circulatingTokens}
                        </div>
                    </motion.div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 w-full max-w-full overflow-hidden">
                    
                    {/* LEFT COLUMN: USER MANAGEMENT */}
                    <div className="lg:col-span-2 space-y-6 max-w-full overflow-x-auto">
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl w-full">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                                <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                                User Management Array
                            </h2>
                            
                            <div className="overflow-x-auto bg-slate-950 rounded-xl border border-slate-800 max-w-full">
                                <table className="w-full text-left text-sm whitespace-nowrap table-auto min-w-max">
                                    <thead className="text-xs text-slate-400 uppercase bg-slate-800/80 border-b border-slate-700">
                                        <tr>
                                            <th className="px-6 py-4 font-bold">User</th>
                                            <th className="px-6 py-4 font-bold">Firebase ID</th>
                                            <th className="px-6 py-4 font-bold">Credits</th>
                                            <th className="px-6 py-4 font-bold text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        {users.map((u) => (
                                            <tr key={u._id} className="hover:bg-slate-800/50 transition">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <img src={u.profileImage || `https://ui-avatars.com/api/?name=${u.name}&background=1e293b&color=cbd5e1`} alt="avatar" className="w-10 h-10 rounded-full border border-slate-700" />
                                                        <div>
                                                            <div className="font-bold text-slate-100 text-base">{u.name}</div>
                                                            <div className="text-xs text-slate-500">{u.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-xs font-mono text-slate-500">{u.firebaseUid.substring(0,8)}...</td>
                                                <td className="px-6 py-4">
                                                    <span className="font-bold text-lg text-amber-400 bg-slate-900 border border-slate-800 px-3 py-1 rounded-lg">
                                                        {u.tokens}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button 
                                                        onClick={() => setSelectedUser(u)}
                                                        className="text-xs font-bold bg-blue-600 hover:bg-blue-500 text-white shadow-[0_0_10px_rgba(37,99,235,0.4)] px-4 py-2 rounded-lg transition"
                                                    >
                                                        Modify
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT COLUMN: RECENT LOGS */}
                    <div className="space-y-6">
                        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl h-full min-h-[500px]">
                            <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                                <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
                                Recent Activity
                            </h2>
                            
                            <div className="space-y-4">
                                {recentInterviews.length > 0 ? recentInterviews.map((interview) => (
                                    <div key={interview._id} className="bg-slate-950 border border-slate-800 p-4 rounded-xl hover:border-purple-500/50 transition">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="text-sm font-bold text-slate-200 line-clamp-1">{interview.jobPosition}</div>
                                            <span className="text-[10px] text-purple-400 border border-purple-500/30 bg-purple-500/10 px-2 py-0.5 rounded font-bold uppercase">{interview.language}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <img src={interview.userId?.profileImage || `https://ui-avatars.com/api/?name=${interview.userId?.name}`} className="w-5 h-5 rounded-full" />
                                            <span className="text-xs text-slate-400">{interview.userId?.name || 'Unknown'}</span>
                                        </div>
                                        <div className="text-xs text-slate-500 flex items-center justify-between border-t border-slate-800 pt-2">
                                            <span>{new Date(interview.createdAt).toLocaleDateString()}</span>
                                            {interview.overallRating ? (
                                                <span className="text-emerald-400 font-bold">Score: {interview.overallRating}/10</span>
                                            ) : (
                                                <span className="text-slate-600">Pending</span>
                                            )}
                                        </div>
                                    </div>
                                )) : (
                                    <div className="text-sm text-slate-600 text-center py-10 font-medium">No recent activity detected.</div>
                                )}
                            </div>
                        </div>
                    </div>

                </div>
            </main>

            {/* TOKEN MANAGEMENT MODAL */}
            <AnimatePresence>
                {selectedUser && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-4"
                    >
                        <motion.div 
                            initial={{ scale: 0.95, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="w-full max-w-md bg-slate-900 border border-slate-700 p-8 rounded-3xl shadow-[0_20px_60px_-15px_rgba(0,0,0,1)] relative"
                        >
                            <button onClick={()=>setSelectedUser(null)} className="absolute top-4 right-4 text-slate-400 hover:text-white bg-slate-800 p-2 rounded-full transition">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                            </button>
                            
                            <h3 className="text-2xl font-black text-white mb-2">Inject Credits</h3>
                            <p className="text-slate-400 text-sm mb-6">Modifying tokens for <span className="font-bold text-blue-400">{selectedUser.name}</span> (Current: <span className="text-amber-400 font-bold">{selectedUser.tokens}</span>)</p>

                            <div className="mb-6">
                                <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Amount to Add/Deduct</label>
                                <input 
                                    type="number" 
                                    placeholder="e.g. 10" 
                                    value={tokenAmount}
                                    onChange={(e)=>setTokenAmount(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-700 text-white text-xl rounded-xl px-4 py-4 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-inner" 
                                />
                            </div>

                            <div className="flex gap-4">
                                <motion.button 
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleTokenUpdate('add')}
                                    className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl shadow-[0_5px_15px_rgba(16,185,129,0.3)] transition"
                                >
                                    + MINT TICKETS
                                </motion.button>
                                <motion.button 
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleTokenUpdate('deduct')}
                                    className="flex-1 bg-red-600/20 border-2 border-red-600/50 hover:bg-red-600 text-red-500 hover:text-white font-bold py-4 rounded-xl transition"
                                >
                                    - BURN
                                </motion.button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
