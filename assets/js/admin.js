/* =========================================================
   لوحة التحكم — Dashboard
   requests · appointments · property ads · users & licence verification · services catalog · blog · settings
   ========================================================= */
(function () {
  'use strict';
  const A = window.ISC_API;
  const PROP = window.PROP;
  const M = window.MARKET;
  const S = window.SITE;
  const app = document.getElementById('app');

  /* ---------------- helpers ---------------- */
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const ic = (n, c = '') => `<i data-lucide="${n}"${c ? ` class="${c}"` : ''}></i>`;
  const $ = (r, s) => r.querySelector(s);
  const $$ = (r, s) => [...r.querySelectorAll(s)];
  const draw = () => window.lucide && window.lucide.createIcons({ attrs: { 'stroke-width': 1.8 } });
  const nf = (n) => Number(n || 0).toLocaleString('ar-SA-u-nu-latn');
  const dt = (iso) => iso ? new Date(iso).toLocaleString('ar-SA-u-nu-latn-ca-gregory', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) : '';
  const dd = (d) => d ? new Date(d + 'T00:00:00Z').toLocaleDateString('ar-SA-u-nu-latn-ca-gregory', { timeZone: 'UTC', weekday: 'long', day: 'numeric', month: 'long' }) : '';
  const debounce = (fn, ms = 300) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };
  const qs = (o) => { const p = new URLSearchParams(); Object.entries(o).forEach(([k, v]) => { if (v !== '' && v != null) p.set(k, v); }); const s = p.toString(); return s ? '?' + s : ''; };
  const waLink = (phone, text) => `https://wa.me/966${String(phone).replace(/^0/, '')}${text ? '?text=' + encodeURIComponent(text) : ''}`;

  const REQ_TYPES = { service: 'طلب خدمة', appointment: 'حجز موعد', property_request: 'طلب عقار', inquiry: 'استفسار عن إعلان', contact: 'رسالة' };
  const REQ_ICON = { service: 'send', appointment: 'calendar-check', property_request: 'clipboard-list', inquiry: 'message-square-text', contact: 'mail' };
  const REQ_ST = { new: 'جديد', in_progress: 'قيد التنفيذ', waiting: 'بانتظار العميل', completed: 'مكتمل', cancelled: 'ملغي' };
  const LST_ST = { pending: 'بانتظار المراجعة', published: 'منشور', rejected: 'مرفوض', closed: 'مغلق' };
  const DOC_NAMES = { adLicense: 'رخصة الإعلان', cr: 'السجل التجاري', fal: 'رخصة فال' };
  const DOC_ST = { pending: 'بانتظار التوثيق', verified: 'موثّقة', rejected: 'مرفوضة' };
  const ROLE = { user: 'عميل', staff: 'موظف', admin: 'مدير' };
  const ACC_TYPE = { individual: 'فرد', broker: 'وسيط', company: 'شركة' };
  const SECTIONS = { realestate: 'الخدمات العقارية', taqib: 'الخدمات العامة', students: 'الخدمات الطلابية' };
  const DEAL = { rent: 'إيجار', sale: 'بيع', invest: 'استثمار' };
  const tag = (cls, text) => `<span class="tag ${cls}">${esc(text)}</span>`;
  const typeName = (k) => (M.types[k] ? M.types[k].one.ar : k);
  const cityOpts = (sel) => `<option value="">— اختر —</option>` + S.cities.map(([ar]) => `<option${ar === sel ? ' selected' : ''}>${esc(ar)}</option>`).join('');

  let me = null;
  const isAdmin = () => me && me.role === 'admin';

  function toast(msg, kind = 'ok') {
    const box = document.getElementById('toasts');
    const el = document.createElement('div');
    el.className = 'toast-x ' + kind;
    el.innerHTML = `${ic(kind === 'bad' ? 'circle-alert' : 'circle-check')} <span>${esc(msg)}</span>`;
    box.appendChild(el); draw();
    setTimeout(() => el.remove(), 4200);
  }
  async function api(method, path, body, quiet) {
    try { return await A.call(method, '/admin' + path, body); }
    catch (e) { if (!quiet) toast(e.message, 'bad'); throw e; }
  }

  /* modal / drawer */
  function overlay(kind, { title, sub, body, footer, onMount }) {
    const wrap = document.createElement('div');
    if (kind === 'drawer') {
      wrap.className = 'overlay';
      wrap.innerHTML = `<aside class="drawer" role="dialog" aria-modal="true"><div class="drawer-h"><div style="flex:1"><h2>${title}</h2>${sub ? `<small>${sub}</small>` : ''}</div><button type="button" data-x aria-label="إغلاق">${ic('x')}</button></div><div class="drawer-b">${body}</div></aside>`;
    } else {
      wrap.className = 'modalx';
      wrap.innerHTML = `<div class="box" role="dialog" aria-modal="true"><header><h3>${title}</h3><button class="btn ghost icon" type="button" data-x aria-label="إغلاق">${ic('x')}</button></header><div class="body">${body}</div>${footer ? `<footer>${footer}</footer>` : ''}</div>`;
    }
    document.body.appendChild(wrap);
    const close = () => { wrap.remove(); document.removeEventListener('keydown', esc_); };
    const esc_ = (e) => { if (e.key === 'Escape') close(); };
    document.addEventListener('keydown', esc_);
    wrap.addEventListener('mousedown', (e) => { if (e.target === wrap) close(); });
    $$(wrap, '[data-x]').forEach((b) => b.addEventListener('click', close));
    draw();
    if (onMount) onMount(wrap, close);
    return { el: wrap, close };
  }
  const modal = (o) => overlay('modal', o);
  const drawer = (o) => overlay('drawer', o);

  /* ---------------- login ---------------- */
  function loginScreen(msg) {
    app.className = '';
    app.innerHTML = `<div class="login"><form class="box" novalidate>
      <img src="assets/brand/logo_main.png" alt="">
      <h1>لوحة التحكم</h1>
      ${msg ? `<p class="hintx" style="text-align:center;color:var(--bad)">${esc(msg)}</p>` : ''}
      <div class="grid" style="margin-top:14px">
        <div><label class="lbl">رقم الجوال أو البريد</label><input class="input" name="login" dir="ltr" autocomplete="username" required></div>
        <div><label class="lbl">كلمة المرور</label><input class="input" name="password" type="password" autocomplete="current-password" required></div>
        <div class="hintx" id="lerr" style="color:var(--bad)" hidden></div>
        <button class="btn gold" type="submit">${ic('log-in')} دخول</button>
        <a class="hintx" style="text-align:center" href="index.html">← العودة للموقع</a>
      </div></form></div>`;
    draw();
    $(app, 'form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const f = e.target; const er = $(app, '#lerr'); er.hidden = true;
      try {
        const u = await A.login(f.login.value, f.password.value);
        if (u.role === 'user') { await A.logout(); er.textContent = 'هذا الحساب ليس لديه صلاحية دخول اللوحة'; er.hidden = false; return; }
        start(u);
      } catch (ex) { er.textContent = ex.message; er.hidden = false; }
    });
  }

  /* ---------------- shell ---------------- */
  const NAV = [
    ['overview', 'layout-dashboard', 'نظرة عامة', 'staff'],
    ['sep', 'العمل اليومي'],
    ['requests', 'inbox', 'الطلبات', 'staff', 'newReq'],
    ['appointments', 'calendar-check', 'المواعيد', 'staff'],
    ['listings', 'megaphone', 'الإعلانات العقارية', 'staff', 'pendingList'],
    ['sep', 'الإدارة'],
    ['users', 'users', 'المستخدمون', 'admin'],
    ['docs', 'badge-check', 'توثيق الوثائق', 'admin', 'pendingDocs'],
    ['catalog', 'layout-grid', 'الخدمات والتصنيفات', 'admin'],
    ['blog', 'newspaper', 'المدونة', 'staff'],
    ['settings', 'settings', 'الإعدادات', 'admin']
  ];
  let route = { name: 'overview', arg: '' };
  let badges = {};

  function shell() {
    app.className = '';
    document.title = 'لوحة التحكم | مركز الخدمات المتكاملة';
    app.innerHTML = `<div class="shell">
      <aside class="side">
        <div class="brand"><img src="assets/brand/symbol_white.png" alt=""><div><b>مركز الخدمات المتكاملة</b><small>لوحة التحكم</small></div></div>
        ${NAV.filter((n) => n[0] === 'sep' || n[3] === 'staff' || isAdmin()).map((n) => n[0] === 'sep' ? `<div class="nav-sep">${n[1]}</div>` : `<button class="nav-a" data-r="${n[0]}">${ic(n[1])} ${n[2]} ${n[4] ? `<span class="badge" data-badge="${n[4]}" hidden></span>` : ''}</button>`).join('')}
        <div class="spacer"></div>
        <a class="nav-a" href="index.html" target="_blank">${ic('external-link')} فتح الموقع</a>
        <button class="nav-a" data-r="logout">${ic('log-out')} تسجيل الخروج</button>
      </aside>
      <div class="main">
        <div class="topbar"><button class="btn ghost icon burger" id="burger" aria-label="القائمة">${ic('menu')}</button><h1 id="pageTitle"></h1><span class="sp"></span>
          <div class="who"><span class="av">${ic('user-round')}</span><span>${esc(me.name)} <small class="muted">· ${ROLE[me.role]}</small></span></div></div>
        <div class="content" id="view"></div>
      </div></div>`;
    draw();
    $$(app, '[data-r]').forEach((b) => b.addEventListener('click', async () => {
      document.body.classList.remove('nav-open');
      if (b.dataset.r === 'logout') { await A.logout(); loginScreen(); return; }
      location.hash = '#' + b.dataset.r;
    }));
    document.getElementById('burger').addEventListener('click', () => document.body.classList.toggle('nav-open'));
  }

  function setBadges(s) {
    badges = { newReq: s.requests.new, pendingList: s.listings.pending, pendingDocs: s.users.pendingDocs };
    $$(app, '[data-badge]').forEach((b) => { const n = badges[b.dataset.badge] || 0; b.textContent = n; b.hidden = !n; });
    const total = (badges.newReq || 0) + (badges.pendingList || 0);
    document.title = (total ? `(${total}) ` : '') + 'لوحة التحكم | مركز الخدمات المتكاملة';
  }

  const PAGES = { overview: pOverview, requests: pRequests, appointments: pAppointments, listings: pListings, users: pUsers, docs: pDocs, catalog: pCatalog, blog: pBlog, settings: pSettings };
  const TITLES = { overview: 'نظرة عامة', requests: 'الطلبات', appointments: 'المواعيد', listings: 'الإعلانات العقارية', users: 'المستخدمون', docs: 'توثيق الوثائق والتراخيص', catalog: 'الخدمات والتصنيفات', blog: 'المدونة', settings: 'الإعدادات' };

  async function render() {
    const [path, query] = (location.hash.slice(1) || 'overview').split('?');
    const [name, ...rest] = path.split('/');
    route = { name: PAGES[name] ? name : 'overview', arg: rest.join('/'), query: Object.fromEntries(new URLSearchParams(query || '')) };
    const adminOnly = NAV.find((n) => n[0] === route.name && n[3] === 'admin');
    if (adminOnly && !isAdmin()) { location.hash = '#overview'; return; }
    $$(app, '.nav-a[data-r]').forEach((b) => b.classList.toggle('active', b.dataset.r === route.name));
    document.getElementById('pageTitle').textContent = TITLES[route.name];
    const view = document.getElementById('view');
    view.innerHTML = `<div class="empty"><span class="spin"></span></div>`;
    try { await PAGES[route.name](view, route.arg); }
    catch (e) { view.innerHTML = `<div class="empty">${ic('circle-alert')} ${esc(e.message)}</div>`; }
    draw();
  }

  /* =========================================================
     Overview
     ========================================================= */
  async function pOverview(el) {
    const s = await api('GET', '/stats');
    setBadges(s);
    const recent = await api('GET', '/requests?status=new&limit=6');
    const max = Math.max(1, ...s.daily.map((d) => d.n));
    const typeMax = Math.max(1, ...Object.values(s.requests.byType));
    const card = (cls, icon, n, label, go) => `<div class="card stat ${cls}" data-go="${go}"><span class="ico">${ic(icon)}</span><div><b>${nf(n)}</b><small>${label}</small></div></div>`;
    el.innerHTML = `
      <div class="grid g4">
        ${card('info', 'inbox', s.requests.new, 'طلبات جديدة', 'requests?status=new')}
        ${card('gold', 'calendar-check', s.appointments.today, `مواعيد اليوم (${nf(s.appointments.upcoming)} قادمة)`, 'appointments')}
        ${card('gold', 'megaphone', s.listings.pending, 'إعلانات بانتظار المراجعة', 'listings?status=pending')}
        ${isAdmin() ? card('ok', 'badge-check', s.users.pendingDocs, 'وثائق بانتظار التوثيق', 'docs') : card('ok', 'list-checks', s.requests.total, 'إجمالي الطلبات', 'requests')}
      </div>
      <div class="grid g3" style="margin-top:14px">
        <div class="card" style="grid-column: span 2"><h3>${ic('chart-column')} الطلبات خلال 14 يوماً</h3>
          <div class="bars">${s.daily.map((d) => `<div class="bar" title="${d.date}"><b>${d.n || ''}</b><i style="height:${Math.round(d.n / max * 100)}%"></i><span>${d.date.slice(8)}</span></div>`).join('')}</div></div>
        <div class="card"><h3>${ic('pie-chart')} حسب النوع</h3>
          ${Object.entries(s.requests.byType).map(([k, n]) => `<div class="hbar"><span>${REQ_TYPES[k] || k}</span><b>${n}</b><div class="track"><i style="width:${Math.round(n / typeMax * 100)}%"></i></div></div>`).join('') || '<p class="muted">لا توجد بيانات</p>'}
        </div>
      </div>
      <div class="grid g3" style="margin-top:14px">
        <div class="card" style="grid-column: span 2"><h3>${ic('bell-ring')} آخر الطلبات الجديدة</h3>
          ${recent.items.length ? `<div class="tbl-wrap" style="box-shadow:none">${reqTable(recent.items)}</div>` : `<div class="empty">${ic('inbox')}لا توجد طلبات جديدة</div>`}</div>
        <div class="grid" style="align-content:start">
          <div class="card"><h3>${ic('trophy')} أكثر الخدمات طلباً</h3>${s.topServices.map((x) => `<div class="hbar"><span>${esc(x.title)}</span><b>${x.n}</b></div>`).join('') || '<p class="muted">لا توجد بيانات</p>'}</div>
          <div class="card"><h3>${ic('history')} آخر النشاطات</h3>${s.logs.map((l) => `<div class="log-li"><span><b>${esc(l.by)}</b> — ${esc(l.action)} ${esc(l.target)}</span><small>${dt(l.at)}</small></div>`).join('') || '<p class="muted">لا يوجد نشاط بعد</p>'}</div>
        </div>
      </div>
      <div class="grid g4" style="margin-top:14px">
        ${card('', 'layout-grid', s.services.items, `خدمة في ${nf(s.services.categories)} تصنيف`, isAdmin() ? 'catalog' : 'overview')}
        ${card('', 'megaphone', s.listings.published, 'إعلان منشور', 'listings?status=published')}
        ${card('', 'users', s.users.total, 'مستخدم مسجّل', isAdmin() ? 'users' : 'overview')}
        ${card('', 'newspaper', s.posts.published, 'مقال منشور', 'blog')}
      </div>
      ${s.listings.sample ? `<div class="card" style="margin-top:14px;border-color:var(--gold-l)"><div class="row">${ic('triangle-alert')} <span>يوجد <b>${s.listings.sample}</b> إعلان تجريبي ظاهر للزوار.</span><span class="sp"></span>${isAdmin() ? '<button class="btn bad sm" id="purge">حذف الإعلانات التجريبية</button>' : ''}</div></div>` : ''}`;
    draw();
    $$(el, '[data-go]').forEach((c) => c.addEventListener('click', () => { location.hash = '#' + c.dataset.go; }));
    bindReqRows(el);
    const purge = $(el, '#purge');
    if (purge) purge.addEventListener('click', async () => { if (!confirm('حذف كل الإعلانات التجريبية؟')) return; const r = await api('POST', '/listings-purge-samples'); toast(`تم حذف ${r.removed} إعلان`); render(); });
  }

  /* =========================================================
     Requests
     ========================================================= */
  function reqSummary(r) {
    if (r.service) return esc(r.service.titleAr);
    if (r.property) return `${esc(typeName(r.property.type))} ${DEAL[r.property.deal] || ''}`;
    if (r.type === 'inquiry') return `إعلان #${r.listingId}`;
    return esc((r.notes || '').slice(0, 50));
  }
  function reqTable(items) {
    return `<table><thead><tr><th>الرقم</th><th>النوع</th><th>العميل</th><th>التفاصيل</th><th>الحالة</th><th>التاريخ</th></tr></thead><tbody>
      ${items.map((r) => `<tr class="click ${r.status === 'new' ? 'is-new' : ''}" data-req="${r.id}">
        <td><b dir="ltr">${esc(r.ref)}</b></td>
        <td>${ic(REQ_ICON[r.type])} ${REQ_TYPES[r.type]}</td>
        <td>${esc(r.name)}<span class="sub" dir="ltr">${esc(r.phone)}</span></td>
        <td>${reqSummary(r)}${r.appointment ? `<span class="sub">${ic('calendar-check')} ${dd(r.appointment.date)} ${esc(r.appointment.time)}</span>` : ''}${r.city ? `<span class="sub">${esc(r.city)}</span>` : ''}</td>
        <td>${tag(r.status, REQ_ST[r.status])}</td><td>${dt(r.createdAt)}</td></tr>`).join('')}
    </tbody></table>`;
  }
  function bindReqRows(el) { $$(el, '[data-req]').forEach((r) => r.addEventListener('click', () => openRequest(+r.dataset.req))); }

  async function pRequests(el, arg) {
    const f = Object.assign({ type: '', status: '', q: '', from: '', to: '', page: 1 }, route.query);
    const stats = await api('GET', '/stats'); setBadges(stats);
    el.innerHTML = `
      <div class="tabs" id="rtabs">${[['', 'الكل', stats.requests.total], ...Object.entries(REQ_TYPES).map(([k, v]) => [k, v, stats.requests.byType[k] || 0])].map(([k, v, n]) => `<button data-t="${k}" class="${f.type === k ? 'active' : ''}">${v} <span class="n">${n}</span></button>`).join('')}</div>
      <div class="toolbar">
        <input class="input grow" id="q" placeholder="بحث بالاسم، الجوال، رقم الطلب، الخدمة…" value="${esc(f.q)}">
        <select class="select" id="st"><option value="">كل الحالات</option>${Object.entries(REQ_ST).map(([k, v]) => `<option value="${k}"${f.status === k ? ' selected' : ''}>${v}</option>`).join('')}</select>
        <input class="input" type="date" id="from" value="${esc(f.from)}" title="من"><input class="input" type="date" id="to" value="${esc(f.to)}" title="إلى">
        <button class="btn ghost" id="csv">${ic('download')} تصدير Excel</button>
      </div>
      <div id="rlist"></div>`;
    draw();
    const load = async () => {
      const r = await api('GET', '/requests' + qs({ type: f.type, status: f.status, q: f.q, from: f.from, to: f.to, page: f.page, limit: 30 }));
      const pages = Math.ceil(r.total / r.limit);
      $(el, '#rlist').innerHTML = r.items.length ? `<div class="tbl-wrap">${reqTable(r.items)}</div>${pages > 1 ? `<div class="pager"><button class="btn ghost sm" id="pp" ${f.page <= 1 ? 'disabled' : ''}>السابق</button><span>${f.page} / ${pages}</span><button class="btn ghost sm" id="pn" ${f.page >= pages ? 'disabled' : ''}>التالي</button></div>` : ''}<p class="hintx">${nf(r.total)} طلب</p>` : `<div class="empty">${ic('inbox')}لا توجد طلبات مطابقة</div>`;
      draw(); bindReqRows(el);
      const pp = $(el, '#pp'), pn = $(el, '#pn');
      if (pp) pp.addEventListener('click', () => { f.page--; load(); });
      if (pn) pn.addEventListener('click', () => { f.page++; load(); });
    };
    $$(el, '#rtabs button').forEach((b) => b.addEventListener('click', () => { f.type = b.dataset.t; f.page = 1; $$(el, '#rtabs button').forEach((x) => x.classList.toggle('active', x === b)); load(); }));
    $(el, '#q').addEventListener('input', debounce((e) => { f.q = e.target.value; f.page = 1; load(); }));
    $(el, '#st').addEventListener('change', (e) => { f.status = e.target.value; f.page = 1; load(); });
    $(el, '#from').addEventListener('change', (e) => { f.from = e.target.value; f.page = 1; load(); });
    $(el, '#to').addEventListener('change', (e) => { f.to = e.target.value; f.page = 1; load(); });
    $(el, '#csv').addEventListener('click', () => window.open('/api/admin/requests.csv' + qs({ type: f.type, status: f.status, q: f.q, from: f.from, to: f.to }), '_blank'));
    window._reloadRequests = load;
    await load();
  }

  const detailChips = (p) => {
    const d = p.details || {}; const out = [];
    const rng = (a, b, unit) => `${a ? nf(a) : 0} – ${b ? nf(b) : '∞'} ${unit}`;
    if (d.budgetMin || d.budgetMax) out.push(['الميزانية', rng(d.budgetMin, d.budgetMax, 'ريال')]);
    if (d.areaMin || d.areaMax) out.push(['المساحة', rng(d.areaMin, d.areaMax, 'م²')]);
    Object.keys(d).forEach((k) => {
      if (['budgetMin', 'budgetMax', 'areaMin', 'areaMax'].includes(k)) return;
      const f = PROP.FIELDS[k]; if (!f) return;
      out.push([f.ar, f.kind === 'bool' ? 'نعم' : (f.kind === 'count' || f.kind === 'number') ? nf(d[k]) : PROP.labelOf(k, d[k], 'ar')]);
    });
    return out;
  };

  async function openRequest(id) {
    const r = await api('GET', '/requests/' + id);
    const phoneTxt = `مرحباً ${r.name}، معك مركز الخدمات المتكاملة بخصوص طلبك رقم ${r.ref}`;
    const prop = r.property ? detailChips(r.property) : [];
    const d = drawer({
      title: `${REQ_TYPES[r.type]} <span dir="ltr">${esc(r.ref)}</span>`, sub: dt(r.createdAt),
      body: `
        <section><h4>${ic('user-round')} العميل</h4>
          <dl class="kv"><dt>الاسم</dt><dd>${esc(r.name)}</dd><dt>الجوال</dt><dd dir="ltr" style="text-align:end">${esc(r.phone)}</dd>
          ${r.email ? `<dt>البريد</dt><dd dir="ltr" style="text-align:end">${esc(r.email)}</dd>` : ''}${r.city ? `<dt>المدينة</dt><dd>${esc(r.city)}</dd>` : ''}
          <dt>الحساب</dt><dd>${r.user ? `مسجّل ${r.user.verified && (r.user.verified.ad || r.user.verified.cr || r.user.verified.fal) ? tag('verified', 'موثّق') : ''}` : 'زائر (بدون حساب)'}</dd></dl>
          <div class="row" style="margin-top:10px"><a class="btn ok sm" href="${waLink(r.phone, phoneTxt)}" target="_blank" rel="noopener">${ic('message-circle')} رد عبر واتساب</a><a class="btn ghost sm" href="tel:${esc(r.phone)}">${ic('phone')} اتصال</a></div></section>
        ${r.service ? `<section><h4>${ic('layout-grid')} الخدمة</h4><dl class="kv"><dt>الخدمة</dt><dd>${esc(r.service.titleAr)}</dd><dt>التصنيف</dt><dd>${esc(r.service.categoryAr)}</dd></dl></section>` : ''}
        ${r.appointment ? `<section><h4>${ic('calendar-check')} الموعد</h4><dl class="kv"><dt>اليوم</dt><dd>${dd(r.appointment.date)}</dd><dt>الوقت</dt><dd>${esc(r.appointment.time)}</dd><dt>الطريقة</dt><dd>${r.appointment.mode === 'call' ? 'مكالمة هاتفية' : 'زيارة المكتب'}</dd></dl>
          <div class="grid g2" style="margin-top:10px"><div><label class="lbl">تعديل اليوم</label><input class="input" type="date" id="apD" value="${esc(r.appointment.date)}"></div><div><label class="lbl">تعديل الوقت</label><input class="input" type="time" id="apT" value="${esc(r.appointment.time)}"></div></div></section>` : ''}
        ${r.property ? `<section><h4>${ic('clipboard-list')} متطلبات العقار</h4><dl class="kv"><dt>القسم</dt><dd>${DEAL[r.property.deal]}</dd><dt>النوع</dt><dd>${esc(typeName(r.property.type))}</dd></dl>
          <div class="chipsx" style="margin-top:8px">${prop.map(([k, v]) => `<span><b>${esc(k)}:</b> ${esc(v)}</span>`).join('') || '<span>لا توجد مواصفات إضافية</span>'}</div>
          ${r.listing ? `<p class="hintx">${ic('megaphone')} مرتبط بإعلان #${r.listing.id} (${LST_ST[r.listing.status] || r.listing.status})</p>` : ''}</section>` : ''}
        ${r.listingId && r.type === 'inquiry' ? `<section><h4>${ic('megaphone')} الإعلان</h4><p>${r.listing ? esc(r.listing.title.ar) : ''} — <a href="#listings/${r.listingId}" style="color:var(--gold-d)">عرض الإعلان #${r.listingId}</a></p></section>` : ''}
        ${r.notes ? `<section><h4>${ic('message-square-text')} ملاحظات العميل</h4><p style="white-space:pre-line;margin:0">${esc(r.notes)}</p></section>` : ''}
        <section><h4>${ic('settings-2')} إدارة الطلب</h4>
          <div class="grid g2"><div><label class="lbl">الحالة</label><select class="select" id="rSt">${Object.entries(REQ_ST).map(([k, v]) => `<option value="${k}"${r.status === k ? ' selected' : ''}>${v}</option>`).join('')}</select></div>
          <div><label class="lbl">رسالة تظهر للعميل في حسابه</label><input class="input" id="rCust" placeholder="مثال: تم تجهيز مستنداتك"></div>
          <div class="full"><label class="lbl">ملاحظة داخلية (لا يراها العميل)</label><textarea class="textarea" id="rNote">${esc(r.adminNote || '')}</textarea></div></div>
          <div class="row" style="margin-top:12px"><button class="btn gold" id="rSave">${ic('save')} حفظ</button>
            ${r.type === 'property_request' ? `<button class="btn ghost" id="rPub">${ic('megaphone')} نشر في سوق العقار</button>` : ''}
            <span class="sp"></span>${isAdmin() ? `<button class="btn ghost sm" id="rDel" style="color:var(--bad)">${ic('trash-2')} حذف</button>` : ''}</div></section>
        <section><h4>${ic('history')} السجل</h4><ul class="timeline">${(r.history || []).slice().reverse().map((h) => `<li><b>${REQ_ST[h.status] || h.status}</b>${h.note ? ` — ${esc(h.note)}` : ''}<small>${dt(h.at)} · ${esc(h.by)}${h.public ? '' : ' · داخلي'}</small></li>`).join('')}</ul></section>`
    });
    const el = d.el;
    $(el, '#rSave').addEventListener('click', async () => {
      const body = { status: $(el, '#rSt').value, customerNote: $(el, '#rCust').value, adminNote: $(el, '#rNote').value };
      if ($(el, '#apD')) body.appointment = { date: $(el, '#apD').value, time: $(el, '#apT').value };
      await api('PATCH', '/requests/' + id, body);
      toast('تم حفظ الطلب'); d.close(); refreshAfter();
    });
    if ($(el, '#rPub')) $(el, '#rPub').addEventListener('click', async () => { await api('POST', `/requests/${id}/publish`); toast('تم نشر الطلب في السوق'); d.close(); refreshAfter(); });
    if ($(el, '#rDel')) $(el, '#rDel').addEventListener('click', async () => { if (!confirm('حذف الطلب نهائياً؟')) return; await api('DELETE', '/requests/' + id); toast('تم الحذف'); d.close(); refreshAfter(); });
  }
  const refreshAfter = () => { if (route.name === 'requests' && window._reloadRequests) window._reloadRequests(); else render(); };

  /* =========================================================
     Appointments
     ========================================================= */
  async function pAppointments(el) {
    const f = { from: new Date().toISOString().slice(0, 10), status: '' };
    const load = async () => {
      const r = await api('GET', '/appointments' + qs(f));
      const byDay = {};
      r.items.forEach((x) => { (byDay[x.appointment.date] = byDay[x.appointment.date] || []).push(x); });
      $(el, '#ag').innerHTML = Object.keys(byDay).length ? Object.entries(byDay).map(([day, list]) => `
        <div class="agenda-day"><h4>${ic('calendar-days')} ${dd(day)} <span class="tag">${list.length}</span></h4>
        ${list.map((x) => `<div class="appt-row" data-req="${x.id}"><span class="time" dir="ltr">${esc(x.appointment.time)}</span><div style="flex:1"><b>${esc(x.name)}</b> <span class="muted" dir="ltr">${esc(x.phone)}</span><span class="sub muted" style="display:block;font-size:.82rem">${x.service ? esc(x.service.titleAr) : 'موعد عام'} · ${x.appointment.mode === 'call' ? 'مكالمة' : 'زيارة'}</span></div>${tag(x.status, REQ_ST[x.status])}</div>`).join('')}</div>`).join('') : `<div class="empty">${ic('calendar-x')}لا توجد مواعيد</div>`;
      draw(); bindReqRows(el);
    };
    el.innerHTML = `<div class="toolbar"><label class="lbl" style="margin:0">من تاريخ</label><input class="input" type="date" id="from" value="${f.from}"><select class="select" id="st"><option value="">كل الحالات</option>${Object.entries(REQ_ST).map(([k, v]) => `<option value="${k}">${v}</option>`).join('')}</select>
      <span class="hintx">أوقات الحجز وعدد المواعيد لكل وقت تتغير من «الإعدادات».</span></div><div id="ag"></div>`;
    $(el, '#from').addEventListener('change', (e) => { f.from = e.target.value; load(); });
    $(el, '#st').addEventListener('change', (e) => { f.status = e.target.value; load(); });
    window._reloadRequests = load;
    await load();
  }

  /* =========================================================
     Listings
     ========================================================= */
  async function pListings(el, arg) {
    const f = Object.assign({ status: '', kind: '', q: '' }, route.query);
    const stats = await api('GET', '/stats'); setBadges(stats);
    el.innerHTML = `
      <div class="tabs" id="ltabs">${[['', 'الكل'], ['pending', 'بانتظار المراجعة'], ['published', 'منشورة'], ['rejected', 'مرفوضة'], ['closed', 'مغلقة']].map(([k, v]) => `<button data-s="${k}" class="${f.status === k ? 'active' : ''}">${v}</button>`).join('')}</div>
      <div class="toolbar"><input class="input grow" id="q" placeholder="بحث برقم الإعلان أو العنوان أو المدينة…" value="${esc(f.q)}">
        <select class="select" id="kind"><option value="">عروض وطلبات</option><option value="offer"${f.kind === 'offer' ? ' selected' : ''}>العروض</option><option value="request"${f.kind === 'request' ? ' selected' : ''}>الطلبات</option></select>
        <button class="btn gold" id="add">${ic('plus')} إضافة إعلان</button></div><div id="llist"></div>`;
    draw();
    let items = [];
    const load = async () => {
      const r = await api('GET', '/listings' + qs(f));
      items = r.items;
      $(el, '#llist').innerHTML = items.length ? `<div class="tbl-wrap"><table><thead><tr><th></th><th>الإعلان</th><th>المعلن</th><th>السعر</th><th>الحالة</th><th>المشاهدات</th><th></th></tr></thead><tbody>
        ${items.map((l) => `<tr class="click" data-l="${l.id}"><td>${l.img ? `<img class="listing-thumb" src="${esc(l.img)}" alt="">` : `<div class="listing-thumb"></div>`}</td>
          <td><b>#${l.id}</b> ${tag(l.kind === 'request' ? 'warn' : 'info', l.kind === 'request' ? 'طلب' : 'عرض')} ${tag('', DEAL[l.deal])} ${l.featured ? tag('warn', 'مميز') : ''} ${l.sample ? tag('draft', 'تجريبي') : ''}<span class="sub">${esc(l.title.ar)}</span><span class="sub">${esc(typeName(l.type))} · ${esc(l.city)}</span></td>
          <td>${l.owner ? `${esc(l.owner.name)}<span class="sub" dir="ltr">${esc(l.owner.phone)}</span>` : '<span class="muted">الإدارة</span>'}${l.license ? `<span class="sub">ترخيص: ${esc(l.license)}</span>` : ''}</td>
          <td>${l.price ? nf(l.price) : '—'}</td><td>${tag(l.status, LST_ST[l.status])}</td><td>${nf(l.views)}</td>
          <td style="white-space:nowrap">${l.status !== 'published' ? `<button class="btn ok sm" data-ap="${l.id}" title="اعتماد">${ic('check')}</button>` : ''}${l.status !== 'rejected' ? ` <button class="btn ghost sm" data-rj="${l.id}" title="رفض">${ic('x')}</button>` : ''}</td></tr>`).join('')}
        </tbody></table></div><p class="hintx">${r.total} إعلان</p>` : `<div class="empty">${ic('megaphone')}لا توجد إعلانات</div>`;
      draw();
      $$(el, '[data-l]').forEach((row) => row.addEventListener('click', (e) => { if (e.target.closest('button')) return; listingEditor(items.find((x) => x.id === +row.dataset.l), load); }));
      $$(el, '[data-ap]').forEach((b) => b.addEventListener('click', async () => { await api('PATCH', '/listings/' + b.dataset.ap, { status: 'published' }); toast('تم اعتماد الإعلان'); load(); }));
      $$(el, '[data-rj]').forEach((b) => b.addEventListener('click', async () => { const why = prompt('سبب الرفض (يظهر للمعلن):', ''); if (why === null) return; await api('PATCH', '/listings/' + b.dataset.rj, { status: 'rejected', rejectReason: why }); toast('تم رفض الإعلان'); load(); }));
    };
    $$(el, '#ltabs button').forEach((b) => b.addEventListener('click', () => { f.status = b.dataset.s; $$(el, '#ltabs button').forEach((x) => x.classList.toggle('active', x === b)); load(); }));
    $(el, '#q').addEventListener('input', debounce((e) => { f.q = e.target.value; load(); }));
    $(el, '#kind').addEventListener('change', (e) => { f.kind = e.target.value; load(); });
    $(el, '#add').addEventListener('click', () => listingEditor(null, load));
    await load();
    if (arg && /^\d+$/.test(arg)) { const l = items.find((x) => x.id === +arg); if (l) listingEditor(l, load); }
  }

  function listingEditor(l, done) {
    const isNew = !l;
    l = l || { kind: 'offer', deal: 'rent', type: 'villa', city: '', status: 'published', title: { ar: '', en: '' }, description: { ar: '', en: '' }, district: { ar: '', en: '' }, rawImages: [], details: {}, per: 'year' };
    let images = (l.rawImages || []).slice();
    const imgUrl = (f) => (/^\d+_[a-f0-9]{16}\./.test(f) ? '/uploads/listings/' + f : (f.includes('/') ? f : 'assets/img/' + f));
    const typeOpts = (deal, sel) => M.deals.find((d) => d.id === deal).types.map((k) => `<option value="${k}"${k === sel ? ' selected' : ''}>${esc(typeName(k))}</option>`).join('');
    const specs = detailChips({ details: l.details || {} });
    const m = modal({
      title: isNew ? 'إضافة إعلان' : `إعلان #${l.id}`,
      body: `<div class="grid g3">
        <div><label class="lbl">النوع</label><select class="select" id="kind"><option value="offer"${l.kind === 'offer' ? ' selected' : ''}>عرض</option><option value="request"${l.kind === 'request' ? ' selected' : ''}>طلب</option></select></div>
        <div><label class="lbl">القسم</label><select class="select" id="deal">${M.deals.map((d) => `<option value="${d.id}"${d.id === l.deal ? ' selected' : ''}>${d.ar}</option>`).join('')}</select></div>
        <div><label class="lbl">نوع العقار</label><select class="select" id="type">${typeOpts(l.deal, l.type)}</select></div>
        <div><label class="lbl">المدينة</label><select class="select" id="city">${cityOpts(l.city)}</select></div>
        <div><label class="lbl">الحي</label><input class="input" id="district" value="${esc(l.district && l.district.ar)}"></div>
        <div><label class="lbl">رقم ترخيص الإعلان</label><input class="input" id="lic" dir="ltr" value="${esc(l.license)}"></div>
        <div class="full"><label class="lbl">العنوان (عربي)</label><input class="input" id="tAr" value="${esc(l.title.ar)}" placeholder="اتركه فارغاً ليُولَّد تلقائياً"></div>
        <div class="full"><label class="lbl">العنوان (إنجليزي — اختياري)</label><input class="input" id="tEn" dir="ltr" value="${esc(l.title.en === l.title.ar ? '' : l.title.en)}"></div>
        <div><label class="lbl">السعر / الميزانية (ريال)</label><input class="input" id="price" type="number" min="0" value="${l.price || ''}"></div>
        <div><label class="lbl">الدفع (للإيجار)</label><select class="select" id="per"><option value="year"${l.per !== 'month' ? ' selected' : ''}>سنوياً</option><option value="month"${l.per === 'month' ? ' selected' : ''}>شهرياً</option></select></div>
        <div><label class="lbl">المساحة (م²)</label><input class="input" id="area" type="number" min="0" value="${l.area || ''}"></div>
        <div class="full"><label class="lbl">الوصف</label><textarea class="textarea" id="desc">${esc(l.description && l.description.ar)}</textarea></div>
        ${specs.length ? `<div class="full"><label class="lbl">المواصفات (يحددها المعلن)</label><div class="chipsx">${specs.map(([k, v]) => `<span><b>${esc(k)}:</b> ${esc(v)}</span>`).join('')}</div></div>` : ''}
        <div class="full"><label class="lbl">الصور</label><div class="thumbs-row" id="imgs"></div><div class="row" style="margin-top:8px"><button class="btn ghost sm" type="button" id="addImg">${ic('image-plus')} رفع صور</button><input type="file" id="fileIn" accept="image/*" multiple hidden></div></div>
        <div><label class="lbl">الحالة</label><select class="select" id="status">${Object.entries(LST_ST).map(([k, v]) => `<option value="${k}"${l.status === k ? ' selected' : ''}>${v}</option>`).join('')}</select></div>
        <div class="full" id="rjBox" ${l.status === 'rejected' ? '' : 'hidden'}><label class="lbl">سبب الرفض</label><input class="input" id="rj" value="${esc(l.rejectReason || '')}"></div>
        <div><label class="lbl">إعلان مميّز</label><label class="switch"><input type="checkbox" id="feat"${l.featured ? ' checked' : ''}><i></i></label></div>
        ${l.owner ? `<div class="full hintx">المعلن: ${esc(l.owner.name)} — <span dir="ltr">${esc(l.owner.phone)}</span> ${l.verified && (l.verified.ad || l.verified.cr || l.verified.fal) ? tag('verified', 'موثّق') : ''}</div>` : ''}
      </div>`,
      footer: `${!isNew ? `<button class="btn ghost" id="del" style="color:var(--bad);margin-inline-end:auto">${ic('trash-2')} حذف</button>` : ''}<button class="btn ghost" data-x>إلغاء</button><button class="btn gold" id="save">${ic('save')} حفظ</button>`
    });
    const el = m.el;
    const drawImgs = () => { $(el, '#imgs').innerHTML = images.map((f, i) => `<div class="t"><img src="${esc(imgUrl(f))}" alt=""><button type="button" data-rm="${i}">${ic('x')}</button></div>`).join('') || '<span class="hintx">لا توجد صور</span>'; draw(); $$(el, '[data-rm]').forEach((b) => b.addEventListener('click', () => { images.splice(+b.dataset.rm, 1); drawImgs(); })); };
    drawImgs();
    $(el, '#deal').addEventListener('change', (e) => { $(el, '#type').innerHTML = typeOpts(e.target.value, ''); });
    $(el, '#status').addEventListener('change', (e) => { $(el, '#rjBox').hidden = e.target.value !== 'rejected'; });
    $(el, '#addImg').addEventListener('click', () => $(el, '#fileIn').click());
    $(el, '#fileIn').addEventListener('change', async (e) => {
      for (const file of e.target.files) { try { const r = await A.uploadImage(file); images.push(r.file); drawImgs(); } catch (ex) { toast(ex.message, 'bad'); } }
      e.target.value = '';
    });
    $(el, '#save').addEventListener('click', async () => {
      const body = {
        kind: $(el, '#kind').value, deal: $(el, '#deal').value, type: $(el, '#type').value, city: $(el, '#city').value, district: $(el, '#district').value,
        adLicense: $(el, '#lic').value, price: $(el, '#price').value, per: $(el, '#per').value, area: $(el, '#area').value, description: { ar: $(el, '#desc').value, en: $(el, '#desc').value },
        images, featured: $(el, '#feat').checked, status: $(el, '#status').value, rejectReason: $(el, '#rj').value
      };
      if ($(el, '#tAr').value.trim()) body.title = { ar: $(el, '#tAr').value.trim(), en: $(el, '#tEn').value.trim() || $(el, '#tAr').value.trim() };
      if (!body.city) { toast('اختر المدينة', 'bad'); return; }
      if (isNew) await api('POST', '/listings', body); else await api('PATCH', '/listings/' + l.id, body);
      toast('تم الحفظ'); m.close(); done();
    });
    if ($(el, '#del')) $(el, '#del').addEventListener('click', async () => { if (!confirm('حذف الإعلان نهائياً؟')) return; await api('DELETE', '/listings/' + l.id); toast('تم الحذف'); m.close(); done(); });
  }

  /* =========================================================
     Users + documents verification
     ========================================================= */
  const docBadges = (u) => Object.keys(u.docs || {}).map((k) => tag(u.docs[k].status, DOC_NAMES[k])).join(' ') || '<span class="muted">—</span>';

  async function pUsers(el) {
    const f = { q: '', role: '', status: '', docs: '' };
    el.innerHTML = `<div class="toolbar"><input class="input grow" id="q" placeholder="بحث بالاسم أو الجوال أو البريد…">
      <select class="select" id="role"><option value="">كل الأنواع</option>${Object.entries(ROLE).map(([k, v]) => `<option value="${k}">${v}</option>`).join('')}</select>
      <select class="select" id="status"><option value="">كل الحالات</option><option value="active">نشط</option><option value="blocked">موقوف</option></select>
      <select class="select" id="docs"><option value="">كل الوثائق</option><option value="pending">وثائق بانتظار التوثيق</option><option value="verified">لديه وثائق موثّقة</option></select></div><div id="ulist"></div>`;
    let items = [];
    const load = async () => {
      const r = await api('GET', '/users' + qs(f)); items = r.items;
      $(el, '#ulist').innerHTML = items.length ? `<div class="tbl-wrap"><table><thead><tr><th>المستخدم</th><th>النوع</th><th>الوثائق</th><th>الطلبات</th><th>الإعلانات</th><th>الحالة</th><th>التسجيل</th></tr></thead><tbody>
        ${items.map((u) => `<tr class="click" data-u="${u.id}"><td><b>${esc(u.name)}</b><span class="sub" dir="ltr">${esc(u.phone)}</span></td><td>${ROLE[u.role]} · ${ACC_TYPE[u.type] || ''}</td><td>${docBadges(u)}</td><td>${u.requests}</td><td>${u.listings}</td><td>${tag(u.status, u.status === 'blocked' ? 'موقوف' : 'نشط')}</td><td>${dt(u.createdAt)}</td></tr>`).join('')}</tbody></table></div><p class="hintx">${r.total} مستخدم</p>` : `<div class="empty">${ic('users')}لا يوجد مستخدمون</div>`;
      draw(); $$(el, '[data-u]').forEach((row) => row.addEventListener('click', () => userDrawer(items.find((x) => x.id === +row.dataset.u), load)));
    };
    $(el, '#q').addEventListener('input', debounce((e) => { f.q = e.target.value; load(); }));
    ['role', 'status', 'docs'].forEach((k) => $(el, '#' + k).addEventListener('change', (e) => { f[k] = e.target.value; load(); }));
    await load();
  }

  function docCard(u, k, reload) {
    const d = u.docs[k];
    return `<div class="doc-mini" data-doc="${k}">
      <div style="flex:1"><b>${DOC_NAMES[k]}</b> ${tag(d.status, DOC_ST[d.status])}<div class="hintx">رقم: <span dir="ltr">${esc(d.number)}</span>${d.expiry ? ` · ينتهي: ${esc(d.expiry)}` : ''} · أُرسلت ${dt(d.submittedAt)}${d.note ? ` · ${esc(d.note)}` : ''}</div></div>
      ${d.file ? `<a class="btn ghost sm" href="/api/files/doc/${esc(d.file)}" target="_blank" rel="noopener">${ic('eye')} عرض الملف</a>` : ''}
      ${d.status !== 'verified' ? `<button class="btn ok sm" data-v="verified">${ic('check')} توثيق</button>` : ''}${d.status !== 'rejected' ? `<button class="btn ghost sm" data-v="rejected">${ic('x')} رفض</button>` : ''}</div>`;
  }
  function bindDocCards(root, u, reload) {
    $$(root, '[data-doc]').forEach((c) => $$(c, '[data-v]').forEach((b) => b.addEventListener('click', async () => {
      let note = '';
      if (b.dataset.v === 'rejected') { note = prompt('سبب الرفض (يظهر للعميل):', ''); if (note === null) return; }
      await api('POST', `/users/${u.id}/docs/${c.dataset.doc}`, { status: b.dataset.v, note });
      toast(b.dataset.v === 'verified' ? 'تم التوثيق' : 'تم الرفض'); reload();
    })));
  }

  function userDrawer(u, reload) {
    const d = drawer({
      title: esc(u.name), sub: `<span dir="ltr">${esc(u.phone)}</span> · ${ROLE[u.role]}`,
      body: `
        <section><h4>${ic('id-card')} البيانات</h4><div class="grid g2">
          <div><label class="lbl">الاسم</label><input class="input" id="uName" value="${esc(u.name)}"></div>
          <div><label class="lbl">الجوال</label><input class="input" id="uPhone" dir="ltr" value="${esc(u.phone)}"></div>
          <div><label class="lbl">البريد</label><input class="input" id="uMail" dir="ltr" value="${esc(u.email)}"></div>
          <div><label class="lbl">نوع الحساب</label><select class="select" id="uType">${Object.entries(ACC_TYPE).map(([k, v]) => `<option value="${k}"${u.type === k ? ' selected' : ''}>${v}</option>`).join('')}</select></div>
          <div><label class="lbl">الصلاحية</label><select class="select" id="uRole">${Object.entries(ROLE).map(([k, v]) => `<option value="${k}"${u.role === k ? ' selected' : ''}>${v}</option>`).join('')}</select></div>
          <div><label class="lbl">الحالة</label><select class="select" id="uSt"><option value="active"${u.status !== 'blocked' ? ' selected' : ''}>نشط</option><option value="blocked"${u.status === 'blocked' ? ' selected' : ''}>موقوف</option></select></div></div>
          <p class="hintx">«موظف»: يدير الطلبات والمواعيد والإعلانات والمدونة. «مدير»: كل الصلاحيات.</p>
          <div class="row"><button class="btn gold" id="uSave">${ic('save')} حفظ</button><button class="btn ghost" id="uPw">${ic('key-round')} كلمة مرور مؤقتة</button><span class="sp"></span><button class="btn ghost sm" id="uDel" style="color:var(--bad)">${ic('trash-2')} حذف</button></div></section>
        <section><h4>${ic('badge-check')} الوثائق والتراخيص</h4>${Object.keys(u.docs || {}).length ? `<div class="grid" id="uDocs">${Object.keys(u.docs).map((k) => docCard(u, k)).join('')}</div>` : '<p class="muted">لم يرفع وثائق</p>'}</section>
        <section><h4>${ic('activity')} النشاط</h4><p class="muted">${u.requests} طلب · ${u.listings} إعلان · سجّل في ${dt(u.createdAt)}</p></section>`
    });
    const el = d.el;
    if ($(el, '#uDocs')) bindDocCards($(el, '#uDocs'), u, () => { d.close(); reload(); });
    $(el, '#uSave').addEventListener('click', async () => {
      await api('PATCH', '/users/' + u.id, { name: $(el, '#uName').value, phone: $(el, '#uPhone').value, email: $(el, '#uMail').value, type: $(el, '#uType').value, role: $(el, '#uRole').value, status: $(el, '#uSt').value });
      toast('تم الحفظ'); d.close(); reload();
    });
    $(el, '#uPw').addEventListener('click', async () => {
      if (!confirm('إنشاء كلمة مرور مؤقتة؟ سيُسجَّل خروج المستخدم من كل أجهزته.')) return;
      const r = await api('POST', `/users/${u.id}/reset-password`);
      modal({ title: 'كلمة المرور المؤقتة', body: `<p>أرسلها للمستخدم — سيُطلب منه تغييرها بعد الدخول:</p><input class="input" readonly dir="ltr" value="${esc(r.password)}" onclick="this.select()" style="font-size:1.2rem;text-align:center;font-weight:800">`, footer: '<button class="btn gold" data-x>تم</button>' });
    });
    $(el, '#uDel').addEventListener('click', async () => { if (!confirm('حذف المستخدم وإعلاناته نهائياً؟')) return; await api('DELETE', '/users/' + u.id); toast('تم الحذف'); d.close(); reload(); });
  }

  async function pDocs(el) {
    const load = async () => {
      const r = await api('GET', '/users?docs=pending');
      const stats = await api('GET', '/stats', undefined, true).catch(() => null); if (stats) setBadges(stats);
      el.innerHTML = r.items.length ? r.items.map((u) => `<div class="card" style="margin-bottom:14px"><div class="row"><b>${esc(u.name)}</b><span class="muted" dir="ltr">${esc(u.phone)}</span>${tag('', ACC_TYPE[u.type] || '')}<span class="sp"></span><button class="btn ghost sm" data-u="${u.id}">فتح الحساب</button></div>
        <div class="grid" style="margin-top:10px" data-card="${u.id}">${Object.keys(u.docs).filter((k) => u.docs[k].status === 'pending').map((k) => docCard(u, k)).join('')}</div></div>`).join('') : `<div class="empty">${ic('badge-check')}لا توجد وثائق بانتظار التوثيق 🎉</div>`;
      draw();
      r.items.forEach((u) => bindDocCards($(el, `[data-card="${u.id}"]`), u, load));
      $$(el, '[data-u]').forEach((b) => b.addEventListener('click', () => userDrawer(r.items.find((x) => x.id === +b.dataset.u), load)));
    };
    await load();
  }

  /* =========================================================
     Services catalog
     ========================================================= */
  async function pCatalog(el) {
    let sec = '';
    let cats = [];
    const open = new Set();
    const imgsList = (await api('GET', '/images')).images;
    const load = async () => { cats = (await api('GET', '/catalog')).categories; paint(); };
    const move = async (arr, i, dir, url) => {
      const j = i + dir; if (j < 0 || j >= arr.length) return;
      [arr[i], arr[j]] = [arr[j], arr[i]];
      await api('POST', url, { ids: arr.map((x) => x.id) }); load();
    };
    const paint = () => {
      const shown = cats.filter((c) => !sec || c.section === sec);
      el.innerHTML = `
        <div class="toolbar"><div class="tabs" style="margin:0" id="stabs"><button data-s="" class="${sec === '' ? 'active' : ''}">الكل</button>${Object.entries(SECTIONS).map(([k, v]) => `<button data-s="${k}" class="${sec === k ? 'active' : ''}">${v}</button>`).join('')}</div><span class="sp" style="flex:1"></span>
        <button class="btn gold" id="addCat">${ic('folder-plus')} تصنيف جديد</button></div>
        <p class="hintx">كل خدمة تحتوي تلقائياً على خيار «احجز موعد». يمكنك إيقافه لخدمة معيّنة من زر الموعد في الصف.</p>
        ${shown.map((c) => `<div class="cat-block" data-c="${esc(c.id)}"><div class="hd" data-toggle><span class="ico">${ic(c.icon)}</span><h4>${esc(c.title.ar)} <span class="muted" style="font-weight:500;font-size:.8rem">· ${SECTIONS[c.section]} · ${c.items.length} خدمة</span></h4>
          ${c.active ? '' : tag('draft', 'مخفي')}
          <button class="btn ghost icon sm" data-cup title="أعلى">${ic('arrow-up')}</button><button class="btn ghost icon sm" data-cdn title="أسفل">${ic('arrow-down')}</button><button class="btn ghost icon sm" data-cedit title="تعديل">${ic('pencil')}</button><button class="btn ghost icon sm" data-cdel title="حذف" style="color:var(--bad)">${ic('trash-2')}</button></div>
          ${open.has(c.id) ? `<div class="bd">${c.items.sort((a, b) => a.order - b.order).map((it) => `<div class="item-row" data-i="${esc(it.id)}"><span class="ico">${ic(it.icon)}</span><div class="t"><b>${esc(it.title.ar)}</b><small>${esc(it.desc.ar)}</small></div>
            <label class="switch" title="ظاهر في الموقع"><input type="checkbox" data-act ${it.active ? 'checked' : ''}><i></i></label>
            <button class="btn ${it.appointment ? 'ok' : 'ghost'} icon sm" data-appt title="${it.appointment ? 'الحجز مفعّل' : 'الحجز موقوف'}">${ic('calendar-check')}</button>
            <button class="btn ghost icon sm" data-iup>${ic('arrow-up')}</button><button class="btn ghost icon sm" data-idn>${ic('arrow-down')}</button><button class="btn ghost icon sm" data-iedit>${ic('pencil')}</button><button class="btn ghost icon sm" data-idel style="color:var(--bad)">${ic('trash-2')}</button></div>`).join('') || '<p class="muted">لا توجد خدمات</p>'}
            <div style="margin-top:10px"><button class="btn gold sm" data-iadd>${ic('plus')} إضافة خدمة</button></div></div>` : ''}</div>`).join('') || `<div class="empty">${ic('layout-grid')}لا توجد تصنيفات</div>`}`;
      draw();
      $$(el, '#stabs button').forEach((b) => b.addEventListener('click', () => { sec = b.dataset.s; paint(); }));
      $(el, '#addCat').addEventListener('click', () => catForm(null));
      $$(el, '.cat-block').forEach((blk) => {
        const c = cats.find((x) => x.id === blk.dataset.c);
        $(blk, '[data-toggle]').addEventListener('click', (e) => { if (e.target.closest('button')) return; open.has(c.id) ? open.delete(c.id) : open.add(c.id); paint(); });
        $(blk, '[data-cup]').addEventListener('click', () => { const arr = cats.slice().sort((a, b) => a.order - b.order); move(arr, arr.findIndex((x) => x.id === c.id), -1, '/categories-order'); });
        $(blk, '[data-cdn]').addEventListener('click', () => { const arr = cats.slice().sort((a, b) => a.order - b.order); move(arr, arr.findIndex((x) => x.id === c.id), 1, '/categories-order'); });
        $(blk, '[data-cedit]').addEventListener('click', () => catForm(c));
        $(blk, '[data-cdel]').addEventListener('click', async () => { if (!confirm(`حذف التصنيف «${c.title.ar}» وكل خدماته (${c.items.length})؟`)) return; await api('DELETE', '/categories/' + c.id); toast('تم الحذف'); load(); });
        const add = $(blk, '[data-iadd]'); if (add) add.addEventListener('click', () => itemForm(c, null));
        $$(blk, '[data-i]').forEach((row) => {
          const it = c.items.find((x) => x.id === row.dataset.i); const idx = c.items.indexOf(it);
          $(row, '[data-act]').addEventListener('change', async (e) => { await api('PATCH', `/categories/${c.id}/items/${it.id}`, { active: e.target.checked }); it.active = e.target.checked; });
          $(row, '[data-appt]').addEventListener('click', async () => { await api('PATCH', `/categories/${c.id}/items/${it.id}`, { appointment: !it.appointment }); load(); });
          $(row, '[data-iup]').addEventListener('click', () => move(c.items, idx, -1, `/categories/${c.id}/items-order`));
          $(row, '[data-idn]').addEventListener('click', () => move(c.items, idx, 1, `/categories/${c.id}/items-order`));
          $(row, '[data-iedit]').addEventListener('click', () => itemForm(c, it));
          $(row, '[data-idel]').addEventListener('click', async () => { if (!confirm(`حذف الخدمة «${it.title.ar}»؟`)) return; await api('DELETE', `/categories/${c.id}/items/${it.id}`); toast('تم الحذف'); load(); });
        });
      });
    };
    const iconHint = '<div class="hintx">اسم الأيقونة من <a href="https://lucide.dev/icons" target="_blank" rel="noopener" style="color:var(--gold-d);text-decoration:underline">lucide.dev/icons</a> مثل: home, file-text, truck</div>';
    function catForm(c) {
      const m = modal({
        title: c ? 'تعديل التصنيف' : 'تصنيف جديد',
        body: `<div class="grid g2">
          <div><label class="lbl">القسم</label><select class="select" id="cSec">${Object.entries(SECTIONS).map(([k, v]) => `<option value="${k}"${(c ? c.section : sec || 'taqib') === k ? ' selected' : ''}>${v}</option>`).join('')}</select></div>
          <div><label class="lbl">الأيقونة</label><input class="input" id="cIcon" dir="ltr" value="${esc(c ? c.icon : 'layout-grid')}"></div>
          <div><label class="lbl">الاسم (عربي)</label><input class="input" id="cAr" value="${esc(c ? c.title.ar : '')}"></div>
          <div><label class="lbl">الاسم (إنجليزي)</label><input class="input" id="cEn" dir="ltr" value="${esc(c ? c.title.en : '')}"></div>
          <div><label class="lbl">وصف قصير (عربي)</label><input class="input" id="dAr" value="${esc(c ? c.desc.ar : '')}"></div>
          <div><label class="lbl">وصف قصير (إنجليزي)</label><input class="input" id="dEn" dir="ltr" value="${esc(c ? c.desc.en : '')}"></div>
          <div class="full"><label class="lbl">صورة البطاقة</label><select class="select" id="cImg">${imgsList.map((f) => `<option${(c ? c.img : 'docs-work.jpg') === f ? ' selected' : ''}>${esc(f)}</option>`).join('')}</select></div>
          <div class="full"><label class="row"><span class="switch"><input type="checkbox" id="cAct"${!c || c.active ? ' checked' : ''}><i></i></span> ظاهر في الموقع</label></div>
          <div class="full">${iconHint}</div></div>`,
        footer: '<button class="btn ghost" data-x>إلغاء</button><button class="btn gold" id="ok">حفظ</button>'
      });
      $(m.el, '#ok').addEventListener('click', async () => {
        const body = { section: $(m.el, '#cSec').value, icon: $(m.el, '#cIcon').value, title: { ar: $(m.el, '#cAr').value, en: $(m.el, '#cEn').value }, desc: { ar: $(m.el, '#dAr').value, en: $(m.el, '#dEn').value }, img: $(m.el, '#cImg').value, active: $(m.el, '#cAct').checked };
        if (!body.title.ar.trim()) { toast('اكتب اسم التصنيف', 'bad'); return; }
        if (c) await api('PATCH', '/categories/' + c.id, body); else { const nc = await api('POST', '/categories', body); open.add(nc.id); }
        toast('تم الحفظ'); m.close(); load();
      });
    }
    function itemForm(c, it) {
      const m = modal({
        title: it ? 'تعديل الخدمة' : `خدمة جديدة في «${esc(c.title.ar)}»`,
        body: `<div class="grid g2">
          <div><label class="lbl">اسم الخدمة (عربي)</label><input class="input" id="iAr" value="${esc(it ? it.title.ar : '')}"></div>
          <div><label class="lbl">اسم الخدمة (إنجليزي)</label><input class="input" id="iEn" dir="ltr" value="${esc(it ? it.title.en : '')}"></div>
          <div class="full"><label class="lbl">الوصف (عربي)</label><textarea class="textarea" id="dAr" style="min-height:70px">${esc(it ? it.desc.ar : '')}</textarea></div>
          <div class="full"><label class="lbl">الوصف (إنجليزي)</label><textarea class="textarea" id="dEn" dir="ltr" style="min-height:70px">${esc(it ? it.desc.en : '')}</textarea></div>
          <div><label class="lbl">الأيقونة</label><input class="input" id="iIcon" dir="ltr" value="${esc(it ? it.icon : 'file-text')}"></div>
          <div><label class="lbl">التصنيف</label><select class="select" id="iCat">${cats.map((x) => `<option value="${esc(x.id)}"${x.id === c.id ? ' selected' : ''}>${esc(x.title.ar)}</option>`).join('')}</select></div>
          <div><label class="row"><span class="switch"><input type="checkbox" id="iAct"${!it || it.active ? ' checked' : ''}><i></i></span> ظاهرة في الموقع</label></div>
          <div><label class="row"><span class="switch"><input type="checkbox" id="iAppt"${!it || it.appointment ? ' checked' : ''}><i></i></span> خيار «احجز موعد»</label></div>
          <div class="full">${iconHint}</div></div>`,
        footer: '<button class="btn ghost" data-x>إلغاء</button><button class="btn gold" id="ok">حفظ</button>'
      });
      $(m.el, '#ok').addEventListener('click', async () => {
        const ar = $(m.el, '#iAr').value.trim();
        if (!ar) { toast('اكتب اسم الخدمة', 'bad'); return; }
        const en = $(m.el, '#iEn').value.trim() || ar;
        const body = { title: { ar, en }, desc: { ar: $(m.el, '#dAr').value, en: $(m.el, '#dEn').value || $(m.el, '#dAr').value }, icon: $(m.el, '#iIcon').value, active: $(m.el, '#iAct').checked, appointment: $(m.el, '#iAppt').checked };
        if (it) { body.categoryId = $(m.el, '#iCat').value; await api('PATCH', `/categories/${c.id}/items/${it.id}`, body); }
        else await api('POST', `/categories/${$(m.el, '#iCat').value}/items`, body);
        toast('تم الحفظ'); m.close(); load();
      });
    }
    await load();
  }

  /* =========================================================
     Blog
     ========================================================= */
  async function pBlog(el, arg) {
    if (arg) return blogEditor(el, arg);
    const { items } = await api('GET', '/posts');
    el.innerHTML = `<div class="toolbar"><span class="sp" style="flex:1"></span><a class="btn gold" href="#blog/new">${ic('plus')} مقال جديد</a></div>
      ${items.length ? `<div class="tbl-wrap"><table><thead><tr><th>المقال</th><th>التصنيف</th><th>الحالة</th><th>التاريخ</th><th></th></tr></thead><tbody>
      ${items.map((p) => `<tr class="click" data-p="${p.id}"><td><b>${esc(p.title.ar)}</b><span class="sub" dir="ltr">/blog/${esc(p.slug)}</span></td><td>${esc(p.category || '—')}</td><td>${tag(p.status, p.status === 'published' ? 'منشور' : 'مسودة')}</td><td>${dt(p.updatedAt)}</td>
      <td style="white-space:nowrap">${p.status === 'published' ? `<a class="btn ghost sm" href="/blog/${encodeURIComponent(p.slug)}" target="_blank">${ic('external-link')} عرض</a>` : ''}</td></tr>`).join('')}</tbody></table></div>` : `<div class="empty">${ic('newspaper')}لا توجد مقالات بعد — اكتب أول مقال يجذب عملاءك من جوجل</div>`}`;
    draw();
    $$(el, '[data-p]').forEach((r) => r.addEventListener('click', (e) => { if (!e.target.closest('a')) location.hash = '#blog/' + r.dataset.p; }));
  }

  async function blogEditor(el, arg) {
    const isNew = arg === 'new';
    const imgsList = (await api('GET', '/images')).images;
    let p = { title: { ar: '', en: '' }, excerpt: { ar: '', en: '' }, body: { ar: '', en: '' }, cover: '', category: '', tags: [], status: 'draft', seoTitle: '', seoDesc: '', slug: '' };
    if (!isNew) { const { items } = await api('GET', '/posts'); p = items.find((x) => x.id === +arg); if (!p) { location.hash = '#blog'; return; } }
    el.innerHTML = `
      <div class="toolbar"><a class="btn ghost" href="#blog">${ic('arrow-right')} المقالات</a><span class="sp" style="flex:1"></span>
        ${!isNew && p.status === 'published' ? `<a class="btn ghost" target="_blank" href="/blog/${encodeURIComponent(p.slug)}">${ic('external-link')} عرض</a>` : ''}
        ${!isNew ? `<button class="btn ghost" id="del" style="color:var(--bad)">${ic('trash-2')} حذف</button>` : ''}
        <button class="btn ghost" id="saveD">${ic('save')} حفظ كمسودة</button><button class="btn gold" id="saveP">${ic('send')} ${p.status === 'published' ? 'تحديث المنشور' : 'نشر'}</button></div>
      <div class="grid" style="grid-template-columns: minmax(0,1fr) 320px; align-items: start" id="bgrid">
        <div class="grid">
          <div class="card grid"><div><label class="lbl">عنوان المقال</label><input class="input" id="tAr" value="${esc(p.title.ar)}" style="font-size:1.15rem;font-weight:700"></div>
            <div><label class="lbl">ملخص قصير (يظهر في القائمة وجوجل)</label><textarea class="textarea" id="exAr" style="min-height:64px">${esc(p.excerpt.ar)}</textarea></div></div>
          <div class="card"><div class="row" style="margin-bottom:8px"><b>المحتوى</b><span class="sp"></span><div class="tabs" style="margin:0"><button class="active" data-pv="edit">كتابة</button><button data-pv="view">معاينة</button></div></div>
            <div class="md-bar">${[['h', '## عنوان', 'عنوان'], ['b', '**نص**', 'B'], ['i', '*نص*', 'I'], ['ul', '- عنصر', 'قائمة'], ['ol', '1. عنصر', 'ترقيم'], ['q', '> اقتباس', 'اقتباس'], ['a', '[نص الرابط](https://)', 'رابط'], ['img', '![وصف](رابط-الصورة)', 'صورة']].map(([k, ins, l]) => `<button type="button" data-ins="${esc(ins)}">${l}</button>`).join('')}<button type="button" id="upImg">${ic('image-plus')} رفع صورة</button><input type="file" id="upFile" accept="image/*" hidden></div>
            <textarea class="textarea" id="bAr" style="min-height:380px;font-family:inherit;line-height:1.9">${esc(p.body.ar)}</textarea>
            <div class="preview" id="pv" hidden></div></div>
          <details class="card"><summary style="cursor:pointer;font-weight:800;font-family:var(--font-h)">النسخة الإنجليزية (اختياري)</summary><div class="grid" style="margin-top:12px">
            <div><label class="lbl">Title</label><input class="input" id="tEn" dir="ltr" value="${esc(p.title.en === p.title.ar ? '' : p.title.en)}"></div>
            <div><label class="lbl">Excerpt</label><textarea class="textarea" id="exEn" dir="ltr" style="min-height:60px">${esc(p.excerpt.en === p.excerpt.ar ? '' : p.excerpt.en)}</textarea></div>
            <div><label class="lbl">Body</label><textarea class="textarea" id="bEn" dir="ltr" style="min-height:240px">${esc(p.body.en)}</textarea></div></div></details>
        </div>
        <div class="grid">
          <div class="card grid"><h3>${ic('image')} الصورة الرئيسية</h3>
            <div id="coverBox"></div>
            <select class="select" id="coverSel"><option value="">— بدون —</option>${imgsList.map((f) => `<option value="assets/img/${esc(f)}"${p.cover === 'assets/img/' + f ? ' selected' : ''}>${esc(f)}</option>`).join('')}${p.cover && p.cover.startsWith('/uploads/') ? `<option value="${esc(p.cover)}" selected>صورة مرفوعة</option>` : ''}</select>
            <button class="btn ghost sm" id="upCover">${ic('upload')} رفع صورة</button><input type="file" id="coverFile" accept="image/*" hidden></div>
          <div class="card grid"><h3>${ic('tags')} التصنيف</h3><input class="input" id="cat" placeholder="مثال: العقار" value="${esc(p.category)}"><input class="input" id="tags" placeholder="وسوم مفصولة بفاصلة" value="${esc((p.tags || []).join('، '))}"></div>
          <div class="card grid"><h3>${ic('search')} تحسين محركات البحث</h3>
            <div><label class="lbl">الرابط (slug)</label><input class="input" id="slug" dir="ltr" value="${esc(p.slug)}" placeholder="يُولَّد من العنوان"></div>
            <div><label class="lbl">عنوان جوجل <small class="muted" id="c1"></small></label><input class="input" id="seoT" maxlength="70" value="${esc(p.seoTitle)}"></div>
            <div><label class="lbl">وصف جوجل <small class="muted" id="c2"></small></label><textarea class="textarea" id="seoD" maxlength="170" style="min-height:70px">${esc(p.seoDesc)}</textarea></div></div>
        </div></div>`;
    draw();
    const grid = $(el, '#bgrid'); const mq = window.matchMedia('(max-width: 1000px)'); const fit = () => { grid.style.gridTemplateColumns = mq.matches ? '1fr' : 'minmax(0,1fr) 320px'; }; fit();
    const body = $(el, '#bAr'); const pv = $(el, '#pv');
    const coverShow = () => { const v = $(el, '#coverSel').value; $(el, '#coverBox').innerHTML = v ? `<img class="cover-prev" src="${esc(v.startsWith('/') ? v : '/' + v)}" alt="">` : ''; };
    coverShow(); $(el, '#coverSel').addEventListener('change', coverShow);
    $(el, '#upCover').addEventListener('click', () => $(el, '#coverFile').click());
    const upload = async (file) => { const r = await A.uploadBlob(await (async () => { const bm = await createImageBitmap(file); const k = Math.min(1, 1600 / Math.max(bm.width, bm.height)); const c = document.createElement('canvas'); c.width = Math.round(bm.width * k); c.height = Math.round(bm.height * k); c.getContext('2d').drawImage(bm, 0, 0, c.width, c.height); return new Promise((res) => c.toBlob(res, 'image/jpeg', 0.85)); })(), 'blog'); return r.url; };
    $(el, '#coverFile').addEventListener('change', async (e) => { try { const u = await upload(e.target.files[0]); const o = document.createElement('option'); o.value = u; o.textContent = 'صورة مرفوعة'; $(el, '#coverSel').appendChild(o); $(el, '#coverSel').value = u; coverShow(); } catch (ex) { toast(ex.message, 'bad'); } });
    $(el, '#upImg').addEventListener('click', () => $(el, '#upFile').click());
    $(el, '#upFile').addEventListener('change', async (e) => { try { const u = await upload(e.target.files[0]); insertAt(`\n![وصف الصورة](${u})\n`); } catch (ex) { toast(ex.message, 'bad'); } e.target.value = ''; });
    const insertAt = (text) => { const s = body.selectionStart, e = body.selectionEnd; const sel = body.value.slice(s, e); body.setRangeText(sel && text.includes('نص') ? text.replace('نص', sel) : text, s, e, 'end'); body.focus(); };
    $$(el, '[data-ins]').forEach((b) => b.addEventListener('click', () => insertAt('\n' + b.dataset.ins + '\n')));
    $$(el, '[data-pv]').forEach((b) => b.addEventListener('click', async () => {
      $$(el, '[data-pv]').forEach((x) => x.classList.toggle('active', x === b));
      const view = b.dataset.pv === 'view'; pv.hidden = !view; body.hidden = view; $(el, '.md-bar').hidden = view;
      if (view) { const r = await api('POST', '/preview', { md: body.value }); pv.innerHTML = r.html || '<p class="muted">لا يوجد محتوى</p>'; }
    }));
    const cnt = () => { $(el, '#c1').textContent = `${$(el, '#seoT').value.length}/70`; $(el, '#c2').textContent = `${$(el, '#seoD').value.length}/170`; }; cnt();
    $(el, '#seoT').addEventListener('input', cnt); $(el, '#seoD').addEventListener('input', cnt);
    const save = async (status) => {
      const ar = $(el, '#tAr').value.trim(); if (!ar) { toast('اكتب عنوان المقال', 'bad'); return; }
      const data = {
        title: { ar, en: $(el, '#tEn').value.trim() || ar }, excerpt: { ar: $(el, '#exAr').value, en: $(el, '#exEn').value || $(el, '#exAr').value },
        body: { ar: $(el, '#bAr').value, en: $(el, '#bEn').value }, cover: $(el, '#coverSel').value, category: $(el, '#cat').value, tags: $(el, '#tags').value,
        seoTitle: $(el, '#seoT').value, seoDesc: $(el, '#seoD').value, slug: $(el, '#slug').value, status
      };
      const r = isNew ? await api('POST', '/posts', data) : await api('PATCH', '/posts/' + p.id, data);
      toast(status === 'published' ? 'تم النشر' : 'تم حفظ المسودة');
      if (isNew) location.hash = '#blog/' + r.id; else render();
    };
    $(el, '#saveD').addEventListener('click', () => save('draft'));
    $(el, '#saveP').addEventListener('click', () => save('published'));
    const del = $(el, '#del'); if (del) del.addEventListener('click', async () => { if (!confirm('حذف المقال نهائياً؟')) return; await api('DELETE', '/posts/' + p.id); toast('تم الحذف'); location.hash = '#blog'; });
  }

  /* =========================================================
     Settings
     ========================================================= */
  async function pSettings(el) {
    const s = await api('GET', '/settings');
    const dayNames = [[6, 'السبت'], [0, 'الأحد'], [1, 'الإثنين'], [2, 'الثلاثاء'], [3, 'الأربعاء'], [4, 'الخميس'], [5, 'الجمعة']];
    el.innerHTML = `<div class="grid g2" style="align-items:start">
      <div class="card grid"><h3>${ic('phone')} بيانات التواصل (تظهر في كل صفحات الموقع)</h3>
        <div class="grid g2"><div><label class="lbl">رقم الجوال (دولي)</label><input class="input" id="sPhone" dir="ltr" value="${esc(s.site.phone)}"></div>
        <div><label class="lbl">الرقم المعروض</label><input class="input" id="sPhoneD" dir="ltr" value="${esc(s.site.phoneDisplay)}"></div>
        <div><label class="lbl">رقم واتساب (بدون +)</label><input class="input" id="sWa" dir="ltr" value="${esc(s.site.whatsapp)}"></div>
        <div><label class="lbl">البريد الإلكتروني</label><input class="input" id="sMail" dir="ltr" value="${esc(s.site.email)}"></div>
        <div><label class="lbl">العنوان (عربي)</label><input class="input" id="sAdAr" value="${esc(s.site.address.ar)}"></div>
        <div><label class="lbl">العنوان (إنجليزي)</label><input class="input" id="sAdEn" dir="ltr" value="${esc(s.site.address.en)}"></div>
        <div><label class="lbl">ساعات العمل (عربي)</label><input class="input" id="sHrAr" value="${esc(s.site.hours.ar)}"></div>
        <div><label class="lbl">ساعات العمل (إنجليزي)</label><input class="input" id="sHrEn" dir="ltr" value="${esc(s.site.hours.en)}"></div></div>
        <div><button class="btn gold" data-save="site">${ic('save')} حفظ</button></div></div>

      <div class="card grid"><h3>${ic('calendar-check')} حجز المواعيد</h3>
        <label class="row"><span class="switch"><input type="checkbox" id="aOn"${s.appointments.enabled ? ' checked' : ''}><i></i></span> تفعيل حجز المواعيد في الموقع</label>
        <div><label class="lbl">أيام العمل</label><div class="days-pick">${dayNames.map(([d, n]) => `<label><input type="checkbox" value="${d}"${s.appointments.days.includes(d) ? ' checked' : ''}><span>${n}</span></label>`).join('')}</div></div>
        <div class="grid g2"><div><label class="lbl">بداية الدوام</label><input class="input" type="time" id="aOpen" value="${esc(s.appointments.open)}"></div><div><label class="lbl">نهاية الدوام</label><input class="input" type="time" id="aClose" value="${esc(s.appointments.close)}"></div>
        <div><label class="lbl">مدة الموعد (دقيقة)</label><select class="select" id="aLen">${[15, 20, 30, 45, 60, 90, 120].map((n) => `<option${s.appointments.slotMinutes === n ? ' selected' : ''}>${n}</option>`).join('')}</select></div>
        <div><label class="lbl">عدد المواعيد المتزامنة</label><input class="input" type="number" min="1" max="50" id="aCap" value="${s.appointments.capacity}"></div>
        <div><label class="lbl">أقصى مدة للحجز المسبق (يوم)</label><input class="input" type="number" min="1" max="180" id="aAhead" value="${s.appointments.maxDaysAhead}"></div></div>
        <div><button class="btn gold" data-save="appointments">${ic('save')} حفظ</button></div></div>

      <div class="card grid"><h3>${ic('megaphone')} الإعلانات العقارية</h3>
        <label class="row"><span class="switch"><input type="checkbox" id="lAuto"${s.listings.autoPublish ? ' checked' : ''}><i></i></span> نشر الإعلانات مباشرة دون مراجعة</label>
        <label class="row"><span class="switch"><input type="checkbox" id="lLic"${s.listings.requireAdLicense ? ' checked' : ''}><i></i></span> اشتراط رقم ترخيص الإعلان</label>
        <div class="grid g2"><div><label class="lbl">أقصى عدد صور للإعلان</label><input class="input" type="number" min="1" max="20" id="lImg" value="${s.listings.maxImages}"></div>
        <div><label class="lbl">مدة ظهور الإعلان (يوم، 0 = بلا حد)</label><input class="input" type="number" min="0" max="730" id="lExp" value="${s.listings.expireDays}"></div></div>
        <div><button class="btn gold" data-save="listings">${ic('save')} حفظ</button></div></div>

      <div class="card grid"><h3>${ic('bell')} إشعارات الطلبات الجديدة</h3>
        <p class="hintx" style="margin:0">أي رابط Webhook (Zapier / Make / n8n / بوت تيليجرام) يستقبل بيانات كل طلب أو إعلان أو وثيقة جديدة فور وصولها. اتركه فارغاً لإيقافه.</p>
        <div><label class="lbl">رابط Webhook</label><input class="input" id="nHook" dir="ltr" value="${esc(s.notify.webhookUrl)}" placeholder="https://…"></div>
        <div><button class="btn gold" data-save="notify">${ic('save')} حفظ</button></div></div></div>`;
    draw();
    const collect = {
      site: () => ({ site: { phone: $(el, '#sPhone').value, phoneDisplay: $(el, '#sPhoneD').value, whatsapp: $(el, '#sWa').value, email: $(el, '#sMail').value, address: { ar: $(el, '#sAdAr').value, en: $(el, '#sAdEn').value }, hours: { ar: $(el, '#sHrAr').value, en: $(el, '#sHrEn').value } } }),
      appointments: () => ({ appointments: { enabled: $(el, '#aOn').checked, days: $$(el, '.days-pick input:checked').map((i) => +i.value), open: $(el, '#aOpen').value, close: $(el, '#aClose').value, slotMinutes: $(el, '#aLen').value, capacity: $(el, '#aCap').value, maxDaysAhead: $(el, '#aAhead').value } }),
      listings: () => ({ listings: { autoPublish: $(el, '#lAuto').checked, requireAdLicense: $(el, '#lLic').checked, maxImages: $(el, '#lImg').value, expireDays: $(el, '#lExp').value } }),
      notify: () => ({ notify: { webhookUrl: $(el, '#nHook').value } })
    };
    $$(el, '[data-save]').forEach((b) => b.addEventListener('click', async () => { await api('PUT', '/settings', collect[b.dataset.save]()); toast('تم حفظ الإعدادات'); }));
  }

  /* ---------------- live notifications ---------------- */
  let last = null; let timer = null;
  function beep() { try { const c = new (window.AudioContext || window.webkitAudioContext)(); const o = c.createOscillator(); const g = c.createGain(); o.connect(g); g.connect(c.destination); o.frequency.value = 880; g.gain.value = 0.06; o.start(); o.stop(c.currentTime + 0.18); } catch (e) { /* ignore */ } }
  function poll() {
    clearInterval(timer);
    timer = setInterval(async () => {
      if (document.hidden) return;
      try {
        const s = await A.call('GET', '/admin/stats');
        setBadges(s);
        if (last && (s.requests.new > last.req || s.listings.pending > last.lst)) {
          toast(s.requests.new > last.req ? 'وصل طلب جديد' : 'إعلان جديد بانتظار المراجعة'); beep();
          if (route.name === 'requests' && window._reloadRequests) window._reloadRequests();
        }
        last = { req: s.requests.new, lst: s.listings.pending };
      } catch (e) { /* ignore */ }
    }, 30000);
  }

  async function start(user) {
    me = user;
    shell();
    const s = await A.call('GET', '/admin/stats').catch(() => null);
    if (s) { setBadges(s); last = { req: s.requests.new, lst: s.listings.pending }; }
    window.addEventListener('hashchange', render);
    render();
    poll();
    if (me.mustChangePassword) toast('غيّر كلمة المرور المؤقتة من صفحة حسابك: account.html#profile', 'bad');
  }

  (async function init() {
    await A.boot(['me']);
    if (!A.online) { app.innerHTML = '<div class="boot-msg">تعذّر الاتصال بالخادم</div>'; return; }
    if (!A.user) return loginScreen();
    if (A.user.role === 'user') return loginScreen('هذا الحساب ليس لديه صلاحية دخول اللوحة');
    start(A.user);
  })();
})();
