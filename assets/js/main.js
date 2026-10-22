/* =========================================================
   مركز الخدمات المتكاملة — main script
   - Bilingual (AR/EN) with RTL/LTR switching
   - Shared header / footer / floating buttons
   - Services catalog rendering, search & request modal
   - Scroll animations and micro-interactions
   ========================================================= */
(function () {
  'use strict';

  const S = window.SITE;
  const C = window.CATALOG;
  const A = window.ISC_API || { online: false, user: null, boot: async () => ({}) };
  const LANG_KEY = 'isc-lang';
  const page = document.body.dataset.page || 'home';
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Language ---------------- */
  let lang = 'ar';
  try { lang = localStorage.getItem(LANG_KEY) || 'ar'; } catch (e) { /* storage blocked */ }
  if (lang !== 'ar' && lang !== 'en') lang = 'ar';

  const t = (o) => (o && typeof o === 'object') ? (o[lang] || o.ar) : o;
  const T = (ar, en) => (lang === 'en' ? en : ar);
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const icon = (name, cls = '') => `<i data-lucide="${name}"${cls ? ` class="${cls}"` : ''}></i>`;
  const arrow = () => icon('arrow-left', 'i-dir flip-ltr');
  const drawIcons = () => window.lucide && window.lucide.createIcons({ attrs: { 'stroke-width': 1.8 } });

  const WA_SVG = '<svg class="wa-logo" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>';

  const waLink = (text) => `https://wa.me/${S.whatsapp}${text ? `?text=${encodeURIComponent(text)}` : ''}`;
  const telLink = () => `tel:${S.phone}`;

  const countServices = (key) => C[key].categories.reduce((n, c) => n + c.items.length, 0);
  const totalServices = () => Object.keys(C).reduce((n, k) => n + countServices(k), 0);

  /* ---------------- Navigation model ---------------- */
  const M = window.MARKET || null;
  const NAV = [
    { id: 'home', href: 'index.html', ar: 'الرئيسية', en: 'Home', icon: 'home' },
    {
      id: 'realestate', href: 'real-estate.html', ar: 'العقار', en: 'Real Estate', icon: 'building-2',
      children: [
        { id: 're-rent', href: 'real-estate.html#deal-rent', ar: 'الإيجار', en: 'For Rent', icon: 'key-round', dar: 'فلل، شقق، مجمعات، أدوار، محلات', den: 'Villas, apartments, compounds, floors, shops' },
        { id: 're-sale', href: 'real-estate.html#deal-sale', ar: 'البيع', en: 'For Sale', icon: 'badge-dollar-sign', dar: 'فلل، شقق، أراضٍ، عمائر، مجمعات', den: 'Villas, apartments, land, buildings, complexes' },
        { id: 're-invest', href: 'real-estate.html#deal-invest', ar: 'الاستثمار', en: 'Investment', icon: 'trending-up', dar: 'فرص مدرّة للدخل وشراكات', den: 'Income properties & partnerships' },
        { id: 'market', href: 'market.html', ar: 'سوق العقار (عرض وطلب)', en: 'Property Market', icon: 'megaphone', dar: 'اعرض عقارك أو اطلب ما تبحث عنه', den: 'List your property or post what you need' }
      ]
    },
    { id: 'general', href: 'general-services.html', ar: 'الخدمات العامة', en: 'General Services', icon: 'layout-grid' },
    { id: 'students', href: 'students.html', ar: 'الخدمات الطلابية', en: 'Student Services', icon: 'graduation-cap' },
    { id: 'blog', href: 'blog', ar: 'المدونة', en: 'Blog', icon: 'newspaper' },
    { id: 'about', href: 'about.html', ar: 'من نحن', en: 'About Us', icon: 'info' },
    { id: 'contact', href: 'contact.html', ar: 'تواصل معنا', en: 'Contact Us', icon: 'phone' }
  ];
  const isActive = (item) => item.id === page || (item.children || []).some((c) => c.id === page);

  /* ---------------- Header ---------------- */
  const isStaffUser = () => !!(A.user && (A.user.role === 'admin' || A.user.role === 'staff'));
  function accountButtons() {
    if (!A.online) return '';
    if (A.user) {
      return `${isStaffUser() ? `<a class="btn btn-outline btn-sm acct-btn hide-sm" href="admin.html" title="${T('لوحة التحكم', 'Dashboard')}">${icon('layout-dashboard')}</a>` : ''}
        <a class="btn btn-outline btn-sm acct-btn" href="account.html">${icon('user-round')} <span class="acct-name">${esc(A.user.name.split(' ')[0])}</span></a>`;
    }
    return `<a class="btn btn-outline btn-sm acct-btn" href="login.html">${icon('log-in')} <span>${T('دخول', 'Login')}</span></a>`;
  }
  function drawerAccount() {
    if (!A.online) return '';
    if (A.user) return `<a class="btn btn-outline btn-block" href="account.html">${icon('user-round')} ${T('حسابي', 'My account')}</a>${isStaffUser() ? `<a class="btn btn-outline btn-block" href="admin.html">${icon('layout-dashboard')} ${T('لوحة التحكم', 'Dashboard')}</a>` : ''}`;
    return `<a class="btn btn-outline btn-block" href="login.html">${icon('log-in')} ${T('تسجيل الدخول / إنشاء حساب', 'Login / Sign up')}</a>`;
  }
  function renderHeader() {
    const el = document.getElementById('site-header');
    if (!el) return;
    const navItems = NAV.map((item) => {
      if (item.children) {
        return `<li class="has-dd">
          <a class="nav-link ${isActive(item) ? 'active' : ''}" href="${item.href}">${T(item.ar, item.en)} ${icon('chevron-down', 'chev')}</a>
          <div class="dropdown">
            ${item.children.map((c) => `
              <a class="dd-item" href="${c.href}">
                <span class="ico">${icon(c.icon)}</span>
                <span><strong>${T(c.ar, c.en)}</strong><small>${T(c.dar, c.den)}</small></span>
              </a>`).join('')}
          </div>
        </li>`;
      }
      return `<li><a class="nav-link ${isActive(item) ? 'active' : ''}" href="${item.href}">${T(item.ar, item.en)}</a></li>`;
    }).join('');

    const drawerLinks = NAV.map((item) => {
      const main = `<a href="${item.href}" class="${isActive(item) && !item.children ? 'active' : ''}${item.id === page ? ' active' : ''}">${icon(item.icon)} ${T(item.ar, item.en)}</a>`;
      const subs = (item.children || []).map((c) => `<a class="sub ${c.id === page ? 'active' : ''}" href="${c.href}">${T(c.ar, c.en)}</a>`).join('');
      return main + subs;
    }).join('');

    el.innerHTML = `
      <div class="topbar">
        <div class="container">
          <div class="topbar-info">
            <a href="${telLink()}">${icon('phone')} <span dir="ltr">${S.phoneDisplay}</span></a>
            <a href="mailto:${S.email}" class="hide-sm">${icon('mail')} ${S.email}</a>
            <span class="hide-sm">${icon('clock')} ${t(S.hours)}</span>
          </div>
          <div class="topbar-side">
            <div class="socials">
              <a href="#" aria-label="X">${icon('twitter')}</a>
              <a href="#" aria-label="Instagram">${icon('instagram')}</a>
              <a href="#" aria-label="LinkedIn">${icon('linkedin')}</a>
            </div>
          </div>
        </div>
      </div>
      <header class="header" id="header">
        <div class="container">
          <a href="index.html" class="brand" aria-label="${t(S.name)}">
            <img class="symbol" src="assets/brand/symbol.png" alt="" width="50" height="50">
            <span class="brand-text"><strong>${t(S.name)}</strong><small>${t(S.tagline)}</small></span>
          </a>
          <nav class="nav" aria-label="${T('القائمة الرئيسية', 'Main navigation')}"><ul>${navItems}</ul></nav>
          <div class="header-actions">
            <button class="lang-btn" type="button" data-lang-toggle aria-label="${T('Switch to English', 'التبديل إلى العربية')}">${icon('languages')} <span>${T('EN', 'ع')}</span></button>
            ${accountButtons()}
            <a class="btn btn-gold" href="contact.html#request">${T('اطلب خدمة', 'Request a Service')} ${arrow()}</a>
            <button class="burger" type="button" aria-label="${T('فتح القائمة', 'Open menu')}" data-drawer-open>${icon('menu')}</button>
          </div>
        </div>
      </header>
      <div class="drawer-backdrop" data-drawer-close></div>
      <aside class="drawer" aria-label="${T('القائمة', 'Menu')}">
        <div class="drawer-head">
          <img src="assets/brand/logo_main.png" alt="${t(S.name)}">
          <button class="drawer-close" type="button" data-drawer-close aria-label="${T('إغلاق', 'Close')}">${icon('x')}</button>
        </div>
        <nav>${drawerLinks}</nav>
        <div class="drawer-foot">
          ${drawerAccount()}
          <a class="btn btn-gold btn-block" href="contact.html#request">${T('اطلب خدمة', 'Request a Service')}</a>
          <button class="btn btn-outline btn-block" type="button" data-lang-toggle>${icon('languages')} ${T('English', 'العربية')}</button>
        </div>
      </aside>`;
  }

  /* ---------------- Footer ---------------- */
  function renderFooter() {
    const el = document.getElementById('site-footer');
    if (!el) return;
    const reLinks = NAV[1].children.map((c) => `<li><a href="${c.href}">${T(c.ar, c.en)}</a></li>`).join('') +
      `<li><a href="real-estate.html#services">${T('خدمات عقارية مساندة', 'Supporting services')}</a></li>`;
    const year = new Date().getFullYear();
    el.innerHTML = `
      <footer class="footer">
        <div class="container">
          <div class="footer-grid">
            <div class="footer-about">
              <img src="assets/brand/logo_main_white.png" alt="${t(S.name)}" width="167" height="120">
              <p>${T('مركز واحد يجمع لك الخدمات العقارية وخدمات التعقيب والخدمات الطلابية في المملكة العربية السعودية — بوضوح وسرعة ومتابعة حتى اكتمال طلبك.',
                     'One center for real estate, government transaction and student services across Saudi Arabia — clear, fast, and followed through until your request is complete.')}</p>
              <div class="socials">
                <a href="#" aria-label="X">${icon('twitter')}</a>
                <a href="#" aria-label="Instagram">${icon('instagram')}</a>
                <a href="#" aria-label="LinkedIn">${icon('linkedin')}</a>
                <a href="#" aria-label="YouTube">${icon('youtube')}</a>
                <a href="${waLink()}" target="_blank" rel="noopener" aria-label="WhatsApp">${icon('message-circle')}</a>
              </div>
            </div>
            <div>
              <h4>${T('روابط سريعة', 'Quick Links')}</h4>
              <ul>
                ${NAV.map((n) => `<li><a href="${n.href}">${T(n.ar, n.en)}</a></li>`).join('')}
                <li><a href="contact.html#request">${T('اطلب خدمة', 'Request a Service')}</a></li>
              </ul>
            </div>
            <div>
              <h4>${T('الخدمات العقارية', 'Real Estate')}</h4>
              <ul>${reLinks}</ul>
            </div>
            <div>
              <h4>${T('الخدمات العامة والطلابية', 'General & Student')}</h4>
              <ul>
                <li><a href="general-services.html">${T('الخدمات العامة', 'General Services')}</a></li>
                <li><a href="general-services.html#jawazat">${T('الجوازات والإقامة', 'Passports & Residency')}</a></li>
                <li><a href="general-services.html#labor">${T('قوى ومساند', 'Qiwa & Musaned')}</a></li>
                <li><a href="students.html">${T('الخدمات الطلابية', 'Student Services')}</a></li>
                <li><a href="students.html#admission">${T('القبول الجامعي', 'University Admission')}</a></li>
                <li><a href="students.html#equiv">${T('معادلة الشهادات', 'Certificate Equivalency')}</a></li>
              </ul>
            </div>
            <div class="footer-contact">
              <h4>${T('تواصل معنا', 'Get in Touch')}</h4>
              <ul>
                <li>${icon('map-pin')} <span>${t(S.address)}</span></li>
                <li>${icon('phone')} <a class="ltr" href="${telLink()}">${S.phoneDisplay}</a></li>
                ${S.unified ? `<li>${icon('headset')} <span>${T('الرقم الموحد', 'Unified')}: <a class="ltr" href="tel:${S.unified}">${S.unified}</a></span></li>` : ''}
                <li>${WA_SVG.replace('class="wa-logo"', 'style="width:1em;height:1em;flex-shrink:0"')} <a class="ltr" href="${waLink()}" target="_blank" rel="noopener">${S.phoneDisplay}</a></li>
                <li>${icon('mail')} <a href="mailto:${S.email}">${S.email}</a></li>
                <li>${icon('clock')} <span>${t(S.hours)}</span></li>
              </ul>
            </div>
          </div>
          <div class="footer-bottom">
            <span>© ${year} ${t(S.name)} — ${T('جميع الحقوق محفوظة', 'All rights reserved')}</span>
            <span><a href="#">${T('سياسة الخصوصية', 'Privacy Policy')}</a> · <a href="#">${T('الشروط والأحكام', 'Terms & Conditions')}</a></span>
          </div>
        </div>
      </footer>`;
  }

  /* ---------------- Floating buttons, modal, toast ---------------- */
  function renderChrome() {
    let box = document.getElementById('site-chrome');
    if (!box) { box = document.createElement('div'); box.id = 'site-chrome'; document.body.appendChild(box); }
    box.innerHTML = `
      <div class="page-progress" id="progress"></div>
      <div class="fab-stack">
        <a class="fab wa" href="${waLink(T('مرحباً، أرغب في الاستفسار عن خدماتكم', 'Hello, I would like to ask about your services'))}" target="_blank" rel="noopener" aria-label="${T('تواصل عبر واتساب', 'Chat on WhatsApp')}">
          ${WA_SVG}<span class="tip">${T('تواصل عبر واتساب', 'Chat on WhatsApp')}</span>
        </a>
        <a class="fab call" href="${telLink()}" aria-label="${T('اتصل بنا', 'Call us')}">
          ${icon('phone-call')}<span class="tip">${T('اتصل بنا', 'Call us')}</span>
        </a>
      </div>
      <button class="to-top" id="toTop" type="button" aria-label="${T('العودة للأعلى', 'Back to top')}">${icon('arrow-up')}</button>
      <div class="toast" id="toast" role="status" aria-live="polite">${icon('circle-check')} <span></span></div>
      <div class="modal" id="svcModal" aria-hidden="true">
        <div class="modal-backdrop" data-modal-close></div>
        <div class="modal-box" role="dialog" aria-modal="true" aria-labelledby="mTitle"></div>
      </div>`;
  }

  function toast(msg) {
    const el = document.getElementById('toast');
    if (!el) return;
    el.querySelector('span').textContent = msg;
    el.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(() => el.classList.remove('show'), 3800);
  }

  const cityOptions = () => `<option value="">${T('اختر المدينة', 'Select city')}</option>` +
    S.cities.map(([ar, en]) => `<option value="${esc(T(ar, en))}">${T(ar, en)}</option>`).join('') +
    `<option value="${T('أخرى', 'Other')}">${T('مدينة أخرى', 'Other city')}</option>`;

  function validate(form) {
    let ok = true;
    form.querySelectorAll('[required]').forEach((inp) => {
      const field = inp.closest('.field');
      let valid = inp.value.trim() !== '';
      if (valid && inp.name === 'phone') {
        const digits = inp.value.replace(/[\s\-()]/g, '').replace(/^\+/, '');
        valid = /^(05\d{8}|9665\d{8}|5\d{8})$/.test(digits);
      }
      field.classList.toggle('invalid', !valid);
      if (!valid && ok) { inp.focus(); ok = false; }
    });
    return ok;
  }

  /* ---------------- Modal ---------------- */
  let lastFocus = null;
  function showModal(html, opts = {}) {
    const modal = document.getElementById('svcModal');
    const box = modal.querySelector('.modal-box');
    box.className = 'modal-box' + (opts.wide ? ' wide' : '');
    box.innerHTML = html;
    drawIcons();
    lastFocus = document.activeElement;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    box.scrollTop = 0;
    setTimeout(() => box.querySelector('#f-name')?.focus(), 350);
    return box;
  }

  function openService(catKey, catIdx, itemIdx) { window.ISC.forms.openService(catKey, catIdx, itemIdx); }
  function closeModal() {
    const modal = document.getElementById('svcModal');
    if (!modal || !modal.classList.contains('open')) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    lastFocus && lastFocus.focus && lastFocus.focus();
  }

  /* ---------------- Catalog ---------------- */
  const normalize = (s) => String(s).toLowerCase()
    .replace(/[ً-ْـ]/g, '')       // diacritics & tatweel
    .replace(/[أإآ]/g, 'ا').replace(/ة/g, 'ه').replace(/ى/g, 'ي').replace(/ؤ/g, 'و').replace(/ئ/g, 'ي');

  function renderCatalog() {
    const root = document.getElementById('catalog');
    if (!root) return;
    const key = root.dataset.catalog;
    const data = C[key];
    const cats = data.categories;

    const cards = cats.map((c, i) => `
      <button class="cat-card reveal" style="--d:${(i % 4) * 0.07}s" type="button" data-jump="${c.id}">
        <img src="assets/img/${c.img}" alt="" loading="lazy">
        <span class="ico">${icon(c.icon)}</span>
        <h3>${t(c.title)}</h3>
        <small>${c.items.length} ${T('خدمة', 'services')} ${arrow()}</small>
      </button>`).join('');

    const tabs = `<button class="tab active" type="button" data-tab="all">${icon('layout-grid')} ${T('الكل', 'All')} <span class="n">${countServices(key)}</span></button>` +
      cats.map((c) => `<button class="tab" type="button" data-tab="${c.id}">${icon(c.icon)} ${t(c.title)} <span class="n">${c.items.length}</span></button>`).join('');

    const sections = cats.map((c, ci) => `
      <section class="cat-section" id="${c.id}" data-cat="${c.id}">
        <div class="cat-head reveal">
          <span class="ico">${icon(c.icon)}</span>
          <div><h2>${t(c.title)}</h2><p>${t(c.desc)}</p></div>
          <span class="count">${c.items.length} ${T('خدمة', 'services')}</span>
        </div>
        <div class="svc-grid">
          ${c.items.map((it, ii) => `
            <button class="svc reveal" style="--d:${(ii % 3) * 0.06}s" type="button" data-svc="${ci}:${ii}"
              data-search="${esc(normalize(it[1] + ' ' + it[2] + ' ' + it[3] + ' ' + it[4] + ' ' + c.title.ar + ' ' + c.title.en))}">
              <span class="svc-top"><span class="ico">${icon(it[0])}</span><h3>${esc(T(it[1], it[2]))}</h3></span>
              <p>${esc(T(it[3], it[4]))}</p>
              <span class="more">${T('اطلب الخدمة', 'Request service')} ${icon('arrow-left', 'flip-ltr')}</span>
            </button>`).join('')}
        </div>
      </section>`).join('');

    const howto = `
      <ol class="howto reveal">
        <li><b>1</b> ${T('اختر التصنيف', 'Pick a category')}</li>
        <li><b>2</b> ${T('اضغط على الخدمة', 'Tap the service')}</li>
        <li><b>3</b> ${T('أرسل طلبك من الموقع', 'Send your request on the site')}</li>
      </ol>`;

    root.innerHTML = `
      <div class="container"><div class="cat-cards">${cards}</div>${howto}</div>
      <div class="catalog-bar" id="catalogBar">
        <div class="container">
          <div class="tabs" role="tablist">${tabs}</div>
          <label class="search">
            <span class="sr-only">${T('ابحث عن خدمة', 'Search services')}</span>
            ${icon('search')}
            <input type="search" id="svcSearch" placeholder="${T('ابحث عن خدمة… مثال: إقامة، سباكة، معادلة', 'Search… e.g. iqama, plumbing, equivalency')}">
          </label>
        </div>
      </div>
      <div class="container" id="catSections">${sections}
        <div class="no-results" id="noResults">
          <span class="ico">${icon('search-x')}</span>
          <h3>${T('لم نجد خدمة بهذا الاسم', 'No matching service found')}</h3>
          <p>${T('لا تقلق — غالباً نقدّمها! راسلنا وسنخدمك.', 'Don’t worry — we probably offer it! Message us and we’ll help.')}</p>
          <a class="btn btn-wa" href="contact.html#request">${T('أرسل لنا طلبك', 'Send us your request')}</a>
        </div>
      </div>`;

    // Picking a category (card or tab) shows only that category, so the list stays short
    const tabsEl = root.querySelector('.tabs');
    const input = root.querySelector('#svcSearch');
    let activeCat = 'all';
    const setActive = (id) => {
      tabsEl.querySelectorAll('.tab').forEach((x) => x.classList.toggle('active', x.dataset.tab === id));
      const a = tabsEl.querySelector(`.tab[data-tab="${id}"]`);
      if (a) {
        const l = a.offsetLeft - tabsEl.clientWidth / 2 + a.clientWidth / 2;
        tabsEl.scrollTo({ left: l, behavior: 'smooth' });
      }
    };
    const apply = () => {
      const q = normalize(input.value.trim());
      let anyVisible = false;
      root.querySelectorAll('.cat-section').forEach((sec) => {
        let n = 0;
        const inCat = q || activeCat === 'all' || sec.dataset.cat === activeCat;
        sec.querySelectorAll('.svc').forEach((card) => {
          const match = inCat && (!q || card.dataset.search.includes(q));
          card.style.display = match ? '' : 'none';
          if (match) { n++; card.classList.add('in'); }
        });
        sec.style.display = n ? '' : 'none';
        if (n) { anyVisible = true; sec.querySelector('.cat-head').classList.add('in'); }
      });
      root.querySelector('#noResults').classList.toggle('show', !anyVisible);
    };
    const pick = (id, scroll = true) => {
      activeCat = id;
      input.value = '';
      setActive(id);
      apply();
      if (scroll) document.getElementById('catalogBar').scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
    };
    root._pick = pick;

    root.querySelectorAll('[data-jump]').forEach((b) => b.addEventListener('click', () => pick(b.dataset.jump)));
    root.querySelectorAll('[data-tab]').forEach((b) => b.addEventListener('click', () => pick(b.dataset.tab)));
    // Service click → modal
    root.querySelectorAll('[data-svc]').forEach((b) => b.addEventListener('click', () => {
      const [ci, ii] = b.dataset.svc.split(':').map(Number);
      openService(key, ci, ii);
    }));
    // Search looks through every category
    input.addEventListener('input', () => {
      if (input.value.trim() && activeCat !== 'all') { activeCat = 'all'; setActive('all'); }
      apply();
    });
  }

  function jumpTo(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'start' });
  }

  /* ---------------- Real estate market (عرض وطلب) ---------------- */
  const KIND = { offer: { ar: 'عرض', en: 'Offer' }, request: { ar: 'مطلوب', en: 'Wanted' } };
  const deal = (id) => M.deals.find((d) => d.id === id);
  const typeName = (k, one) => { const ty = M.types[k]; return ty ? t(one ? ty.one : ty) : k; };
  const cityName = (ar) => { const c = S.cities.find((x) => x[0] === ar); return c ? T(c[0], c[1]) : ar; };
  const fmtNum = (n) => Number(n).toLocaleString(lang === 'ar' ? 'ar-SA-u-nu-latn' : 'en-US');
  const adsFor = (f) => M.listings.filter((a) => (!f.deal || a.deal === f.deal) && (!f.type || a.type === f.type) && (!f.kind || a.kind === f.kind));
  const marketUrl = (f) => {
    const p = new URLSearchParams();
    Object.entries(f).forEach(([k, v]) => { if (v) p.set(k, v); });
    const s = p.toString();
    return `market.html${s ? `?${s}` : ''}`;
  };

  function adPrice(a) {
    if (!a.price) return `<span class="ad-price muted">${T('السعر عند التواصل', 'Price on request')}</span>`;
    const per = a.per === 'month' ? T(' / شهرياً', ' / month') : a.per === 'year' ? T(' / سنوياً', ' / year') : '';
    const pre = a.kind === 'request' ? `<small>${T('الميزانية حتى', 'Budget up to')}</small>` : '';
    return `<span class="ad-price">${pre}<b>${fmtNum(a.price)}</b> ${T('ريال', 'SAR')}<small>${per}</small></span>`;
  }

  const imgSrc = (a) => (a.img ? (a.img.includes('/') ? a.img : `assets/img/${a.img}`) : '');
  const isVerified = (a) => !!(a.verified && (a.verified.ad || a.verified.cr || a.verified.fal));

  function adCard(a, i = 0) {
    const ty = M.types[a.type] || {};
    const where = `${cityName(a.city)}${a.district && t(a.district) ? ` — ${esc(t(a.district))}` : ''}`;
    const specs = [
      a.area ? `<span>${icon('ruler')} ${fmtNum(a.area)} ${T('م²', 'm²')}</span>` : '',
      a.rooms ? `<span>${icon('bed-double')} ${a.rooms} ${T('غرف', 'rooms')}</span>` : '',
      a.baths ? `<span>${icon('bath')} ${a.baths} ${T('دورات مياه', 'baths')}</span>` : ''
    ].join('');
    const date = a.date ? new Date(a.date).toLocaleDateString(lang === 'ar' ? 'ar-SA-u-nu-latn-ca-gregory' : 'en-GB', { day: 'numeric', month: 'short' }) : '';
    const src = imgSrc(a);
    return `
      <article class="ad ad-${a.kind} reveal" style="--d:${(i % 3) * 0.06}s" data-ad="${a.id}" tabindex="0" role="button" aria-label="${esc(t(a.title))}">
        <div class="ad-media">
          ${src ? `<img src="${esc(src)}" alt="" loading="lazy">` : `<span class="ad-ph">${icon(a.kind === 'request' ? 'search' : (ty.icon || 'home'))}</span>`}
          <span class="ad-kind">${icon(a.kind === 'request' ? 'search' : 'tag')} ${t(KIND[a.kind])}</span>
          <span class="ad-deal">${t(deal(a.deal) || {})}</span>
          ${a.featured ? `<span class="ad-feat">${icon('star')} ${T('مميز', 'Featured')}</span>` : ''}
          ${a.sample ? `<span class="ad-sample">${T('إعلان تجريبي', 'Sample ad')}</span>` : ''}
        </div>
        <div class="ad-body">
          <div class="ad-meta"><span>${icon(ty.icon || 'home')} ${typeName(a.type, true)}</span><span>#${a.id}${date ? ` · ${date}` : ''}</span></div>
          <h3><a href="property.html?id=${a.id}">${esc(t(a.title))}</a></h3>
          <div class="ad-loc">${icon('map-pin')} ${where}</div>
          ${specs ? `<div class="ad-specs">${specs}</div>` : ''}
          ${isVerified(a) || a.license ? `<div class="ad-trust">${isVerified(a) ? `<span class="badge-ok">${icon('badge-check')} ${T('معلن موثّق', 'Verified advertiser')}</span>` : ''}${a.license ? `<span class="badge-lic">${T('ترخيص', 'Licence')} ${esc(a.license)}</span>` : ''}</div>` : ''}
          <div class="ad-foot">
            ${adPrice(a)}
            <span class="ad-actions">
              <button class="ad-btn wa" type="button" data-ad-contact="${a.id}" aria-label="${T('أرسل استفساراً', 'Send an inquiry')}">${icon('message-square-text')}</button>
              <a class="ad-btn" href="${telLink()}" aria-label="${T('اتصل', 'Call')}">${icon('phone')}</a>
            </span>
          </div>
        </div>
      </article>`;
  }

  // Posting an offer / a detailed property request happens in forms.js (account required, saved on the site)
  function openPost(kind = 'offer', preset = {}) { if (M) window.ISC.forms.openPost(kind, preset); }

  // Ad cards → details + inquiry
  document.addEventListener('click', (e) => {
    const c = e.target.closest('[data-ad-contact]');
    if (c) { e.stopPropagation(); window.ISC.forms.openAd(+c.dataset.adContact, true); return; }
    if (e.target.closest('a')) return;
    const card = e.target.closest('.ad[data-ad]');
    if (card) window.ISC.forms.openAd(+card.dataset.ad);
  });
  document.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && e.target.matches && e.target.matches('.ad[data-ad]')) { e.preventDefault(); window.ISC.forms.openAd(+e.target.dataset.ad); }
  });

  // Home / real estate: "List or request a property" band
  function renderMarketBand() {
    document.querySelectorAll('[data-market-band]').forEach((el) => {
      if (!M) return;
      const n = M.listings.length;
      el.innerHTML = `
        <div class="market-band reveal">
          <div class="mb-text">
            <span class="eyebrow">${icon('megaphone')} ${T('سوق العقار — عرض وطلب', 'Property market — offers & requests')}</span>
            <h2>${T('عندك عقار؟ اعرضه. تدوّر عقار؟ اطلبه.', 'Have a property? List it. Need one? Ask for it.')}</h2>
            <p>${T('مثل الحراج لكن أسهل وأوثق: أضف إعلانك أو طلبك في دقيقة، ويتواصل معك فريقنا ويوصلك بالطرف المناسب.', 'Like a classifieds board, but simpler and more reliable: post in a minute and our team connects you with the right party.')}</p>
          </div>
          <div class="mb-actions">
            <button class="mb-card" type="button" data-post="offer">
              <span class="ico">${icon('tag')}</span>
              <span><b>${T('اعرض عقارك', 'List a property')}</b><small>${T('فيلا، شقة، أرض، محل…', 'Villa, apartment, land, shop…')}</small></span>
              ${arrow()}
            </button>
            <button class="mb-card" type="button" data-post="request">
              <span class="ico">${icon('search')}</span>
              <span><b>${T('اطلب عقار', 'Request a property')}</b><small>${T('اكتب ما تحتاجه ونبحث لك', 'Tell us what you need')}</small></span>
              ${arrow()}
            </button>
            <a class="mb-link" href="market.html">${icon('layout-grid')} ${T('تصفّح الإعلانات', 'Browse ads')} <span class="n">${n}</span></a>
          </div>
        </div>`;
    });
  }

  // Real estate page: section (rent / sale / invest) → offer or request → property type → market
  const DEAL_WORD = { rent: { ar: 'إيجار', en: 'rent' }, sale: { ar: 'بيع', en: 'sale' }, invest: { ar: 'استثمار', en: 'investment' } };
  // a buyer "requests to purchase" (شراء), a seller "offers for sale" (بيع)
  const dealWord = (id, kind) => (id === 'sale' && kind === 'request' ? { ar: 'شراء', en: 'purchase' } : DEAL_WORD[id]);
  function renderDeals() {
    const root = document.getElementById('dealPicker');
    if (!root || !M) return;
    const steps = `
      <ol class="flow-steps reveal">
        <li class="on" data-step="1"><b>1</b> ${T('اختر القسم', 'Choose a section')}</li>
        <li data-step="2"><b>2</b> ${T('عرض أم طلب؟', 'Offer or request?')}</li>
        <li data-step="3"><b>3</b> ${T('نوع العقار', 'Property type')}</li>
      </ol>`;
    const cards = M.deals.map((d, i) => `
      <button class="deal-card reveal-zoom" style="--d:${i * 0.08}s" type="button" data-deal="${d.id}" id="deal-${d.id}" aria-expanded="false">
        <img src="assets/img/${d.img}" alt="" loading="eager">
        <span class="ico">${icon(d.icon)}</span>
        <span class="deal-txt">
          <h3>${t(d)}</h3>
          <small>${T(d.dar, d.den)}</small>
          <span class="deal-foot"><span>${adsFor({ deal: d.id }).length} ${T('إعلان', 'ads')}</span><span class="go">${T('اختر', 'Choose')} ${arrow()}</span></span>
        </span>
      </button>`).join('');
    root.innerHTML = `
      <div class="container">
        ${steps}
        <div class="deal-grid">${cards}</div>
        <div class="type-panel" id="typePanel" hidden></div>
      </div>`;

    const panel = root.querySelector('#typePanel');
    let cur = { deal: '', kind: 'offer' };
    const drawTypes = () => {
      const d = deal(cur.deal); if (!d) return;
      const sub = panel.querySelector('#typeSub');
      sub.innerHTML = `
        <div class="type-head">
          <span class="ico">${icon('layout-grid')}</span>
          <div><h3>${T('اختر نوع العقار', 'Choose property type')} — <span class="accent">${cur.kind === 'offer' ? T(`عرض عقار ${dealWord(d.id, 'offer').ar}`, `${dealWord(d.id, 'offer').en} offers`) : T(`طلب عقار ${dealWord(d.id, 'request').ar}`, `${dealWord(d.id, 'request').en} requests`)}</span></h3>
          <p>${T('اضغط على النوع لتشاهد الإعلانات المتاحة', 'Tap a type to see the available ads')}</p></div>
        </div>
        <div class="type-grid">
          ${d.types.map((k, i) => {
            const n = adsFor({ deal: d.id, type: k, kind: cur.kind }).length;
            return `<a class="type-tile" style="--i:${i}" href="${marketUrl({ deal: d.id, type: k, kind: cur.kind })}">
              <span class="ico">${icon(M.types[k].icon)}</span>
              <b>${typeName(k)}</b>
              <small>${n ? `${n} ${T('إعلان', 'ads')}` : T('لا توجد إعلانات بعد', 'No ads yet')}</small>
            </a>`;
          }).join('')}
        </div>
        <div class="type-actions">
          <a class="btn btn-navy" href="${marketUrl({ deal: d.id, kind: cur.kind })}">${icon('layout-grid')} ${cur.kind === 'offer' ? T('كل العروض', 'All offers') : T('كل الطلبات', 'All requests')}</a>
        </div>`;
      drawIcons();
    };
    const open = (id, kind, scroll = true) => {
      const d = deal(id);
      if (!d) return;
      const fresh = cur.deal !== id;
      cur = { deal: id, kind: kind || (fresh ? 'offer' : cur.kind) };
      const w = DEAL_WORD[id];
      root.querySelectorAll('[data-deal]').forEach((b) => {
        b.classList.toggle('selected', b.dataset.deal === id);
        b.setAttribute('aria-expanded', b.dataset.deal === id ? 'true' : 'false');
      });
      root.querySelectorAll('.flow-steps li').forEach((li) => li.classList.toggle('on', +li.dataset.step <= 3));
      const nOffer = adsFor({ deal: id, kind: 'offer' }).length;
      const nReq = adsFor({ deal: id, kind: 'request' }).length;
      const kindCard = (k) => {
        const isOffer = k === 'offer';
        const wk = dealWord(id, k);
        const title = isOffer ? T(`عرض عقار ${wk.ar}`, `Property offer — ${wk.en}`) : T(`طلب عقار ${wk.ar}`, `Property request — ${wk.en}`);
        const text = isOffer ? T('عندك عقار؟ اعرضه وسيصل لمن يبحث عنه.', 'Have a property? List it and reach those looking for it.') : T('تبحث عن عقار؟ اكتب كل متطلباتك ونبحث لك.', 'Looking for one? Tell us every requirement and we search for you.');
        return `
          <div class="kind-card ${k}${cur.kind === k ? ' selected' : ''}" data-kind="${k}" tabindex="0" role="button" aria-pressed="${cur.kind === k}">
            <span class="ico">${icon(isOffer ? 'tag' : 'search')}</span>
            <div class="kc-txt">
              <h4>${title}</h4>
              <p>${text}</p>
              <small>${(isOffer ? nOffer : nReq)} ${isOffer ? T('عرض متاح', 'offers available') : T('طلب منشور', 'published requests')}</small>
            </div>
            <div class="kc-actions">
              <button class="btn btn-sm btn-navy" type="button" data-pick-kind="${k}">${icon('layout-grid')} ${isOffer ? T('تصفح العروض', 'Browse offers') : T('تصفح الطلبات', 'Browse requests')}</button>
              <button class="btn btn-sm btn-gold" type="button" data-post="${k}" data-post-deal="${id}">${icon(isOffer ? 'plus' : 'clipboard-list')} ${isOffer ? T('أضف عرضك', 'Add your offer') : T('اطلب عقارك', 'Request a property')}</button>
            </div>
          </div>`;
      };
      panel.innerHTML = `
        <div class="type-head">
          <span class="ico">${icon(d.icon)}</span>
          <div><h3>${t(d)} — <span class="accent">${T('عرض أم طلب؟', 'Offer or request?')}</span></h3>
          <p>${T('اختر ما يناسبك ثم نوع العقار', 'Pick what suits you, then the property type')}</p></div>
        </div>
        <div class="kind-grid">${kindCard('offer')}${kindCard('request')}</div>
        <div id="typeSub" class="type-sub"></div>`;
      panel.hidden = false;
      if (fresh) { panel.classList.remove('show'); void panel.offsetWidth; panel.classList.add('show'); }
      drawTypes();
      drawIcons();
      if (scroll) setTimeout(() => panel.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'center' }), 60);
    };
    root._open = open;
    root.querySelectorAll('[data-deal]').forEach((b) => b.addEventListener('click', () => open(b.dataset.deal)));
    panel.addEventListener('click', (e) => {
      if (e.target.closest('[data-post]')) return;      // handled globally
      const k = e.target.closest('[data-kind]');
      if (k) { cur.kind = k.dataset.kind; panel.querySelectorAll('.kind-card').forEach((c) => { const on = c.dataset.kind === cur.kind; c.classList.toggle('selected', on); c.setAttribute('aria-pressed', on); }); drawTypes(); }
    });
  }

  // market.html: filterable board of offers & requests
  function renderMarket() {
    const root = document.getElementById('market');
    if (!root || !M) return;
    const qs = new URLSearchParams(location.search);
    const f = {
      kind: KIND[qs.get('kind')] ? qs.get('kind') : '',
      deal: deal(qs.get('deal')) ? qs.get('deal') : '',
      type: M.types[qs.get('type')] ? qs.get('type') : '',
      city: qs.get('city') || '',
      q: ''
    };
    const cities = [...new Set(M.listings.map((a) => a.city))];

    root.innerHTML = `
      <div class="container">
        <div class="post-cards">
          <button class="post-card offer reveal" type="button" data-post="offer">
            <span class="ico">${icon('tag')}</span>
            <span><b>${T('عندي عقار', 'I have a property')}</b><small>${T('أضف عرض بيع أو إيجار أو استثمار', 'Post a sale, rent or investment offer')}</small></span>
            <span class="plus">${icon('plus')}</span>
          </button>
          <button class="post-card request reveal" style="--d:.08s" type="button" data-post="request">
            <span class="ico">${icon('search')}</span>
            <span><b>${T('أبحث عن عقار', 'I am looking for a property')}</b><small>${T('اكتب طلبك ونوصلك بالعرض المناسب', 'Post your request — we find the match')}</small></span>
            <span class="plus">${icon('plus')}</span>
          </button>
        </div>

        <div class="mk-filters reveal">
          <div class="mk-row">
            <div class="seg seg-sm" data-f="kind">
              <button type="button" data-v="">${T('الكل', 'All')}</button>
              <button type="button" data-v="offer">${icon('tag')} ${T('العروض', 'Offers')}</button>
              <button type="button" data-v="request">${icon('search')} ${T('الطلبات', 'Requests')}</button>
            </div>
            <div class="seg seg-sm" data-f="deal">
              <button type="button" data-v="">${T('كل الأقسام', 'All sections')}</button>
              ${M.deals.map((d) => `<button type="button" data-v="${d.id}">${icon(d.icon)} ${t(d)}</button>`).join('')}
            </div>
          </div>
          <div class="mk-row">
            <div class="tabs mk-types" data-f="type"></div>
          </div>
          <div class="mk-row">
            <label class="mk-select">${icon('map-pin')}
              <span class="sr-only">${T('المدينة', 'City')}</span>
              <select data-f="city"><option value="">${T('كل المدن', 'All cities')}</option>${cities.map((c) => `<option value="${esc(c)}">${cityName(c)}</option>`).join('')}</select>
            </label>
            <label class="search">
              <span class="sr-only">${T('ابحث في الإعلانات', 'Search ads')}</span>
              ${icon('search')}
              <input type="search" data-f="q" placeholder="${T('ابحث: حي، مدينة، وصف…', 'Search: district, city, description…')}">
            </label>
          </div>
        </div>

        <div class="mk-status"><span id="mkCount"></span><button type="button" class="mk-clear" id="mkClear">${icon('x')} ${T('مسح الفلاتر', 'Clear filters')}</button></div>
        <div class="ad-grid" id="adGrid"></div>
        <div class="no-results" id="mkEmpty">
          <span class="ico">${icon('inbox')}</span>
          <h3>${T('لا توجد إعلانات مطابقة حالياً', 'No matching ads right now')}</h3>
          <p>${T('أضف طلبك الآن وسنبحث لك عن العقار المناسب ونتواصل معك.', 'Post your request and we will search for the right property for you.')}</p>
          <button class="btn btn-gold" type="button" data-post="request">${icon('search')} ${T('أضف طلبك', 'Post a request')}</button>
        </div>
      </div>`;

    const grid = root.querySelector('#adGrid');
    const typesEl = root.querySelector('[data-f="type"]');
    const renderTypes = () => {
      const keys = f.deal ? deal(f.deal).types : Object.keys(M.types);
      if (f.type && !keys.includes(f.type)) f.type = '';
      typesEl.innerHTML = `<button class="tab${f.type ? '' : ' active'}" type="button" data-v="">${icon('layout-grid')} ${T('كل الأنواع', 'All types')}</button>` +
        keys.map((k) => `<button class="tab${f.type === k ? ' active' : ''}" type="button" data-v="${k}">${icon(M.types[k].icon)} ${typeName(k)}</button>`).join('');
    };
    const sync = () => {
      root.querySelectorAll('.seg[data-f]').forEach((s) => s.querySelectorAll('button').forEach((b) => b.classList.toggle('active', b.dataset.v === f[s.dataset.f])));
      root.querySelector('select[data-f="city"]').value = f.city;
    };
    const draw = () => {
      const q = normalize(f.q.trim());
      const list = M.listings
        .filter((a) => (!f.kind || a.kind === f.kind) && (!f.deal || a.deal === f.deal) && (!f.type || a.type === f.type) && (!f.city || a.city === f.city))
        .filter((a) => !q || normalize([a.title.ar, a.title.en, a.city, cityName(a.city), a.district && a.district.ar, a.district && a.district.en, typeName(a.type, true), a.id].join(' ')).includes(q))
        .sort((x, y) => String(y.date).localeCompare(String(x.date)) || y.id - x.id);
      grid.innerHTML = list.map(adCard).join('');
      root.querySelector('#mkEmpty').classList.toggle('show', !list.length);
      root.querySelector('#mkCount').innerHTML = `<b>${list.length}</b> ${T('إعلان', 'ads')}${f.deal ? ` · ${t(deal(f.deal))}` : ''}${f.type ? ` · ${typeName(f.type)}` : ''}`;
      root.querySelector('#mkClear').hidden = !(f.kind || f.deal || f.type || f.city || f.q);
      drawIcons();
      grid.querySelectorAll('.ad').forEach((el) => el.classList.add('in'));
      const p = new URLSearchParams();
      ['kind', 'deal', 'type', 'city'].forEach((k) => f[k] && p.set(k, f[k]));
      try { history.replaceState(null, '', p.toString() ? `?${p}` : location.pathname); } catch (e) { /* file:// */ }
    };

    root.querySelectorAll('.seg[data-f]').forEach((s) => s.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      f[s.dataset.f] = b.dataset.v;
      if (s.dataset.f === 'deal') renderTypes();
      sync(); draw();
    }));
    typesEl.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      f.type = b.dataset.v;
      typesEl.querySelectorAll('.tab').forEach((x) => x.classList.toggle('active', x === b));
      draw();
    });
    root.querySelector('select[data-f="city"]').addEventListener('change', (e) => { f.city = e.target.value; draw(); });
    root.querySelector('input[data-f="q"]').addEventListener('input', (e) => { f.q = e.target.value; draw(); });
    root.querySelector('#mkClear').addEventListener('click', () => {
      Object.assign(f, { kind: '', deal: '', type: '', city: '', q: '' });
      root.querySelector('input[data-f="q"]').value = '';
      renderTypes(); sync(); draw();
    });
    root._filters = f;

    renderTypes(); sync(); draw();
    const post = qs.get('post');
    if (post === 'offer' || post === 'request') setTimeout(() => openPost(post, f), 400);
  }

  // Any [data-post] button opens the post form (pre-filled from the market filters when present)
  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-post]');
    if (!b) return;
    const mk = document.getElementById('market');
    const preset = b.dataset.postDeal ? { deal: b.dataset.postDeal } : (mk && mk._filters) || {};
    openPost(b.dataset.post, preset);
  });

  /* ---------------- Home dynamic bits ---------------- */
  function renderHomeBits() {
    document.querySelectorAll('[data-count-of]').forEach((el) => {
      const keys = el.dataset.countOf.split(',');
      el.textContent = keys.reduce((n, k) => n + countServices(k), 0);
    });
    document.querySelectorAll('[data-count-ads]').forEach((el) => { el.textContent = M ? M.listings.length : 0; });
    document.querySelectorAll('[data-total-services]').forEach((el) => { el.dataset.countTo = totalServices(); });
    const totalCats = Object.keys(C).reduce((n, k) => n + C[k].categories.length, 0);
    document.querySelectorAll('[data-total-cats]').forEach((el) => { el.dataset.countTo = totalCats; });
    document.querySelectorAll('[data-count-cities]').forEach((el) => { el.dataset.countTo = S.cities.length; });
    // Contact links read from data.js so the numbers live in one place
    document.querySelectorAll('[data-wa-link]').forEach((el) => { el.href = waLink(el.dataset.waLink ? T('مرحباً، أرغب في الاستفسار عن خدماتكم', 'Hello, I would like to ask about your services') : ''); });
    document.querySelectorAll('[data-tel-link]').forEach((el) => { el.href = telLink(); });
    document.querySelectorAll('[data-phone-text]').forEach((el) => { el.textContent = S.phoneDisplay; });
    document.querySelectorAll('[data-email-text-link]').forEach((el) => { el.href = `mailto:${S.email}`; });
    document.querySelectorAll('[data-email-text]').forEach((el) => { el.textContent = S.email; if (el.tagName === 'A') el.href = `mailto:${S.email}`; });

    const cities = document.getElementById('citiesList');
    if (cities) cities.innerHTML = S.cities.map(([ar, en]) => `<span class="city">${icon('map-pin')} ${T(ar, en)}</span>`).join('');

    const mq = document.getElementById('marquee');
    if (mq) {
      const pick = [];
      Object.keys(C).forEach((k) => C[k].categories.forEach((c) => c.items.slice(0, 2).forEach((it) => pick.push(it))));
      const row = pick.map((it) => `<span>${icon(it[0])} ${esc(T(it[1], it[2]))}</span>`).join('');
      mq.innerHTML = row + row; // duplicate for seamless loop
    }
  }

  /* ---------------- Static i18n (data-en attributes) ---------------- */
  function applyStatic() {
    document.querySelectorAll('[data-en]').forEach((el) => {
      if (!el.hasAttribute('data-ar')) el.setAttribute('data-ar', el.innerHTML);
      el.innerHTML = lang === 'en' ? el.getAttribute('data-en') : el.getAttribute('data-ar');
    });
    document.querySelectorAll('[data-l]').forEach((el) => { el.hidden = el.dataset.l !== lang; });
    document.querySelectorAll('[data-en-ph]').forEach((el) => {
      if (!el.hasAttribute('data-ar-ph')) el.setAttribute('data-ar-ph', el.getAttribute('placeholder') || '');
      el.setAttribute('placeholder', lang === 'en' ? el.dataset.enPh : el.dataset.arPh);
    });
    document.querySelectorAll('[data-en-aria]').forEach((el) => {
      if (!el.hasAttribute('data-ar-aria')) el.setAttribute('data-ar-aria', el.getAttribute('aria-label') || '');
      el.setAttribute('aria-label', lang === 'en' ? el.dataset.enAria : el.dataset.arAria);
    });
  }

  function setDocLang() {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  }

  function renderAll() {
    setDocLang();
    renderHeader();
    renderFooter();
    renderChrome();
    applyStatic();
    renderHomeBits();
    renderCatalog();
    renderMarketBand();
    renderDeals();
    renderMarket();
    renderContactForm();
    drawIcons();
    bindHeader();
    bindChrome();
    initReveal();
    initCounters();
    initFAQ();
    initSlider();
  }

  function switchLang() {
    lang = lang === 'ar' ? 'en' : 'ar';
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) { /* ignore */ }
    document.body.classList.add('lang-switching');
    const y = window.scrollY;
    setTimeout(() => {
      document.body.classList.remove('drawer-open');
      renderAll();
      if (window.ISC && window.ISC.onReady) window.ISC.onReady();
      window.scrollTo(0, y);
      document.body.classList.remove('lang-switching');
    }, 150);
  }

  /* ---------------- Contact form ---------------- */
  function renderContactForm() {
    const holder = document.getElementById('contactForm');
    if (holder) window.ISC.forms.renderContact(holder);
  }

  /* ---------------- Behaviours ---------------- */
  function bindHeader() {
    document.querySelectorAll('[data-lang-toggle]').forEach((b) => b.addEventListener('click', switchLang));
    document.querySelectorAll('[data-drawer-open]').forEach((b) => b.addEventListener('click', () => document.body.classList.add('drawer-open')));
    document.querySelectorAll('[data-drawer-close]').forEach((b) => b.addEventListener('click', () => document.body.classList.remove('drawer-open')));
  }

  function bindChrome() {
    document.getElementById('toTop')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: prefersReduced ? 'auto' : 'smooth' }));
    document.getElementById('svcModal')?.addEventListener('click', (e) => { if (e.target.closest('[data-modal-close]')) closeModal(); });
  }

  let revealObs;
  function initReveal() {
    // While the opening intro plays, hold the reveal animations so the hero animates in after it
    if (document.documentElement.classList.contains('intro-pending')) return;
    const els = document.querySelectorAll('.reveal:not(.in), .reveal-zoom:not(.in)');
    if (prefersReduced || !('IntersectionObserver' in window)) { els.forEach((e) => e.classList.add('in')); return; }
    revealObs && revealObs.disconnect();
    revealObs = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); revealObs.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach((e) => {
      // Elements already on screen reveal right away (the observer can miss them when attached late)
      const r = e.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) e.classList.add("in");
      else revealObs.observe(e);
    });
  }

  function initCounters() {
    const els = document.querySelectorAll('[data-count-to]');
    const fmt = (n) => n.toLocaleString(lang === 'ar' ? 'ar-SA-u-nu-latn' : 'en-US');
    const run = (el) => {
      const end = parseFloat(el.dataset.countTo);
      if (prefersReduced) { el.textContent = fmt(end); return; }
      const dur = 1600; const start = performance.now();
      const step = (now) => {
        const p = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = fmt(Math.round(end * eased));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { run(en.target); obs.unobserve(en.target); } });
    }, { threshold: 0.5 });
    els.forEach((e) => obs.observe(e));
  }

  function initFAQ() {
    document.querySelectorAll('.faq-q').forEach((q) => {
      if (q.dataset.bound) return;
      q.dataset.bound = '1';
      q.addEventListener('click', () => {
        const item = q.closest('.faq-item');
        const open = item.classList.contains('open');
        item.parentElement.querySelectorAll('.faq-item.open').forEach((x) => { x.classList.remove('open'); x.querySelector('.faq-q').setAttribute('aria-expanded', 'false'); });
        if (!open) { item.classList.add('open'); q.setAttribute('aria-expanded', 'true'); }
      });
    });
  }

  function initSlider() {
    const track = document.querySelector('.testi-track');
    if (!track || track.dataset.bound) return;
    track.dataset.bound = '1';
    const step = () => (track.querySelector('.testi')?.offsetWidth || 300) + 24;
    // In RTL, scrollLeft runs negative; scrollBy with a signed delta handles both directions.
    const dir = () => (document.documentElement.dir === 'rtl' ? -1 : 1);
    document.querySelector('[data-slide="next"]')?.addEventListener('click', () => track.scrollBy({ left: step() * dir(), behavior: 'smooth' }));
    document.querySelector('[data-slide="prev"]')?.addEventListener('click', () => track.scrollBy({ left: -step() * dir(), behavior: 'smooth' }));
    clearInterval(initSlider._t);
    if (prefersReduced) return;
    initSlider._t = setInterval(() => {
      if (track.matches(':hover')) return;
      const max = track.scrollWidth - track.clientWidth;
      if (Math.abs(track.scrollLeft) >= max - 10) track.scrollTo({ left: 0, behavior: 'smooth' });
      else track.scrollBy({ left: step() * dir(), behavior: 'smooth' });
    }, 5000);
  }

  // 3D tilt + spotlight on the big choice cards
  function initTilt() {
    if (prefersReduced || window.matchMedia('(hover: none)').matches) return;
    document.addEventListener('mousemove', (e) => {
      const card = e.target.closest('.choice');
      document.querySelectorAll('.choice.tilting').forEach((c) => { if (c !== card) { c.style.transform = ''; c.classList.remove('tilting'); } });
      if (!card) return;
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width; const y = (e.clientY - r.top) / r.height;
      card.classList.add('tilting');
      card.style.transform = `perspective(1100px) rotateX(${(0.5 - y) * 5}deg) rotateY(${(x - 0.5) * 6}deg) translateY(-6px)`;
      card.style.setProperty('--mx', `${x * 100}%`);
      card.style.setProperty('--my', `${y * 100}%`);
    });
  }

  // Scroll-driven effects: header state, progress bar, parallax, back-to-top
  function initScroll() {
    let ticking = false;
    const onScroll = () => {
      const y = window.scrollY;
      document.getElementById('header')?.classList.toggle('scrolled', y > 40);
      document.getElementById('toTop')?.classList.toggle('show', y > 700);
      const h = document.documentElement.scrollHeight - window.innerHeight;
      const bar = document.getElementById('progress');
      if (bar) bar.style.width = `${h > 0 ? (y / h) * 100 : 0}%`;
      if (!prefersReduced) {
        document.querySelectorAll('.hero-bg, .page-hero .bg').forEach((bg) => {
          if (y < window.innerHeight * 1.2) bg.style.transform = `translateY(${y * 0.28}px) scale(1.08)`;
        });
      }
      ticking = false;
    };
    window.addEventListener('scroll', () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
    onScroll();
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeModal(); document.body.classList.remove('drawer-open'); }
  });

  try { if (page !== 'home') sessionStorage.removeItem('isc-internal'); } catch (e) { /* ignore */ }
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a || a.target === '_blank') return;
    const href = a.getAttribute('href');
    if (/^(https?:|mailto:|tel:|#)/.test(href)) return;
    try { sessionStorage.setItem('isc-internal', '1'); } catch (err) { /* ignore */ }
  });


  /* ---------------- Opening intro ---------------- */
  // The symbol assembles from its real parts (CSS keyframes, see style.css),
  // then flies into the header logo while the backdrop fades away.
  function initIntro() {
    const root = document.documentElement;
    const el = document.getElementById('intro');
    if (!el || !root.classList.contains('intro-pending')) return;
    window.scrollTo(0, 0);
    el.querySelector('.intro-tag em').textContent = t(S.tagline);
    el.querySelector('.intro-skip').textContent = T('تخطي', 'Skip');

    const mark = el.querySelector('.intro-mark');
    const timers = [];
    let leaving = false;

    function exit() {
      if (leaving) return;
      leaving = true;
      timers.forEach(clearTimeout);
      el.classList.add('done', 'leaving');
      const target = document.querySelector('.header .brand img.symbol');
      const ease = 'cubic-bezier(.65,0,.35,1)';
      const fade = (sel, ms, delay) => el.querySelector(sel).animate([{ opacity: 1 }, { opacity: 0 }], { duration: ms, delay: delay || 0, fill: 'forwards', easing: ease });

      fade('.intro-word', 350); fade('.intro-tag', 300); fade('.intro-skip', 200);
      fade('.intro-bg', 750, 250);
      setTimeout(() => { root.classList.remove('intro-pending'); initReveal(); }, 350);

      let done = false;
      const finish = () => {
        if (done) return; done = true;
        if (target) target.style.opacity = '';
        el.remove();
        if ('scrollRestoration' in history) history.scrollRestoration = 'auto';
      };
      if (target && mark.animate) {
        const m = mark.getBoundingClientRect(), h = target.getBoundingClientRect();
        const dx = (h.left + h.width / 2) - (m.left + m.width / 2);
        const dy = (h.top + h.height / 2) - (m.top + m.height / 2);
        target.style.opacity = '0';   // the flying mark takes its place
        mark.animate([
          { transform: 'translate(0,0) scale(1)' },
          { transform: `translate(${dx}px, ${dy}px) scale(${h.width / m.width})` }
        ], { duration: 1000, delay: 120, easing: ease, fill: 'forwards' }).onfinish = finish;
      } else {
        fade('.intro-mark', 500);
      }
      setTimeout(finish, 1500); // safety net
    }

    el.querySelector('.intro-skip').addEventListener('click', exit);
    el.addEventListener('click', exit);
    document.addEventListener('keydown', function onKey(e) {
      if (e.key === 'Escape' || e.key === 'Enter') { document.removeEventListener('keydown', onKey); exit(); }
    });

    if (prefersReduced) {
      el.classList.add('done');
      timers.push(setTimeout(exit, 1000));
      return;
    }
    // start once the layers are loaded so nothing pops in half-drawn
    const imgs = [...el.querySelectorAll('img')];
    let started = false;
    const start = () => { if (started) return; started = true; el.classList.add('play'); timers.push(setTimeout(exit, 4000)); };
    Promise.all(imgs.map((i) => (i.complete ? Promise.resolve() : new Promise((r) => { i.onload = i.onerror = r; })))).then(start);
    setTimeout(start, 1500); // don't wait forever on a slow connection
  }

  /* ---------------- Shared helpers for forms.js / account.js ---------------- */
  window.ISC = {
    get lang() { return lang; }, T, t, esc, icon, arrow, drawIcons, toast, showModal, closeModal, validate, cityOptions, normalize,
    S, C, M, A, fmtNum, cityName, typeName, deal, waLink, telLink, WA_SVG, KIND, rerender: () => renderAll(), imgSrc, adCard,
    refreshHeader: () => { renderHeader(); drawIcons(); bindHeader(); }
  };

  /* ---------------- Boot ---------------- */
  const domReady = () => new Promise((r) => (document.readyState === 'loading' ? document.addEventListener('DOMContentLoaded', r) : r()));
  async function boot() {
    await domReady();                       // every script of the page (forms.js …) is loaded before we render
    const has = (sel) => !!document.querySelector(sel);
    const need = ['config', 'me'];
    if (has('#catalog, [data-count-of], [data-total-services], [data-total-cats], #marquee, #contactForm')) need.push('catalog');
    if (M && has('#dealPicker, #market, [data-market-band], [data-count-ads]')) need.push('listings');
    const d = await A.boot(need);
    if (d.config) {
      Object.assign(S, d.config.site);
      S.appointments = d.config.appointments;
      S.listingRules = d.config.listings;
    }
    if (d.catalog) { Object.keys(C).forEach((k) => delete C[k]); Object.assign(C, d.catalog); }
    if (d.listings && M) { M.listings.length = 0; M.listings.push(...d.listings); }
    renderAll();
    if (window.ISC.onReady) window.ISC.onReady();
    initIntro();
    initTilt();
    initScroll();
    deepLinks();
  }

  function deepLinks() {
    // Deep links: general-services.html#labor → show that category; real-estate.html#deal-rent → open that section
    if (location.hash && location.hash !== '#request') {
      const id = decodeURIComponent(location.hash.slice(1));
      const cat = document.getElementById('catalog');
      const picker = document.getElementById('dealPicker');
      setTimeout(() => {
        if (picker && id.startsWith('deal-')) picker._open(id.slice(5));
        else if (cat && cat._pick && cat.querySelector(`.cat-section[data-cat="${CSS.escape(id)}"]`)) cat._pick(id);
        else jumpTo(id);
      }, 250);
    }
    // Same-page links to a section (e.g. the header dropdown while on real-estate.html)
    window.addEventListener('hashchange', () => {
      const id = location.hash.slice(1);
      const picker = document.getElementById('dealPicker');
      if (picker && id.startsWith('deal-')) picker._open(id.slice(5));
    });
    if (location.hash === '#request') {
      setTimeout(() => document.getElementById('request')?.scrollIntoView({ behavior: 'smooth' }), 250);
    }
  }

  boot();
})();
