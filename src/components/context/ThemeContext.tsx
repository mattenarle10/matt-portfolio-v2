'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

// Theme values aligned with your preferred sleek, modern aesthetic
const lightTheme = {
  nav: {
    bubble: 'rgba(240, 242, 245, 0.8)', // Subtle light gray
    text: '#18181b',
    activeText: '#2563eb', // Blue accent for active states
  },
  background: '#ffffff',
  text: '#18181b',
  accent: '#2563eb', // Blue accent color
};

// Dark theme with subtle, refined colors
const darkTheme = {
  nav: {
    bubble: 'rgba(30, 41, 59, 0.8)', // Subtle dark blue
    text: '#f1f5f9',
    activeText: '#3b82f6',
  },
  background: '#0a0a0a', // Matching your dark:bg-[#0a0a0a] preference
  text: '#f1f5f9',
  accent: '#3b82f6',
};

type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
  theme: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize theme from localStorage or system preference
  const [theme, setTheme] = useState<ThemeMode>('light');
  
  // Effect to initialize theme from localStorage or system preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as ThemeMode | null;
    let initialTheme: ThemeMode = 'light';

    if (savedTheme === 'dark') {
      initialTheme = 'dark';
    } else if (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      initialTheme = 'dark';
    }

    setTheme(initialTheme);

    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);

    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };


  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
