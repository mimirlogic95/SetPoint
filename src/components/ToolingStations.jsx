import React from 'react';
import { Wrench, ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight, Layers } from 'lucide-react';

export default function ToolingStations({ stations, fingers, transfer_sets, inventory, familyCode }) {
  const sets = transfer_sets || (Array.isArray(fingers) ? fingers : []);
  // Helper to lookup inventory status for an item code
  const getToolStatus = (itemCode) => {
    if (!inventory || inventory.length === 0) return null;
    return inventory.find(inv => inv.item_code === itemCode);
  };

  const renderStatusBadge = (itemCode) => {
    const inv = getToolStatus(itemCode);
    if (!inv) {
      return (
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
          Standard
        </span>
      );
    }

    if (inv.status === 'Ready') {
      return (
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
          Ready (Rack {inv.position})
        </span>
      );
    }

    if (inv.status === 'In Use') {
      return (
        <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-400"></span>
          Mounted MM-14
        </span>
      );
    }

    return (
      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-950 text-amber-400 border border-amber-800 flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-amber-400"></span>
        {inv.status}
      </span>
    );
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Wrench className="w-5 h-5 text-sky-400" />
          <h2 className="text-base font-bold text-white tracking-wide uppercase">
            Tooling Required by Station (4-Station Cold Former)
          </h2>
        </div>
        <span className="text-xs font-mono bg-sky-950 text-sky-300 px-2.5 py-1 rounded border border-sky-800 font-semibold">
          Family: {familyCode}
        </span>
      </div>

      {/* Sequential Station Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
        {stations && stations.map((st) => (
          <div
            key={st.station_num}
            className="bg-slate-950 border border-slate-800 rounded-lg p-3.5 flex flex-col justify-between hover:border-slate-700 transition"
          >
            <div>
              {/* Station Header */}
              <div className="flex items-center justify-between gap-1 pb-2 border-b border-slate-800">
                <span className="font-mono font-extrabold text-xs text-sky-400 bg-sky-950/80 px-2 py-0.5 rounded border border-sky-800">
                  STATION {st.station_num}
                </span>
                <span className="text-[11px] font-semibold text-slate-300 text-right truncate">
                  {st.description}
                </span>
              </div>

              {/* Tooling List */}
              <div className="py-2.5 flex flex-col gap-2 text-xs">
                {/* Main Die */}
                <div className="flex items-center justify-between gap-1">
                  <span className="text-slate-500 font-mono">Die:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-white">{st.die}</span>
                    {renderStatusBadge(st.die)}
                  </div>
                </div>

                {/* Punch */}
                <div className="flex items-center justify-between gap-1">
                  <span className="text-slate-500 font-mono">Punch:</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono font-bold text-slate-200">{st.punch}</span>
                    {renderStatusBadge(st.punch)}
                  </div>
                </div>

                {/* Punch Pin */}
                <div className="flex items-center justify-between gap-1">
                  <span className="text-slate-500 font-mono">Punch Pin:</span>
                  <span className="font-mono text-slate-300 font-medium">{st.punch_pin}</span>
                </div>

                {/* Spacer */}
                <div className="flex items-center justify-between gap-1">
                  <span className="text-slate-500 font-mono">Spacer:</span>
                  <span className="font-mono text-slate-300">{st.spacer}</span>
                </div>

                {/* KO Pin */}
                <div className="flex items-center justify-between gap-1">
                  <span className="text-slate-500 font-mono">KO Pin:</span>
                  <span className="font-mono text-slate-300">{st.ko_pin}</span>
                </div>
              </div>
            </div>

            {/* Station Notes */}
            {st.notes && (
              <div className="mt-2 pt-2 border-t border-slate-800/80 text-[11px] text-amber-300/90 bg-amber-950/20 p-2 rounded border border-amber-900/30">
                <span className="font-semibold block text-[10px] text-amber-400 uppercase tracking-wider">Note:</span>
                {st.notes}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Transfer Finger Sets Section (MM-14 4-Station Transfer) */}
      <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-3.5 flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-sky-400" />
            <h3 className="text-xs font-bold text-slate-200 tracking-wider uppercase">
              Transfer Finger Sets (4 Transfer Positions)
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            {sets.length > 0 ? `${sets.length} Sets Configured` : 'Standard Mating Pairs'}
          </span>
        </div>

        {/* 4 Compact Transfer Cards */}
        {sets.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {sets.map((set) => (
              <div
                key={set.transfer_num || set.id}
                className="bg-slate-900/90 border border-slate-800/90 rounded-md p-2.5 flex flex-col justify-between gap-2 hover:border-slate-700 transition"
              >
                <div>
                  <div className="flex items-center justify-between gap-1 pb-1.5 border-b border-slate-800/80">
                    <span className="font-mono font-bold text-[11px] text-sky-400 bg-sky-950/80 px-1.5 py-0.5 rounded border border-sky-800">
                      TRANSFER {set.transfer_num}
                    </span>
                    {set.notes && (
                      <span className="text-[10px] text-slate-400 truncate max-w-[120px]" title={set.notes}>
                        {set.notes}
                      </span>
                    )}
                  </div>

                  <div className="py-1.5 flex flex-col gap-1.5 text-xs">
                    {/* Finger A */}
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-slate-500 font-mono text-[11px]">Finger A:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-slate-200 text-xs">{set.finger_a}</span>
                        {renderStatusBadge(set.finger_a)}
                      </div>
                    </div>

                    {/* Finger B */}
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-slate-500 font-mono text-[11px]">Finger B:</span>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-slate-200 text-xs">{set.finger_b}</span>
                        {renderStatusBadge(set.finger_b)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-xs text-slate-500 italic p-2 text-center">
            No transfer finger sets specified for this family.
          </div>
        )}

        {/* Global Family Note fallback if present */}
        {!Array.isArray(fingers) && fingers?.notes && (
          <div className="text-slate-400 text-xs italic bg-slate-900/60 p-2 rounded border border-slate-800/60">
            &ldquo;{fingers.notes}&rdquo;
          </div>
        )}
      </div>
    </div>
  );
}
