// src/navigation/MainStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from '@/navigation/BottomTabNavigator';
import { MainStackParamList } from '@/types/navigation';
import ParentScheduleScreen from '@/features/schedule/teacher/ParentScheduleScreen';

const Stack = createNativeStackNavigator<MainStackParamList>();

const MainStack: React.FC = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="BottomTabs"
        component={BottomTabNavigator}
        options={{ headerShown: false }} />
      <Stack.Screen name="ParentSchedule" component={ParentScheduleScreen} />
    </Stack.Navigator>
  );
};

export default MainStack;