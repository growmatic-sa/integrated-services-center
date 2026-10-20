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
  const TOTAL = Object.keys(C).reduce((n, k) => n + countServices(k), 0);

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
    { id: 'about', href: 'about.html', ar: 'من نحن', en: 'About Us', icon: 'info' },
    { id: 'contact', href: 'contact.html', ar: 'تواصل معنا', en: 'Contact Us', icon: 'phone' }
  ];
  const isActive = (item) => item.id === page || (item.children || []).some((c) => c.id === page);

  /* ---------------- Header ---------------- */
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

  function requestFields(withService) {
    return `
      <div class="form-grid">
        <div class="field">
          <label for="f-name">${T('الاسم', 'Full name')} <span class="req">*</span></label>
          <input id="f-name" name="name" autocomplete="name" required placeholder="${T('اسمك الكريم', 'Your name')}">
          <div class="err">${T('فضلاً اكتب اسمك', 'Please enter your name')}</div>
        </div>
        <div class="field">
          <label for="f-phone">${T('رقم الجوال', 'Mobile number')} <span class="req">*</span></label>
          <input id="f-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" dir="ltr" required placeholder="05XXXXXXXX">
          <div class="err">${T('رقم جوال سعودي صحيح يبدأ بـ 05', 'A valid Saudi mobile starting with 05')}</div>
        </div>
        ${withService ? `
        <div class="field">
          <label for="f-type">${T('نوع الخدمة', 'Service type')} <span class="req">*</span></label>
          <select id="f-type" name="type" required>
            <option value="">${T('اختر القسم', 'Select a section')}</option>
            <option>${T('الخدمات العقارية', 'Real Estate Services')}</option>
            <option>${T('سوق العقار (عرض أو طلب)', 'Property market (offer or request)')}</option>
            <option>${T('الخدمات العامة', 'General Services')}</option>
            <option>${T('الخدمات الطلابية', 'Student Services')}</option>
            <option>${T('استفسار عام', 'General inquiry')}</option>
          </select>
          <div class="err">${T('فضلاً اختر نوع الخدمة', 'Please choose a service type')}</div>
        </div>` : ''}
        <div class="field ${withService ? '' : 'full'}">
          <label for="f-city">${T('المدينة', 'City')} <span class="req">*</span></label>
          <select id="f-city" name="city" required>${cityOptions()}</select>
          <div class="err">${T('فضلاً اختر المدينة', 'Please choose your city')}</div>
        </div>
        <div class="field full">
          <label for="f-notes">${T('تفاصيل الطلب', 'Request details')}</label>
          <textarea id="f-notes" name="notes" placeholder="${T('اكتب أي تفاصيل تساعدنا على خدمتك بشكل أسرع…', 'Any details that help us serve you faster…')}"></textarea>
        </div>
      </div>`;
  }

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

  function buildMessage(data, service) {
    const lines = [
      T('مرحباً مركز الخدمات المتكاملة،', 'Hello Integrated Services Center,'),
      T('أرغب في طلب خدمة:', 'I would like to request a service:'),
      '',
    ];
    if (service) {
      lines.push(`• ${T('الخدمة', 'Service')}: ${service.title}`);
      lines.push(`• ${T('القسم', 'Section')}: ${service.section}`);
    }
    if (data.type) lines.push(`• ${T('نوع الخدمة', 'Service type')}: ${data.type}`);
    lines.push(`• ${T('الاسم', 'Name')}: ${data.name}`);
    lines.push(`• ${T('الجوال', 'Mobile')}: ${data.phone}`);
    lines.push(`• ${T('المدينة', 'City')}: ${data.city}`);
    if (data.notes) lines.push(`• ${T('التفاصيل', 'Details')}: ${data.notes}`);
    return lines.join('\n');
  }

  function bindRequestForm(form, service) {
    form.addEventListener('input', (e) => {
      const f = e.target.closest('.field');
      if (f && f.classList.contains('invalid')) f.classList.remove('invalid');
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validate(form)) return;
      const data = Object.fromEntries(new FormData(form).entries());
      window.open(waLink(buildMessage(data, service)), '_blank', 'noopener');
      toast(T('تم تجهيز طلبك — سيتم فتح واتساب لإرساله', 'Your request is ready — WhatsApp will open to send it'));
      form.reset();
      if (form.closest('.modal')) setTimeout(closeModal, 600);
    });
  }

  /* ---------------- Modal ---------------- */
  let lastFocus = null;
  function showModal(html) {
    const modal = document.getElementById('svcModal');
    const box = modal.querySelector('.modal-box');
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

  function openService(catKey, catIdx, itemIdx) {
    const cat = C[catKey].categories[catIdx];
    const it = cat.items[itemIdx];
    const title = T(it[1], it[2]);
    const desc = T(it[3], it[4]);
    const section = `${t(C[catKey].title)} — ${t(cat.title)}`;
    const box = showModal(`
      <div class="modal-head">
        <button class="modal-close" type="button" data-modal-close aria-label="${T('إغلاق', 'Close')}">${icon('x')}</button>
        <div class="ico">${icon(it[0])}</div>
        <small>${esc(section)}</small>
        <h3 id="mTitle">${esc(title)}</h3>
        <p>${esc(desc)}</p>
      </div>
      <div class="modal-body">
        <div class="modal-perks">
          <div>${icon('timer')} ${T('رد خلال وقت قصير', 'Quick response')}</div>
          <div>${icon('shield-check')} ${T('سرية تامة لبياناتك', 'Full confidentiality')}</div>
          <div>${icon('list-checks')} ${T('متابعة حتى الإنجاز', 'Followed to completion')}</div>
        </div>
        <form novalidate>
          ${requestFields(false)}
          <div class="form-actions">
            <button class="btn btn-wa" type="submit">${WA_SVG.replace('class="wa-logo"', 'style="width:1.2em;height:1.2em"')} ${T('إرسال الطلب عبر واتساب', 'Send via WhatsApp')}</button>
            <a class="btn btn-outline" href="${telLink()}">${icon('phone')} ${T('اتصل الآن', 'Call now')}</a>
          </div>
          <p class="form-note">${icon('info')} ${T('لن نشارك بياناتك مع أي جهة. سنتواصل معك لتأكيد المتطلبات والتكلفة قبل البدء.', 'We never share your data. We will confirm requirements and cost with you before starting.')}</p>
        </form>
      </div>`);
    bindRequestForm(box.querySelector('form'), { title, section });
  }
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
        <li><b>3</b> ${T('أرسل طلبك عبر واتساب', 'Send your request on WhatsApp')}</li>
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
          <a class="btn btn-wa" href="${waLink()}" target="_blank" rel="noopener">${T('اسألنا عبر واتساب', 'Ask us on WhatsApp')}</a>
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

  function adCard(a, i = 0) {
    const ty = M.types[a.type] || {};
    const where = `${cityName(a.city)}${a.district ? ` — ${esc(t(a.district))}` : ''}`;
    const specs = [
      a.area ? `<span>${icon('ruler')} ${fmtNum(a.area)} ${T('م²', 'm²')}</span>` : '',
      a.rooms ? `<span>${icon('bed-double')} ${a.rooms} ${T('غرف', 'rooms')}</span>` : '',
      a.baths ? `<span>${icon('bath')} ${a.baths} ${T('دورات مياه', 'baths')}</span>` : ''
    ].join('');
    const msg = T(`مرحباً، أستفسر عن الإعلان رقم ${a.id} في سوق العقار:\n${t(a.title)}\n${where}`,
                  `Hello, I'm asking about ad #${a.id} on the property market:\n${t(a.title)}\n${where}`);
    const date = a.date ? new Date(a.date).toLocaleDateString(lang === 'ar' ? 'ar-SA-u-nu-latn-ca-gregory' : 'en-GB', { day: 'numeric', month: 'short' }) : '';
    return `
      <article class="ad ad-${a.kind} reveal" style="--d:${(i % 3) * 0.06}s">
        <div class="ad-media">
          ${a.img ? `<img src="assets/img/${a.img}" alt="" loading="lazy">` : `<span class="ad-ph">${icon(a.kind === 'request' ? 'search' : (ty.icon || 'home'))}</span>`}
          <span class="ad-kind">${icon(a.kind === 'request' ? 'search' : 'tag')} ${t(KIND[a.kind])}</span>
          <span class="ad-deal">${t(deal(a.deal) || {})}</span>
          ${a.sample ? `<span class="ad-sample">${T('إعلان تجريبي', 'Sample ad')}</span>` : ''}
        </div>
        <div class="ad-body">
          <div class="ad-meta"><span>${icon(ty.icon || 'home')} ${typeName(a.type, true)}</span><span>#${a.id}${date ? ` · ${date}` : ''}</span></div>
          <h3>${esc(t(a.title))}</h3>
          <div class="ad-loc">${icon('map-pin')} ${where}</div>
          ${specs ? `<div class="ad-specs">${specs}</div>` : ''}
          <div class="ad-foot">
            ${adPrice(a)}
            <span class="ad-actions">
              <a class="ad-btn wa" href="${waLink(msg)}" target="_blank" rel="noopener" aria-label="${T('تواصل عبر واتساب', 'WhatsApp')}">${WA_SVG.replace('class="wa-logo"', 'style="width:1.15em;height:1.15em"')}</a>
              <a class="ad-btn" href="${telLink()}" aria-label="${T('اتصل', 'Call')}">${icon('phone')}</a>
            </span>
          </div>
        </div>
      </article>`;
  }

  // Post an offer / request → formatted WhatsApp message to the office for review and publishing
  function openPost(kind = 'offer', preset = {}) {
    if (!M) return;
    let k = kind === 'request' ? 'request' : 'offer';
    const d0 = deal(preset.deal) ? preset.deal : 'rent';
    const typeOpts = (dl, sel) => `<option value="">${T('اختر نوع العقار', 'Choose property type')}</option>` +
      deal(dl).types.map((x) => `<option value="${x}"${x === sel ? ' selected' : ''}>${typeName(x, true)}</option>`).join('');
    const head = () => k === 'offer'
      ? [icon('megaphone'), T('أضف عرضك — عندي عقار', 'List your property'), T('اكتب بيانات عقارك وسيصلنا على واتساب، نراجعه وننشره في سوق العقار.', 'Fill in your property details — it reaches us on WhatsApp and we publish it after a quick review.')]
      : [icon('search'), T('أضف طلبك — أبحث عن عقار', 'Post what you need'), T('اكتب مواصفات العقار الذي تبحث عنه وسننشر طلبك ونبحث لك عن الأنسب.', 'Describe the property you need — we post your request and search for the best match.')];
    const [hIco, hTitle, hText] = head();

    const box = showModal(`
      <div class="modal-head">
        <button class="modal-close" type="button" data-modal-close aria-label="${T('إغلاق', 'Close')}">${icon('x')}</button>
        <div class="ico" data-h-ico>${hIco}</div>
        <small>${T('سوق العقار — عرض وطلب', 'Property market — offers & requests')}</small>
        <h3 id="mTitle" data-h-title>${hTitle}</h3>
        <p data-h-text>${hText}</p>
      </div>
      <div class="modal-body">
        <form novalidate class="post-form">
          <div class="seg seg-kind" role="radiogroup" aria-label="${T('نوع الإعلان', 'Ad type')}">
            <label><input type="radio" name="kind" value="offer"${k === 'offer' ? ' checked' : ''}><span>${icon('tag')} ${T('عندي عقار (عرض)', 'I have a property')}</span></label>
            <label><input type="radio" name="kind" value="request"${k === 'request' ? ' checked' : ''}><span>${icon('search')} ${T('أبحث عن عقار (طلب)', 'I am looking')}</span></label>
          </div>
          <div class="field full">
            <label>${T('القسم', 'Section')} <span class="req">*</span></label>
            <div class="seg seg-deal">
              ${M.deals.map((dl) => `<label><input type="radio" name="deal" value="${dl.id}"${dl.id === d0 ? ' checked' : ''}><span>${icon(dl.icon)} ${t(dl)}</span></label>`).join('')}
            </div>
          </div>
          <div class="form-grid">
            <div class="field">
              <label for="f-ptype">${T('نوع العقار', 'Property type')} <span class="req">*</span></label>
              <select id="f-ptype" name="ptype" required>${typeOpts(d0, preset.type)}</select>
              <div class="err">${T('فضلاً اختر نوع العقار', 'Please choose the property type')}</div>
            </div>
            <div class="field">
              <label for="f-city">${T('المدينة', 'City')} <span class="req">*</span></label>
              <select id="f-city" name="city" required>${cityOptions()}</select>
              <div class="err">${T('فضلاً اختر المدينة', 'Please choose your city')}</div>
            </div>
            <div class="field">
              <label for="f-district">${T('الحي', 'District')}</label>
              <input id="f-district" name="district" placeholder="${T('مثال: حي النرجس', 'e.g. Al Narjis')}">
            </div>
            <div class="field">
              <label for="f-price" data-price-label>${k === 'offer' ? T('السعر المطلوب', 'Asking price') : T('الميزانية', 'Budget')}</label>
              <input id="f-price" name="price" inputmode="numeric" placeholder="${T('مثال: 45,000 ريال سنوياً', 'e.g. SAR 45,000 / year')}">
            </div>
            <div class="field">
              <label for="f-area">${T('المساحة (م²)', 'Area (m²)')}</label>
              <input id="f-area" name="area" inputmode="numeric" placeholder="${T('اختياري', 'Optional')}">
            </div>
            <div class="field">
              <label for="f-rooms">${T('عدد الغرف', 'Bedrooms')}</label>
              <input id="f-rooms" name="rooms" inputmode="numeric" placeholder="${T('اختياري', 'Optional')}">
            </div>
            <div class="field full">
              <label for="f-notes" data-notes-label>${k === 'offer' ? T('وصف العقار', 'Property description') : T('مواصفات العقار المطلوب', 'What you are looking for')}</label>
              <textarea id="f-notes" name="notes" placeholder="${T('عدد الأدوار، عمر العقار، المميزات، الواجهة…', 'Floors, age, features, frontage…')}"></textarea>
            </div>
            <div class="field full" data-offer-only${k === 'offer' ? '' : ' hidden'}>
              <label for="f-license">${T('رقم ترخيص الإعلان العقاري (إن وجد)', 'Property ad license no. (if any)')}</label>
              <input id="f-license" name="license" dir="ltr" placeholder="${T('اختياري — نساعدك في استخراجه', 'Optional — we can help you get one')}">
            </div>
            <div class="field">
              <label for="f-name">${T('الاسم', 'Full name')} <span class="req">*</span></label>
              <input id="f-name" name="name" autocomplete="name" required placeholder="${T('اسمك الكريم', 'Your name')}">
              <div class="err">${T('فضلاً اكتب اسمك', 'Please enter your name')}</div>
            </div>
            <div class="field">
              <label for="f-phone">${T('رقم الجوال', 'Mobile number')} <span class="req">*</span></label>
              <input id="f-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" dir="ltr" required placeholder="05XXXXXXXX">
              <div class="err">${T('رقم جوال سعودي صحيح يبدأ بـ 05', 'A valid Saudi mobile starting with 05')}</div>
            </div>
          </div>
          <div class="form-actions">
            <button class="btn btn-wa" type="submit">${WA_SVG.replace('class="wa-logo"', 'style="width:1.2em;height:1.2em"')} ${T('إرسال الإعلان عبر واتساب', 'Send via WhatsApp')}</button>
          </div>
          <p class="form-note">${icon('images')} ${T('عندك صور للعقار؟ أرسلها في نفس محادثة واتساب بعد الإرسال.', 'Have photos? Send them in the same WhatsApp chat after sending.')}</p>
        </form>
      </div>`);

    const form = box.querySelector('form');
    const city = form.querySelector('#f-city');
    if (preset.city) city.value = cityName(preset.city);
    form.addEventListener('change', (e) => {
      if (e.target.name === 'deal') {
        form.querySelector('#f-ptype').innerHTML = typeOpts(e.target.value, form.querySelector('#f-ptype').value);
      }
      if (e.target.name === 'kind') {
        k = e.target.value;
        const [i2, t2, p2] = head();
        box.querySelector('[data-h-ico]').innerHTML = i2;
        box.querySelector('[data-h-title]').textContent = t2;
        box.querySelector('[data-h-text]').textContent = p2;
        box.querySelector('[data-price-label]').textContent = k === 'offer' ? T('السعر المطلوب', 'Asking price') : T('الميزانية', 'Budget');
        box.querySelector('[data-notes-label]').textContent = k === 'offer' ? T('وصف العقار', 'Property description') : T('مواصفات العقار المطلوب', 'What you are looking for');
        box.querySelector('[data-offer-only]').hidden = k !== 'offer';
        drawIcons();
      }
    });
    form.addEventListener('input', (e) => {
      const f = e.target.closest('.field');
      if (f && f.classList.contains('invalid')) f.classList.remove('invalid');
    });
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!validate(form)) return;
      const v = Object.fromEntries(new FormData(form).entries());
      const lines = [
        T('مرحباً مركز الخدمات المتكاملة،', 'Hello Integrated Services Center,'),
        v.kind === 'offer' ? T('أرغب في نشر عرض عقاري في سوق العقار:', 'I would like to list a property on the market:')
                           : T('أرغب في نشر طلب عقاري في سوق العقار:', 'I would like to post a property request:'),
        '',
        `• ${T('نوع الإعلان', 'Ad type')}: ${v.kind === 'offer' ? T('عرض (عندي عقار)', 'Offer') : T('طلب (أبحث عن عقار)', 'Request')}`,
        `• ${T('القسم', 'Section')}: ${t(deal(v.deal))}`,
        `• ${T('نوع العقار', 'Property type')}: ${typeName(v.ptype, true)}`,
        `• ${T('المدينة', 'City')}: ${v.city}${v.district ? ` — ${v.district}` : ''}`
      ];
      if (v.price) lines.push(`• ${v.kind === 'offer' ? T('السعر', 'Price') : T('الميزانية', 'Budget')}: ${v.price}`);
      if (v.area) lines.push(`• ${T('المساحة', 'Area')}: ${v.area} ${T('م²', 'm²')}`);
      if (v.rooms) lines.push(`• ${T('الغرف', 'Bedrooms')}: ${v.rooms}`);
      if (v.notes) lines.push(`• ${T('التفاصيل', 'Details')}: ${v.notes}`);
      if (v.kind === 'offer' && v.license) lines.push(`• ${T('رقم ترخيص الإعلان', 'Ad license')}: ${v.license}`);
      lines.push(`• ${T('الاسم', 'Name')}: ${v.name}`, `• ${T('الجوال', 'Mobile')}: ${v.phone}`);
      window.open(waLink(lines.join('\n')), '_blank', 'noopener');
      toast(T('تم تجهيز إعلانك — أرسله عبر واتساب وسننشره بعد المراجعة', 'Your ad is ready — send it on WhatsApp and we will publish it after review'));
      setTimeout(closeModal, 600);
    });
  }

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

  // Real estate page: section (rent / sale / invest) → property type → market
  function renderDeals() {
    const root = document.getElementById('dealPicker');
    if (!root || !M) return;
    const steps = `
      <ol class="flow-steps reveal">
        <li class="on" data-step="1"><b>1</b> ${T('اختر القسم', 'Choose a section')}</li>
        <li data-step="2"><b>2</b> ${T('اختر نوع العقار', 'Choose property type')}</li>
        <li data-step="3"><b>3</b> ${T('تصفّح أو أضف إعلانك', 'Browse or post')}</li>
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
    const open = (id, scroll = true) => {
      const d = deal(id);
      if (!d) return;
      root.querySelectorAll('[data-deal]').forEach((b) => {
        b.classList.toggle('selected', b.dataset.deal === id);
        b.setAttribute('aria-expanded', b.dataset.deal === id ? 'true' : 'false');
      });
      root.querySelectorAll('.flow-steps li').forEach((li) => li.classList.toggle('on', +li.dataset.step <= 2));
      panel.innerHTML = `
        <div class="type-head">
          <span class="ico">${icon(d.icon)}</span>
          <div><h3>${T('اختر نوع العقار', 'Choose property type')} — <span class="accent">${t(d)}</span></h3>
          <p>${T('اضغط على النوع لتشاهد العروض والطلبات المتاحة', 'Tap a type to see available offers and requests')}</p></div>
        </div>
        <div class="type-grid">
          ${d.types.map((k, i) => {
            const n = adsFor({ deal: d.id, type: k }).length;
            return `<a class="type-tile" style="--i:${i}" href="${marketUrl({ deal: d.id, type: k })}">
              <span class="ico">${icon(M.types[k].icon)}</span>
              <b>${typeName(k)}</b>
              <small>${n ? `${n} ${T('إعلان', 'ads')}` : T('أضف أول إعلان', 'Be the first')}</small>
            </a>`;
          }).join('')}
        </div>
        <div class="type-actions">
          <a class="btn btn-navy" href="${marketUrl({ deal: d.id })}">${icon('layout-grid')} ${T('كل إعلانات', 'All ads:')} ${t(d)}</a>
          <button class="btn btn-gold" type="button" data-post="offer" data-post-deal="${d.id}">${icon('tag')} ${T('اعرض عقارك', 'List a property')}</button>
          <button class="btn btn-outline" type="button" data-post="request" data-post-deal="${d.id}">${icon('search')} ${T('اطلب عقار', 'Request a property')}</button>
        </div>`;
      panel.hidden = false;
      panel.classList.remove('show');
      void panel.offsetWidth; // restart the entrance animation
      panel.classList.add('show');
      drawIcons();
      if (scroll) setTimeout(() => panel.scrollIntoView({ behavior: prefersReduced ? 'auto' : 'smooth', block: 'center' }), 60);
    };
    root._open = open;
    root.querySelectorAll('[data-deal]').forEach((b) => b.addEventListener('click', () => open(b.dataset.deal)));
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
    document.querySelectorAll('[data-total-services]').forEach((el) => { el.dataset.countTo = TOTAL; });
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
      window.scrollTo(0, y);
      document.body.classList.remove('lang-switching');
    }, 150);
  }

  /* ---------------- Contact form ---------------- */
  function renderContactForm() {
    const holder = document.getElementById('contactForm');
    if (!holder) return;
    holder.innerHTML = `
      <form novalidate>
        ${requestFields(true)}
        <div class="form-actions">
          <button class="btn btn-wa" type="submit">${WA_SVG.replace('class="wa-logo"', 'style="width:1.2em;height:1.2em"')} ${T('إرسال الطلب عبر واتساب', 'Send via WhatsApp')}</button>
          <a class="btn btn-outline" href="mailto:${S.email}">${icon('mail')} ${T('راسلنا بالبريد', 'Email us')}</a>
        </div>
        <p class="form-note">${icon('shield-check')} ${T('بياناتك محمية ولا تُستخدم إلا للتواصل بخصوص طلبك.', 'Your data is protected and used only to contact you about your request.')}</p>
      </form>`;
    bindRequestForm(holder.querySelector('form'), null);
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

  /* ---------------- Boot ---------------- */
  renderAll();
  initIntro();
  initTilt();
  initScroll();

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
})();
