import AsyncStorage from '@react-native-async-storage/async-storage';

// Key for storing the token in AsyncStorage
const TOKEN_KEY = 'userToken';

// Lưu token vào AsyncStorage
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

// Check status of authentication
export const isAuthenticated = async (): Promise<boolean> => {
  try {
    const token = await getToken();
    return !!token; // return true if token exists, false otherwise
  } catch (error) {
    return false;
  }
};