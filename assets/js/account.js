/* =========================================================
   Customer account: requests, ads, documents (ad licence · commercial register · Fal licence), profile
   ========================================================= */
(function () {
  'use strict';
  const I = window.ISC;
  const { T, t, esc, icon, drawIcons, toast, A } = I;
  const $ = (r, s) => r.querySelector(s);
  const $$ = (r, s) => [...r.querySelectorAll(s)];
  const root = document.getElementById('acct');
  let tab = (location.hash || '#requests').slice(1);

  const ST_REQ = { new: ['جديد', 'New'], in_progress: ['قيد التنفيذ', 'In progress'], waiting: ['بانتظار ردك', 'Waiting for you'], completed: ['مكتمل', 'Completed'], cancelled: ['ملغي', 'Cancelled'] };
  const ST_AD = { pending: ['قيد المراجعة', 'Under review'], published: ['منشور', 'Published'], rejected: ['مرفوض', 'Rejected'], closed: ['مغلق', 'Closed'] };
  const ST_DOC = { pending: ['قيد التوثيق', 'Pending review'], verified: ['موثّقة', 'Verified'], rejected: ['مرفوضة', 'Rejected'] };
  const TYPE_REQ = { service: ['طلب خدمة', 'Service request', 'send'], appointment: ['حجز موعد', 'Appointment', 'calendar-check'], contact: ['رسالة', 'Message', 'mail'], inquiry: ['استفسار عن إعلان', 'Ad inquiry', 'message-square-text'], property_request: ['طلب عقار', 'Property request', 'clipboard-list'] };
  const DOCS = {
    adLicense: { ico: 'megaphone', ar: 'رخصة الإعلان العقاري', en: 'Real-estate advertising licence', dAr: 'ترخيص الإعلان الصادر من الهيئة العامة للعقار — يظهر رقمه على إعلاناتك.', dEn: 'The advertising licence issued by REGA — its number shows on your ads.' },
    cr: { ico: 'building-2', ar: 'السجل التجاري', en: 'Commercial register (CR)', dAr: 'السجل التجاري للمنشأة أو المؤسسة.', dEn: 'Your establishment’s commercial register.' },
    fal: { ico: 'badge-check', ar: 'رخصة فال (الوساطة العقارية)', en: 'Fal licence (brokerage)', dAr: 'رخصة فال للوسطاء العقاريين.', dEn: 'The Fal brokerage licence for real-estate brokers.' }
  };
  const fmtDT = (iso) => new Date(iso).toLocaleString(I.lang === 'ar' ? 'ar-SA-u-nu-latn-ca-gregory' : 'en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  const fmtD = (d) => new Date(d + 'T00:00:00Z').toLocaleDateString(I.lang === 'ar' ? 'ar-SA-u-nu-latn-ca-gregory' : 'en-GB', { timeZone: 'UTC', weekday: 'long', day: 'numeric', month: 'long' });
  const lbl = (m, k) => T(m[k][0], m[k][1]);
  const pill = (cls, text) => `<span class="st ${cls}">${text}</span>`;

  async function confirmBox(msg) { return window.confirm(msg); }

  function layout(u) {
    const staff = u.role === 'admin' || u.role === 'staff';
    root.innerHTML = `
      <aside class="acct-side">
        <div class="acct-who"><div class="av">${esc(u.name.trim()[0] || '?')}</div><b>${esc(u.name)}</b><small dir="ltr">${esc(u.phone)}</small></div>
        <nav class="acct-nav">
          <button data-tab="requests">${icon('list-checks')} ${T('طلباتي ومواعيدي', 'Requests & appointments')}</button>
          <button data-tab="ads">${icon('megaphone')} ${T('إعلاناتي', 'My ads')}</button>
          <button data-tab="docs">${icon('badge-check')} ${T('الوثائق والتراخيص', 'Documents & licences')}</button>
          <button data-tab="profile">${icon('settings')} ${T('بياناتي وكلمة المرور', 'Profile & password')}</button>
          ${staff ? `<a href="admin.html">${icon('layout-dashboard')} ${T('لوحة التحكم', 'Dashboard')}</a>` : ''}
          <button data-act="logout">${icon('log-out')} ${T('تسجيل الخروج', 'Log out')}</button>
        </nav>
      </aside>
      <section class="acct-main" id="acctMain"></section>`;
    $$(root, '[data-tab]').forEach((b) => b.addEventListener('click', () => go(b.dataset.tab)));
    $(root, '[data-act=logout]').addEventListener('click', async () => { await A.logout(); location.href = 'index.html'; });
  }

  function go(name) {
    tab = ['requests', 'ads', 'docs', 'profile'].includes(name) ? name : 'requests';
    history.replaceState(null, '', '#' + tab);
    $$(root, '[data-tab]').forEach((b) => b.classList.toggle('active', b.dataset.tab === tab));
    const main = $(root, '#acctMain');
    main.innerHTML = `<div class="acct-empty">${icon('loader')} ${T('جاري التحميل…', 'Loading…')}</div>`;
    drawIcons();
    ({ requests: viewRequests, ads: viewAds, docs: viewDocs, profile: viewProfile })[tab](main).catch((e) => { main.innerHTML = `<div class="form-error">${esc(e.message)}</div>`; });
  }

  /* ---- requests ---- */
  async function viewRequests(main) {
    const { requests } = await A.get('/me/requests');
    const body = requests.length ? requests.map((r) => {
      const ty = TYPE_REQ[r.type] || ['طلب', 'Request', 'send'];
      const what = r.service ? T(r.service.titleAr, r.service.titleEn) : r.property ? `${I.typeName(r.property.type, true)} — ${t(I.deal(r.property.deal) || {})}` : r.type === 'inquiry' ? `#${r.listingId}` : T(ty[0], ty[1]);
      return `<div class="row-card" data-id="${r.id}">
        <div class="rc-top"><h4>${icon(ty[2])} ${esc(what)}</h4>${pill(r.status, lbl(ST_REQ, r.status))}</div>
        <div class="rc-meta"><span dir="ltr">${esc(r.ref)}</span><span>${T(ty[0], ty[1])}</span><span>${fmtDT(r.createdAt)}</span>${r.appointment ? `<span>${icon('calendar-check')} ${fmtD(r.appointment.date)} — ${esc(r.appointment.time)}</span>` : ''}</div>
        ${r.history && r.history.length ? `<ul class="timeline">${r.history.slice().reverse().map((h) => `<li><b>${lbl(ST_REQ, h.status)}</b>${h.note ? ` — ${esc(h.note)}` : ''}<small>${fmtDT(h.at)}</small></li>`).join('')}</ul>` : ''}
        ${['new', 'waiting'].includes(r.status) ? `<div class="rc-act"><button class="btn btn-outline btn-sm" data-cancel="${r.id}">${icon('x')} ${T('إلغاء الطلب', 'Cancel request')}</button></div>` : ''}
      </div>`;
    }).join('') : `<div class="acct-empty">${icon('inbox')}<p>${T('لا توجد طلبات بعد.', 'No requests yet.')}</p><a class="btn btn-gold" href="general-services.html">${T('تصفّح الخدمات', 'Browse services')}</a></div>`;
    main.innerHTML = `<h2>${icon('list-checks')} ${T('طلباتي ومواعيدي', 'My requests & appointments')}</h2>${body}`;
    drawIcons();
    $$(main, '[data-cancel]').forEach((b) => b.addEventListener('click', async () => {
      if (!await confirmBox(T('هل تريد إلغاء هذا الطلب؟', 'Cancel this request?'))) return;
      try { await A.post(`/me/requests/${b.dataset.cancel}/cancel`); toast(T('تم إلغاء الطلب', 'Request cancelled')); go('requests'); } catch (e) { toast(e.message); }
    }));
  }

  /* ---- ads ---- */
  async function viewAds(main) {
    const { listings } = await A.get('/me/listings');
    const body = listings.length ? listings.map((l) => `
      <div class="row-card">
        <div class="rc-top"><h4>${icon(l.kind === 'request' ? 'search' : 'tag')} ${esc(t(l.title))}</h4>${pill(l.status, lbl(ST_AD, l.status))}</div>
        <div class="rc-meta"><span>#${l.id}</span><span>${t(I.KIND[l.kind])}</span><span>${t(I.deal(l.deal) || {})}</span><span>${I.cityName(l.city)}</span>${l.price ? `<span>${I.fmtNum(l.price)} ${T('ريال', 'SAR')}</span>` : ''}</div>
        ${l.rejectReason ? `<div class="form-error" style="margin-top:10px">${T('سبب الرفض', 'Reason')}: ${esc(l.rejectReason)}</div>` : ''}
        <div class="rc-act">
          ${l.status === 'closed' ? `<button class="btn btn-outline btn-sm" data-reopen="${l.id}">${icon('rotate-ccw')} ${T('إعادة فتح', 'Reopen')}</button>` : `<button class="btn btn-outline btn-sm" data-close="${l.id}">${icon('circle-check')} ${l.deal === 'rent' ? T('تم التأجير', 'Mark rented') : T('تم البيع / الإغلاق', 'Mark sold / closed')}</button>`}
          <button class="btn btn-outline btn-sm" data-del="${l.id}">${icon('trash-2')} ${T('حذف', 'Delete')}</button>
        </div>
      </div>`).join('') : `<div class="acct-empty">${icon('megaphone')}<p>${T('لم تضف إعلانات بعد.', 'You have no ads yet.')}</p></div>`;
    main.innerHTML = `<h2>${icon('megaphone')} ${T('إعلاناتي', 'My ads')}</h2>
      <div class="form-actions" style="margin:0 0 18px"><button class="btn btn-gold" data-post="offer" style="flex:none">${icon('plus')} ${T('أضف عرضاً', 'Add an offer')}</button><button class="btn btn-outline" data-post="request" style="flex:none">${icon('clipboard-list')} ${T('أضف طلب عقار', 'Request a property')}</button></div>${body}`;
    drawIcons();
    const act = (sel, fn) => $$(main, sel).forEach((b) => b.addEventListener('click', async () => { try { await fn(b); go('ads'); } catch (e) { toast(e.message); } }));
    act('[data-close]', (b) => A.patch(`/me/listings/${b.dataset.close}`, { action: 'close' }));
    act('[data-reopen]', (b) => A.patch(`/me/listings/${b.dataset.reopen}`, { action: 'reopen' }));
    act('[data-del]', async (b) => { if (!await confirmBox(T('حذف الإعلان نهائياً؟', 'Delete this ad permanently?'))) throw new Error(''); await A.del(`/me/listings/${b.dataset.del}`); });
  }

  /* ---- documents ---- */
  async function viewDocs(main) {
    const { user } = await A.get('/auth/me'); A.user = user;
    const docs = user.docs || {};
    main.innerHTML = `<h2>${icon('badge-check')} ${T('الوثائق والتراخيص', 'Documents & licences')}</h2>
      <p style="color:var(--gray)">${T('أضف رخصة الإعلان والسجل التجاري ورخصة فال لتحصل على شارة «معلن موثّق» وتزيد ثقة العملاء في إعلاناتك. تُراجع الوثائق من فريقنا ولا تظهر لأحد سوانا.', 'Add your ad licence, commercial register and Fal licence to earn the “Verified advertiser” badge. Our team reviews them; nobody else can see the files.')}</p>
      ${Object.keys(DOCS).map((k) => {
        const m = DOCS[k]; const d = docs[k];
        return `<div class="doc-card ${d ? d.status : ''}" data-doc="${k}">
          <div class="ico">${icon(m.ico)}</div>
          <div>
            <h4>${T(m.ar, m.en)} ${d ? pill(d.status, lbl(ST_DOC, d.status)) : ''}</h4>
            <p>${T(m.dAr, m.dEn)}</p>
            ${d && d.status === 'rejected' && d.note ? `<div class="note">${T('سبب الرفض', 'Reason')}: ${esc(d.note)}</div>` : ''}
            <form novalidate>
              <div class="form-grid">
                <div class="field"><label>${T('رقم الوثيقة', 'Number')} <span class="req">*</span></label><input name="number" dir="ltr" required value="${esc(d ? d.number : '')}"><div class="err">${T('اكتب الرقم', 'Enter the number')}</div></div>
                <div class="field"><label>${T('تاريخ الانتهاء', 'Expiry date')}</label><input name="expiry" type="date" value="${esc(d ? d.expiry : '')}"></div>
                <div class="field full"><label>${T('صورة أو PDF للوثيقة', 'Image or PDF')} ${d && d.file ? `<a href="/api/files/doc/${esc(d.file)}" target="_blank" rel="noopener" style="color:var(--gold-d)">(${T('عرض الملف الحالي', 'view current file')})</a>` : '<span class="req">*</span>'}</label><input name="file" type="file" accept="image/*,application/pdf"></div>
              </div>
              <div class="form-error" hidden></div>
              <div class="rc-act"><button class="btn btn-navy btn-sm" type="submit">${icon('upload')} ${d ? T('تحديث وإعادة إرسال', 'Update & resubmit') : T('رفع للتوثيق', 'Submit for verification')}</button>
              ${d ? `<button class="btn btn-outline btn-sm" type="button" data-rm>${icon('trash-2')} ${T('حذف', 'Remove')}</button>` : ''}</div>
            </form>
          </div></div>`;
      }).join('')}`;
    drawIcons();
    $$(main, '.doc-card').forEach((card) => {
      const type = card.dataset.doc; const form = $(card, 'form'); const err = $(card, '.form-error');
      $(card, '[data-rm]') && $(card, '[data-rm]').addEventListener('click', async () => { if (await confirmBox(T('حذف هذه الوثيقة؟', 'Remove this document?'))) { await A.del(`/me/docs/${type}`); go('docs'); } });
      form.addEventListener('submit', async (e) => {
        e.preventDefault(); err.hidden = true;
        const num = form.elements.number.value.trim();
        form.elements.number.closest('.field').classList.toggle('invalid', !num);
        if (!num) return;
        const btn = $(form, '[type=submit]'); btn.disabled = true;
        try {
          let file = '';
          const f = form.elements.file.files[0];
          if (f) file = (await A.uploadDoc(f)).file;
          await A.post('/me/docs', { type, number: num, expiry: form.elements.expiry.value, file });
          toast(T('تم الإرسال — سنراجع الوثيقة قريباً', 'Submitted — we will review it soon'));
          go('docs');
        } catch (ex) { err.textContent = ex.message; err.hidden = false; btn.disabled = false; }
      });
    });
  }

  /* ---- profile ---- */
  async function viewProfile(main) {
    const u = A.user;
    main.innerHTML = `<h2>${icon('settings')} ${T('بياناتي', 'My details')}</h2>
      <form id="pf" novalidate>
        <div class="form-grid">
          <div class="field"><label>${T('الاسم', 'Name')}</label><input name="name" value="${esc(u.name)}" required></div>
          <div class="field"><label>${T('رقم الجوال', 'Mobile')}</label><input value="${esc(u.phone)}" dir="ltr" disabled></div>
          <div class="field"><label>${T('البريد الإلكتروني', 'Email')}</label><input name="email" type="email" dir="ltr" value="${esc(u.email || '')}"></div>
          <div class="field"><label>${T('المدينة', 'City')}</label><select name="city">${I.cityOptions()}</select></div>
          <div class="field full"><label>${T('نوع الحساب', 'Account type')}</label>
            <div class="chips">${[['individual', 'user', T('فرد / مالك', 'Individual / owner')], ['broker', 'briefcase', T('وسيط عقاري', 'Broker')], ['company', 'building-2', T('شركة / مؤسسة', 'Company')]].map(([v, i, l]) => `<label class="chip"><input type="radio" name="type" value="${v}"${u.type === v ? ' checked' : ''}><span>${icon(i)} ${l}</span></label>`).join('')}</div></div>
        </div>
        <div class="form-error" hidden></div>
        <div class="form-actions"><button class="btn btn-gold" type="submit" style="flex:none">${icon('save')} ${T('حفظ', 'Save')}</button></div>
      </form>
      <h2 style="margin-top:36px">${icon('key-round')} ${T('تغيير كلمة المرور', 'Change password')}</h2>
      <form id="pw" novalidate>
        <div class="form-grid">
          <div class="field"><label>${T('كلمة المرور الحالية', 'Current password')}</label><input name="current" type="password" autocomplete="current-password" required></div>
          <div class="field"><label>${T('كلمة المرور الجديدة', 'New password')}</label><input name="password" type="password" autocomplete="new-password" minlength="8" required></div>
        </div>
        <div class="form-error" hidden></div>
        <div class="form-actions"><button class="btn btn-navy" type="submit" style="flex:none">${icon('lock')} ${T('تحديث كلمة المرور', 'Update password')}</button></div>
      </form>`;
    drawIcons();
    const pf = $(main, '#pf'); pf.elements.city.value = u.city || '';
    const run = (form, fn) => form.addEventListener('submit', async (e) => {
      e.preventDefault(); const er = $(form, '.form-error'); er.hidden = true;
      try { await fn(Object.fromEntries(new FormData(form).entries())); } catch (ex) { er.textContent = ex.message; er.hidden = false; }
    });
    run(pf, async (v) => { const r = await A.patch('/me', { name: v.name, email: v.email, city: v.city, type: v.type }); A.user = r.user; I.refreshHeader(); toast(T('تم الحفظ', 'Saved')); });
    run($(main, '#pw'), async (v) => { await A.post('/me/password', v); toast(T('تم تغيير كلمة المرور', 'Password changed')); $(main, '#pw').reset(); });
  }

  I.onReady = async function () {
    if (!A.online) { root.innerHTML = `<div class="notice" style="grid-column:1/-1">${icon('wifi-off')}<div><b>${T('الخدمة غير متاحة حالياً', 'Service unavailable')}</b></div></div>`; drawIcons(); return; }
    if (!A.user) { location.replace('login.html?next=account.html'); return; }
    layout(A.user);
    if (A.user.mustChangePassword) { tab = 'profile'; toast(T('غيّر كلمة المرور المؤقتة من فضلك', 'Please change your temporary password')); }
    go(tab);
    window.addEventListener('hashchange', () => go(location.hash.slice(1)));
  };
})();
