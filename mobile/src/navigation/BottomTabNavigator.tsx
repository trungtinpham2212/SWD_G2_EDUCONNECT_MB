import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '@/features/home/screen/HomeScreen';
import { BottomTabParamList } from '@/types/navigation';
import { FontAwesome5 } from '@expo/vector-icons';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#ffc500',
        tabBarInactiveTintColor: '#f5f5f5',
        tabBarStyle: {
          backgroundColor: '#111',
          height: 60,
          paddingVertical: 5,
          justifyContent: 'center',
        },
        tabBarLabelStyle: {
          marginTop: 0,
          fontSize: 11,
          marginBottom: 8,
        },
        tabBarIcon: ({ color, size }) => {
          // nhớ phải return JSX ở đây
          switch (route.name) {
            case 'Home':
              return <FontAwesome5 name="home" size={size} color={color} />;
            // nếu có thêm tab khác, ở đây
            // case 'Chat':
            //   return <FontAwesome5 name="comments" size={size} color={color} />;
            // case 'Settings':
            //   return <FontAwesome5 name="cog" size={size} color={color} />;
            default:
              return null;
          }
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      {/* Chèn thêm <Tab.Screen> cho Chat, Settings ở đây */}
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
