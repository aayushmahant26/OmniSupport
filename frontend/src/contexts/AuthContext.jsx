/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(undefined);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('accessToken'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const logout = useCallback(() => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setToken(null);
    setUser(null);
    setError(null);
  }, []);

  const refreshProfile = useCallback(async () => {
    try {
      const profile = await authApi.getProfile();
      setUser(profile);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch profile', err);
      logout();
    }
  }, [logout]);

  // Load profile if token exists on boot
  useEffect(() => {
    const initializeAuth = async () => {
      const savedToken = localStorage.getItem('accessToken');
      if (savedToken) {
        setToken(savedToken);
        await refreshProfile();
      } else {
        setToken(null);
        setUser(null);
      }
      setLoading(false);
    };

    initializeAuth();
  }, [refreshProfile]);

  // Listen for custom logout events dispatched by Axios interceptor on 401s
  useEffect(() => {
    const handleLogoutEvent = () => {
      logout();
    };

    window.addEventListener('auth-logout', handleLogoutEvent);
    return () => {
      window.removeEventListener('auth-logout', handleLogoutEvent);
    };
  }, [logout]);

  const login = async (email, password) => {
    setError(null);
    try {
      const tokenData = await authApi.login({ email, password });
      localStorage.setItem('accessToken', tokenData.access);
      localStorage.setItem('refreshToken', tokenData.refresh);
      setToken(tokenData.access);
      
      // Fetch user profile immediately
      const profile = await authApi.getProfile();
      setUser(profile);
    } catch (err) {
      const errMsg = err.response?.data?.detail || 'Login failed. Please check credentials.';
      logout();
      setError(errMsg);
      throw new Error(errMsg, { cause: err });
    }
  };

  const register = async (email, password, role) => {
    setError(null);
    try {
      await authApi.register({ email, password, role });
      // Login automatically after registration
      await login(email, password);
    } catch (err) {
      // Handle array or object error messages from Django Rest Framework
      let errMsg = 'Registration failed.';
      if (err.response?.data) {
        const data = err.response.data;
        if (typeof data === 'object') {
          errMsg = Object.entries(data)
            .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(' ') : val}`)
            .join(' | ');
        } else if (typeof data === 'string') {
          errMsg = data;
        }
      }
      setError(errMsg);
      throw new Error(errMsg, { cause: err });
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        loading,
        error,
        login,
        register,
        logout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
