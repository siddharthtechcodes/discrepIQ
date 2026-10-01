import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const STORAGE_KEY = 'discrepiq_auth_session';

export const PRESET_ACCOUNTS = [
  {
    id: 'acc-siddharth',
    name: 'Siddharth R.',
    email: 'siddharth@discrepiq.io',
    company: 'DiscrepIQ Financial Technologies India Ltd',
    role: 'Chief Accounts Payable Auditor',
    badge: 'Enterprise Administrator',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    gstin: 'GSTIN-29AAACE4910M1ZU',
    plan: 'Enterprise Pro v2.5',
    verifiedAudits: 284,
    mathAccuracy: '99.94%',
    securityClearance: 'Level 4 (Full Clearance)',
    provider: 'local',
    signedInAt: '2026-10-01T10:00:00Z'
  },
  {
    id: 'acc-ananya',
    name: 'Ananya Sharma',
    email: 'ananya.sharma@deloitte-global.in',
    company: 'Deloitte AP Forensic Audits LLP',
    role: 'Senior Indian GST Compliance Specialist',
    badge: 'Lead Tax Auditor',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
    gstin: 'GSTIN-27AAATB4912J1ZR',
    plan: 'Tax Partner Audit Cloud',
    verifiedAudits: 642,
    mathAccuracy: '99.98%',
    securityClearance: 'Level 3 (Forensic Lead)',
    provider: 'google',
    signedInAt: '2026-10-01T09:30:00Z'
  },
  {
    id: 'acc-marcus',
    name: 'Marcus Vance',
    email: 'm.vance@apexfinancial.com',
    company: 'Apex Global Financial Controllership',
    role: 'VP Corporate Controller & Risk Shield',
    badge: 'Executive Approver',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    gstin: 'GSTIN-07AABCT3421K1ZZ',
    plan: 'Executive Tier Alpha',
    verifiedAudits: 1190,
    mathAccuracy: '100.0%',
    securityClearance: 'Level 5 (Executive VP)',
    provider: 'github',
    signedInAt: '2026-10-01T08:15:00Z'
  },
  {
    id: 'acc-judge',
    name: 'Hackathon Evaluator',
    email: 'evaluator.judge@hackathon-demo.io',
    company: 'FinTech AI Innovation Jury 2026',
    role: 'Chief Hackathon Technical Judge',
    badge: '1-Click Evaluator',
    avatar: null,
    gstin: 'GSTIN-DEMO-JUDGE-2026',
    plan: 'Full Hackathon Access All-Features',
    verifiedAudits: 4,
    mathAccuracy: '100.0%',
    securityClearance: 'Full Administrative Bypass',
    provider: 'guest',
    signedInAt: new Date().toISOString()
  }
];

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Failed to restore auth session:', e);
    }
    // Default to Siddharth enterprise auditor so user has rich account data immediately
    return PRESET_ACCOUNTS[0];
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

  const switchAccount = (accountId) => {
    const target = PRESET_ACCOUNTS.find(a => a.id === accountId);
    if (target) {
      setUser(target);
      return target;
    }
    return user;
  };

  const loginAsGuest = () => {
    const judge = PRESET_ACCOUNTS[3];
    setUser(judge);
    return judge;
  };

  const loginWithGoogle = (isSignUp = false) => {
    const googleUser = {
      ...PRESET_ACCOUNTS[1],
      name: isSignUp ? 'Google Auditor (New User)' : 'Google Auditor',
      email: 'auditor.google@discrepiq.io',
      provider: 'google',
      signedInAt: new Date().toISOString()
    };
    setUser(googleUser);
    return googleUser;
  };

  const loginWithGitHub = (isSignUp = false) => {
    const githubUser = {
      ...PRESET_ACCOUNTS[2],
      name: isSignUp ? 'GitHub Auditor (New User)' : 'GitHub Engineer Auditor',
      email: 'auditor.github@discrepiq.io',
      provider: 'github',
      signedInAt: new Date().toISOString()
    };
    setUser(githubUser);
    return githubUser;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  };

  const updateUser = (updates) => {
    setUser(prev => (prev ? { ...prev, ...updates } : updates));
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      presetAccounts: PRESET_ACCOUNTS,
      switchAccount,
      login, 
      loginAsGuest, 
      loginWithGoogle,
      loginWithGitHub,
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
