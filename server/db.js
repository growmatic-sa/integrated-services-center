'use strict';
/* =========================================================
   Tiny JSON database — a single file, atomic writes, zero dependencies.
   Fine for thousands of records. Keep the data/ folder on a persistent disk and back it up.
   ========================================================= */
const fs = require('fs');
const path = require('path');

const DATA_DIR = process.env.DATA_DIR ? path.resolve(process.env.DATA_DIR) : path.join(__dirname, '..', 'data');
const FILE = path.join(DATA_DIR, 'db.json');

const EMPTY = () => ({
  meta: { version: 1, seeded: false, counters: {} },
  settings: null,
  users: [],
  sessions: [],
  requests: [],
  listings: [],
  categories: [],
  posts: [],
  logs: []
});

fs.mkdirSync(DATA_DIR, { recursive: true });
let db;
try {
  db = Object.assign(EMPTY(), JSON.parse(fs.readFileSync(FILE, 'utf8')));
} catch (e) {
  if (fs.existsSync(FILE)) {
    // never overwrite a file we failed to parse
    fs.copyFileSync(FILE, FILE + '.corrupt-' + Date.now());
    console.error('db.json could not be read — a copy was kept as db.json.corrupt-*');
  }
  db = EMPTY();
}

let timer = null;
function flush() {
  clearTimeout(timer); timer = null;
  const tmp = FILE + '.tmp';
  fs.writeFileSync(tmp, JSON.stringify(db));
  fs.renameSync(tmp, FILE);
}
function save() { if (!timer) timer = setTimeout(flush, 150); }
['exit'].forEach((ev) => process.on(ev, () => { try { if (timer) flush(); } catch (e) { /* ignore */ } }));
['SIGINT', 'SIGTERM'].forEach((sig) => process.on(sig, () => { try { flush(); } catch (e) { /* ignore */ } process.exit(0); }));

function nextId(name, start = 1000) {
  const c = db.meta.counters;
  c[name] = (c[name] || start) + 1;
  save();
  return c[name];
}

module.exports = { db, save, flush, nextId, DATA_DIR };
