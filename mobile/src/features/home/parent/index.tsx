import MainLayout from "@/layouts/MainLayout";
import { Alert, Button, StyleSheet, Text, View, TouchableOpacity, FlatList, ScrollView, Pressable, Dimensions } from "react-native";
import { useTheme } from "react-native-paper";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { COLORS, SIZES } from "@/constants";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'; 
import Octicons from '@expo/vector-icons/Octicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { MainStackParamList } from "@/types/navigation";
import { useAuth } from "@/features/auth/context/AuthContext";

const screenWidth = Dimensions.get('window').width;
const itemWidth = screenWidth - screenWidth * 9 / 100;


const ParentHomeScreen: React.FC = () => {
    const navigation: NavigationProp<MainStackParamList> = useNavigation();
    const { authState } = useAuth();
    const theme = useTheme();

    const navButtons = [
        {
            label: 'Chat With AI',
            icon: <MaterialIcons name="chat-bubble-outline" size={36} color='#333' />,
            screen: 'Chatbot',
        },
        {
            label: 'Schedule',
            icon: <MaterialCommunityIcons name="timetable" size={36} color='#333' />,
            screen: 'ParentSchedule',
        },
        {
            label: 'Report',
            icon: <Octicons name="repo" size={36} color='#333' style={{paddingRight:6}} />,
            screen: 'ParentReport',
        },
        {
            label: 'Teachers',
            icon: <MaterialCommunityIcons name="folder-information-outline" size={36} color='#333' />,
            screen: 'ChildTeachers',
        },
    ];

    return (
        <MainLayout>
            <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
                <View style={styles.header}>
                    <Text style={[styles.welcomeText, { color: theme.colors.onSurface }]}>
                        Hello, {authState.user?.userName || 'User'}
                    </Text>
                    <TouchableOpacity
                        style={styles.notificationButton}
                        onPress={() => navigation.navigate('NotificationTest')}
                    >
                        <FontAwesome5 name="bell" size={24} color={theme.colors.onSurface} />
                    </TouchableOpacity>
                </View>
                {/* Main Content */}
                <ScrollView scrollEnabled={true} showsVerticalScrollIndicator={false}>
                    <View style={styles.mainContent}>
                        <View style={styles.row}>
                            {navButtons.map((button, index) => (
                                <View key={index} style={styles.containBtnNavigation}>
                                    <Pressable
                                        onPress={() => navigation.navigate(button.screen as keyof MainStackParamList)}
                                        style={({ pressed }) => [
                                            styles.button,
                                            {
                                                backgroundColor: pressed ? theme.colors.secondary : COLORS.LIGHT_BLUE_MAIN,
                                            },
                                        ]}
                                    >
                                        <View style={styles.containInsidePress}>
                                            {button.icon}
                                            <Text style={[styles.text]}>{button.label}</Text>
                                        </View>
                                    </Pressable>
                                </View>
                            ))}
                        </View>
                    </View>
                </ScrollView>
            </View>
        </MainLayout>
    );
};

export default ParentHomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: SIZES.DISTANCE_MAIN_POSITIVE,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#a1a1a1',
    },
    welcomeText: {
        fontSize: 22,
        fontWeight: '500',
    },
    notificationButton: {
    },
    mainContent: {
        marginHorizontal: SIZES.DISTANCE_MAIN_POSITIVE
    },
    mainText: {
        fontSize: 20,
    },

    row: {
        marginTop: 8,
    },
    containBtnNavigation: {
        padding: 4,
        width: '100%'
    },
    button: {
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center', 
    },
    containInsidePress: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 30
    }
});