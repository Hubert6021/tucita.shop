import React from 'react';
import { cn } from '@/lib/utils';
import { useTheme } from '@/contexts/ThemeContext';

const BarberThemeWrapper = ({ children, className, as: Component = 'div', ...props }) => {
  const { isBarber } = useTheme();

  if (!isBarber) {
    return (
      <Component className={cn(className)} {...props}>
        {children}
      </Component>
    );
  }

  return (
    <Component 
      className={cn(
        "bg-zinc-900 border border-yellow-900/30 shadow-lg shadow-black/40",
        className
      )} 
      {...props}
    >
      {children}
    </Component>
  );
};

export default BarberThemeWrapper;