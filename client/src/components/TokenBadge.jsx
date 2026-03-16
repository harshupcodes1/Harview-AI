import React from 'react';
import { motion } from 'framer-motion';

function TokenBadge({ tokens }) {
  // Render golden 3D badge styling based on prompt: "Career Credits... 3D golden coin... HV engraved... glossy... soft reflections"
  
  return (
    <div className="relative group flex items-center gap-3 bg-white/[0.03] border border-white/10 p-2 pr-5 rounded-full backdrop-blur-xl shadow-lg hover:bg-white/[0.05] transition cursor-pointer">
        {/* Tooltip on Hover */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-64 p-3 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none text-center z-50">
           <p className="text-xs text-slate-300 font-medium leading-relaxed">Each Career Credit unlocks one AI mock interview or analysis.</p>
           <div className="absolute -top-2 left-1/2 -translate-x-1/2 border-[6px] border-transparent border-b-slate-700"></div>
        </div>

        {/* 3D Floating Coin */}
        <motion.div 
            animate={{ y: [0, -3, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-9 h-9 flex items-center justify-center rounded-full bg-gradient-to-br from-[#FFDF00] via-[#F4C430] to-[#b8860b] shadow-[0_4px_10px_rgba(255,215,0,0.3),inset_0_-2px_6px_rgba(184,134,11,0.6),inset_0_2px_4px_rgba(255,255,255,0.8)] border border-[#FFDF00]/50 group-hover:rotate-[15deg] group-hover:scale-105 transition-all duration-300"
        >
            {/* Sparkle Particle Animations */}
            <motion.div 
                animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0], rotate: [0, 180] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
                className="absolute -top-1 -right-1 w-2 h-2 text-white fill-current"
            >
                ✨
            </motion.div>
            <motion.div 
                animate={{ opacity: [0, 1, 0], scale: [0, 1, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1.5 }}
                className="absolute -bottom-1 -left-1 w-1.5 h-1.5 text-white/80"
            >
                ✨
            </motion.div>

            {/* Subtle Pulse Glow */}
            <motion.div 
                animate={{ opacity: [0.3, 0.6, 0.3], scale: [1, 1.2, 1] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-blue-500/20 rounded-full blur-[4px]"
            ></motion.div>

            {/* Inner Engraving */}
            <div className="relative z-10 font-black text-xs text-[#8B6508] tracking-tighter drop-shadow-[0_1px_1px_rgba(255,255,255,0.8)]" style={{ textShadow: "1px 1px 0 rgba(255,255,255,0.4), -1px -1px 0 rgba(0,0,0,0.1)" }}>
                HV
            </div>
            
            {/* Reflection Sweep */}
            <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.4)_0%,transparent_50%,rgba(0,0,0,0.1)_100%)] rounded-full group-hover:bg-[linear-gradient(110deg,rgba(255,255,255,0.6)_0%,transparent_40%,rgba(0,0,0,0.1)_100%)] transition-all"></div>
        </motion.div>

        {/* Text */}
        <div className="flex flex-col justify-center">
            <span className="text-sm font-bold text-white tracking-wide group-hover:text-amber-300 transition-colors drop-shadow-[0_0_8px_rgba(255,215,0,0.3)]">
                {tokens} {tokens === 1 ? 'Credit' : 'Credits'}
            </span>
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider -mt-0.5">Career Tokens</span>
        </div>
    </div>
  );
}

export default TokenBadge;
