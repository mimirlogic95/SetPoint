import React from 'react';
import { History, Award, User, Calendar, Copy, ChevronDown, Check, Info } from 'lucide-react';

export default function SetpointHistory({ runs, familyBaselineRuns, onCloneRun }) {
  const displayRuns = runs && runs.length > 0 ? runs : familyBaselineRuns;
  const isBaselineFallback = (!runs || runs.length === 0) && (familyBaselineRuns && familyBaselineRuns.length > 0);

  if (!displayRuns || displayRuns.length === 0) {
    return (
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 text-center shadow-xl">
        <History className="w-10 h-10 text-slate-600 mx-auto mb-2" />
        <h3 className="text-sm font-bold text-slate-300">No Previous Runs Logged Yet</h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mt-1">
          Be the first operator to establish machine setpoints for this part! Click "Log Run Setpoints" to record what worked.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-xl flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-sky-400" />
          <h2 className="text-base font-bold text-white tracking-wide uppercase">
            Previous Machine Setpoints (What Ran Successfully)
          </h2>
        </div>
        {isBaselineFallback ? (
          <span className="text-xs font-mono bg-amber-950 text-amber-400 px-2.5 py-1 rounded border border-amber-800 flex items-center gap-1.5 font-semibold">
            <Info className="w-3.5 h-3.5" />
            Showing Family Baseline Runs
          </span>
        ) : (
          <span className="text-xs font-mono bg-slate-800 text-slate-300 px-2.5 py-1 rounded border border-slate-700">
            {displayRuns.length} Past Runs Recorded
          </span>
        )}
      </div>

      {/* Comparative Runs Table Container */}
      <div className="overflow-x-auto rounded-lg border border-slate-800 bg-slate-950">
        <table className="w-full text-xs text-left border-collapse">
          <thead>
            {/* Run Header Row */}
            <tr className="bg-slate-900/90 text-slate-300 border-b border-slate-800">
              <th className="p-3 font-semibold uppercase text-slate-400 sticky left-0 bg-slate-900 z-10 min-w-[200px] border-r border-slate-800">
                Machine Parameter (MM-14)
              </th>
              {displayRuns.map((run, idx) => (
                <th key={run.id || idx} className="p-3 min-w-[220px] border-r border-slate-800 last:border-r-0">
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-mono font-bold text-white text-sm">
                      Run #{displayRuns.length - idx}
                    </span>
                    {run.is_golden ? (
                      <span className="flex items-center gap-1 bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                        <Award className="w-3 h-3 text-amber-400" /> Golden Run
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-500 font-mono">Verified</span>
                    )}
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center gap-2">
                    <Calendar className="w-3 h-3 text-slate-500" />
                    <span>{run.run_date}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 flex items-center justify-between mt-1">
                    <span className="flex items-center gap-1 text-slate-300">
                      <User className="w-3 h-3 text-sky-400" />
                      {run.operator_name} ({run.shift} Shift)
                    </span>
                    <button
                      onClick={() => onCloneRun(run)}
                      className="text-[10px] bg-sky-950 hover:bg-sky-900 text-sky-300 border border-sky-800 px-2 py-0.5 rounded transition flex items-center gap-1"
                      title="Clone these setpoints into End-of-Run logger"
                    >
                      <Copy className="w-2.5 h-2.5" /> Clone
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-800/80 font-mono text-[11px]">
            {/* Production Stats */}
            <tr className="bg-slate-900/30">
              <td className="p-2.5 font-bold text-slate-300 sticky left-0 bg-slate-950 border-r border-slate-800">
                Parts Produced / Output
              </td>
              {displayRuns.map((r, i) => (
                <td key={i} className="p-2.5 text-emerald-400 font-bold border-r border-slate-800 last:border-r-0">
                  {r.parts_produced ? `${r.parts_produced.toLocaleString()} pcs` : 'N/A'}
                </td>
              ))}
            </tr>

            {/* Coil / Wire */}
            <tr>
              <td className="p-2.5 font-semibold text-slate-400 sticky left-0 bg-slate-950 border-r border-slate-800">
                Actual Wire Dia / Coil Heat #
              </td>
              {displayRuns.map((r, i) => (
                <td key={i} className="p-2.5 text-slate-200 border-r border-slate-800 last:border-r-0">
                  {r.actual_wire_dia_mm ? `${r.actual_wire_dia_mm} mm` : '—'} &bull; {r.coil_lot || 'Standard Coil'}
                </td>
              ))}
            </tr>

            {/* Section: WEDGES (Punch Travel Depth) */}
            <tr className="bg-slate-900/60 font-sans">
              <td colSpan={displayRuns.length + 1} className="px-3 py-1.5 font-bold text-xs uppercase tracking-wider text-sky-400 bg-sky-950/40 border-y border-slate-800">
                Wedges &bull; Punch Travel Depth (mm)
              </td>
            </tr>
            <tr>
              <td className="p-2 pl-4 text-slate-400 sticky left-0 bg-slate-950 border-r border-slate-800">
                Wedge 1 (ST1 Upset)
              </td>
              {displayRuns.map((r, i) => (
                <td key={i} className="p-2 text-white font-bold border-r border-slate-800 last:border-r-0">
                  {r.wedge_1_mm !== null ? `${r.wedge_1_mm} mm` : '—'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-2 pl-4 text-slate-400 sticky left-0 bg-slate-950 border-r border-slate-800">
                Wedge 2 (ST2 Cone)
              </td>
              {displayRuns.map((r, i) => (
                <td key={i} className="p-2 text-white font-bold border-r border-slate-800 last:border-r-0">
                  {r.wedge_2_mm !== null ? `${r.wedge_2_mm} mm` : '—'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-2 pl-4 text-slate-400 sticky left-0 bg-slate-950 border-r border-slate-800">
                Wedge 3 (ST3 Head Form)
              </td>
              {displayRuns.map((r, i) => (
                <td key={i} className="p-2 text-white font-bold border-r border-slate-800 last:border-r-0">
                  {r.wedge_3_mm !== null ? `${r.wedge_3_mm} mm` : '—'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-2 pl-4 text-slate-400 sticky left-0 bg-slate-950 border-r border-slate-800">
                Wedge 4 (ST4 Coining)
              </td>
              {displayRuns.map((r, i) => (
                <td key={i} className="p-2 text-white font-bold border-r border-slate-800 last:border-r-0">
                  {r.wedge_4_mm ? `${r.wedge_4_mm} mm` : '— (Inactive)'}
                </td>
              ))}
            </tr>

            {/* Section: DIE KNOCKOUT (KO) */}
            <tr className="bg-slate-900/60 font-sans">
              <td colSpan={displayRuns.length + 1} className="px-3 py-1.5 font-bold text-xs uppercase tracking-wider text-sky-400 bg-sky-950/40 border-y border-slate-800">
                Die Knockout &bull; KO Travel (mm)
              </td>
            </tr>
            <tr>
              <td className="p-2 pl-4 text-slate-400 sticky left-0 bg-slate-950 border-r border-slate-800">
                Die KO 1 (Station 1)
              </td>
              {displayRuns.map((r, i) => (
                <td key={i} className="p-2 text-slate-200 border-r border-slate-800 last:border-r-0">
                  {r.die_ko_1_mm !== null ? `${r.die_ko_1_mm} mm` : '—'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-2 pl-4 text-slate-400 sticky left-0 bg-slate-950 border-r border-slate-800">
                Die KO 2 (Station 2)
              </td>
              {displayRuns.map((r, i) => (
                <td key={i} className="p-2 text-slate-200 border-r border-slate-800 last:border-r-0">
                  {r.die_ko_2_mm !== null ? `${r.die_ko_2_mm} mm` : '—'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-2 pl-4 text-slate-400 sticky left-0 bg-slate-950 border-r border-slate-800">
                Die KO 3 (Station 3)
              </td>
              {displayRuns.map((r, i) => (
                <td key={i} className="p-2 text-slate-200 border-r border-slate-800 last:border-r-0">
                  {r.die_ko_3_mm !== null ? `${r.die_ko_3_mm} mm` : '—'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-2 pl-4 text-slate-400 sticky left-0 bg-slate-950 border-r border-slate-800">
                Die KO 4 (Station 4)
              </td>
              {displayRuns.map((r, i) => (
                <td key={i} className="p-2 text-slate-200 border-r border-slate-800 last:border-r-0">
                  {r.die_ko_4_mm ? `${r.die_ko_4_mm} mm` : '—'}
                </td>
              ))}
            </tr>

            {/* Section: FEED & STOPPER */}
            <tr className="bg-slate-900/60 font-sans">
              <td colSpan={displayRuns.length + 1} className="px-3 py-1.5 font-bold text-xs uppercase tracking-wider text-sky-400 bg-sky-950/40 border-y border-slate-800">
                Feed & Stopper Cutoff Settings (mm)
              </td>
            </tr>
            <tr>
              <td className="p-2 pl-4 text-slate-400 sticky left-0 bg-slate-950 border-r border-slate-800">
                Stopper Position
              </td>
              {displayRuns.map((r, i) => (
                <td key={i} className="p-2 text-slate-200 font-bold border-r border-slate-800 last:border-r-0">
                  {r.stopper_mm !== null ? `${r.stopper_mm} mm` : '—'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-2 pl-4 text-slate-400 sticky left-0 bg-slate-950 border-r border-slate-800">
                Feed Stroke Length
              </td>
              {displayRuns.map((r, i) => (
                <td key={i} className="p-2 text-slate-200 font-bold border-r border-slate-800 last:border-r-0">
                  {r.feed_mm !== null ? `${r.feed_mm} mm` : '—'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-2 pl-4 text-slate-400 sticky left-0 bg-slate-950 border-r border-slate-800">
                Cutoff Slug Length
              </td>
              {displayRuns.map((r, i) => (
                <td key={i} className="p-2 text-slate-200 border-r border-slate-800 last:border-r-0">
                  {r.cutoff_length_mm !== null ? `${r.cutoff_length_mm} mm` : '—'}
                </td>
              ))}
            </tr>

            {/* Section: PRESSURES */}
            <tr className="bg-slate-900/60 font-sans">
              <td colSpan={displayRuns.length + 1} className="px-3 py-1.5 font-bold text-xs uppercase tracking-wider text-sky-400 bg-sky-950/40 border-y border-slate-800">
                Pneumatic / Hydraulic Grip Pressures
              </td>
            </tr>
            <tr>
              <td className="p-2 pl-4 text-slate-400 sticky left-0 bg-slate-950 border-r border-slate-800">
                Feed Roll Pressure
              </td>
              {displayRuns.map((r, i) => (
                <td key={i} className="p-2 text-emerald-400 font-bold border-r border-slate-800 last:border-r-0">
                  {r.feed_roll_pressure !== null ? `${r.feed_roll_pressure} PSI` : '—'}
                </td>
              ))}
            </tr>
            <tr>
              <td className="p-2 pl-4 text-slate-400 sticky left-0 bg-slate-950 border-r border-slate-800">
                Finger Clamp Pressure
              </td>
              {displayRuns.map((r, i) => (
                <td key={i} className="p-2 text-emerald-400 font-bold border-r border-slate-800 last:border-r-0">
                  {r.finger_clamp_pressure !== null ? `${r.finger_clamp_pressure} PSI` : '—'}
                </td>
              ))}
            </tr>

            {/* Section: OPERATOR NOTES */}
            <tr className="bg-slate-900/60 font-sans">
              <td colSpan={displayRuns.length + 1} className="px-3 py-1.5 font-bold text-xs uppercase tracking-wider text-amber-400 bg-amber-950/30 border-y border-slate-800">
                What Worked &bull; Operator Adjustments & Tips
              </td>
            </tr>
            <tr>
              <td className="p-2.5 font-semibold text-slate-400 sticky left-0 bg-slate-950 border-r border-slate-800 font-sans">
                Operator Run Notes
              </td>
              {displayRuns.map((r, i) => (
                <td key={i} className="p-2.5 text-slate-300 font-sans text-xs border-r border-slate-800 last:border-r-0 align-top">
                  {r.notes ? (
                    <div className="bg-slate-900 p-2 rounded border border-slate-800 text-[11px] leading-relaxed">
                      &ldquo;{r.notes}&rdquo;
                    </div>
                  ) : (
                    <span className="text-slate-600 italic">No notes recorded</span>
                  )}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
