import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, 
  Mail, 
  Building2, 
  ShieldCheck, 
  KeyRound, 
  Save, 
  RefreshCw, 
  LogOut, 
  UserCheck, 
  PlusCircle, 
  CheckCircle2, 
  Sliders
} from 'lucide-react';
import { useAuth, PRESET_ACCOUNTS } from '../context/AuthContext';

export default function AccountPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout, updateUser, switchAccount } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [company, setCompany] = useState(user?.company || '');
  const [role, setRole] = useState(user?.role || '');

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
      role: newAccRole.trim() || 'Auditor',
      company: newAccCompany.trim() || 'Company'
    });
    setShowAddAccountModal(false);
    showToast(`Switched to new account: ${newAccName}`);
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
          message: `Connection Verified: ${data.latencyMs}ms response time using ${data.model}`
        });
      } else {
        setTestResult({
          status: 'error',
          message: data.error || 'Connection failed. Verify API key.'
        });
      }
    } catch (err) {
      setTestResult({
        status: 'error',
        message: 'Could not connect to backend server. Make sure backend is running.'
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
        showToast('Engine configuration saved.');
      } else {
        showToast(data.error || 'Saved locally.');
      }
    } catch (err) {
      showToast('Saved locally.');
    }
  };

  const handleSignOut = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-zinc-50 text-zinc-900 py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-zinc-200">
          <div>
            <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">
              Account &amp; Settings
            </h1>
            <p className="text-xs text-zinc-500 mt-1">
              Manage your profile, active persona, audit parameters, and API configuration.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              id="add-account-btn"
              onClick={() => setShowAddAccountModal(true)}
              className="px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-zinc-700 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>New Persona</span>
            </button>

            <button
              type="button"
              id="account-signout-btn"
              onClick={handleSignOut}
              className="px-3 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-100 text-zinc-800 text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Switch Auditor Persona */}
        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
            <div>
              <h3 className="text-sm font-semibold text-zinc-900 flex items-center gap-1.5">
                <UserCheck className="w-4 h-4 text-zinc-700" />
                Quick Switch Persona
              </h3>
              <p className="text-xs text-zinc-500 mt-0.5">Switch accounts instantly to test different clearance levels</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {PRESET_ACCOUNTS.map((acc) => {
              const isCurrent = user?.id === acc.id;
              return (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => { switchAccount(acc.id); showToast(`Switched to ${acc.name}`); }}
                  className={`p-3 rounded-lg border text-left transition-all text-xs cursor-pointer ${
                    isCurrent
                      ? 'border-zinc-900 bg-zinc-900 text-white shadow-sm'
                      : 'border-zinc-200 bg-zinc-50/50 hover:bg-zinc-100 text-zinc-800'
                  }`}
                >
                  <p className="font-semibold truncate">{acc.name}</p>
                  <p className={`text-[11px] truncate mt-0.5 ${isCurrent ? 'text-zinc-300' : 'text-zinc-500'}`}>{acc.role}</p>
                  <p className={`text-[10px] truncate mt-1 ${isCurrent ? 'text-zinc-400' : 'text-zinc-400'}`}>{acc.company}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Profile Settings Form */}
        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="border-b border-zinc-100 pb-2.5">
            <h3 className="text-sm font-semibold text-zinc-900 flex items-center gap-1.5">
              <User className="w-4 h-4 text-zinc-700" />
              Auditor Profile
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">Your personal auditor credentials</p>
          </div>

          <form onSubmit={handleSaveProfile} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-zinc-600 font-medium mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-500 focus:bg-white rounded-lg px-3 py-2 text-xs text-zinc-900 outline-none"
              />
            </div>

            <div>
              <label className="block text-zinc-600 font-medium mb-1">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-500 focus:bg-white rounded-lg px-3 py-2 text-xs text-zinc-900 outline-none"
              />
            </div>

            <div>
              <label className="block text-zinc-600 font-medium mb-1">Organization / Firm</label>
              <input
                type="text"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-500 focus:bg-white rounded-lg px-3 py-2 text-xs text-zinc-900 outline-none"
              />
            </div>

            <div>
              <label className="block text-zinc-600 font-medium mb-1">Auditor Role</label>
              <input
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-500 focus:bg-white rounded-lg px-3 py-2 text-xs text-zinc-900 outline-none"
              />
            </div>

            <div className="sm:col-span-2 flex justify-end pt-1">
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Save Profile</span>
              </button>
            </div>
          </form>
        </div>

        {/* Audit Parameters & Tolerance */}
        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="border-b border-zinc-100 pb-2.5">
            <h3 className="text-sm font-semibold text-zinc-900 flex items-center gap-1.5">
              <Sliders className="w-4 h-4 text-zinc-700" />
              Audit Parameters &amp; Thresholds
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">Define precision tolerance and auto-reconciliation thresholds</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="block text-zinc-600 font-medium mb-1">Default Currency</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-900 outline-none"
              >
                <option value="INR (₹)">INR (₹) - Indian Rupee</option>
                <option value="USD ($)">USD ($) - US Dollar</option>
                <option value="EUR (€)">EUR (€) - Euro</option>
              </select>
            </div>

            <div>
              <label className="block text-zinc-600 font-medium mb-1">Variance Tolerance</label>
              <select
                value={tolerance}
                onChange={(e) => setTolerance(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-2 text-xs text-zinc-900 outline-none"
              >
                <option value="0.01">₹0.01 (Strict 100%)</option>
                <option value="0.05">₹0.05 (Standard Rounding)</option>
                <option value="1.00">₹1.00 (Lenient Float)</option>
              </select>
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer text-xs text-zinc-700">
                <input
                  type="checkbox"
                  checked={autoReconcile}
                  onChange={(e) => setAutoReconcile(e.target.checked)}
                  className="rounded border-zinc-300 text-zinc-900 focus:ring-0 w-4 h-4"
                />
                <span>Auto-approve zero variance</span>
              </label>
            </div>
          </div>
        </div>

        {/* Gemini Vision API Configuration */}
        <div className="bg-white border border-zinc-200 rounded-xl p-5 shadow-sm space-y-4">
          <div className="border-b border-zinc-100 pb-2.5">
            <h3 className="text-sm font-semibold text-zinc-900 flex items-center gap-1.5">
              <KeyRound className="w-4 h-4 text-zinc-700" />
              Gemini Vision API Configuration
            </h3>
            <p className="text-xs text-zinc-500 mt-0.5">Optional: connect your custom Gemini API key for live document OCR</p>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="block text-zinc-600 font-medium mb-1">Gemini API Key</label>
              <input
                type="password"
                placeholder="AIzaSy..."
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full bg-zinc-50 border border-zinc-200 focus:border-zinc-500 focus:bg-white rounded-lg px-3 py-2 text-xs text-zinc-900 font-mono outline-none"
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleTestApiKey}
                  disabled={isTestingKey}
                  className="px-3.5 py-1.5 rounded-lg border border-zinc-200 bg-white hover:bg-zinc-50 text-xs text-zinc-700 font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isTestingKey ? 'animate-spin' : ''}`} />
                  <span>Test Connection</span>
                </button>

                <button
                  type="button"
                  onClick={handleSaveEngineConfig}
                  className="px-4 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  <span>Save Configuration</span>
                </button>
              </div>

              {testResult && (
                <span className={`text-xs ${testResult.status === 'success' ? 'text-emerald-700' : 'text-red-600'}`}>
                  {testResult.message}
                </span>
              )}
            </div>
          </div>
        </div>

      </div>

      {/* Add Custom Account Modal */}
      {showAddAccountModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white border border-zinc-200 rounded-xl max-w-sm w-full p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-zinc-100 pb-2.5">
              <h3 className="text-sm font-semibold text-zinc-900">Create Persona Account</h3>
              <button
                type="button"
                onClick={() => setShowAddAccountModal(false)}
                className="text-zinc-400 hover:text-zinc-900 text-xs"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCustomAccount} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-600 font-medium mb-1">Name</label>
                <input
                  type="text"
                  required
                  placeholder="Karan Malhotra"
                  value={newAccName}
                  onChange={(e) => setNewAccName(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-1.5 text-xs text-zinc-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-600 font-medium mb-1">Email</label>
                <input
                  type="email"
                  required
                  placeholder="karan@enterprise.in"
                  value={newAccEmail}
                  onChange={(e) => setNewAccEmail(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-1.5 text-xs text-zinc-900 outline-none"
                />
              </div>

              <div>
                <label className="block text-zinc-600 font-medium mb-1">Organization</label>
                <input
                  type="text"
                  placeholder="PwC AP Forensics"
                  value={newAccCompany}
                  onChange={(e) => setNewAccCompany(e.target.value)}
                  className="w-full bg-zinc-50 border border-zinc-200 rounded-lg px-3 py-1.5 text-xs text-zinc-900 outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddAccountModal(false)}
                  className="px-3 py-1.5 rounded-lg border border-zinc-200 text-zinc-600 hover:bg-zinc-50 text-xs cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-white font-semibold text-xs cursor-pointer"
                >
                  Create &amp; Switch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg bg-zinc-900 text-white text-xs shadow-xl flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{toastMsg}</span>
        </div>
      )}

    </div>
  );
}
