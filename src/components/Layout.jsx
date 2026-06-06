
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { socket } from '../socket';
import { AnimatePresence, motion } from 'framer-motion';
import PromoModal from './promoModel'; 

const Layout = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showPromo, setShowPromo] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const { user, logout, updateLocalUser, fetchUserProfile } = useAuth();
  const { isDark } = useTheme();
  const { language, setLanguage, t } = useLanguage(); 
  
  const navigate = useNavigate();
  const location = useLocation();

  const languages = [
    { id: 'english', label: 'EN', flag: '🇺🇸' },
    { id: 'amharic', label: 'አማ', flag: '🇪🇹' },
    { id: 'oromo', label: 'ORM', flag: '🇪🇹' },
    { id: 'somali', label: 'SOM', flag: '🇸🇴' },
    { id: 'tigrinya', label: 'ትግ', flag: '🇪🇹' },
  ];

  const menuItems = [
    { id: 'lobby', name: t.lobby, icon: '🎮', path: '/' },
    { id: 'patterns', name: t.Patterns || 'Patterns', icon: '🧩', path: '/patterns' }, 
    { id: 'wallet', name: t.wallet, icon: '💳', path: '/wallet' },
    { id: 'transactions', name: t.transactions || 'Transactions', icon: '📜', path: '/transactions' },
    { id: 'leaderboard', name: t.leaderboard, icon: '🏆', path: '/leaderboard' },
    { id: 'settings', name: t.settings, icon: '⚙️', path: '/settings' },
  ];

  const currentLang = languages.find(l => l.id === language) || languages[0];

  // --- SOCKET BALANCE LISTENER ---
  useEffect(() => {
    if (!user?._id || typeof updateLocalUser !== 'function') return;
    const onConnect = () => socket.emit('joinUserRoom', { userId: user._id });
    const handleBalanceUpdate = (data) => {
      if (data && typeof data.coins !== 'undefined') updateLocalUser({ coins: data.coins });
    };
    if (socket.connected) onConnect();
    socket.on('connect', onConnect);
    socket.on('balanceUpdated', handleBalanceUpdate);
    return () => {
      socket.off('connect', onConnect);
      socket.off('balanceUpdated', handleBalanceUpdate);
      socket.emit('leaveUserRoom', { userId: user._id });
    };
  }, [user?._id, updateLocalUser]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setLangOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleRefresh = async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try { await fetchUserProfile(); } 
    catch (error) { console.error(error); } 
    finally { setTimeout(() => setIsRefreshing(false), 800); }
  };

  const handleNav = (path) => {
    navigate(path);
    setIsOpen(false);
  };

  return (
    <div className={`h-screen w-full flex overflow-hidden font-sans transition-colors duration-300 relative ${
      isDark ? 'bg-[#05050a] text-slate-100' : 'bg-[#fcfcff] text-slate-900'
    }`}>
      
      <AnimatePresence>
        {showPromo && <PromoModal isOpen={showPromo} onClose={() => setShowPromo(false)} />}
      </AnimatePresence>
      
      {/* PREMIUM INDUSTRIAL SIDEBAR */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 transform transition-all duration-300 ease-[cubic-bezier(0.2,0.8,0.2,1)] lg:relative lg:translate-x-0 ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      } ${
        isDark ? 'bg-[#0b0c14] border-r border-slate-900 shadow-[4px_0_24px_rgba(0,0,0,0.5)]' : 'bg-white shadow-[4px_0_24px_rgba(0,0,0,0.02)] border-r border-slate-100'
      }`}>
        <div className="flex flex-col h-full">
          
          {/* LOGO FRAME */}
          <div className="p-6 mb-4">
            <div className="flex items-center gap-3 group cursor-pointer" onClick={() => handleNav('/')}>
              <div className="w-10 h-10 bg-gradient-to-t from-amber-600 to-yellow-400 rounded-lg flex items-center justify-center shadow-md shadow-amber-500/10 transition-transform duration-300 group-hover:scale-105">
                <span className="text-xl filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.2)]">🌍</span>
              </div>
              <div className="flex flex-col">
                <h1 className={`font-black text-lg tracking-tight uppercase leading-none ${isDark ? 'text-white' : 'text-slate-900'}`}>
                  AFRO<span className="text-amber-500">BINGO</span>
                </h1>
                <span className="text-[7px] font-bold text-slate-500 tracking-[0.35em] mt-1">HABESHA ENGINE V3</span>
              </div>
            </div>
          </div>

          {/* MENU LINK LIST */}
          <nav className="flex-1 px-4 space-y-1 overflow-y-auto scrollbar-hide">
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNav(item.path)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-lg font-bold text-[10px] uppercase tracking-[0.15em] transition-all duration-200 group relative ${
                    isActive 
                      ? isDark 
                        ? 'bg-gradient-to-r from-amber-500/10 to-transparent text-amber-400 font-black' 
                        : 'bg-amber-500/5 text-amber-600 font-black'
                      : isDark ? 'text-slate-400 hover:bg-slate-900/60 hover:text-slate-200 hover:translate-x-1' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900 hover:translate-x-1'
                  }`}
                >
                  {/* Neon Left Indicator Bar */}
                  {isActive && (
                    <span className="absolute left-0 top-2 bottom-2 w-[3px] bg-gradient-to-b from-amber-400 to-yellow-500 rounded-r-sm shadow-[0_0_8px_rgba(245,158,11,0.5)]" />
                  )}

                  <div className="flex items-center gap-3">
                    <span className={`text-base transition-opacity ${isActive ? 'opacity-100' : 'opacity-70 group-hover:opacity-100'}`}>{item.icon}</span>
                    <span>{item.name}</span>
                  </div>
                  
                  {item.isNew && !isActive && (
                    <span className="bg-amber-500 text-[6px] px-1.5 py-0.5 rounded font-black text-slate-950 animate-pulse">
                      NEW
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* SIDEBAR DASHBOARD CONTROL DRAWER */}
          <div className="p-4">
            <div className={`rounded-xl p-3.5 border transition-all ${
              isDark ? 'bg-[#07080e] border-slate-900' : 'bg-slate-50/70 border-slate-200/60'
            }`}>
              
              {/* COMPACT LANG PANEL */}
              <div className="relative mb-2.5" ref={dropdownRef}>
                <button 
                  onClick={() => setLangOpen(!langOpen)} 
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg border text-[10px] font-bold uppercase transition-all ${
                    isDark ? 'bg-[#0c0d14] border-slate-800 text-slate-300 hover:border-slate-700' : 'bg-white border-slate-200 text-slate-600 shadow-sm'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-sm">{currentLang.flag}</span>
                    {currentLang.label}
                  </span>
                  <motion.span animate={{ rotate: langOpen ? 180 : 0 }} className="text-[7px]">▼</motion.span>
                </button>
                
                <AnimatePresence>
                  {langOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 4 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, y: 4 }} 
                      className={`absolute bottom-full left-0 right-0 mb-1.5 z-50 rounded-lg border shadow-xl overflow-hidden backdrop-blur-md ${
                        isDark ? 'bg-[#0c0d14] border-slate-800' : 'bg-white border-slate-200'
                      }`}
                    >
                      {languages.map((l) => (
                        <button 
                          key={l.id} 
                          onClick={() => { setLanguage(l.id); setLangOpen(false); }} 
                          className={`w-full flex items-center gap-3 px-3.5 py-2 text-[10px] font-bold uppercase transition-colors text-left ${
                            language === l.id ? 'text-amber-500 bg-amber-500/5' : isDark ? 'text-slate-400 hover:bg-slate-800 hover:text-slate-200' : 'text-slate-600 hover:bg-slate-50'
                          }`}
                        >
                          <span>{l.flag}</span> {l.label}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* MATTE BALANCE COMPONENT */}
              <div 
                onClick={() => handleNav('/wallet')} 
                className={`cursor-pointer group flex items-center justify-between rounded-lg px-3 py-2 border transition-all mb-2.5 ${
                  isDark ? 'bg-[#0c0d14] border-slate-900 hover:border-slate-800' : 'bg-white border-slate-200 hover:border-amber-300 shadow-sm'
                }`}
              >
                <div>
                  <span className="text-[7px] font-bold text-slate-500 uppercase block tracking-wider mb-0.5">{t.balance}</span>
                  <span className="text-xs font-black text-amber-500 tracking-tight">ETB {user?.coins?.toLocaleString()}</span>
                </div>
                <div className="w-5 h-5 rounded bg-amber-500/10 text-amber-500 flex items-center justify-center text-xs font-bold transition-all group-hover:bg-amber-500 group-hover:text-slate-950">+</div>
              </div>

              <button onClick={logout} className={`w-full py-2 rounded-lg text-[8px] font-black uppercase tracking-wider transition-all duration-200 border ${
                isDark ? 'bg-red-950/20 text-red-400 border-red-900/30 hover:bg-red-500 hover:text-white' : 'bg-red-50 text-red-500 border-red-100 hover:bg-red-500 hover:text-white'
              }`}>
                {t.logout}
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* CORE FRAME CONTAINER AREA */}
      <div className={`flex-1 flex flex-col min-w-0 relative transition-colors duration-300 ${isDark ? 'bg-[#05050a]' : 'bg-[#fcfcff]'}`}>
        
        {/* TOP COMPACT NAVIGATION FOR MOBILE */}
        <header className={`lg:hidden flex items-center justify-between px-4 py-3 backdrop-blur-md border-b z-40 ${
          isDark ? 'bg-[#05050a]/80 border-slate-900' : 'bg-white/80 border-slate-200/60'
        }`}>
          <button 
            onClick={() => setIsOpen(true)} 
            className={`p-2 rounded-lg border transition-all active:scale-95 ${
              isDark ? 'border-slate-800 bg-slate-900/30 text-slate-300' : 'border-slate-200 bg-white shadow-sm'
            }`}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path d="M4 6h16M4 12h16M4 18h16" /></svg>
          </button>

          <div className="flex items-center gap-2">
            
            {/* AMBIENT FLOATING MOBILE LANGUAGE ANCHOR */}
            <div className="relative">
              <button 
                onClick={() => setLangOpen(!langOpen)} 
                className={`w-9 h-9 flex items-center justify-center rounded-lg border text-base shadow-sm transition-all active:scale-95 ${
                  isDark ? 'bg-slate-900/30 border-slate-800' : 'bg-white border-slate-200'
                }`}
              >
                {currentLang.flag}
              </button>
              <AnimatePresence>
                {langOpen && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.96, y: 4 }} 
                    animate={{ opacity: 1, scale: 1, y: 0 }} 
                    exit={{ opacity: 0, scale: 0.96, y: 4 }} 
                    className={`absolute top-full right-0 mt-1.5 w-28 rounded-lg border shadow-xl z-50 overflow-hidden backdrop-blur-md ${
                      isDark ? 'bg-[#0c0d14] border-slate-800' : 'bg-white border-slate-200'
                    }`}
                  >
                    {languages.map((l) => (
                      <button 
                        key={l.id} 
                        onClick={() => { setLanguage(l.id); setLangOpen(false); }} 
                        className={`w-full flex items-center gap-2 px-3 py-2.5 text-[9px] font-bold uppercase border-b last:border-0 text-left ${
                          isDark ? 'border-slate-800/40' : 'border-slate-100'
                        } ${language === l.id ? 'text-amber-500 bg-amber-500/5' : isDark ? 'text-slate-400 hover:bg-slate-800' : 'text-slate-600 hover:bg-slate-50'}`}
                      >
                        {l.flag} {l.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* MOBILE WALLET CARD ROUTE */}
            <div 
              onClick={() => handleNav('/wallet')} 
              className={`px-3 py-2 rounded-lg border font-black text-[9px] tracking-tight cursor-pointer transition-all active:scale-95 shadow-sm ${
                isDark ? 'bg-amber-500/5 border-amber-500/20 text-amber-400' : 'bg-amber-50 border-amber-200 text-amber-700'
              }`}
            >
              🪙 {user?.coins?.toLocaleString()} ETB
            </div>
            
            {/* SYSTEM DATA REFRESH MODULE BUTTON */}
            <button 
              onClick={handleRefresh} 
              className={`p-2 rounded-lg border transition-all active:scale-90 ${
                isDark ? 'border-slate-800 bg-slate-900/30 text-slate-400' : 'border-slate-200 bg-white shadow-sm text-slate-600'
              } ${isRefreshing ? 'opacity-30' : ''}`}
            >
              <svg 
                width="12" 
                height="12" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="3" 
                className={isRefreshing ? 'animate-spin' : ''}
              >
                <path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16" />
              </svg>
            </button>
          </div>
        </header>

        {/* COMPONENT INJECTION SLOT VIEWPORTS */}
        <main className="flex-1 overflow-y-auto scrollbar-hide">
          <div className="min-h-full p-4 lg:p-8 max-w-6xl mx-auto">
            {children}
          </div>
        </main>
      </div>

      {/* COMPONENT OUTSIDE-SIDEBAR DISMISSAL SHEETS */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs z-40 lg:hidden" 
            onClick={() => setIsOpen(false)} 
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Layout;

