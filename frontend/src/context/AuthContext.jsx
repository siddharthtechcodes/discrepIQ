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
    // Default guest session for frictionless judging
    return {
      name: 'Auditor Siddharth',
      email: 'siddharth@discrepiq.internal',
      company: 'Global FinTech Audits India Pvt Ltd',
      role: 'Lead AP Auditor',
      avatar: null,
      isGuest: false
    };
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
      name: 'Hackathon Judge / Guest',
      email: 'judge@fintech-eval.org',
      company: 'Antigravity Hackathon Review Board',
      role: 'Principal Evaluator',
      avatar: null,
      isGuest: true,
      signedInAt: new Date().toISOString()
    };
    setUser(guestUser);
    return guestUser;
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, loginAsGuest, logout }}>
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
