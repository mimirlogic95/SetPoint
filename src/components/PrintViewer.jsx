import React, { useState } from 'react';
import { FileText, Maximize2, Minimize2, ZoomIn, ZoomOut, RotateCw, ExternalLink, Columns, SplitSquareVertical } from 'lucide-react';

export default function PrintViewer({ part }) {
  const [activeTab, setActiveTab] = useState('blueprint'); // 'blueprint' | 'progression' | 'split'
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  if (!part) return null;

  const blueprintUrl = `/prints/${part.blueprint_file || 'MM-250-WS-FAMILY.pdf'}`;
  const progressionUrl = `/prints/${part.progression_file || 'MM-250-WS-PROGRESSION.pdf'}`;

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 25, 50));
  const handleResetZoom = () => {
    setZoom(100);
    setRotation(0);
  };
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);
  const toggleFullscreen = () => setIsFullscreen(!isFullscreen);

  const renderPdfFrame = (url, title, filename) => {
    return (
      <div className="relative w-full h-full flex flex-col bg-slate-950 rounded-lg overflow-hidden border border-slate-800">
        <div className="bg-slate-900/90 px-3 py-1.5 flex items-center justify-between border-b border-slate-800 text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-200">{title}</span>
            <span className="font-mono text-slate-400 text-[11px] bg-slate-800 px-2 py-0.5 rounded">
              {filename}
            </span>
          </div>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-sky-400 hover:text-sky-300 text-[11px] hover:underline"
            title="Open in separate tab"
          >
            <ExternalLink className="w-3 h-3" />
            <span>Open PDF</span>
          </a>
        </div>
        <div className="flex-1 w-full h-full relative overflow-auto bg-slate-950">
          <iframe
            src={`${url}#toolbar=1&navpanes=0&scrollbar=1`}
            title={title}
            className="w-full h-full min-h-[480px] border-none"
            style={{
              transform: rotation !== 0 ? `rotate(${rotation}deg)` : undefined,
              transformOrigin: 'center center'
            }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className={`bg-slate-900 border border-slate-800 rounded-xl shadow-xl flex flex-col ${
      isFullscreen ? 'fixed inset-4 z-50 shadow-2xl ring-4 ring-sky-500/50' : 'h-[600px]'
    }`}>
      {/* Viewer Header / Toolbar */}
      <div className="p-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-900/95 rounded-t-xl">
        {/* Tab Selectors */}
        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setActiveTab('blueprint')}
            className={`px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'blueprint'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Part Blueprint</span>
          </button>

          <button
            onClick={() => setActiveTab('progression')}
            className={`px-3 py-1.5 rounded-md font-semibold flex items-center gap-1.5 transition ${
              activeTab === 'progression'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span>Progression Print</span>
          </button>

          <button
            onClick={() => setActiveTab('split')}
            className={`hidden md:flex px-3 py-1.5 rounded-md font-semibold items-center gap-1.5 transition ${
              activeTab === 'split'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-slate-200'
            }`}
            title="View Blueprint and Progression Side-by-Side"
          >
            <SplitSquareVertical className="w-3.5 h-3.5" />
            <span>Side-by-Side</span>
          </button>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={handleRotate}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition"
            title="Rotate 90 degrees (useful for strip progression)"
          >
            <RotateCw className="w-4 h-4" />
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded border border-slate-700 transition"
            title={isFullscreen ? 'Exit Fullscreen' : 'Expand Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main View Area */}
      <div className="flex-1 p-2 bg-slate-950 overflow-hidden rounded-b-xl">
        {activeTab === 'blueprint' && renderPdfFrame(blueprintUrl, 'Official Part Blueprint', part.blueprint_file)}
        {activeTab === 'progression' && renderPdfFrame(progressionUrl, 'Die Progression Print', part.progression_file)}
        {activeTab === 'split' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-full">
            {renderPdfFrame(blueprintUrl, 'Part Blueprint', part.blueprint_file)}
            {renderPdfFrame(progressionUrl, 'Die Progression Print', part.progression_file)}
          </div>
        )}
      </div>
    </div>
  );
}
