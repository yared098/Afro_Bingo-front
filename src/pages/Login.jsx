import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, user, loading } = useAuth();
  const navigate = useNavigate();
  const tg = window.Telegram?.WebApp;

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

  if (tg?.initData && loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#0f172a] text-white relative overflow-hidden">
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
      <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-md w-full bg-slate-900/40 backdrop-blur-xl rounded-[2rem] shadow-2xl p-8 text-center border border-slate-800 relative">
        <div className="mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl shadow-xl shadow-amber-500/10 mb-4 transform hover:rotate-6 transition-transform duration-300">
            <span className="text-3xl">🎯</span>
          </div>
          <h1 className="text-3xl font-black tracking-tight text-white uppercase">
            Afro <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-emerald-400">Bingo</span>
          </h1>
          <p className="text-slate-400 font-bold uppercase text-[10px] tracking-widest mt-1">Admin Central Management</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-2xl text-xs font-semibold tracking-wide text-left animate-shake">
            <span className="font-bold mr-1">⚠️ Error:</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5 text-left">
          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
              Email Address
            </label>
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

          <div>
            <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="••••••••"
                className="w-full px-5 py-4 pr-14 rounded-2xl bg-slate-950/60 border border-slate-800 text-white placeholder-slate-600 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none transition-all font-medium text-sm shadow-inner"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-amber-500 transition-colors"
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                    <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                    <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            </div>
          </div>

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