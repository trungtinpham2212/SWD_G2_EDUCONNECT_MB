import { UserInfor, FormLoginRequest, LoginResponse, UpdateProfilePayload, UpdateProfileResponse } from '@/api/auth/authTypes';
import axiosInstance from "@/api/axiosConfig";

export const authApi = {
    login: async (data: FormLoginRequest): Promise<LoginResponse> => {
        const response = await axiosInstance.post('/api/user-accounts/login', data);
        return response.data;
    },
    getUserById: async (userId: number): Promise<UserInfor> => {
        const response = await axiosInstance.get<UserInfor>(`/api/user-accounts/${userId}`);
        return response.data;
    },
    updateUserProfile: async (payload: UpdateProfilePayload) :Promise<UpdateProfileResponse> => {
        const formData = new FormData();
    
        formData.append('Fullname', payload.fullname);
        formData.append('Email', payload.email);
        formData.append('PhoneNumber', payload.phoneNumber);
        formData.append('Address', payload.address);
    
        if (payload.avatarUri) {
            const fileName = payload.avatarUri.split('/').pop() ?? `avatar_${Date.now()}.jpg`;
            const fileType = fileName.split('.').pop() ?? 'jpg';
    
            formData.append('AvatarFile', {
                uri: payload.avatarUri,
                name: fileName,
                type: `image/${fileType}`,
            } as any);
        }
    
        const response = await axiosInstance.put(`/api/user-accounts/${payload.userId}`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
    
        return response.data;
    }    
}