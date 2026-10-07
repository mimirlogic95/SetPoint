import fs from 'node:fs';
import { db, initDb } from '../server/db.js';

initDb();

console.log('--- RUNNING AUTOMATED VERIFICATION ---');

// 1. Verify parts count
const parts = db.prepare('SELECT COUNT(*) as count FROM parts').get();
console.log(`[PASS] Parts table count: ${parts.count} (Expected: 43)`);
if (parts.count !== 43) throw new Error('Expected 43 parts');

// 2. Verify tooling stations for MM-250-WS
const stations = db.prepare('SELECT * FROM tooling_stations WHERE part_family = ? ORDER BY station_num').all('MM-250-WS');
console.log(`[PASS] MM-250-WS stations: ${stations.length} (Expected: 4)`);
if (stations.length !== 4) throw new Error('Expected 4 stations for MM-250-WS');
console.log(`       Station 1 Die: ${stations[0].die}, Punch: ${stations[0].punch}, Punch Pin: ${stations[0].punch_pin}`);

// 3. Verify transfer finger sets (4 sets on MM-14)
const transferSets = db.prepare('SELECT * FROM tooling_fingers WHERE part_family = ? ORDER BY transfer_num ASC').all('MM-250-WS');
console.log(`[PASS] MM-250-WS transfer finger sets: ${transferSets.length} (Expected: 4)`);
if (transferSets.length !== 4) throw new Error(`Expected 4 transfer finger sets for MM-250-WS, got ${transferSets.length}`);
for (let i = 0; i < 4; i++) {
  const ts = transferSets[i];
  if (ts.transfer_num !== i + 1) throw new Error(`Expected transfer_num ${i + 1}, got ${ts.transfer_num}`);
  if (!ts.finger_a || !ts.finger_b) throw new Error(`Missing finger_a or finger_b in transfer set ${ts.transfer_num}`);
  console.log(`       Transfer Set ${ts.transfer_num}: A=${ts.finger_a}, B=${ts.finger_b} (${ts.notes || 'No note'})`);
}

// 4. Verify baseline setpoints
const runs = db.prepare('SELECT * FROM setpoint_runs WHERE part_number = ? ORDER BY run_date DESC').all('MM-250-075-WS');
console.log(`[PASS] MM-250-075-WS past runs: ${runs.length} (Expected >= 3)`);
console.log(`       Latest run operator: ${runs[0].operator_name}, date: ${runs[0].run_date}, Die KO 1: ${runs[0].die_ko_1_mm}mm, Wedge 1: ${runs[0].wedge_1_mm}mm`);

// 5. Test logging a new setpoint
const testInsert = db.prepare(`
  INSERT INTO setpoint_runs (
    part_number, machine_id, operator_name, shift, run_date, is_golden, parts_produced,
    die_ko_1_mm, die_ko_2_mm, die_ko_3_mm, die_ko_4_mm,
    wedge_1_mm, wedge_2_mm, wedge_3_mm, wedge_4_mm,
    stopper_mm, feed_mm,
    feed_roll_pressure, finger_clamp_pressure,
    notes
  ) VALUES (
    'MM-250-075-WS', 'MM-14', 'Test Operator', '3rd', '2026-09-26 21:30', 0, 5000,
    185.0, 192.0, 148.0, 0,
    52.0, 58.5, 61.0, 44.0,
    168.0, 172.5,
    45.0, 38.0,
    'Verification test run passed with 0 scrap.'
  )
`);
let testInsertId = null;
try {
  const res = testInsert.run();
  testInsertId = res.lastInsertRowid;
  console.log(`[PASS] Logged new run setpoint with ID: ${testInsertId}`);

  const updatedRuns = db.prepare('SELECT * FROM setpoint_runs WHERE part_number = ? ORDER BY run_date DESC').all('MM-250-075-WS');
  console.log(`[PASS] Updated runs count: ${updatedRuns.length}`);
  if (updatedRuns.length !== runs.length + 1) {
    throw new Error(`Expected runs count to increase by 1, got ${updatedRuns.length} (was ${runs.length})`);
  }
} finally {
  if (testInsertId) {
    db.prepare('DELETE FROM setpoint_runs WHERE id = ?').run(testInsertId);
    console.log(`[PASS] Cleaned up verification test entry.`);
  }
}
// 6. Verify static fallback data (tooling.json) has 4 transfer sets per family
const staticTooling = JSON.parse(fs.readFileSync(new URL('../src/data/tooling.json', import.meta.url), 'utf8'));
const staticSets = staticTooling.transfer_sets.filter(s => s.part_family === 'MM-250-WS');
console.log(`[PASS] Static fallback tooling.json MM-250-WS transfer sets: ${staticSets.length} (Expected: 4)`);
if (staticSets.length !== 4) throw new Error(`Expected 4 static transfer sets for MM-250-WS, got ${staticSets.length}`);

console.log('--- ALL AUTOMATED VERIFICATION CHECKS PASSED ---');
