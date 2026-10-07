import staticParts from './data/parts.json';
import staticTooling from './data/tooling.json';
import staticRuns from './data/runs.json';
import staticInventory from './data/inventory.json';

const LOCAL_STORAGE_RUNS_KEY = 'mimir_operator_logged_runs';

// Helper to get custom runs saved in localStorage on Netlify / offline
function getLocalRuns() {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_RUNS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    console.error('Failed to read localStorage runs', e);
    return [];
  }
}

function saveLocalRun(runData) {
  try {
    const runs = getLocalRuns();
    const newRun = {
      ...runData,
      id: Date.now(),
      created_at: new Date().toISOString()
    };
    runs.unshift(newRun);
    localStorage.setItem(LOCAL_STORAGE_RUNS_KEY, JSON.stringify(runs));
    return newRun;
  } catch (e) {
    console.error('Failed to save to localStorage', e);
    return runData;
  }
}

// Map family name to code
function getFamilyCode(family) {
  const map = {
    '1/4" Weld Stud': 'MM-250-WS',
    '5/16" Weld Stud': 'MM-312-WS',
    '3/8" Weld Stud': 'MM-375-WS',
    '1/2" Weld Stud': 'MM-500-WS',
    '9/16" Weld Stud': 'MM-562-WS',
    '5/8" Weld Stud': 'MM-625-WS'
  };
  return map[family] || 'MM-250-WS';
}

export async function fetchParts(search = '', family = 'All') {
  try {
    const res = await fetch(`/api/parts?family=${encodeURIComponent(family)}&search=${encodeURIComponent(search)}`);
    if (res.ok) return await res.json();
  } catch (e) {
    // Fall back to static data (Netlify mode)
  }

  return staticParts.filter(p => {
    const matchesFamily = family === 'All' || p.family === family;
    const matchesSearch = !search ||
      p.part_number.toLowerCase().includes(search.toLowerCase()) ||
      p.family.toLowerCase().includes(search.toLowerCase()) ||
      (p.drawing_no && p.drawing_no.toLowerCase().includes(search.toLowerCase()));
    return matchesFamily && matchesSearch;
  });
}

export async function fetchFamilies() {
  try {
    const res = await fetch('/api/families');
    if (res.ok) return await res.json();
  } catch (e) {
    // Fall back to static data
  }

  const counts = {};
  for (const p of staticParts) {
    counts[p.family] = (counts[p.family] || 0) + 1;
  }
  return Object.keys(counts).map(f => ({
    family: f,
    part_count: counts[f]
  }));
}

export async function fetchPartDetail(partNumber) {
  try {
    const res = await fetch(`/api/parts/${encodeURIComponent(partNumber)}`);
    if (res.ok) return await res.json();
  } catch (e) {
    // Fall back to static data
  }

  const part = staticParts.find(p => p.part_number.toLowerCase() === partNumber.toLowerCase());
  if (!part) throw new Error(`Part ${partNumber} not found.`);

  const familyCode = getFamilyCode(part.family);

  // Tooling stations
  const stations = staticTooling.stations.filter(s => s.part_family === familyCode);
  const transfer_sets = (staticTooling.transfer_sets || staticTooling.fingers || [])
    .filter(f => f.part_family === familyCode)
    .sort((a, b) => a.transfer_num - b.transfer_num);

  // Runs: combine static baseline runs with any runs saved in localStorage
  const localRuns = getLocalRuns().filter(r => r.part_number.toLowerCase() === partNumber.toLowerCase());
  const fileRuns = staticRuns.filter(r => r.part_number.toLowerCase() === partNumber.toLowerCase());
  const runs = [...localRuns, ...fileRuns];

  let familyBaselineRuns = [];
  if (runs.length === 0) {
    familyBaselineRuns = staticRuns.filter(r => {
      const parent = staticParts.find(p => p.part_number.toLowerCase() === r.part_number.toLowerCase());
      return parent && parent.family === part.family;
    });
  }

  // Toolroom inventory
  const toolCodes = [];
  for (const st of stations) {
    if (st.die) toolCodes.push(st.die);
    if (st.punch) toolCodes.push(st.punch);
    if (st.punch_pin) toolCodes.push(st.punch_pin);
    if (st.spacer) toolCodes.push(st.spacer);
    if (st.ko_pin) toolCodes.push(st.ko_pin);
  }
  for (const ts of transfer_sets) {
    if (ts.finger_a) toolCodes.push(ts.finger_a);
    if (ts.finger_b) toolCodes.push(ts.finger_b);
  }
  const inventory = staticInventory.filter(item => toolCodes.includes(item.item_code));

  return {
    part,
    familyCode,
    stations,
    transfer_sets,
    fingers: transfer_sets,
    runs,
    familyBaselineRuns,
    inventory
  };
}

export async function logRunSetpoints(payload) {
  try {
    const res = await fetch('/api/setpoints', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    // On Netlify / static deployment, save to localStorage
  }

  const saved = saveLocalRun(payload);
  return {
    success: true,
    id: saved.id,
    message: `Successfully logged run setpoints for ${payload.part_number} (Saved locally).`
  };
}

export async function fetchInventory() {
  try {
    const res = await fetch('/api/inventory');
    if (res.ok) return await res.json();
  } catch (e) {
    // Fall back to static data
  }
  return staticInventory;
}
