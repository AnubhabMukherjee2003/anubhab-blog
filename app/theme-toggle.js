'use client';

import { useEffect } from 'react';

export default function ThemeToggle() {
  useEffect(() => {
    const savedTheme = localStorage.getItem('user-color-scheme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-user-color-scheme', savedTheme);
    }

    // Add a toggle button for light/dark mode if desired
    const toggleTheme = () => {
      const currentTheme = document.documentElement.getAttribute('data-user-color-scheme');
      const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-user-color-scheme', newTheme);
      localStorage.setItem('user-color-scheme', newTheme);
    };

    // You can add a button to your layout that calls this function
  }, []);

  return null;
}
