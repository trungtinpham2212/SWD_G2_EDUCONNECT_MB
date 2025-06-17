import React, { createContext, useContext, useState, useEffect } from 'react';
import {isAuthenticated, removeToken, storeToken, storeUserData, getUserData, removeUserData} from '@/features/auth/storage/authStorage';

export type UserRole = 'teacher' | 'parent';

interface AuthState {
  isLoggedIn: boolean;
  isLoading: boolean;
  user: {
    email?: string;
    userName?: string;
    roleId?: number;
    userId?: number;
    teacherId?: number | null;
  } | null;
}

interface AuthContextType {
  authState: AuthState;
  login: (token: string, userData: AuthState['user']) => Promise<void>;
  logout: () => Promise<void>;
  getUserRole: () => UserRole | null;
}

const initialState: AuthState = {
  isLoggedIn: false,
  isLoading: true,
  user: null
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(initialState);

  useEffect(() => { 
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const authenticated = await isAuthenticated();
      if (authenticated) {
        const userData = await getUserData();
        setAuthState(prev => ({
          ...prev,
          isLoggedIn: true,
          isLoading: false,
          user: userData
        }));
      } else {
        setAuthState(prev => ({
          ...prev,
          isLoggedIn: false,
          isLoading: false
        }));
      }
    } catch (error) {
      console.error('Error check auth:', error);
      setAuthState(prev => ({
        ...prev,
        isLoggedIn: false,
        isLoading: false
      }));
    }
  };

  const login = async (token: string, userData: AuthState['user']) => {
    await storeToken(token);
    if (userData) {
      await storeUserData(userData);
    }
    setAuthState(prev => ({
      ...prev,
      isLoggedIn: true,
      user: userData
    }));  
  };

  const logout = async () => {
    await removeToken();
    await removeUserData();
    setAuthState(initialState);
  };

  const getUserRole = (): UserRole | null => {
    if (!authState.user) return null;
    // roleId 2 là teacher, roleId 3 là parent
    return authState.user.roleId === 2 ? 'teacher' : 'parent';
  };

  return (
    <AuthContext.Provider value={{ authState, login, logout, getUserRole }}>
      {children}
    </AuthContext.Provider>
  );
};