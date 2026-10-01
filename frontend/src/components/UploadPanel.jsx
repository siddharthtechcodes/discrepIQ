import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  X, 
  ArrowRight,
  FileCheck,
  AlertTriangle,
  ZoomIn,
  Eye,
  RefreshCw,
  FolderOpen,
  Check
} from 'lucide-react';

export default function UploadPanel({ 
  onFileUpload, 
  isProcessing, 
  samples = [], 
  onLoadSample,
  currentDoc
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
      setUploadError('Invalid document format. Only PDF, JPG, and PNG are supported.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setUploadError('File size exceeds standard 10MB limit.');
      return;
    }

    setSelectedFile(file);

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
    <div className="flex flex-col gap-4">
      
      {/* Document Ingestion Card */}
      <div className="bg-zinc-900/90 rounded-lg border border-zinc-800 overflow-hidden shadow-xs">
        
        {/* Panel Header */}
        <div className="px-4 py-3 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FolderOpen className="w-4 h-4 text-zinc-400" />
            <span className="font-semibold text-xs text-zinc-200 uppercase tracking-wider">
              Document Ingestion
            </span>
          </div>
          <span className="text-[11px] font-mono text-zinc-500">
            PDF, PNG, JPG ≤ 10MB
          </span>
        </div>

        {/* Dropzone or Active File View */}
        <div className="p-4">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => !selectedFile && fileInputRef.current?.click()}
            className={`relative rounded-md border border-dashed transition-all ${
              dragActive
                ? 'border-blue-500 bg-blue-950/20'
                : selectedFile
                ? 'border-zinc-700 bg-zinc-950/60 p-3'
                : 'border-zinc-700 hover:border-zinc-600 bg-zinc-950/40 p-6 cursor-pointer text-center'
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
              <div className="flex flex-col items-center">
                <div className="w-9 h-9 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 mb-2">
                  <Upload className="w-4 h-4" />
                </div>
                <p className="text-xs font-medium text-zinc-200">
                  Drop invoice or receipt here
                </p>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  or <span className="text-zinc-300 underline underline-offset-2">select file from filesystem</span>
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                
                {/* File Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 overflow-hidden">
                    <div className="w-7 h-7 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300 flex-shrink-0">
                      <FileText className="w-4 h-4" />
                    </div>
                    <div className="overflow-hidden">
                      <p className="text-xs font-medium text-zinc-100 truncate font-mono">
                        {selectedFile.name}
                      </p>
                      <p className="text-[11px] text-zinc-500 font-mono">
                        {formatFileSize(selectedFile.size)} · {selectedFile.type || 'application/pdf'}
                      </p>
                    </div>
                  </div>

                  {!isProcessing && (
                    <button
                      onClick={handleClearFile}
                      className="p-1 rounded text-zinc-500 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
                      title="Clear file"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Thumbnail Preview */}
                {filePreview && (
                  <div className="rounded border border-zinc-800 overflow-hidden bg-zinc-950 max-h-48 flex items-center justify-center">
                    <img 
                      src={filePreview} 
                      alt="Document scan" 
                      className="max-h-48 w-auto object-contain"
                    />
                  </div>
                )}

                {/* Primary Action Button */}
                <button
                  disabled={isProcessing}
                  onClick={handleSubmit}
                  className="w-full py-2 px-3 rounded bg-zinc-100 hover:bg-white text-zinc-950 font-semibold text-xs transition-colors flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer shadow-xs"
                >
                  {isProcessing ? (
                    <>
                      <div className="w-3.5 h-3.5 border-2 border-zinc-950 border-t-transparent rounded-full animate-spin"></div>
                      <span>Extracting Entities &amp; Reconciling...</span>
                    </>
                  ) : (
                    <>
                      <span>Run Reconciliation Audit</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Error Message */}
          {uploadError && (
            <div className="mt-2.5 p-2.5 rounded bg-rose-950/40 border border-rose-900/60 flex items-center gap-2 text-xs text-rose-300">
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400 flex-shrink-0" />
              <span>{uploadError}</span>
            </div>
          )}

          {/* Processing Progress Status */}
          {isProcessing && (
            <div className="mt-3 p-3 rounded bg-zinc-950/80 border border-zinc-800 space-y-2">
              <div className="flex items-center justify-between text-[11px] text-zinc-400 font-mono">
                <span>OCR Pipeline</span>
                <span className="text-zinc-200">Reconciling...</span>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-1 overflow-hidden">
                <div className="h-full bg-blue-500 w-3/4 animate-pulse rounded-full"></div>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Preset Verification Scenarios */}
      <div className="bg-zinc-900/90 rounded-lg border border-zinc-800 overflow-hidden shadow-xs">
        <div className="px-4 py-2.5 border-b border-zinc-800 flex items-center justify-between">
          <span className="font-semibold text-xs text-zinc-300 uppercase tracking-wider">
            Verification Scenarios
          </span>
          <span className="text-[11px] font-mono text-zinc-500">Preset Datasets</span>
        </div>

        <div className="divide-y divide-zinc-800/80">
          {samples.map((s) => {
            const isMismatch = s.id === 'mismatch-invoice';
            return (
              <div
                key={s.id}
                onClick={() => onLoadSample(s)}
                className="p-3 hover:bg-zinc-800/40 transition-colors cursor-pointer flex items-center justify-between group"
              >
                <div className="flex items-start gap-2.5 overflow-hidden">
                  <div className={`w-5 h-5 rounded mt-0.5 flex items-center justify-center flex-shrink-0 text-[10px] font-mono font-bold ${
                    isMismatch ? 'bg-amber-950 text-amber-400 border border-amber-800' : 'bg-zinc-800 text-zinc-300'
                  }`}>
                    {isMismatch ? '!' : '✓'}
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-xs font-medium text-zinc-200 group-hover:text-white truncate">
                      {s.name}
                    </p>
                    <p className="text-[11px] text-zinc-500 flex items-center gap-1.5 mt-0.5 font-mono">
                      <span>{s.type}</span>
                      {isMismatch && (
                        <span className="text-amber-400 font-semibold">· +₹6,940 Discrepancy</span>
                      )}
                    </p>
                  </div>
                </div>

                <span className="text-[11px] text-zinc-500 group-hover:text-zinc-300 font-medium">
                  Load →
                </span>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
