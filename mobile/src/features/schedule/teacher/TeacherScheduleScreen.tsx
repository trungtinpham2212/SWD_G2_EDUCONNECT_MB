import React from 'react';
import { View, Text } from 'react-native';
import MainLayout from '@/layouts/MainLayout';

const TeacherScheduleScreen: React.FC = () => {
  return (
    <MainLayout>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Teacher Schedule Screen</Text>
      </View>
    </MainLayout>
  );
};

export default TeacherScheduleScreen; 