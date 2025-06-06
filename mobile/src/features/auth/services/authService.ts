import { FormLoginRequest, LoginResponse } from '@/features/auth/types/index';

export const loginService = async(data:FormLoginRequest): Promise<LoginResponse> =>{
    if(data.username === 'admin' && data.password === '@a'){
        const jwt = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImFkbWluIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.FgLPDZNwucp5QaFBkZkt2njGNYslHbbHuR9TGkt4eak';
        const res: LoginResponse = {
            success: true,
            data: {
                token: jwt,
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