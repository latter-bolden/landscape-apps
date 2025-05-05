import { useEffect, useState } from 'react';

export function useSystemTheme() {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    // Set initial theme
    const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setTheme(darkModeQuery.matches ? 'dark' : 'light');

    // Listen for changes
    const themeChangeHandler = (e: any) => {
      console.log('change', e);
      setTheme(e.matches ? 'dark' : 'light');
    };

    darkModeQuery.addEventListener('change', themeChangeHandler);

    // Cleanup
    return () => {
      darkModeQuery.removeEventListener('change', themeChangeHandler);
    };
  }, []);

  console.log('Current theme:', theme);

  return theme;
}
