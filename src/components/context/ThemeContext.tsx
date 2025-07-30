'use client';

import React, { createContext, useContext, useState } from 'react';

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

const darkTheme = {
  nav: {
    bubble: 'rgba(30, 41, 59, 0.8)', // Subtle dark blue
    text: '#f1f5f9',
    activeText: '#3b82f6',
  },
  background: '#0f172a',
  text: '#f1f5f9',
  accent: '#3b82f6',
};

interface ThemeContextType {
  currentTheme: typeof lightTheme;
}

const ThemeContext = createContext<ThemeContextType>({
  currentTheme: lightTheme,
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Always use light theme for consistency with your design preferences
  const [currentTheme] = useState(lightTheme);

  return (
    <ThemeContext.Provider value={{ currentTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
