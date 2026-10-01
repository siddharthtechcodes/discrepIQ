import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import WorkspacePage from './pages/WorkspacePage';
import AnalyticsPage from './pages/AnalyticsPage';
import AuditHistoryPage from './pages/AuditHistoryPage';
import RobotLabPage from './pages/RobotLabPage';
import AuthPage from './pages/AuthPage';
import RobotAssistant from './components/RobotAssistant';
import ApiKeyModal from './components/ApiKeyModal';
import { 
  CheckCircle2, 
  AlertCircle, 
  Info,
  Layers,
  BarChart3,
  History,
  Bot
} from 'lucide-react';

const API_BASE = '/api';

export default function App() {
  const [currentPage, setCurrentPage] = useState('workspace');
  const [currentUser, setCurrentUser] = useState({
    name: 'Siddharth Auditor',
    email: 'siddharth@discrepiq.internal',
    company: 'Global FinTech Audits India Pvt Ltd',
    role: 'Lead AP Auditor'
  });

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
    }, 3500);
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
      console.error('Backend connection error:', err);
      setBackendStatus({ status: 'error', hasGeminiKey: false });
    }
  };

  const fetchSamples = async () => {
    try {
      const res = await fetch(`${API_BASE}/documents/samples`);
      if (res.ok) {
        const data = await res.json();
        const sampleList = data.samples || [];
        setSamples(sampleList);
        
        // Auto-load first sample on initial open if empty for immediate review
        if (!extractedData && sampleList.length > 0) {
          setExtractedData(sampleList[0].data);
          setMetadata({
            filename: sampleList[0].name,
            processedAt: new Date().toISOString(),
            mode: 'sample_preset'
          });
        }
      }
    } catch (err) {
      console.warn('Could not load preset samples:', err);
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

      setCurrentPage('workspace');
      showToast('Document audited successfully.', 'success');
    } catch (error) {
      console.error('Processing error:', error);
      showToast(error.message || 'Audit processing failed.', 'error');
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
    showToast(`Loaded ${sample.name}`, 'info');
  };

  const handleSaveKey = async ({ apiKey, model }) => {
    const res = await fetch(`${API_BASE}/config/key`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ apiKey, model })
    });
    const result = await res.json();
    if (!res.ok || !result.success) {
      throw new Error(result.error || 'Failed to save configuration');
    }
    await fetchHealth();
    showToast('Engine configuration updated.', 'success');
  };

  const handleReset = () => {
    setExtractedData(null);
    setMetadata(null);
    showToast('Document view reset.', 'info');
  };

  const handleLogin = (user) => {
    setCurrentUser(user);
    setCurrentPage('workspace');
    showToast(`Welcome back, ${user.name}`, 'success');
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    showToast('Signed out of auditor session.', 'info');
  };

  const handleSelectHistoryDoc = (record) => {
    // If user clicks a historical record, find matching sample or load mock
    const match = samples.find(s => s.name.toLowerCase().includes('freight') || s.name.toLowerCase().includes('cloud'));
    if (match) {
      handleLoadSample(match);
    }
    setCurrentPage('workspace');
    showToast(`Loaded history record ${record.id}`, 'info');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-zinc-800 selection:text-white">
      
      {/* Top Application Header */}
      <Header 
        backendStatus={backendStatus}
        onOpenSettings={() => setIsSettingsOpen(true)}
        onRefreshStatus={fetchHealth}
        isLoading={isProcessing}
        samples={samples}
        onSelectSample={handleLoadSample}
        currentDocName={metadata?.filename}
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        currentUser={currentUser}
        onSignOut={handleSignOut}
      />

      {/* Workspace Subheader Bar (Shown in workspace mode) */}
      {currentPage === 'workspace' && (
        <div className="bg-zinc-900/60 border-b border-zinc-800/80 px-4 sm:px-6 py-2 flex items-center justify-between text-xs">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[11px]">
              <span>Active Record:</span>
              <span className="text-zinc-200 font-semibold">{metadata?.filename || 'Untitled Document'}</span>
            </div>

            {metadata?.mode && (
              <span className="px-2 py-0.2 rounded text-[10px] font-mono uppercase bg-zinc-800 text-zinc-400 border border-zinc-700">
                {metadata.mode === 'gemini_live' ? 'LIVE OCR' : 'TEST DATA'}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 text-[11px] text-zinc-500 font-mono hidden sm:flex">
            <span>Standard: GST Compliance</span>
            <span>·</span>
            <span>Engine: {backendStatus?.model || 'gemini-3.5-flash'}</span>
            <span>·</span>
            <span>Cur: INR (₹)</span>
          </div>
        </div>
      )}

      {/* Main Dynamic Viewport */}
      <main className="flex-1 max-w-[1600px] w-full mx-auto px-4 sm:px-6 py-5">
        {currentPage === 'workspace' && (
          <WorkspacePage 
            onFileUpload={handleFileUpload}
            isProcessing={isProcessing}
            samples={samples}
            onLoadSample={handleLoadSample}
            extractedData={extractedData}
            metadata={metadata}
            onReset={handleReset}
          />
        )}

        {currentPage === 'analytics' && (
          <AnalyticsPage />
        )}

        {currentPage === 'history' && (
          <AuditHistoryPage 
            onSelectDoc={handleSelectHistoryDoc}
          />
        )}

        {currentPage === 'robot-lab' && (
          <RobotLabPage 
            backendStatus={backendStatus}
          />
        )}

        {currentPage === 'auth' && (
          <AuthPage 
            onLogin={handleLogin}
            onBackToWorkspace={() => setCurrentPage('workspace')}
          />
        )}
      </main>

      {/* Persistent Docked 3D Robot Assistant (active when not in 3D lab or auth) */}
      {currentPage !== 'robot-lab' && currentPage !== 'auth' && (
        <RobotAssistant 
          extractedData={extractedData}
          onNavigateToLab={() => setCurrentPage('robot-lab')}
          isProcessing={isProcessing}
        />
      )}

      {/* Settings Modal */}
      <ApiKeyModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        backendStatus={backendStatus}
        onSaveKey={handleSaveKey}
      />

      {/* Clean Notification Toast */}
      {toast && (
        <div className="fixed bottom-5 left-5 z-50">
          <div className={`flex items-center gap-2 px-3 py-2 rounded shadow-lg text-xs font-mono border backdrop-blur-md ${
            toast.type === 'success' 
              ? 'bg-zinc-900 border-emerald-800 text-emerald-300' 
              : toast.type === 'error'
              ? 'bg-zinc-900 border-rose-800 text-rose-300'
              : 'bg-zinc-900 border-zinc-700 text-zinc-200'
          }`}>
            {toast.type === 'success' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
            {toast.type === 'error' && <AlertCircle className="w-3.5 h-3.5 text-rose-400" />}
            {toast.type === 'info' && <Info className="w-3.5 h-3.5 text-blue-400" />}
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Minimalist Professional Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950 py-3 px-4 sm:px-6 text-xs text-zinc-600 font-mono flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-zinc-400">DiscrepIQ</span>
          <span>·</span>
          <span>Accounts Payable Intelligence Suite</span>
        </div>
        <div className="flex items-center gap-3 text-[11px]">
          <span>Standard: Indian GST Act (CGST/SGST/IGST)</span>
          <span>·</span>
          <span>Currency: INR (₹)</span>
          <span>·</span>
          <span>Precision: IEEE 754 Rounding</span>
        </div>
      </footer>

      {/* Mobile Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-zinc-950/95 border-t border-zinc-800 flex items-center justify-around py-2 px-1 backdrop-blur-md">
        <button
          onClick={() => setCurrentPage('workspace')}
          className={`flex flex-col items-center gap-1 text-[10px] ${currentPage === 'workspace' ? 'text-zinc-100 font-bold' : 'text-zinc-500'}`}
        >
          <Layers className="w-4 h-4" />
          <span>Auditor</span>
        </button>
        <button
          onClick={() => setCurrentPage('analytics')}
          className={`flex flex-col items-center gap-1 text-[10px] ${currentPage === 'analytics' ? 'text-zinc-100 font-bold' : 'text-zinc-500'}`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Analytics</span>
        </button>
        <button
          onClick={() => setCurrentPage('history')}
          className={`flex flex-col items-center gap-1 text-[10px] ${currentPage === 'history' ? 'text-zinc-100 font-bold' : 'text-zinc-500'}`}
        >
          <History className="w-4 h-4" />
          <span>History</span>
        </button>
        <button
          onClick={() => setCurrentPage('robot-lab')}
          className={`flex flex-col items-center gap-1 text-[10px] ${currentPage === 'robot-lab' ? 'text-cyan-400 font-bold' : 'text-zinc-500'}`}
        >
          <Bot className="w-4 h-4" />
          <span>3D Lab</span>
        </button>
      </div>

    </div>
  );
}
