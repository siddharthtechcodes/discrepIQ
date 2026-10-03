import React, { createContext, useContext } from 'react';

const ThemeContext = createContext(null);

// Forced light mode only — dark mode removed per user request
export function ThemeProvider({ children }) {
  // Always ensure light mode is applied
  if (typeof document !== 'undefined') {
    document.documentElement.classList.remove('dark');
  }

  return (
    <ThemeContext.Provider value={{ theme: 'light', toggleTheme: () => {}, setTheme: () => {}, isDark: false }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
