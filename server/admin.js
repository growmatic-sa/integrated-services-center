'use strict';
/* Dashboard API — staff (موظف) can work requests, appointments, ads and the blog; admin (مدير) can do everything. */
const { db, save, nextId } = require('./db');
const U = require('./util');
const A = require('./auth');
const api = require('./api');
const PROP = require('../assets/js/propschema');
const mdr = require('./md');

const { str, num, oneOf, bi, normPhone, normEmail, cleanDetails, fail } = U;
const { route, nowIso, STATUSES, DOC_TYPES } = api;

const log = (u, action, target) => {
  db.logs.push({ at: nowIso(), by: u.name, action, target: String(target || '') });
  if (db.logs.length > 400) db.logs.splice(0, db.logs.length - 400);
};
const R = (method, p, fn, level = 'staff') => route(method, p, (ctx) => {
  ctx.admin = level === 'admin' ? A.requireAdmin(ctx.req) : A.requireStaff(ctx.req);
  return fn(ctx);
});
const userOf = (id) => db.users.find((u) => u.id === id);
const userBrief = (u) => u && { id: u.id, name: u.name, phone: u.phone, email: u.email, type: u.type, verified: api.listingPublic({ userId: u.id, images: [], createdAt: '' }).verified };

/* ---------------- stats ---------------- */
R('GET', '/api/admin/stats', () => {
  const today = new Date().toISOString().slice(0, 10);
  const byStatus = {}; STATUSES.forEach((s) => { byStatus[s] = 0; });
  const byType = {};
  const days = {};
  for (let i = 13; i >= 0; i--) { const d = new Date(Date.now() - i * 864e5).toISOString().slice(0, 10); days[d] = 0; }
  const svc = {};
  db.requests.forEach((r) => {
    byStatus[r.status] = (byStatus[r.status] || 0) + 1;
    byType[r.type] = (byType[r.type] || 0) + 1;
    const d = r.createdAt.slice(0, 10); if (d in days) days[d]++;
    if (r.service) { const k = r.service.titleAr; svc[k] = (svc[k] || 0) + 1; }
  });
  const appts = db.requests.filter((r) => r.appointment && r.status !== 'cancelled' && r.appointment.date >= today);
  return {
    requests: { total: db.requests.length, new: byStatus.new, byStatus, byType, today: db.requests.filter((r) => r.createdAt.slice(0, 10) === today).length },
    appointments: { upcoming: appts.length, today: appts.filter((r) => r.appointment.date === today).length },
    listings: { total: db.listings.length, pending: db.listings.filter((l) => l.status === 'pending').length, published: db.listings.filter((l) => l.status === 'published').length, sample: db.listings.filter((l) => l.sample).length },
    users: { total: db.users.length, pendingDocs: db.users.filter((u) => Object.values(u.docs || {}).some((d) => d.status === 'pending')).length },
    posts: { total: db.posts.length, published: db.posts.filter((p) => p.status === 'published').length },
    services: { categories: db.categories.length, items: db.categories.reduce((n, c) => n + c.items.length, 0) },
    daily: Object.entries(days).map(([date, n]) => ({ date, n })),
    topServices: Object.entries(svc).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([title, n]) => ({ title, n })),
    logs: db.logs.slice(-12).reverse()
  };
});

/* ---------------- requests ---------------- */
function filterRequests(q) {
  const s = String(q.q || '').trim().toLowerCase();
  const sDigits = U.digits(s);
  return db.requests.filter((r) => {
    if (q.type && r.type !== q.type) return false;
    if (q.status && r.status !== q.status) return false;
    if (q.from && r.createdAt.slice(0, 10) < q.from) return false;
    if (q.to && r.createdAt.slice(0, 10) > q.to) return false;
    if (s) {
      const hay = [r.ref, r.name, r.phone, r.email, r.city, r.notes, r.service && r.service.titleAr, r.service && r.service.titleEn].join(' ').toLowerCase();
      if (!hay.includes(s) && !hay.includes(sDigits)) return false;
    }
    return true;
  }).sort((a, b) => b.id - a.id);
}
const reqFull = (r) => Object.assign({}, r, { user: userBrief(userOf(r.userId)), listing: r.listingId ? (() => { const l = db.listings.find((x) => x.id === r.listingId); return l ? { id: l.id, title: l.title, status: l.status } : null; })() : null });

