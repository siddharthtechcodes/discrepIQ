import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Lock, 
  Mail, 
  Building2, 
  User, 
  ArrowRight, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Zap,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AuthPage({ initialMode = 'login' }) {
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const isRegister = location.pathname === '/register' || initialMode === 'register';

  const { login, loginAsGuest, loginWithGoogle, loginWithGitHub } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [company, setCompany] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleGoogleAuth = () => {
    loginWithGoogle(isRegister);
    navigate(from, { replace: true });
  };

  const handleGitHubAuth = () => {
    loginWithGitHub(isRegister);
    navigate(from, { replace: true });
  };

  const handleJudgeSignIn = () => {
    loginAsGuest();
    navigate(from, { replace: true });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    if (!email || !password) {
      setError('Please fill in your email and password.');
      setSubmitting(false);
      return;
    }

    if (isRegister && (!fullName || !company)) {
      setError('Please enter your full name and company.');
      setSubmitting(false);
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      setSubmitting(false);
      return;
    }

    // Simulate a brief loading state
    setTimeout(() => {
      const userData = {
        id: `user-${Date.now()}`,
        name: isRegister ? fullName : (email.split('@')[0] || 'Auditor'),
        email: email,
        company: isRegister ? company : 'DiscrepIQ User',
        role: 'AP Auditor',
        badge: isRegister ? 'New Member' : 'Auditor',
        avatar: null,
        gstin: '',
        plan: 'Standard',
        verifiedAudits: 0,
        mathAccuracy: '—',
        provider: 'local',
        signedInAt: new Date().toISOString()
      };

      login(userData);
      setSubmitting(false);
      navigate(from, { replace: true });
    }, 600);
  };

  return (
    <div className="min-h-[calc(100vh-56px)] flex bg-white">
      
      {/* Left: Auth form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-6 sm:px-12 lg:px-16 py-10">
        <div className="max-w-sm w-full mx-auto space-y-5">

          {/* Back link */}
          <Link to="/" className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-900 transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" />
            Back to Home
          </Link>

          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-zinc-900 text-white flex items-center justify-center font-black text-xs">
              IQ
            </div>
            <span className="font-bold text-base text-zinc-900">DiscrepIQ</span>
          </div>

          {/* Heading */}
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">
              {isRegister ? 'Create your account' : 'Welcome back'}
            </h1>
            <p className="text-sm text-zinc-500 mt-1">
              {isRegister
                ? 'Sign up to start auditing invoices and catching billing errors.'
                : 'Sign in to your account to continue.'}
            </p>
          </div>

          {/* Tab switcher */}
          <div className="grid grid-cols-2 rounded-xl border border-zinc-200 p-1 text-xs font-medium">
            <button
              type="button"
              id="tab-signin"
              onClick={() => navigate('/login')}
              className={`py-2 rounded-lg text-center transition-all cursor-pointer ${
                !isRegister
                  ? 'bg-zinc-900 text-white font-semibold shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              id="tab-register"
              onClick={() => navigate('/register')}
              className={`py-2 rounded-lg text-center transition-all cursor-pointer ${
                isRegister
                  ? 'bg-zinc-900 text-white font-semibold shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* Quick access banner */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-zinc-50 border border-zinc-200">
            <div>
              <p className="text-xs font-semibold text-zinc-900 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                Hackathon Judge? 1-click access
              </p>
              <p className="text-[11px] text-zinc-500 mt-0.5">Skip registration entirely</p>
            </div>
            <button
              type="button"
              id="judge-access-btn"
              onClick={handleJudgeSignIn}
              className="px-3 py-1.5 rounded-lg bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-700 transition-colors cursor-pointer flex items-center gap-1"
            >
              Enter <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              {error}
            </div>
          )}

          {/* Social sign-in */}
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              id="google-auth-btn"
              onClick={handleGoogleAuth}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-medium text-zinc-700 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.7l3.1-3.1C17.3 1.8 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.4 9 5 12 5z"/>
                <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.6h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.9z"/>
                <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.5.4-2.3L1.9 7.3C.7 9.7 0 12.3 0 15.2c0 2.8.7 5.4 1.9 7.8l3.7-2.9z"/>
                <path fill="#34A853" d="M12 23.5c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2-6.4-4.8L1.9 16.9C3.7 20.6 7.5 23.5 12 23.5z"/>
              </svg>
              Google
            </button>
            <button
              type="button"
              id="github-auth-btn"
              onClick={handleGitHubAuth}
              className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-zinc-200 bg-white hover:bg-zinc-50 text-xs font-medium text-zinc-700 transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current text-zinc-900" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
              </svg>
              GitHub
            </button>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white px-3 text-[11px] text-zinc-400">or continue with email</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5" id="auth-form">
            {isRegister && (
              <>
                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1.5" htmlFor="fullname">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                    <input
                      id="fullname"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="Ananya Sharma"
                      required
                      className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-500 focus:bg-white rounded-xl px-3 py-2.5 pl-9 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-colors"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-700 mb-1.5" htmlFor="company">
                    Company / Organization
                  </label>
                  <div className="relative">
                    <Building2 className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                    <input
                      id="company"
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Axis Financial Technologies"
                      required
                      className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-500 focus:bg-white rounded-xl px-3 py-2.5 pl-9 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-colors"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-medium text-zinc-700 mb-1.5" htmlFor="email">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  required
                  className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-500 focus:bg-white rounded-xl px-3 py-2.5 pl-9 text-sm text-zinc-900 placeholder:text-zinc-400 outline-none transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-medium text-zinc-700" htmlFor="password">
                  Password
                </label>
                {!isRegister && (
                  <button
                    type="button"
                    onClick={() => alert('A password reset link will be sent to your email.')}
                    className="text-[11px] text-zinc-500 hover:text-zinc-900 transition-colors cursor-pointer"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-2.5" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-500 focus:bg-white rounded-xl px-3 py-2.5 pl-9 pr-10 text-sm text-zinc-900 font-mono placeholder:text-zinc-400 placeholder:font-sans outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-zinc-400 hover:text-zinc-700 cursor-pointer transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Security note */}
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Encrypted & secure</span>
            </div>

            <button
              type="submit"
              id="auth-submit-btn"
              disabled={submitting}
              className="w-full py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-700 text-white font-semibold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed mt-1"
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  {isRegister ? 'Creating account...' : 'Signing in...'}
                </span>
              ) : (
                <>
                  <span>{isRegister ? 'Create Account' : 'Sign In'}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Switch mode */}
          <p className="text-center text-xs text-zinc-500 pt-1">
            {isRegister ? (
              <>
                Already have an account?{' '}
                <button onClick={() => navigate('/login')} className="text-zinc-900 font-semibold hover:underline cursor-pointer">
                  Sign in
                </button>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <button onClick={() => navigate('/register')} className="text-zinc-900 font-semibold hover:underline cursor-pointer">
                  Create one free
                </button>
              </>
            )}
          </p>

        </div>
      </div>

      {/* Right: Visual showcase (desktop only) */}
      <div className="hidden lg:flex lg:w-1/2 bg-zinc-50 border-l border-zinc-200 p-12 flex-col justify-center">
        <div className="max-w-md mx-auto space-y-6">

          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-zinc-900">Catch billing errors before you pay</h2>
            <p className="text-sm text-zinc-500">Upload any invoice or receipt. We verify math, tax rates, and company expense rules instantly.</p>
          </div>

          {/* Sample audit card */}
          <div className="bg-white border border-zinc-200 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-zinc-900">Freight Invoice #INV-2189</span>
              <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                +₹6,940 Error Found
              </span>
            </div>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between text-zinc-500">
                <span>Line Items Total</span>
                <span className="font-mono font-semibold text-zinc-800">₹1,17,000</span>
              </div>
              <div className="flex justify-between text-zinc-500">
                <span>GST 18%</span>
                <span className="font-mono font-semibold text-zinc-800">₹21,060</span>
              </div>
              <div className="flex justify-between text-zinc-800 font-bold border-t border-zinc-100 pt-2">
                <span>Calculated Total</span>
                <span className="font-mono text-emerald-700">₹1,38,060</span>
              </div>
              <div className="flex justify-between text-amber-600 font-semibold">
                <span>Billed Total</span>
                <span className="font-mono">₹1,45,000</span>
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800">
              <AlertTriangle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
              <span>Variance detected — invoice overbills by ₹6,940 before payment.</span>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white border border-zinc-200 rounded-xl p-4">
              <div className="text-xl font-bold font-mono text-zinc-900">₹4.8M+</div>
              <div className="text-xs text-zinc-500 mt-0.5">Errors intercepted</div>
            </div>
            <div className="bg-white border border-zinc-200 rounded-xl p-4">
              <div className="text-xl font-bold font-mono text-zinc-900">99.8%</div>
              <div className="text-xs text-zinc-500 mt-0.5">Math accuracy</div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
            <span>Used by 200+ finance teams across India</span>
          </div>
        </div>
      </div>

    </div>
  );
}
