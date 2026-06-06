import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading, telegramAutoAuth } = useAuth();
  const [checkingTG, setCheckingTG] = useState(true);

  useEffect(() => {
    const initTelegram = async () => {
      const tg = window.Telegram?.WebApp;

      // Only attempt auto-login if Telegram WebApp is available AND initData exists
      if (tg?.initData && !user) {
        // console.log("Telegram WebApp detected. Trying auto-login...");
        await telegramAutoAuth(tg.initData);
      } else if (!tg?.initData) {
        // console.log("Telegram WebApp initialized but no user data available.");
      }

      setCheckingTG(false);
    };

    initTelegram();
  }, [telegramAutoAuth, user]);

  // While context or Telegram login is being checked
  if (loading || checkingTG) return <div>Loading...</div>;

  // Redirect if user still not logged in
  if (!user) return <Navigate to="/login" replace />;

  // Render protected content
  return children;
};

export default ProtectedRoute;
