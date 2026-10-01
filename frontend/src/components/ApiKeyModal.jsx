import React, { useState } from 'react';
import { 
  X, 
  Key, 
  Check, 
  ExternalLink, 
  AlertCircle,
  Activity,
  Eye,
  EyeOff
} from 'lucide-react';

export default function ApiKeyModal({ 
  isOpen, 
  onClose, 
  backendStatus, 
  onSaveKey 
}) {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [model, setModel] = useState(backendStatus?.model || 'gemini-3.5-flash');
  const [isSaving, setIsSaving] = useState(false);
  const [isTesting, setIsTesting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleTestConnection = async () => {
    setIsTesting(true);
    setTestResult(null);
    setErrorMsg('');

    try {
      const res = await fetch('/api/config/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ apiKey: apiKey.trim(), model })
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Connection failed.');
      }
      setTestResult({
        success: true,
        message: data.message || `Connected to ${data.model} successfully!`
      });
    } catch (err) {
      setTestResult({
        success: false,
        message: err.message
      });
    } finally {
      setIsTesting(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!apiKey.trim() && !backendStatus?.hasGeminiKey) {
      setErrorMsg('Please enter a valid Gemini API Key.');
      return;
    }

    setIsSaving(true);
    setErrorMsg('');

    try {
      await onSaveKey({ apiKey: apiKey.trim(), model });
      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 1200);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update API key configuration.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
      <div 
        className="w-full max-w-md rounded-lg bg-zinc-900 border border-zinc-800 shadow-2xl p-5 relative"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
          <div>
            <h3 className="text-sm font-semibold text-zinc-100">
              Extraction Engine Settings
            </h3>
            <p className="text-[11px] text-zinc-500 mt-0.5">
              Configure Google Gemini multimodal API credentials
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Engine Status Line */}
        <div className="mt-3.5 px-3 py-2 rounded bg-zinc-950 border border-zinc-800/80 flex items-center justify-between text-xs">
          <span className="text-zinc-500 font-mono text-[11px]">ACTIVE CREDENTIAL:</span>
          {backendStatus?.hasGeminiKey ? (
            <span className="text-emerald-400 font-medium font-mono text-[11px]">
              ● KEY STORED IN .ENV
            </span>
          ) : (
            <span className="text-amber-400 font-medium font-mono text-[11px]">
              ○ DEMO FALLBACK MODE
            </span>
          )}
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="mt-4 space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Google Gemini API Key
            </label>
            <div className="relative flex items-center">
              <input
                type={showKey ? "text" : "password"}
                placeholder={backendStatus?.hasGeminiKey ? "•••••••••••••••••••••••• (Leave blank to keep active)" : "Enter API key..."}
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-600 rounded px-3 py-1.5 text-xs font-mono text-zinc-200 placeholder:text-zinc-600 outline-none pr-8"
              />
              <button
                type="button"
                onClick={() => setShowKey(!showKey)}
                className="absolute right-2.5 text-zinc-500 hover:text-zinc-300"
              >
                {showKey ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
            </div>
            <div className="flex items-center justify-between mt-1 text-[11px] text-zinc-500">
              <span>Saved locally to <code className="text-zinc-400 font-mono">backend/.env</code></span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-zinc-400 hover:text-zinc-200 flex items-center gap-1 underline"
              >
                Get API key <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1">
              Multimodal OCR Engine
            </label>
            <select
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-800 focus:border-zinc-600 rounded px-3 py-1.5 text-xs font-mono text-zinc-200 outline-none cursor-pointer"
            >
              <option value="gemini-3.5-flash">gemini-3.5-flash (Recommended · Multimodal)</option>
              <option value="gemini-3.8-flash">gemini-3.8-flash (High Reasoning Engine)</option>
              <option value="gemini-3.7-flash">gemini-3.7-flash (High Throughput)</option>
              <option value="gemini-3.5-flash-lite">gemini-3.5-flash-lite (Ultra Fast)</option>
              <option value="gemini-flash-latest">gemini-flash-latest (Auto Latest)</option>
            </select>
          </div>

          {/* Test Ping Button */}
          <div>
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={isTesting}
              className="w-full py-1.5 px-3 rounded bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-xs text-zinc-300 font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-50"
            >
              {isTesting ? (
                <>
                  <div className="w-3 h-3 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin"></div>
                  <span>Testing Connection...</span>
                </>
              ) : (
                <>
                  <Activity className="w-3.5 h-3.5 text-zinc-400" />
                  <span>Test Connection &amp; Latency</span>
                </>
              )}
            </button>
          </div>

          {/* Test Feedback */}
          {testResult && (
            <div className={`p-2 rounded border text-xs flex items-center gap-2 ${
              testResult.success 
                ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300' 
                : 'bg-rose-950/40 border-rose-800 text-rose-300'
            }`}>
              {testResult.success ? (
                <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
              ) : (
                <AlertCircle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
              )}
              <span className="leading-tight font-mono text-[11px]">{testResult.message}</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-2 rounded bg-rose-950/40 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {saveSuccess && (
            <div className="p-2 rounded bg-emerald-950/40 border border-emerald-800 text-emerald-300 text-xs flex items-center gap-2 font-medium">
              <Check className="w-3.5 h-3.5 flex-shrink-0" />
              <span>Configuration saved successfully.</span>
            </div>
          )}

          <div className="pt-2 flex items-center gap-2 border-t border-zinc-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-1.5 rounded bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 text-xs font-medium transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex-1 py-1.5 rounded bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              {isSaving ? (
                <div className="w-3 h-3 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <Check className="w-3.5 h-3.5" />
              )}
              <span>Save &amp; Apply</span>
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}
