import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark' | 'system';
type ActualTheme = 'light' | 'dark';

export const useTheme = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Cargar tema guardado o usar 'system'
    const savedTheme = localStorage.getItem('preferred-theme');
    return (savedTheme as Theme) || 'system';
  });

  const [actualTheme, setActualTheme] = useState<ActualTheme>('dark');

  useEffect(() => {
    const applyTheme = (themeToApply: Theme) => {
      if (themeToApply === 'system') {
        const systemPreference = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', systemPreference);
        setActualTheme(systemPreference);
      } else {
        document.documentElement.setAttribute('data-theme', themeToApply);
        setActualTheme(themeToApply);
      }
    };

    applyTheme(theme);
    localStorage.setItem('preferred-theme', theme);

    // Escuchar cambios en preferencia del sistema
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = (e: MediaQueryListEvent) => {
        const newTheme = e.matches ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', newTheme);
        setActualTheme(newTheme);
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  const changeTheme = (newTheme: Theme) => {
    if (['light', 'dark', 'system'].includes(newTheme)) {
      setTheme(newTheme);
    }
  };

  return { theme, actualTheme, changeTheme };
};

export default useTheme;
