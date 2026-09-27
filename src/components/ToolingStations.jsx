import React from 'react';
import { Wrench, ShieldAlert, CheckCircle2, AlertTriangle, ArrowRight, Layers } from 'lucide-react';

export default function ToolingStations({ stations, fingers, inventory, familyCode }) {
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

      {/* Transfer Fingers & Family Caution Footer */}
      <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Fingers */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
            Transfer Fingers:
          </span>
          <span className="font-mono bg-slate-800 text-sky-400 px-2 py-0.5 rounded border border-slate-700 font-bold">
            F1: {fingers?.finger_1 || 'MM-250-F1'}
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
          <span className="font-mono bg-slate-800 text-sky-400 px-2 py-0.5 rounded border border-slate-700 font-bold">
            F2: {fingers?.finger_2 || 'MM-250-F2'}
          </span>
        </div>

        {/* Global Family Note */}
        {fingers?.notes && (
          <div className="text-slate-400 text-xs italic flex-1 min-w-[280px]">
            &ldquo;{fingers.notes}&rdquo;
          </div>
        )}
      </div>
    </div>
  );
}
