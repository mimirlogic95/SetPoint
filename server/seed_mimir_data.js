import { db, initDb } from './db.js';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

initDb();

console.log('Seeding Mimir Metals Factory Data...');

// 1. Load Parts Catalog
const catalogPath = path.join(__dirname, '..', '..', 'mimir-source', 'Mimir _factory', 'parts_catalog.json');
const parts = JSON.parse(fs.readFileSync(catalogPath, 'utf-8'));

const familyFileMap = {
  '1/4" Weld Stud': {
    code: 'MM-250-WS',
    blueprint: 'MM-250-WS-FAMILY.pdf',
    progression: 'MM-250-WS-PROGRESSION.pdf'
  },
  '5/16" Weld Stud': {
    code: 'MM-312-WS',
    blueprint: 'MM-312-WS-FAMILY.pdf',
    progression: 'MM-312-WS-PROGRESSION.pdf'
  },
  '3/8" Weld Stud': {
    code: 'MM-375-WS',
    blueprint: 'MM-375-WS-FAMILY.pdf',
    progression: 'MM-375-WS-PROGRESSION.pdf'
  },
  '1/2" Weld Stud': {
    code: 'MM-500-WS',
    blueprint: 'MM-500-WS-FAMILY.pdf',
    progression: 'MM-500-WS-PROGRESSION.pdf'
  },
  '9/16" Weld Stud': {
    code: 'MM-562-WS',
    blueprint: 'MM-562-WS-FAMILY.pdf',
    progression: 'MM-562-WS-PROGRESSION.pdf'
  },
  '5/8" Weld Stud': {
    code: 'MM-625-WS',
    blueprint: 'MM-625-WS-FAMILY.pdf',
    progression: 'MM-625-WS-PROGRESSION.pdf'
  }
};

