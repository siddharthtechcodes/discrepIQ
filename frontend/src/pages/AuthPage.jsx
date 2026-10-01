import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  Building2, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Layers, 
  KeyRound,
  Eye,
  EyeOff,
  Sparkles,
  Zap
} from 'lucide-react';

export default function AuthPage({ onLogin, onBackToWorkspace }) {
  const [mode, setMode] = useState('signin'); // 'signin' | 'signup'
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide all required credentials.');
      return;
    }

    if (mode === 'signup' && (!fullName || !company)) {
      setError('Please provide your name and company entity.');
      return;
    }

    // Process login or registration
    const user = {
      name: mode === 'signup' ? fullName : (email.split('@')[0] || 'Senior Auditor'),
      email: email,
      company: mode === 'signup' ? company : 'Enterprise Financial Audits',
      role: 'Lead AP Auditor',
      avatarUrl: null,
      signedInAt: new Date().toISOString()
    };

    onLogin(user);
  };

  const handleQuickDemo = (role = 'lead') => {
    const demoUser = {
      name: 'Siddharth Auditor',
      email: 'siddharth@discrepiq.internal',
      company: 'Global FinTech Audits India Pvt Ltd',
      role: 'Chief AP Auditor',
      avatarUrl: null,
      signedInAt: new Date().toISOString()
    };
    onLogin(demoUser);
  };

  return (
    <div className="min-h-[calc(100vh-120px)] flex flex-col justify-center items-center py-10 px-4">
      
      {/* Brand Context Header */}
      <div className="text-center mb-8 max-w-sm">
        <div className="inline-flex items-center justify-center w-10 h-10 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-100 shadow-sm mb-3">
          <Layers className="w-5 h-5 text-zinc-200" />
        </div>
        <h1 className="text-xl font-bold tracking-tight text-zinc-100">
          DiscrepIQ Identity &amp; Access
        </h1>
        <p className="text-xs text-zinc-500 mt-1 font-mono">
          Cryptographically authenticated Accounts Payable reconciliation platform
        </p>
      </div>

      {/* Main Authentication Card */}
      <div className="w-full max-w-md bg-zinc-900/80 border border-zinc-800 rounded-xl shadow-2xl backdrop-blur-md overflow-hidden">
        
        {/* Sign In / Sign Up Mode Switcher */}
        <div className="grid grid-cols-2 border-b border-zinc-800 text-xs font-medium">
          <button
            onClick={() => { setMode('signin'); setError(''); }}
            className={`py-3 text-center transition-all ${
              mode === 'signin'
                ? 'bg-zinc-800/80 text-zinc-100 font-semibold border-b-2 border-zinc-200'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode('signup'); setError(''); }}
            className={`py-3 text-center transition-all ${
              mode === 'signup'
                ? 'bg-zinc-800/80 text-zinc-100 font-semibold border-b-2 border-zinc-200'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/40'
            }`}
          >
            Create Account
          </button>
        </div>

        <div className="p-6 space-y-5">
          
          {/* One-Click Demo Access Banner */}
          <div className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <div>
                <p className="text-xs font-medium text-zinc-200">Instant Auditor Demo</p>
                <p className="text-[10px] text-zinc-500 font-mono">Bypass credentials for test session</p>
              </div>
            </div>
            <button
              onClick={() => handleQuickDemo()}
              type="button"
              className="px-2.5 py-1.5 rounded bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-mono font-medium transition-colors border border-zinc-700 hover:border-zinc-600 flex items-center gap-1.5 shadow-xs"
            >
              <Zap className="w-3 h-3 text-amber-400" />
              <span>Demo Login</span>
            </button>
          </div>

          {/* Error Notice */}
          {error && (
            <div className="p-2.5 rounded bg-rose-950/40 border border-rose-900/60 text-rose-300 text-xs font-mono">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name & Company (Only in Sign Up Mode) */}
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ananya Sharma"
                      required
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-500 rounded px-3 py-2 pl-9 text-xs text-zinc-100 placeholder:text-zinc-600 font-sans outline-hidden transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                    Company / Entity Name
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Axis Financial Services Ltd"
                      required
                      className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-500 rounded px-3 py-2 pl-9 text-xs text-zinc-100 placeholder:text-zinc-600 font-sans outline-hidden transition-colors"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Email Address */}
            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="auditor@enterprise.in"
                  required
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-500 rounded px-3 py-2 pl-9 text-xs text-zinc-100 placeholder:text-zinc-600 font-sans outline-hidden transition-colors"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono text-zinc-400">
                  Password
                </label>
                {mode === 'signin' && (
                  <button
                    type="button"
                    onClick={() => alert('Password recovery reset token dispatched to provided email address.')}
                    className="text-[11px] text-zinc-500 hover:text-zinc-300 font-mono transition-colors"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-500 absolute left-3 top-2.5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-500 rounded px-3 py-2 pl-9 pr-9 text-xs text-zinc-100 placeholder:text-zinc-600 font-mono outline-hidden transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-zinc-500 hover:text-zinc-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Checkbox Options */}
            <div className="flex items-center justify-between pt-1 text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-zinc-400 select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-zinc-700 bg-zinc-950 text-zinc-100 focus:ring-0"
                />
                <span className="text-[11px] font-mono">Remember this workstation</span>
              </label>

              <span className="text-[11px] font-mono text-zinc-500 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                256-bit TLS
              </span>
            </div>

            {/* Primary Submit Button */}
            <button
              type="submit"
              className="w-full py-2.5 rounded bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold tracking-wide transition-all shadow-sm flex items-center justify-center gap-2 mt-2"
            >
              <span>{mode === 'signin' ? 'Sign In to Workspace' : 'Complete Registration'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

          </form>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-mono">
              <span className="bg-zinc-900 px-2 text-zinc-500">Corporate Single Sign-On</span>
            </div>
          </div>

          {/* SSO Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleQuickDemo()}
              type="button"
              className="px-3 py-2 rounded bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-300 transition-colors flex items-center justify-center gap-2"
            >
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"/>
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"/>
                <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.5.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2c0 2.8.7 5.4 1.9 7.8l3.7-2.9z"/>
                <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.9C3.7 20.6 7.5 23.5 12 23.5z"/>
              </svg>
              <span>Google SSO</span>
            </button>

            <button
              onClick={() => handleQuickDemo()}
              type="button"
              className="px-3 py-2 rounded bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-xs text-zinc-300 transition-colors flex items-center justify-center gap-2"
            >
              <KeyRound className="w-3.5 h-3.5 text-zinc-400" />
              <span>SAML / Okta</span>
            </button>
          </div>

        </div>

        {/* Footer info */}
        <div className="bg-zinc-950/60 px-6 py-3 border-t border-zinc-800 text-[11px] text-zinc-500 font-mono flex items-center justify-between">
          <span>Enterprise AP Engine v2.4</span>
          <button
            onClick={onBackToWorkspace}
            className="text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            ← Return to Workspace
          </button>
        </div>

      </div>

    </div>
  );
}
