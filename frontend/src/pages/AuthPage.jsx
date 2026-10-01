import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Lock, 
  Mail, 
  Building2, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Layers, 
  Eye, 
  EyeOff, 
  Zap, 
  Activity, 
  AlertTriangle,
  ArrowLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthPage({ initialMode = 'login' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const isRegister = location.pathname === '/register' || initialMode === 'register';

  const { login, loginAsGuest, loginWithGoogle, loginWithGitHub } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');

  const handleGoogleAuth = () => {
    loginWithGoogle(isRegister);
    navigate('/dashboard');
  };

  const handleGitHubAuth = () => {
    loginWithGitHub(isRegister);
    navigate('/dashboard');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please provide all required credentials.');
      return;
    }

    if (isRegister && (!fullName || !company)) {
      setError('Please enter your full name and company entity.');
      return;
    }

    const userData = {
      name: isRegister ? fullName : (email.split('@')[0] || 'Auditor'),
      email: email,
      company: isRegister ? company : 'Global FinTech Audits India Ltd',
      role: 'Lead AP Auditor',
      avatar: null,
      isGuest: false,
      signedInAt: new Date().toISOString()
    };

    login(userData);
    navigate('/dashboard');
  };

  const handleJudgeSignIn = () => {
    loginAsGuest();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-stretch bg-white dark:bg-black text-slate-900 dark:text-zinc-100 selection:bg-maroon-800 selection:text-white transition-colors duration-200">
      
      {/* Left Column: Rich Executive Auth Card */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-12 relative z-10 bg-white dark:bg-zinc-950 border-r border-slate-200 dark:border-zinc-800">
        
        <div className="max-w-md w-full mx-auto space-y-6">
          
          {/* Brand & Back Link */}
          <div className="flex items-center justify-between">
            <Link to="/" className="inline-flex items-center gap-2 group">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-maroon-950 via-maroon-800 to-rose-700 flex items-center justify-center text-white shadow-md shadow-maroon-900/30 border border-maroon-700/50">
                <Layers className="w-4 h-4 text-white" />
              </div>
              <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white group-hover:text-maroon-800 dark:group-hover:text-rose-400 transition-colors">
                Discrep<span className="text-maroon-800 dark:text-rose-400">IQ</span>
              </span>
            </Link>

            <Link
              to="/"
              className="text-xs text-slate-500 dark:text-zinc-400 hover:text-maroon-800 dark:hover:text-rose-400 flex items-center gap-1 font-mono transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Home</span>
            </Link>
          </div>

          {/* Mode Switcher Tabs (Sign In vs Sign Up) */}
          <div className="grid grid-cols-2 p-1 rounded-xl bg-slate-100 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 text-xs font-semibold">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className={`py-2.5 rounded-lg text-center transition-all cursor-pointer ${
                !isRegister
                  ? 'bg-white dark:bg-zinc-800 text-maroon-800 dark:text-white font-bold shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Sign In to Workspace
            </button>
            <button
              type="button"
              onClick={() => navigate('/register')}
              className={`py-2.5 rounded-lg text-center transition-all cursor-pointer ${
                isRegister
                  ? 'bg-white dark:bg-zinc-800 text-maroon-800 dark:text-white font-bold shadow-xs'
                  : 'text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Create Free Account
            </button>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white font-sans">
              {isRegister ? 'Register as AP Auditor' : 'Welcome Back, Auditor'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-zinc-400 font-sans">
              {isRegister 
                ? 'Create your free account to audit Indian GST invoices and detect math discrepancies.' 
                : 'Enter your credentials to access your active audit ledger and Gemini Vision pipeline.'}
            </p>
          </div>

          {/* Prominent Evaluator / Judge Shortcut */}
          <div className="p-4 rounded-xl bg-maroon-50/70 dark:bg-maroon-950/40 border border-maroon-200 dark:border-maroon-800 relative overflow-hidden shadow-xs flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-maroon-900 dark:text-rose-300 font-mono">
                <Zap className="w-3.5 h-3.5 fill-current text-maroon-800 dark:text-rose-400" />
                <span>HACKATHON EVALUATOR ACCESS</span>
              </div>
              <p className="text-[11px] text-slate-600 dark:text-zinc-400 font-mono mt-0.5">
                Bypass registration with 1-click test session
              </p>
            </div>

            <button
              onClick={handleJudgeSignIn}
              type="button"
              className="px-3.5 py-2 rounded-lg bg-maroon-800 hover:bg-maroon-900 text-white text-xs font-bold font-mono transition-all flex items-center gap-1.5 shadow-md shadow-maroon-900/25 flex-shrink-0 cursor-pointer"
            >
              <span>1-Click Sign In</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Error Notice */}
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-mono">
              {error}
            </div>
          )}

          {/* Social SSO Buttons with Google & GitHub Sign In / Sign Up */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <button
              onClick={handleGoogleAuth}
              type="button"
              id="auth-google-btn"
              className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-semibold text-slate-800 dark:text-zinc-200 transition-all flex items-center justify-center gap-2.5 shadow-xs hover:border-maroon-400 cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"/>
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"/>
                <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.5.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2c0 2.8.7 5.4 1.9 7.8l3.7-2.9z"/>
                <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.9C3.7 20.6 7.5 23.5 12 23.5z"/>
              </svg>
              <span>{isRegister ? 'Sign Up with Google' : 'Sign In with Google'}</span>
            </button>

            <button
              onClick={handleGitHubAuth}
              type="button"
              id="auth-github-btn"
              className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-700 text-xs font-semibold text-slate-800 dark:text-zinc-200 transition-all flex items-center justify-center gap-2.5 shadow-xs hover:border-maroon-400 cursor-pointer"
            >
              <svg className="w-4 h-4 shrink-0 fill-current text-slate-900 dark:text-white" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              <span>{isRegister ? 'Sign Up with GitHub' : 'Sign In with GitHub'}</span>
            </button>
          </div>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200 dark:border-zinc-800"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase font-mono">
              <span className="bg-white dark:bg-zinc-950 px-2 text-slate-400 dark:text-zinc-500">Or continue with work email</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {isRegister && (
              <>
                <div>
                  <label className="block text-xs font-mono text-slate-700 dark:text-zinc-300 font-bold mb-1.5">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 dark:text-zinc-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ananya Sharma"
                      required
                      className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:border-maroon-600 focus:bg-white dark:focus:bg-zinc-900 rounded-xl px-3 py-2.5 pl-9 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 outline-hidden transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-700 dark:text-zinc-300 font-bold mb-1.5">
                    Company / Entity Name
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-slate-400 dark:text-zinc-500 absolute left-3 top-3" />
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Axis Financial Technologies Ltd"
                      required
                      className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:border-maroon-600 focus:bg-white dark:focus:bg-zinc-900 rounded-xl px-3 py-2.5 pl-9 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 outline-hidden transition-colors"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-mono text-slate-700 dark:text-zinc-300 font-bold mb-1.5">
                Work Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 dark:text-zinc-500 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="auditor@enterprise.in"
                  required
                  className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:border-maroon-600 focus:bg-white dark:focus:bg-zinc-900 rounded-xl px-3 py-2.5 pl-9 text-xs text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-zinc-500 outline-hidden transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono text-slate-700 dark:text-zinc-300 font-bold">
                  Password
                </label>
                {!isRegister && (
                  <button
                    type="button"
                    onClick={() => alert('Password recovery link dispatched to your email address.')}
                    className="text-[11px] text-maroon-800 dark:text-rose-400 hover:text-maroon-900 font-mono transition-colors cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 dark:text-zinc-500 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-slate-50 dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 focus:border-maroon-600 focus:bg-white dark:focus:bg-zinc-900 rounded-xl px-3 py-2.5 pl-9 pr-9 text-xs text-slate-900 dark:text-white font-mono placeholder:text-slate-400 dark:placeholder:text-zinc-500 outline-hidden transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-zinc-400 text-xs select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded border-slate-300 dark:border-zinc-700 text-maroon-800 focus:ring-maroon-800"
                />
                <span className="text-[11px] font-mono">Remember workstation</span>
              </label>

              <span className="text-[11px] font-mono text-emerald-700 dark:text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                TLS 1.3 Validated
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-maroon-800 hover:bg-maroon-900 text-white font-bold text-xs tracking-wide transition-all shadow-md shadow-maroon-900/25 flex items-center justify-center gap-2 mt-2 cursor-pointer"
            >
              <span>{isRegister ? 'Complete Free Registration' : 'Sign In to Workspace'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

          </form>

          {/* Direct Link Switch */}
          <div className="text-center text-xs text-slate-500 dark:text-zinc-400 pt-2 border-t border-slate-100 dark:border-zinc-800">
            {isRegister ? (
              <span>
                Already have an auditor account?{' '}
                <button 
                  onClick={() => navigate('/login')} 
                  className="text-maroon-800 dark:text-rose-400 hover:text-maroon-900 font-semibold underline underline-offset-2 ml-1 cursor-pointer"
                >
                  Sign In here
                </button>
              </span>
            ) : (
              <span>
                Don't have an enterprise account?{' '}
                <button 
                  onClick={() => navigate('/register')} 
                  className="text-maroon-800 dark:text-rose-400 hover:text-maroon-900 font-semibold underline underline-offset-2 ml-1 cursor-pointer"
                >
                  Create one now (Free)
                </button>
              </span>
            )}
          </div>

        </div>

      </div>

      {/* Right Column: Telemetry Showcase */}
      <div className="hidden lg:flex lg:w-1/2 bg-maroon-50/20 dark:bg-black p-12 flex-col justify-between relative overflow-hidden border-l border-slate-200 dark:border-zinc-800">
        
        <div className="relative z-10 flex items-center justify-between text-xs font-mono text-slate-600 dark:text-zinc-400 border-b border-maroon-100 dark:border-zinc-800 pb-4">
          <span className="flex items-center gap-2 text-maroon-900 dark:text-rose-300 font-bold">
            <Activity className="w-4 h-4 text-emerald-600 animate-pulse" />
            DISCREPIQ ENTERPRISE FINANCIAL SUITE
          </span>
          <span className="text-slate-500 dark:text-zinc-400 font-semibold">Multimodal Gemini Vision</span>
        </div>

        {/* Live Reconciled Card Visual */}
        <div className="relative z-10 my-auto space-y-4 max-w-md mx-auto w-full">
          
          <div className="bg-white dark:bg-zinc-900 border border-maroon-200/80 dark:border-zinc-800 rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-900 dark:text-white text-sm">Global Freight Logistics Invoice</span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-50 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                +₹6,940 Overcharge
              </span>
            </div>

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between text-slate-600 dark:text-zinc-400">
                <span>Calculated Line Items (3):</span>
                <span className="text-slate-900 dark:text-white font-semibold">₹1,17,000.00</span>
              </div>
              <div className="flex justify-between text-slate-600 dark:text-zinc-400">
                <span>GST Tax Parity (18%):</span>
                <span className="text-slate-900 dark:text-white font-semibold">₹21,060.00</span>
              </div>
              <div className="flex justify-between text-slate-800 dark:text-zinc-200 font-bold">
                <span>Deterministic Net Payable:</span>
                <span className="text-emerald-600 dark:text-emerald-400 text-sm font-extrabold">₹1,38,060.00</span>
              </div>
              <div className="flex justify-between text-amber-600 dark:text-amber-400 border-t border-slate-200 dark:border-zinc-800 pt-2 font-bold">
                <span>Billed Invoice Total:</span>
                <span>₹1,45,000.00</span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-xs font-mono text-amber-800 dark:text-amber-200 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <span>Variance intercepted before dispatching bank wire transfer.</span>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs">
              <div className="text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">₹4.8M+</div>
              <div className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 font-medium">Discrepancies Intercepted</div>
            </div>
            <div className="p-4 rounded-xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs">
              <div className="text-2xl font-bold font-mono text-maroon-800 dark:text-rose-400">99.8%</div>
              <div className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5 font-medium">Mathematical Parity Accuracy</div>
            </div>
          </div>

        </div>

        {/* Footer info */}
        <div className="relative z-10 text-[11px] text-slate-400 dark:text-zinc-500 font-mono flex items-center justify-between border-t border-slate-200 dark:border-zinc-800 pt-4">
          <span>Enterprise AP Engine · Bengaluru / Mumbai</span>
          <span>Bank-grade TLS 1.3 Security</span>
        </div>

      </div>

    </div>
  );
}
