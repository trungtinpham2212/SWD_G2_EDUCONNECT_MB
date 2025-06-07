import MainLayout from "@/layouts/MainLayout";
import { Alert, Button, StyleSheet, Text, View } from "react-native"; 
import { useAuth } from "@/features/auth/context/AuthContext";
import { useTheme } from "react-native-paper";
 

const HomeScreen: React.FC = () => {
      const theme = useTheme(); 
    const { logout } = useAuth();
    const handleLogout = async () => {
    try {
      await logout(); // Tự động chuyển về AuthStack
      // Không cần navigation.reset!
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể đăng xuất');
    }
  };
    return (
        <MainLayout>
            <View style={[styles.container, {backgroundColor: theme.colors.surface}]}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <Text>Settings Screen</Text>
                    <Button title="Logout" onPress={handleLogout} />
                </View>
            </View>
        </MainLayout>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 20,
        color: '#333',
    },
})