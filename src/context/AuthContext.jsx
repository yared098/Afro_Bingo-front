

import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { socket } from '../socket'; 

const AuthContext = createContext();
const API_URL = import.meta.env.VITE_API_URL || 'https://fish-bingo-backend-new.onrender.com';

const api = axios.create({
  baseURL: `${API_URL}/api`,
});

// Axios Interceptor for API calls
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 🛡️ SYNC SOCKET WITH AUTH STATE
  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (token && user) {
      // 1. Inject token into the socket handshake object
      socket.auth = { token };
      
      // 2. Manually connect now that we have credentials
      if (socket.disconnected) {
        console.log("🔌 Connecting secure socket for:", user.username);
        socket.connect();
      }
    }

    return () => {
      if (socket.connected && !user) {
        socket.disconnect();
      }
    };
  }, [user]);

  // Initial Auth Check
  useEffect(() => {
    const initAuth = async () => {
      const tg = window.Telegram?.WebApp;
      const token = localStorage.getItem('token');

      if (tg && tg.initData) {
        tg.ready();
        tg.expand();
        await telegramAutoAuth(tg.initData);
      } else if (token) {
        await fetchUserProfile();
      } else {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(initAuth, 100);
    return () => clearTimeout(timeoutId);
  }, []);

  const telegramAutoAuth = async (initData) => {
    try {
      const { data } = await api.post('/users/telegram-login', { initData });
      localStorage.setItem('token', data.token);
      setUser(data.user); 
    } catch (err) {
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const { data } = await api.get('/users/profile');
      setUser(data); 
    } catch (err) {
      localStorage.removeItem('token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const { data } = await api.post('/users/login', { email, password });
      localStorage.setItem('token', data.token);
      setUser(data.user);
      return data;
    } catch (err) {
      throw err.response?.data || { message: "Login failed" };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    socket.disconnect();
    window.location.href = '/login';
  };

  // 🛡️ ADDED: This fixes the "updateLocalUser is not a function" error in Layout.jsx
  const updateLocalUser = (updatedData) => {
    setUser(prev => {
      if (!prev) return null;
      return { ...prev, ...updatedData };
    });
  };

  return (
    <AuthContext.Provider value={{
      user, 
      login, 
      logout, 
      loading, 
      updateLocalUser, // 👈 Exporting the function
      fetchUserProfile, 
      api,
      refreshUser: fetchUserProfile 
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};