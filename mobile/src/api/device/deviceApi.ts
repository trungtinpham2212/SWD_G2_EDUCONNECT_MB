import axiosInstance from "@/api/axiosConfig";
import {FcmTokenRequest} from '@/api/device/deviceTypes';
export const deviceApi = {
    refreshFcmToken : async(payload: FcmTokenRequest) => {
        const response = await axiosInstance.put('/api/fcm-tokens',payload); 
        return response.data;
    },
    addFcmToken : async(payload: FcmTokenRequest) => {
        const response = await axiosInstance.post('/api/fcm-tokens',payload); 
        return response.data;
    },
    removeFcmTokenServer : async(payload: FcmTokenRequest) => {
        const response = await axiosInstance.delete('/api/fcm-tokens',{
            data: payload
        }); 
        return response.data;
    }
}
