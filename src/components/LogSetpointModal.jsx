import React, { useState, useEffect } from 'react';
import { X, Check, Copy, Award, AlertCircle, Save, Sparkles } from 'lucide-react';
import { logRunSetpoints } from '../api.js';

export default function LogSetpointModal({ isOpen, onClose, part, latestRun, onSaveSuccess }) {
  const [formData, setFormData] = useState({
    operator_name: '',
    shift: '1st',
    parts_produced: '',
    coil_lot: '',
    actual_wire_dia_mm: '',
    cutoff_length_mm: '',
    // Wedges
    wedge_1_mm: '',
    wedge_2_mm: '',
    wedge_3_mm: '',
    wedge_4_mm: '',
    // Die KO
    die_ko_1_mm: '',
    die_ko_2_mm: '',
    die_ko_3_mm: '',
    die_ko_4_mm: '',
    // Feed & Stopper
    stopper_mm: '',
    feed_mm: '',
    // Pressures
    feed_roll_pressure: '',
    finger_clamp_pressure: '',
    // Gaps
    punch_die_gap_1_mm: '',
    punch_die_gap_2_mm: '',
    punch_die_gap_3_mm: '',
    punch_die_gap_4_mm: '',
    // Golden & Notes
    is_golden: false,
    notes: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Pre-fill or clone helper
  const handleCloneFromRun = (sourceRun) => {
    if (!sourceRun) return;
    setFormData(prev => ({
      ...prev,
      actual_wire_dia_mm: sourceRun.actual_wire_dia_mm ?? '',
      cutoff_length_mm: sourceRun.cutoff_length_mm ?? '',
      wedge_1_mm: sourceRun.wedge_1_mm ?? '',
      wedge_2_mm: sourceRun.wedge_2_mm ?? '',
      wedge_3_mm: sourceRun.wedge_3_mm ?? '',
      wedge_4_mm: sourceRun.wedge_4_mm ?? '',
      die_ko_1_mm: sourceRun.die_ko_1_mm ?? '',
      die_ko_2_mm: sourceRun.die_ko_2_mm ?? '',
      die_ko_3_mm: sourceRun.die_ko_3_mm ?? '',
      die_ko_4_mm: sourceRun.die_ko_4_mm ?? '',
      stopper_mm: sourceRun.stopper_mm ?? '',
      feed_mm: sourceRun.feed_mm ?? '',
      feed_roll_pressure: sourceRun.feed_roll_pressure ?? '',
      finger_clamp_pressure: sourceRun.finger_clamp_pressure ?? '',
      punch_die_gap_1_mm: sourceRun.punch_die_gap_1_mm ?? '',
      punch_die_gap_2_mm: sourceRun.punch_die_gap_2_mm ?? '',
      punch_die_gap_3_mm: sourceRun.punch_die_gap_3_mm ?? '',
      punch_die_gap_4_mm: sourceRun.punch_die_gap_4_mm ?? '',
      notes: sourceRun.notes ? `Adjusted from previous: ${sourceRun.notes}` : ''
    }));
  };

  // When modal opens, auto-fill wire dia from part if empty
  useEffect(() => {
    if (isOpen && part) {
      if (latestRun) {
        handleCloneFromRun(latestRun);
      } else if (part.wire_dia_in) {
        setFormData(prev => ({
          ...prev,
          actual_wire_dia_mm: (part.wire_dia_in * 25.4).toFixed(2),
          cutoff_length_mm: (part.oal_in * 25.4).toFixed(1)
        }));
      }
    }
  }, [isOpen, part, latestRun]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.operator_name.trim()) {
      setError('Operator Name is required.');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      const payload = {
        ...formData,
        part_number: part.part_number,
        machine_id: part.machine || 'MM-14'
      };

      const data = await logRunSetpoints(payload);
      if (!data.success) {
        throw new Error(data.error || 'Failed to save setpoints.');
      }

      onSaveSuccess();
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="bg-slate-950 p-4 border-b border-slate-800 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-base text-white">Record What Worked (End of Run)</span>
              <span className="bg-emerald-950 text-emerald-400 font-mono text-xs px-2 py-0.5 rounded border border-emerald-800">
                {part?.part_number}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Log verified machine setpoints from this production run so future operators have an exact reference.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {latestRun && (
              <button
                type="button"
                onClick={() => handleCloneFromRun(latestRun)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-950 hover:bg-sky-900 text-sky-300 text-xs font-semibold rounded-lg border border-sky-800 transition"
                title="Populate inputs from previous run"
              >
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                <span>Clone from Previous Run</span>
              </button>
            )}

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body / Form */}
        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-5 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="bg-rose-950/80 border border-rose-800 text-rose-300 px-4 py-2.5 rounded-lg text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Operator & Run Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Operator Name *
              </label>
              <input
                type="text"
                name="operator_name"
                value={formData.operator_name}
                onChange={handleChange}
                placeholder="e.g. Brian G."
                required
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-sky-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Shift
              </label>
              <select
                name="shift"
                value={formData.shift}
                onChange={handleChange}
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
              >
                <option value="1st">1st Shift (Day)</option>
                <option value="2nd">2nd Shift (Afternoon)</option>
                <option value="3rd">3rd Shift (Night)</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Parts Produced
              </label>
              <input
                type="number"
                name="parts_produced"
                value={formData.parts_produced}
                onChange={handleChange}
                placeholder="e.g. 15000"
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-sky-500 focus:outline-none font-mono"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-1">
                Coil Heat # / Lot
              </label>
              <input
                type="text"
                name="coil_lot"
                value={formData.coil_lot}
                onChange={handleChange}
                placeholder="e.g. HEAT-90442-A"
                className="w-full px-3 py-1.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-sky-500 focus:outline-none font-mono uppercase"
              />
            </div>
          </div>

          {/* Section: Wedges & Punch Travel */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider block mb-2.5">
              Wedges (Punch Travel Depth &bull; mm)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Wedge 1 (ST1 Upset)</label>
                <input
                  type="number"
                  step="0.01"
                  name="wedge_1_mm"
                  value={formData.wedge_1_mm}
                  onChange={handleChange}
                  placeholder="52.0"
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white font-mono focus:ring-1 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Wedge 2 (ST2 Cone)</label>
                <input
                  type="number"
                  step="0.01"
                  name="wedge_2_mm"
                  value={formData.wedge_2_mm}
                  onChange={handleChange}
                  placeholder="58.5"
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white font-mono focus:ring-1 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Wedge 3 (ST3 Head)</label>
                <input
                  type="number"
                  step="0.01"
                  name="wedge_3_mm"
                  value={formData.wedge_3_mm}
                  onChange={handleChange}
                  placeholder="61.0"
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white font-mono focus:ring-1 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Wedge 4 (ST4 Coining)</label>
                <input
                  type="number"
                  step="0.01"
                  name="wedge_4_mm"
                  value={formData.wedge_4_mm}
                  onChange={handleChange}
                  placeholder="44.0"
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white font-mono focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Section: Die Knockout (KO) */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider block mb-2.5">
              Die Knockout (KO Travel &bull; mm)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Die KO 1 (Station 1)</label>
                <input
                  type="number"
                  step="0.1"
                  name="die_ko_1_mm"
                  value={formData.die_ko_1_mm}
                  onChange={handleChange}
                  placeholder="185.0"
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white font-mono focus:ring-1 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Die KO 2 (Station 2)</label>
                <input
                  type="number"
                  step="0.1"
                  name="die_ko_2_mm"
                  value={formData.die_ko_2_mm}
                  onChange={handleChange}
                  placeholder="192.0"
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white font-mono focus:ring-1 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Die KO 3 (Station 3)</label>
                <input
                  type="number"
                  step="0.1"
                  name="die_ko_3_mm"
                  value={formData.die_ko_3_mm}
                  onChange={handleChange}
                  placeholder="148.0"
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white font-mono focus:ring-1 focus:ring-sky-500"
                />
              </div>
              <div>
                <label className="block text-[10px] text-slate-400 mb-1">Die KO 4 (Station 4)</label>
                <input
                  type="number"
                  step="0.1"
                  name="die_ko_4_mm"
                  value={formData.die_ko_4_mm}
                  onChange={handleChange}
                  placeholder="0.0"
                  className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white font-mono focus:ring-1 focus:ring-sky-500"
                />
              </div>
            </div>
          </div>

          {/* Section: Feed, Stopper & Pressures */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 bg-slate-950 p-3.5 rounded-xl border border-slate-800">
            <div>
              <label className="block text-[10px] text-slate-400 mb-1">Stopper (mm)</label>
              <input
                type="number"
                step="0.1"
                name="stopper_mm"
                value={formData.stopper_mm}
                onChange={handleChange}
                placeholder="168.0"
                className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 mb-1">Feed Advance (mm)</label>
              <input
                type="number"
                step="0.1"
                name="feed_mm"
                value={formData.feed_mm}
                onChange={handleChange}
                placeholder="172.5"
                className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 mb-1">Cutoff Length (mm)</label>
              <input
                type="number"
                step="0.1"
                name="cutoff_length_mm"
                value={formData.cutoff_length_mm}
                onChange={handleChange}
                placeholder="19.1"
                className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 mb-1">Feed Roll PSI</label>
              <input
                type="number"
                step="0.5"
                name="feed_roll_pressure"
                value={formData.feed_roll_pressure}
                onChange={handleChange}
                placeholder="45.0"
                className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-[10px] text-slate-400 mb-1">Finger Clamp PSI</label>
              <input
                type="number"
                step="0.5"
                name="finger_clamp_pressure"
                value={formData.finger_clamp_pressure}
                onChange={handleChange}
                placeholder="38.0"
                className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-xs text-white font-mono"
              />
            </div>
          </div>

          {/* Section: Notes & Golden Baseline */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                What Worked &bull; Operator Notes & Adjustments
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-xs text-amber-300">
                <input
                  type="checkbox"
                  name="is_golden"
                  checked={formData.is_golden}
                  onChange={handleChange}
                  className="rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-0 w-4 h-4"
                />
                <span className="font-semibold">Mark as Golden Setup (Standard Baseline)</span>
              </label>
            </div>
            <textarea
              name="notes"
              rows="3"
              value={formData.notes}
              onChange={handleChange}
              placeholder="e.g. Backed off ST2 wedge by .003 to eliminate burr. Increased feed roll pressure to 46 for heavy coil. Ran 20,000 pcs flawlessly."
              className="w-full p-2.5 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:ring-2 focus:ring-sky-500 focus:outline-none"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-lg transition active:scale-95 disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? 'Saving Setpoint...' : 'Save & Establish New Run'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