R('GET', '/api/admin/requests', ({ query }) => {
  const list = filterRequests(query);
  const limit = Math.min(200, Math.max(1, +query.limit || 40)); const page = Math.max(1, +query.page || 1);
  return { total: list.length, page, limit, items: list.slice((page - 1) * limit, page * limit).map((r) => Object.assign({}, r, { adminNote: undefined, history: undefined })) };
});
R('GET', '/api/admin/requests/:id', ({ params }) => {
  const r = db.requests.find((x) => x.id === Number(params.id)); if (!r) throw fail(404, 'غير موجود');
  return reqFull(r);
});
R('PATCH', '/api/admin/requests/:id', ({ params, body: b, admin }) => {
  const r = db.requests.find((x) => x.id === Number(params.id)); if (!r) throw fail(404, 'غير موجود');
  const status = b.status !== undefined ? oneOf(b.status, STATUSES) : r.status;
  if (!status) throw fail(400, 'حالة غير صحيحة');
  const customerNote = str(b.customerNote, 500);
  if (status !== r.status || customerNote) {
    r.history.push({ at: nowIso(), status, note: customerNote || ({ in_progress: 'بدأنا العمل على طلبك', waiting: 'بانتظار ردك / مستنداتك', completed: 'تم إنجاز الطلب', cancelled: 'تم إلغاء الطلب', new: 'أعيد فتح الطلب' }[status] || ''), public: true, by: admin.name });
  }
  r.status = status;
  if (b.adminNote !== undefined) r.adminNote = str(b.adminNote, 3000);
  if (b.assignedTo !== undefined) r.assignedTo = b.assignedTo ? Number(b.assignedTo) : null;
  if (b.appointment && r.appointment) {
    const date = str(b.appointment.date, 10); const time = str(b.appointment.time, 5);
    if (/^\d{4}-\d{2}-\d{2}$/.test(date) && /^\d{2}:\d{2}$/.test(time)) { r.appointment.date = date; r.appointment.time = time; r.history.push({ at: nowIso(), status, note: `تم تعديل الموعد إلى ${date} ${time}`, public: true, by: admin.name }); }
  }
  r.updatedAt = nowIso();
  log(admin, 'تحديث طلب', r.ref);
  save();
  return reqFull(r);
});
R('DELETE', '/api/admin/requests/:id', ({ params, admin }) => {
  const i = db.requests.findIndex((x) => x.id === Number(params.id)); if (i < 0) throw fail(404, 'غير موجود');
  log(admin, 'حذف طلب', db.requests[i].ref); db.requests.splice(i, 1); save(); return { ok: true };
}, 'admin');

const csvCell = (v) => { let s = v == null ? '' : String(v); if (/^[=+\-@\t\r]/.test(s)) s = "'" + s; return `"${s.replace(/"/g, '""')}"`; };
route('GET', '/api/admin/requests.csv', (ctx) => {
  A.requireStaff(ctx.req);
  const rows = filterRequests(ctx.query);
  const head = ['الرقم', 'النوع', 'الحالة', 'الاسم', 'الجوال', 'البريد', 'المدينة', 'الخدمة', 'الموعد', 'التفاصيل', 'التاريخ'];
  const TYPE = { service: 'طلب خدمة', appointment: 'حجز موعد', contact: 'رسالة', inquiry: 'استفسار عن إعلان', property_request: 'طلب عقار' };
  const ST = { new: 'جديد', in_progress: 'قيد التنفيذ', waiting: 'بانتظار العميل', completed: 'مكتمل', cancelled: 'ملغي' };
  const lines = [head.map(csvCell).join(',')].concat(rows.map((r) => [
    r.ref, TYPE[r.type], ST[r.status], r.name, r.phone, r.email, r.city, r.service ? r.service.titleAr : '', r.appointment ? `${r.appointment.date} ${r.appointment.time}` : '', r.notes, r.createdAt.slice(0, 16).replace('T', ' ')
  ].map(csvCell).join(',')));
  ctx.res.writeHead(200, { 'Content-Type': 'text/csv; charset=utf-8', 'Content-Disposition': 'attachment; filename="requests.csv"', 'Cache-Control': 'no-store' });
  ctx.res.end('﻿' + lines.join('\r\n'));
  return null;
});

