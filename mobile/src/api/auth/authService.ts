import { FormLoginRequest, LoginResponse } from '@/api/auth/authTypes';
import axiosInstance from '@/api/axiosConfig';


export const loginService = async(data:FormLoginRequest): Promise<LoginResponse> =>{
    // const response = await axiosInstance.post('/auth/login', data);
    if(data.username === 'admin' && data.password === '@a'){
        const kwt = 'tooooken';
        const res: LoginResponse = {
            success: true,
            data: {
                token: kwt,
                userId: '12345',
                roleId: 1
            }
        }
        return res;
    }else{
        return {
            success: false,
            message: 'Invalid username or password'
        };
    }
         
}
