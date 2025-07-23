import { FormLoginRequest, LoginResponse, UpdateProfilePayload, UpdateProfileResponse, UserInfor } from '@/api/auth/authTypes';
import axiosInstance from '@/api/axiosConfig';
import {authApi} from '@/api/auth/authApi'; 

export const authService = {
    login: async (data: FormLoginRequest): Promise<LoginResponse> =>{
        try { 
            return await authApi.login(data);
        } catch (error) {
            return {
                message: 'Invalid username or password'
            };
        }
    },
    getUserById: async (userId: number) : Promise<UserInfor | null> =>{
        try{
            return await authApi.getUserById(userId);
        }catch(err){
            return null;
        }
    },
    updateUserProfile: async (payload: UpdateProfilePayload):Promise<UpdateProfileResponse | null> => {
        try{
            return await authApi.updateUserProfile(payload);
        }catch(err){
            return null;
        }
    }
}
