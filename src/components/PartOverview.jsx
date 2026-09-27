import React from 'react';
import { Tag, Cpu, FileText, CheckCircle2, ChevronRight, Gauge } from 'lucide-react';

export default function PartOverview({ part, onSelectPart, partsInFamily }) {
  if (!part) return null;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl">
      {/* Top Header Row */}
      <div className="flex flex-wrap items-start justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="text-2xl md:text-3xl font-black font-mono text-white tracking-wider">
              {part.part_number}
            </span>
            <span className="bg-sky-950 text-sky-400 font-semibold text-xs px-2.5 py-1 rounded-full border border-sky-800">
              {part.family}
            </span>
            <span className="bg-slate-800 text-slate-300 font-mono text-xs px-2.5 py-1 rounded border border-slate-700">
              Drg: {part.drawing_no}
            </span>
          </div>
          <div className="text-xs text-slate-400 mt-1 flex items-center gap-3">
            <span>Machine Target: <strong className="text-slate-200">{part.machine || 'MM-14'}</strong> (4-Station Cold Former)</span>
            <span>&bull;</span>
            <span>Material: <strong className="text-slate-200">{part.material || 'SAE 1010 CD'}</strong></span>
            <span>&bull;</span>
            <span>Finish: <strong className="text-slate-200">{part.finish || 'As-forged'}</strong></span>
          </div>
        </div>

        {/* Quick Length Switcher in Same Family */}
        {partsInFamily && partsInFamily.length > 1 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-xs text-slate-500 font-semibold mr-1">Other Lengths:</span>
            {partsInFamily.map((p) => (
              <button
                key={p.part_number}
                onClick={() => onSelectPart(p.part_number)}
                className={`text-xs px-2 py-1 rounded font-mono transition ${
                  p.part_number === part.part_number
                    ? 'bg-sky-600 text-white font-bold'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
                title={`Switch to ${p.part_number} (${p.oal_in}" OAL)`}
              >
                {p.oal_in}"
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Engineering Specs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 pt-4">
        {/* Wire Diameter */}
        <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
          <div className="text-[11px] font-semibold uppercase text-slate-500 tracking-wider">Wire Dia</div>
          <div className="text-lg font-bold font-mono text-white mt-0.5">
            {part.wire_dia_in}"
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            {part.wire_dia_frac}" / {(part.wire_dia_in * 25.4).toFixed(2)} mm
          </div>
        </div>

        {/* Overall Length (OAL) */}
        <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
          <div className="text-[11px] font-semibold uppercase text-slate-500 tracking-wider">OAL (Length)</div>
          <div className="text-lg font-bold font-mono text-sky-400 mt-0.5">
            {part.oal_in}"
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            &plusmn;{part.oal_tol_in}" ({(part.oal_in * 25.4).toFixed(1)} mm)
          </div>
        </div>

        {/* Shank Diameter */}
        <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
          <div className="text-[11px] font-semibold uppercase text-slate-500 tracking-wider">Shank Dia</div>
          <div className="text-lg font-bold font-mono text-white mt-0.5">
            {part.shank_dia_in}"
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            &plusmn;{part.shank_dia_tol_in}"
          </div>
        </div>

        {/* Head Diameter */}
        <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
          <div className="text-[11px] font-semibold uppercase text-slate-500 tracking-wider">Head Dia</div>
          <div className="text-lg font-bold font-mono text-white mt-0.5">
            {part.head_dia_in}"
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            &plusmn;{part.head_dia_tol_in}"
          </div>
        </div>

        {/* Head Height */}
        <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
          <div className="text-[11px] font-semibold uppercase text-slate-500 tracking-wider">Head Height</div>
          <div className="text-lg font-bold font-mono text-white mt-0.5">
            {part.head_height_in}"
          </div>
          <div className="text-[11px] text-slate-400 font-mono">
            &plusmn;{part.head_height_tol_in}"
          </div>
        </div>

        {/* Material & Hardness */}
        <div className="bg-slate-950/70 p-2.5 rounded-lg border border-slate-800">
          <div className="text-[11px] font-semibold uppercase text-slate-500 tracking-wider">Hardness & Tensile</div>
          <div className="text-sm font-bold font-mono text-emerald-400 mt-1">
            {part.hardness_hrb} HRB
          </div>
          <div className="text-[11px] text-slate-400 font-mono truncate" title={`${part.tensile_psi_min?.toLocaleString()} PSI Tensile / ${part.yield_psi_min?.toLocaleString()} PSI Yield`}>
            {part.tensile_psi_min ? `${Math.round(part.tensile_psi_min / 1000)}k PSI` : 'SAE 1010'}
          </div>
        </div>
      </div>
    </div>
  );
}
