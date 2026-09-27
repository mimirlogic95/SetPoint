import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serverPath = path.join(__dirname, '..', 'server', 'server.js');
console.log('Spawning test server:', serverPath);

const server = spawn('node', [serverPath], {
  env: { ...process.env, PORT: '3099' },
  stdio: ['ignore', 'pipe', 'pipe']
});

let isReady = false;
server.stdout.on('data', d => {
  const str = d.toString();
  process.stdout.write(str);
  if (str.includes('API SERVER')) {
    isReady = true;
  }
});
server.stderr.on('data', d => process.stderr.write(d.toString()));

async function wait(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function runTests() {
  for (let i = 0; i < 30; i++) {
    if (isReady) break;
    await wait(300);
  }
  await wait(500);

  try {
    // 1. Health check
    console.log('\n[1] Testing GET /api/health ...');
    const healthRes = await fetch('http://127.0.0.1:3099/api/health');
    const health = await healthRes.json();
    console.log('    Response:', health);
    if (health.status !== 'ok') throw new Error('Health check failed');

    // 2. Parts list
    console.log('\n[2] Testing GET /api/parts ...');
    const partsRes = await fetch('http://127.0.0.1:3099/api/parts');
    const parts = await partsRes.json();
    console.log(`    Retrieved ${parts.length} parts. First part: ${parts[0].part_number} (${parts[0].family})`);
    if (parts.length !== 43) throw new Error(`Expected 43 parts, got ${parts.length}`);

    // 3. Single part details with stations and past runs
    console.log('\n[3] Testing GET /api/parts/MM-250-075-WS ...');
    const detailRes = await fetch('http://127.0.0.1:3099/api/parts/MM-250-075-WS');
    const detail = await detailRes.json();
    console.log(`    Part: ${detail.part.part_number}`);
    console.log(`    Stations: ${detail.stations.length} (Station 1 Die: ${detail.stations[0].die})`);
    console.log(`    Fingers: ${detail.fingers.finger_1}, ${detail.fingers.finger_2}`);
    console.log(`    Past Runs: ${detail.runs.length} (Latest run operator: ${detail.runs[0].operator_name}, Die KO 1: ${detail.runs[0].die_ko_1_mm}mm, Wedge 1: ${detail.runs[0].wedge_1_mm}mm)`);
    if (detail.stations.length !== 4) throw new Error('Expected 4 stations');
    if (detail.runs.length === 0) throw new Error('Expected past runs');

    // 4. Print streaming
    console.log('\n[4] Testing GET /api/prints/MM-250-WS-FAMILY.pdf ...');
    const printRes = await fetch('http://127.0.0.1:3099/api/prints/MM-250-WS-FAMILY.pdf');
    console.log(`    Status: ${printRes.status}, Content-Type: ${printRes.headers.get('content-type')}`);
    if (printRes.status !== 200 || !printRes.headers.get('content-type').includes('application/pdf')) {
      throw new Error('Print serving failed');
    }

    // 5. Post end-of-run setpoints
    console.log('\n[5] Testing POST /api/setpoints ...');
    const postRes = await fetch('http://127.0.0.1:3099/api/setpoints', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        part_number: 'MM-250-075-WS',
        machine_id: 'MM-14',
        operator_name: 'Shop Floor Operator',
        shift: '2nd',
        parts_produced: 18000,
        die_ko_1_mm: 185.0,
        die_ko_2_mm: 192.0,
        die_ko_3_mm: 148.0,
        die_ko_4_mm: 0,
        wedge_1_mm: 52.0,
        wedge_2_mm: 58.5,
        wedge_3_mm: 61.0,
        wedge_4_mm: 44.0,
        stopper_mm: 168.0,
        feed_mm: 172.5,
        feed_roll_pressure: 45.0,
        finger_clamp_pressure: 38.0,
        notes: 'End of run test: smooth cycle, zero burr.'
      })
    });
    const postData = await postRes.json();
    console.log('    Response:', postData);
    if (!postData.success) throw new Error('Failed to log setpoints');

    // 6. Verify static frontend delivery
    console.log('\n[6] Testing GET / (Frontend delivery) ...');
    const indexRes = await fetch('http://127.0.0.1:3099/');
    const indexHtml = await indexRes.text();
    console.log(`    Status: ${indexRes.status}, Length: ${indexHtml.length} chars, Contains root: ${indexHtml.includes('id="root"')}`);
    if (indexRes.status !== 200 || !indexHtml.includes('id="root"')) {
      throw new Error('Frontend delivery failed');
    }

    console.log('\n=============================================');
    console.log(' ALL END-TO-END HTTP TESTS PASSED PERFECTLY!');
    console.log('=============================================\n');
  } finally {
    server.kill();
  }
}

runTests().catch(err => {
  console.error('\n[FAIL] Test failed:', err);
  server.kill();
  process.exit(1);
});
