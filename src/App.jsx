

import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';
import BingoPattern from './pages/BingoPattern';
// 1. Lazy Loading for performance optimization
const Login = lazy(() => import('./pages/Login'));
// const SpinPage = lazy(() => import('./pages/SpinPage')); // ADDED SPIN PAGE
const BingoLobby = lazy(() => import('./pages/BingoLobby'));
const BingoGame = lazy(() => import('./pages/BingoGame'));
const CardSelection = lazy(() => import('./pages/CardSelection'));
const MyHistory = lazy(() => import('./pages/MyHistory'));
const Leaderboard = lazy(() => import('./pages/Leaderboard'));
const Wallet = lazy(() => import('./pages/Wallet'));
const Settings = lazy(() => import('./pages/Settings'));
const TransactionPage = lazy(() => import('./pages/TransactionPage'));
// 2. Updated Professional PageLoader
const PageLoader = () => (
  <div className="h-screen bg-[#0f172a] flex flex-col items-center justify-center gap-6">
    <div className="relative">
      {/* Outer Pulse Effect */}
      <div className="absolute inset-0 rounded-full bg-amber-500/20 animate-ping"></div>
      
      {/* Spinning Loader */}
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full border-4 border-white/5"></div>
        <div className="absolute inset-0 rounded-full border-t-4 border-amber-500 animate-spin"></div>
      </div>

      {/* Center Icon (Updated: Bingo Target Element) */}
      <div className="absolute inset-0 flex items-center justify-center text-xl">
        🎯
      </div>
    </div>

    <div className="text-center space-y-2">
      <p className="text-[10px] font-black text-white uppercase tracking-[0.4em] animate-pulse">
        Connecting to Afro Engine
      </p>
      <div className="flex gap-1 justify-center">
        <div className="w-1 h-1 bg-amber-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
        <div className="w-1 h-1 bg-emerald-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
        <div className="w-1 h-1 bg-amber-500 rounded-full animate-bounce"></div>
      </div>
    </div>
  </div>
);

// 3. 404 Not Found Component
const NotFound = () => {
  const { isDark } = useTheme();
  return (
    <div className={`h-screen flex flex-col items-center justify-center transition-colors duration-300 ${
      isDark ? 'bg-[#020617] text-white' : 'bg-[#f1f5f9] text-slate-900'
    }`}>
      <h1 className="text-8xl font-black text-orange-500 italic opacity-20 absolute select-none">404</h1>
      <div className="relative z-10 text-center">
        <h2 className="text-2xl font-black uppercase tracking-tighter">Table Not Found</h2>
        <p className={`${isDark ? 'text-slate-400' : 'text-slate-500'} text-[10px] uppercase tracking-widest mt-2 font-bold`}>
          The game room has expired or does not exist.
        </p>
        <button 
          onClick={() => window.location.href = '/'} 
          className="mt-8 px-10 py-4 bg-orange-500 hover:bg-orange-600 shadow-lg shadow-orange-500/20 transition-all rounded-2xl text-[10px] font-black uppercase text-white tracking-widest"
        >
          Return to Lobby
        </button>
      </div>
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          {/* Wrap Routes in Suspense to show PageLoader while code-splitting chunks load */}
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* PUBLIC ROUTES */}
              <Route path="/login" element={<Login />} />

              {/* PROTECTED ROUTES (Wrapped in Layout) */}
              <Route path="/" element={<ProtectedRoute><Layout><BingoLobby /></Layout></ProtectedRoute>} />
              <Route path="/wallet" element={<ProtectedRoute><Layout><Wallet /></Layout></ProtectedRoute>} />
              <Route path="/settings" element={<ProtectedRoute><Layout><Settings /></Layout></ProtectedRoute>} />
              <Route path="/history" element={<ProtectedRoute><Layout><MyHistory /></Layout></ProtectedRoute>} />
              <Route path="/transactions" element={<ProtectedRoute><Layout><TransactionPage /></Layout></ProtectedRoute>} />
              <Route path="/leaderboard" element={<ProtectedRoute><Layout><Leaderboard /></Layout></ProtectedRoute>} />
              <Route path="/select-card/:roomId" element={<ProtectedRoute><Layout><CardSelection /></Layout></ProtectedRoute>} />
              <Route path="/patterns" element={<ProtectedRoute><Layout><BingoPattern /></Layout></ProtectedRoute>} />
               {/* <Route path="/lottery" element={<ProtectedRoute><Layout><SpinPage /></Layout></ProtectedRoute>} /> */}

              {/* SPIN ROUTE (Added under Protected Routes) */}
              {/* <Route path="/spin" element={
                <ProtectedRoute>
                  <Layout>
                    <SpinPage />
                  </Layout>
                </ProtectedRoute>
              } /> */}
              {/* GAME ROUTE (No Layout for full-screen game experience) */}
              <Route path="/game/:roomId" element={
                <ProtectedRoute>
                  <BingoGame />
                </ProtectedRoute>
              } />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;