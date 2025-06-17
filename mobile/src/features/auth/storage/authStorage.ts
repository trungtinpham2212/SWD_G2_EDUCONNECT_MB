import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserData } from '@/api';
// Key for storing the token in AsyncStorage
const TOKEN_KEY = 'userToken';
const USER_DATA_KEY = 'userData'; 
 
export const storeToken = async (token: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(TOKEN_KEY, token);
  } catch (error) {
    throw new Error(`Failed to store token: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Get token from AsyncStorage
export const getToken = async (): Promise<string | null> => {
  try {
    return await AsyncStorage.getItem(TOKEN_KEY);
  } catch (error) {
    throw new Error(`Failed to retrieve token: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Remove token from AsyncStorage
export const removeToken = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(TOKEN_KEY);
  } catch (error) {
    throw new Error(`Failed to remove token: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Store user data
export const storeUserData = async (userData: UserData): Promise<void> => {
  try {
    await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
  } catch (error) {
    throw new Error(`Failed to store user data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Get user data
export const getUserData = async (): Promise<UserData | null> => {
  try {
    const data = await AsyncStorage.getItem(USER_DATA_KEY);
    return data ? JSON.parse(data) : null;
  } catch (error) {
    throw new Error(`Failed to retrieve user data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Remove user data
export const removeUserData = async (): Promise<void> => {
  try {
    await AsyncStorage.removeItem(USER_DATA_KEY);
  } catch (error) {
    throw new Error(`Failed to remove user data: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Check status of authentication
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const token = await getToken();
    return !!token; // return true if token exists, false otherwise
  } catch (error) {
    return false;
  }
};