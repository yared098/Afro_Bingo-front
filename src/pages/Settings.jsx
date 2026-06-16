import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext'; 
import { useLanguage } from '../context/LanguageContext'; 
import { motion } from 'framer-motion';

const Settings = () => {
  const { user } = useAuth();
  const { isDark, toggleTheme } = useTheme(); 
  const { language, setLanguage, t } = useLanguage(); 
  
  const [playMode, setPlayMode] = useState(() => localStorage.getItem('bingo_play_mode') || 'manual');
  const [isMuted, setIsMuted] = useState(() => localStorage.getItem('bingo_muted') === 'true');

  useEffect(() => {
    localStorage.setItem('bingo_play_mode', playMode);
    localStorage.setItem('bingo_muted', isMuted);
  }, [playMode, isMuted]);

  const languages = [
    { id: 'english', label: 'English', flag: '🇺🇸' },
    { id: 'amharic', label: 'አማርኛ', flag: '🇪🇹' },
    { id: 'oromo', label: 'Oromoo', flag: '🇪🇹' },
    { id: 'somali', label: 'Soomaali', flag: '🇸🇴' },
    { id: 'tigrinya', label: 'ትግርኛ', flag: '🇪🇹' },
  ];

  // Dynamic Entrance Animations
  const containerVars = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { staggerChildren: 0.08, delayChildren: 0.1 } 
    }
  };

  const itemVars = {
    hidden: { opacity: 0, y: 30, rotate: -1 },
    visible: { 
      opacity: 1, 
      y: 0, 
      rotate: 0,
      transition: { type: "spring", stiffness: 120, damping: 14 } 
    }
  };

  return (
    <div className={`min-h-screen relative overflow-hidden transition-colors duration-500 p-4 sm:p-6 pb-28 ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-amber-50/40 text-slate-900'
    }`}>
      
      {/* Decorative Viva-Geometric Mesh Backgrounds */}
      <div className="absolute top-[-20%] left-[-10%] w-[300px] h-[300px] rounded-full blur-[120px] opacity-20 bg-gradient-to-tr from-amber-500 to-red-600 pointer-events-none" />
      <div className="absolute bottom-[10%] right-[-10%] w-[250px] h-[250px] rounded-full blur-[100px] opacity-20 bg-gradient-to-br from-yellow-400 to-emerald-600 pointer-events-none" />

      <motion.div 
        variants={containerVars} 
        initial="hidden" 
        animate="visible"
        className="max-w-md mx-auto space-y-6 relative z-10"
      >
        {/* HEADER SECTION */}
        <motion.div variants={itemVars} className="text-center py-4">
          <div className="inline-block px-3 py-1 mb-2 rounded-full text-[10px] font-extrabold tracking-[0.25em] uppercase bg-amber-500/10 text-amber-500 border border-amber-500/20">
            {t.appearance ? 'BINGO ENGINE v2.0' : 'CONFIGURATION'}
          </div>
          <h2 className="text-4xl font-black tracking-tighter uppercase italic leading-none">
            {t.settings.split(' ')[0]}{' '}
            <span className="bg-gradient-to-r from-amber-500 via-rose-500 to-yellow-500 bg-clip-text text-transparent drop-shadow-sm">
              {t.settings.split(' ').slice(1).join(' ')}
            </span>
          </h2>
        </motion.div>

        {/* 1. VISUAL THEME PANEL */}
        <motion.section variants={itemVars} className={`relative overflow-hidden rounded-3xl border p-5 ${
          isDark ? 'bg-slate-900/80 border-slate-800 shadow-[0_20px_50px_rgba(0,0,0,0.3)]' : 'bg-white border-amber-200/60 shadow-[0_20px_40px_rgba(245,158,11,0.05)]'
        }`}>
          {/* Section Accent Corner Line */}
          <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-amber-500/20 to-transparent pointer-events-none" style={{ clipPath: 'polygon(100% 0, 0 0, 100% 100%)' }} />
          
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-5 rounded-lg bg-amber-500 flex items-center justify-center text-xs shadow-md shadow-amber-500/30 text-white">⚡</div>
            <h3 className="text-xs font-black uppercase tracking-widest text-amber-500">{t.appearance}</h3>
          </div>
          
          <div className={`p-4 rounded-2xl border flex items-center justify-between ${
            isDark ? 'bg-slate-950/80 border-slate-800' : 'bg-slate-50 border-slate-100'
          }`}>
            <div>
              <p className="font-extrabold text-xs uppercase tracking-wide">{t.displayMode}</p>
              <p className="text-[10px] font-bold text-slate-400 mt-0.5">{isDark ? '🎨 SHADOW REALM' : '☀️ SUNLIGHT'}</p>
            </div>
            
            <div className={`flex p-1 rounded-xl relative ${isDark ? 'bg-slate-900' : 'bg-slate-200/70'}`}>
              <button 
                onClick={() => !isDark && toggleTheme()} 
                className={`relative z-10 px-4 py-2 rounded-lg text-[10px] font-black tracking-wider transition-colors duration-300 ${isDark ? 'text-slate-950' : 'text-slate-500'}`}
              >
                DARK
              </button>
              <button 
                onClick={() => isDark && toggleTheme()} 
                className={`relative z-10 px-4 py-2 rounded-lg text-[10px] font-black tracking-wider transition-colors duration-300 ${!isDark ? 'text-slate-950' : 'text-slate-500'}`}
              >
                LIGHT
              </button>
              <motion.div 
                className="absolute top-1 bottom-1 left-1 bg-gradient-to-r from-amber-500 to-yellow-400 rounded-lg shadow-md"
                initial={false}
                animate={{ x: isDark ? 0 : '100%' }}
                style={{ width: 'calc(50% - 4px)' }}
                transition={{ type: "spring", stiffness: 350, damping: 25 }}
              />
            </div>
          </div>
        </motion.section>

        {/* 2. ASYMMETRICAL LANGUAGE SELECTOR */}
        <motion.section variants={itemVars} className={`rounded-3xl border p-5 ${
          isDark ? 'bg-slate-900/80 border-slate-800 shadow-2xl' : 'bg-white border-amber-200/60 shadow-xl'
        }`}>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-5 h-5 rounded-lg bg-rose-500 flex items-center justify-center text-xs shadow-md shadow-rose-500/30 text-white">🌍</div>
            <h3 className="text-xs font-black uppercase tracking-widest text-rose-500">{t.selectLanguage}</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-2.5">
            {languages.map((lang) => {
              const isSelected = language === lang.id;
              return (
                <button
                  key={lang.id}
                  onClick={() => setLanguage(lang.id)}
                  style={{ borderRadius: '16px 4px 16px 16px' }} // Dynamic asymmetric aesthetic
                  className={`flex items-center gap-3 p-3.5 border transition-all text-xs font-black tracking-tight transform active:scale-95 ${
                    isSelected 
                      ? 'bg-gradient-to-br from-amber-500 to-rose-500 border-transparent text-white shadow-lg shadow-amber-500/20' 
                      : `${isDark ? 'bg-slate-950/50 border-slate-800/80 text-slate-300 hover:bg-slate-800' : 'bg-slate-50 border-slate-100 text-slate-600 hover:bg-white'}`}`}
                >
                  <span className="text-lg bg-white/10 w-7 h-7 rounded-lg flex items-center justify-center filter drop-shadow-sm select-none">
                    {lang.flag}
                  </span>
                  {lang.label}
                </button>
              );
            })}
          </div>
        </motion.section>

        {/* 3. GAMEPLAY MECHANICS */}
        <motion.section variants={itemVars} className={`rounded-3xl border p-5 space-y-3.5 ${
          isDark ? 'bg-slate-900/80 border-slate-800 shadow-2xl' : 'bg-white border-amber-200/60 shadow-xl'
        }`}>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 rounded-lg bg-emerald-500 flex items-center justify-center text-xs shadow-md shadow-emerald-500/30 text-white">🎮</div>
            <h3 className="text-xs font-black uppercase tracking-widest text-emerald-500">{t.gameplay}</h3>
          </div>

          {/* Daubing Split Preference Controller */}
          <div className={`p-4 rounded-2xl border flex items-center justify-between ${
            isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-100'
          }`}>
            <div>
              <p className="font-extrabold text-xs uppercase tracking-wide">{t.daubingMode}</p>
              <p className="text-[10px] font-bold text-slate-400 mt-0.5">{playMode === 'auto' ? 'SYSTEM DAUB' : 'TACTILE DAUB'}</p>
            </div>
            <div className={`flex p-1 rounded-xl ${isDark ? 'bg-slate-900' : 'bg-slate-200/70'}`}>
              {['manual', 'auto'].map((mode) => (
                <button 
                  key={mode}
                  onClick={() => setPlayMode(mode)}
                  className={`px-4 py-2 rounded-lg text-[10px] font-black transition-all uppercase tracking-wider ${
                    playMode === mode 
                      ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-md shadow-emerald-500/20' 
                      : 'text-slate-500'
                  }`}
                >
                  {mode === 'auto' ? t.auto : t.manual}
                </button>
              ))}
            </div>
          </div>

          {/* Audio Engine Toggler */}
          <div className={`p-4 rounded-2xl border flex items-center justify-between ${
            isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-100'
          }`}>
            <div className="flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center border text-base ${
                isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-amber-200/40 shadow-sm'
              }`}>
                {isMuted ? '🔇' : '🔊'}
              </div>
              <div>
                <p className="font-extrabold text-xs uppercase tracking-wide">{t.gameAudio}</p>
                <p className="text-[10px] font-bold text-slate-400 mt-0.5">{isMuted ? t.off : t.on}</p>
              </div>
            </div>
            
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className={`w-14 h-7 rounded-full p-1 transition-all duration-300 relative ${
                !isMuted ? 'bg-gradient-to-r from-amber-500 to-yellow-400' : 'bg-slate-400'
              }`}
            >
              <motion.div 
                layout
                animate={{ x: !isMuted ? 28 : 0 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                className="w-5 h-5 bg-white rounded-full shadow-lg"
              />
            </button>
          </div>
        </motion.section>

        {/* 4. ACCOUNT MATRIX INFOCARD */}
        <motion.section variants={itemVars} className={`rounded-3xl border p-5 space-y-4 ${
          isDark ? 'bg-slate-900/80 border-slate-800 shadow-2xl' : 'bg-white border-amber-200/60 shadow-xl'
        }`}>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-5 h-5 rounded-lg bg-indigo-500 flex items-center justify-center text-xs shadow-md shadow-indigo-500/30 text-white">👤</div>
            <h3 className="text-xs font-black uppercase tracking-widest text-indigo-500">{t.account}</h3>
          </div>
          
          <div className="space-y-3">
            <div className={`flex items-center justify-between p-4 rounded-2xl border ${
              isDark ? 'bg-slate-950/60 border-slate-800' : 'bg-slate-50 border-slate-100'
            }`}>
              <span className="text-[10px] font-extrabold uppercase text-slate-400 tracking-wider">Ident Node</span>
              <span className="text-xs font-black tracking-tight px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-500 border border-amber-500/20">
                {user?.username || 'Guest Matrix'}
              </span>
            </div>
            
            <button className="w-full py-4 rounded-2xl relative overflow-hidden group transition-all duration-300 bg-red-500/10 border border-red-500/20 hover:border-red-500 text-red-500 text-xs font-black uppercase tracking-[0.2em]">
              <div className="absolute inset-0 w-full h-full bg-red-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0" />
              <span className="relative z-10 group-hover:text-white transition-colors duration-300">
                {t.logout}
              </span>
            </button>
          </div>
        </motion.section>
      </motion.div>
    </div>
  );
};

export default Settings;