import { Text, View,Linking, ActivityIndicator  } from "react-native"; 
import { use, useEffect, useState } from "react";
// import messaging from '@react-native-firebase/messaging';  
import DeviceInfo from 'react-native-device-info';
import { getMessaging, requestPermission, getToken } from '@react-native-firebase/messaging';

const NotificationTest: React.FC = () => {
  useEffect(() => {
    const fetchDataAndSendToBackend = async () => {
      try {
        const messaging = getMessaging();
        // 1. Xin quyền thông báo
        const authStatus = await requestPermission(messaging);
        let fcmToken = null;
        if (authStatus === 1 || authStatus === 2) {
          const messaging = getMessaging();
          fcmToken = await getToken(messaging);
          console.log('FCM Token:', fcmToken);
        } else {
          console.log('Quyền thông báo bị từ chối');
        }

        // 2. Lấy thông tin thiết bị
        const uniqueId = await DeviceInfo.getUniqueId();
        const deviceId = await DeviceInfo.getDeviceId();
        console.log('UniqueId:', uniqueId);
        console.log('DeviceId:', deviceId); 
      } catch (error) {
        console.error('Lỗi:', error);
      }
    };

    fetchDataAndSendToBackend();
  }, []);

    return(
        <View>
            <Text>Hello</Text>
        </View>
    )
}

export default NotificationTest;