/* publish a property request on the public board */
R('POST', '/api/admin/requests/:id/publish', ({ params, admin }) => {
  const r = db.requests.find((x) => x.id === Number(params.id));
  if (!r || r.type !== 'property_request') throw fail(404, 'غير موجود');
  let l = r.listingId && db.listings.find((x) => x.id === r.listingId);
  if (!l) {
    const owner = userOf(r.userId) || admin;
    l = api.createListing(owner, { deal: r.property.deal, type: r.property.type, city: r.city, details: r.property.details, price: r.property.details.budgetMax || r.property.details.budgetMin || null, description: r.notes }, 'request', { requestId: r.id });
    r.listingId = l.id;
  }
  l.status = 'published'; l.publishedAt = nowIso();
  log(admin, 'نشر طلب عقار في السوق', r.ref); save();
  return reqFull(r);
});

/* ---------------- appointments ---------------- */
R('GET', '/api/admin/appointments', ({ query }) => {
  const from = query.from || new Date().toISOString().slice(0, 10); const to = query.to || '9999-12-31';
  return { items: db.requests.filter((r) => r.appointment && r.appointment.date >= from && r.appointment.date <= to && (!query.status || r.status === query.status))
    .sort((a, b) => (a.appointment.date + a.appointment.time).localeCompare(b.appointment.date + b.appointment.time)).map((r) => Object.assign({}, r, { history: undefined })) };
});

/* ---------------- listings ---------------- */
const listingAdmin = (l) => Object.assign(api.listingPublic(l, { full: true }), {
  status: l.status, rejectReason: l.rejectReason || '', rawImages: l.images, userId: l.userId, owner: userBrief(userOf(l.userId)), requestId: l.requestId || null, views: l.views || 0, createdAt: l.createdAt, publishedAt: l.publishedAt, district: l.district, titleRaw: l.title, descRaw: l.description
});
R('GET', '/api/admin/listings', ({ query }) => {
  const s = String(query.q || '').trim().toLowerCase();
  const list = db.listings.filter((l) => (!query.status || l.status === query.status) && (!query.kind || l.kind === query.kind) && (!query.deal || l.deal === query.deal) &&
    (!s || [l.id, l.title.ar, l.title.en, l.city, l.adLicense].join(' ').toLowerCase().includes(s))).sort((a, b) => b.id - a.id);
  return { total: list.length, items: list.slice(0, 300).map(listingAdmin) };
});
function applyListingEdits(l, b, user) {
  if (b.title !== undefined) l.title = bi(b.title, 120);
  if (b.description !== undefined) l.description = bi(b.description, 3000);
  if (b.district !== undefined) l.district = bi(b.district, 60);
  if (b.city !== undefined) l.city = str(b.city, 40) || l.city;
  if (b.deal !== undefined && api.DEALS.includes(b.deal)) l.deal = b.deal;
  if (b.type !== undefined && api.dealTypes(l.deal).includes(b.type)) l.type = b.type;
  if (b.price !== undefined) l.price = num(b.price, { min: 0, max: 1e10 });
  if (b.per !== undefined) l.per = oneOf(b.per, ['year', 'month'], '');
  if (b.adLicense !== undefined) l.adLicense = str(b.adLicense, 40);
  if (b.details) { l.details = cleanDetails(b.details, api.DETAIL_KEYS); l.area = num(l.details.area, { min: 0 }) || l.area; l.rooms = num(l.details.bedrooms, { min: 0 }); l.baths = num(l.details.bathrooms, { min: 0 }); }
  if (b.area !== undefined) l.area = num(b.area, { min: 0 });
  if (Array.isArray(b.images)) l.images = b.images.filter((f) => typeof f === 'string' && (api.UPLOADED.test(f) || /^[\w.-]+\.(jpg|png|webp)$/.test(f))).slice(0, 12);
  if (b.featured !== undefined) l.featured = !!b.featured;
  if (b.status !== undefined) {
    const st = oneOf(b.status, ['pending', 'published', 'rejected', 'closed']);
    if (st) {
      if (st === 'published' && l.status !== 'published') l.publishedAt = nowIso();
      l.status = st;
      l.rejectReason = st === 'rejected' ? str(b.rejectReason, 300) : '';
    }
  }
}
R('PATCH', '/api/admin/listings/:id', ({ params, body: b, admin }) => {
  const l = db.listings.find((x) => x.id === Number(params.id)); if (!l) throw fail(404, 'غير موجود');
  applyListingEdits(l, b, admin);
  log(admin, 'تحديث إعلان', '#' + l.id); save();
  return listingAdmin(l);
});
R('POST', '/api/admin/listings', ({ body: b, admin }) => {
  const kind = oneOf(b.kind, ['offer', 'request'], 'offer');
  const l = api.createListing(admin, b, kind, {}, { skipRules: true });
  l.userId = null; l.status = 'published'; l.publishedAt = nowIso();
  applyListingEdits(l, Object.assign({}, b, { status: b.status || 'published' }), admin);
  log(admin, 'إضافة إعلان', '#' + l.id); save();
  return listingAdmin(l);
});
R('DELETE', '/api/admin/listings/:id', ({ params, admin }) => {
  const i = db.listings.findIndex((x) => x.id === Number(params.id)); if (i < 0) throw fail(404, 'غير موجود');
  log(admin, 'حذف إعلان', '#' + db.listings[i].id); db.listings.splice(i, 1); save(); return { ok: true };
});
R('POST', '/api/admin/listings-purge-samples', ({ admin }) => {
  const n = db.listings.length; db.listings = db.listings.filter((l) => !l.sample);
  log(admin, 'حذف الإعلانات التجريبية', n - db.listings.length); save(); return { removed: n - db.listings.length };
}, 'admin');

