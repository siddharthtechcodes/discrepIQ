import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Building2, 
  ShieldCheck, 
  KeyRound, 
  Sliders, 
  CheckCircle2, 
  AlertCircle, 
  Save, 
  RefreshCw, 
  LogOut, 
  Layers, 
  CreditCard, 
  Bell, 
  Globe, 
  FileCheck2,
  Lock,
  Zap,
  ArrowRight,
  UserCheck,
  PlusCircle,
  Sun,
  Moon,
  Laptop
} from 'lucide-react';
import { useAuth, PRESET_ACCOUNTS } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

export default function AccountPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loginAsGuest, loginWithGoogle, loginWithGitHub, logout, updateUser, switchAccount } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();

  const [name, setName] = useState(user?.name || 'Auditor Siddharth');
  const [email, setEmail] = useState(user?.email || 'siddharth@discrepiq.io');
  const [company, setCompany] = useState(user?.company || 'Global FinTech Audits India Ltd');
  const [role, setRole] = useState(user?.role || 'Chief Financial Auditor');

  // Synchronize when active user changes
  useEffect(() => {
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setCompany(user.company || '');
      setRole(user.role || '');
    }
  }, [user]);

  // Modal / Form state for creating a new custom account
  const [showAddAccountModal, setShowAddAccountModal] = useState(false);
  const [newAccName, setNewAccName] = useState('');
  const [newAccEmail, setNewAccEmail] = useState('');
  const [newAccRole, setNewAccRole] = useState('Senior Auditor');
  const [newAccCompany, setNewAccCompany] = useState('');
  
  // API Key & Model Settings
  const [apiKey, setApiKey] = useState('');
  const [selectedModel, setSelectedModel] = useState('gemini-3.5-flash');
  const [isTestingKey, setIsTestingKey] = useState(false);
  const [testResult, setTestResult] = useState(null);

  // Preferences
  const [currency, setCurrency] = useState('INR (₹)');
  const [tolerance, setTolerance] = useState('0.05');
  const [autoReconcile, setAutoReconcile] = useState(true);
  const [flagMissingGstin, setFlagMissingGstin] = useState(true);

  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateUser({ name, email, company, role });
    showToast('Auditor profile updated successfully.');
  };

  const handleCreateCustomAccount = (e) => {
    e.preventDefault();
    if (!newAccName.trim() || !newAccEmail.trim()) {
      showToast('Please provide a valid name and email address.');
      return;
    }
    updateUser({
      name: newAccName.trim(),
      email: newAccEmail.trim(),
      role: newAccRole.trim() || 'Custom Auditor',
      company: newAccCompany.trim() || 'Independent Enterprise'
    });
    setShowAddAccountModal(false);
    showToast(`Created & switched to new account: ${newAccName}`);
    setNewAccName('');
    setNewAccEmail('');
    setNewAccCompany('');
  };

  const handleTestApiKey = async () => {
    setIsTestingKey(true);
    setTestResult(null);

    try {
      const res = await fetch('/api/config/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey, model: selectedModel })
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTestResult({
          status: 'success',
          message: `Connection Verified: ${data.latencyMs}ms response time using model ${data.model}`
        });
      } else {
        setTestResult({
          status: 'error',
          message: data.error || 'Connection failed. Verify API Key permissions.'
        });
      }
    } catch (err) {
      setTestResult({
        status: 'error',
        message: err.message || 'Network error while validating Gemini API key.'
      });
    } finally {
      setIsTestingKey(false);
    }
  };

  const handleSaveEngineConfig = async () => {
    try {
      const res = await fetch('/api/config/key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey, model: selectedModel })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Engine configuration saved to backend environment.');
      } else {
        showToast(data.error || 'Failed to save configuration.');
      }
    } catch (err) {
      showToast('Error saving configuration.');
    }
  };

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-black text-slate-900 dark:text-zinc-100 py-8 px-4 sm:px-6 lg:px-8 selection:bg-maroon-800 selection:text-white transition-colors duration-200">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Apple OS Window Container Frame */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl shadow-xl overflow-hidden transition-colors">
          
          {/* macOS Title Bar with Traffic Lights */}
          <div className="px-5 py-3 bg-slate-100/80 dark:bg-zinc-800/80 border-b border-slate-200 dark:border-zinc-700/80 flex items-center justify-between backdrop-blur-md">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-500 hover:opacity-80 transition cursor-pointer"></span>
              <span className="w-3 h-3 rounded-full bg-amber-400 hover:opacity-80 transition cursor-pointer"></span>
              <span className="w-3 h-3 rounded-full bg-emerald-500 hover:opacity-80 transition cursor-pointer"></span>
              <span className="ml-3 text-xs font-mono font-bold text-slate-600 dark:text-zinc-300">
                System Preferences · DiscrepIQ Auditor Account Manager
              </span>
            </div>

            <div className="flex items-center gap-2">
              {/* Apple Control Center Dark/Light Mode Pill */}
              <button
                type="button"
                onClick={toggleTheme}
                className="px-3 py-1 rounded-full bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 text-xs font-mono font-medium text-slate-700 dark:text-zinc-200 flex items-center gap-1.5 shadow-xs hover:border-maroon-500 cursor-pointer transition-colors"
                title="Toggle Theme"
              >
                {isDark ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-maroon-800" />}
                <span>{isDark ? 'Dark Mode' : 'Light Mode'}</span>
              </button>

              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono bg-maroon-50 dark:bg-maroon-950 text-maroon-900 dark:text-rose-300 border border-maroon-200 dark:border-maroon-800 font-bold">
                macOS AP Pro
              </span>
            </div>
          </div>

          {/* Header Banner Content */}
          <div className="p-6 border-b border-slate-200 dark:border-zinc-800 flex flex-wrap items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight font-sans">
                  Auditor Account &amp; Multi-Profile Center
                </h1>
              </div>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 font-sans">
                Manage your credentials, switch between different auditor accounts, and configure Vision AI rules.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowAddAccountModal(true)}
                className="px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 border border-slate-200 dark:border-zinc-700 text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <PlusCircle className="w-3.5 h-3.5 text-maroon-800 dark:text-rose-400" />
                <span>Add Different Account</span>
              </button>

              {!isAuthenticated ? (
                <button
                  type="button"
                  onClick={() => { loginAsGuest(); showToast('Signed in as Hackathon Judge / Guest'); }}
                  className="px-3.5 py-2 rounded-xl bg-maroon-800 hover:bg-maroon-900 text-white font-bold text-xs font-mono transition-colors flex items-center gap-1.5 shadow-md shadow-maroon-900/25 cursor-pointer"
                >
                  <Zap className="w-3.5 h-3.5 fill-current" />
                  <span>1-Click Judge Demo</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="px-3.5 py-2 rounded-xl bg-white dark:bg-zinc-800 hover:bg-rose-50 dark:hover:bg-rose-950/40 border border-slate-200 dark:border-zinc-700 text-slate-600 dark:text-zinc-300 hover:text-rose-600 dark:hover:text-rose-400 text-xs font-mono transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              )}
            </div>
          </div>

          {/* ============================================================== */}
          {/* MULTI-ACCOUNT SWITCHER CARDS (SWITCH TO DIFFERENT ACCOUNTS)    */}
          {/* ============================================================== */}
          <div className="p-6 bg-slate-50/70 dark:bg-zinc-950/50 border-b border-slate-200 dark:border-zinc-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-maroon-800 dark:text-rose-400" />
                  <span>Switch Auditor Persona &amp; Work Account</span>
                </h3>
                <p className="text-xs text-slate-500 dark:text-zinc-400">
                  Select a different pre-configured account or click to simulate varying audit roles and company domains.
                </p>
              </div>

              <span className="text-[11px] font-mono text-slate-500 dark:text-zinc-400 hidden sm:inline">
                Active: <strong className="text-maroon-800 dark:text-rose-400 font-bold">{user?.name}</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
              {PRESET_ACCOUNTS.map((acc) => {
                const isActive = user?.email === acc.email;
                return (
                  <div
                    key={acc.id}
                    onClick={() => {
                      switchAccount(acc.id);
                      showToast(`Switched account to ${acc.name}`);
                    }}
                    className={`p-4 rounded-xl border transition-all cursor-pointer relative flex flex-col justify-between ${
                      isActive
                        ? 'bg-white dark:bg-zinc-900 border-maroon-700 dark:border-rose-400 shadow-md ring-2 ring-maroon-700/20'
                        : 'bg-white/80 dark:bg-zinc-900/60 border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700 hover:bg-white dark:hover:bg-zinc-900'
                    }`}
                  >
                    {isActive && (
                      <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-full text-[9px] font-mono bg-maroon-100 dark:bg-maroon-950 text-maroon-900 dark:text-rose-300 border border-maroon-300 dark:border-maroon-700 font-bold">
                        ACTIVE
                      </span>
                    )}

                    <div>
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-maroon-950 via-maroon-800 to-rose-700 text-white font-black text-sm flex items-center justify-center shadow-sm">
                          {acc.avatar}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white leading-tight">
                            {acc.name}
                          </h4>
                          <span className="text-[10px] text-maroon-800 dark:text-rose-400 font-mono font-medium">
                            {acc.badge}
                          </span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-500 dark:text-zinc-400 line-clamp-1 font-mono">
                        {acc.email}
                      </p>
                      <p className="text-[10px] text-slate-400 dark:text-zinc-500 line-clamp-1 mt-0.5">
                        {acc.company}
                      </p>
                    </div>

                    <button
                      type="button"
                      className={`mt-3 w-full py-1.5 rounded-lg text-[11px] font-mono font-bold transition-colors ${
                        isActive
                          ? 'bg-maroon-50 dark:bg-maroon-950/80 text-maroon-900 dark:text-rose-300 border border-maroon-200 dark:border-maroon-800'
                          : 'bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-300'
                      }`}
                    >
                      {isActive ? '✓ Currently Selected' : 'Switch to Account →'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Account Profile Settings Form */}
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-maroon-800 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-maroon-900/20">
                  {name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white">{name}</h2>
                  <p className="text-xs text-slate-500 dark:text-zinc-400 font-mono">
                    {role} · <span className="text-maroon-800 dark:text-rose-400 font-semibold">{company}</span>
                  </p>
                </div>
              </div>

              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs font-mono font-bold">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Identity Verified</span>
              </div>
            </div>

            <form onSubmit={handleSaveProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
              <div>
                <label className="block text-slate-600 dark:text-zinc-400 font-mono text-[11px] mb-1.5 font-bold">Full Name</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-maroon-600 focus:bg-white dark:focus:bg-zinc-900 rounded-xl px-3 py-2 pl-9 text-xs text-slate-900 dark:text-white outline-hidden transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-zinc-400 font-mono text-[11px] mb-1.5 font-bold">Work Email</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-maroon-600 focus:bg-white dark:focus:bg-zinc-900 rounded-xl px-3 py-2 pl-9 text-xs text-slate-900 dark:text-white outline-hidden transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-zinc-400 font-mono text-[11px] mb-1.5 font-bold">Company / Entity Name</label>
                <div className="relative">
                  <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-maroon-600 focus:bg-white dark:focus:bg-zinc-900 rounded-xl px-3 py-2 pl-9 text-xs text-slate-900 dark:text-white outline-hidden transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-600 dark:text-zinc-400 font-mono text-[11px] mb-1.5 font-bold">Audit Role / Title</label>
                <div className="relative">
                  <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-maroon-600 focus:bg-white dark:focus:bg-zinc-900 rounded-xl px-3 py-2 pl-9 text-xs text-slate-900 dark:text-white outline-hidden transition-colors"
                  />
                </div>
              </div>

              <div className="sm:col-span-2 flex justify-end pt-2">
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-maroon-800 hover:bg-maroon-900 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-maroon-900/25 cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>Save Profile Information</span>
                </button>
              </div>
            </form>
          </div>

        </div>

        {/* Gemini Engine Configuration Card */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs space-y-5 transition-colors">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-zinc-800 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-maroon-800 dark:text-rose-400" />
                <span>Multimodal Vision AI Engine Configuration</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                Configure your Google Gemini API Key and active LLM model for real-time document OCR and line-item extraction.
              </p>
            </div>

            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold">
              Live OCR Ready
            </span>
          </div>

          <div className="space-y-4 text-xs font-sans">
            <div>
              <label className="block text-slate-600 dark:text-zinc-400 font-mono text-[11px] mb-1.5 font-bold">
                Google Gemini API Key
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy... or AQ..."
                  className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-maroon-600 focus:bg-white dark:focus:bg-zinc-900 rounded-xl px-3 py-2 pl-9 pr-3 text-xs text-slate-900 dark:text-white font-mono outline-hidden transition-colors"
                />
              </div>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-mono mt-1">
                Your key is secured on the backend and used strictly for in-memory multimodal extraction.
              </p>
            </div>

            <div>
              <label className="block text-slate-600 dark:text-zinc-400 font-mono text-[11px] mb-1.5 font-bold">
                Active Vision Model
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-maroon-600 focus:bg-white dark:focus:bg-zinc-900 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono outline-hidden transition-colors cursor-pointer"
              >
                <option value="gemini-3.5-flash">gemini-3.5-flash (Recommended · Ultra Fast &amp; High Math Parity)</option>
                <option value="gemini-3.8-flash">gemini-3.8-flash (Latest General Multimodal Release)</option>
                <option value="gemini-3.7-flash">gemini-3.7-flash (Enhanced Reasoning on Complex Nested Tables)</option>
                <option value="gemini-3.5-flash-lite">gemini-3.5-flash-lite (Cost-Optimized Low Latency)</option>
              </select>
            </div>

            {/* Test result status badge */}
            {testResult && (
              <div className={`p-3 rounded-xl border text-xs font-mono flex items-center gap-2 ${
                testResult.status === 'success'
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                  : 'bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-300'
              }`}>
                {testResult.status === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                )}
                <span>{testResult.message}</span>
              </div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={handleTestApiKey}
                disabled={isTestingKey}
                className="px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 text-slate-700 dark:text-zinc-200 border border-slate-200 dark:border-zinc-700 text-xs font-mono font-medium transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTestingKey ? 'animate-spin text-maroon-800 dark:text-rose-400' : 'text-slate-500'}`} />
                <span>{isTestingKey ? 'Testing Engine Latency...' : 'Test Connection & Latency'}</span>
              </button>

              <button
                type="button"
                onClick={handleSaveEngineConfig}
                className="px-5 py-2.5 rounded-xl bg-maroon-800 hover:bg-maroon-900 text-white font-bold text-xs font-mono transition-colors flex items-center gap-1.5 shadow-md shadow-maroon-900/25 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Engine Settings</span>
              </button>
            </div>
          </div>
        </div>

        {/* AP Audit Parity Preferences Card */}
        <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 shadow-xs space-y-5 transition-colors">
          <div className="border-b border-slate-100 dark:border-zinc-800 pb-3">
            <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sliders className="w-4 h-4 text-maroon-800 dark:text-rose-400" />
              <span>Accounts Payable Reconciliation Rules</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
              Customize mathematical tolerances, currency conventions, and compliance rules for incoming invoices.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
            <div>
              <label className="block text-slate-600 dark:text-zinc-400 font-mono text-[11px] mb-1.5 font-bold">Standard Currency</label>
              <input
                type="text"
                value={currency}
                disabled
                className="w-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-xl px-3 py-2 text-xs text-slate-500 dark:text-zinc-400 font-mono cursor-not-allowed"
              />
              <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono mt-1 block">
                Standardized on Indian GST Act 2017 (CGST/SGST/IGST).
              </span>
            </div>

            <div>
              <label className="block text-slate-600 dark:text-zinc-400 font-mono text-[11px] mb-1.5 font-bold">Rounding Parity Threshold (₹)</label>
              <input
                type="number"
                step="0.01"
                value={tolerance}
                onChange={(e) => setTolerance(e.target.value)}
                className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-maroon-600 focus:bg-white dark:focus:bg-zinc-900 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white font-mono outline-hidden"
              />
              <span className="text-[10px] text-slate-400 dark:text-zinc-500 font-mono mt-1 block">
                Discrepancies below this amount are categorized as fractional bank rounding.
              </span>
            </div>

            <div className="sm:col-span-2 space-y-3 pt-2">
              <label className="flex items-center gap-2.5 cursor-pointer text-slate-700 dark:text-zinc-300 select-none">
                <input
                  type="checkbox"
                  checked={autoReconcile}
                  onChange={(e) => setAutoReconcile(e.target.checked)}
                  className="rounded border-slate-300 dark:border-zinc-700 text-maroon-800 focus:ring-maroon-800"
                />
                <div>
                  <p className="font-semibold text-xs text-slate-900 dark:text-white">Auto-approve invoices with 100% Zero-Variance</p>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-mono">Automatically marks fully balanced line items as verified.</p>
                </div>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-slate-700 dark:text-zinc-300 select-none">
                <input
                  type="checkbox"
                  checked={flagMissingGstin}
                  onChange={(e) => setFlagMissingGstin(e.target.checked)}
                  className="rounded border-slate-300 dark:border-zinc-700 text-maroon-800 focus:ring-maroon-800"
                />
                <div>
                  <p className="font-semibold text-xs text-slate-900 dark:text-white">Flag vendor invoices missing valid GSTIN registration</p>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 font-mono">Ensures compliance with Indian tax audit requirements.</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Modal: Create / Add Different Custom Account */}
        {showAddAccountModal && (
          <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-zinc-800 pb-3">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <User className="w-4 h-4 text-maroon-800 dark:text-rose-400" />
                  <span>Create Different Auditor Profile</span>
                </h3>
                <button
                  type="button"
                  onClick={() => setShowAddAccountModal(false)}
                  className="text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 font-mono text-sm cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleCreateCustomAccount} className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-600 dark:text-zinc-400 font-mono text-[11px] mb-1 font-bold">Full Name</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Vikram Malhotra"
                    value={newAccName}
                    onChange={(e) => setNewAccName(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-maroon-600 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-zinc-400 font-mono text-[11px] mb-1 font-bold">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. vikram@finaudit.co.in"
                    value={newAccEmail}
                    onChange={(e) => setNewAccEmail(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-maroon-600 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-zinc-400 font-mono text-[11px] mb-1 font-bold">Company / Audit Firm</label>
                  <input
                    type="text"
                    placeholder="e.g. KPMG India AP Group"
                    value={newAccCompany}
                    onChange={(e) => setNewAccCompany(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-maroon-600 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-slate-600 dark:text-zinc-400 font-mono text-[11px] mb-1 font-bold">Audit Role</label>
                  <input
                    type="text"
                    placeholder="e.g. Senior Tax Auditor"
                    value={newAccRole}
                    onChange={(e) => setNewAccRole(e.target.value)}
                    className="w-full bg-slate-50 dark:bg-zinc-950 border border-slate-200 dark:border-zinc-800 focus:border-maroon-600 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white outline-hidden"
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200 dark:border-zinc-800">
                  <button
                    type="button"
                    onClick={() => setShowAddAccountModal(false)}
                    className="px-4 py-2 rounded-xl text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-maroon-800 hover:bg-maroon-900 text-white font-bold text-xs shadow-md shadow-maroon-900/25 cursor-pointer"
                  >
                    Create &amp; Switch
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Toast Feedback */}
        {toastMsg && (
          <div className="fixed bottom-5 right-5 z-50">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 dark:bg-zinc-800 text-white text-xs font-mono shadow-2xl border border-slate-800 dark:border-zinc-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{toastMsg}</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

