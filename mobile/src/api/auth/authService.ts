import { FormLoginRequest, LoginResponse, UserInfor } from '@/api/auth/authTypes';
import axiosInstance from '@/api/axiosConfig';
import {authApi} from '@/api/auth/authApi';

// export const loginService = async (data: FormLoginRequest): Promise<LoginResponse> => {
//     try {
//         const response = await axiosInstance.post('/api/user-accounts/login', data); 
         
//         return response.data;
//     } catch (error) {
//         return {
//             message: 'Invalid username or password'
//         };
//     }
// }

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
    }
}
