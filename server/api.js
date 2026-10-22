'use strict';
/* Public + customer API.  Admin API lives in admin.js */
const { db, save, nextId, DATA_DIR } = require('./db');
const U = require('./util');
const A = require('./auth');
const PROP = require('../assets/js/propschema');
const seed = require('./seed');
const mdr = require('./md');

const { str, num, oneOf, bi, normPhone, normEmail, cleanDetails, fail } = U;
const W = (() => { try { return seed.loadStatic(); } catch (e) { return { MARKET: { deals: [], types: {} }, SITE: { cities: [] } }; } })();
const DEALS = W.MARKET.deals.map((d) => d.id);
const dealTypes = (d) => (W.MARKET.deals.find((x) => x.id === d) || { types: [] }).types;
const typeLabel = (k) => (W.MARKET.types[k] ? W.MARKET.types[k].one : { ar: k, en: k });

const REQUEST_TYPES = ['service', 'appointment', 'contact', 'inquiry', 'property_request'];
const STATUSES = ['new', 'in_progress', 'waiting', 'completed', 'cancelled'];
const DOC_TYPES = ['adLicense', 'cr', 'fal'];
const nowIso = () => new Date().toISOString();
const ipOf = (req) => (process.env.TRUST_PROXY === '1' && String(req.headers['x-forwarded-for'] || '').split(',')[0].trim()) || req.socket.remoteAddress || 'x';

/* ---------------- appointments ---------------- */
function riyadhNow() {
  const p = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Riyadh', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' })
    .formatToParts(new Date()).reduce((o, x) => { o[x.type] = x.value; return o; }, {});
  return { date: `${p.year}-${p.month}-${p.day}`, minutes: (+p.hour) * 60 + (+p.minute) };
}
const toMin = (hhmm) => { const [h, m] = hhmm.split(':').map(Number); return h * 60 + m; };
const fromMin = (n) => `${String(Math.floor(n / 60)).padStart(2, '0')}:${String(n % 60).padStart(2, '0')}`;
function addDays(date, n) { const d = new Date(date + 'T00:00:00Z'); d.setUTCDate(d.getUTCDate() + n); return d.toISOString().slice(0, 10); }

function slotsFor(date) {
  const s = db.settings.appointments;
  if (!s.enabled) return { open: false, slots: [], reason: 'disabled' };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || isNaN(new Date(date + 'T00:00:00Z'))) throw fail(400, 'تاريخ غير صحيح');
  const now = riyadhNow();
  if (date < now.date || date > addDays(now.date, s.maxDaysAhead)) return { open: false, slots: [], reason: 'range' };
  const dow = new Date(date + 'T00:00:00Z').getUTCDay();
  if (!s.days.includes(dow)) return { open: false, slots: [], reason: 'closed_day' };
  const booked = {};
  db.requests.forEach((r) => { if (r.appointment && r.appointment.date === date && r.status !== 'cancelled') booked[r.appointment.time] = (booked[r.appointment.time] || 0) + 1; });
  const slots = [];
  for (let m = toMin(s.open); m + s.slotMinutes <= toMin(s.close); m += s.slotMinutes) {
    if (date === now.date && m <= now.minutes + 30) continue;
    const t = fromMin(m);
    const left = s.capacity - (booked[t] || 0);
    slots.push({ time: t, left: Math.max(0, left) });
  }
  return { open: true, slots };
}

/* ---------------- views ---------------- */
function publicSettings() {
  const s = db.settings;
  return { site: s.site, appointments: { enabled: s.appointments.enabled, days: s.appointments.days, open: s.appointments.open, close: s.appointments.close, slotMinutes: s.appointments.slotMinutes, maxDaysAhead: s.appointments.maxDaysAhead },
    listings: { requireAdLicense: s.listings.requireAdLicense, maxImages: s.listings.maxImages, autoPublish: s.listings.autoPublish } };
}