/* ---------------- users ---------------- */
const userAdmin = (u) => Object.assign(A.publicUser(u), {
  requests: db.requests.filter((r) => r.userId === u.id).length, listings: db.listings.filter((l) => l.userId === u.id).length, verified: api.listingPublic({ userId: u.id, images: [], createdAt: '' }).verified
});
R('GET', '/api/admin/users', ({ query }) => {
  const s = String(query.q || '').trim().toLowerCase(); const sd = U.digits(s);
  const list = db.users.filter((u) => (!query.role || u.role === query.role) && (!query.status || u.status === query.status) &&
    (!query.docs || Object.values(u.docs || {}).some((d) => d.status === query.docs)) &&
    (!s || [u.name, u.phone, u.email].join(' ').toLowerCase().includes(s) || u.phone.includes(sd))).sort((a, b) => b.id - a.id);
  return { total: list.length, items: list.slice(0, 300).map(userAdmin) };
}, 'admin');
R('PATCH', '/api/admin/users/:id', ({ params, body: b, admin }) => {
  const u = userOf(Number(params.id)); if (!u) throw fail(404, 'غير موجود');
  if (u.id === admin.id && (b.role || b.status === 'blocked')) throw fail(400, 'لا يمكنك تغيير صلاحية حسابك أو إيقافه');
  if (b.role) u.role = oneOf(b.role, ['user', 'staff', 'admin'], u.role);
  if (b.status) { u.status = oneOf(b.status, ['active', 'blocked'], u.status); if (u.status === 'blocked') db.sessions = db.sessions.filter((s) => s.userId !== u.id); }
  if (b.name) u.name = str(b.name, 80) || u.name;
  if (b.type) u.type = oneOf(b.type, ['individual', 'broker', 'company'], u.type);
  if (b.email !== undefined) u.email = normEmail(b.email);
  if (b.phone) { const p = normPhone(b.phone); if (!p) throw fail(400, 'رقم غير صحيح'); if (db.users.some((x) => x.id !== u.id && x.phone === p)) throw fail(409, 'الرقم مستخدم'); u.phone = p; }
  log(admin, 'تعديل مستخدم', u.name); save();
  return userAdmin(u);
}, 'admin');
R('POST', '/api/admin/users/:id/reset-password', ({ params, admin }) => {
  const u = userOf(Number(params.id)); if (!u) throw fail(404, 'غير موجود');
  const pw = require('crypto').randomBytes(6).toString('base64url');
  u.pass = A.hashPassword(pw); u.mustChangePassword = true; db.sessions = db.sessions.filter((s) => s.userId !== u.id);
  log(admin, 'إعادة تعيين كلمة مرور', u.name); save();
  return { password: pw };
}, 'admin');
R('POST', '/api/admin/users/:id/docs/:type', ({ params, body: b, admin }) => {
  const u = userOf(Number(params.id)); const type = oneOf(params.type, DOC_TYPES);
  if (!u || !type || !(u.docs && u.docs[type])) throw fail(404, 'غير موجود');
  const status = oneOf(b.status, ['verified', 'rejected', 'pending']); if (!status) throw fail(400, 'حالة غير صحيحة');
  Object.assign(u.docs[type], { status, note: str(b.note, 300), verifiedAt: status === 'verified' ? nowIso() : null });
  log(admin, status === 'verified' ? 'توثيق وثيقة' : 'رفض وثيقة', `${u.name}: ${type}`); save();
  return userAdmin(u);
});
R('DELETE', '/api/admin/users/:id', ({ params, admin }) => {
  const u = userOf(Number(params.id)); if (!u) throw fail(404, 'غير موجود');
  if (u.id === admin.id) throw fail(400, 'لا يمكنك حذف حسابك');
  db.users = db.users.filter((x) => x !== u); db.sessions = db.sessions.filter((s) => s.userId !== u.id);
  db.listings = db.listings.filter((l) => l.userId !== u.id);
  db.requests.forEach((r) => { if (r.userId === u.id) r.userId = null; });
  log(admin, 'حذف مستخدم', u.name); save(); return { ok: true };
}, 'admin');

