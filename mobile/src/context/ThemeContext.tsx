import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface ThemeContextType {
  isDarkTheme: boolean;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<ThemeContextType>({
  isDarkTheme: false,
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkTheme, setIsDarkTheme] = useState<boolean>(false);

  // Tải theme từ AsyncStorage khi khởi động
  useEffect(() => {
    const loadTheme = async () => {
      const savedTheme = await AsyncStorage.getItem('theme');
      setIsDarkTheme(savedTheme === 'dark');
    };
    loadTheme();
  }, []);

  // Chuyển đổi theme và lưu vào AsyncStorage
  const toggleTheme = async () => {
    setIsDarkTheme((prev) => {
      const newTheme = !prev;
      AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
      return newTheme;
    });
  };

  return (
    <ThemeContext.Provider value={{ isDarkTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};