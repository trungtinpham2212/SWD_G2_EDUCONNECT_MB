import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import Config from 'react-native-config';
import {getToken} from '@/features/auth/storage/authStorage';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: Config.API_BASE_URL,  
  timeout: 10000,  
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
    const token = await getToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Xử lý lỗi 401 (Unauthorized)
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
