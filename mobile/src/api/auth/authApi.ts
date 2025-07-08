import{UserInfor, FormLoginRequest, LoginResponse} from '@/api/auth/authTypes';
import axiosInstance from "@/api/axiosConfig";

export const authApi = {
    login : async (data: FormLoginRequest): Promise<LoginResponse> => {
        const response = await axiosInstance.post('/api/user-accounts/login', data);
        return response.data;
    },
    getUserById: async (userId: number) : Promise<UserInfor> =>{
        const response =await axiosInstance.get<UserInfor>(`/api/user-accounts/${userId}`);
        return response.data;
    }
}