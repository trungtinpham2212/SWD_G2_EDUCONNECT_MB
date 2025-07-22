import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import Config from 'react-native-config';
import { getToken } from '@/features/auth/storage/authStorage';
import { handleUnauthorized } from '@/utils/authUtils';

const axiosInstance: AxiosInstance = axios.create({
  // baseURL: Config.API_BASE_URL,   
  baseURL: 'https://swd-g2-educonnect-be.onrender.com',
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
  async (error) => {
    if (error.response?.status === 401) {
       await handleUnauthorized();
    }
    if (error.response?.status === 404) {
      // Xử lý lỗi 404: Not Found - Đừng log ra nếu không muốn hiển thị
      console.warn('Resource not found (404)');
      return Promise.resolve({ data: null });
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
