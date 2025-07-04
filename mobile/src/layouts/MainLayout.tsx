import { useEffect } from "react";
import { Keyboard, StatusBar, StyleSheet, TouchableWithoutFeedback, View, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "react-native-paper";


type MainLayoutProps = {
    children: React.ReactNode;
};

const MainLayout = ({ children }: MainLayoutProps) => {
    const theme = useTheme();

    useEffect(() => {
        if (Platform.OS === 'android') {
            StatusBar.setBackgroundColor(theme.colors.surface || '#000');
        }
        StatusBar.setBarStyle(theme.dark ? 'light-content' : 'dark-content');
    }, [theme]);

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.colors.surface }]}>
                <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
                    {children}
                </View>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};
export default MainLayout;

const styles = StyleSheet.create({
    safeArea: {
        flex: 1
    },
    container: {
        flex: 1,
        // position: 'relative', 
    },

    loadingOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.5)', // mờ nền khi loading
        justifyContent: 'center',
        alignItems: 'center',
    },
});