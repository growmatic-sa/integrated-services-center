/* =========================================================
   Talks to the server (/api/*). If the server is not running (e.g. the pages are opened as plain files)
   the site still shows the static catalog, and forms tell the visitor to use the phone / WhatsApp.
   ========================================================= */
(function () {
  'use strict';

  const API = {
    online: false,
    user: null,
    config: null,

    async call(method, path, body) {
      const opt = { method, headers: { 'X-Requested-With': 'isc' }, credentials: 'same-origin' };
      if (body !== undefined) { opt.headers['Content-Type'] = 'application/json'; opt.body = JSON.stringify(body); }
      let res;
      try { res = await fetch('/api' + path, opt); }
      catch (e) { throw Object.assign(new Error('تعذّر الاتصال بالخادم، تحقق من الإنترنت'), { offline: true }); }
      let data = null;
      try { data = await res.json(); } catch (e) { /* not JSON */ }
      if (!res.ok) {
        if (res.status === 404 && !data) throw Object.assign(new Error('الخدمة غير متاحة حالياً'), { offline: true, status: 404 });
        throw Object.assign(new Error((data && data.error) || 'حدث خطأ، حاول مرة أخرى'), { status: res.status });
      }
      return data;
    },
    get(path) { return this.call('GET', path); },
    post(path, body) { return this.call('POST', path, body || {}); },
    put(path, body) { return this.call('PUT', path, body || {}); },
    patch(path, body) { return this.call('PATCH', path, body || {}); },
    del(path) { return this.call('DELETE', path); },

    /* Called once per page by main.js before rendering. Never rejects. */
    async boot(wanted) {
      const need = wanted || ['config', 'catalog', 'listings', 'me'];
      const out = {};
      const timeout = (ms) => new Promise((_, rej) => setTimeout(() => rej(new Error('timeout')), ms));
      const tasks = need.map((k) => Promise.race([(async () => {
        try {
          if (k === 'config') out.config = await this.get('/config');
          if (k === 'catalog') out.catalog = await this.get('/catalog');
          if (k === 'listings') out.listings = (await this.get('/listings')).listings;
          if (k === 'me') out.user = (await this.get('/auth/me')).user;
        } catch (e) { /* keep static fallback */ }
      })(), timeout(4000)]).catch(() => {}));
      await Promise.all(tasks);
      this.online = !!(out.config || out.catalog || out.listings || out.user !== undefined);
      this.config = out.config || null;
      this.user = out.user || null;
      return out;
    },

    async login(login, password) { const r = await this.post('/auth/login', { login, password }); this.user = r.user; return r.user; },
    async register(data) { const r = await this.post('/auth/register', data); this.user = r.user; return r.user; },
    async logout() { await this.post('/auth/logout'); this.user = null; },

    /* Read an image file, shrink it (max 1600px) and upload. Returns { file, url } */
    async uploadImage(file) {
      const blob = await shrink(file);
      return this.uploadBlob(blob, 'listing');
    },
    async uploadDoc(file) {
      if (file.type === 'application/pdf') return this.uploadBlob(file, 'doc');
      return this.uploadBlob(await shrink(file, 2200), 'doc');
    },
    async uploadBlob(blob, kind) {
      const data = await new Promise((resolve, reject) => {
        const r = new FileReader();
        r.onload = () => resolve(String(r.result).split(',')[1] || '');
        r.onerror = () => reject(new Error('تعذّر قراءة الملف'));
        r.readAsDataURL(blob);
      });
      return this.post('/upload', { kind, data });
    }
  };

  function shrink(file, max = 1600) {
    return new Promise((resolve, reject) => {
      if (!/^image\//.test(file.type)) return reject(new Error('الملف المختار ليس صورة'));
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        URL.revokeObjectURL(url);
        const k = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        c.toBlob((b) => (b ? resolve(b) : reject(new Error('تعذّر معالجة الصورة'))), 'image/jpeg', 0.82);
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('تعذّر فتح الصورة')); };
      img.src = url;
    });
  }

  window.ISC_API = API;
})();
