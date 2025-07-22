import AsyncStorage from '@react-native-async-storage/async-storage';
import { deviceApi } from '@/api/device/deviceApi';
import DeviceInfo from 'react-native-device-info';
import { getMessaging, requestPermission, getToken } from '@react-native-firebase/messaging';
import { useAuth } from '@/features/auth/context/AuthContext';
import { FcmTokenRequest } from '@/api/device/deviceTypes';




const FCM_TOKEN_STORAGE_KEY = 'FCM_TOKEN';
export const getStoredToken = async (): Promise<string | null> => {
    return await AsyncStorage.getItem(FCM_TOKEN_STORAGE_KEY);
};

export const saveToken = async (token: string) => {
    await AsyncStorage.setItem(FCM_TOKEN_STORAGE_KEY, token);
};

export const removeToken = async () => {
    await AsyncStorage.removeItem(FCM_TOKEN_STORAGE_KEY);
};

export const syncAndSendToken = async (userId: number) => {
    try {
        const messaging = getMessaging();
        const authStatus = await requestPermission(messaging);
        let fcmToken = null;
        if (authStatus === 1 || authStatus === 2) {
            const messaging = getMessaging();
            fcmToken = await getToken(messaging);       
            const saved = await getStoredToken();
            
            const uniqueId = await DeviceInfo.getUniqueId();
            if (userId) { 
                const payload: FcmTokenRequest = {
                    userId,
                    token: fcmToken,
                    uniqueId
                };
                if (fcmToken !== saved) {
                    await deviceApi.refreshFcmToken(payload);
                    await saveToken(fcmToken);
                }
            }
        } else {
            console.log('Quyền thông báo bị từ chối');
        }



    } catch (err) {

    }
};


export const createAndSendToken = async (userId: number) => {
    try {
        const messaging = getMessaging();
        const authStatus = await requestPermission(messaging);
        let fcmToken = null;
        if (authStatus === 1 || authStatus === 2) {
            const messaging = getMessaging();
            fcmToken = await getToken(messaging);
            const saved = await getStoredToken();
            const uniqueId = await DeviceInfo.getUniqueId();

            if (userId) {
                const payload: FcmTokenRequest = {
                    userId,
                    token: fcmToken,
                    uniqueId
                };
                if (fcmToken !== saved) {
                    await deviceApi.addFcmToken(payload);
                    await saveToken(fcmToken);
                }
            }
        } else {
            console.log('Quyền thông báo bị từ chối');
        } 
    } catch (err) {

    }
};

export const logoutFCMCleanup = async (userId: number) => {
    try {
        const token = await getStoredToken(); // FCM token đã lưu local
        const uniqueId = await DeviceInfo.getUniqueId();
        console.log('logout ');

        if (token && userId) {
            await deviceApi.removeFcmTokenServer({ userId, token, uniqueId });
        }

        await removeToken(); // Xóa local token để không sync nhầm sau này
    } catch (err) {
        console.log('FCM cleanup on logout failed', err);
    }
};