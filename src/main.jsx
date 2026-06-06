import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import { ThemeProvider } from './context/ThemeContext'; // Import the provider
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext.jsx';
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
    <ThemeProvider>
      <LanguageProvider>  {/* Add this here */}
        <App />
      </LanguageProvider>
    </ThemeProvider>
  </AuthProvider>
  </StrictMode>,
);