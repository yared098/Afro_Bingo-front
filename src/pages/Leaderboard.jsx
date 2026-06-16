import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext'; // Import Theme Hook
import { motion, AnimatePresence } from 'framer-motion';

const Leaderboard = () => {
  const { api } = useAuth();
  const { isDark } = useTheme(); // Consume Theme
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const { data } = await api.get('/games/leaderboard');
        setLeaders(data);
      } catch (err) {
        console.error("Leaderboard load failed");
      } finally {
        setLoading(false); // Fixed the "box." ReferenceError typo here
      }
    };
    fetchLeaderboard();
  }, [api]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <div className={`w-10 h-10 border-4 rounded-full animate-spin ${isDark ? 'border-amber-500/20 border-t-amber-500' : 'border-slate-200 border-t-amber-500'}`}></div>
      <div className="text-amber-500 text-[10px] font-black uppercase tracking-[0.4em] animate-pulse">Ranking Legends...</div>
    </div>
  );

  const topThree = leaders.slice(0, 3);
  const others = leaders.slice(3);

  // Desktop view: [Silver, Gold, Bronze] | Mobile view: [Gold, Silver, Bronze]
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
  const podiumOrder = isMobile ? topThree : [topThree[1], topThree[0], topThree[2]];

  return (
    <div className="max-w-5xl mx-auto px-3 py-6 sm:py-12 space-y-8 sm:space-y-16 pb-24">
      
      {/* 1. Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative text-center space-y-2"
      >
        <h2 className={`text-3xl sm:text-6xl font-black tracking-tight uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>
          HALL OF <span className="text-amber-500">FAME</span>
        </h2>
        <p className="text-slate-500 font-bold uppercase text-[8px] sm:text-[10px] tracking-[0.4em]">VIVABINGO'S TOP ELITE</p>
      </motion.div>

      {/* 2. Podium Section (Adaptive Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 items-end max-w-4xl mx-auto">
        <AnimatePresence>
          {podiumOrder.map((player, idx) => {
            if (!player) return null;
            
            // Re-calculate rank based on index and screen size
            let rank;
            if (isMobile) rank = idx + 1;
            else rank = [2, 1, 3][idx];

            const config = {
              1: { color: "border-amber-500", shadow: "shadow-amber-500/10", icon: "👑", height: "h-40 md:h-64", order: "order-1 md:order-2" },
              2: { color: "border-slate-400", shadow: "shadow-slate-400/5", icon: "🥈", height: "h-32 md:h-52", order: "order-2 md:order-1" },
              3: { color: "border-amber-800", shadow: "shadow-amber-800/5", icon: "🥉", height: "h-32 md:h-44", order: "order-3 md:order-3" }
            }[rank];

            return (
              <motion.div 
                key={player._id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`relative flex items-center md:flex-col justify-between md:justify-center p-5 rounded-2xl border transition-all ${config.order} ${config.height} ${config.shadow} ${
                  isDark ? 'bg-[#0b0c14] border-slate-900' : 'bg-white border-slate-200/60 shadow-md'
                } ${rank === 1 ? 'border-amber-500/40 ring-1 ring-amber-500/20' : ''}`}
              >
                <div className="flex items-center md:flex-col gap-4 md:gap-2">
                  <span className="text-3xl md:text-5xl md:absolute md:-top-6 drop-shadow-lg">{config.icon}</span>
                  <div className="text-left md:text-center">
                    <h3 className={`font-black uppercase tracking-tight text-sm md:text-lg ${isDark ? 'text-white' : 'text-slate-900'}`}>
                      {player.username}
                    </h3>
                    <p className="text-amber-500 font-black text-base md:text-xl leading-none mt-1">ETB {player.totalEarnings?.toLocaleString()}</p>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-xl text-[8px] font-black tracking-widest border ${config.color} ${isDark ? 'text-slate-300 bg-slate-950/40' : 'text-slate-700 bg-slate-50'}`}>
                  RANK {rank}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* 3. Ranking List (Mobile-Optimized Cards) */}
      <div className={`rounded-2xl overflow-hidden border ${isDark ? 'bg-[#0b0c14] border-slate-900 shadow-xl' : 'bg-white border-slate-200/60 shadow-md'}`}>
        <div className="p-5 border-b border-inherit">
           <h4 className={`text-[10px] font-black uppercase tracking-widest ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Challengers Pool</h4>
        </div>
        
        <div className="divide-y divide-inherit">
          {others.map((player, index) => (
            <div key={player._id} className={`flex items-center justify-between p-4 transition-colors ${isDark ? 'hover:bg-amber-500/5' : 'hover:bg-slate-50'}`}>
              <div className="flex items-center gap-4">
                <span className={`text-[10px] font-black w-6 ${isDark ? 'text-slate-700' : 'text-slate-300'}`}>#{index + 4}</span>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs ${isDark ? 'bg-[#05050a] text-white border border-slate-900' : 'bg-slate-50 text-slate-800 border border-slate-200/60'}`}>
                  {player.username?.[0]?.toUpperCase()}
                </div>
                <div>
                  <p className={`text-xs font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>{player.username}</p>
                  <p className="text-[8px] font-bold text-slate-500 uppercase tracking-wider mt-0.5">{player.totalWins} Wins</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-black text-amber-500">ETB {player.totalEarnings?.toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Leaderboard;