function catalogPublic() {
  const out = {
    realestate: { title: { ar: 'الخدمات العقارية', en: 'Real Estate Services' }, categories: [] },
    taqib: { title: { ar: 'الخدمات العامة', en: 'General Services' }, categories: [] },
    students: { title: { ar: 'الخدمات الطلابية', en: 'Student Services' }, categories: [] }
  };
  db.categories.filter((c) => c.active).sort((a, b) => a.order - b.order).forEach((c) => {
    if (!out[c.section]) return;
    const items = c.items.filter((i) => i.active).sort((a, b) => a.order - b.order);
    if (!items.length) return;
    out[c.section].categories.push({
      id: c.id, icon: c.icon, img: c.img, title: c.title, desc: c.desc,
      items: items.map((i) => [i.icon, i.title.ar, i.title.en, i.desc.ar, i.desc.en, i.id, i.appointment !== false])
    });
  });
  return out;
}

const UPLOADED = /^\d+_[a-f0-9]{16}\.(jpg|png|webp)$/;
const imgUrl = (f) => (UPLOADED.test(f) ? `/uploads/listings/${f}` : (f.includes('/') ? f : `assets/img/${f}`));
const userById = (id) => (id ? db.users.find((u) => u.id === id) : null);
const verifiedFlags = (u) => ({ ad: !!(u && u.docs && u.docs.adLicense && u.docs.adLicense.status === 'verified'), cr: !!(u && u.docs && u.docs.cr && u.docs.cr.status === 'verified'), fal: !!(u && u.docs && u.docs.fal && u.docs.fal.status === 'verified') });

function isLive(l) {
  if (l.status !== 'published') return false;
  const days = db.settings.listings.expireDays;
  if (l.sample || !days) return true;
  return new Date(l.publishedAt || l.createdAt).getTime() + days * 864e5 > Date.now();
}

function listingPublic(l, { full = false } = {}) {
  const owner = userById(l.userId);
  const images = (l.images || []).map(imgUrl);
  const o = {
    id: l.id, kind: l.kind, deal: l.deal, type: l.type, city: l.city, district: l.district, title: l.title,
    price: l.price, per: l.per, area: l.area, rooms: l.rooms, baths: l.baths, img: images[0] || '', images,
    date: String(l.createdAt).slice(0, 10), sample: !!l.sample, featured: !!l.featured, verified: verifiedFlags(owner),
    license: l.adLicense || '', ownerType: owner ? owner.type : '', details: l.details || {}, description: l.description || { ar: '', en: '' }
  };
  return o;
}

function requestView(r, forOwner) {
  const o = {
    id: r.id, ref: r.ref, type: r.type, status: r.status, service: r.service || null, appointment: r.appointment || null,
    property: r.property || null, listingId: r.listingId || null, city: r.city, notes: r.notes, createdAt: r.createdAt, updatedAt: r.updatedAt,
    history: (r.history || []).filter((h) => !forOwner || h.public).map((h) => ({ at: h.at, status: h.status, note: h.note }))
  };
  return o;
}

/* ---------------- webhook notification ---------------- */
function notify(event, payload) {
  const url = db.settings.notify && db.settings.notify.webhookUrl;
  if (!url || !/^https?:\/\//.test(url) || typeof fetch !== 'function') return;
  const ctrl = new AbortController(); const t = setTimeout(() => ctrl.abort(), 5000);
  fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ event, at: nowIso(), ...payload }), signal: ctrl.signal })
    .catch(() => {}).finally(() => clearTimeout(t));
}

/* ---------------- request creation ---------------- */
function findService(id) {
  for (const c of db.categories) {
    const it = c.items.find((i) => i.id === id);
    if (it) return { c, it };
  }
  return null;
}

function makeTitle(kind, deal, type, city) {
  const t = typeLabel(type);
  const dealAr = { rent: 'للإيجار', sale: kind === 'request' ? 'للشراء' : 'للبيع', invest: 'للاستثمار' }[deal];
  const dealEn = { rent: 'for rent', sale: kind === 'request' ? 'to buy' : 'for sale', invest: 'for investment' }[deal];
  return kind === 'request'
    ? { ar: `مطلوب ${t.ar} ${dealAr} في ${city}`, en: `Wanted: ${t.en} ${dealEn} in ${city}` }
    : { ar: `${t.ar} ${dealAr} في ${city}`, en: `${t.en} ${dealEn} in ${city}` };
}

