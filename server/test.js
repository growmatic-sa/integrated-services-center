'use strict';
/* End-to-end API tests:  npm test   (starts its own server on a temporary data folder) */
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');
const assert = require('assert');

const PORT = 3900 + Math.floor(Math.random() * 90);
const BASE = `http://127.0.0.1:${PORT}`;
const DATA = fs.mkdtempSync(path.join(os.tmpdir(), 'isc-test-'));
let passed = 0; const failed = [];

class Client {
  constructor() { this.cookie = ''; }
  async req(method, url, body, headers = {}) {
    const h = Object.assign({ 'X-Requested-With': 'isc' }, headers);
    if (this.cookie) h.Cookie = this.cookie;
    if (body !== undefined) h['Content-Type'] = 'application/json';
    const res = await fetch(BASE + url, { method, headers: h, body: body !== undefined ? JSON.stringify(body) : undefined, redirect: 'manual' });
    const set = res.headers.get('set-cookie');
    if (set) this.cookie = set.split(';')[0].endsWith('=') ? '' : set.split(';')[0];
    const text = await res.text();
    let json = null; try { json = JSON.parse(text); } catch (e) { /* html or text */ }
    return { status: res.status, json, text, headers: res.headers };
  }
  get(u) { return this.req('GET', '/api' + u); }
  post(u, b) { return this.req('POST', '/api' + u, b || {}); }
  patch(u, b) { return this.req('PATCH', '/api' + u, b || {}); }
  put(u, b) { return this.req('PUT', '/api' + u, b || {}); }
  del(u) { return this.req('DELETE', '/api' + u); }
}

async function test(name, fn) {
  try { await fn(); passed++; console.log('  ✓', name); }
  catch (e) { failed.push(name); console.log('  ✗', name, '\n     ', e.message.split('\n')[0]); }
}

// 1×1 PNG
const PNG = Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==', 'base64');
const bigPng = Buffer.concat([PNG, Buffer.alloc(64)]).toString('base64');

