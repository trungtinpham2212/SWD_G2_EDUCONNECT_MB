// src/navigation/MainStack.tsx
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabNavigator from '@/navigation/BottomTabNavigator';
import { MainStackParamList } from '@/types/navigation';
import ParentScheduleScreen from '@/features/schedule/parent';
import TeacherScheduleScreen from '@/features/schedule/teacher';
import ChatbotScreen from '@/features/chatbot';
import { useAuth } from '@/features/auth/context/AuthContext';
import ParentReportScreen from '@/features/report/parent';
import ChildTeachersScreen from '@/features/childTeachers';
import ClassStudentScreen from '@/features/myClass';
import { useTheme } from 'react-native-paper';
import EvaluationScreen from '@/features/evaluation';
import EditProfileScreen from '@/features/editProfile'; 
import NotificationTest from '@/features/notification/NotificationTest';
import TeacherReportScreen from '@/features/report/teacher';
import CreateReportScreen from '@/features/report/teacher/create';
import DetailReportScreen from '@/features/report/teacher/detail';
import { useFCMTokenSync } from '@/features/auth/hooks/useAuthEffect';

const Stack = createNativeStackNavigator<MainStackParamList>();

const MainStack: React.FC = () => {
  const { getUserRole } = useAuth();
  const userRole = getUserRole();
  const theme = useTheme();
  
  useFCMTokenSync();
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: theme.colors.tertiaryContainer,
        },
        headerTintColor: theme.colors.onTertiaryContainer,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen
        name="BottomTabs"
        component={BottomTabNavigator}
        options={{ headerShown: false }}
      />
      {userRole === 'parent' ? (
        <>
          <Stack.Screen name='ParentSchedule' component={ParentScheduleScreen} />
          <Stack.Screen name='Chatbot' component={ChatbotScreen} options={{ headerShown: false }} />
          <Stack.Screen name='ParentReport' component={ParentReportScreen}  />
          <Stack.Screen name='ChildTeachers' component={ChildTeachersScreen} /> 
          <Stack.Screen name='NotificationTest' component={NotificationTest} />
          <Stack.Screen name='EditProfile' component={EditProfileScreen} options={{headerShown:false}}/>

        </>
      ) : (
        <>
          <Stack.Screen name='TeacherSchedule' component={TeacherScheduleScreen} />
          <Stack.Screen name='ClassStudent' component={ClassStudentScreen} />
          <Stack.Screen name='Evaluation' component={EvaluationScreen} />
          <Stack.Screen name='EditProfile' component={EditProfileScreen} options={{headerShown:false}}/>
          <Stack.Screen name='TeacherReport' component={TeacherReportScreen} />
          <Stack.Screen name='CreateReport' component={CreateReportScreen} />
          <Stack.Screen name='TeacherReportDetail' component={DetailReportScreen} />

        </>
      )}
    </Stack.Navigator>
  );
};

export default MainStack;