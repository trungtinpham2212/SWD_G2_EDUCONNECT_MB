// src/navigation/MainStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from '@/navigation/BottomTabNavigator';
import { MainStackParamList } from '@/types/navigation';
import ParentScheduleScreen from '@/features/schedule/parent';
import TeacherScheduleScreen from '@/features/schedule/teacher/TeacherScheduleScreen';
import ChatbotScreen from '@/features/chatbot';
import { useAuth } from '@/features/auth/context/AuthContext';
import ParentReportScreen from '@/features/report/parent';
import ChildTeachersScreen from '@/features/childTeachers';

const Stack = createNativeStackNavigator<MainStackParamList>();

const MainStack: React.FC = () => {
  const { getUserRole } = useAuth();
  const userRole = getUserRole();

  return (
    <Stack.Navigator>
      <Stack.Screen 
        name="BottomTabs"
        component={BottomTabNavigator}
        options={{ headerShown: false }} 
      />
      {userRole === 'parent' ? (
        <>
          <Stack.Screen name="ParentSchedule" component={ParentScheduleScreen} />
          <Stack.Screen name="Chatbot" component={ChatbotScreen}  options={{ headerShown: false }} />
          <Stack.Screen name="ParentReport" component={ParentReportScreen}  options={{ headerShown: false }} />
          <Stack.Screen name="ChildTeachers" component={ChildTeachersScreen}   />
        </>
      ) : (
        <Stack.Screen name="TeacherSchedule" component={TeacherScheduleScreen} />
      )}
    </Stack.Navigator>
  );
};

export default MainStack;