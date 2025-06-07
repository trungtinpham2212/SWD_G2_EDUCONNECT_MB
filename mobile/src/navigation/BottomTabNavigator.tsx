import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '@/features/home/screen/HomeScreen';
import { BottomTabParamList } from '@/types/navigation';
import { FontAwesome5 } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import {COLORS} from '@/constants/colors';
const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: COLORS.THEME_LINK_COLOR_TABLE,
        tabBarInactiveTintColor: '#f5f5f5',
        tabBarStyle: {
          backgroundColor: COLORS.MAIN_APP_COLOR,
          height: 60,
          paddingVertical: 5,
          justifyContent: 'center',
        },
        tabBarLabelStyle: {
          marginTop: 0,
          fontSize: 11,
          marginBottom: 8,
          fontWeight: '700',
        },
        tabBarIcon: ({ color, size }) => { 
          switch (route.name) { 
            case 'Home':
              return <FontAwesome5 name="home" size={size} color={color} />;
            case 'Settings':
              return <AntDesign name="setting" size={24} color={color} />  
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
      <Tab.Screen
        name="Settings"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Settings',
        }}
      />
      {/* Chèn thêm <Tab.Screen> cho Chat, Settings ở đây */}
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
