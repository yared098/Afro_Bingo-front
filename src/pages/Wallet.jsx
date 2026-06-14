

import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';

const Wallet = () => {
  const { api, user, refreshUser } = useAuth();
  const { isDark } = useTheme();
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [mode, setMode] = useState('deposit'); 
  const [formData, setFormData] = useState({ amount: '', accountNumber: '', ref: '' });
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const MIN_RETAINED_BALANCE = 50;
  const isBalanceLow = (user?.coins || 0) <= MIN_RETAINED_BALANCE;

  useEffect(() => {
    const fetchProviders = async () => {
      try {
        const { data } = await api.get('/wallet/providers');
        setProviders(data);
        if (data.length > 0) setSelectedProvider(data[0]);
      } catch (err) { console.error(err); }
    };
    fetchProviders();
  }, [api]);

  const handleCopy = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const validateForm = () => {
    const tg = window.Telegram?.WebApp;
    if (mode === 'deposit') {
      if (formData.ref.length < 10) {
        tg?.showAlert("የደረሰኝ ቁጥሩ (Ref ID) አጭር ነው። እባክዎ ከ SMS ላይ በትክክል ገልብጠው ያስገቡ።");
        return false;
      }
    } else {
      const phoneRegex = /^(09|07)\d{8}$/;
      if (!phoneRegex.test(formData.accountNumber)) {
        tg?.showAlert("ትክክለኛ ስልክ ቁጥር ያስገቡ (ለምሳሌ፦ 0912345678)");
        return false;
      }
      if (Number(formData.amount) < 10) {
        tg?.showAlert("ቢያንስ 10 ብር ማውጣት ይኖርብዎታል።");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const tg = window.Telegram?.WebApp;
    setLoading(true);
    try {
      const endpoint = mode === 'deposit' ? '/wallet/deposit-frontend' : '/wallet/withdraw-fron';
      const payload = {
        userId: user._id,
        amount: mode === 'deposit' ? 0 : Number(formData.amount),
        provider: selectedProvider?.name,
        accountNumber: formData.accountNumber,
        referenceNumber: formData.ref.toUpperCase().trim(),
      };
      const response = await api.post(endpoint, payload);
      if (response.status === 201 || response.status === 200) {
        tg?.showAlert("ጥያቄዎ ተልኳል! ሲስተሙ ሲያረጋግጥ ሂሳብዎ ላይ ይጨመራል።");
        setFormData({ amount: "", accountNumber: "", ref: "" });
        refreshUser();
      }
    } catch (err) {
      tg?.showAlert(err.response?.data?.message || "ስህተት ተፈጥሯል፤ እባክዎ ደግመው ይሞክሩ።");
    } finally { setLoading(false); }
  };

  return (
    <div className={`min-h-screen font-sans antialiased ${isDark ? 'bg-slate-950 text-white' : 'bg-slate-50 text-slate-900'} px-4 pb-24 pt-6`}>
      
      {/* 1. AFRO BINGO PREMIUM BALANCE CARD */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className={`relative mb-6 p-6 rounded-[2rem] shadow-xl overflow-hidden ${isDark ? 'bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800' : 'bg-gradient-to-br from-amber-500 to-yellow-600 text-white'}`}
      >
        {/* Subtle decorative theme background blur elements */}
        <div className="absolute right-[-10%] top-[-10%] w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <p className={`text-[10px] font-black uppercase tracking-[0.2em] ${isDark ? 'text-amber-500' : 'text-amber-100 opacity-90'}`}>
          🎯 ጠቅላላ ሂሳብ (Total Balance)
        </p>
        <div className="flex items-baseline gap-2 mt-2">
          <h2 className="text-4xl font-black tracking-tight">{user?.coins?.toLocaleString()}</h2>
          <span className={`text-sm font-black tracking-widest ${isDark ? 'text-slate-400' : 'text-amber-100'}`}>ETB</span>
        </div>
      </motion.div>

      {/* 2. SIMPLIFIED ACTION MODE SWITCHER */}
      <div className={`flex p-1.5 mb-6 rounded-2xl ${isDark ? 'bg-slate-900/60 border border-slate-800' : 'bg-slate-200/60'}`}>
        {['deposit', 'withdraw'].map((m) => (
          <button 
            key={m} 
            onClick={() => { setMode(m); setFormData({ amount: '', accountNumber: '', ref: '' }); }}
            className={`flex-1 py-3.5 text-xs font-black uppercase tracking-wider rounded-xl transition-all duration-200
              ${mode === m 
                ? isDark 
                  ? 'bg-amber-500 text-slate-950 shadow-lg shadow-amber-500/10' 
                  : 'bg-slate-950 text-white shadow-md' 
                : 'text-slate-500 hover:text-slate-400'}`}
          >
            {m === 'deposit' ? '💰 ብር ለማስገባት' : '📱 ብር ለማውጣት'}
          </button>
        ))}
      </div>

      3. SIMPLIFIED HORIZONTAL PROVIDER SELECTOR
      {/* {mode === 'deposit' && (
        <div className="mb-6 animate-fadeIn">
          <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 mb-2.5 block tracking-widest">አካውንት ይምረጡ (Select Provider)</label>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {providers.map((p) => {
              const isSelected = selectedProvider?._id === p._id;
              return (
                <button
                  key={p._id}
                  onClick={() => setSelectedProvider(p)}
                  className={`shrink-0 px-5 py-3.5 rounded-2xl border-2 transition-all duration-200 flex flex-col items-start min-w-[140px]
                    ${isSelected 
                      ? 'border-amber-500 bg-amber-500/10 shadow-md shadow-amber-500/5' 
                      : isDark ? 'border-slate-900 bg-slate-900/40 hover:border-slate-800' : 'border-slate-200 bg-white'}`}
                >
                  <span className={`text-[9px] font-black uppercase tracking-wider ${isSelected ? 'text-amber-500' : 'text-slate-500'}`}>{p.id}</span>

                  <span className={`text-[9px] font-black uppercase tracking-wider ${isSelected ? 'text-amber-500' : 'text-slate-500'}`}>{p.name}</span>
                  <span className="text-sm font-extrabold mt-0.5 tracking-tight">{p.adminDetails}</span>
                </button>
              );
            })}
          </div>
        </div>
      )} */}
      {mode === 'deposit' && (
  <div className="mb-6 animate-fadeIn">
    <label className="text-[10px] font-bold text-slate-400 uppercase ml-1 mb-2.5 block tracking-widest">
      አካውንት ይምረጡ (Select Provider)
    </label>

    <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
      {providers.map((p) => {
        const isSelected = selectedProvider?._id === p._id;

        return (
          <button
            key={p._id}
            onClick={() => setSelectedProvider(p)}
            className={`shrink-0 min-w-[220px] rounded-2xl p-4 border transition-all duration-200 text-left
              ${
                isSelected
                  ? 'border-amber-500 bg-amber-500/10 shadow-lg shadow-amber-500/10'
                  : isDark
                  ? 'border-slate-800 bg-slate-900/50 hover:border-slate-700'
                  : 'border-slate-200 bg-white hover:border-slate-300'
              }`}
          >
            <div className="flex items-center justify-between mb-3">
              <span
                className={`text-base font-extrabold tracking-tight ${
                  isSelected ? 'text-amber-500' : ''
                }`}
              >
                {p.name}
              </span>

              {isSelected && (
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              )}
            </div>

            <div className="space-y-1">
              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">
                Account Holder
              </p>

              <p className="font-semibold text-sm">
                {p.id}
              </p>

              <p className="text-[10px] uppercase tracking-wider text-slate-500 font-bold pt-2">
                Account Number
              </p>

              <p className="font-mono text-sm font-bold break-all">
                {p.adminDetails}
              </p>
            </div>
          </button>
        );
      })}
    </div>
  </div>
)}

      {/* 4. MAIN ACTION CONTROL FORM AREA */}
      <div className={`p-6 rounded-[2rem] shadow-2xl transition-all duration-300 ${isDark ? 'bg-slate-900/40 border border-slate-900' : 'bg-white'}`}>
        
        {mode === 'deposit' ? (
          <div className="space-y-6">
            {/* AMHARIC DEPOSIT GUIDE CONTAINER */}
            <div className={`p-4 rounded-2xl text-[11px] font-medium leading-relaxed border ${isDark ? 'bg-amber-500/5 text-amber-200/90 border-amber-500/10' : 'bg-amber-50/60 text-amber-900 border-amber-100'}`}>
               <p className="mb-2 text-xs font-black text-amber-500 flex items-center gap-1">📋 ብር ለመሙላት እነዚህን ይከተሉ፡</p>
               <ol className="list-decimal ml-4 space-y-1.5 opacity-90 font-semibold">
                 <li>ከላይ ካሉት አካውንቶች አንዱን ይምረጡና ቁጥሩን በመንካት ይቅዱ።</li>
                 <li>ወደ ቴሌብር መተግበሪያ በመሄድ ብር ይላኩ።</li>
                 <li>ሲልኩ ከቴሌብር የሚመጣልዎትን SMS ላይ የደረሰኝ ቁጥሩን (Ref ID) ይቅዱ።</li>
                 <li>እዚህ በመመለስ የደረሰኝ ቁጥሩን ያስገቡ።</li>
               </ol>
            </div>

            {/* INTERACTIVE TAP TO COPY CARD */}
            <motion.div 
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCopy(selectedProvider?.adminDetails)}
              className={`p-5 rounded-2xl border-2 border-dashed text-center cursor-pointer transition-colors duration-200
                ${isDark ? 'bg-slate-950/40 border-slate-800 hover:border-amber-500/30' : 'bg-slate-50 border-slate-200 hover:border-amber-500/30'}`}
            >
              <p className="text-[9px] font-black uppercase tracking-widest mb-1 text-emerald-500">
                {copied ? '✅ ተቀድቷል (Copied)' : '🔗 ለመቅዳት ቁጥሩን ይንኩ (Tap to Copy)'}
              </p>
              <p className="text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
                {selectedProvider?.adminDetails || '...'}
              </p>
            </motion.div>

            {/* DEPOSIT ACTION FORM */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="text-[10px] font-bold text-amber-500 uppercase mb-1 block tracking-widest">የደረሰኝ ቁጥር (Ref ID)</label>
                <input 
                  type="text" required placeholder="ለምሳሌ፦ DCJ616D1GE"
                  value={formData.ref} 
                  onChange={(e) => setFormData({...formData, ref: e.target.value})}
                  className={`w-full bg-transparent border-b-2 py-3.5 text-xl font-black outline-none transition-colors uppercase
                    ${isDark ? 'border-slate-800 focus:border-amber-500 text-white' : 'border-slate-200 focus:border-amber-500 text-slate-900'}`}
                />
              </div>
              <button 
                type="submit"
                disabled={loading} 
                className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl transition-all duration-200 active:scale-95 disabled:opacity-50
                  ${isDark ? 'bg-amber-500 text-slate-950 shadow-amber-500/5' : 'bg-slate-950 text-white'}`}
              >
                {loading ? '⏳ በማረጋገጥ ላይ...' : '✨ አረጋግጥ (Validate)'}
              </button>
            </form>
          </div>
        ) : (
          /* WITHDRAWAL ACTION FORM */
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block tracking-widest">የሚወጣው ብር መጠን</label>
              <input 
                type="number" required placeholder="ለምሳሌ 100"
                value={formData.amount} 
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                className={`w-full bg-transparent border-b-2 py-3.5 text-2xl font-black outline-none transition-colors
                  ${isDark ? 'border-slate-800 focus:border-emerald-500 text-white' : 'border-slate-200 focus:border-emerald-500 text-slate-900'}`}
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-400 uppercase mb-1 block tracking-widest">የቴሌብር ስልክ ቁጥር</label>
              <input 
                type="text" required placeholder="09..."
                value={formData.accountNumber} 
                onChange={(e) => setFormData({...formData, accountNumber: e.target.value})}
                className={`w-full bg-transparent border-b-2 py-3.5 text-xl font-black outline-none transition-colors
                  ${isDark ? 'border-slate-800 focus:border-emerald-500 text-white' : 'border-slate-200 focus:border-emerald-500 text-slate-900'}`}
              />
            </div>
            <button 
              type="submit"
              disabled={loading || isBalanceLow} 
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs uppercase tracking-[0.2em] shadow-lg shadow-emerald-950/10 active:scale-95 disabled:opacity-40 transition-all duration-200"
            >
              {loading ? '⏳ በመላክ ላይ...' : '📤 ብር ማውጫ ጥያቄ ላክ'}
            </button>
          </form>
        )}
      </div>

      {/* LOW BALANCE ALERT CONDITIONAL BANNER */}
      <AnimatePresence>
        {mode === 'withdraw' && isBalanceLow && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: 10 }}
            className="mt-4 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-semibold text-center"
          >
            ⚠️ ብር ለማውጣት ሂሳብዎ ላይ ቢያንስ 50 ብር መኖር አለበት።
          </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `.scrollbar-hide::-webkit-scrollbar { display: none; }` }} />
    </div>
  );
};

export default Wallet;