const insertPartStmt = db.prepare(`
  INSERT OR REPLACE INTO parts (
    part_number, family, wire_dia_frac, wire_dia_in, oal_in, oal_tol_in,
    shank_dia_in, shank_dia_tol_in, head_dia_in, head_dia_tol_in,
    head_height_in, head_height_tol_in, material, finish, hardness_hrb,
    tensile_psi_min, yield_psi_min, drawing_no, machine, blueprint_file, progression_file
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

for (const p of parts) {
  const map = familyFileMap[p.family] || {
    blueprint: 'MM-250-WS-FAMILY.pdf',
    progression: 'MM-250-WS-PROGRESSION.pdf'
  };

  insertPartStmt.run(
    p.part_number,
    p.family,
    p.wire_dia_frac,
    p.wire_dia_in,
    p.oal_in,
    p.oal_tol_in,
    p.shank_dia_in,
    p.shank_dia_tol_in,
    p.head_dia_in,
    p.head_dia_tol_in,
    p.head_height_in,
    p.head_height_tol_in,
    p.material,
    p.finish,
    p.hardness_hrb,
    p.tensile_psi_min,
    p.yield_psi_min,
    p.drawing_no,
    p.machine || 'MM-14',
    map.blueprint,
    map.progression
  );
}

console.log(`Seeded ${parts.length} parts into database.`);

// 2. Tooling Stations and Fingers
const toolingData = {
  'MM-250-WS': {
    family: '1/4" Weld Stud',
    stations: [
      {
        num: 1,
        desc: 'Upset / Point Initiation',
        die: 'MM-250-D1',
        punch: 'MM-250-P1',
        punch_pin: 'MM-250-PP1',
        spacer: 'MM-250-SP1',
        ko_pin: 'MM-250-KO1',
        notes: 'ST1 punch pin sets point depth, do not substitute with larger family.'
      },
      {
        num: 2,
        desc: 'Cone / Point Forming',
        die: 'MM-250-D2',
        punch: 'MM-250-P2',
        punch_pin: 'MM-250-PP2',
        spacer: 'MM-250-SP2',
        ko_pin: 'MM-250-KO2',
        notes: 'Verify knockout clearance. Smooth transition to station 3.'
      },
      {
        num: 3,
        desc: 'Head Form / Point Finish',
        die: 'MM-250-D3',
        punch: 'MM-250-P3',
        punch_pin: 'MM-250-PP3',
        spacer: 'MM-250-SP3',
        ko_pin: 'MM-250-KO3',
        notes: 'Head finish station. Check flash/burr on parting line.'
      },
      {
        num: 4,
        desc: 'Final Head Coin / Size',
        die: 'MM-250-D4',
        punch: 'MM-250-P4',
        punch_pin: 'MM-250-PP4',
        spacer: 'MM-250-SP4',
        ko_pin: 'MM-250-KO4',
        notes: 'Optional/sizing station. Often inactive for standard 1/4" weld studs.'
      }
    ],
    transfer_sets: [
      { num: 1, a: 'MM-250-F1A', b: 'MM-250-F1B', notes: 'Cutoff to Station 1' },
      { num: 2, a: 'MM-250-F2A', b: 'MM-250-F2B', notes: 'Station 1 to Station 2' },
      { num: 3, a: 'MM-250-F3A', b: 'MM-250-F3B', notes: 'Station 2 to Station 3' },
      { num: 4, a: 'MM-250-F4A', b: 'MM-250-F4B', notes: 'Station 3 to Station 4' }
    ],
    notes: 'All 4 stations active when sizing. Fingers sensitive on this family — check clamp pressure before run. ST1 punch pin sets point depth.'
  },
  'MM-312-WS': {
    family: '5/16" Weld Stud',
    stations: [
      {
        num: 1,
        desc: 'Upset / Point Initiation',
        die: 'MM-312-D1',
        punch: 'MM-312-P1',
        punch_pin: 'MM-312-PP1',
        spacer: 'MM-312-SP1',
        ko_pin: 'MM-312-KO1',
        notes: 'Initial upset initiation. Maintain clean wire bevel.'
      },
      {
        num: 2,
        desc: 'Cone / Point Forming',
        die: 'MM-312-D2',
        punch: 'MM-312-P2',
        punch_pin: 'MM-312-PP2',
        spacer: 'MM-312-SP2',
        ko_pin: 'MM-312-KO2',
        notes: 'ST2 die is shared with 1/4" family on older setups — confirm MM-312-D2 is loaded.'
      },
      {
        num: 3,
        desc: 'Head Form / Point Finish',
        die: 'MM-312-D3',
        punch: 'MM-312-P3',
        punch_pin: 'MM-312-PP3',
        spacer: 'MM-312-SP3',
        ko_pin: 'MM-312-KO3',
        notes: 'Head forming.'
      },
      {
        num: 4,
        desc: 'Final Head Coin / Size',
        die: 'MM-312-D4',
        punch: 'MM-312-P4',
        punch_pin: 'MM-312-PP4',
        spacer: 'MM-312-SP4',
        ko_pin: 'MM-312-KO4',
        notes: 'Coining.'
      }
    ],
    transfer_sets: [
      { num: 1, a: 'MM-312-F1A', b: 'MM-312-F1B', notes: 'Cutoff to Station 1' },
      { num: 2, a: 'MM-312-F2A', b: 'MM-312-F2B', notes: 'Station 1 to Station 2' },
      { num: 3, a: 'MM-312-F3A', b: 'MM-312-F3B', notes: 'Station 2 to Station 3' },
      { num: 4, a: 'MM-312-F4A', b: 'MM-312-F4B', notes: 'Station 3 to Station 4' }
    ],
    notes: 'All 4 stations active. Confirm MM-312-D2 is loaded, not MM-250-D2.'
  },
  'MM-375-WS': {
    family: '3/8" Weld Stud',
    stations: [
      {
        num: 1,
        desc: 'Upset / Point Initiation',
        die: 'MM-375-D1',
        punch: 'MM-375-P1',
        punch_pin: 'MM-375-PP1',
        spacer: 'MM-375-SP1',
        ko_pin: 'MM-375-KO1',
        notes: '3/8" high volume line. Check punch face alignment.'
      },
      {
        num: 2,
        desc: 'Cone / Point Forming',
        die: 'MM-375-D2',
        punch: 'MM-375-P2',
        punch_pin: 'MM-375-PP2',
        spacer: 'MM-375-SP2',
        ko_pin: 'MM-375-KO2',
        notes: 'Check die wear at every 50K pieces.'
      },
      {
        num: 3,
        desc: 'Head Form / Point Finish',
        die: 'MM-375-D3',
        punch: 'MM-375-P3',
        punch_pin: 'MM-375-PP3',
        spacer: 'MM-375-SP3',
        ko_pin: 'MM-375-KO3',
        notes: 'KO pins at ST3 and ST4 wear faster on this size.'
      },
      {
        num: 4,
        desc: 'Final Head Coin / Size',
        die: 'MM-375-D4',
        punch: 'MM-375-P4',
        punch_pin: 'MM-375-PP4',
        spacer: 'MM-375-SP4',
        ko_pin: 'MM-375-KO4',
        notes: 'Final coining and head tolerance control.'
      }
    ],
    transfer_sets: [
      { num: 1, a: 'MM-375-F1A', b: 'MM-375-F1B', notes: 'Cutoff to Station 1' },
      { num: 2, a: 'MM-375-F2A', b: 'MM-375-F2B', notes: 'Station 1 to Station 2' },
      { num: 3, a: 'MM-375-F3A', b: 'MM-375-F3B', notes: 'Station 2 to Station 3' },
      { num: 4, a: 'MM-375-F4A', b: 'MM-375-F4B', notes: 'Station 3 to Station 4' }
    ],
    notes: 'All 4 stations active. 3/8" is the highest volume family — check die wear at every 50K pieces. KO pins at ST3 and ST4 wear faster on this size.'
  },
  'MM-500-WS': {
    family: '1/2" Weld Stud',
    stations: [
      {
        num: 1,
        desc: 'Upset / Point Initiation',
        die: 'MM-500-D1',
        punch: 'MM-500-P1',
        punch_pin: 'MM-500-PP1',
        spacer: 'MM-500-SP1',
        ko_pin: 'MM-500-KO1',
        notes: 'Heavy wire section. Ensure adequate lube on cut end.'
      },
      {
        num: 2,
        desc: 'Cone / Point Forming',
        die: 'MM-500-D2',
        punch: 'MM-500-P2',
        punch_pin: 'MM-500-PP2',
        spacer: 'MM-500-SP2',
        ko_pin: 'MM-500-KO2',
        notes: 'Verify finger timing CAM settings before first cycle.'
      },
      {
        num: 3,
        desc: 'Head Form / Point Finish',
        die: 'MM-500-D3',
        punch: 'MM-500-P3',
        punch_pin: 'MM-500-PP3',
        spacer: 'MM-500-SP3',
        ko_pin: 'MM-500-KO3',
        notes: 'Check head concentricity.'
      },
      {
        num: 4,
        desc: 'Final Head Coin / Size',
        die: 'MM-500-D4',
        punch: 'MM-500-P4',
        punch_pin: 'MM-500-PP4',
        spacer: 'MM-500-SP4',
        ko_pin: 'MM-500-KO4',
        notes: 'Coining.'
      }
    ],
    transfer_sets: [
      { num: 1, a: 'MM-500-F1A', b: 'MM-500-F1B', notes: 'Cutoff to Station 1' },
      { num: 2, a: 'MM-500-F2A', b: 'MM-500-F2B', notes: 'Station 1 to Station 2' },
      { num: 3, a: 'MM-500-F3A', b: 'MM-500-F3B', notes: 'Station 2 to Station 3' },
      { num: 4, a: 'MM-500-F4A', b: 'MM-500-F4B', notes: 'Station 3 to Station 4' }
    ],
    notes: 'All 4 stations active. 1/2" requires higher feed roll pressure than smaller families. Verify finger timing CAM settings before first cycle — heavier wire can cause transfer misses at ST2.'
  },
  'MM-562-WS': {
    family: '9/16" Weld Stud',
    stations: [
      {
        num: 1,
        desc: 'Upset / Point Initiation',
        die: 'MM-562-D1',
        punch: 'MM-562-P1',
        punch_pin: 'MM-562-PP1',
        spacer: 'MM-562-SP1',
        ko_pin: 'MM-562-KO1',
        notes: 'Upset.'
      },
      {
        num: 2,
        desc: 'Cone / Point Forming',
        die: 'MM-562-D2',
        punch: 'MM-562-P2',
        punch_pin: 'MM-562-PP2',
        spacer: 'MM-562-SP2',
        ko_pin: 'MM-562-KO2',
        notes: 'Cone.'
      },
      {
        num: 3,
        desc: 'Head Form / Point Finish',
        die: 'MM-562-D3',
        punch: 'MM-562-P3',
        punch_pin: 'MM-562-PP3',
        spacer: 'MM-562-SP3',
        ko_pin: 'MM-562-KO3',
        notes: 'Punch pins PP3 and PP4 are longest in the shop — store vertically.'
      },
      {
        num: 4,
        desc: 'Final Head Coin / Size',
        die: 'MM-562-D4',
        punch: 'MM-562-P4',
        punch_pin: 'MM-562-PP4',
        spacer: 'MM-562-SP4',
        ko_pin: 'MM-562-KO4',
        notes: 'Coining.'
      }
    ],
    transfer_sets: [
      { num: 1, a: 'MM-562-F1A', b: 'MM-562-F1B', notes: 'Cutoff to Station 1' },
      { num: 2, a: 'MM-562-F2A', b: 'MM-562-F2B', notes: 'Station 1 to Station 2' },
      { num: 3, a: 'MM-562-F3A', b: 'MM-562-F3B', notes: 'Station 2 to Station 3' },
      { num: 4, a: 'MM-562-F4A', b: 'MM-562-F4B', notes: 'Station 3 to Station 4' }
    ],
    notes: 'All 4 stations active. 9/16" and 5/8" share the same finger pair design — F1 and F2 are NOT interchangeable with smaller families. Punch pins PP3 and PP4 are longest in the shop — store vertically.'
  },
  'MM-625-WS': {
    family: '5/8" Weld Stud',
    stations: [
      {
        num: 1,
        desc: 'Upset / Point Initiation',
        die: 'MM-625-D1',
        punch: 'MM-625-P1',
        punch_pin: 'MM-625-PP1',
        spacer: 'MM-625-SP1',
        ko_pin: 'MM-625-KO1',
        notes: 'Heavy heading load.'
      },
      {
        num: 2,
        desc: 'Cone / Point Forming',
        die: 'MM-625-D2',
        punch: 'MM-625-P2',
        punch_pin: 'MM-625-PP2',
        spacer: 'MM-625-SP2',
        ko_pin: 'MM-625-KO2',
        notes: 'Run machine at 80% speed until confirmed good on first 25 pieces.'
      },
      {
        num: 3,
        desc: 'Head Form / Point Finish',
        die: 'MM-625-D3',
        punch: 'MM-625-P3',
        punch_pin: 'MM-625-PP3',
        spacer: 'MM-625-SP3',
        ko_pin: 'MM-625-KO3',
        notes: 'Check head flash.'
      },
      {
        num: 4,
        desc: 'Final Head Coin / Size',
        die: 'MM-625-D4',
        punch: 'MM-625-P4',
        punch_pin: 'MM-625-PP4',
        spacer: 'MM-625-SP4',
        ko_pin: 'MM-625-KO4',
        notes: 'ST4 die wears fastest of all families — inspect every 40K pieces.'
      }
    ],
    transfer_sets: [
      { num: 1, a: 'MM-625-F1A', b: 'MM-625-F1B', notes: 'Cutoff to Station 1' },
      { num: 2, a: 'MM-625-F2A', b: 'MM-625-F2B', notes: 'Station 1 to Station 2' },
      { num: 3, a: 'MM-625-F3A', b: 'MM-625-F3B', notes: 'Station 2 to Station 3' },
      { num: 4, a: 'MM-625-F4A', b: 'MM-625-F4B', notes: 'Station 3 to Station 4' }
    ],
    notes: 'All 4 stations active. Heaviest wire on MM-14 — run machine at 80% speed until confirmed good on first 25 pieces. ST4 die wears fastest of all families — inspect every 40K pieces. Feed roll pressure will be highest setting in the shop for this family.'
  }
};

const insertStationStmt = db.prepare(`
  INSERT OR REPLACE INTO tooling_stations (
    part_family, station_num, description, die, punch, punch_pin, spacer, ko_pin, notes
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const insertFingerStmt = db.prepare(`
  INSERT OR REPLACE INTO tooling_fingers (
    part_family, transfer_num, finger_a, finger_b, notes
  ) VALUES (?, ?, ?, ?, ?)
`);

for (const [code, t] of Object.entries(toolingData)) {
  for (const st of t.stations) {
    insertStationStmt.run(
      code,
      st.num,
      st.desc,
      st.die,
      st.punch,
      st.punch_pin,
      st.spacer,
      st.ko_pin,
      st.notes
    );
  }
  for (const ts of t.transfer_sets) {
    insertFingerStmt.run(code, ts.num, ts.a, ts.b, ts.notes || null);
  }
}

console.log('Seeded tooling stations and 4 transfer finger sets for all 6 families.');

// 3. Seed Toolroom Inventory
const sampleInventory = [
  { item_code: 'MM-250-D1', diameter: '1/4"', station: 'ST1', position: '1A', status: 'Ready', quantity: 3, notes: 'New polish, ready for production' },
  { item_code: 'MM-250-D2', diameter: '1/4"', station: 'ST2', position: '1B', status: 'Ready', quantity: 2, notes: 'Verified OD & bore' },
  { item_code: 'MM-250-D3', diameter: '1/4"', station: 'ST3', position: '1C', status: 'Ready', quantity: 2, notes: 'Carbide insert checked' },
  { item_code: 'MM-250-D4', diameter: '1/4"', station: 'ST4', position: '1D', status: 'Ready', quantity: 1, notes: 'Sizing die' },
  { item_code: 'MM-250-P1', diameter: '1/4"', station: 'ST1', position: 'P1', status: 'Ready', quantity: 4, notes: 'Point starter' },
  { item_code: 'MM-250-P2', diameter: '1/4"', station: 'ST2', position: 'P2', status: 'In Use', quantity: 1, notes: 'Currently installed on MM-14' },
  { item_code: 'MM-250-F1A', diameter: '1/4"', station: 'Transfer 1', position: 'F1A', status: 'Ready', quantity: 2, notes: 'Transfer 1 Finger A' },
  { item_code: 'MM-250-F1B', diameter: '1/4"', station: 'Transfer 1', position: 'F1B', status: 'Ready', quantity: 2, notes: 'Transfer 1 Finger B' },
  { item_code: 'MM-250-F2A', diameter: '1/4"', station: 'Transfer 2', position: 'F2A', status: 'In Use', quantity: 1, notes: 'Mounted on MM-14' },
  { item_code: 'MM-250-F2B', diameter: '1/4"', station: 'Transfer 2', position: 'F2B', status: 'In Use', quantity: 1, notes: 'Mounted on MM-14' },
  { item_code: 'MM-250-F3A', diameter: '1/4"', station: 'Transfer 3', position: 'F3A', status: 'Ready', quantity: 2, notes: 'Transfer 3 Finger A' },
  { item_code: 'MM-250-F3B', diameter: '1/4"', station: 'Transfer 3', position: 'F3B', status: 'Ready', quantity: 2, notes: 'Transfer 3 Finger B' },
  { item_code: 'MM-250-F4A', diameter: '1/4"', station: 'Transfer 4', position: 'F4A', status: 'Ready', quantity: 2, notes: 'Transfer 4 Finger A' },
  { item_code: 'MM-250-F4B', diameter: '1/4"', station: 'Transfer 4', position: 'F4B', status: 'Ready', quantity: 2, notes: 'Transfer 4 Finger B' },
  { item_code: 'MM-312-D1', diameter: '5/16"', station: 'ST1', position: '2A', status: 'Ready', quantity: 2, notes: 'Ready in rack' },
  { item_code: 'MM-375-D1', diameter: '3/8"', station: 'ST1', position: '3A', status: 'Ready', quantity: 3, notes: 'High volume stock' },
  { item_code: 'MM-500-D1', diameter: '1/2"', station: 'ST1', position: '4A', status: 'Ready', quantity: 2, notes: 'Heavy series' },
  { item_code: 'MM-625-D4', diameter: '5/8"', station: 'ST4', position: '6D', status: 'Repair', quantity: 1, notes: 'Chipped radius — sent to toolroom grind' }
];

const insertInvStmt = db.prepare(`
  INSERT INTO toolroom_inventory (
    item_code, diameter, station, position, status, quantity, notes, received_date
  ) VALUES (?, ?, ?, ?, ?, ?, ?, '2026-01-15')
`);

for (const inv of sampleInventory) {
  insertInvStmt.run(inv.item_code, inv.diameter, inv.station, inv.position, inv.status, inv.quantity, inv.notes);
}

// 4. Seed Historical Machine MM-14 Setpoints
const insertRunStmt = db.prepare(`
  INSERT INTO setpoint_runs (
    part_number, machine_id, operator_name, shift, run_date, is_golden, parts_produced,
    coil_lot, actual_wire_dia_mm, cutoff_length_mm,
    die_ko_1_mm, die_ko_2_mm, die_ko_3_mm, die_ko_4_mm,
    wedge_1_mm, wedge_2_mm, wedge_3_mm, wedge_4_mm,
    stopper_mm, feed_mm,
    punch_die_gap_1_mm, punch_die_gap_2_mm, punch_die_gap_3_mm, punch_die_gap_4_mm,
    feed_roll_pressure, finger_clamp_pressure,
    finger_1_cam1, finger_1_cam2, finger_2_cam1, finger_2_cam2,
    finger_3_cam1, finger_3_cam2, finger_4_cam1, finger_4_cam2,
    notes
  ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

// 1/4" Weld Stud (MM-250-075-WS) runs
// Golden Run (from MM14_machine_spec.py)
insertRunStmt.run(
  'MM-250-075-WS', 'MM-14', 'Brian Gaynor', '1st', '2026-08-20 14:30', 1, 24500,
  'HEAT-90442-A', 6.35, 19.1,
  185.0, 192.0, 148.0, 0.0,
  52.0, 58.5, 61.0, 44.0,
  168.0, 172.5,
  2.5, 2.0, 1.5, 0.0,
  45.0, 38.0,
  110.0, 240.0, 115.0, 245.0, 0.0, 0.0, 0.0, 0.0,
  'Golden setup established. Station 4 not active for 1/4" family. Feed roll pressure sensitive — increase 5% if wire slips on startup. Ran 24,500 parts without stoppage.'
);

// Previous Run 2
insertRunStmt.run(
  'MM-250-075-WS', 'MM-14', 'Dave Miller', '2nd', '2026-08-05 21:15', 0, 18200,
  'HEAT-88710-B', 6.36, 19.1,
  185.0, 191.5, 148.0, 0.0,
  52.0, 58.0, 60.5, 44.0,
  168.0, 172.0,
  2.5, 2.0, 1.6, 0.0,
  46.0, 38.0,
  110.0, 240.0, 115.0, 245.0, 0.0, 0.0, 0.0, 0.0,
  'Coil was slightly oversize (+0.01mm). Increased feed roll pressure to 46 to eliminate minor slip. Part head dimensions spot on.'
);

// Previous Run 1
insertRunStmt.run(
  'MM-250-075-WS', 'MM-14', 'Mike Kozlowski', '1st', '2026-07-12 11:00', 0, 15000,
  'HEAT-86204-C', 6.34, 19.05,
  184.5, 191.0, 147.5, 0.0,
  51.8, 58.0, 60.5, 44.0,
  167.5, 171.5,
  2.5, 2.1, 1.6, 0.0,
  44.0, 37.5,
  110.0, 240.0, 115.0, 245.0, 0.0, 0.0, 0.0, 0.0,
  'Initial production setup after tooling changeover. Performed 10 dry cycles before introducing wire.'
);

// Add runs for other popular parts so operators have historical data across all families
insertRunStmt.run(
  'MM-250-100-WS', 'MM-14', 'Brian Gaynor', '1st', '2026-08-18 09:30', 1, 20000,
  'HEAT-90442-A', 6.35, 25.4,
  185.0, 192.0, 148.0, 0.0,
  52.0, 58.5, 61.0, 44.0,
  174.0, 178.5,
  2.5, 2.0, 1.5, 0.0,
  45.0, 38.0,
  110.0, 240.0, 115.0, 245.0, 0.0, 0.0, 0.0, 0.0,
  '1.000" OAL baseline. Cutoff stopper adjusted to 174.0mm.'
);

insertRunStmt.run(
  'MM-312-100-WS', 'MM-14', 'Dave Miller', '1st', '2026-08-15 15:45', 1, 22000,
  'HEAT-91102-K', 7.92, 25.4,
  190.0, 198.0, 155.0, 120.0,
  55.0, 62.0, 65.0, 48.0,
  175.0, 180.0,
  2.8, 2.2, 1.8, 1.2,
  48.0, 40.0,
  112.0, 242.0, 118.0, 248.0, 120.0, 250.0, 122.0, 252.0,
  'Confirmed MM-312-D2 loaded on ST2. Good concentric head formation.'
);

insertRunStmt.run(
  'MM-375-150-WS', 'MM-14', 'Mike Kozlowski', '2nd', '2026-08-22 18:00', 1, 35000,
  'HEAT-92500-M', 9.53, 38.1,
  198.0, 205.0, 162.0, 130.0,
  58.0, 65.0, 69.0, 52.0,
  185.0, 191.0,
  3.0, 2.5, 2.0, 1.4,
  52.0, 44.0,
  115.0, 245.0, 120.0, 250.0, 124.0, 254.0, 126.0, 256.0,
  '3/8" high volume run. Inspected KO pins at 30K pieces — minimal wear. Maintained high output at 70 PPM.'
);

insertRunStmt.run(
  'MM-500-200-WS', 'MM-14', 'Brian Gaynor', '1st', '2026-08-10 10:15', 1, 15000,
  'HEAT-89400-P', 12.7, 50.8,
  210.0, 220.0, 175.0, 145.0,
  64.0, 72.0, 76.0, 60.0,
  200.0, 208.0,
  3.5, 3.0, 2.4, 1.8,
  58.0, 50.0,
  118.0, 248.0, 124.0, 254.0, 128.0, 258.0, 130.0, 260.0,
  '1/2" weld stud setup. Higher feed roll pressure (58) needed for heavy coil. Checked finger timing CAMs.'
);

insertRunStmt.run(
  'MM-625-250-WS', 'MM-14', 'Dave Miller', '1st', '2026-08-01 13:00', 1, 10000,
  'HEAT-87110-W', 15.88, 63.5,
  225.0, 235.0, 190.0, 160.0,
  70.0, 80.0, 84.0, 68.0,
  220.0, 230.0,
  4.0, 3.5, 2.8, 2.0,
  65.0, 56.0,
  120.0, 250.0, 126.0, 256.0, 130.0, 260.0, 132.0, 262.0,
  '5/8" heaviest wire. Ran at 80% speed (55 PPM) during first 50 pieces, then ramped to 65 PPM. ST4 die inspected and polished before run.'
);

console.log('Seeded historical setpoints for Machine MM-14.');

// Sync static json files for Netlify
const staticToolingPath = path.join(__dirname, '..', 'src', 'data', 'tooling.json');
const staticInventoryPath = path.join(__dirname, '..', 'src', 'data', 'inventory.json');
if (fs.existsSync(path.dirname(staticToolingPath))) {
  const allStations = db.prepare('SELECT * FROM tooling_stations ORDER BY part_family, station_num').all();
  const allTransferSets = db.prepare('SELECT * FROM tooling_fingers ORDER BY part_family, transfer_num').all();
  fs.writeFileSync(staticToolingPath, JSON.stringify({ stations: allStations, transfer_sets: allTransferSets, fingers: allTransferSets }, null, 2));

  const allInventory = db.prepare('SELECT * FROM toolroom_inventory').all();
  fs.writeFileSync(staticInventoryPath, JSON.stringify(allInventory, null, 2));
  console.log('Synced static tooling.json and inventory.json for Netlify.');
}

console.log('Seeding completed successfully!');
