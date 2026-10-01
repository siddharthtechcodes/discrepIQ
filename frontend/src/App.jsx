import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import UploadPanel from './components/UploadPanel';
import ResultsViewer from './components/ResultsViewer';
import ApiKeyModal from './components/ApiKeyModal';
import { 
  Sparkles, 
  AlertCircle, 
  CheckCircle2, 
  Info,
  Scale,
  ShieldCheck,
  Zap,
  BarChart3
} from 'lucide-react';

const API_BASE = '/api';

export default function App() {
  const [backendStatus, setBackendStatus] = useState(null);
  const [samples, setSamples] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedData, setExtractedData] = useState(null);
  const [metadata, setMetadata] = useState(null);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (message, type = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4000);
  };

  const fetchHealth = async () => {
    try {
      const res = await fetch(`${API_BASE}/health`);
      if (res.ok) {
        const data = await res.json();
        setBackendStatus(data);
      } else {
        setBackendStatus({ status: 'error', hasGeminiKey: false });
      }
    } catch (err) {
      console.error('Failed to reach backend:', err);
      setBackendStatus({ status: 'error', hasGeminiKey: false });
    }
  };

  const fetchSamples = async () => {
    try {
      const res = await fetch(`${API_BASE}/documents/samples`);
      if (res.ok) {
        const data = await res.json();
        setSamples(data.samples || []);
      }
    } catch (err) {
      console.warn('Could not fetch sample documents:', err);
    }
  };

  useEffect(() => {
    fetchHealth();
    fetchSamples();
    const interval = setInterval(fetchHealth, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleFileUpload = async (file) => {
    setIsProcessing(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${API_BASE}/documents/process`, {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || `Server responded with ${response.status}`);
      }

      setExtractedData(result.data);
      setMetadata(result.metadata || {
        filename: file.name,
        size: file.size,
        processedAt: new Date().toISOString(),
        mode: result.data?.isDemoMode ? 'demo_fallback' : 'gemini_live'
      });

      if (result.metadata?.mode === 'gemini_live') {
        showToast('Document analyzed successfully with Gemini 3.5 Vision!', 'success');
      } else {
        showToast('Document analyzed in demo mode. (Configure key for live model)', 'info');
      }
    } catch (error) {
      console.error('Processing error:', error);
      showToast(error.message || 'Error processing document with Gemini.', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleLoadSample = (sample) => {
    setExtractedData(sample.data);
    setMetadata({
      filename: sample.name,
      processedAt: new Date().toISOString(),
      mode: 'sample_preset'
    });
    showToast(`Loaded "${sample.name}" for inspection`, 'success');
  };

  const handleSaveKey = async ({ apiKey, model }) => {
    const res = await fetch(`${API_BASE}/config/key`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey, model })
    });
    const result = await res.json();
    if (!res.ok || !result.success) {
      throw new Error(result.error || 'Failed to save API key');
    }
    await fetchHealth();
    showToast('Gemini API key & model activated successfully!', 'success');
  };

  const handleReset = () => {
    setExtractedData(null);
    setMetadata(null);
    showToast('Document workspace reset', 'info');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white relative">
      
      {/* Background ambient lighting effects */}
      <div className="fixed top-0 left-1/4 w-[500px] h-[500px] bg-indigo-600/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="fixed bottom-1/4 right-1/4 w-[500px] h-[500px] bg-cyan-600/10 rounded-full blur-[140px] pointer-events-none"></div>

      {/* Header */}
      <Header 
        backendStatus={backendStatus}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onRefreshStatus={fetchHealth}
        isLoading={isProcessing}
        samples={samples}
        onSelectSample={handleLoadSample}
      />

      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce-short">
          <div className={`flex items-center gap-2.5 px-4 py-3 rounded-xl shadow-2xl text-xs font-semibold border backdrop-blur-lg ${
            toast.type === 'success' 
              ? 'bg-emerald-950/90 border-emerald-500/40 text-emerald-200' 
              : toast.type === 'error'
              ? 'bg-rose-950/90 border-rose-500/40 text-rose-200'
              : 'bg-slate-900/90 border-slate-700 text-slate-200'
          }`}>
            {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
            {toast.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-400" />}
            {toast.type === 'info' && <Info className="w-4 h-4 text-cyan-400" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Top Hero Section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-xs font-bold mb-2.5">
              <Scale className="w-3.5 h-3.5 text-cyan-400" />
              Automated Financial Discrepancy Auditor
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Discrep<span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-teal-300">IQ</span> Document Intelligence
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              Extract line items with Google Gemini Vision, audit mathematical reconciliation in real time, flag arithmetic discrepancies, and export verified JSON/CSV.
            </p>
          </div>

          {/* Quick Metrics Bar */}
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-right">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold block">Engine</span>
              <span className="text-xs font-mono font-bold text-indigo-300 flex items-center gap-1 justify-end">
                <Sparkles className="w-3 h-3 text-cyan-400" />
                {backendStatus?.model || 'Gemini 3.5'}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-right">
              <span className="text-[10px] uppercase tracking-wider text-slate-500 font-semibold block">Audit Precision</span>
              <span className="text-xs font-mono font-bold text-emerald-400 flex items-center gap-1 justify-end">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                100% Math Reconciled
              </span>
            </div>
          </div>
        </div>

        {/* 2-Column Split Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Upload & Sample Pickers (4 of 12 cols on desktop) */}
          <div className="lg:col-span-4 lg:sticky lg:top-24">
            <UploadPanel 
              onFileUpload={handleFileUpload}
              isProcessing={isProcessing}
              samples={samples}
              onLoadSample={handleLoadSample}
              hasGeminiKey={backendStatus?.hasGeminiKey}
            />
          </div>

          {/* Right Column: Extracted Results, Table & Validation (8 of 12 cols on desktop) */}
          <div className="lg:col-span-8">
            <ResultsViewer 
              extractedData={extractedData}
              metadata={metadata}
              onReset={handleReset}
            />
          </div>

        </div>

      </main>

      {/* Settings Modal */}
      <ApiKeyModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        backendStatus={backendStatus}
        onSaveKey={handleSaveKey}
      />

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/90 py-6 mt-12 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 DiscrepIQ · Intelligent Multimodal Document Processing &amp; Discrepancy Auditor</p>
          <p className="flex items-center gap-1">
            Powered by <span className="text-indigo-400 font-semibold">Google Gemini 3.5 Flash</span> &amp; React Vite
          </p>
        </div>
      </footer>

    </div>
  );
}
