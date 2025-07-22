// features/auth/hooks/useFCMTokenSync.ts
import { useEffect } from 'react'; 
import { syncAndSendToken } from '@/api/device/deviceService';
import { listenToFCMTokenChange } from '@/utils/fcmManager';
import { useAuth } from '@/features/auth/context/AuthContext';

export const useFCMTokenSync = () => {
  const { authState } = useAuth();
  useEffect(() => {
    if (!authState?.user?.userId) return; 

    syncAndSendToken(authState.user.userId);  
    const unsubscribe = listenToFCMTokenChange(authState.user.userId);   
    return () => unsubscribe(); // cleanup khi unmount
  }, [authState?.user?.userId]);
};
