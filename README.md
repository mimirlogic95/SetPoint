# SetPoint — Mimir Metals Shop Floor Part Setup Assistant

**Machine**: MM-14 &bull; Jern Yao JBF-30B4SUL 4-Station Bolt Former / Cold Header  
**Location**: Mimir Metals — Warren, Michigan  
**Author**: Brian James Gaynor, Mimir Logic LLC  

SetPoint is the operator-focused cold-heading machine setup system for Mimir Metals.

---

## Purpose

SetPoint helps an operator answer:

> What do I need to correctly set up this part on this machine, what is the approved starting point, and what worked during previous successful setups?

When an operator types or scans a part number (e.g., `MM-250-075-WS`), the screen displays:

1. **Part Blueprint**: Official engineering drawing (`MM-xxx-WS-FAMILY.pdf`) with zoom, pan, 90° rotation, and fullscreen inspection.
2. **Progression Print**: Die progression strip layout (`MM-xxx-WS-PROGRESSION.pdf`).
3. **Tooling Required, by Station**: Stations 1–4 die components (Die, Punch, Punch Pin, Spacer, KO Pin), transfer fingers (`F1`, `F2`), and live digital tool crib inventory status.
4. **Previous Machine Setpoints**: Side-by-side run matrix showing what Machine MM-14 was set to on previous successful runs (Die Knockouts 1–4, Wedges 1–4, Stopper/Feed, Pressures, Gaps, and operator adjustment notes).
5. **End-of-Run Setpoint Logger**: 1-click **"Clone from Previous Run"** button allowing operators to quickly log verified machine setpoints at the end of the shift.

---

## 1-Click Launch (Local Shop Floor PC)

Double-click the launcher script in this folder:
```cmd
start-app.bat
```
This automatically boots the server and opens `http://localhost:3000` in your web browser.

### Accessing from Shop Tablets or Other PCs
The application listens on `0.0.0.0:3000`. Any tablet, iPad, or touchscreen PC on your shop Wi-Fi or local network can access it at:
```
http://<YOUR_PC_IP_ADDRESS>:3000
```

---

## Netlify Deployment

This repository is pre-configured for continuous deployment on **Netlify** via `netlify.toml`:
- **Build command**: `npm run build`
- **Publish directory**: `dist`
- **SPA redirects**: `/*` to `/index.html` (HTTP 200)
- **Static Assets & Prints**: All 14 engineering blueprints, progressions, and tooling family PDFs are bundled in `public/prints/` and deployed to Netlify's high-speed CDN.
- **Client Persistence**: In static / Netlify mode, newly logged end-of-run setpoints persist securely in the operator's browser (`localStorage`), seeded with the baseline runs from Machine MM-14.

---

## Product Families & Data Included

Seeded directly with authentic Mimir Factory engineering data:
- **1/4" Weld Stud Family** (`MM-250-WS`, 6 lengths from 0.750" to 3.000")
- **5/16" Weld Stud Family** (`MM-312-WS`, 7 lengths from 0.750" to 3.500")
- **3/8" Weld Stud Family** (`MM-375-WS`, 8 lengths from 0.750" to 4.000")
- **1/2" Weld Stud Family** (`MM-500-WS`, 8 lengths from 1.000" to 4.500")
- **9/16" Weld Stud Family** (`MM-562-WS`, 7 lengths from 1.250" to 4.500")
- **5/8" Weld Stud Family** (`MM-625-WS`, 7 lengths from 1.500" to 5.000")

---

## Machine Setpoint Parameters Tracked (JBF-30B4SUL)

Mapped directly to `MM14_machine_spec.py` and the physical shop floor setup sheet:
- **Die Knockouts (KO)**: Stations 1 to 4 (`die_ko_1_mm` .. `die_ko_4_mm`)
- **Wedges**: Stations 1 to 4 (`wedge_1_mm` .. `wedge_4_mm` punch travel depth)
- **Feed & Stopper**: `stopper_mm` (cutoff length control) & `feed_mm` (wire advance)
- **Grip Pressures**: `feed_roll_pressure` & `finger_clamp_pressure`
- **Punch/Die Gaps**: Stations 1 to 4 (`punch_die_gap_1_mm` .. `punch_die_gap_4_mm`)
- **Cutoff Length**: `cutoff_length_mm`
- **Operator Notes**: Crucial shop-floor insights (e.g. pressure adjustments for coil variations, burr elimination tweaks).

---

## Repository Guide

- `AGENTS.md` — instructions for AI coding agents working in this repository
- `PYTHON_ENGINEERING_STANDARD.md` — MimirLogic-wide Python engineering standard
- `docs/PRODUCT.md` — SetPoint purpose, scope, and product boundaries
- `docs/OPERATOR-WORKFLOW.md` — observed operator workflow
- `docs/DOMAIN-MODEL.md` — manufacturing concepts and relationships
- `docs/SAFETY-RULES.md` — manufacturing authority, safety, and data-trust rules
- `docs/ARCHITECTURE.md` — architectural principles and future integration boundaries
- `docs/decisions/README.md` — architecture decision records (ADRs)

---

## Developer Commands

```bash
# Start backend server in development
npm run server

# Start Vite dev server with hot reload
npm run dev

# Build production bundle for Netlify
npm run build

# Re-seed database from Mimir factory data
npm run seed

# Run automated tests
npm test
node test/http.test.js
```
