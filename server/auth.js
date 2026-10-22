'use strict';
const crypto = require('crypto');
const { db, save, nextId } = require('./db');
const { fail } = require('./util');

const COOKIE = 'isc_sid';
const DAYS = 30;

function hashPassword(pw) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(pw, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}
function verifyPassword(pw, stored) {
  if (!stored) { crypto.scryptSync(String(pw), '0'.repeat(32), 64); return false; }
  const [salt, hash] = stored.split(':');
  const a = Buffer.from(hash, 'hex');
  const b = crypto.scryptSync(pw, salt, 64);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
const sha = (t) => crypto.createHash('sha256').update(t).digest('hex');

function parseCookies(req) {
  const out = {};
  String(req.headers.cookie || '').split(';').forEach((p) => {
    const i = p.indexOf('=');
    if (i > 0) out[p.slice(0, i).trim()] = decodeURIComponent(p.slice(i + 1).trim());
  });
  return out;
}
const isSecure = (req) => process.env.COOKIE_SECURE === '1' || req.headers['x-forwarded-proto'] === 'https' || (req.socket && req.socket.encrypted);

function cookieHeader(req, token, maxAge) {
  return `${COOKIE}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${isSecure(req) ? '; Secure' : ''}`;
}

function createSession(req, res, user) {
  const token = crypto.randomBytes(32).toString('hex');
  db.sessions.push({ id: sha(token), userId: user.id, exp: Date.now() + DAYS * 864e5, ua: String(req.headers['user-agent'] || '').slice(0, 120) });
  // keep at most 8 sessions per user
  const mine = db.sessions.filter((s) => s.userId === user.id);
  if (mine.length > 8) mine.slice(0, mine.length - 8).forEach((s) => db.sessions.splice(db.sessions.indexOf(s), 1));
  save();
  const prev = res.getHeader('Set-Cookie');
  res.setHeader('Set-Cookie', [].concat(prev || [], cookieHeader(req, token, DAYS * 86400)));
}

function destroySession(req, res) {
  const t = parseCookies(req)[COOKIE];
  if (t) { const i = db.sessions.findIndex((s) => s.id === sha(t)); if (i >= 0) { db.sessions.splice(i, 1); save(); } }
  res.setHeader('Set-Cookie', cookieHeader(req, '', 0));
}

function currentUser(req) {
  if (req._user !== undefined) return req._user;
  const t = parseCookies(req)[COOKIE];
  let user = null;
  if (t) {
    const s = db.sessions.find((x) => x.id === sha(t));
    if (s && s.exp > Date.now()) {
      user = db.users.find((u) => u.id === s.userId && u.status !== 'blocked') || null;
    }
  }
  req._user = user;
  return user;
}

const requireUser = (req) => { const u = currentUser(req); if (!u) throw fail(401, 'يجب تسجيل الدخول أولاً'); return u; };
const isStaff = (u) => u && (u.role === 'admin' || u.role === 'staff');
const requireStaff = (req) => { const u = requireUser(req); if (!isStaff(u)) throw fail(403, 'غير مصرّح'); return u; };
const requireAdmin = (req) => { const u = requireUser(req); if (u.role !== 'admin') throw fail(403, 'هذه الصلاحية للمدير فقط'); return u; };

setInterval(() => {
  const now = Date.now(); const n = db.sessions.length;
  db.sessions = db.sessions.filter((s) => s.exp > now);
  if (db.sessions.length !== n) save();
}, 3600e3).unref();

/* Public view of a user (never the hash) */
function publicUser(u) {
  return {
    id: u.id, name: u.name, phone: u.phone, email: u.email || '', city: u.city || '', role: u.role, type: u.type || 'individual',
    status: u.status || 'active', createdAt: u.createdAt, docs: u.docs || {}, mustChangePassword: !!u.mustChangePassword
  };
}

/* First run: make sure an administrator exists */
function ensureAdmin() {
  if (db.users.some((u) => u.role === 'admin')) return;
  const phone = process.env.ADMIN_PHONE || '0552408287';
  let pw = process.env.ADMIN_PASSWORD;
  let generated = false;
  if (!pw) { pw = crypto.randomBytes(6).toString('base64url'); generated = true; }
  db.users.push({
    id: nextId('user'), name: process.env.ADMIN_NAME || 'مدير الموقع', phone, email: '', city: '', role: 'admin', type: 'company',
    pass: hashPassword(pw), status: 'active', docs: {}, createdAt: new Date().toISOString(), mustChangePassword: generated
  });
  save();
  console.log('\n  ┌─ تم إنشاء حساب المدير ─────────────────────────────');
  console.log(`  │ رقم الجوال : ${phone}`);
  console.log(`  │ كلمة المرور: ${generated ? pw + '   (مؤقتة — غيّرها بعد أول دخول)' : '(من متغير ADMIN_PASSWORD)'}`);
  console.log('  └────────────────────────────────────────────────────\n');
}

module.exports = { hashPassword, verifyPassword, createSession, destroySession, currentUser, requireUser, requireStaff, requireAdmin, isStaff, publicUser, ensureAdmin, parseCookies };
