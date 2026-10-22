/* =========================================================
   Property page — every detail of one ad: gallery, price, location, area, rooms, full specs, advertiser, inquiry
   property.html?id=1012
   ========================================================= */
(function () {
  'use strict';
  const I = window.ISC;
  const { T, t, esc, icon, drawIcons, A, M } = I;
  const PROP = window.PROP;
  const root = document.getElementById('propRoot');
  const id = Number(new URLSearchParams(location.search).get('id'));

  const nf = (n) => I.fmtNum(n);
  const lang = () => I.lang;

  function fmtVal(key, val) {
    const f = PROP.FIELDS[key];
    if (!f) return String(val);
    if (f.kind === 'bool') return T('نعم', 'Yes');
    if (f.kind === 'count' || f.kind === 'number') return nf(val) + (/area|Area|buildArea|streetWidth|frontage/.test(key) ? ` ${/street|front/i.test(key) ? T('م', 'm') : T('م²', 'm²')}` : /income|capital/.test(key) ? ` ${T('ريال', 'SAR')}` : '');
    return PROP.labelOf(key, val, lang());
  }

  /* rows grouped by the same sections the property form uses */
  function specGroups(a) {
    const d = Object.assign({}, a.details || {});
    const groups = []; const used = new Set(['budgetMin', 'budgetMax', 'price']);
    const range = (lo, hi, unit) => `${lo ? nf(lo) : 0} – ${hi ? nf(hi) : '∞'} ${unit}`;
    const lay = I.forms.layoutFor(a.type, a.deal);
    lay.forEach(({ sec, fields }) => {
      const rows = [];
      fields.forEach(({ key }) => {
        if (key === 'areaRange') {
          if (d.area) { rows.push([PROP.FIELDS.area.icon, T('المساحة', 'Area'), fmtVal('area', d.area)]); used.add('area'); }
          if (d.areaMin || d.areaMax) { rows.push([PROP.FIELDS.areaMin.icon, T('المساحة المطلوبة', 'Area wanted'), range(d.areaMin, d.areaMax, T('م²', 'm²'))]); used.add('areaMin'); used.add('areaMax'); }
          return;
        }
        if (d[key] === undefined) return;
        used.add(key);
        const f = PROP.FIELDS[key];
        rows.push([f.icon, T(f.ar, f.en), fmtVal(key, d[key])]);
      });
      if (rows.length) groups.push({ title: T(sec.ar, sec.en), rows });
    });
    const rest = Object.keys(d).filter((k) => !used.has(k) && PROP.FIELDS[k]).map((k) => [PROP.FIELDS[k].icon, T(PROP.FIELDS[k].ar, PROP.FIELDS[k].en), fmtVal(k, d[k])]);
    if (rest.length) groups.push({ title: T('تفاصيل أخرى', 'Other details'), rows: rest });
    return groups;
  }

  function highlights(a) {
    const d = a.details || {}; const out = [];
    const push = (ico, label, value) => { if (value !== undefined && value !== null && value !== '' && value !== 0) out.push([ico, label, value]); };
    if (a.kind === 'request') {
      if (d.areaMin || d.areaMax) push('ruler', T('المساحة', 'Area'), `${d.areaMin ? nf(d.areaMin) : 0} – ${d.areaMax ? nf(d.areaMax) : '∞'} ${T('م²', 'm²')}`);
      if (d.bedrooms) push('bed-double', T('غرف النوم', 'Bedrooms'), `${nf(d.bedrooms)}+`);
      if (d.bathrooms) push('bath', T('دورات المياه', 'Bathrooms'), `${nf(d.bathrooms)}+`);
      if (d.livingRooms) push('sofa', T('الصالات', 'Living rooms'), `${nf(d.livingRooms)}+`);
    } else {
      push('ruler', T('المساحة', 'Area'), (d.area || a.area) ? `${nf(d.area || a.area)} ${T('م²', 'm²')}` : '');
      push('bed-double', T('غرف النوم', 'Bedrooms'), d.bedrooms || a.rooms ? nf(d.bedrooms || a.rooms) : '');
      push('bath', T('دورات المياه', 'Bathrooms'), d.bathrooms || a.baths ? nf(d.bathrooms || a.baths) : '');
      push('sofa', T('الصالات', 'Living rooms'), d.livingRooms ? nf(d.livingRooms) : '');
      push('layers-3', T('الأدوار', 'Floors'), d.floors ? nf(d.floors) : '');
      push('building', T('الوحدات', 'Units'), d.units ? nf(d.units) : '');
      if (d.age) push('calendar-clock', T('عمر العقار', 'Age'), PROP.labelOf('age', d.age, lang()));
      if (d.streetWidth) push('route', T('عرض الشارع', 'Street width'), `${nf(d.streetWidth)} ${T('م', 'm')}`);
    }
    return out.slice(0, 6);
  }

  const dateTxt = (iso) => new Date(iso).toLocaleDateString(lang() === 'ar' ? 'ar-SA-u-nu-latn-ca-gregory' : 'en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
  const priceHtml = (a) => {
    if (!a.price) return `<span class="pp-price muted">${T('السعر عند التواصل', 'Price on request')}</span>`;
    const per = a.per === 'month' ? T(' / شهرياً', ' / month') : a.per === 'year' ? T(' / سنوياً', ' / year') : '';
    return `<span class="pp-price">${a.kind === 'request' ? `<small>${T('الميزانية حتى', 'Budget up to')}</small>` : ''}<b>${nf(a.price)}</b> ${T('ريال', 'SAR')}<small>${per}</small></span>`;
  };

  function render(a, similar) {
    const ty = M.types[a.type] || {}; const dl = I.deal(a.deal) || {};
    const imgs = (a.images && a.images.length ? a.images : (a.img ? [a.img] : [])).map((x) => (x.includes('/') ? x : `assets/img/${x}`));
    const title = t(a.title);
    const where = `${I.cityName(a.city)}${a.district && t(a.district) ? ` — ${t(a.district)}` : ''}`;
    const verified = a.verified && (a.verified.ad || a.verified.cr || a.verified.fal);
    const hl = highlights(a);
    const groups = specGroups(a);
    const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${a.district && a.district.ar ? a.district.ar + ' ' : ''}${a.city}`)}`;
    const url = location.origin + location.pathname + `?id=${a.id}`;
    document.title = `${title} | ${t(I.S.name)}`;

    root.innerHTML = `
      <nav class="crumbs-d" aria-label="breadcrumb"><a href="index.html">${T('الرئيسية', 'Home')}</a> ${icon('chevron-left', 'flip-ltr')} <a href="real-estate.html">${T('العقار', 'Real Estate')}</a> ${icon('chevron-left', 'flip-ltr')} <a href="market.html?deal=${a.deal}&kind=${a.kind}">${t(dl)}</a> ${icon('chevron-left', 'flip-ltr')} <span>#${a.id}</span></nav>
      <div class="prop-head">
        <div class="prop-badges"><span class="pb ${a.kind}">${icon(a.kind === 'request' ? 'search' : 'tag')} ${t(I.KIND[a.kind])}</span><span class="pb">${icon(dl.icon || 'key-round')} ${t(dl)}</span><span class="pb">${icon(ty.icon || 'home')} ${I.typeName(a.type, true)}</span>${a.featured ? `<span class="pb feat">${icon('star')} ${T('مميز', 'Featured')}</span>` : ''}${a.sample ? `<span class="pb">${T('إعلان تجريبي', 'Sample ad')}</span>` : ''}</div>
        <h1>${esc(title)}</h1>
        <div class="prop-meta"><span>${icon('map-pin')} ${esc(where)}</span><span>${icon('hash')} ${a.id}</span><span>${icon('calendar')} ${dateTxt(a.date)}</span>${a.views ? `<span>${icon('eye')} ${nf(a.views)} ${T('مشاهدة', 'views')}</span>` : ''}</div>
      </div>
      <div class="prop-wrap">
        <div class="prop-main">
          ${imgs.length ? `<div class="prop-gallery"><div class="pg-main"><img id="pgMain" src="${esc(imgs[0])}" alt="${esc(title)}">${imgs.length > 1 ? `<button class="pg-nav prev" type="button" aria-label="${T('السابق', 'Previous')}">${icon('chevron-right', 'flip-ltr')}</button><button class="pg-nav next" type="button" aria-label="${T('التالي', 'Next')}">${icon('chevron-left', 'flip-ltr')}</button><span class="pg-count"><span id="pgN">1</span> / ${imgs.length}</span>` : ''}</div>
            ${imgs.length > 1 ? `<div class="pg-thumbs">${imgs.map((x, i) => `<button type="button" data-i="${i}" class="${i ? '' : 'on'}"><img src="${esc(x)}" alt=""></button>`).join('')}</div>` : ''}</div>` : `<div class="prop-gallery ph"><span>${icon(ty.icon || 'home')}</span></div>`}

          ${hl.length ? `<div class="prop-facts">${hl.map(([ico, l, v]) => `<div class="fact"><span class="ico">${icon(ico)}</span><b>${esc(v)}</b><small>${l}</small></div>`).join('')}</div>` : ''}

          ${a.description && t(a.description) ? `<section class="prop-sec"><h2>${icon('align-right')} ${T('الوصف', 'Description')}</h2><p class="pp-desc">${esc(t(a.description))}</p></section>` : ''}

          ${groups.map((g) => `<section class="prop-sec"><h2>${icon('list-checks')} ${a.kind === 'request' ? `${T('المتطلبات', 'Requirements')} — ` : ''}${g.title}</h2><div class="spec-list">${g.rows.map(([ico, l, v]) => `<div class="spec"><span>${icon(ico || 'check')} ${esc(l)}</span><b>${esc(v)}</b></div>`).join('')}</div></section>`).join('')}
          ${!groups.length && !hl.length ? `<section class="prop-sec"><p class="muted">${T('لم يضف المعلن تفاصيل إضافية. تواصل معنا لمعرفة المزيد.', 'The advertiser has not added more details. Contact us to know more.')}</p></section>` : ''}

          <section class="prop-sec"><h2>${icon('map-pin')} ${T('الموقع', 'Location')}</h2>
            <div class="spec-list"><div class="spec"><span>${icon('building-2')} ${T('المدينة', 'City')}</span><b>${esc(I.cityName(a.city))}</b></div>${a.district && t(a.district) ? `<div class="spec"><span>${icon('map-pinned')} ${T('الحي', 'District')}</span><b>${esc(t(a.district))}</b></div>` : ''}</div>
            <a class="btn btn-outline btn-sm" style="margin-top:12px" href="${mapUrl}" target="_blank" rel="noopener">${icon('map')} ${T('افتح الموقع على الخريطة', 'Open on the map')}</a></section>
        </div>

        <aside class="prop-side">
          <div class="side-card">
            ${priceHtml(a)}
            ${verified || a.license ? `<div class="ad-trust" style="margin-top:12px">${verified ? `<span class="badge-ok">${icon('badge-check')} ${T('معلن موثّق', 'Verified advertiser')}</span>` : ''}${a.license ? `<span class="badge-lic">${T('ترخيص الإعلان', 'Ad licence')}: ${esc(a.license)}</span>` : ''}</div>` : ''}
            ${verified ? `<ul class="trust-list">${a.verified.fal ? `<li>${icon('check')} ${T('رخصة فال موثّقة', 'Verified Fal licence')}</li>` : ''}${a.verified.ad ? `<li>${icon('check')} ${T('رخصة إعلان موثّقة', 'Verified ad licence')}</li>` : ''}${a.verified.cr ? `<li>${icon('check')} ${T('سجل تجاري موثّق', 'Verified commercial register')}</li>` : ''}</ul>` : ''}
            <h3 id="inquiry">${a.kind === 'request' ? T('عندك عقار مناسب؟', 'Have a matching property?') : T('مهتم بهذا العقار؟', 'Interested in this property?')}</h3>
            <div id="inqHolder">${A.online ? '' : `<p class="muted">${T('الاستفسار غير متاح الآن، اتصل بنا.', 'Inquiries are unavailable now — call us.')}</p>`}</div>
            <a class="btn btn-outline btn-block" href="${I.telLink()}" style="margin-top:10px">${icon('phone')} ${T('اتصل بنا', 'Call us')} <bdi dir="ltr">${esc(I.S.phoneDisplay)}</bdi></a>
            <div class="share-row"><small>${T('مشاركة', 'Share')}</small>
              <a class="ad-btn wa" href="https://wa.me/?text=${encodeURIComponent(`${title}\n${url}`)}" target="_blank" rel="noopener" aria-label="WhatsApp">${I.WA_SVG.replace('class="wa-logo"', 'style="width:1.1em;height:1.1em"')}</a>
              <button class="ad-btn" type="button" id="copyLink" aria-label="${T('نسخ الرابط', 'Copy link')}">${icon('link')}</button></div>
          </div>
        </aside>
      </div>
      ${similar.length ? `<section class="prop-similar"><h2>${T('عقارات مشابهة', 'Similar properties')}</h2><div class="ad-grid">${similar.map((x, i) => I.adCard(x, i)).join('')}</div></section>` : ''}`;
    drawIcons();
    root.querySelectorAll('.ad').forEach((el) => el.classList.add('in'));

    // gallery
    if (imgs.length > 1) {
      let cur = 0;
      const go = (n) => {
        cur = (n + imgs.length) % imgs.length;
        root.querySelector('#pgMain').src = imgs[cur];
        root.querySelector('#pgN').textContent = cur + 1;
        root.querySelectorAll('.pg-thumbs button').forEach((b, i) => b.classList.toggle('on', i === cur));
      };
      root.querySelector('.pg-nav.prev').addEventListener('click', () => go(cur - 1));
      root.querySelector('.pg-nav.next').addEventListener('click', () => go(cur + 1));
      root.querySelectorAll('.pg-thumbs button').forEach((b) => b.addEventListener('click', () => go(+b.dataset.i)));
    }
    root.querySelector('#copyLink').addEventListener('click', async () => {
      try { await navigator.clipboard.writeText(url); I.toast(T('تم نسخ الرابط', 'Link copied')); } catch (e) { I.toast(url); }
    });
    if (A.online) I.forms.mountInquiry(root.querySelector('#inqHolder'), a);
    if (location.hash === '#inquiry') setTimeout(() => root.querySelector('#inquiry').scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
  }

  function notFound() {
    root.innerHTML = `<div class="notfound">${icon('house-plus')}<h2>${T('هذا الإعلان غير متاح', 'This ad is not available')}</h2><p>${T('ربما انتهى أو أُغلق أو الرابط غير صحيح.', 'It may have expired, been closed, or the link is wrong.')}</p><a class="btn btn-gold" href="market.html">${T('تصفّح سوق العقار', 'Browse the property market')}</a></div>`;
    drawIcons();
  }

  I.onReady = async function () {
    if (!id) return notFound();
    let a = null; let list = [];
    if (A.online) {
      try { a = await A.get('/listings/' + id); } catch (e) { a = null; }
      try { list = (await A.get(`/listings?deal=${a ? a.deal : ''}`)).listings; } catch (e) { list = []; }
    } else {
      list = M.listings; a = list.find((x) => x.id === id) || null;
    }
    if (!a) return notFound();
    const similar = list.filter((x) => x.id !== a.id && x.deal === a.deal && x.kind === a.kind).sort((x, y) => (y.type === a.type) - (x.type === a.type)).slice(0, 3);
    render(a, similar);
  };
})();
