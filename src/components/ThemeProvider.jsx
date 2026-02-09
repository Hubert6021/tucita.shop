import React, { useEffect } from 'react';
import { ThemeProviderContext, useTheme } from '@/contexts/ThemeContext';

const ThemeApplier = ({ children }) => {
  const { theme } = useTheme();

  useEffect(() => {
    const root = window.document.documentElement;
    
    // Apply CSS variables for the current theme
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--theme-${key}`, value);
    });

    // Handle special case for body background and text color directly
    // This ensures even parts outside of components get styled
    document.body.style.backgroundColor = theme.colors.background;
    document.body.style.color = theme.colors.text;

  }, [theme]);

  return <div className={`theme-${theme.name} min-h-screen transition-colors duration-500`}>{children}</div>;
};

const ThemeProvider = ({ children }) => {
  return (
    <ThemeProviderContext>
      <ThemeApplier>{children}</ThemeApplier>
    </ThemeProviderContext>
  );
};

export default ThemeProvider;