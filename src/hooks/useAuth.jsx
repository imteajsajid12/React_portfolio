import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import authService from '../services/authService';

// Auth Context
const AuthContext = createContext();

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [authError, setAuthError] = useState(null);

  const checkAuthStatus = useCallback(async () => {
    try {
      setLoading(true);
      setAuthError(null);
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);

      if (currentUser) {
        const adminStatus = await authService.isAdmin();
        setIsAdmin(adminStatus);
      } else {
        setIsAdmin(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setAuthError(error.message);
      setUser(null);
      setIsAdmin(false);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Only check auth status if no critical error
    if (!authError || !authError.includes('configuration')) {
      checkAuthStatus();
    } else {
      setLoading(false);
    }
  }, [checkAuthStatus, authError]);

  const login = async (email, password) => {
    try {
      const session = await authService.login(email, password);
      await checkAuthStatus(); // Refresh user data
      return session;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setIsAdmin(false);
    } catch (error) {
      console.error('Logout failed:', error);
      throw error;
    }
  };

  const register = async (email, password, name) => {
    try {
      const session = await authService.createAccount(email, password, name);
      await checkAuthStatus(); // Refresh user data
      return session;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  };

  const value = {
    user,
    loading,
    isAdmin,
    authError,
    login,
    logout,
    register,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Hook for authentication operations
export const useAuthOperations = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const updateProfile = async (data) => {
    try {
      setLoading(true);
      setError(null);
      
      const promises = [];
      
      if (data.name) {
        promises.push(authService.updateName(data.name));
      }
      
      if (data.email && data.password) {
        promises.push(authService.updateEmail(data.email, data.password));
      }
      
      if (data.newPassword && data.oldPassword) {
        promises.push(authService.updatePassword(data.newPassword, data.oldPassword));
      }
      
      const results = await Promise.all(promises);
      return results;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updatePreferences = async (preferences) => {
    try {
      setLoading(true);
      setError(null);
      const result = await authService.updatePreferences(preferences);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getPreferences = async () => {
    try {
      setLoading(true);
      setError(null);
      const preferences = await authService.getPreferences();
      return preferences;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createPasswordRecovery = async (email, url) => {
    try {
      setLoading(true);
      setError(null);
      const result = await authService.createRecovery(email, url);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const completePasswordRecovery = async (userId, secret, password, passwordAgain) => {
    try {
      setLoading(true);
      setError(null);
      const result = await authService.updateRecovery(userId, secret, password, passwordAgain);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createEmailVerification = async (url) => {
    try {
      setLoading(true);
      setError(null);
      const result = await authService.createVerification(url);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const completeEmailVerification = async (userId, secret) => {
    try {
      setLoading(true);
      setError(null);
      const result = await authService.updateVerification(userId, secret);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const sessions = await authService.getSessions();
      return sessions;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteSession = async (sessionId) => {
    try {
      setLoading(true);
      setError(null);
      const result = await authService.deleteSession(sessionId);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteAllSessions = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await authService.deleteAllSessions();
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    updateProfile,
    updatePreferences,
    getPreferences,
    createPasswordRecovery,
    completePasswordRecovery,
    createEmailVerification,
    completeEmailVerification,
    getSessions,
    deleteSession,
    deleteAllSessions
  };
};

// Hook for admin operations
export const useAdminAuth = () => {
  const { isAdmin } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const setAdminStatus = async (userId, isAdminStatus) => {
    try {
      if (!isAdmin) {
        throw new Error('Unauthorized: Admin access required');
      }
      
      setLoading(true);
      setError(null);
      const result = await authService.setAdminStatus(isAdminStatus);
      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const checkAdminStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      const adminStatus = await authService.isAdmin();
      return adminStatus;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    isAdmin,
    loading,
    error,
    setAdminStatus,
    checkAdminStatus
  };
};
