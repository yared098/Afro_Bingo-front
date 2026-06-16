import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import bingoPatterns from '../bingoPatterns.js';
import { useTheme } from '../context/ThemeContext.jsx';

const BingoPattern = () => {
  const { isDark } = useTheme();
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'

  const isCellInPattern = (cellId, variants) => {
    return variants[0].includes(cellId);
  };

  const getPrizeInfo = (name, variants) => {
    const activeCells = variants[0].length;
    if (activeCells >= 24) return { label: 'Grand Jackpot', color: 'from-amber-600 via-yellow-500 to-amber-400 text-slate-950', multiplier: '100%' };
    if (activeCells >= 10) return { label: 'Mega Prize', color: 'from-amber-700 to-yellow-500 text-slate-950', multiplier: '50%' };
    if (activeCells >= 5) return { label: 'Big Win', color: 'from-amber-800 to-amber-600 text-white', multiplier: '25%' };
    return { label: 'Standard', color: 'from-emerald-800 to-emerald-600 text-white', multiplier: '10%' };
  };

  const columns = ['b', 'i', 'n', 'g', 'o'];
  const rows = [1, 2, 3, 4, 5];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.05 } }
  };

  const cardVariants = {
    hidden: { scale: 0.95, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { type: 'spring', stiffness: 120, dampening: 15 } }
  };

  return (
    <motion.div 
      initial="hidden" animate="visible" variants={containerVariants}
      className="pb-20 max-w-7xl mx-auto px-1"
    >
      {/* Luxury Viva Bingo Header */}
      <motion.div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-amber-500/10 pb-6">
        <div>
          <h1 className={`text-3xl md:text-5xl font-black italic tracking-tighter uppercase ${isDark ? 'text-white' : 'text-slate-800'}`}>
            Winning <span className="bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 bg-clip-text text-transparent">Rules</span>
          </h1>
          <p className={`text-[10px] font-black uppercase tracking-[0.3em] mt-2 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
            Match these patterns to claim the pot
          </p>
        </div>
        
        {/* Interactive View Controller & Status Pill */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Layout Switcher */}
          <div className={`p-1 rounded-xl flex gap-1 border ${
            isDark ? 'bg-slate-950/60 border-white/5' : 'bg-slate-100 border-slate-200'
          }`}>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                viewMode === 'grid'
                  ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 font-black shadow-md'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              🏁 Grid
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition-all flex items-center gap-1.5 ${
                viewMode === 'list'
                  ? 'bg-gradient-to-r from-amber-600 to-amber-500 text-slate-950 font-black shadow-md'
                  : isDark ? 'text-slate-400 hover:text-white' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              📋 List
            </button>
          </div>

          <div className={`px-4 py-2 rounded-xl border backdrop-blur-md flex items-center gap-2 ${
            isDark ? 'bg-amber-500/10 border-amber-500/20' : 'bg-amber-50 border-amber-200'
          }`}>
            <span className="text-amber-500 font-black text-xs uppercase tracking-widest animate-pulse">💰 Jackpot Active</span>
          </div>
        </div>
      </motion.div>

      {/* Main Containers Layout System */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          /* GRID LAYOUT STYLE */
          <motion.div 
            key="grid-layout"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6"
          >
            {Object.entries(bingoPatterns).map(([patternName, variants]) => {
              const prize = getPrizeInfo(patternName, variants);
              return (
                <motion.div 
                  key={patternName} variants={cardVariants}
                  whileHover={{ y: -6, scale: 1.02 }}
                  className={`relative group p-5 rounded-[2rem] flex flex-col items-center border transition-all ${
                    isDark 
                    ? 'bg-slate-900/90 border-white/5 hover:border-amber-500/40 shadow-[0_4px_25px_rgba(0,0,0,0.4)]' 
                    : 'bg-white border-slate-200 shadow-xl shadow-slate-200/40 hover:border-amber-400'
                  }`}
                >
                  <div className={`absolute -top-3 px-3 py-1 rounded-full bg-gradient-to-r ${prize.color} text-[8px] font-black uppercase tracking-widest shadow-md border border-white/10`}>
                    {prize.label}
                  </div>

                  <h3 className={`text-[10px] font-black uppercase tracking-[0.12em] mb-4 mt-2 text-center ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {patternName.replace(/([A-Z])/g, ' $1')}
                  </h3>

                  <div className={`grid grid-cols-5 gap-1 p-2.5 rounded-2xl border ${
                    isDark ? 'bg-black/30 border-white/5' : 'bg-slate-50 border-slate-200'
                  }`}>
                    {columns.map((col) =>
                      rows.map((row) => {
                        const cellId = `${col}${row}`;
                        const active = isCellInPattern(cellId, variants);
                        return (
                          <div
                            key={cellId}
                            className={`w-4 h-4 md:w-5 md:h-5 rounded-md transition-all duration-300 ${
                              active 
                                ? 'bg-gradient-to-br from-yellow-400 to-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.5)]' 
                                : isDark ? 'bg-slate-800' : 'bg-slate-200'
                            }`}
                          />
                        );
                      })
                    )}
                  </div>
                  
                  <div className="mt-4 w-full flex items-center justify-between px-1 border-t border-dashed border-slate-700/20 pt-3">
                     <div className="flex flex-col">
                        <span className="text-[7px] font-bold text-slate-500 uppercase">Payout</span>
                        <span className="text-xs font-black text-amber-500">{prize.multiplier}</span>
                     </div>
                     <div className="flex flex-col items-end">
                        <span className="text-[7px] font-bold text-slate-500 uppercase">Forms</span>
                        <span className={`text-xs font-black ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
                          {variants.length}
                        </span>
                     </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        ) : (
          /* MODERN LIST ROW VIEW LAYOUT STYLE */
          <motion.div 
            key="list-layout"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="flex flex-col gap-3"
          >
            {Object.entries(bingoPatterns).map(([patternName, variants]) => {
              const prize = getPrizeInfo(patternName, variants);
              return (
                <motion.div
                  key={patternName}
                  variants={cardVariants}
                  whileHover={{ x: 6 }}
                  className={`p-4 rounded-2xl border transition-all flex items-center justify-between gap-6 ${
                    isDark 
                    ? 'bg-slate-900/90 border-white/5 hover:border-amber-500/30 hover:bg-slate-850 shadow-md' 
                    : 'bg-white border-slate-200 hover:border-amber-400 shadow-md shadow-slate-100/60'
                  }`}
                >
                  {/* Left Side: Label Metadata & Badges */}
                  <div className="flex items-center gap-4 min-w-[220px]">
                    <div className={`px-3 py-1.5 rounded-xl bg-gradient-to-r ${prize.color} text-[9px] font-black uppercase tracking-wider shadow-sm text-center min-w-[110px]`}>
                      {prize.label}
                    </div>
                    <div>
                      <h3 className={`text-xs font-black uppercase tracking-wider ${isDark ? 'text-white' : 'text-slate-800'}`}>
                        {patternName.replace(/([A-Z])/g, ' $1')}
                      </h3>
                      <p className="text-[8px] uppercase font-bold text-slate-500 tracking-widest mt-0.5">
                        Pattern Blueprint
                      </p>
                    </div>
                  </div>

                  {/* Mid Section: Mini Compact Preview Matrix */}
                  <div className={`p-1.5 rounded-xl border flex items-center justify-center ${
                    isDark ? 'bg-black/30 border-white/5' : 'bg-slate-50 border-slate-200'
                  }`}>
                    <div className="grid grid-cols-5 gap-0.5">
                      {columns.map((col) =>
                        rows.map((row) => {
                          const cellId = `${col}${row}`;
                          const active = isCellInPattern(cellId, variants);
                          return (
                            <div
                              key={cellId}
                              className={`w-2.5 h-2.5 rounded-sm transition-colors ${
                                active 
                                  ? 'bg-gradient-to-br from-yellow-400 to-amber-500' 
                                  : isDark ? 'bg-slate-800' : 'bg-slate-200'
                              }`}
                            />
                          );
                        })
                      )}
                    </div>
                  </div>

                  {/* Right Side: Data Properties Pack */}
                  <div className="flex items-center gap-8 pr-2">
                    <div className="text-right">
                      <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-wider">Payout Scalar</span>
                      <span className="text-sm font-black text-amber-500 tracking-tight">{prize.multiplier}</span>
                    </div>
                    <div className="text-right min-w-[60px]">
                      <span className="block text-[8px] font-bold text-slate-500 uppercase tracking-wider">Permutations</span>
                      <span className={`text-sm font-black ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>
                        {variants.length} <span className="text-[9px] text-slate-500 font-normal">forms</span>
                      </span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default BingoPattern;