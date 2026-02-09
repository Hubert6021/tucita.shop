import React, { createContext, useContext, useState, useEffect } from 'react';
import { THEMES } from '@/utils/themeUtils';

const ThemeContext = createContext(null);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProviderContext = ({ children }) => {
  const [currentThemeName, setCurrentThemeName] = useState('default');
  
  // Computed theme object based on name
  const theme = THEMES[currentThemeName];

  const setTheme = (themeName) => {
    if (THEMES[themeName]) {
      setCurrentThemeName(themeName);
    } else {
      console.warn(`Theme ${themeName} not found, falling back to default`);
      setCurrentThemeName('default');
    }
  };

  const isBarber = currentThemeName === 'barberia';

  const value = {
    theme,
    currentThemeName,
    setTheme,
    isBarber,
    colors: theme.colors,
    styles: theme.styles
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};