import React, { useState, useEffect } from 'react';
import { X, Box, Search, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import { fetchInventory } from '../api.js';

export default function ToolroomModal({ isOpen, onClose }) {
  const [inventory, setInventory] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      fetchInventory()
        .then(data => {
          setInventory(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Failed to load inventory', err);
          setLoading(false);
        });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const filteredItems = inventory.filter(item => {
    const matchesSearch = search === '' ||
      item.item_code.toLowerCase().includes(search.toLowerCase()) ||
      item.diameter.toLowerCase().includes(search.toLowerCase()) ||
      (item.station && item.station.toLowerCase().includes(search.toLowerCase())) ||
      (item.position && item.position.toLowerCase().includes(search.toLowerCase()));

    const matchesStatus = filterStatus === 'All' || item.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
        {/* Header */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-sky-950 text-sky-400 rounded-lg border border-sky-800">
              <Box className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Digital Toolroom & Die Crib</h3>
              <p className="text-xs text-slate-400">
                Machine MM-14 (JBF-30B4SUL) Die & Punch Inventory Status
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters Toolbar */}
        <div className="p-3 bg-slate-950/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search tooling ID, station, rack position..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            <span className="text-slate-500 text-[11px] font-semibold">Status:</span>
            {['All', 'Ready', 'In Use', 'Repair'].map(st => (
              <button
                key={st}
                onClick={() => setFilterStatus(st)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition ${
                  filterStatus === st
                    ? 'bg-sky-600 text-white font-bold'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Inventory Table */}
        <div className="flex-1 overflow-y-auto p-4 bg-slate-950">
          {loading ? (
            <div className="text-center py-10 text-slate-500 text-xs">Loading toolroom inventory...</div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs">No tooling matches found.</div>
          ) : (
            <div className="overflow-x-auto rounded-lg border border-slate-800">
              <table className="w-full text-xs text-left">
                <thead className="bg-slate-900 text-slate-400 font-semibold border-b border-slate-800">
                  <tr>
                    <th className="p-2.5">Tool ID</th>
                    <th className="p-2.5">Diameter</th>
                    <th className="p-2.5">Station</th>
                    <th className="p-2.5">Crib Position</th>
                    <th className="p-2.5">Status</th>
                    <th className="p-2.5">Qty</th>
                    <th className="p-2.5">Condition Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
                  {filteredItems.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-900/50">
                      <td className="p-2.5 font-bold text-white">{item.item_code}</td>
                      <td className="p-2.5 text-slate-300">{item.diameter}</td>
                      <td className="p-2.5 text-slate-300">{item.station}</td>
                      <td className="p-2.5 text-sky-400">{item.position}</td>
                      <td className="p-2.5">
                        {item.status === 'Ready' && (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 font-bold">
                            Ready
                          </span>
                        )}
                        {item.status === 'In Use' && (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-sky-950 text-sky-400 border border-sky-800 font-bold">
                            In Use (MM-14)
                          </span>
                        )}
                        {item.status === 'Repair' && (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-amber-950 text-amber-400 border border-amber-800 font-bold">
                            Regrind / Repair
                          </span>
                        )}
                      </td>
                      <td className="p-2.5 text-slate-300">{item.quantity}</td>
                      <td className="p-2.5 font-sans text-slate-400">{item.notes || '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-slate-950 p-3 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <span>Total Tooling Records: {filteredItems.length}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