const DETAIL_KEYS = Object.keys(PROP.FIELDS).concat(['budgetMin', 'budgetMax', 'price']);

function checkFiles(files, user, max) {
  const out = [];
  for (const f of [].concat(files || []).slice(0, max)) {
    if (typeof f !== 'string' || !UPLOADED.test(f)) continue;
    if (!user || (user.role === 'user' && !f.startsWith(user.id + '_'))) continue;
    if (!U.fs.existsSync(U.path.join(DATA_DIR, 'uploads', 'listings', f))) continue;
    out.push(f);
  }
  return out;
}

function createListing(user, b, kind, extra = {}, opts = {}) {
  const deal = oneOf(b.deal, DEALS);
  if (!deal) throw fail(400, 'اختر القسم');
  const type = oneOf(b.type, dealTypes(deal));
  if (!type) throw fail(400, 'اختر نوع العقار');
  const city = str(b.city, 40);
  if (!city) throw fail(400, 'اختر المدينة');
  const details = cleanDetails(b.details, DETAIL_KEYS);
  const price = num(b.price, { min: 0, max: 1e10 });
  const settings = db.settings.listings;
  const adLicense = str(b.adLicense, 40) || (user.docs && user.docs.adLicense && user.docs.adLicense.number) || '';
  if (kind === 'offer' && !opts.skipRules) {
    if (settings.requireAdLicense && !adLicense) throw fail(400, 'رقم ترخيص الإعلان مطلوب');
    if (!price && deal !== 'invest') throw fail(400, 'اكتب السعر المطلوب');
  }
  const images = checkFiles(b.images, user, settings.maxImages);
  const title = (b.title && str(typeof b.title === 'string' ? b.title : b.title.ar, 120)) ? bi(b.title, 120) : makeTitle(kind, deal, type, city);
  const l = {
    id: nextId('listing'), kind, deal, type, city, district: bi(str(b.district, 60)), title, description: bi(str(b.description, 3000), 3000),
    price, per: deal === 'rent' ? oneOf(b.per, ['year', 'month'], 'year') : '',
    area: num(details.area || b.area, { min: 0, max: 1e8 }) || null, rooms: num(details.bedrooms, { min: 0, max: 100 }), baths: num(details.bathrooms, { min: 0, max: 100 }),
    details, images, userId: user.id, adLicense: kind === 'offer' ? adLicense : '', status: settings.autoPublish ? 'published' : 'pending',
    featured: false, sample: false, createdAt: nowIso(), publishedAt: settings.autoPublish ? nowIso() : null, views: 0, ...extra
  };
  db.listings.push(l);
  save();
  return l;
}

function newRequest(base) {
  const id = nextId('request');
  const r = Object.assign({
    id, ref: `ISC-${id}`, status: 'new', createdAt: nowIso(), updatedAt: nowIso(), adminNote: '', assignedTo: null,
    history: [{ at: nowIso(), status: 'new', note: 'تم استلام الطلب', public: true, by: 'system' }]
  }, base);
  db.requests.push(r);
  save();
  notify('request.created', { ref: r.ref, type: r.type, name: r.name, phone: r.phone, service: r.service && r.service.titleAr });
  return r;
}

