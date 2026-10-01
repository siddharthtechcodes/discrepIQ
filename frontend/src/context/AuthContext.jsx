import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'discrepiq_auth_session';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to restore auth session:', e);
    }
    // Return null initially if user wants to see Sign In / Sign Up, or provide default auditor
    return null;
  });

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(STORAGE_KEY);
      }
    } catch (e) {
      console.error('Failed to sync auth session:', e);
    }
  }, [user]);

  const login = (userData) => {
    setUser(userData);
  };

  const loginAsGuest = () => {
    const guestUser = {
      name: 'Auditor Siddharth',
      email: 'siddharth@discrepiq.io',
      company: 'Global Accounts Payable Audits India Ltd',
      role: 'Chief Financial Auditor',
      avatar: null,
      isGuest: true,
      signedInAt: new Date().toISOString()
    };
    setUser(guestUser);
    return guestUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const updateUser = (updates) => {
    setUser(prev => prev ? { ...prev, ...updates } : updates);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      login, 
      loginAsGuest, 
      logout,
      updateUser
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