(async () => {
  const srv = spawn(process.execPath, [path.join(__dirname, 'index.js')], { env: Object.assign({}, process.env, { PORT, DATA_DIR: DATA, ADMIN_PASSWORD: 'AdminPass123', ADMIN_PHONE: '0500000001', HOST: '127.0.0.1' }), stdio: ['ignore', 'pipe', 'pipe'] });
  let log = ''; srv.stdout.on('data', (d) => { log += d; }); srv.stderr.on('data', (d) => { log += d; });
  for (let i = 0; i < 50; i++) { try { await fetch(BASE + '/api/config'); break; } catch (e) { await new Promise((r) => setTimeout(r, 100)); } }

  const guest = new Client(); const admin = new Client(); const user = new Client(); const staff = new Client(); const user2 = new Client();

  console.log('\nPublic site');
  await test('config + catalog + listings load', async () => {
    assert((await guest.get('/config')).json.site.phone);
    const cat = (await guest.get('/catalog')).json;
    const n = Object.values(cat).reduce((s, x) => s + x.categories.reduce((m, c) => m + c.items.length, 0), 0);
    assert(n > 400, 'catalog has ' + n);
    assert((await guest.get('/listings')).json.listings.length > 0);
  });
  await test('every service item carries an id and an appointment flag', async () => {
    const cat = (await guest.get('/catalog')).json;
    for (const sec of Object.values(cat)) for (const c of sec.categories) for (const it of c.items) { assert(it[5], 'id'); assert(it[6] === true, 'appointment'); }
  });
  await test('private folders are not served', async () => {
    for (const p of ['/server/index.js', '/data/db.json', '/package.json', '/.git/config', '/server/../package.json', '/%2e%2e/package.json']) {
      const r = await guest.req('GET', p); assert(r.status === 404, p + ' → ' + r.status);
    }
    assert((await guest.req('GET', '/index.html')).status === 200);
    assert((await guest.req('GET', '/assets/css/style.css')).status === 200);
  });
  await test('security headers + CSRF guard', async () => {
    const r = await guest.req('GET', '/index.html');
    assert(r.headers.get('x-content-type-options') === 'nosniff'); assert(r.headers.get('content-security-policy'));
    const noHdr = await fetch(BASE + '/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
    assert(noHdr.status === 403, 'csrf ' + noHdr.status);
  });

  console.log('\nAccounts');
  await test('register validates and logs in', async () => {
    assert((await user.post('/auth/register', { name: 'a', phone: '123', password: 'short' })).status === 400);
    const r = await user.post('/auth/register', { name: 'عميل اختبار', phone: '0501112233', password: 'Passw0rd!' });
    assert(r.status === 200 && r.json.user.role === 'user' && !('pass' in r.json.user));
    assert((await user.get('/auth/me')).json.user.phone === '0501112233');
  });
  await test('duplicate phone is rejected, +966 format is normalised', async () => {
    assert((await guest.post('/auth/register', { name: 'مكرر', phone: '+966501112233', password: 'Passw0rd!' })).status === 409);
  });
  await test('login: wrong password fails, right works, logout ends session', async () => {
    const c = new Client();
    assert((await c.post('/auth/login', { login: '0501112233', password: 'nope' })).status === 401);
    assert((await c.post('/auth/login', { login: '966501112233', password: 'Passw0rd!' })).status === 200);
    await c.post('/auth/logout'); assert((await c.get('/auth/me')).json.user === null);
  });

  console.log('\nRequests & appointments (saved on the site, not WhatsApp)');
  await test('guest can send a service request', async () => {
    const cat = (await guest.get('/catalog')).json.taqib.categories[0];
    const r = await guest.post('/requests', { type: 'service', serviceId: cat.items[0][5], name: 'زائر', phone: '0509998877', city: 'الرياض', notes: 'تجربة' });
    assert(r.status === 200 && /^ISC-\d+$/.test(r.json.request.ref), JSON.stringify(r.json));
  });
  await test('request validation', async () => {
    assert((await guest.post('/requests', { type: 'service', name: 'x', phone: '0509998877' })).status === 400);
    assert((await guest.post('/requests', { type: 'service', serviceId: 'nope-1', name: 'x', phone: '0509998877' })).status === 400);
    assert((await guest.post('/requests', { type: 'service', serviceId: 'jawazat-1', name: 'x', phone: '12' })).status === 400);
  });
  let slotDate; let slotTime;
  await test('appointment slots are listed and capacity is enforced', async () => {
    const cfg = (await guest.get('/config')).json.appointments;
    const today = new Date();
    for (let i = 1; i < 10 && !slotDate; i++) {
      const d = new Date(today.getTime() + i * 864e5).toISOString().slice(0, 10);
      const s = (await guest.get('/slots?date=' + d)).json;
      if (s.open && s.slots.length) { slotDate = d; slotTime = s.slots[0].time; }
    }
    assert(slotDate, 'a bookable day exists (' + JSON.stringify(cfg.days) + ')');
    const body = { type: 'appointment', serviceId: 'jawazat-1', name: 'م1', phone: '0501000001', city: 'جدة', date: slotDate, time: slotTime };
    assert((await guest.post('/requests', body)).status === 200);
    assert((await guest.post('/requests', Object.assign({}, body, { phone: '0501000002' }))).status === 200);    // capacity 2
    const third = await guest.post('/requests', Object.assign({}, body, { phone: '0501000003' }));
    assert(third.status === 409, 'third booking should be refused, got ' + third.status);
    assert((await guest.post('/requests', Object.assign({}, body, { time: '03:00' }))).status === 400, 'outside working hours');
    assert((await guest.post('/requests', Object.assign({}, body, { date: '2020-01-01' }))).status === 400, 'past date');
  });
  await test('property request needs login and stores every requirement', async () => {
    const body = { type: 'property_request', deal: 'rent', ptype: 'villa', city: 'الرياض', notes: 'قريبة من مدرسة', publish: true,
      details: { bedrooms: 5, bathrooms: 4, majlisMen: 1, majlisWomen: 1, muqallat: 1, maidRooms: 1, features: ['pool', 'elevator'], budgetMax: 90000, evil: '<img>', 'bad key': 1 } };
    assert((await guest.post('/requests', body)).status === 401);
    const r = await user.post('/requests', body);
    assert(r.status === 200, JSON.stringify(r.json));
    const mine = (await user.get('/me/requests')).json.requests.find((x) => x.type === 'property_request');
    assert(mine.property.details.majlisWomen === 1 && mine.property.details.muqallat === 1 && mine.property.details.features.length === 2);
    assert(!('evil' in mine.property.details) && !('bad key' in mine.property.details), 'unknown keys dropped');
    assert(mine.listingId, 'linked listing for public board');
  });
  await test('property request: deal/type mismatch is refused', async () => {
    assert((await user.post('/requests', { type: 'property_request', deal: 'rent', ptype: 'land', city: 'جدة' })).status === 400);
  });

  console.log('\nOffers, uploads & licences');
  let listingId; let imgFile;
  await test('upload accepts real images only', async () => {
    assert((await guest.post('/upload', { kind: 'listing', data: bigPng })).status === 401);
    assert((await user.post('/upload', { kind: 'listing', data: Buffer.from('<?php echo 1;').toString('base64') })).status === 400);
    assert((await user.post('/upload', { kind: 'listing', data: Buffer.from('%PDF-1.4 hello world data').toString('base64') })).status === 400, 'pdf not allowed for ads');
    const r = await user.post('/upload', { kind: 'listing', data: bigPng });
    assert(r.status === 200 && /^\d+_[a-f0-9]{16}\.png$/.test(r.json.file)); imgFile = r.json.file;
    assert((await guest.req('GET', r.json.url)).status === 200, 'public image url works');
  });
  await test('offer is created pending, hidden until approved', async () => {
    const r = await user.post('/listings', { deal: 'sale', type: 'villa', city: 'الرياض', district: 'الملقا', price: 2500000, images: [imgFile, '../../etc/passwd'], details: { bedrooms: 5, bathrooms: 6 }, description: 'فيلا ممتازة', adLicense: '7100012345' });
    assert(r.status === 200 && r.json.listing.status === 'pending', JSON.stringify(r.json)); listingId = r.json.listing.id;
    assert(r.json.listing.images.length === 1, 'bad filename dropped');
    assert(!(await guest.get('/listings')).json.listings.some((l) => l.id === listingId), 'not public yet');
    assert((await guest.get('/listings/' + listingId)).status === 404);
  });
  await test('offer requires login, price and a valid section', async () => {
    assert((await guest.post('/listings', { deal: 'sale', type: 'villa', city: 'جدة', price: 1 })).status === 401);
    assert((await user.post('/listings', { deal: 'sale', type: 'villa', city: 'جدة' })).status === 400);
    assert((await user.post('/listings', { deal: 'sale', type: 'shop', city: 'جدة', price: 1 })).status === 400);
  });
  await test('licence documents are private and reviewed by staff', async () => {
    const doc = await user.post('/upload', { kind: 'doc', data: Buffer.from('%PDF-1.4 fake pdf body 123456').toString('base64') });
    assert(doc.status === 200 && doc.json.file.endsWith('.pdf'), JSON.stringify(doc.json));
    const sub = await user.post('/me/docs', { type: 'fal', number: 'FAL-123', expiry: '2030-01-01', file: doc.json.file });
    assert(sub.status === 200 && sub.json.user.docs.fal.status === 'pending');
    assert((await user.post('/me/docs', { type: 'cr', number: '1010', file: '99_aaaaaaaaaaaaaaaa.pdf' })).status === 400, 'foreign file refused');
    assert((await guest.req('GET', doc.json.url)).status === 401);
    assert((await user.req('GET', doc.json.url)).status === 200, 'owner can read');
    await user2.post('/auth/register', { name: 'آخر', phone: '0503334455', password: 'Passw0rd!' });
    assert((await user2.req('GET', doc.json.url)).status === 403, 'other customers cannot');
  });

  console.log('\nDashboard');
  await test('admin login (bootstrap account) works; customers are locked out', async () => {
    assert((await admin.post('/auth/login', { login: '0500000001', password: 'AdminPass123' })).json.user.role === 'admin');
    for (const p of ['/admin/stats', '/admin/requests', '/admin/users', '/admin/settings', '/admin/catalog']) assert((await user.get(p)).status === 403, p);
    assert((await guest.get('/admin/stats')).status === 401);
  });
  await test('stats + requests list + filters + CSV', async () => {
    const s = (await admin.get('/admin/stats')).json;
    assert(s.requests.total >= 4, 'total ' + s.requests.total);
    assert(s.listings.pending >= 1, 'pending listings ' + s.listings.pending);
    assert(s.users.pendingDocs === 1, 'pending docs ' + s.users.pendingDocs);
    const list = (await admin.get('/admin/requests?type=property_request')).json;
    assert(list.items.length === 1 && list.items[0].type === 'property_request', 'type filter');
    assert((await admin.get('/admin/requests?q=0509998877')).json.total === 1, 'search by phone');
    const csv = await admin.req('GET', '/api/admin/requests.csv');
    assert(csv.status === 200 && csv.text.includes('ISC-1001'), 'csv body');
    assert(/attachment/.test(csv.headers.get('content-disposition')), 'csv header');
  });
  await test('status change is recorded and visible to the customer; internal notes are not', async () => {
    const id = (await user.get('/me/requests')).json.requests[0].id;
    const r = await admin.patch('/admin/requests/' + id, { status: 'in_progress', customerNote: 'جاري العمل', adminNote: 'سري داخلي' });
    assert(r.status === 200 && r.json.status === 'in_progress');
    const mine = (await user.get('/me/requests')).json.requests.find((x) => x.id === id);
    assert(mine.status === 'in_progress' && mine.history.some((h) => h.note === 'جاري العمل'));
    assert(!JSON.stringify(mine).includes('سري داخلي'), 'internal note leaked');
  });
  await test('approve an ad → public; reject → hidden with reason', async () => {
    assert((await admin.patch('/admin/listings/' + listingId, { status: 'published' })).status === 200);
    const pub = (await guest.get('/listings/' + listingId)).json;
    assert(pub.license === '7100012345' && pub.images[0].startsWith('/uploads/listings/'));
    assert(pub.verified.fal === false);
    assert((await admin.patch('/admin/listings/' + listingId, { status: 'rejected', rejectReason: 'صور غير واضحة' })).status === 200);
    assert((await guest.get('/listings/' + listingId)).status === 404);
    assert((await user.get('/me/listings')).json.listings[0].rejectReason === 'صور غير واضحة');
    await admin.patch('/admin/listings/' + listingId, { status: 'published' });
  });
  await test('verifying a licence puts the “verified advertiser” badge on the ad', async () => {
    const uid = (await user.get('/auth/me')).json.user.id;
    assert((await admin.post(`/admin/users/${uid}/docs/fal`, { status: 'verified' })).status === 200);
    assert((await guest.get('/listings/' + listingId)).json.verified.fal === true);
    assert((await admin.get('/admin/users?q=0501112233')).json.items[0].verified.fal === true);
  });
  await test('staff role: can work requests but not users/settings', async () => {
    const uid = (await user2.get('/auth/me')).json.user.id;
    assert((await admin.patch('/admin/users/' + uid, { role: 'staff' })).status === 200);
    assert((await staff.post('/auth/login', { login: '0503334455', password: 'Passw0rd!' })).status === 200);
    assert((await staff.get('/admin/requests')).status === 200);
    assert((await staff.get('/admin/users')).status === 403);
    assert((await staff.put('/admin/settings', {})).status === 403);
    assert((await admin.patch('/admin/users/' + uid, { status: 'blocked' })).status === 200);
    assert((await staff.get('/admin/requests')).status === 401, 'blocked user is signed out');
  });
  await test('admin cannot lock themselves out', async () => {
    const me = (await admin.get('/auth/me')).json.user;
    assert((await admin.patch('/admin/users/' + me.id, { role: 'user' })).status === 400);
    assert((await admin.del('/admin/users/' + me.id)).status === 400);
  });

  console.log('\nCatalog, blog & settings (admin-managed content)');
  await test('new category + service appear on the site; hidden ones disappear', async () => {
    const c = (await admin.post('/admin/categories', { section: 'taqib', title: { ar: 'تصنيف جديد', en: 'New cat' }, icon: 'star' })).json;
    const it = (await admin.post(`/admin/categories/${c.id}/items`, { title: { ar: 'خدمة جديدة', en: 'New service' }, desc: { ar: 'وصف', en: 'desc' } })).json;
    let cat = (await guest.get('/catalog')).json.taqib.categories.find((x) => x.id === c.id);
    assert(cat && cat.items[0][1] === 'خدمة جديدة');
    const r = await guest.post('/requests', { type: 'service', serviceId: it.id, name: 'ز', phone: '0501234567' });
    assert(r.status === 200 && r.json.request.service.titleAr === 'خدمة جديدة');
    await admin.patch(`/admin/categories/${c.id}/items/${it.id}`, { active: false });
    assert(!(await guest.get('/catalog')).json.taqib.categories.find((x) => x.id === c.id), 'hidden → category empty → not shown');
    assert((await guest.post('/requests', { type: 'service', serviceId: it.id, name: 'ز', phone: '0501234567' })).status === 400, 'hidden service cannot be requested');
    assert((await admin.del('/admin/categories/' + c.id)).status === 200);
  });
  await test('blog: draft is private, published renders server-side, markup is escaped', async () => {
    const p = (await admin.post('/admin/posts', { title: { ar: 'مقال تجريبي', en: '' }, body: { ar: '## عنوان\n\n**غامق** <script>alert(1)</script> [x](javascript:alert(1))', en: '' }, excerpt: { ar: 'ملخص', en: '' } })).json;
    assert(p.status === 'draft');
    assert((await guest.req('GET', '/blog/' + encodeURIComponent(p.slug))).status === 404, 'draft hidden');
    await admin.patch('/admin/posts/' + p.id, { status: 'published' });
    const page = await guest.req('GET', '/blog/' + encodeURIComponent(p.slug));
    assert(page.status === 200 && page.text.includes('<h3>عنوان</h3>') && page.text.includes('<strong>غامق</strong>'));
    assert(!page.text.includes('<script>alert(1)') && !page.text.includes('href="javascript:'), 'XSS blocked');
    assert(page.text.includes('<meta name="description"') && page.text.includes('rel="canonical"'));
    assert((await guest.req('GET', '/sitemap.xml')).text.includes(encodeURIComponent(p.slug)));
  });
  await test('settings change is reflected in the public config (phone, appointment hours, review mode)', async () => {
    const s = (await admin.get('/admin/settings')).json;
    s.site.phoneDisplay = '011 000 0000'; s.listings.autoPublish = true; s.appointments.capacity = 1;
    assert((await admin.put('/admin/settings', s)).status === 200);
    assert((await guest.get('/config')).json.site.phoneDisplay === '011 000 0000');
    const r = await user.post('/listings', { deal: 'rent', type: 'apartment', city: 'جدة', price: 30000 });
    assert(r.json.listing.status === 'published', 'auto-publish on');
  });
  await test('login brute force is rate limited', async () => {
    const c = new Client(); let last = 0;
    for (let i = 0; i < 20; i++) last = (await c.post('/auth/login', { login: '0501112233', password: 'x' + i })).status;
    assert(last === 429, 'got ' + last);
  });

  await new Promise((r) => { srv.once('exit', r); srv.kill(); });
  fs.rmSync(DATA, { recursive: true, force: true, maxRetries: 5, retryDelay: 100 });
  console.log(`\n${passed} passed, ${failed.length} failed`);
  if (failed.length) { console.log('Failed:', failed.join(' | ')); console.log(log.slice(-800)); process.exit(1); }
})().catch((e) => { console.error(e); process.exit(1); });