function handleCreateRequest(ctx) {
  const { req, body: b } = ctx;
  const user = A.currentUser(req);
  U.rateLimit('req:' + ipOf(req), 30, 3600e3);
  const type = oneOf(b.type, REQUEST_TYPES);
  if (!type) throw fail(400, 'نوع الطلب غير صحيح');
  if (type === 'property_request' && !user) throw fail(401, 'سجّل الدخول لإرسال طلب عقار');

  const name = str(b.name, 80) || (user && user.name) || '';
  const phone = normPhone(b.phone) || (user && user.phone) || '';
  if (!name) throw fail(400, 'اكتب اسمك');
  if (!phone) throw fail(400, 'رقم جوال سعودي صحيح يبدأ بـ 05');
  const base = { type, userId: user ? user.id : null, name, phone, email: normEmail(b.email) || (user && user.email) || '', city: str(b.city, 40), notes: str(b.notes, 2000) };
  if (type === 'service' && !b.serviceId) throw fail(400, 'اختر الخدمة');

  if (b.serviceId) {
    const f = findService(str(b.serviceId, 60));
    if (!f || !f.c.active || !f.it.active) throw fail(400, 'الخدمة غير متاحة');
    base.service = { id: f.it.id, titleAr: f.it.title.ar, titleEn: f.it.title.en, categoryAr: f.c.title.ar, categoryEn: f.c.title.en, section: f.c.section };
  }
  if (type === 'appointment') {
    const date = str(b.date, 10); const time = str(b.time, 5);
    const info = slotsFor(date);
    const slot = info.slots.find((x) => x.time === time);
    if (!info.open || !slot) throw fail(400, 'الموعد المختار غير متاح');
    if (slot.left <= 0) throw fail(409, 'هذا الموعد اكتمل، اختر وقتاً آخر');
    base.appointment = { date, time, mode: oneOf(b.mode, ['visit', 'call'], 'visit') };
  }
  if (type === 'contact' && !base.notes) throw fail(400, 'اكتب رسالتك');
  if (type === 'inquiry') {
    const l = db.listings.find((x) => x.id === Number(b.listingId));
    if (!l || !isLive(l)) throw fail(400, 'الإعلان غير موجود');
    base.listingId = l.id;
    if (!base.notes) base.notes = 'أرغب بالاستفسار عن هذا الإعلان';
  }
  if (type === 'property_request') {
    const deal = oneOf(b.deal, DEALS); if (!deal) throw fail(400, 'اختر القسم');
    const ptype = oneOf(b.ptype, dealTypes(deal)); if (!ptype) throw fail(400, 'اختر نوع العقار');
    if (!base.city) throw fail(400, 'اختر المدينة');
    const details = cleanDetails(b.details, DETAIL_KEYS);
    base.property = { deal, type: ptype, details };
    const r = newRequest(base);
    if (b.publish === true) {
      const l = createListing(user, { deal, type: ptype, city: base.city, district: str(b.details && b.details.districts, 60), details, price: details.budgetMax || details.budgetMin || null, per: b.per, description: base.notes }, 'request', { requestId: r.id });
      r.listingId = l.id; save();
    }
    return { ok: true, request: requestView(r, true) };
  }
  return { ok: true, request: requestView(newRequest(base), true) };
}

/* ---------------- routes ---------------- */
const routes = [];
const route = (method, pattern, fn) => routes.push({ method, re: new RegExp('^' + pattern.replace(/:(\w+)/g, '(?<$1>[^/]+)') + '$'), fn });

/* ---- public ---- */
route('GET', '/api/config', () => publicSettings());
route('GET', '/api/catalog', () => catalogPublic());

route('GET', '/api/listings', ({ query }) => {
  const kind = oneOf(query.kind, ['offer', 'request']); const deal = oneOf(query.deal, DEALS);
  let list = db.listings.filter(isLive).filter((l) => (!kind || l.kind === kind) && (!deal || l.deal === deal) && (!query.type || l.type === query.type) && (!query.city || l.city === query.city));
  list.sort((a, b) => (b.featured - a.featured) || String(b.createdAt).localeCompare(String(a.createdAt)) || b.id - a.id);
  return { listings: list.slice(0, 500).map((l) => listingPublic(l)), total: list.length };
});
route('GET', '/api/listings/:id', ({ params }) => {
  const l = db.listings.find((x) => x.id === Number(params.id));
  if (!l || !isLive(l)) throw fail(404, 'الإعلان غير موجود');
  l.views = (l.views || 0) + 1; save();
  return listingPublic(l, { full: true });
});
route('GET', '/api/slots', ({ query }) => slotsFor(str(query.date, 10)));

route('POST', '/api/requests', handleCreateRequest);

route('GET', '/api/blog', () => ({
  posts: db.posts.filter((p) => p.status === 'published').sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)))
    .map((p) => ({ id: p.id, slug: p.slug, title: p.title, excerpt: p.excerpt, cover: p.cover, category: p.category, date: String(p.publishedAt).slice(0, 10) }))
}));

