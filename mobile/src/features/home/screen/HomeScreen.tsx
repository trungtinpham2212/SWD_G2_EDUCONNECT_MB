import MainLayout from "@/layouts/MainLayout";
import { Alert, Button, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import { useTheme } from "react-native-paper";
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { SIZES } from "@/constants";


const HomeScreen: React.FC = () => {
    const theme = useTheme();
    
    return (
        <MainLayout>
            <View style={[styles.container, { backgroundColor: theme.colors.surface }]}> 
                <View style={styles.header}>
                    <Text style={[styles.welcomeText, { color: theme.colors.onSurface }]}>
                        Hello, Ed
                    </Text>
                    <TouchableOpacity 
                        style={styles.notificationButton}
                        onPress={() => Alert.alert('Notifications', 'No new notifications')}
                    >
                        <FontAwesome5 name="bell" size={24} color={theme.colors.onSurface} /> 
                    </TouchableOpacity>
                </View>
                {/* Main Content */}
                <View style={styles.mainContent}>
                    <Text style={[styles.mainText, { color: theme.colors.onSurface }]}>
                        Home Screen
                    </Text>
                </View>
            </View>
        </MainLayout>
    );
};

export default HomeScreen;

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
});