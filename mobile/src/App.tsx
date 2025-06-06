import { FONTS } from '@/constants/fonts';
import LoginScreen from '@/features/auth/LoginScreen';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { useEffect } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
// import MainLayout from '@/layouts/MainLayout';
import { Provider as PaperProvider } from 'react-native-paper';

SplashScreen.preventAutoHideAsync();
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
    <PaperProvider>
      <SafeAreaProvider> 
          <LoginScreen /> 
      </SafeAreaProvider>
    </PaperProvider>
  );
}
