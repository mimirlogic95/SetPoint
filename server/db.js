import { DatabaseSync } from 'node:sqlite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_DIR = path.join(__dirname, '..', 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const DB_PATH = path.join(DATA_DIR, 'mimir_factory.db');

export const db = new DatabaseSync(DB_PATH);

// Initialize Tables
export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS parts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      part_number TEXT UNIQUE NOT NULL COLLATE NOCASE,
      family TEXT NOT NULL,
      wire_dia_frac TEXT,
      wire_dia_in REAL,
      oal_in REAL,
      oal_tol_in REAL,
      shank_dia_in REAL,
      shank_dia_tol_in REAL,
      head_dia_in REAL,
      head_dia_tol_in REAL,
      head_height_in REAL,
      head_height_tol_in REAL,
      material TEXT,
      finish TEXT,
      hardness_hrb TEXT,
      tensile_psi_min INTEGER,
      yield_psi_min INTEGER,
      drawing_no TEXT,
      machine TEXT DEFAULT 'MM-14',
      blueprint_file TEXT,
      progression_file TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS tooling_stations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      part_family TEXT NOT NULL,
      station_num INTEGER NOT NULL,
      description TEXT NOT NULL,
      die TEXT NOT NULL,
      punch TEXT NOT NULL,
      punch_pin TEXT NOT NULL,
      spacer TEXT NOT NULL,
      ko_pin TEXT NOT NULL,
      notes TEXT,
      UNIQUE(part_family, station_num)
    );

    CREATE TABLE IF NOT EXISTS tooling_fingers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      part_family TEXT UNIQUE NOT NULL,
      finger_1 TEXT NOT NULL,
      finger_2 TEXT NOT NULL,
      notes TEXT
    );

    CREATE TABLE IF NOT EXISTS setpoint_runs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      part_number TEXT NOT NULL COLLATE NOCASE,
      machine_id TEXT DEFAULT 'MM-14',
      operator_name TEXT NOT NULL,
      shift TEXT DEFAULT '1st',
      run_date TEXT NOT NULL,
      is_golden INTEGER DEFAULT 0,
      parts_produced INTEGER DEFAULT 0,
      coil_lot TEXT,
      actual_wire_dia_mm REAL,
      cutoff_length_mm REAL,
      die_ko_1_mm REAL,
      die_ko_2_mm REAL,
      die_ko_3_mm REAL,
      die_ko_4_mm REAL,
      wedge_1_mm REAL,
      wedge_2_mm REAL,
      wedge_3_mm REAL,
      wedge_4_mm REAL,
      stopper_mm REAL,
      feed_mm REAL,
      punch_die_gap_1_mm REAL,
      punch_die_gap_2_mm REAL,
      punch_die_gap_3_mm REAL,
      punch_die_gap_4_mm REAL,
      feed_roll_pressure REAL,
      finger_clamp_pressure REAL,
      finger_1_cam1 REAL,
      finger_1_cam2 REAL,
      finger_2_cam1 REAL,
      finger_2_cam2 REAL,
      finger_3_cam1 REAL,
      finger_3_cam2 REAL,
      finger_4_cam1 REAL,
      finger_4_cam2 REAL,
      notes TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS toolroom_inventory (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      item_code TEXT NOT NULL,
      diameter TEXT NOT NULL,
      station TEXT,
      position TEXT,
      status TEXT NOT NULL,
      quantity INTEGER DEFAULT 1,
      notes TEXT,
      last_used TEXT,
      received_date TEXT
    );

    CREATE INDEX IF NOT EXISTS idx_parts_num ON parts(part_number);
    CREATE INDEX IF NOT EXISTS idx_setpoints_part ON setpoint_runs(part_number, run_date DESC);
  `);
}

initDb();