/* ---- auth ---- */
route('POST', '/api/auth/register', ({ req, res, body: b }) => {
  U.rateLimit('reg:' + ipOf(req), 8, 3600e3);
  const name = str(b.name, 80); const phone = normPhone(b.phone); const email = normEmail(b.email);
  const pw = typeof b.password === 'string' ? b.password : '';
  if (name.length < 2) throw fail(400, 'اكتب اسمك');
  if (!phone) throw fail(400, 'رقم جوال سعودي صحيح يبدأ بـ 05');
  if (b.email && !email) throw fail(400, 'البريد الإلكتروني غير صحيح');
  if (pw.length < 8 || pw.length > 100) throw fail(400, 'كلمة المرور 8 أحرف على الأقل');
  if (db.users.some((u) => u.phone === phone)) throw fail(409, 'رقم الجوال مسجّل مسبقاً، سجّل الدخول');
  if (email && db.users.some((u) => u.email === email)) throw fail(409, 'البريد الإلكتروني مسجّل مسبقاً');
  const user = {
    id: nextId('user'), name, phone, email, city: str(b.city, 40), role: 'user', type: oneOf(b.type, ['individual', 'broker', 'company'], 'individual'),
    pass: A.hashPassword(pw), status: 'active', docs: {}, createdAt: nowIso()
  };
  db.users.push(user); save();
  A.createSession(req, res, user);
  notify('user.created', { name, phone });
  return { user: A.publicUser(user) };
});

route('POST', '/api/auth/login', ({ req, res, body: b }) => {
  U.rateLimit('login:' + ipOf(req), 15, 600e3);
  const id = str(b.login, 120).toLowerCase();
  const pw = typeof b.password === 'string' ? b.password : '';
  const phone = normPhone(id);
  const user = db.users.find((u) => (phone && u.phone === phone) || (u.email && u.email === id));
  if (!A.verifyPassword(pw, user && user.pass) || !user) throw fail(401, 'بيانات الدخول غير صحيحة');
  if (user.status === 'blocked') throw fail(403, 'تم إيقاف هذا الحساب، تواصل مع الإدارة');
  A.createSession(req, res, user);
  return { user: A.publicUser(user) };
});
route('POST', '/api/auth/logout', ({ req, res }) => { A.destroySession(req, res); return { ok: true }; });
route('GET', '/api/auth/me', ({ req }) => { const u = A.currentUser(req); return { user: u ? A.publicUser(u) : null }; });

/* ---- account ---- */
route('PATCH', '/api/me', ({ req, body: b }) => {
  const u = A.requireUser(req);
  if (b.name !== undefined) { const n = str(b.name, 80); if (n.length < 2) throw fail(400, 'اكتب اسمك'); u.name = n; }
  if (b.email !== undefined) {
    const e = normEmail(b.email);
    if (b.email && !e) throw fail(400, 'البريد الإلكتروني غير صحيح');
    if (e && db.users.some((x) => x.id !== u.id && x.email === e)) throw fail(409, 'البريد مستخدم لحساب آخر');
    u.email = e;
  }
  if (b.city !== undefined) u.city = str(b.city, 40);
  if (b.type !== undefined) u.type = oneOf(b.type, ['individual', 'broker', 'company'], u.type);
  save();
  return { user: A.publicUser(u) };
});
route('POST', '/api/me/password', ({ req, res, body: b }) => {
  const u = A.requireUser(req);
  U.rateLimit('pw:' + u.id, 10, 600e3);
  if (!A.verifyPassword(String(b.current || ''), u.pass)) throw fail(400, 'كلمة المرور الحالية غير صحيحة');
  const pw = String(b.password || '');
  if (pw.length < 8 || pw.length > 100) throw fail(400, 'كلمة المرور الجديدة 8 أحرف على الأقل');
  u.pass = A.hashPassword(pw); u.mustChangePassword = false;
  // sign out other devices
  db.sessions = db.sessions.filter((s) => s.userId !== u.id);
  save();
  A.createSession(req, res, u);
  return { ok: true };
});

