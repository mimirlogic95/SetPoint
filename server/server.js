import express from 'express';
import cors from 'cors';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import fs from 'node:fs';
import multer from 'multer';
import { db, initDb } from './db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

initDb();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const UPLOADS_DIR = path.join(__dirname, 'uploads', 'prints');
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}
app.use('/prints', express.static(UPLOADS_DIR));

// Configure multer for PDF uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    // Sanitize filename
    const safeName = file.originalname.replace(/[^a-zA-Z0-9._-]/g, '_');
    cb(null, safeName);
  }
});
const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf' || file.originalname.endsWith('.pdf')) {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'));
    }
  }
});

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

// -------------------------------------------------------------
// API ROUTES
// -------------------------------------------------------------

// Health & Stats
app.get('/api/health', (req, res) => {
  try {
    const partsCount = db.prepare('SELECT COUNT(*) as count FROM parts').get().count;
    const runsCount = db.prepare('SELECT COUNT(*) as count FROM setpoint_runs').get().count;
    res.json({
      status: 'ok',
      machine: 'MM-14 (JBF-30B4SUL 4-Station Bolt Former)',
      location: 'Mimir Metals — Warren, MI',
      partsCount,
      runsCount,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// List all product families
app.get('/api/families', (req, res) => {
  try {
    const rows = db.prepare(`
      SELECT family, COUNT(*) as part_count
      FROM parts
      GROUP BY family
      ORDER BY wire_dia_in ASC
    `).all();
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Search and list parts
app.get('/api/parts', (req, res) => {
  try {
    const { search, family } = req.query;
    let query = 'SELECT * FROM parts WHERE 1=1';
    const params = [];

    if (family && family !== 'All') {
      query += ' AND family = ?';
      params.push(family);
    }

    if (search && search.trim() !== '') {
      query += ' AND (part_number LIKE ? OR drawing_no LIKE ? OR material LIKE ?)';
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    query += ' ORDER BY wire_dia_in ASC, oal_in ASC';
    const parts = db.prepare(query).all(...params);
    res.json(parts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single part details with tooling stations, fingers, and historical setpoint runs
app.get('/api/parts/:partNumber', (req, res) => {
  try {
    const { partNumber } = req.params;
    const part = db.prepare('SELECT * FROM parts WHERE part_number = ? COLLATE NOCASE').get(partNumber);

    if (!part) {
      return res.status(404).json({ error: `Part number '${partNumber}' not found.` });
    }

    const familyCode = getFamilyCode(part.family);

    // Get tooling stations
    const stations = db.prepare(`
      SELECT * FROM tooling_stations
      WHERE part_family = ?
      ORDER BY station_num ASC
    `).all(familyCode);

    // Get transfer fingers
    const fingers = db.prepare(`
      SELECT * FROM tooling_fingers
      WHERE part_family = ?
    `).get(familyCode);

    // Get previous setpoint runs (newest first)
    const runs = db.prepare(`
      SELECT * FROM setpoint_runs
      WHERE part_number = ? COLLATE NOCASE
      ORDER BY run_date DESC, id DESC
      LIMIT 15
    `).all(partNumber);

    // If no runs for this specific part, check family baseline
    let familyBaselineRuns = [];
    if (runs.length === 0) {
      familyBaselineRuns = db.prepare(`
        SELECT sr.* FROM setpoint_runs sr
        JOIN parts p ON sr.part_number = p.part_number
        WHERE p.family = ?
        ORDER BY sr.is_golden DESC, sr.run_date DESC
        LIMIT 5
      `).all(part.family);
    }

    // Get toolroom inventory status for the tooling required
    const toolCodes = [];
    for (const st of stations) {
      if (st.die) toolCodes.push(st.die);
      if (st.punch) toolCodes.push(st.punch);
      if (st.punch_pin) toolCodes.push(st.punch_pin);
      if (st.spacer) toolCodes.push(st.spacer);
      if (st.ko_pin) toolCodes.push(st.ko_pin);
    }
    if (fingers) {
      if (fingers.finger_1) toolCodes.push(fingers.finger_1);
      if (fingers.finger_2) toolCodes.push(fingers.finger_2);
    }

    let inventory = [];
    if (toolCodes.length > 0) {
      const placeholders = toolCodes.map(() => '?').join(',');
      inventory = db.prepare(`
        SELECT * FROM toolroom_inventory
        WHERE item_code IN (${placeholders})
      `).all(...toolCodes);
    }

    res.json({
      part,
      familyCode,
      stations,
      fingers,
      runs,
      familyBaselineRuns,
      inventory
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve Blueprint and Progression PDFs inline
app.get('/api/prints/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(UPLOADS_DIR, path.basename(filename));

  if (!fs.existsSync(filePath)) {
    return res.status(404).send('Print PDF file not found on server.');
  }

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `inline; filename="${encodeURIComponent(filename)}"`);
  const stream = fs.createReadStream(filePath);
  stream.pipe(res);
});

// Record new verified setpoints at end of run
app.post('/api/setpoints', (req, res) => {
  try {
    const data = req.body;

    if (!data.part_number) {
      return res.status(400).json({ error: 'Part number is required.' });
    }
    if (!data.operator_name) {
      return res.status(400).json({ error: 'Operator name is required.' });
    }

    const runDate = data.run_date || new Date().toISOString().replace('T', ' ').substring(0, 16);

    const stmt = db.prepare(`
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
      ) VALUES (
        ?, ?, ?, ?, ?, ?, ?,
        ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?, ?,
        ?, ?, ?, ?,
        ?, ?,
        ?, ?, ?, ?,
        ?, ?, ?, ?,
        ?
      )
    `);

    const result = stmt.run(
      data.part_number,
      data.machine_id || 'MM-14',
      data.operator_name,
      data.shift || '1st',
      runDate,
      data.is_golden ? 1 : 0,
      data.parts_produced ? Number(data.parts_produced) : 0,
      data.coil_lot || null,
      data.actual_wire_dia_mm ? Number(data.actual_wire_dia_mm) : null,
      data.cutoff_length_mm ? Number(data.cutoff_length_mm) : null,
      data.die_ko_1_mm ? Number(data.die_ko_1_mm) : null,
      data.die_ko_2_mm ? Number(data.die_ko_2_mm) : null,
      data.die_ko_3_mm ? Number(data.die_ko_3_mm) : null,
      data.die_ko_4_mm ? Number(data.die_ko_4_mm) : null,
      data.wedge_1_mm ? Number(data.wedge_1_mm) : null,
      data.wedge_2_mm ? Number(data.wedge_2_mm) : null,
      data.wedge_3_mm ? Number(data.wedge_3_mm) : null,
      data.wedge_4_mm ? Number(data.wedge_4_mm) : null,
      data.stopper_mm ? Number(data.stopper_mm) : null,
      data.feed_mm ? Number(data.feed_mm) : null,
      data.punch_die_gap_1_mm ? Number(data.punch_die_gap_1_mm) : null,
      data.punch_die_gap_2_mm ? Number(data.punch_die_gap_2_mm) : null,
      data.punch_die_gap_3_mm ? Number(data.punch_die_gap_3_mm) : null,
      data.punch_die_gap_4_mm ? Number(data.punch_die_gap_4_mm) : null,
      data.feed_roll_pressure ? Number(data.feed_roll_pressure) : null,
      data.finger_clamp_pressure ? Number(data.finger_clamp_pressure) : null,
      data.finger_1_cam1 ? Number(data.finger_1_cam1) : null,
      data.finger_1_cam2 ? Number(data.finger_1_cam2) : null,
      data.finger_2_cam1 ? Number(data.finger_2_cam1) : null,
      data.finger_2_cam2 ? Number(data.finger_2_cam2) : null,
      data.finger_3_cam1 ? Number(data.finger_3_cam1) : null,
      data.finger_3_cam2 ? Number(data.finger_3_cam2) : null,
      data.finger_4_cam1 ? Number(data.finger_4_cam1) : null,
      data.finger_4_cam2 ? Number(data.finger_4_cam2) : null,
      data.notes || null
    );

    res.json({
      success: true,
      id: Number(result.lastInsertRowid),
      message: `Successfully logged run setpoints for ${data.part_number}.`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Upload new blueprint or progression print
app.post('/api/upload-print', upload.single('print'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file uploaded.' });
    }
    const { partNumber, type } = req.body; // type: 'blueprint' or 'progression'

    if (partNumber && type) {
      const column = type === 'progression' ? 'progression_file' : 'blueprint_file';
      db.prepare(`UPDATE parts SET ${column} = ? WHERE part_number = ?`).run(req.file.filename, partNumber);
    }

    res.json({
      success: true,
      filename: req.file.filename,
      message: `Print ${req.file.filename} uploaded successfully.`
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Toolroom inventory overview
app.get('/api/inventory', (req, res) => {
  try {
    const items = db.prepare('SELECT * FROM toolroom_inventory ORDER BY diameter, station, item_code').all();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Serve static frontend build if present
const DIST_DIR = path.join(__dirname, '..', 'dist');
if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR));
  app.get('*', (req, res) => {
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });
}

app.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`  MIMIR METALS — SHOP FLOOR ASSISTANT API SERVER`);
  console.log(`  Machine: MM-14 (JBF-30B4SUL 4-Station Bolt Former)`);
  console.log(`  Local URL:   http://localhost:${PORT}`);
  console.log(`  Network URL: http://0.0.0.0:${PORT}`);
  console.log(`====================================================`);
});
