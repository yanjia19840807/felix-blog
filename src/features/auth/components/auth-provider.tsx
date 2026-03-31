import PageSpinner from '@/components/page-spinner';
import { useFetchMe } from '@/features/user/api/use-fetch-me';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

interface AuthContextType {
  accessToken: string | null;
  user: any;
  updateAccessToken: (token: string) => Promise<void>;
  clearAccessToken: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within a AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: any) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isTokenLoaded, setIsTokenLoaded] = useState(false);
  const { isLoading, isError, data } = useFetchMe(accessToken, isTokenLoaded);

  const updateAccessToken = useCallback(async (token) => {
    await AsyncStorage.setItem('accessToken', token);
    setAccessToken(token);
  }, []);

  const clearAccessToken = useCallback(async () => {
    await AsyncStorage.removeItem('accessToken');
    setAccessToken(null);
  }, []);

  useEffect(() => {
    if (isError) {
      clearAccessToken();
    }
  }, [isError, clearAccessToken]);

  useEffect(() => {
    const loadToken = async () => {
      const token = await AsyncStorage.getItem('accessToken');
      setAccessToken(token);
      setIsTokenLoaded(true);
    };

    loadToken();
  }, []);

  const value = useMemo(() => {
    return {
      accessToken,
      user: data,
      updateAccessToken,
      clearAccessToken,
    };
  }, [accessToken, data, clearAccessToken, updateAccessToken]);

  if (!isTokenLoaded || isLoading) {
    return <PageSpinner />;
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