route('GET', '/api/me/requests', ({ req }) => {
  const u = A.requireUser(req);
  return { requests: db.requests.filter((r) => r.userId === u.id).sort((a, b) => b.id - a.id).map((r) => requestView(r, true)) };
});
route('POST', '/api/me/requests/:id/cancel', ({ req, params }) => {
  const u = A.requireUser(req);
  const r = db.requests.find((x) => x.id === Number(params.id) && x.userId === u.id);
  if (!r) throw fail(404, 'الطلب غير موجود');
  if (!['new', 'waiting'].includes(r.status)) throw fail(400, 'لا يمكن إلغاء الطلب في حالته الحالية، تواصل معنا');
  r.status = 'cancelled'; r.updatedAt = nowIso();
  r.history.push({ at: nowIso(), status: 'cancelled', note: 'ألغى العميل الطلب', public: true, by: 'user' });
  save();
  return { request: requestView(r, true) };
});

route('GET', '/api/me/listings', ({ req }) => {
  const u = A.requireUser(req);
  return { listings: db.listings.filter((l) => l.userId === u.id).sort((a, b) => b.id - a.id).map((l) => Object.assign(listingPublic(l, { full: true }), { status: l.status, rejectReason: l.rejectReason || '' })) };
});
route('POST', '/api/listings', ({ req, body: b }) => {
  const u = A.requireUser(req);
  U.rateLimit('lst:' + u.id, 20, 3600e3);
  if (!b.contactOk && b.contactOk !== undefined) throw fail(400, 'يجب الموافقة على الشروط');
  const l = createListing(u, b, 'offer');
  notify('listing.created', { id: l.id, title: l.title.ar, user: u.name, phone: u.phone });
  return { listing: Object.assign(listingPublic(l, { full: true }), { status: l.status }) };
});
route('PATCH', '/api/me/listings/:id', ({ req, params, body: b }) => {
  const u = A.requireUser(req);
  const l = db.listings.find((x) => x.id === Number(params.id) && x.userId === u.id);
  if (!l) throw fail(404, 'الإعلان غير موجود');
  if (b.action === 'close') { l.status = 'closed'; save(); return { ok: true }; }
  if (b.action === 'reopen') { if (l.status !== 'closed') throw fail(400, 'غير ممكن'); l.status = db.settings.listings.autoPublish ? 'published' : 'pending'; save(); return { ok: true }; }
  if (b.title !== undefined) l.title = bi(b.title, 120);
  if (b.description !== undefined) l.description = bi(str(b.description, 3000), 3000);
  if (b.price !== undefined) l.price = num(b.price, { min: 0, max: 1e10 });
  if (b.district !== undefined) l.district = bi(str(b.district, 60));
  if (b.details) { l.details = cleanDetails(b.details, DETAIL_KEYS); l.area = num(l.details.area, { min: 0 }) || l.area; l.rooms = num(l.details.bedrooms, { min: 0 }); l.baths = num(l.details.bathrooms, { min: 0 }); }
  if (b.images) l.images = checkFiles(b.images, u, db.settings.listings.maxImages).concat((l.images || []).filter((f) => !UPLOADED.test(f) && b.images.includes(f)));
  if (l.status === 'published' || l.status === 'rejected') { l.status = db.settings.listings.autoPublish ? 'published' : 'pending'; l.rejectReason = ''; }
  save();
  return { listing: Object.assign(listingPublic(l, { full: true }), { status: l.status }) };
});
route('DELETE', '/api/me/listings/:id', ({ req, params }) => {
  const u = A.requireUser(req);
  const i = db.listings.findIndex((x) => x.id === Number(params.id) && x.userId === u.id);
  if (i < 0) throw fail(404, 'الإعلان غير موجود');
  db.listings.splice(i, 1); save();
  return { ok: true };
});

