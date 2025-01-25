// src/contexts/authContext.tsx

import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { useRouter } from 'next/router';
import { loginUser } from '../api/graphql'; // Import your login function

interface AuthContextData {
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextData>({
  isAuthenticated: false,
  loading: true, // Set loading to true by default
  login: async () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true); // Initialize loading to true
  const router = useRouter();

  useEffect(() => {
    // Check authentication status on initial load
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
    }
    // Set loading to false after authentication check
    setLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { token, userId } = await loginUser(email, password);
      localStorage.setItem('token', token);
      localStorage.setItem('userId', userId.toString());
      setIsAuthenticated(true);
      router.push('/home'); // Redirect after successful login
    } catch (error: any) {
      throw new Error('Invalid email or password'); // Pass error to LoginForm
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setIsAuthenticated(false);
    router.push('/'); // Redirect to login page after logout
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};