/* ---------------- services catalog ---------------- */
const SEC = ['realestate', 'taqib', 'students'];
const catOf = (id) => db.categories.find((c) => c.id === id);
R('GET', '/api/admin/catalog', () => ({ categories: db.categories.slice().sort((a, b) => a.order - b.order), sections: SEC }), 'admin');
R('GET', '/api/admin/images', () => ({ images: require('fs').readdirSync(U.path.join(__dirname, '..', 'assets', 'img')).filter((f) => /\.(jpg|png|webp)$/.test(f)).sort() }));
R('POST', '/api/admin/categories', ({ body: b, admin }) => {
  const section = oneOf(b.section, SEC); const title = bi(b.title, 100);
  if (!section || !title.ar) throw fail(400, 'اكتب اسم التصنيف واختر القسم');
  const c = { id: 'c' + nextId('category'), section, icon: str(b.icon, 40) || 'layout-grid', img: str(b.img, 80) || 'docs-work.jpg', title, desc: bi(b.desc, 200), order: db.categories.length + 1, active: b.active !== false, items: [] };
  db.categories.push(c); log(admin, 'إضافة تصنيف', title.ar); save(); return c;
}, 'admin');
R('PATCH', '/api/admin/categories/:id', ({ params, body: b, admin }) => {
  const c = catOf(params.id); if (!c) throw fail(404, 'غير موجود');
  if (b.section) c.section = oneOf(b.section, SEC, c.section);
  if (b.title) c.title = bi(b.title, 100);
  if (b.desc !== undefined) c.desc = bi(b.desc, 200);
  if (b.icon) c.icon = str(b.icon, 40);
  if (b.img) c.img = str(b.img, 80);
  if (b.active !== undefined) c.active = !!b.active;
  log(admin, 'تعديل تصنيف', c.title.ar); save(); return c;
}, 'admin');
R('DELETE', '/api/admin/categories/:id', ({ params, admin }) => {
  const i = db.categories.findIndex((x) => x.id === params.id); if (i < 0) throw fail(404, 'غير موجود');
  log(admin, 'حذف تصنيف', db.categories[i].title.ar); db.categories.splice(i, 1); save(); return { ok: true };
}, 'admin');
R('POST', '/api/admin/categories-order', ({ body: b }) => {
  (Array.isArray(b.ids) ? b.ids : []).forEach((id, i) => { const c = catOf(id); if (c) c.order = i; });
  save(); return { ok: true };
}, 'admin');
R('POST', '/api/admin/categories/:id/items', ({ params, body: b, admin }) => {
  const c = catOf(params.id); if (!c) throw fail(404, 'غير موجود');
  const title = bi(b.title, 120); if (!title.ar) throw fail(400, 'اكتب اسم الخدمة');
  const it = { id: 's' + nextId('item'), icon: str(b.icon, 40) || 'file-text', title, desc: bi(b.desc, 300), order: c.items.length, active: b.active !== false, appointment: b.appointment !== false };
  c.items.push(it); log(admin, 'إضافة خدمة', title.ar); save(); return it;
}, 'admin');
R('PATCH', '/api/admin/categories/:id/items/:itemId', ({ params, body: b, admin }) => {
  const c = catOf(params.id); const it = c && c.items.find((x) => x.id === params.itemId); if (!it) throw fail(404, 'غير موجود');
  if (b.title) it.title = bi(b.title, 120);
  if (b.desc !== undefined) it.desc = bi(b.desc, 300);
  if (b.icon) it.icon = str(b.icon, 40);
  if (b.active !== undefined) it.active = !!b.active;
  if (b.appointment !== undefined) it.appointment = !!b.appointment;
  if (b.categoryId && b.categoryId !== c.id) { const to = catOf(b.categoryId); if (to) { c.items.splice(c.items.indexOf(it), 1); it.order = to.items.length; to.items.push(it); } }
  log(admin, 'تعديل خدمة', it.title.ar); save(); return it;
}, 'admin');
R('DELETE', '/api/admin/categories/:id/items/:itemId', ({ params, admin }) => {
  const c = catOf(params.id); const i = c ? c.items.findIndex((x) => x.id === params.itemId) : -1; if (i < 0) throw fail(404, 'غير موجود');
  log(admin, 'حذف خدمة', c.items[i].title.ar); c.items.splice(i, 1); save(); return { ok: true };
}, 'admin');
R('POST', '/api/admin/categories/:id/items-order', ({ params, body: b }) => {
  const c = catOf(params.id); if (!c) throw fail(404, 'غير موجود');
  (Array.isArray(b.ids) ? b.ids : []).forEach((id, i) => { const it = c.items.find((x) => x.id === id); if (it) it.order = i; });
  save(); return { ok: true };
}, 'admin');

