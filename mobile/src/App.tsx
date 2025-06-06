import { FONTS } from '@/constants/fonts';
import LoginScreen from '@/features/auth/screen/LoginScreen';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { useContext, useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider as PaperProvider } from 'react-native-paper';
import { ThemeProvider, ThemeContext } from '@/context/ThemeContext';
import { lightTheme, darkTheme } from '@/constants/theme';

SplashScreen.preventAutoHideAsync();

function AppContent() {
  const { isDarkTheme } = useContext(ThemeContext);
  const selectedTheme = isDarkTheme ? darkTheme : lightTheme;

  return (
    <PaperProvider theme={selectedTheme}>
      <SafeAreaProvider>
        <LoginScreen />
      </SafeAreaProvider>
    </PaperProvider>
  );
}

export default function App() {
  const [loaded, error] = useFonts({
    [FONTS.OPENSANS_REGULAR]: require('@/assets/fonts/OpenSans-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}