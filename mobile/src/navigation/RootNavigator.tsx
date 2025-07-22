import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AuthStack from '@/navigation/AuthStack';
import MainStack from '@/navigation/MainStack'; 
import { RootStackParamList } from '../types/navigation';
import { useAuth } from '@/features/auth/context/AuthContext';

const Stack = createNativeStackNavigator<RootStackParamList>();
const RootNavigator: React.FC = () => {
  const { authState, getUserRole } = useAuth();
  const userRole = getUserRole(); 

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, gestureEnabled: false }}>
        {!authState.isLoggedIn ? (
          <Stack.Screen name="AuthStack" component={AuthStack} />
        ) : userRole === 'teacher' ? (
          <Stack.Screen name="TeacherStack" component={MainStack} />
        ) : (
          <Stack.Screen name="ParentStack" component={MainStack} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default RootNavigator;