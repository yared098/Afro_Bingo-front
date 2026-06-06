import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const MyHistory = () => {
  // 1. Destructure 'user' to compare against the winnerName
  const { user, api } = useAuth();
  const { isDark } = useTheme();
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const { data } = await api.get('/games/my-history');
        setHistory(data);
      } catch (err) {
        console.error("Failed to load history");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, [api]);

  if (loading) return (
    <div className="flex h-[60vh] flex-col items-center justify-center">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500/20 border-t-orange-500"></div>
      <p className="mt-4 text-[10px] font-black uppercase tracking-[0.3em] text-orange-500 animate-pulse">Retrieving Logs...</p>
    </div>
  );

  return (
    <div className="mx-auto max-w-2xl px-2 pb-24 pt-4 sm:pt-8">
      
      <div className="mb-8 flex items-end justify-between px-2">
        <div>
          <h2 className={`text-2xl font-black italic tracking-tighter uppercase ${isDark ? 'text-white' : 'text-slate-900'}`}>
            MY <span className="text-orange-500">RECORDS</span>
          </h2>
          <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Victory Archives</p>
        </div>
        <div className={`rounded-full px-4 py-1.5 border text-[10px] font-black ${
          isDark ? 'bg-slate-900 border-white/5 text-slate-400' : 'bg-white border-slate-200 text-slate-600 shadow-sm'
        }`}>
          TOTAL: {history.length}
        </div>
      </div>

      {history.length === 0 ? (
        <div className={`rounded-[2.5rem] border-2 border-dashed p-16 text-center transition-all ${
          isDark ? 'border-white/5 bg-slate-900/30' : 'border-slate-200 bg-slate-50'
        }`}>
          <span className="text-4xl">⚓</span>
          <p className="mt-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">No battle records found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {history.map((game) => {
            const isExpanded = expandedId === game._id;

            // --- WIN/LOSS LOGIC ---
            // Check if current user name matches the winnerName in history
            const isWinner = game.winnerName === user?.name;
            
            // If winner: show prize amount. If loser: show entry price.
            const displayAmount = isWinner ? game.prizeAmount : game.entryPrice;
            const statusColor = isWinner ? 'text-emerald-500' : 'text-red-500';
            const statusSymbol = isWinner ? '+' : '-';

            return (
              <div 
                key={game._id} 
                className={`overflow-hidden rounded-[1.5rem] border transition-all duration-300 ${
                  isDark 
                  ? 'bg-slate-900 border-white/5 hover:border-white/20' 
                  : 'bg-white border-slate-100 shadow-sm hover:shadow-md'
                }`}
              >
                <div 
                  onClick={() => setExpandedId(isExpanded ? null : game._id)}
                  className="flex cursor-pointer items-center justify-between p-4 sm:p-5"
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex h-12 w-12 items-center justify-center rounded-2xl text-xl shadow-inner border transition-colors ${
                      isDark ? 'bg-slate-800 border-white/10' : 'bg-slate-50 border-slate-100'
                    }`}>
                      {isWinner ? '🏆' : '🌊'}
                    </div>
                    
                    <div className="min-w-0">
                      <h4 className={`truncate text-sm font-black uppercase tracking-tight ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        {game.roomName}
                      </h4>
                      <p className="text-[9px] font-bold text-slate-500 uppercase">
                        {new Date(game.finishedAt).toLocaleDateString()} • {game.winnerName}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      {/* DYNAMIC AMOUNT DISPLAY */}
                      <p className={`text-lg font-black tracking-tighter ${statusColor}`}>
                        {statusSymbol}{displayAmount?.toLocaleString()}
                      </p>
                      <p className="text-[8px] font-black uppercase text-slate-400">BIRR</p>
                    </div>
                    <div className={`transition-transform duration-300 ${isExpanded ? 'rotate-180 text-orange-500' : 'text-slate-300'}`}>
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="4"><path d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className={`border-t transition-colors ${isDark ? 'bg-black/20 border-white/5' : 'bg-slate-50/50 border-slate-100'}`}
                    >
                      <div className="p-5">
                        <div className="mb-4 flex items-center justify-between">
                          <span className="text-[8px] font-black uppercase tracking-widest text-slate-500">Call Sequence</span>
                          <span className="text-[8px] font-black uppercase text-orange-500 bg-orange-500/10 px-2 py-0.5 rounded-full">
                            Winner Ball: {game.drawnNumbers?.slice(-1)}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {game.drawnNumbers?.map((num, idx) => {
                            const isLast = idx === game.drawnNumbers.length - 1;
                            return (
                              <motion.div 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: idx * 0.01 }}
                                key={idx}
                                className={`flex h-7 w-7 items-center justify-center rounded-lg text-[10px] font-black border transition-all
                                  ${isLast 
                                    ? 'bg-orange-500 border-orange-400 text-white shadow-lg shadow-orange-500/30' 
                                    : isDark ? 'bg-slate-800 border-white/5 text-slate-400' : 'bg-white border-slate-200 text-slate-600 shadow-sm'
                                  }`}
                              >
                                {num}
                              </motion.div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyHistory;