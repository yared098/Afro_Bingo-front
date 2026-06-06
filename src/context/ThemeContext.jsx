
import React, { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState(() => {
        return localStorage.getItem('bingo_theme') || 'dark';
    });

    useEffect(() => {
        localStorage.setItem('bingo_theme', theme);
        // Apply class to documentElement for global CSS targeting
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            document.documentElement.classList.remove('light');
        } else {
            document.documentElement.classList.add('light');
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    // Enhanced toggleTheme to accept a value OR just flip the current state
    const toggleTheme = (value) => {
        if (typeof value === 'string') {
            setTheme(value);
        } else {
            setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
        }
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, isDark: theme === 'dark' }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);