/* ---- documents (ad licence, commercial register, Fal licence) ---- */
const DOC_FILE = /^\d+_[a-f0-9]{16}\.(jpg|png|webp|pdf)$/;
route('POST', '/api/me/docs', ({ req, body: b }) => {
  const u = A.requireUser(req);
  const type = oneOf(b.type, DOC_TYPES); if (!type) throw fail(400, 'نوع الوثيقة غير صحيح');
  const number = str(b.number, 40); if (!number) throw fail(400, 'اكتب رقم الوثيقة');
  const expiry = /^\d{4}-\d{2}-\d{2}$/.test(b.expiry || '') ? b.expiry : '';
  const file = str(b.file, 80);
  const old = (u.docs || {})[type];
  if (file && !(DOC_FILE.test(file) && file.startsWith(u.id + '_') && U.fs.existsSync(U.path.join(DATA_DIR, 'private', file)))) throw fail(400, 'الملف غير صالح');
  if (!file && !(old && old.file)) throw fail(400, 'ارفع صورة أو ملف PDF للوثيقة');
  u.docs = u.docs || {};
  u.docs[type] = { number, expiry, file: file || old.file, status: 'pending', note: '', submittedAt: nowIso(), verifiedAt: null };
  save();
  notify('doc.submitted', { user: u.name, phone: u.phone, type });
  return { user: A.publicUser(u) };
});
route('DELETE', '/api/me/docs/:type', ({ req, params }) => {
  const u = A.requireUser(req);
  if (u.docs && u.docs[params.type]) { delete u.docs[params.type]; save(); }
  return { user: A.publicUser(u) };
});

/* ---- uploads (JSON + base64; images are resized in the browser first) ---- */
route('POST', '/api/upload', ({ req, body: b }) => {
  const u = A.requireUser(req);
  U.rateLimit('up:' + u.id, 80, 3600e3);
  const kind = oneOf(b.kind, ['listing', 'doc', 'blog']);
  if (!kind) throw fail(400, 'نوع غير صحيح');
  if (kind === 'blog' && !A.isStaff(u)) throw fail(403, 'غير مصرّح');
  const buf = Buffer.from(String(b.data || ''), 'base64');
  const limit = kind === 'doc' ? 6 * 1024 * 1024 : 4 * 1024 * 1024;
  if (!buf.length || buf.length > limit) throw fail(413, 'حجم الملف كبير (الحد الأقصى ' + (limit >> 20) + ' ميجا)');
  const m = U.sniff(buf);
  if (!m || (kind !== 'doc' && m.ext === 'pdf')) throw fail(400, kind === 'doc' ? 'مسموح: صورة أو PDF' : 'مسموح: صور JPG أو PNG أو WEBP');
  const file = `${u.id}_${U.id(8)}.${m.ext}`;
  const dir = kind === 'doc' ? 'private' : kind === 'blog' ? 'blog' : 'listings';
  const full = U.path.join(DATA_DIR, kind === 'doc' ? 'private' : 'uploads', ...(kind === 'doc' ? [] : [dir]));
  U.fs.mkdirSync(full, { recursive: true });
  U.fs.writeFileSync(U.path.join(full, file), buf);
  return { file, url: kind === 'doc' ? `/api/files/doc/${file}` : `/uploads/${dir}/${file}` };
});

/* private documents: owner or staff only */
function serveDoc(ctx) {
  const u = A.requireUser(ctx.req);
  const f = ctx.params.file;
  if (!DOC_FILE.test(f)) throw fail(404, 'غير موجود');
  if (!A.isStaff(u) && !f.startsWith(u.id + '_')) throw fail(403, 'غير مصرّح');
  const p = U.path.join(DATA_DIR, 'private', f);
  if (!U.fs.existsSync(p)) throw fail(404, 'غير موجود');
  const ext = f.split('.').pop();
  ctx.res.writeHead(200, { 'Content-Type': U.MIME[ext], 'Cache-Control': 'private, no-store', 'X-Content-Type-Options': 'nosniff', 'Content-Disposition': 'inline' });
  ctx.res.end(U.fs.readFileSync(p));
  return null;
}
route('GET', '/api/files/doc/:file', serveDoc);

module.exports = { routes, route, publicSettings, catalogPublic, listingPublic, requestView, slotsFor, isLive, notify, nowIso, STATUSES, DOC_TYPES, W, DEALS, dealTypes, makeTitle, createListing, DETAIL_KEYS, imgUrl, UPLOADED, mdr, ipOf };
