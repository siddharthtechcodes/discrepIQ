import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  Sparkles, 
  Check, 
  AlertCircle, 
  X, 
  ArrowRight,
  FileCheck2,
  FileSpreadsheet,
  AlertTriangle,
  FolderOpen
} from 'lucide-react';

export default function UploadPanel({ 
  onFileUpload, 
  isProcessing, 
  samples = [], 
  onLoadSample,
  hasGeminiKey
}) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [filePreview, setFilePreview] = useState(null);
  const [uploadError, setUploadError] = useState(null);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateAndSetFile = (file) => {
    setUploadError(null);
    if (!file) return;

    const validTypes = [
      'application/pdf', 
      'image/jpeg', 
      'image/jpg', 
      'image/png', 
      'image/webp'
    ];

    if (!validTypes.includes(file.type.toLowerCase())) {
      setUploadError('Unsupported format. Please upload a PDF, JPG, or PNG document.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size exceeds 10MB limit. Please upload a smaller document.');
      return;
    }

    setSelectedFile(file);

    // Create thumbnail preview if image
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setFilePreview(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const handleClearFile = (e) => {
    e?.stopPropagation();
    setSelectedFile(null);
    setFilePreview(null);
    setUploadError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!selectedFile || isProcessing) return;
    onFileUpload(selectedFile);
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className="flex flex-col gap-6">
      
      {/* Upload Box */}
      <div className="glass-panel rounded-2xl p-6 relative overflow-hidden border border-slate-800">
        
        {/* Glow accent */}
        <div className="absolute -top-16 -left-16 w-36 h-36 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <UploadCloud className="w-5 h-5 text-indigo-400" />
              Document Ingestion
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Multimodal OCR &amp; Structured Extraction
            </p>
          </div>
          <span className="text-[11px] font-mono text-slate-400 px-2 py-0.5 rounded bg-slate-900 border border-slate-800">
            PDF · PNG · JPG (10MB)
          </span>
        </div>

        {/* Drag & Drop Surface */}
        <div
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => !selectedFile && fileInputRef.current?.click()}
          className={`relative flex flex-col items-center justify-center p-8 rounded-xl border-2 border-dashed transition-all ${
            dragActive
              ? 'border-indigo-400 bg-indigo-950/30 scale-[1.01]'
              : selectedFile
              ? 'border-slate-700 bg-slate-900/60'
              : 'border-slate-800 bg-slate-900/30 hover:border-slate-700 hover:bg-slate-900/50 cursor-pointer'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            onChange={handleChange}
            className="hidden"
          />

          {!selectedFile ? (
            <div className="flex flex-col items-center text-center">
              <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-3 shadow-inner">
                <UploadCloud className="w-7 h-7" />
              </div>
              <p className="text-sm font-semibold text-slate-200">
                Drag &amp; drop document here
              </p>
              <p className="text-xs text-slate-400 mt-1">
                or <span className="text-indigo-400 font-medium underline decoration-indigo-400/30 underline-offset-4 hover:text-indigo-300">browse from computer</span>
              </p>
              
              <div className="flex items-center gap-1.5 mt-4 text-[11px] text-slate-400 font-mono">
                <span className="px-2 py-0.5 rounded bg-slate-800/80">PDF Invoices</span>
                <span className="px-2 py-0.5 rounded bg-slate-800/80">Receipt Photos</span>
                <span className="px-2 py-0.5 rounded bg-slate-800/80">POs</span>
              </div>
            </div>
          ) : (
            <div className="w-full flex flex-col gap-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="flex items-center gap-3 overflow-hidden">
                  {filePreview ? (
                    <img 
                      src={filePreview} 
                      alt="Preview" 
                      className="w-12 h-12 rounded-lg object-cover border border-slate-700 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-lg bg-indigo-950/60 border border-indigo-500/30 flex items-center justify-center text-indigo-400 flex-shrink-0">
                      <FileText className="w-6 h-6" />
                    </div>
                  )}
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-slate-100 truncate" title={selectedFile.name}>
                      {selectedFile.name}
                    </p>
                    <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                      {formatFileSize(selectedFile.size)} · {selectedFile.type || 'application/pdf'}
                    </p>
                  </div>
                </div>

                {!isProcessing && (
                  <button
                    onClick={handleClearFile}
                    className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors ml-2 cursor-pointer"
                    title="Remove file"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Action Process Button */}
              <button
                disabled={isProcessing}
                onClick={handleSubmit}
                className="w-full relative group overflow-hidden rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 p-[1px] font-medium transition-all shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/35 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                <div className="relative w-full py-3 px-4 rounded-[11px] bg-slate-950/80 group-hover:bg-slate-950/30 transition-colors flex items-center justify-center gap-2 text-sm text-white font-bold">
                  {isProcessing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
                      <span>Auditing with Gemini AI...</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4 text-cyan-300" />
                      <span>Audit Document with DiscrepIQ</span>
                      <ArrowRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </div>
              </button>
            </div>
          )}
        </div>

        {/* Upload Error Banner */}
        {uploadError && (
          <div className="mt-3 p-3 rounded-xl bg-rose-950/50 border border-rose-500/30 flex items-center gap-2.5 text-xs text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
            <span>{uploadError}</span>
          </div>
        )}

        {/* Loading Stages Animation during processing */}
        {isProcessing && (
          <div className="mt-4 p-4 rounded-xl bg-slate-900/90 border border-indigo-500/20 space-y-2.5 animate-fadeIn">
            <div className="flex items-center justify-between text-xs text-slate-200 font-medium">
              <span className="flex items-center gap-2 text-indigo-400">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
                Gemini Vision Pipeline Active
              </span>
              <span className="font-mono text-slate-400">Processing</span>
            </div>
            
            <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-indigo-500 w-3/4 animate-pulse rounded-full"></div>
            </div>

            <div className="grid grid-cols-3 gap-2 pt-1 text-[11px] text-slate-400 font-mono">
              <div className="flex items-center gap-1 text-emerald-400">
                <Check className="w-3 h-3" /> Buffered
              </div>
              <div className="flex items-center gap-1 text-indigo-300 animate-pulse">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span> Multimodal OCR
              </div>
              <div className="flex items-center gap-1 text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span> Discrepancy Check
              </div>
            </div>
          </div>
        )}

      </div>

      {/* Preset Sample Documents for instant 1-click test */}
      <div className="glass-panel rounded-2xl p-6 border border-slate-800">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
            Audit Test Scenarios
          </h3>
          <span className="text-[11px] text-slate-400 font-medium">Instant 1-Click</span>
        </div>
        
        <p className="text-xs text-slate-400 mb-3.5">
          Select a pre-loaded business document to test extraction, live table recalculations, and discrepancy warnings:
        </p>

        <div className="space-y-2.5">
          {samples.length > 0 ? (
            samples.map((sample) => {
              const isMismatch = sample.id === 'mismatch-invoice';
              return (
                <button
                  key={sample.id}
                  onClick={() => onLoadSample(sample)}
                  disabled={isProcessing}
                  className={`w-full group text-left p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                    isMismatch
                      ? 'bg-amber-950/20 hover:bg-amber-950/40 border-amber-500/20 hover:border-amber-500/40'
                      : 'bg-slate-900/60 hover:bg-slate-900 border-slate-800/80 hover:border-indigo-500/40'
                  }`}
                >
                  <div className="flex items-center gap-3 overflow-hidden">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      isMismatch 
                        ? 'bg-amber-950/70 text-amber-400 border border-amber-500/30' 
                        : 'bg-indigo-950/70 text-indigo-400 border border-indigo-500/30'
                    }`}>
                      {isMismatch ? <AlertTriangle className="w-4 h-4" /> : <FileCheck2 className="w-4 h-4" />}
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-semibold text-slate-200 group-hover:text-white truncate">
                        {sample.name}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-slate-400">{sample.type}</span>
                        {isMismatch ? (
                          <span className="text-[10px] text-amber-400 font-bold px-1.5 py-0.2 rounded bg-amber-500/10 border border-amber-500/20">
                            Math Warning (€46 Discrepancy)
                          </span>
                        ) : (
                          <span className="text-[10px] text-emerald-400 font-bold px-1.5 py-0.2 rounded bg-emerald-500/10 border border-emerald-500/20">
                            100% Balanced
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <span className="text-xs font-medium text-indigo-400 group-hover:translate-x-0.5 transition-transform flex items-center gap-0.5 ml-2">
                    Inspect <ArrowRight className="w-3 h-3" />
                  </span>
                </button>
              );
            })
          ) : (
            <div className="p-3 text-center text-xs text-slate-500">
              Loading test samples...
            </div>
          )}
        </div>
      </div>

    </div>
  );
}
