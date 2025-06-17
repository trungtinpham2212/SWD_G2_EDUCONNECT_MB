import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ParentHomeScreen from '@/features/home/parent/ParentHomeScreen';
import TeacherHomeScreen from '@/features/home/teacher/TeacherHomeScreen';
import { BottomTabParamList } from '@/types/navigation';
import { FontAwesome5 } from '@expo/vector-icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {COLORS} from '@/constants/colors'; 
import CustomTabButton from '@/components/CustomTabButton';
import { useAuth } from '@/features/auth/context/AuthContext'; 
import SettingScreen from '@/features/setting/SettingScreen';

const Tab = createBottomTabNavigator<BottomTabParamList>();

const BottomTabNavigator = () => {
  const { getUserRole } = useAuth();
  const userRole = getUserRole();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarButton: (props) => <CustomTabButton {...props} />,
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
            case 'Academic':
              return <MaterialIcons name="menu-book" size={size} color={color} />  
            case 'Settings':
              return <AntDesign name="setting" size={24} color={color} />   
            default:
              return null;
          }
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={userRole === 'parent' ? ParentHomeScreen : TeacherHomeScreen}
        options={{
          tabBarLabel: 'Home',
        }}
      /> 
      <Tab.Screen
        name="Settings"
        component={SettingScreen}
        options={{
          tabBarLabel: 'Settings',
        }}
      />
      {/* Chèn thêm <Tab.Screen> cho Chat, Settings ở đây */}
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
