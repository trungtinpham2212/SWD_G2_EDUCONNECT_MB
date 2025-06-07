import MainLayout from "@/layouts/MainLayout";
import { Alert, Button, StyleSheet, Text, View } from "react-native";
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@/types/navigation';
import { removeToken } from "@/features/auth/storage/authStorage";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { useAuth } from "@/features/auth/context/AuthContext";

type NavigationProp = NativeStackNavigationProp<RootStackParamList>;

const HomeScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp>();
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
            <View style={styles.container}>
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