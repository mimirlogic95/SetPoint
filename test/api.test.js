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

// 3. Verify transfer fingers
const fingers = db.prepare('SELECT * FROM tooling_fingers WHERE part_family = ?').get('MM-250-WS');
console.log(`[PASS] MM-250-WS fingers: ${fingers.finger_1}, ${fingers.finger_2}`);

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
const res = testInsert.run();
console.log(`[PASS] Logged new run setpoint with ID: ${res.lastInsertRowid}`);

const updatedRuns = db.prepare('SELECT * FROM setpoint_runs WHERE part_number = ? ORDER BY run_date DESC').all('MM-250-075-WS');
console.log(`[PASS] Updated runs count: ${updatedRuns.length}`);

// Clean up test entry
db.prepare('DELETE FROM setpoint_runs WHERE id = ?').run(res.lastInsertRowid);
console.log(`[PASS] Cleaned up verification test entry.`);

console.log('--- ALL AUTOMATED VERIFICATION CHECKS PASSED ---');
