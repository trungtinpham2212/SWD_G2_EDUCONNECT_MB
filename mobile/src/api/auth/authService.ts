import { FormLoginRequest, LoginResponse } from '@/api/auth/authTypes';
import axiosInstance from '@/api/axiosConfig';

export const loginService = async (data: FormLoginRequest): Promise<LoginResponse> => {
    try {
        const response = await axiosInstance.post('/api/user-accounts/login', data); 
         
        return response.data;
    } catch (error) {
        return {
            message: 'Invalid username or password'
        };
    }
}
