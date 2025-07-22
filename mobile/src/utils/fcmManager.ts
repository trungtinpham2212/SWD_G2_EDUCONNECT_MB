import messaging from '@react-native-firebase/messaging'; 
import { saveToken,deviceApi, getStoredToken}  from '@/api';
import DeviceInfo from 'react-native-device-info';


export const listenToFCMTokenChange = (userId: number) => { 
    return messaging().onTokenRefresh(async (newToken) => {
      const saved = await getStoredToken(); 
        console.log('2221')

      const uniqueId = await DeviceInfo.getUniqueId();
  
      if (newToken !== saved && userId) {
        await deviceApi.refreshFcmToken({
          userId,
          token: newToken,
          uniqueId
        });
        console.log("tokenmessaing:" , newToken);
        await saveToken(newToken);
      }
    });
  };