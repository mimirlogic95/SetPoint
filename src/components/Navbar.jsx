import React, { useState, useEffect, useRef } from 'react';
import { Search, Wrench, PlusCircle, Box, AlertCircle, RefreshCw, Layers } from 'lucide-react';

export default function Navbar({
  parts,
  selectedPart,
  onSelectPart,
  families,
  selectedFamily,
  onSelectFamily,
  onOpenLogModal,
  onOpenToolroomModal
}) {
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const searchInputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Keyboard shortcut '/' to search
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === '/' && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        setShowDropdown(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Filter parts for dropdown
  const filteredParts = parts.filter(p => {
    const matchesSearch = search === '' ||
      p.part_number.toLowerCase().includes(search.toLowerCase()) ||
      p.family.toLowerCase().includes(search.toLowerCase()) ||
      (p.drawing_no && p.drawing_no.toLowerCase().includes(search.toLowerCase()));
    
    const matchesFamily = selectedFamily === 'All' || p.family === selectedFamily;
    return matchesSearch && matchesFamily;
  });

  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 shadow-lg">
      {/* Top Banner */}
      <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        {/* Brand & Machine */}
        <div className="flex items-center gap-3">
          <div className="bg-sky-600 text-white p-2 rounded-lg shadow-md flex items-center justify-center">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold tracking-wider text-base text-white">MIMIR METALS</span>
              <span className="bg-sky-950 text-sky-400 text-xs px-2 py-0.5 rounded font-mono font-bold border border-sky-800">
                SHOP FLOOR ASSISTANT
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
              <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>Machine #14 &bull; JBF-30B4SUL (Warren, MI)</span>
            </div>
          </div>
        </div>

        {/* Center: Search Bar with Autocomplete */}
        <div className="relative flex-1 max-w-md" ref={dropdownRef}>
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Scan or type Part Number (e.g. MM-250-075-WS) [Press /]"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              className="w-full pl-9 pr-14 py-2 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent font-mono uppercase tracking-wide"
            />
            <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-slate-800 border border-slate-700 text-slate-400 text-xs px-1.5 py-0.5 rounded">
              /
            </kbd>
          </div>

          {/* Autocomplete Dropdown */}
          {showDropdown && (
            <div className="absolute left-0 right-0 mt-1 bg-slate-900 border border-slate-700 rounded-lg shadow-2xl max-h-80 overflow-y-auto z-50 divide-y divide-slate-800">
              <div className="p-2 text-xs font-semibold text-slate-400 bg-slate-950 flex justify-between">
                <span>Matching Parts ({filteredParts.length})</span>
                <span className="text-slate-500">Click to select</span>
              </div>
              {filteredParts.length === 0 ? (
                <div className="p-4 text-center text-sm text-slate-400">
                  No parts found matching "{search}"
                </div>
              ) : (
                filteredParts.map((p) => (
                  <button
                    key={p.part_number}
                    onClick={() => {
                      onSelectPart(p.part_number);
                      setShowDropdown(false);
                      setSearch('');
                    }}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-slate-800 flex items-center justify-between transition-colors ${
                      selectedPart?.part_number === p.part_number ? 'bg-sky-950/60 border-l-4 border-sky-500' : ''
                    }`}
                  >
                    <div>
                      <div className="font-mono font-bold text-sky-400">{p.part_number}</div>
                      <div className="text-xs text-slate-400">
                        {p.family} &bull; OAL: {p.oal_in}" &bull; Wire: {p.wire_dia_in}"
                      </div>
                    </div>
                    <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2 py-0.5 rounded border border-slate-700">
                      {p.drawing_no}
                    </span>
                  </button>
                ))
              )}
            </div>
          )}
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-2">
          {/* Toolroom Inventory Button */}
          <button
            onClick={onOpenToolroomModal}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded-lg border border-slate-700 transition shadow"
            title="Inspect Digital Toolroom Inventory"
          >
            <Box className="w-3.5 h-3.5 text-sky-400" />
            <span className="hidden sm:inline">Toolroom Crib</span>
          </button>

          {/* Log New Setpoint Button */}
          <button
            onClick={onOpenLogModal}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-md transition transform active:scale-95"
            title="Log verified setpoints at the end of the run"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Log Run Setpoints</span>
          </button>
        </div>
      </div>

      {/* Family Quick Tabs */}
      <div className="max-w-7xl mx-auto px-4 py-1.5 flex items-center gap-1.5 overflow-x-auto border-t border-slate-800/80 text-xs scrollbar-none">
        <span className="text-slate-500 font-semibold uppercase tracking-wider text-[10px] mr-1 flex items-center gap-1">
          <Layers className="w-3 h-3" /> Family:
        </span>
        <button
          onClick={() => onSelectFamily('All')}
          className={`px-2.5 py-1 rounded font-medium whitespace-nowrap transition-colors ${
            selectedFamily === 'All'
              ? 'bg-sky-500 text-white font-bold shadow'
              : 'bg-slate-800/70 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
          }`}
        >
          All ({parts.length})
        </button>
        {families.map((f) => (
          <button
            key={f.family}
            onClick={() => onSelectFamily(f.family)}
            className={`px-2.5 py-1 rounded font-medium whitespace-nowrap transition-colors ${
              selectedFamily === f.family
                ? 'bg-sky-500 text-white font-bold shadow'
                : 'bg-slate-800/70 text-slate-400 hover:bg-slate-800 hover:text-slate-200'
            }`}
          >
            {f.family} ({f.part_count})
          </button>
        ))}
      </div>
    </header>
  );
}
