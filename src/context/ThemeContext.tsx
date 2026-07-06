import React, { createContext, useContext, useState, useEffect } from 'react';

export type ThemeType = 'light' | 'dark' | 'chai';

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  isDark: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeType>(() => {
    const saved = localStorage.getItem('stadiumos-theme');
    return (saved as ThemeType) || 'dark'; // default to dark
  });

  const [isDark, setIsDark] = useState(true);

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
    localStorage.setItem('stadiumos-theme', newTheme);
  };

  useEffect(() => {
    const root = window.document.documentElement;

    const updateTheme = () => {
      // both dark and chai count as dark-themed components (light elements are false)
      const activeDark = theme === 'dark' || theme === 'chai';
      setIsDark(activeDark);

      // Clean all classes first
      root.classList.remove('light', 'dark', 'chai');

      if (theme === 'dark') {
        root.classList.add('dark');
        root.style.colorScheme = 'dark';
      } else if (theme === 'light') {
        root.classList.add('light');
        root.style.colorScheme = 'light';
      } else if (theme === 'chai') {
        root.classList.add('chai');
        root.style.colorScheme = 'dark';
      }
    };

    updateTheme();
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
