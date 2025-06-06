import { MD3LightTheme, MD3DarkTheme } from 'react-native-paper';

interface CustomTheme {
  colors: {
    primary: string;
    background: string;
    surface: string;
    onBackground: string;
    onSurface: string;
    error: string;
    titleBig: string;
  };
}

export const lightTheme: CustomTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#2563eb',
    background: '#f5f5f5',
    surface: '#ffffff',
    onBackground: '#333333',
    onSurface: '#333333',
    error: '#d32f2f',
    titleBig: '#000000',
  },
};

export const darkTheme: CustomTheme = {
  ...MD3DarkTheme,
  colors: {
    ...MD3DarkTheme.colors,
    primary: '#aaadf7',
    background: '#121212',
    surface: '#1e1e1e',
    onBackground: '#e0e0e0',
    onSurface: '#e0e0e0',
    error: '#cf6679',
    titleBig: '#f5f5f5',
  },
};