/* ---------------- blog ---------------- */
const slugify = (s) => String(s).trim().toLowerCase().replace(/[^\w؀-ۿ]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80);
function uniqueSlug(base, selfId) {
  let s = slugify(base) || 'post'; let n = 1; const root = s;
  while (db.posts.some((p) => p.slug === s && p.id !== selfId)) s = `${root}-${++n}`;
  return s;
}
const coverOk = (c) => { c = str(c, 200); return /^(\/uploads\/blog\/[\w.-]+|assets\/img\/[\w.-]+)$/.test(c) ? c : ''; };
function applyPost(p, b) {
  if (b.title !== undefined) p.title = bi(b.title, 160);
  if (b.excerpt !== undefined) p.excerpt = bi(b.excerpt, 300);
  if (b.body !== undefined) p.body = { ar: str(b.body && b.body.ar, 60000), en: str(b.body && b.body.en, 60000) };
  if (b.cover !== undefined) p.cover = coverOk(b.cover);
  if (b.category !== undefined) p.category = str(b.category, 40);
  if (b.tags !== undefined) p.tags = (Array.isArray(b.tags) ? b.tags : String(b.tags).split(/[,،]/)).map((t) => str(t, 30)).filter(Boolean).slice(0, 10);
  if (b.seoTitle !== undefined) p.seoTitle = str(b.seoTitle, 70);
  if (b.seoDesc !== undefined) p.seoDesc = str(b.seoDesc, 170);
  if (b.slug !== undefined && str(b.slug, 80)) p.slug = uniqueSlug(b.slug, p.id);
  if (b.status !== undefined) {
    const st = oneOf(b.status, ['draft', 'published'], p.status);
    if (st === 'published' && !p.publishedAt) p.publishedAt = nowIso();
    p.status = st;
  }
  p.updatedAt = nowIso();
}
R('GET', '/api/admin/posts', () => ({ items: db.posts.slice().sort((a, b) => b.id - a.id) }));
R('POST', '/api/admin/posts', ({ body: b, admin }) => {
  const title = bi(b.title, 160); if (!title.ar) throw fail(400, 'اكتب عنوان المقال');
  const id = nextId('post');
  const p = { id, slug: uniqueSlug(b.slug || title.ar, id), title, excerpt: { ar: '', en: '' }, body: { ar: '', en: '' }, cover: '', category: '', tags: [], status: 'draft', seoTitle: '', seoDesc: '', author: admin.name, createdAt: nowIso(), publishedAt: null, updatedAt: nowIso() };
  applyPost(p, b); db.posts.push(p); log(admin, 'إنشاء مقال', title.ar); save(); return p;
});
R('PATCH', '/api/admin/posts/:id', ({ params, body: b, admin }) => {
  const p = db.posts.find((x) => x.id === Number(params.id)); if (!p) throw fail(404, 'غير موجود');
  applyPost(p, b); log(admin, 'تعديل مقال', p.title.ar); save(); return p;
});
R('DELETE', '/api/admin/posts/:id', ({ params, admin }) => {
  const i = db.posts.findIndex((x) => x.id === Number(params.id)); if (i < 0) throw fail(404, 'غير موجود');
  log(admin, 'حذف مقال', db.posts[i].title.ar); db.posts.splice(i, 1); save(); return { ok: true };
});
R('POST', '/api/admin/preview', ({ body: b }) => ({ html: mdr.render(String(b.md || '').slice(0, 60000)) }));

