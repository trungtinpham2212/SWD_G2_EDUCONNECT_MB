import MainLayout from "@/layouts/MainLayout";
import { Alert, StyleSheet, Text, View, TouchableOpacity, ScrollView, Pressable, Dimensions, Image, Animated, FlatList } from "react-native";
import { useTheme } from "react-native-paper";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { COLORS, SIZES } from "@/constants";
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons'; 
import Octicons from '@expo/vector-icons/Octicons'; 
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { MainStackParamList } from "@/types/navigation";
import { useAuth } from "@/features/auth/context/AuthContext";

const screenWidth = Dimensions.get('window').width;
// const itemWidth = screenWidth - screenWidth * 9 / 100;


const TeacherHomeScreen: React.FC = () => {
    const navigation: NavigationProp<MainStackParamList> = useNavigation();
    const { authState } = useAuth();
    const theme = useTheme();

    // Navigation buttons data
    const navButtons = [
        {
            label: 'Teacher Schedule',
            icon: <MaterialCommunityIcons name="timetable" size={36} color={theme.colors.primary} />, // icon color theme
            screen: 'TeacherSchedule',
        },
        {
            label: 'Homeroom Student',
            icon: <Octicons name="repo" size={36} color={theme.colors.primary} />, // icon color theme
            screen: 'ClassStudent',
        },
        {
            label: 'Report',
            icon: <MaterialCommunityIcons name="folder-information-outline" size={36} color={theme.colors.primary} />, // icon color theme
            screen: 'TeacherReport',
        },
    ];

    return (
        <MainLayout>
            <View style={[styles.container, { backgroundColor: theme.colors.surface }]}> 
                <View style={styles.header}> 
                    <Text style={[styles.welcomeText, { color: theme.colors.onSurface }]}> 
                        Xin chào, {authState.user?.userName || 'Giáo viên'}
                    </Text>
                    <TouchableOpacity
                        style={styles.notificationButton}
                        onPress={() => navigation.navigate('NotificationTest')}
                    >
                        <FontAwesome5 name="bell" size={24} color={theme.colors.primary} />
                    </TouchableOpacity>
                </View>
                {/* Main Content */}
                <View style={styles.mainContent}>
                    <View style={styles.gridRow}>
                        {navButtons.map((btn, idx) => (
                            <TouchableOpacity
                                key={btn.label}
                                style={styles.gridItem}
                                activeOpacity={0.85}
                                onPress={() => navigation.navigate(btn.screen as any)}
                            >
                                <View style={[styles.card, { backgroundColor: theme.colors.background, shadowColor: theme.colors.primary+'55' }]}> 
                                    <View style={styles.iconWrapper}>{btn.icon}</View>
                                    <Text style={[styles.cardLabel, { color: theme.colors.onSurface }]}>{btn.label}</Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </View>
        </MainLayout>
    );
};

export default TeacherHomeScreen;

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
        paddingVertical: 18,
        borderBottomWidth: 1.5,
        borderBottomColor: '#e0e0e0',
        marginBottom: 8,
    },
    welcomeText: {
        fontSize: 22,
        fontWeight: '700',
        letterSpacing: 0.2,
    },
    notificationButton: {
        padding: 8,
        borderRadius: 20,
        backgroundColor: 'transparent',
    },
    mainContent: {
        flex: 1,
        marginHorizontal: SIZES.DISTANCE_MAIN_POSITIVE,
        marginTop: 16,
    },
    gridRow: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    gridItem: {
        width: '48%',
        marginBottom: 18,
    },
    card: {
        borderRadius: 16,
        paddingVertical: 32,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.13,
        shadowRadius: 8,
        elevation: 4,
        backgroundColor: '#fff',
    },
    iconWrapper: {
        marginBottom: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardLabel: {
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
        letterSpacing: 0.1,
    },
});