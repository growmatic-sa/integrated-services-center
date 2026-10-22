'use strict';
/* Loads the default catalog and sample ads from the static files (assets/js/data.js, listings.js)
   the first time the server runs. After that the dashboard owns the data. */
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { db, save, nextId } = require('./db');

const ROOT = path.join(__dirname, '..');
const SECTIONS = ['realestate', 'taqib', 'students'];

const DEFAULT_SETTINGS = () => ({
  site: {
    phone: '+966552408287', phoneDisplay: '055 240 8287', whatsapp: '966552408287', email: 'info@example.com',
    address: { ar: 'الرياض، حي العليا، طريق الملك فهد', en: 'King Fahd Rd, Al Olaya, Riyadh' },
    hours: { ar: 'السبت – الخميس: 9 ص – 10 م', en: 'Sat – Thu: 9 AM – 10 PM' }
  },
  appointments: { enabled: true, days: [6, 0, 1, 2, 3, 4], open: '09:00', close: '21:00', slotMinutes: 30, capacity: 2, maxDaysAhead: 30 },
  listings: { autoPublish: false, requireAdLicense: false, maxImages: 8, expireDays: 90 },
  notify: { webhookUrl: '' }
});

function loadStatic() {
  const ctx = { window: {} };
  vm.createContext(ctx);
  for (const f of ['data.js', 'listings.js']) {
    vm.runInContext(fs.readFileSync(path.join(ROOT, 'assets', 'js', f), 'utf8'), ctx, { filename: f });
  }
  return ctx.window;
}

function seedCatalog(W) {
  let order = 0;
  for (const section of SECTIONS) {
    for (const c of W.CATALOG[section].categories) {
      db.categories.push({
        id: c.id, section, icon: c.icon, img: c.img, title: c.title, desc: c.desc, order: order++, active: true,
        items: c.items.map((it, i) => ({
          id: `${c.id}-${i + 1}`, icon: it[0], title: { ar: it[1], en: it[2] }, desc: { ar: it[3], en: it[4] }, order: i, active: true, appointment: true
        }))
      });
    }
  }
}

function seedListings(W) {
  const now = new Date().toISOString();
  for (const a of W.MARKET.listings.slice().reverse()) {
    db.listings.push({
      id: nextId('listing'), kind: a.kind, deal: a.deal, type: a.type, city: a.city,
      district: a.district, title: a.title, description: { ar: '', en: '' },
      price: a.price || null, per: a.per || '', area: a.area || null, rooms: a.rooms || null, baths: a.baths || null,
      details: {}, images: a.img ? [a.img] : [], userId: null, adLicense: '', status: 'published', featured: false, sample: true,
      createdAt: new Date(a.date + 'T09:00:00Z').toISOString(), publishedAt: now, views: 0
    });
  }
}

function run() {
  if (!db.settings) { db.settings = DEFAULT_SETTINGS(); save(); }
  // settings added in later versions
  const d = DEFAULT_SETTINGS();
  for (const k of Object.keys(d)) if (!db.settings[k]) db.settings[k] = d[k];
  if (db.meta.seeded) return;
  const W = loadStatic();
  seedCatalog(W);
  seedListings(W);
  db.meta.seeded = true;
  save();
  console.log(`  تم تحميل ${db.categories.length} تصنيف و${db.categories.reduce((n, c) => n + c.items.length, 0)} خدمة و${db.listings.length} إعلان تجريبي`);
}

module.exports = { run, SECTIONS, DEFAULT_SETTINGS, loadStatic };
