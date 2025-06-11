import { useAuth } from "@/features/auth/context/AuthContext";
import MainLayout from "@/layouts/MainLayout";
import { FC, useContext, useState } from "react";
import { Alert, Image, StyleSheet, Switch, Text, TouchableOpacity, View } from "react-native";
import { Appbar, Button, Dialog, Paragraph, Portal, useTheme } from "react-native-paper";
import { SIZES } from "@/constants";
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Feather } from '@expo/vector-icons';

import { ThemeContext } from '@/context/ThemeContext';


const SettingScreen: FC = () => {
    const theme = useTheme();
    const { logout } = useAuth();
    const { isDarkTheme, toggleTheme } = useContext(ThemeContext);
    const [dialogVisible, setDialogVisible] = useState(false);
    const showDialog = () => setDialogVisible(true);
    const hideDialog = () => setDialogVisible(false);
    const handleLogout = async () => {
        try {
            await logout(); // Tự động chuyển về AuthStack
            // Không cần navigation.reset!
        } catch (error) {
            Alert.alert('Lỗi', 'Không thể đăng xuất');
        }
    };
    const confirmLogout = () => {
        handleLogout();
        hideDialog();
    };
    return (
        <MainLayout>
            <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
                <View style={styles.header}>
                    <Text style={[styles.welcomeText, { color: theme.colors.onSurface }]}>
                        Settings
                    </Text>
                </View>
                {/* Main Content */}
                <View style={styles.mainContent}>
                    <View style={styles.profileContainer}>
                        <Image style={styles.profileAvatar} source={{ uri: 'https://i.pinimg.com/564x/32/25/b1/3225b1ec8c0064fba95d2d84faa79626.jpg' }} />
                        <View>
                            <Text style={[styles.profileName, { color: theme.colors.onSurface }]}>Dao Ngoc Bui</Text>
                        </View>
                    </View>
                    <View style={{ marginBottom: 15 }}>
                        <Text style={{ color: '#999999' }}>
                            Account Settings
                        </Text>
                    </View>
                    <View style={styles.settingContainer}>
                        <View style={styles.settingItem}>
                            <TouchableOpacity style={styles.btnGotoDetetail} onPress={() => alert('hello')}>
                                <View style={styles.settingItemFront}>
                                    <Feather name="user" size={24} color={theme.colors.onSurface} style={{ marginRight: 15 }} />
                                    <Text style={[styles.settingName, { color: theme.colors.onSurface }]}>Edit Profile</Text>
                                </View>
                                <MaterialIcons name="keyboard-arrow-right" size={24} color={theme.colors.onSurface} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.settingItem}>
                            <View style={styles.btnModeTheme}>
                                {isDarkTheme ?
                                    <View style={[styles.settingItemFront]}>
                                        <Feather name="moon" size={24} color="white" style={{ marginRight: 15 }} />
                                        <Text style={[styles.settingName, { color: theme.colors.onSurface }]}>Dark mode</Text>

                                    </View> :
                                    <View style={[styles.settingItemFront]}>
                                        <Feather name="sun" size={24} color="black" style={{ marginRight: 15 }} />
                                        <Text style={[styles.settingName, { color: theme.colors.onSurface }]}>Light mode</Text>
                                    </View>}


                                <View style={styles.themeToggleContainer}>
                                    <Switch
                                        value={isDarkTheme}
                                        onValueChange={toggleTheme}
                                        thumbColor={isDarkTheme ? '#fff' : theme.colors.primary}
                                        trackColor={{ false: '#767577', true: theme.colors.primary }}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={styles.settingItem}>
                            <TouchableOpacity style={styles.btnGotoDetetail} onPress={showDialog}>
                                <View style={styles.settingItemFront}>
                                    <MaterialIcons name="logout" size={24} color={theme.colors.onSurface} style={{ marginRight: 15 }} />
                                    <Text style={[styles.settingName, { color: theme.colors.onSurface }]}>Logout</Text>
                                </View>
                                <MaterialIcons name="keyboard-arrow-right" size={24} color={theme.colors.onSurface} />
                            </TouchableOpacity>
                        </View>
                    </View>
                    <Portal>
                        <Dialog visible={dialogVisible} onDismiss={hideDialog}>
                            <Dialog.Title>Confirm Logout</Dialog.Title>
                            <Dialog.Content>
                                <Text>This is a paragraph of text.</Text>
                            </Dialog.Content>
                            <Dialog.Actions>
                                <Button onPress={hideDialog}>Cancel</Button>
                                <Button onPress={confirmLogout} mode="contained">Confirm</Button>
                            </Dialog.Actions>
                        </Dialog>
                    </Portal>
                </View>
            </View>
        </MainLayout>
    )
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
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
        padding: 8,
    },
    mainContent: {
        marginHorizontal: SIZES.DISTANCE_MAIN_POSITIVE,
    },
    mainText: {
        fontSize: 20,
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 8,
        paddingVertical: 15
    },
    profileAvatar: {
        width: 60,
        height: 60,
        borderRadius: 50,

         // iOS shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 5,

        // Android shadow
        elevation: 10,

        // Optional background color to enhance shadow visibility
        backgroundColor: '#fff',
    },
    profileName: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    settingContainer: {

    },
    settingItem: {
    },
    btnGotoDetetail: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderColor: "#959595"
    },
    settingItemFront: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    settingName: {
        fontSize: 18,
    },
    themeToggleContainer: {
        padding: 0,
        margin: 0
    },
    btnModeTheme: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: "#959595",
        paddingVertical: 4,
        borderBottomWidth: 1,
    }
});

export default SettingScreen;