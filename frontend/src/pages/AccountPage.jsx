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
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function AccountPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loginAsGuest, logout, updateUser } = useAuth();

  const [name, setName] = useState(user?.name || 'Auditor Siddharth');
  const [email, setEmail] = useState(user?.email || 'siddharth@discrepiq.io');
  const [company, setCompany] = useState(user?.company || 'Global FinTech Audits India Ltd');
  const [role, setRole] = useState(user?.role || 'Chief Financial Auditor');
  
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
    <div className="min-h-screen bg-slate-50 text-slate-900 py-8 px-4 sm:px-6 lg:px-8 selection:bg-blue-600 selection:text-white">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Page Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight font-sans">
                Auditor Account &amp; Engine Settings
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-blue-50 text-blue-700 border border-blue-200 font-bold">
                Enterprise AP Tier
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1 font-sans">
              Manage your personal auditor credentials, Gemini Vision API connection, and math parity audit rules.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {!isAuthenticated ? (
              <button
                type="button"
                onClick={() => { loginAsGuest(); showToast('Signed in as Hackathon Judge / Guest'); }}
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs font-mono transition-colors flex items-center gap-1.5 shadow-md shadow-blue-600/25 cursor-pointer"
              >
                <Zap className="w-3.5 h-3.5 fill-current" />
                <span>1-Click Sign In (Judge Demo)</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSignOut}
                className="px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-600 hover:text-rose-600 text-xs font-mono transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            )}
          </div>
        </div>

        {/* Auditor Profile Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-blue-600/20">
                {name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">{name}</h2>
                <p className="text-xs text-slate-500 font-mono">
                  {role} · <span className="text-blue-600 font-semibold">{company}</span>
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-mono font-bold">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Identity Verified</span>
            </div>
          </div>

          <form onSubmit={handleSaveProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
            <div>
              <label className="block text-slate-600 font-mono text-[11px] mb-1.5 font-bold">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl px-3 py-2 pl-9 text-xs text-slate-900 outline-hidden transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-mono text-[11px] mb-1.5 font-bold">Work Email</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl px-3 py-2 pl-9 text-xs text-slate-900 outline-hidden transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-mono text-[11px] mb-1.5 font-bold">Company / Entity Name</label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl px-3 py-2 pl-9 text-xs text-slate-900 outline-hidden transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-600 font-mono text-[11px] mb-1.5 font-bold">Audit Role / Title</label>
              <div className="relative">
                <ShieldCheck className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl px-3 py-2 pl-9 text-xs text-slate-900 outline-hidden transition-colors"
                />
              </div>
            </div>

            <div className="sm:col-span-2 flex justify-end pt-2">
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-md shadow-blue-600/25 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Profile Information</span>
              </button>
            </div>
          </form>
        </div>

        {/* Gemini Engine Configuration Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <KeyRound className="w-4 h-4 text-blue-600" />
                <span>Multimodal Vision AI Engine Configuration</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Configure your Google Gemini API Key and active LLM model for real-time document OCR and line-item extraction.
              </p>
            </div>

            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-mono bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
              Live OCR Ready
            </span>
          </div>

          <div className="space-y-4 text-xs font-sans">
            <div>
              <label className="block text-slate-600 font-mono text-[11px] mb-1.5 font-bold">
                Google Gemini API Key
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  placeholder="AIzaSy... or AQ..."
                  className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl px-3 py-2 pl-9 pr-3 text-xs text-slate-900 font-mono outline-hidden transition-colors"
                />
              </div>
              <p className="text-[11px] text-slate-500 font-mono mt-1">
                Your key is secured on the backend and used strictly for in-memory multimodal extraction.
              </p>
            </div>

            <div>
              <label className="block text-slate-600 font-mono text-[11px] mb-1.5 font-bold">
                Active Vision Model
              </label>
              <select
                value={selectedModel}
                onChange={(e) => setSelectedModel(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl px-3 py-2 text-xs text-slate-900 font-mono outline-hidden transition-colors cursor-pointer"
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
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : 'bg-rose-50 border-rose-200 text-rose-800'
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
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-200 text-xs font-mono font-medium transition-colors flex items-center gap-2 disabled:opacity-50 cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isTestingKey ? 'animate-spin text-blue-600' : 'text-slate-500'}`} />
                <span>{isTestingKey ? 'Testing Engine Latency...' : 'Test Connection & Latency'}</span>
              </button>

              <button
                type="button"
                onClick={handleSaveEngineConfig}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs font-mono transition-colors flex items-center gap-1.5 shadow-md shadow-blue-600/25 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Engine Settings</span>
              </button>
            </div>
          </div>
        </div>

        {/* AP Audit Parity Preferences Card */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-blue-600" />
              <span>Accounts Payable Reconciliation Rules</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Customize mathematical tolerances, currency conventions, and compliance rules for incoming invoices.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-sans">
            <div>
              <label className="block text-slate-600 font-mono text-[11px] mb-1.5 font-bold">Standard Currency</label>
              <input
                type="text"
                value={currency}
                disabled
                className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-500 font-mono cursor-not-allowed"
              />
              <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                Standardized on Indian GST Act 2017 (CGST/SGST/IGST).
              </span>
            </div>

            <div>
              <label className="block text-slate-600 font-mono text-[11px] mb-1.5 font-bold">Rounding Parity Threshold (₹)</label>
              <input
                type="number"
                step="0.01"
                value={tolerance}
                onChange={(e) => setTolerance(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-blue-500 focus:bg-white rounded-xl px-3 py-2 text-xs text-slate-900 font-mono outline-hidden"
              />
              <span className="text-[10px] text-slate-400 font-mono mt-1 block">
                Discrepancies below this amount are categorized as fractional bank rounding.
              </span>
            </div>

            <div className="sm:col-span-2 space-y-3 pt-2">
              <label className="flex items-center gap-2.5 cursor-pointer text-slate-700 select-none">
                <input
                  type="checkbox"
                  checked={autoReconcile}
                  onChange={(e) => setAutoReconcile(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <p className="font-semibold text-xs text-slate-900">Auto-approve invoices with 100% Zero-Variance</p>
                  <p className="text-[11px] text-slate-500 font-mono">Automatically marks fully balanced line items as verified.</p>
                </div>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer text-slate-700 select-none">
                <input
                  type="checkbox"
                  checked={flagMissingGstin}
                  onChange={(e) => setFlagMissingGstin(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <div>
                  <p className="font-semibold text-xs text-slate-900">Flag vendor invoices missing valid GSTIN registration</p>
                  <p className="text-[11px] text-slate-500 font-mono">Ensures compliance with Indian tax audit requirements.</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Toast Feedback */}
        {toastMsg && (
          <div className="fixed bottom-5 right-5 z-50">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-mono shadow-2xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{toastMsg}</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
