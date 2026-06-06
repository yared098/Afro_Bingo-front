import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, user, loading } = useAuth(); // Destructure 'user' and 'loading' from context
  const navigate = useNavigate();
  const tg = window.Telegram?.WebApp;

  // 1. AUTO-REDIRECT LOGIC - Core function untouched
  useEffect(() => {
    if (user && !loading) {
      console.log("🚀 User authenticated, redirecting to Lobby...");
      navigate('/', { replace: true });
    }
  }, [user, loading, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password);
    } catch (err) {
      console.error("❌ LOGIN FAILED:", err.message);
      setError(err.message || 'Invalid email or password');
      setIsSubmitting(false);
    }
  };

  // 2. TELEGRAM SPLASH SCREEN - Afro Bingo Theme Updated
  if (tg?.initData && loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a] text-white relative overflow-hidden">
        {/* Subtle Background Pattern Elements */}
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] bg-amber-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] bg-emerald-500/10 rounded-full blur-[120px]" />
        
        <div className="relative mb-6">
          <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-amber-500 border-opacity-70"></div>
          <div className="absolute top-0 left-0 animate-pulse rounded-full h-20 w-20 border-b-4 border-emerald-500"></div>
          <div className="absolute inset-0 flex items-center justify-center text-xl">🎯</div>
        </div>
        
        <h2 className="text-2xl font-black uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-500 to-emerald-400 animate-pulse">
          Afro Bingo
        </h2>
        <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-3 px-4 py-1.5 bg-slate-800/80 border border-slate-700/50 rounded-full">
          Syncing with Telegram...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a] px-4 relative overflow-hidden">
      {/* Background radial accent flares */}
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full bg-slate-900/40 backdrop-blur-xl rounded-[2rem] shadow-2xl p-8 text-center border border-slate-800 relative">
        
        {/* Brand Header */}
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl shadow-xl shadow-amber-500/10 mb-4 transform hover:rotate-6 transition-transform duration-300">
            <span className="text-3xl">🎯</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white uppercase">
            Afro <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-emerald-400">Bingo</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">Admin Central Management</p>
        </div>

        {/* Error Alert Display Box */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-xs font-semibold tracking-wide text-left animate-shake">
            <span className="font-bold mr-1">⚠️ Error:</span> {error}
          </div>
        )}

        {/* Form Controls Block */}
        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                autoComplete="username"
                placeholder="admin@afrobingo.com"
                className="w-full px-5 py-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-white placeholder-slate-600 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all font-medium text-sm shadow-inner"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
              Password
            </label>
            <div className="relative">
              <input
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full px-5 py-4 rounded-2xl bg-slate-950/60 border border-slate-800 text-white placeholder-slate-600 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all font-medium text-sm shadow-inner"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Core Submit Authorization Button */}
          <button 
            type="submit" 
            disabled={isSubmitting} 
            className={`w-full py-4 rounded-2xl text-slate-950 font-black text-xs uppercase tracking-[0.2em] shadow-xl transition-all duration-200 active:scale-[0.98] mt-6 relative overflow-hidden
              ${isSubmitting 
                ? 'bg-slate-800 text-slate-500 cursor-not-allowed shadow-none border border-slate-700/50' 
                : 'bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-500 hover:to-yellow-600 shadow-amber-500/10 hover:shadow-amber-500/20'}`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-slate-500 border-t-transparent rounded-full animate-spin" />
                Verifying Credentials...
              </span>
            ) : 'Secure Entry'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;