'use strict';
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

/* ---------- validation helpers ---------- */
const str = (v, max = 300) => (typeof v === 'string' ? v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '').trim().slice(0, max) : '');
const num = (v, { min = -Infinity, max = Infinity } = {}) => {
  if (v === '' || v === null || v === undefined) return null;
  const n = Number(String(v).replace(/[,\s٬]/g, ''));
  return Number.isFinite(n) && n >= min && n <= max ? n : null;
};
const oneOf = (v, list, dflt = '') => (list.includes(v) ? v : dflt);
const bi = (o, max = 300) => {
  if (typeof o === 'string') { const s = str(o, max); return { ar: s, en: s }; }
  const ar = str(o && o.ar, max); const en = str(o && o.en, max);
  return { ar: ar || en, en: en || ar };
};

/* Arabic-Indic digits → Latin, then Saudi mobile normalisation → 05XXXXXXXX */
function digits(s) {
  return String(s || '').replace(/[٠-٩]/g, (d) => '٠١٢٣٤٥٦٧٨٩'.indexOf(d)).replace(/[۰-۹]/g, (d) => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
}
function normPhone(s) {
  const d = digits(s).replace(/[\s\-()+]/g, '');
  let m;
  if ((m = d.match(/^(?:00)?966(5\d{8})$/))) return '0' + m[1];
  if ((m = d.match(/^0?(5\d{8})$/))) return '0' + m[1];
  return '';
}
const normEmail = (s) => { const e = str(s, 120).toLowerCase(); return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e) ? e : ''; };

/* A free-form `details` object — only short primitives, whitelisted by key shape */
function cleanDetails(d, allowed) {
  const out = {};
  if (!d || typeof d !== 'object') return out;
  for (const [k, v] of Object.entries(d)) {
    if (allowed && !allowed.includes(k)) continue;
    if (!/^[a-zA-Z][a-zA-Z0-9_]{0,30}$/.test(k)) continue;
    if (typeof v === 'boolean') { if (v) out[k] = true; }
    else if (typeof v === 'number') { if (Number.isFinite(v)) out[k] = v; }
    else if (typeof v === 'string') { const s = str(v, 300); if (s) out[k] = s; }
    else if (Array.isArray(v)) { const a = v.filter((x) => typeof x === 'string').map((x) => str(x, 40)).filter(Boolean).slice(0, 30); if (a.length) out[k] = a; }
    if (Object.keys(out).length >= 60) break;
  }
  return out;
}

/* ---------- HTTP helpers ---------- */
function readBody(req, limit = 1024 * 1024) {
  return new Promise((resolve, reject) => {
    let size = 0; const chunks = [];
    req.on('data', (c) => {
      size += c.length;
      if (size > limit) { reject(Object.assign(new Error('Payload too large'), { status: 413 })); req.destroy(); return; }
      chunks.push(c);
    });
    req.on('end', () => {
      if (!chunks.length) return resolve({});
      try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8'))); }
      catch (e) { reject(Object.assign(new Error('Invalid JSON'), { status: 400 })); }
    });
    req.on('error', reject);
  });
}
const send = (res, status, body, headers = {}) => {
  const isObj = body !== null && typeof body === 'object' && !Buffer.isBuffer(body);
  const data = isObj ? JSON.stringify(body) : (body == null ? '' : body);
  res.writeHead(status, Object.assign({ 'Content-Type': isObj ? 'application/json; charset=utf-8' : 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' }, headers));
  res.end(data);
};
const fail = (status, message) => Object.assign(new Error(message), { status });

/* ---------- rate limiting (in memory, per key) ---------- */
const buckets = new Map();
function rateLimit(key, max, windowMs) {
  const now = Date.now();
  let b = buckets.get(key);
  if (!b || b.reset < now) { b = { n: 0, reset: now + windowMs }; buckets.set(key, b); }
  b.n++;
  if (b.n > max) throw fail(429, 'محاولات كثيرة، حاول لاحقاً');
}
setInterval(() => { const now = Date.now(); for (const [k, b] of buckets) if (b.reset < now) buckets.delete(k); }, 60000).unref();

/* ---------- uploads ---------- */
const MAGIC = [
  { ext: 'jpg', mime: 'image/jpeg', test: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
  { ext: 'png', mime: 'image/png', test: (b) => b.slice(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])) },
  { ext: 'webp', mime: 'image/webp', test: (b) => b.slice(0, 4).toString() === 'RIFF' && b.slice(8, 12).toString() === 'WEBP' },
  { ext: 'pdf', mime: 'application/pdf', test: (b) => b.slice(0, 5).toString() === '%PDF-' }
];
function sniff(buf) { return MAGIC.find((m) => buf.length > 12 && m.test(buf)) || null; }
const MIME = { jpg: 'image/jpeg', png: 'image/png', webp: 'image/webp', pdf: 'application/pdf' };

const id = (n = 9) => crypto.randomBytes(n).toString('hex');

function safeJoin(base, ...parts) {
  const p = path.resolve(base, ...parts);
  if (p !== base && !p.startsWith(base + path.sep)) return null;
  return p;
}

module.exports = { str, num, oneOf, bi, digits, normPhone, normEmail, cleanDetails, readBody, send, fail, rateLimit, sniff, MIME, id, safeJoin, fs, path, crypto };