/* ---------------- settings ---------------- */
R('GET', '/api/admin/settings', () => db.settings, 'admin');
R('PUT', '/api/admin/settings', ({ body: b, admin }) => {
  const s = db.settings;
  if (b.site) {
    const x = b.site;
    s.site = {
      phone: str(x.phone, 20) || s.site.phone, phoneDisplay: str(x.phoneDisplay, 20) || s.site.phoneDisplay,
      whatsapp: U.digits(str(x.whatsapp, 20)).replace(/\D/g, '') || s.site.whatsapp, email: normEmail(x.email) || s.site.email,
      address: bi(x.address, 160), hours: bi(x.hours, 100)
    };
  }
  if (b.appointments) {
    const a = b.appointments;
    const open = /^\d{2}:\d{2}$/.test(a.open) ? a.open : s.appointments.open; const close = /^\d{2}:\d{2}$/.test(a.close) ? a.close : s.appointments.close;
    s.appointments = {
      enabled: !!a.enabled, days: (Array.isArray(a.days) ? a.days : []).map(Number).filter((d) => d >= 0 && d <= 6), open, close,
      slotMinutes: [15, 20, 30, 45, 60, 90, 120].includes(+a.slotMinutes) ? +a.slotMinutes : 30, capacity: num(a.capacity, { min: 1, max: 50 }) || 1, maxDaysAhead: num(a.maxDaysAhead, { min: 1, max: 180 }) || 30
    };
  }
  if (b.listings) {
    const l = b.listings;
    s.listings = { autoPublish: !!l.autoPublish, requireAdLicense: !!l.requireAdLicense, maxImages: num(l.maxImages, { min: 1, max: 20 }) || 8, expireDays: num(l.expireDays, { min: 0, max: 730 }) || 0 };
  }
  if (b.notify) s.notify = { webhookUrl: /^https?:\/\/\S+$/.test(b.notify.webhookUrl || '') ? str(b.notify.webhookUrl, 300) : '' };
  log(admin, 'تعديل الإعدادات', ''); save();
  return s;
}, 'admin');

module.exports = {};
