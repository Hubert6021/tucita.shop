export const THEMES = {
  default: {
    name: 'default',
    colors: {
      primary: '#ec4899', // pink-500
      secondary: '#a855f7', // purple-500
      accent: '#f43f5e', // rose-500
      background: '#f9fafb', // gray-50
      card: '#ffffff',
      text: '#111827', // gray-900
      textMuted: '#6b7280', // gray-500
      border: '#e5e7eb', // gray-200
      primaryGradient: 'from-rose-500 to-pink-500',
      heroGradient: 'from-rose-900/80 via-purple-900/70 to-pink-900/80',
    },
    styles: {
      button: 'bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white',
      buttonOutline: 'border-2 border-rose-500 text-rose-600 hover:bg-rose-50',
      badge: 'bg-rose-100 text-rose-700',
      inputFocus: 'focus:ring-rose-500',
      activeTab: 'text-rose-500 border-b-2 border-rose-500',
      icon: 'text-rose-500'
    }
  },
  barberia: {
    name: 'barberia',
    colors: {
      primary: '#d4af37', // gold
      secondary: '#c5a028', // dark gold
      accent: '#ffd700', // bright gold
      background: '#1a1a1a', // dark gray/black
      card: '#262626', // slightly lighter black
      text: '#ffffff',
      textMuted: '#9ca3af', // gray-400
      border: '#404040', // gray-700
      primaryGradient: 'from-yellow-600 to-yellow-500',
      heroGradient: 'from-black/90 via-zinc-900/90 to-black/90',
    },
    styles: {
      button: 'bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-700 hover:to-yellow-600 text-white shadow-lg shadow-yellow-900/20',
      buttonOutline: 'border-2 border-yellow-600 text-yellow-500 hover:bg-yellow-900/20',
      badge: 'bg-yellow-900/30 text-yellow-500 border border-yellow-700/50',
      inputFocus: 'focus:ring-yellow-500',
      activeTab: 'text-yellow-500 border-b-2 border-yellow-500',
      icon: 'text-yellow-500'
    }
  }
};

export const isBarberCategory = (category) => {
  if (!category) return false;
  const normalized = category.toLowerCase();
  return normalized.includes('barber') || normalized.includes('barbero');
};

export const getThemeByCategory = (category) => {
  return isBarberCategory(category) ? 'barberia' : 'default';
};

export const getThemeForProfessional = (professional) => {
  if (!professional) return 'default';
  // Check specialty or services
  if (isBarberCategory(professional.specialty)) return 'barberia';
  // Check userType if available in professional object
  if (professional.professionalType && isBarberCategory(professional.professionalType)) return 'barberia';
  
  return 'default';
};