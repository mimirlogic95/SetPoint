import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import PartOverview from './components/PartOverview.jsx';
import PrintViewer from './components/PrintViewer.jsx';
import ToolingStations from './components/ToolingStations.jsx';
import SetpointHistory from './components/SetpointHistory.jsx';
import LogSetpointModal from './components/LogSetpointModal.jsx';
import ToolroomModal from './components/ToolroomModal.jsx';
import { Loader2, AlertCircle } from 'lucide-react';
import { fetchParts, fetchFamilies, fetchPartDetail } from './api.js';

export default function App() {
  const [parts, setParts] = useState([]);
  const [families, setFamilies] = useState([]);
  const [selectedFamily, setSelectedFamily] = useState('All');
  const [selectedPartNumber, setSelectedPartNumber] = useState('MM-250-075-WS');
  const [partDetail, setPartDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [error, setError] = useState(null);

  // Modals state
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [isToolroomModalOpen, setIsToolroomModalOpen] = useState(false);
  const [cloneSourceRun, setCloneSourceRun] = useState(null);

  // 1. Initial Load: Parts list & Families
  useEffect(() => {
    async function loadInitialData() {
      try {
        setLoading(true);
        const [partsData, familiesData] = await Promise.all([
          fetchParts(),
          fetchFamilies()
        ]);

        setParts(partsData);
        setFamilies(familiesData);

        if (partsData.length > 0) {
          setSelectedPartNumber(partsData[0].part_number);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, []);

  // 2. Load Part Details whenever selectedPartNumber changes
  const loadPartDetails = async (partNum) => {
    if (!partNum) return;
    try {
      setDetailLoading(true);
      const data = await fetchPartDetail(partNum);
      setPartDetail(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setDetailLoading(false);
    }
  };

  useEffect(() => {
    if (selectedPartNumber) {
      loadPartDetails(selectedPartNumber);
    }
  }, [selectedPartNumber]);

  // Handler when user selects a part
  const handleSelectPart = (partNumber) => {
    setSelectedPartNumber(partNumber);
    // Find part family and adjust if needed
    const p = parts.find(x => x.part_number === partNumber);
    if (p && selectedFamily !== 'All' && p.family !== selectedFamily) {
      setSelectedFamily(p.family);
    }
  };

  // Handler when cloning a run
  const handleCloneRun = (run) => {
    setCloneSourceRun(run);
    setIsLogModalOpen(true);
  };

  // Open clean log modal
  const handleOpenLogModal = () => {
    const latest = partDetail?.runs?.[0] || partDetail?.familyBaselineRuns?.[0] || null;
    setCloneSourceRun(latest);
    setIsLogModalOpen(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-white">
        <Loader2 className="w-10 h-10 text-sky-500 animate-spin mb-4" />
        <div className="font-mono text-lg font-bold">MIMIR METALS — MACHINE #14</div>
        <div className="text-slate-400 text-xs mt-1">Loading shop floor parts & tooling database...</div>
      </div>
    );
  }

  const partsInCurrentFamily = partDetail?.part
    ? parts.filter(p => p.family === partDetail.part.family)
    : [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Navigation Header */}
      <Navbar
        parts={parts}
        selectedPart={partDetail?.part}
        onSelectPart={handleSelectPart}
        families={families}
        selectedFamily={selectedFamily}
        onSelectFamily={setSelectedFamily}
        onOpenLogModal={handleOpenLogModal}
        onOpenToolroomModal={() => setIsToolroomModalOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 flex flex-col gap-6">
        {error && (
          <div className="bg-rose-950/80 border border-rose-800 text-rose-300 p-4 rounded-xl text-sm flex items-center justify-between shadow-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-rose-400" />
              <span>{error}</span>
            </div>
            <button
              onClick={() => setError(null)}
              className="text-xs font-semibold text-rose-400 hover:text-white px-2 py-1 bg-rose-900/50 rounded"
            >
              Dismiss
            </button>
          </div>
        )}

        {detailLoading ? (
          <div className="py-20 flex flex-col items-center justify-center text-slate-400">
            <Loader2 className="w-8 h-8 text-sky-500 animate-spin mb-2" />
            <span className="text-xs font-mono">Loading specs and tooling for {selectedPartNumber}...</span>
          </div>
        ) : partDetail ? (
          <>
            {/* Part Dimension & Material Specs Card */}
            <PartOverview
              part={partDetail.part}
              onSelectPart={handleSelectPart}
              partsInFamily={partsInCurrentFamily}
            />

            {/* Middle Section: Blueprint / Progression Print + Tooling Required by Station */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              {/* Left Column: Blueprint & Progression Print Viewer (7 cols) */}
              <div className="lg:col-span-7">
                <PrintViewer part={partDetail.part} />
              </div>

              {/* Right Column: Tooling by Station (5 cols) */}
              <div className="lg:col-span-5">
                <ToolingStations
                  stations={partDetail.stations}
                  fingers={partDetail.fingers}
                  transfer_sets={partDetail.transfer_sets}
                  inventory={partDetail.inventory}
                  familyCode={partDetail.familyCode}
                />
              </div>
            </div>

            {/* Bottom Section: Previous Machine Setpoints History */}
            <div>
              <SetpointHistory
                runs={partDetail.runs}
                familyBaselineRuns={partDetail.familyBaselineRuns}
                onCloneRun={handleCloneRun}
              />
            </div>
          </>
        ) : null}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800 py-3 text-center text-xs text-slate-500 font-mono">
        Mimir Metals LLC &bull; Machine #14 (JBF-30B4SUL 4-Station Bolt Former) &bull; Warren, MI
      </footer>

      {/* End-of-Run Setpoint Logger Modal */}
      {partDetail && (
        <LogSetpointModal
          isOpen={isLogModalOpen}
          onClose={() => setIsLogModalOpen(false)}
          part={partDetail.part}
          latestRun={cloneSourceRun || partDetail.runs?.[0] || partDetail.familyBaselineRuns?.[0]}
          onSaveSuccess={() => loadPartDetails(selectedPartNumber)}
        />
      )}

      {/* Digital Toolroom Crib Modal */}
      <ToolroomModal
        isOpen={isToolroomModalOpen}
        onClose={() => setIsToolroomModalOpen(false)}
      />
    </div>
  );
}
