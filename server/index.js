'use strict';
/* مركز الخدمات المتكاملة — web server (static site + API + dashboard). Run:  node server/index.js  */
const http = require('http');
const fs = require('fs');
const path = require('path');
const zlib = require('zlib');
const { db, DATA_DIR } = require('./db');
const U = require('./util');
const A = require('./auth');
const seed = require('./seed');

seed.run();
A.ensureAdmin();
const api = require('./api');
require('./admin');
const pages = require('./pages');

const ROOT = path.join(__dirname, '..');
const PORT = +process.env.PORT || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.woff2': 'font/woff2', '.txt': 'text/plain; charset=utf-8'
};
const COMPRESSIBLE = new Set(['.html', '.css', '.js', '.json', '.svg', '.txt']);
const gzCache = new Map();

const SECURITY = {
  'X-Content-Type-Options': 'nosniff', 'X-Frame-Options': 'SAMEORIGIN', 'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
  'Content-Security-Policy': "default-src 'self'; img-src 'self' data: blob: https:; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; script-src 'self' 'unsafe-inline'; connect-src 'self'; frame-src https://www.google.com https://maps.google.com; frame-ancestors 'self'; base-uri 'self'; form-action 'self'; object-src 'none'"
};

function serveFile(req, res, file, { cache }) {
  let st;
  try { st = fs.statSync(file); } catch (e) { return false; }
  if (!st.isFile()) return false;
  const ext = path.extname(file).toLowerCase();
  const type = TYPES[ext];
  if (!type) return false;
  const etag = `W/"${st.size}-${Math.round(st.mtimeMs)}"`;
  const headers = Object.assign({ 'Content-Type': type, ETag: etag, 'Cache-Control': cache }, SECURITY);
  if (req.headers['if-none-match'] === etag) { res.writeHead(304, headers); res.end(); return true; }
  let body = fs.readFileSync(file);
  if (COMPRESSIBLE.has(ext) && /\bgzip\b/.test(req.headers['accept-encoding'] || '') && body.length > 1024) {
    let c = gzCache.get(file);
    if (!c || c.etag !== etag) { c = { etag, buf: zlib.gzipSync(body) }; gzCache.set(file, c); }
    body = c.buf; headers['Content-Encoding'] = 'gzip'; headers.Vary = 'Accept-Encoding';
  }
  res.writeHead(200, headers);
  res.end(req.method === 'HEAD' ? undefined : body);
  return true;
}

function staticFile(req, res, pathname) {
  let rel = decodeURIComponent(pathname);
  if (rel === '/') rel = '/index.html';
  if (/(^|\/)\./.test(rel)) return false;                      // no dotfiles
  // uploaded listing / blog images live in data/uploads
  if (rel.startsWith('/uploads/')) {
    const f = U.safeJoin(path.join(DATA_DIR, 'uploads'), rel.slice('/uploads/'.length));
    return f ? serveFile(req, res, f, { cache: 'public, max-age=604800' }) : false;
  }
  const top = rel.split('/')[1];
  const isRootHtml = /^\/[\w-]+\.html$/.test(rel);
  if (!isRootHtml && top !== 'assets') return false;           // only pages and assets are public — never server/, data/, package.json…
  const f = U.safeJoin(ROOT, rel.slice(1));
  if (!f) return false;
  const ext = path.extname(f).toLowerCase();
  return serveFile(req, res, f, { cache: ext === '.html' || ext === '.js' || ext === '.css' ? 'no-cache' : 'public, max-age=604800' });
}

async function handleApi(req, res, url) {
  const method = req.method;
  if (method !== 'GET' && method !== 'HEAD') {
    // CSRF: only our own pages can send this header (cross-site requests would need a CORS preflight, which we never allow)
    if (req.headers['x-requested-with'] !== 'isc') throw U.fail(403, 'طلب غير مصرّح');
    const origin = req.headers.origin;
    if (origin) { try { if (new URL(origin).host !== req.headers.host) throw 0; } catch (e) { throw U.fail(403, 'طلب غير مصرّح'); } }
  }
  const pathname = url.pathname;
  for (const r of api.routes) {
    if (r.method !== method && !(method === 'HEAD' && r.method === 'GET')) continue;
    const m = r.re.exec(pathname);
    if (!m) continue;
    const body = (method === 'GET' || method === 'HEAD' || method === 'DELETE') ? {} : await U.readBody(req, pathname === '/api/upload' ? 9 * 1024 * 1024 : 300 * 1024);
    const ctx = { req, res, url, params: m.groups || {}, query: Object.fromEntries(url.searchParams), body };
    const out = await r.fn(ctx);
    if (out === null) return;                 // handler wrote the response itself
    U.send(res, 200, out, SECURITY);
    return;
  }
  throw U.fail(404, 'غير موجود');
}

const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://x');
    const p = url.pathname;
    if (p.startsWith('/api/')) {
      try { await handleApi(req, res, url); }
      catch (e) {
        const status = e.status || 500;
        if (status === 500) console.error(e);
        if (!res.headersSent) U.send(res, status, { error: status === 500 ? 'حدث خطأ غير متوقع' : e.message }, SECURITY);
      }
      return;
    }
    if (req.method !== 'GET' && req.method !== 'HEAD') { U.send(res, 405, 'Method Not Allowed'); return; }
    if (pages.handle(req, res, url, SECURITY)) return;
    if (staticFile(req, res, p)) return;
    const nf = path.join(ROOT, '404.html');
    res.writeHead(404, Object.assign({ 'Content-Type': 'text/html; charset=utf-8' }, SECURITY));
    res.end(fs.existsSync(nf) ? fs.readFileSync(nf) : 'Not found');
  } catch (e) {
    console.error(e);
    if (!res.headersSent) U.send(res, 400, 'Bad request');
  }
});

server.listen(PORT, HOST, () => {
  console.log(`\n  مركز الخدمات المتكاملة — http://localhost:${PORT}`);
  console.log(`  لوحة التحكم: http://localhost:${PORT}/admin.html\n`);
});

module.exports = server;
