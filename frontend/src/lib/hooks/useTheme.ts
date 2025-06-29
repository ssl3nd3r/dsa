import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { setTheme, toggleTheme } from '../slices/uiSlice';

export function useTheme() {
  const dispatch = useDispatch();
  const theme = useSelector((state: RootState) => state.ui.theme);

  const BLACK = '#3B3C36';
  const WHITE = '#FFFFFF';    

  useEffect(() => {
    // Get theme from localStorage or default to 'light'
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark';
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (savedTheme) {
      dispatch(setTheme(savedTheme));
    } else {
      // Only use system preference if no saved theme exists
      dispatch(setTheme(prefersDark ? 'dark' : 'light'));
    }
  }, [dispatch]);

  useEffect(() => {
    // Update localStorage
    localStorage.setItem('theme', theme);
    
    // Update document class - this overrides any prefers-color-scheme
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
  };

  return {
    theme,
    BLACK,
    WHITE,
    toggleTheme: handleToggleTheme,
  };
} 