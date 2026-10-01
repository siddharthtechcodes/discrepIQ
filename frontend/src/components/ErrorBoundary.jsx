import React from 'react';
import { AlertTriangle, RefreshCw, Home, Layers } from 'lucide-react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('DiscrepIQ ErrorBoundary caught an exception:', error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    try {
      localStorage.removeItem('discrepiq_audit_documents');
    } catch (e) {}
    window.location.href = '/dashboard';
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-6 selection:bg-blue-600 selection:text-white">
          <div className="max-w-lg w-full bg-white border border-slate-200 rounded-2xl p-8 shadow-xl text-center space-y-6">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center mx-auto shadow-sm">
              <AlertTriangle className="w-7 h-7" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl font-black text-slate-900 tracking-tight font-sans">
                Workspace Page Recovered
              </h1>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                The DiscrepIQ resilient audit boundary intercepted a rendering exception and prevented a blank page. You can reload or return to the workspace dashboard.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-left font-mono text-[11px] text-slate-700 max-h-32 overflow-y-auto">
                <span className="font-bold text-rose-600 block mb-1">Details:</span>
                {String(this.state.error.message || this.state.error)}
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={this.handleReload}
                className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-md shadow-blue-600/25"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Reload Page</span>
              </button>

              <button
                type="button"
                onClick={() => { window.location.href = '/dashboard'; }}
                className="px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-300 text-slate-800 font-bold text-xs uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer shadow-xs"
              >
                <Home className="w-3.5 h-3.5 text-blue-600" />
                <span>Go to Dashboard</span>
              </button>

              <button
                type="button"
                onClick={this.handleReset}
                className="px-4 py-2 rounded-xl text-xs font-mono text-slate-500 hover:text-rose-600 underline underline-offset-2 cursor-pointer transition-colors"
                title="Clears corrupted browser cache and reloads default judge preset documents"
              >
                Reset Local Cache
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
