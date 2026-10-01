import React from 'react';
import UploadPanel from '../components/UploadPanel';
import ResultsViewer from '../components/ResultsViewer';

export default function WorkspacePage({
  onFileUpload,
  isProcessing,
  samples,
  onLoadSample,
  extractedData,
  metadata,
  onReset
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
      {/* Left Column: Document Ingestion (5 cols) */}
      <div className="lg:col-span-5 lg:sticky lg:top-16">
        <UploadPanel 
          onFileUpload={onFileUpload}
          isProcessing={isProcessing}
          samples={samples}
          onLoadSample={onLoadSample}
          currentDoc={metadata?.filename}
        />
      </div>

      {/* Right Column: Financial Auditor Workbench (7 cols) */}
      <div className="lg:col-span-7">
        <ResultsViewer 
          extractedData={extractedData}
          metadata={metadata}
          onReset={onReset}
        />
      </div>
    </div>
  );
}
