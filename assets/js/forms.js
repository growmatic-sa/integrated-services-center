/* =========================================================
   Forms — everything customers send goes to the site (saved in the dashboard), not to WhatsApp.
   - login / sign-up modal
   - service request + appointment booking (every service)
   - property OFFER form and detailed property REQUEST form (rent / sale / investment)
   - ad details + inquiry
   - contact page form
   ========================================================= */
(function () {
  'use strict';
  const I = window.ISC;
  if (!I) return;
  const { T, t, esc, icon, drawIcons, toast, showModal, closeModal, A, S, M, C } = I;
  const PROP = window.PROP;

  const forms = (I.forms = {});

  /* ---------------- tiny helpers ---------------- */
  const $ = (root, sel) => root.querySelector(sel);
  const $$ = (root, sel) => [...root.querySelectorAll(sel)];
  const lang = () => I.lang;
  const spinner = '<span class="spin" aria-hidden="true"></span>';

  function field(id, label, input, { full = false, req = false, err = '', hint = '' } = {}) {
    return `<div class="field${full ? ' full' : ''}">
      <label for="${id}">${label}${req ? ' <span class="req">*</span>' : ''}</label>${input}
      ${hint ? `<small class="hint">${hint}</small>` : ''}${err ? `<div class="err">${err}</div>` : ''}</div>`;
  }
  const nameField = (v = '') => field('f-name', T('الاسم', 'Full name'), `<input id="f-name" name="name" autocomplete="name" required value="${esc(v)}" placeholder="${T('اسمك الكريم', 'Your name')}">`, { req: true, err: T('فضلاً اكتب اسمك', 'Please enter your name') });
  const phoneField = (v = '') => field('f-phone', T('رقم الجوال', 'Mobile number'), `<input id="f-phone" name="phone" type="tel" inputmode="tel" autocomplete="tel" dir="ltr" required value="${esc(v)}" placeholder="05XXXXXXXX">`, { req: true, err: T('رقم جوال سعودي صحيح يبدأ بـ 05', 'A valid Saudi mobile starting with 05') });
  const cityField = (v = '', req = true) => field('f-city', T('المدينة', 'City'), `<select id="f-city" name="city" ${req ? 'required' : ''}>${I.cityOptions()}</select>`, { req, err: T('فضلاً اختر المدينة', 'Please choose your city') });
  const formErr = '<div class="form-error" role="alert" hidden></div>';

  function setErr(form, msg) {
    const box = $(form, '.form-error');
    if (!box) return toast(msg);
    box.textContent = msg; box.hidden = !msg;
    if (msg) box.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
  }
  function offlineMsg(e) {
    return e && e.offline ? T(`تعذّر الإرسال حالياً. تواصل معنا على ${S.phoneDisplay}`, `Could not send right now. Please contact us on ${S.phoneDisplay}`) : (e && e.message) || T('حدث خطأ', 'Something went wrong');
  }
  /* run an async submit with a busy button + error box */
  function guard(form, btn, fn) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (btn.disabled) return;
      setErr(form, '');
      const label = btn.innerHTML;
      btn.disabled = true; btn.innerHTML = `${spinner} ${T('جاري الإرسال…', 'Sending…')}`;
      try { await fn(); }
      catch (err) { setErr(form, offlineMsg(err)); if (err && err.status === 401) { A.user = null; } }
      finally { btn.disabled = false; btn.innerHTML = label; drawIcons(); }
    });
    form.addEventListener('input', (e) => { const f = e.target.closest('.field'); if (f) f.classList.remove('invalid'); });
  }
  const val = (form, n) => (form.elements[n] ? form.elements[n].value.trim() : '');

  function successView(box, { title, text, ref, extra = '', refLabel, track }) {
    $(box, '.modal-body').innerHTML = `
      <div class="success-view">
        <span class="ok-ico">${icon('circle-check')}</span>
        <h3>${title}</h3>
        ${ref ? `<div class="ref-box"><small>${refLabel || T('رقم الطلب', 'Request number')}</small><b dir="ltr">${esc(ref)}</b></div>` : ''}
        <p>${text}</p>
        ${extra}
        <div class="form-actions" style="justify-content:center">
          ${A.user ? `<a class="btn btn-navy" href="${track ? track.href : 'account.html#requests'}">${icon('list-checks')} ${track ? track.label : T('متابعة طلباتي', 'Track my requests')}</a>` : `<a class="btn btn-navy" href="login.html">${icon('user-round-plus')} ${T('أنشئ حساباً لمتابعة طلباتك', 'Create an account to track requests')}</a>`}
          <button class="btn btn-outline" type="button" data-modal-close>${T('إغلاق', 'Close')}</button>
        </div>
      </div>`;
    drawIcons();
    box.scrollTop = 0;
  }

  const modalHead = (ico, small, title, text) => `
    <div class="modal-head">
      <button class="modal-close" type="button" data-modal-close aria-label="${T('إغلاق', 'Close')}">${icon('x')}</button>
      <div class="ico">${icon(ico)}</div>
      <small>${small}</small>
      <h3 id="mTitle">${title}</h3>
      ${text ? `<p>${text}</p>` : ''}
    </div>`;

  /* ---------------- login / sign-up ---------------- */
  function authHtml(mode) {
    const reg = mode === 'register';
    return `
      <div class="auth-tabs" role="tablist">
        <button type="button" class="${reg ? '' : 'active'}" data-auth="login">${T('تسجيل الدخول', 'Log in')}</button>
        <button type="button" class="${reg ? 'active' : ''}" data-auth="register">${T('إنشاء حساب', 'Sign up')}</button>
      </div>
      <form novalidate class="auth-form">
        <div class="form-grid">
          ${reg ? nameField() : ''}
          ${reg ? phoneField() : field('f-login', T('رقم الجوال أو البريد الإلكتروني', 'Mobile or email'), `<input id="f-login" name="login" autocomplete="username" dir="ltr" required placeholder="05XXXXXXXX">`, { req: true, full: true, err: T('اكتب رقم جوالك أو بريدك', 'Enter your mobile or email') })}
          ${reg ? field('f-email', T('البريد الإلكتروني (اختياري)', 'Email (optional)'), '<input id="f-email" name="email" type="email" autocomplete="email" dir="ltr" placeholder="name@example.com">') : ''}
          ${reg ? cityField('', false) : ''}
          ${field('f-pass', T('كلمة المرور', 'Password'), `<input id="f-pass" name="password" type="password" autocomplete="${reg ? 'new-password' : 'current-password'}" required minlength="${reg ? 8 : 1}" placeholder="${reg ? T('8 أحرف على الأقل', 'At least 8 characters') : '••••••••'}">`, { req: true, full: !reg, err: reg ? T('كلمة المرور 8 أحرف على الأقل', 'Password needs 8+ characters') : T('اكتب كلمة المرور', 'Enter your password') })}
          ${reg ? `<div class="field full"><label>${T('نوع الحساب', 'Account type')}</label>
            <div class="chips">
              <label class="chip"><input type="radio" name="type" value="individual" checked><span>${icon('user')} ${T('فرد / مالك', 'Individual / owner')}</span></label>
              <label class="chip"><input type="radio" name="type" value="broker"><span>${icon('briefcase')} ${T('وسيط عقاري', 'Real-estate broker')}</span></label>
              <label class="chip"><input type="radio" name="type" value="company"><span>${icon('building-2')} ${T('شركة / مؤسسة', 'Company')}</span></label>
            </div></div>` : ''}
        </div>
        ${formErr}
        <div class="form-actions"><button class="btn btn-gold btn-block" type="submit">${reg ? icon('user-round-plus') + ' ' + T('إنشاء الحساب', 'Create account') : icon('log-in') + ' ' + T('دخول', 'Log in')}</button></div>
        <p class="form-note">${icon('shield-check')} ${reg ? T('بإنشاء الحساب فإنك توافق على استخدام بياناتك للتواصل بخصوص طلباتك وإعلاناتك فقط.', 'By signing up you agree we use your data only to contact you about your requests and ads.') : T('نسيت كلمة المرور؟ تواصل معنا وسنعيد تعيينها لك.', 'Forgot your password? Contact us and we will reset it.')}</p>
      </form>`;
  }

  /* mount the auth UI into `el`; calls onDone(user) after success */
  forms.mountAuth = function (el, { mode = 'login', onDone } = {}) {
    const draw = (m) => {
      el.innerHTML = authHtml(m);
      drawIcons();
      $$(el, '[data-auth]').forEach((b) => b.addEventListener('click', () => draw(b.dataset.auth)));
      const form = $(el, 'form');
      guard(form, $(form, '[type=submit]'), async () => {
        let ok = true;
        $$(form, '[required]').forEach((x) => {
          let v = x.value.trim() !== '';
          if (v && x.name === 'phone') v = /^(05\d{8}|9665\d{8}|5\d{8})$/.test(x.value.replace(/[\s\-()+]/g, ''));
          if (v && x.name === 'password' && m === 'register') v = x.value.length >= 8;
          x.closest('.field').classList.toggle('invalid', !v);
          if (!v && ok) { x.focus(); ok = false; }
        });
        if (!ok) return;
        const data = Object.fromEntries(new FormData(form).entries());
        const user = m === 'register' ? await A.register(data) : await A.login(data.login, data.password);
        I.refreshHeader();
        toast(T(`أهلاً ${user.name.split(' ')[0]}`, `Welcome ${user.name.split(' ')[0]}`));
        if (onDone) onDone(user);
      });
    };
    draw(mode);
  };

  forms.openAuth = function ({ reason, onDone } = {}) {
    const box = showModal(`${modalHead('user-round', T('حسابك', 'Your account'), T('سجّل دخولك للمتابعة', 'Log in to continue'), reason || T('نحتاج حسابك لنحفظ إعلاناتك وطلباتك وتتابعها من مكان واحد.', 'We need an account so you can save and track your ads and requests.'))}<div class="modal-body" id="authHolder"></div>`);
    forms.mountAuth($(box, '#authHolder'), { onDone: (u) => { closeModal(); if (onDone) setTimeout(() => onDone(u), 250); } });
  };

  function offlineModal() {
    showModal(`${modalHead('wifi-off', T('الخدمة غير متاحة', 'Service unavailable'), T('تعذّر الاتصال بالخادم', 'Cannot reach the server'), T('لن نستطيع حفظ طلبك الآن. تواصل معنا مباشرة وسنخدمك فوراً.', 'We cannot save your request right now. Please contact us directly.'))}
      <div class="modal-body"><div class="form-actions"><a class="btn btn-wa" href="${I.waLink()}" target="_blank" rel="noopener">${T('واتساب', 'WhatsApp')}</a><a class="btn btn-outline" href="${I.telLink()}">${icon('phone')} ${T('اتصل', 'Call')}</a></div></div>`);
  }

  /* ---------------- appointment picker ---------------- */
  const riyadhToday = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Riyadh' }).format(new Date());
  const addDays = (d, n) => { const x = new Date(d + 'T00:00:00Z'); x.setUTCDate(x.getUTCDate() + n); return x.toISOString().slice(0, 10); };
  const dayName = (d, o) => new Date(d + 'T00:00:00Z').toLocaleDateString(lang() === 'ar' ? 'ar-SA-u-nu-latn-ca-gregory' : 'en-GB', Object.assign({ timeZone: 'UTC' }, o));
  const fmtTime = (hhmm) => { const [h, m] = hhmm.split(':').map(Number); const ap = h >= 12 ? T('م', 'PM') : T('ص', 'AM'); return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${ap}`; };

  function appointmentFields() {
    return `
      <div class="field full appt">
        <label>${T('اختر اليوم', 'Pick a day')} <span class="req">*</span></label>
        <div class="day-chips" data-days></div>
        <label style="margin-top:14px">${T('اختر الوقت', 'Pick a time')} <span class="req">*</span></label>
        <div class="slot-chips" data-slots><small class="hint">${T('اختر يوماً لعرض الأوقات المتاحة', 'Pick a day to see the times')}</small></div>
        <input type="hidden" name="date"><input type="hidden" name="time">
        <div class="err">${T('اختر اليوم والوقت', 'Choose a day and time')}</div>
      </div>
      <div class="field full">
        <label>${T('طريقة المقابلة', 'How should we meet?')}</label>
        <div class="chips">
          <label class="chip"><input type="radio" name="mode" value="visit" checked><span>${icon('building-2')} ${T('زيارة المكتب', 'Visit the office')}</span></label>
          <label class="chip"><input type="radio" name="mode" value="call"><span>${icon('phone-call')} ${T('مكالمة هاتفية', 'Phone call')}</span></label>
        </div>
      </div>`;
  }
  function bindAppointment(form) {
    const cfg = S.appointments || { days: [0, 1, 2, 3, 4, 6], maxDaysAhead: 30 };
    const daysEl = $(form, '[data-days]'); const slotsEl = $(form, '[data-slots]');
    const today = riyadhToday();
    const list = [];
    for (let i = 0; i <= cfg.maxDaysAhead && list.length < 14; i++) {
      const d = addDays(today, i);
      if (cfg.days.includes(new Date(d + 'T00:00:00Z').getUTCDay())) list.push(d);
    }
    daysEl.innerHTML = list.map((d) => `<button type="button" class="day-chip" data-d="${d}"><small>${dayName(d, { weekday: 'long' })}</small><b>${dayName(d, { day: 'numeric' })}</b><small>${dayName(d, { month: 'short' })}</small></button>`).join('');
    daysEl.addEventListener('click', async (e) => {
      const b = e.target.closest('[data-d]'); if (!b) return;
      $$(daysEl, '.day-chip').forEach((x) => x.classList.toggle('active', x === b));
      form.elements.date.value = b.dataset.d; form.elements.time.value = '';
      slotsEl.innerHTML = `<small class="hint">${T('جاري تحميل الأوقات…', 'Loading times…')}</small>`;
      try {
        const r = await A.get('/slots?date=' + b.dataset.d);
        slotsEl.innerHTML = r.open && r.slots.length
          ? r.slots.map((s) => `<button type="button" class="slot-chip" data-t="${s.time}" ${s.left ? '' : 'disabled'}>${fmtTime(s.time)}${s.left ? '' : `<small>${T('مكتمل', 'Full')}</small>`}</button>`).join('')
          : `<small class="hint">${T('لا توجد أوقات متاحة في هذا اليوم', 'No times available that day')}</small>`;
      } catch (err) { slotsEl.innerHTML = `<small class="hint">${esc(offlineMsg(err))}</small>`; }
    });
    slotsEl.addEventListener('click', (e) => {
      const b = e.target.closest('[data-t]'); if (!b || b.disabled) return;
      $$(slotsEl, '.slot-chip').forEach((x) => x.classList.toggle('active', x === b));
      form.elements.time.value = b.dataset.t;
      form.querySelector('.appt').classList.remove('invalid');
    });
    if (!list.length) daysEl.innerHTML = `<small class="hint">${T('الحجز غير متاح حالياً', 'Booking is not available right now')}</small>`;
  }
  const apptOk = (form) => {
    const ok = !!(form.elements.date.value && form.elements.time.value);
    form.querySelector('.appt').classList.toggle('invalid', !ok);
    return ok;
  };
  const apptEnabled = () => !(S.appointments && S.appointments.enabled === false);

  /* common validation of the visible required inputs */
  function validateForm(form) {
    let ok = true;
    $$(form, '[required]').forEach((x) => {
      let v = x.value.trim() !== '';
      if (v && x.name === 'phone') v = /^(05\d{8}|9665\d{8}|5\d{8})$/.test(x.value.replace(/[\s\-()+]/g, ''));
      x.closest('.field').classList.toggle('invalid', !v);
      if (!v && ok) { x.focus(); ok = false; }
    });
    return ok;
  }

  /* ---------------- service request + appointment ---------------- */
  forms.openService = function (catKey, catIdx, itemIdx) {
    if (!A.online) return offlineModal();
    const cat = C[catKey].categories[catIdx];
    const it = cat.items[itemIdx];
    const title = T(it[1], it[2]);
    const section = `${t(C[catKey].title)} — ${t(cat.title)}`;
    const canBook = apptEnabled() && it[6] !== false;
    const u = A.user || {};
    const box = showModal(`
      ${modalHead(it[0], esc(section), esc(title), esc(T(it[3], it[4])))}
      <div class="modal-body">
        ${canBook ? `<div class="mtabs" role="tablist">
          <button type="button" class="active" data-tab="service">${icon('send')} ${T('اطلب الخدمة', 'Request service')}</button>
          <button type="button" data-tab="appointment">${icon('calendar-check')} ${T('احجز موعد', 'Book an appointment')}</button>
        </div>` : `<div class="modal-perks">
          <div>${icon('timer')} ${T('رد خلال وقت قصير', 'Quick response')}</div>
          <div>${icon('shield-check')} ${T('سرية تامة لبياناتك', 'Full confidentiality')}</div>
          <div>${icon('list-checks')} ${T('متابعة حتى الإنجاز', 'Followed to completion')}</div></div>`}
        <div id="svcFormHolder"></div>
      </div>`);
    const holder = $(box, '#svcFormHolder');

    const draw = (mode) => {
      const appt = mode === 'appointment';
      holder.innerHTML = `
        <form novalidate>
          <div class="form-grid">
            ${nameField(u.name)}${phoneField(u.phone)}
            ${cityField(u.city)}
            ${appt ? '' : field('f-email', T('البريد (اختياري)', 'Email (optional)'), `<input id="f-email" name="email" type="email" dir="ltr" value="${esc(u.email || '')}">`)}
            ${appt ? appointmentFields() : ''}
            ${field('f-notes', appt ? T('ملاحظات للموعد', 'Appointment notes') : T('تفاصيل الطلب', 'Request details'), `<textarea id="f-notes" name="notes" placeholder="${T('اكتب أي تفاصيل تساعدنا على خدمتك بشكل أسرع…', 'Any details that help us serve you faster…')}"></textarea>`, { full: true })}
          </div>
          ${formErr}
          <div class="form-actions">
            <button class="btn btn-gold" type="submit">${icon(appt ? 'calendar-check' : 'send')} ${appt ? T('تأكيد حجز الموعد', 'Confirm appointment') : T('إرسال الطلب', 'Send request')}</button>
            <a class="btn btn-outline" href="${I.telLink()}">${icon('phone')} ${T('اتصل الآن', 'Call now')}</a>
          </div>
          <p class="form-note">${icon('info')} ${appt ? T('سنؤكد الموعد معك قبل حضورك. يمكنك متابعته وتعديله من حسابك.', 'We will confirm the appointment before you come.') : T('لن نشارك بياناتك مع أي جهة. سنتواصل معك لتأكيد المتطلبات والتكلفة قبل البدء.', 'We never share your data. We will confirm requirements and cost with you before starting.')}</p>
        </form>`;
      drawIcons();
      const form = $(holder, 'form');
      if (appt) bindAppointment(form);
      guard(form, $(form, '[type=submit]'), async () => {
        const ok1 = validateForm(form); const ok2 = appt ? apptOk(form) : true;
        if (!ok1 || !ok2) return;
        const v = Object.fromEntries(new FormData(form).entries());
        const r = await A.post('/requests', { type: appt ? 'appointment' : 'service', serviceId: it[5], name: v.name, phone: v.phone, email: v.email, city: v.city, notes: v.notes, date: v.date, time: v.time, mode: v.mode });
        successView(box, {
          title: appt ? T('تم حجز موعدك', 'Appointment booked') : T('تم استلام طلبك', 'Request received'),
          ref: r.request.ref,
          text: appt ? T(`موعدك: ${dayName(v.date, { weekday: 'long', day: 'numeric', month: 'long' })} — ${fmtTime(v.time)}. سنؤكد معك قريباً.`, `Your appointment: ${dayName(v.date, { weekday: 'long', day: 'numeric', month: 'long' })} at ${fmtTime(v.time)}. We will confirm shortly.`)
                     : T('سيتواصل معك فريقنا قريباً لتأكيد المتطلبات والتكلفة.', 'Our team will contact you shortly to confirm requirements and cost.')
        });
      });
    };
    draw('service');
    $$(box, '.mtabs [data-tab]').forEach((b) => b.addEventListener('click', () => {
      $$(box, '.mtabs [data-tab]').forEach((x) => x.classList.toggle('active', x === b));
      draw(b.dataset.tab);
    }));
  };

  /* ---------------- contact page ---------------- */
  forms.renderContact = function (holder) {
    if (!A.online) {
      holder.innerHTML = `<div class="notice">${icon('wifi-off')} <div><b>${T('النموذج غير متاح حالياً', 'The form is unavailable right now')}</b><p>${T(`تواصل معنا على ${S.phoneDisplay} وسنخدمك فوراً.`, `Please contact us on ${S.phoneDisplay}.`)}</p></div></div>`;
      return;
    }
    const u = A.user || {};
    const kinds = [
      ['message', T('أرسل رسالة / طلب خدمة', 'Send a message / service request'), 'send'],
      ...(apptEnabled() ? [['appointment', T('احجز موعد', 'Book an appointment'), 'calendar-check']] : [])
    ];
    holder.innerHTML = `<div class="mtabs">${kinds.map(([k, l, i], n) => `<button type="button" class="${n ? '' : 'active'}" data-tab="${k}">${icon(i)} ${l}</button>`).join('')}</div><div id="ctForm"></div>`;
    const draw = (mode) => {
      const appt = mode === 'appointment';
      const sections = [T('الخدمات العقارية', 'Real Estate Services'), T('سوق العقار (عرض أو طلب)', 'Property market'), T('الخدمات العامة', 'General Services'), T('الخدمات الطلابية', 'Student Services'), T('استفسار عام', 'General inquiry')];
      $(holder, '#ctForm').innerHTML = `
        <form novalidate>
          <div class="form-grid">
            ${nameField(u.name)}${phoneField(u.phone)}
            ${cityField(u.city)}
            ${field('f-sec', T('القسم', 'Section'), `<select id="f-sec" name="section">${sections.map((s) => `<option>${s}</option>`).join('')}</select>`)}
            ${appt ? appointmentFields() : ''}
            ${field('f-notes', appt ? T('ملاحظات للموعد', 'Appointment notes') : T('رسالتك / تفاصيل الطلب', 'Your message / request details'), `<textarea id="f-notes" name="notes" ${appt ? '' : 'required'} placeholder="${T('اكتب ما تحتاجه…', 'Tell us what you need…')}"></textarea>`, { full: true, req: !appt, err: T('فضلاً اكتب رسالتك', 'Please write your message') })}
          </div>
          ${formErr}
          <div class="form-actions">
            <button class="btn btn-gold" type="submit">${icon(appt ? 'calendar-check' : 'send')} ${appt ? T('تأكيد حجز الموعد', 'Confirm appointment') : T('إرسال', 'Send')}</button>
            <a class="btn btn-outline" href="mailto:${S.email}">${icon('mail')} ${T('راسلنا بالبريد', 'Email us')}</a>
          </div>
          <p class="form-note">${icon('shield-check')} ${T('بياناتك محمية ولا تُستخدم إلا للتواصل بخصوص طلبك.', 'Your data is protected and used only to contact you about your request.')}</p>
        </form>`;
      drawIcons();
      const form = $(holder, '#ctForm form');
      if (appt) bindAppointment(form);
      guard(form, $(form, '[type=submit]'), async () => {
        const ok1 = validateForm(form); const ok2 = appt ? apptOk(form) : true;
        if (!ok1 || !ok2) return;
        const v = Object.fromEntries(new FormData(form).entries());
        const notes = `${T('القسم', 'Section')}: ${v.section}${v.notes ? '\n' + v.notes : ''}`;
        const r = await A.post('/requests', { type: appt ? 'appointment' : 'contact', name: v.name, phone: v.phone, city: v.city, notes, date: v.date, time: v.time, mode: v.mode });
        $(holder, '#ctForm').innerHTML = `<div class="success-view"><span class="ok-ico">${icon('circle-check')}</span><h3>${appt ? T('تم حجز موعدك', 'Appointment booked') : T('تم استلام رسالتك', 'Message received')}</h3>
          <div class="ref-box"><small>${T('رقم الطلب', 'Request number')}</small><b dir="ltr">${esc(r.request.ref)}</b></div>
          <p>${T('سيتواصل معك فريقنا في أقرب وقت.', 'Our team will contact you soon.')}</p>
          <button class="btn btn-outline" type="button" id="ctAgain">${T('إرسال طلب آخر', 'Send another')}</button></div>`;
        drawIcons();
        $(holder, '#ctAgain').addEventListener('click', () => draw(mode));
      });
    };
    draw('message');
    $$(holder, '.mtabs [data-tab]').forEach((b) => b.addEventListener('click', () => {
      $$(holder, '.mtabs [data-tab]').forEach((x) => x.classList.toggle('active', x === b));
      draw(b.dataset.tab);
    }));
  };

  /* ---------------- property specification fields ---------------- */
  const condOk = (cond, deal, type) => !cond || cond.some((x) => x === deal || x === type);
  function layoutFor(type, deal) {
    const g = PROP.GROUP_OF[type];
    return (PROP.LAYOUT[g] || []).map((sec) => ({
      sec,
      fields: sec.fields.map((f) => { const [k, c] = f.split(':'); return { key: k, cond: c ? c.split(',') : null }; }).filter((f) => condOk(f.cond, deal, type))
    })).filter((x) => x.fields.length);
  }

  function specField(key, kind, vals) {
    const lbl = (f) => T(f.ar, f.en);
    if (key === 'areaRange') {
      if (kind === 'offer') return specField('area', kind, vals);
      return `${specField('areaMin', kind, vals)}${specField('areaMax', kind, vals)}`;
    }
    const f = PROP.FIELDS[key]; if (!f) return '';
    const v = vals[key];
    const attr = `data-spec="${key}"`;
    switch (f.kind) {
      case 'count':
        return `<div class="field" ${attr}><label>${lbl(f)}${kind === 'request' ? ` <small class="hint inline">${T('(الحد الأدنى)', '(minimum)')}</small>` : ''}</label>
          <div class="stepper"><button type="button" data-step="-1" aria-label="-">−</button><input type="number" inputmode="numeric" min="0" max="99" value="${v || 0}" aria-label="${lbl(f)}"><button type="button" data-step="1" aria-label="+">+</button></div></div>`;
      case 'number':
        return `<div class="field" ${attr}><label>${lbl(f)}</label><input type="number" inputmode="decimal" min="0" value="${v || ''}" placeholder="${T('اختياري', 'Optional')}"></div>`;
      case 'select': {
        const opts = f.options.filter((o) => kind === 'request' || o.v !== 'any');
        return `<div class="field" ${attr}><label>${lbl(f)}</label><select><option value="">${kind === 'request' ? T('لا يهم', 'Any') : T('— اختر —', '— Select —')}</option>${opts.map((o) => `<option value="${o.v}"${v === o.v ? ' selected' : ''}>${T(o.ar, o.en)}</option>`).join('')}</select></div>`;
      }
      case 'multi':
        return `<div class="field full" ${attr}><label>${lbl(f)}</label><div class="chips">${f.options.map((o) => `<label class="chip"><input type="checkbox" value="${o.v}"${[].concat(v || []).includes(o.v) ? ' checked' : ''}><span>${T(o.ar, o.en)}</span></label>`).join('')}</div></div>`;
      case 'bool':
        return `<div class="field" ${attr}><label>${lbl(f)}</label><div class="chips"><label class="chip"><input type="checkbox"${v ? ' checked' : ''}><span>${T('نعم', 'Yes')}</span></label></div></div>`;
      default:
        return `<div class="field" ${attr}><label>${lbl(f)}</label><input type="text" maxlength="120" value="${esc(v || '')}"></div>`;
    }
  }
  function specSections(type, deal, kind, vals) {
    return layoutFor(type, deal).map(({ sec, fields }) => {
      const body = fields.map((f) => specField(f.key, kind, vals)).join('');
      return body ? `<fieldset class="spec-sec"><legend>${T(sec.ar, sec.en)}</legend><div class="form-grid spec-grid">${body}</div></fieldset>` : '';
    }).join('');
  }
  function collectSpecs(root) {
    const d = {};
    $$(root, '[data-spec]').forEach((el) => {
      const k = el.dataset.spec; const f = PROP.FIELDS[k]; if (!f) return;
      if (f.kind === 'count' || f.kind === 'number') { const n = parseFloat($(el, 'input').value); if (n > 0) d[k] = n; }
      else if (f.kind === 'select') { const s = $(el, 'select').value; if (s) d[k] = s; }
      else if (f.kind === 'multi') { const a = $$(el, 'input:checked').map((x) => x.value); if (a.length) d[k] = a; }
      else if (f.kind === 'bool') { if ($(el, 'input').checked) d[k] = true; }
      else { const s = $(el, 'input').value.trim(); if (s) d[k] = s; }
    });
    return d;
  }
  function bindSteppers(root) {
    root.addEventListener('click', (e) => {
      const b = e.target.closest('.stepper [data-step]'); if (!b) return;
      const inp = $(b.parentElement, 'input');
      inp.value = Math.max(0, Math.min(99, (+inp.value || 0) + (+b.dataset.step)));
    });
  }

  /* ---------------- property offer / request modal ---------------- */
  const DEAL_PER = (deal) => deal === 'rent';

  forms.openPost = function (kind = 'offer', preset = {}) {
    if (!M) return;
    if (!A.online) return offlineModal();
    if (!A.user) {
      return forms.openAuth({
        reason: kind === 'offer' ? T('سجّل دخولك لإضافة عرضك ومتابعته من حسابك.', 'Log in to add your offer and manage it from your account.') : T('سجّل دخولك لإرسال طلبك ومتابعته من حسابك.', 'Log in to send your request and track it from your account.'),
        onDone: () => forms.openPost(kind, preset)
      });
    }
    const st = { kind: kind === 'request' ? 'request' : 'offer', deal: M.deals.find((d) => d.id === preset.deal) ? preset.deal : 'rent', type: preset.type || '' };
    const u = A.user;
    const rules = S.listingRules || {};

    const box = showModal('<div class="modal-head"></div><div class="modal-body"></div>', { wide: true });
    const head = () => st.kind === 'offer'
      ? modalHead('megaphone', T('سوق العقار — عرض', 'Property market — offer'), T('أضف عرضك — عندي عقار', 'Add your offer'), T('اكتب بيانات عقارك وسينشر بعد مراجعة سريعة من فريقنا.', 'Fill in your property details — it is published after a quick review.'))
      : modalHead('clipboard-list', T('سوق العقار — طلب', 'Property market — request'), T('اطلب عقارك — أبحث عن عقار', 'Request a property'), T('اكتب كل المتطلبات التي تريدها (غرف، مجالس، دورات مياه…) وسنبحث لك عن الأنسب.', 'Describe every requirement (rooms, majlis, bathrooms…) and we search for the best match.'));

    const render = (keep = {}) => {
      const k = st.kind; const dl = M.deals.find((d) => d.id === st.deal);
      if (!dl.types.includes(st.type)) st.type = '';
      const typeOpts = `<option value="">${T('اختر نوع العقار', 'Choose property type')}</option>` + dl.types.map((x) => `<option value="${x}"${x === st.type ? ' selected' : ''}>${I.typeName(x, true)}</option>`).join('');
      const adLic = (u.docs && u.docs.adLicense && u.docs.adLicense.number) || '';
      const verified = u.docs && Object.values(u.docs).some((d) => d.status === 'verified');
      const pricePer = DEAL_PER(st.deal) ? `<div class="field"><label>${T('الدفع', 'Per')}</label><select name="per"><option value="year">${T('سنوياً', 'Yearly')}</option><option value="month">${T('شهرياً', 'Monthly')}</option></select></div>` : '';

      const priceBlock = k === 'offer'
        ? `${field('f-price', st.deal === 'invest' ? T('السعر / قيمة الفرصة (اختياري)', 'Price / opportunity value (optional)') : T('السعر المطلوب (ريال)', 'Asking price (SAR)'), `<input id="f-price" name="price" inputmode="numeric" type="number" min="0" ${st.deal === 'invest' ? '' : 'required'} placeholder="${st.deal === 'rent' ? '45000' : '1500000'}">`, { req: st.deal !== 'invest', err: T('اكتب السعر', 'Enter the price') })}${pricePer}`
        : `${field('f-bmin', T('الميزانية من (ريال)', 'Budget from (SAR)'), '<input id="f-bmin" name="budgetMin" type="number" inputmode="numeric" min="0" placeholder="0">')}${field('f-bmax', T('الميزانية إلى (ريال)', 'Budget up to (SAR)'), '<input id="f-bmax" name="budgetMax" type="number" inputmode="numeric" min="0" placeholder="1000000">')}${pricePer}`;

      $(box, '.modal-head').outerHTML = head().trim();
      $(box, '.modal-body').innerHTML = `
        <form novalidate class="post-form">
          <div class="seg seg-kind" role="radiogroup">
            <label><input type="radio" name="kind" value="offer"${k === 'offer' ? ' checked' : ''}><span>${icon('tag')} ${T('عندي عقار (عرض)', 'I have a property')}</span></label>
            <label><input type="radio" name="kind" value="request"${k === 'request' ? ' checked' : ''}><span>${icon('search')} ${T('أبحث عن عقار (طلب)', 'I am looking')}</span></label>
          </div>
          <div class="field full" style="margin-top:14px">
            <label>${T('القسم', 'Section')} <span class="req">*</span></label>
            <div class="seg seg-deal">${M.deals.map((d) => `<label><input type="radio" name="deal" value="${d.id}"${d.id === st.deal ? ' checked' : ''}><span>${icon(d.icon)} ${t(d)}</span></label>`).join('')}</div>
          </div>
          <div class="form-grid">
            ${field('f-ptype', T('نوع العقار', 'Property type'), `<select id="f-ptype" name="ptype" required>${typeOpts}</select>`, { req: true, err: T('فضلاً اختر نوع العقار', 'Please choose the property type') })}
            ${field('f-city', T('المدينة', 'City'), `<select id="f-city" name="city" required>${I.cityOptions()}</select>`, { req: true, err: T('فضلاً اختر المدينة', 'Please choose the city') })}
            ${k === 'offer' ? field('f-district', T('الحي', 'District'), `<input id="f-district" name="district" placeholder="${T('مثال: حي النرجس', 'e.g. Al Narjis')}">`) : field('f-districts', T('الأحياء المفضلة', 'Preferred districts'), `<input id="f-districts" name="districts" placeholder="${T('مثال: النرجس، الياسمين، الملقا', 'e.g. Al Narjis, Al Yasmin')}">`)}
            ${priceBlock}
          </div>
          <div id="specHolder">${st.type ? specSections(st.type, st.deal, k, keep) : `<p class="hint-box">${icon('info')} ${T('اختر نوع العقار لتظهر لك كل المواصفات والمتطلبات.', 'Choose a property type to see all specification fields.')}</p>`}</div>
          <div class="form-grid">
            ${k === 'request' ? `
              ${field('f-urg', T('متى تحتاج العقار؟', 'When do you need it?'), `<select id="f-urg" name="urgency"><option value="">—</option>${PROP.FIELDS.urgency.options.map((o) => `<option value="${o.v}">${T(o.ar, o.en)}</option>`).join('')}</select>`)}
              ${field('f-cp', T('طريقة التواصل المفضلة', 'Preferred contact'), `<select id="f-cp" name="contactPref"><option value="">—</option>${PROP.FIELDS.contactPref.options.map((o) => `<option value="${o.v}">${T(o.ar, o.en)}</option>`).join('')}</select>`)}` : ''}
            ${k === 'offer' ? `
              <div class="field full"><label>${T('صور العقار', 'Photos')} <small class="hint inline">${T(`(حتى ${rules.maxImages || 8} صور)`, `(up to ${rules.maxImages || 8})`)}</small></label>
                <div class="uploader" data-uploader><div class="thumbs"></div><button type="button" class="up-add">${icon('image-plus')} <span>${T('إضافة صور', 'Add photos')}</span></button><input type="file" accept="image/*" multiple hidden></div></div>
              ${field('f-license', T('رقم ترخيص الإعلان العقاري', 'Property ad licence number'), `<input id="f-license" name="adLicense" dir="ltr" value="${esc(adLic)}" ${rules.requireAdLicense ? 'required' : ''} placeholder="${T(rules.requireAdLicense ? 'مطلوب' : 'اختياري', rules.requireAdLicense ? 'Required' : 'Optional')}">`, { full: true, req: !!rules.requireAdLicense, err: T('رقم الترخيص مطلوب', 'Licence number is required'), hint: verified ? '' : `${T('وثّق ترخيصك وسجلك التجاري ورخصة فال من', 'Verify your licence, CR and Fal licence from')} <a href="account.html#docs">${T('حسابك', 'your account')}</a> ${T('لتحصل على شارة «معلن موثّق».', 'to get the “Verified advertiser” badge.')}` })}` : ''}
            ${field('f-notes', k === 'offer' ? T('وصف العقار', 'Property description') : T('ملاحظات إضافية', 'Additional notes'), `<textarea id="f-notes" name="notes" placeholder="${k === 'offer' ? T('المميزات، الحالة، أي تفاصيل تهم المهتمين…', 'Features, condition, anything buyers should know…') : T('أي متطلبات أخرى لم تذكرها أعلاه…', 'Any other requirements…')}"></textarea>`, { full: true })}
            ${k === 'request' ? `<div class="field full"><label class="check"><input type="checkbox" name="publish"> <span>${T('انشر طلبي علناً في سوق العقار (بدون إظهار رقم جوالي) ليصل لأصحاب العقارات.', 'Publish my request publicly on the property market (without my phone number) so owners can see it.')}</span></label></div>` : ''}
          </div>
          <div class="who-box">${icon('user-round')} <span>${esc(u.name)} · <bdi dir="ltr">${esc(u.phone)}</bdi></span><small>${T('سنتواصل معك على هذه البيانات', 'We will contact you on these details')}</small></div>
          ${formErr}
          <div class="form-actions">
            <button class="btn btn-gold" type="submit">${icon('send')} ${k === 'offer' ? T('إرسال العرض', 'Submit offer') : T('إرسال الطلب', 'Submit request')}</button>
          </div>
          <p class="form-note">${icon('shield-check')} ${k === 'offer' ? T('يُراجع عرضك قبل النشر، ويمكنك متابعته وتعديله من حسابك.', 'Your offer is reviewed before publishing; manage it from your account.') : T('يصل طلبك إلى قسم الطلبات لدينا ويمكنك متابعة حالته من حسابك.', 'Your request goes to our requests desk; track its status from your account.')}</p>
        </form>`;
      drawIcons();
      const form = $(box, 'form');
      if (keep._city) form.elements.city.value = keep._city;
      if (st.type) form.elements.ptype.value = st.type;
      bindForm(form);
    };

    const bindForm = (form) => {
      const uploaded = []; // { file, url }
      const k = st.kind;
      const snapshot = () => Object.assign(collectSpecs(form), { _city: form.elements.city.value });
      form.addEventListener('change', (e) => {
        if (e.target.name === 'kind') { st.kind = e.target.value; render(snapshot()); return; }
        if (e.target.name === 'deal') { st.deal = e.target.value; render(snapshot()); return; }
        if (e.target.name === 'ptype') { st.type = e.target.value; render(snapshot()); }
      });
      bindSteppers(form);
      const up = $(form, '[data-uploader]');
      if (up) {
        const thumbs = $(up, '.thumbs'); const fileIn = $(up, 'input[type=file]'); const max = (S.listingRules && S.listingRules.maxImages) || 8;
        const draw = () => {
          thumbs.innerHTML = uploaded.map((x, i) => `<div class="thumb"><img src="${x.url}" alt=""><button type="button" data-rm="${i}" aria-label="${T('حذف', 'Remove')}">${icon('x')}</button></div>`).join('');
          drawIcons(); $(up, '.up-add').hidden = uploaded.length >= max;
        };
        $(up, '.up-add').addEventListener('click', () => fileIn.click());
        fileIn.addEventListener('change', async () => {
          for (const f of [...fileIn.files]) {
            if (uploaded.length >= max) break;
            try { const r = await A.uploadImage(f); uploaded.push({ file: r.file, url: r.url }); draw(); }
            catch (err) { setErr(form, err.message); }
          }
          fileIn.value = '';
        });
        thumbs.addEventListener('click', (e) => { const b = e.target.closest('[data-rm]'); if (b) { uploaded.splice(+b.dataset.rm, 1); draw(); } });
      }
      guard(form, $(form, '[type=submit]'), async () => {
        const ok = validateForm(form);
        if (!ok) return;
        const v = Object.fromEntries(new FormData(form).entries());
        const details = collectSpecs(form);
        if (k === 'request') {
          ['budgetMin', 'budgetMax'].forEach((n) => { if (+v[n] > 0) details[n] = +v[n]; });
          ['urgency', 'contactPref', 'districts'].forEach((n) => { if (v[n]) details[n] = v[n]; });
          const r = await A.post('/requests', { type: 'property_request', deal: st.deal, ptype: v.ptype, city: v.city, details, notes: v.notes, per: v.per, publish: !!v.publish });
          successView(box, {
            title: T('تم إرسال طلبك', 'Request sent'), ref: r.request.ref,
            text: T('وصل طلبك إلى قسم الطلبات وسيتواصل معك فريقنا قريباً بالعروض المناسبة.', 'Your request reached our requests desk and we will contact you with matching offers.') + (v.publish ? ' ' + T('وسيظهر في السوق بعد مراجعته.', 'It will appear on the market after review.') : '')
          });
        } else {
          const r = await A.post('/listings', { deal: st.deal, type: v.ptype, city: v.city, district: v.district, price: v.price, per: v.per, details, description: v.notes, adLicense: v.adLicense, images: uploaded.map((x) => x.file) });
          const published = r.listing.status === 'published';
          successView(box, {
            title: published ? T('تم نشر عرضك', 'Your offer is live') : T('تم استلام عرضك', 'Offer received'), ref: `#${r.listing.id}`, refLabel: T('رقم الإعلان', 'Ad number'), track: { href: 'account.html#ads', label: T('إعلاناتي', 'My ads') },
            text: published ? T('عرضك ظاهر الآن في سوق العقار.', 'Your offer is now live on the market.') : T('عرضك قيد المراجعة وسيظهر في السوق فور اعتماده.', 'Your offer is under review and will appear once approved.')
          });
        }
      });
    };
    render({});
  };

  /* ---------------- ad details + inquiry ---------------- */
  function specRows(a) {
    const d = a.details || {}; const rows = [];
    const push = (ico, label, value) => rows.push(`<div class="spec"><span>${icon(ico || 'check')} ${esc(label)}</span><b>${esc(value)}</b></div>`);
    const nf = I.fmtNum;
    if (d.budgetMin || d.budgetMax) push('wallet', T('الميزانية', 'Budget'), `${d.budgetMin ? nf(d.budgetMin) : 0} – ${d.budgetMax ? nf(d.budgetMax) : '∞'} ${T('ريال', 'SAR')}`);
    if (d.areaMin || d.areaMax) push('ruler', T('المساحة', 'Area'), `${d.areaMin ? nf(d.areaMin) : 0} – ${d.areaMax ? nf(d.areaMax) : '∞'} ${T('م²', 'm²')}`);
    Object.keys(d).forEach((k) => {
      if (['budgetMin', 'budgetMax', 'areaMin', 'areaMax', 'price'].includes(k)) return;
      const f = PROP.FIELDS[k]; if (!f) return;
      const lbl = T(f.ar, f.en);
      if (f.kind === 'count' || f.kind === 'number') push(f.icon, lbl, nf(d[k]));
      else if (f.kind === 'bool') push(f.icon, lbl, T('نعم', 'Yes'));
      else push(f.icon, lbl, PROP.labelOf(k, d[k], lang()));
    });
    return rows.join('');
  }

  forms.openAd = async function (id, focusInquiry) {
    let a = M.listings.find((x) => x.id === id);
    if (!a) return;
    const open = (full) => {
      const imgs = (full.images && full.images.length) ? full.images : (full.img ? [full.img] : []);
      const ty = M.types[full.type] || {};
      const u = A.user || {};
      const box = showModal(`
        ${modalHead(ty.icon || 'home', `${I.typeName(full.type, true)} · ${t(I.deal(full.deal) || {})} · #${full.id}`, esc(t(full.title)), `${icon('map-pin')} ${I.cityName(full.city)}${full.district && t(full.district) ? ' — ' + esc(t(full.district)) : ''}`)}
        <div class="modal-body ad-detail">
          ${imgs.length ? `<div class="ad-gallery"><img class="main" src="${esc(imgs[0].includes('/') ? imgs[0] : 'assets/img/' + imgs[0])}" alt="">${imgs.length > 1 ? `<div class="g-thumbs">${imgs.map((x, i) => `<button type="button" data-g="${i}"><img src="${esc(x.includes('/') ? x : 'assets/img/' + x)}" alt=""></button>`).join('')}</div>` : ''}</div>` : ''}
          <div class="ad-d-price">${full.price ? `${full.kind === 'request' ? `<small>${T('الميزانية حتى', 'Budget up to')}</small> ` : ''}<b>${I.fmtNum(full.price)}</b> ${T('ريال', 'SAR')}${full.per === 'month' ? T(' / شهرياً', ' / month') : full.per === 'year' ? T(' / سنوياً', ' / year') : ''}` : T('السعر عند التواصل', 'Price on request')}</div>
          ${(isV(full) || full.license) ? `<div class="ad-trust">${isV(full) ? `<span class="badge-ok">${icon('badge-check')} ${T('معلن موثّق', 'Verified advertiser')}</span>` : ''}${full.license ? `<span class="badge-lic">${T('رقم ترخيص الإعلان', 'Ad licence')}: ${esc(full.license)}</span>` : ''}</div>` : ''}
          ${full.area || full.rooms || full.baths || Object.keys(full.details || {}).length ? `<h4 class="sub-h">${full.kind === 'request' ? T('المتطلبات', 'Requirements') : T('المواصفات', 'Specifications')}</h4><div class="spec-list">${full.area && !(full.details && full.details.area) ? `<div class="spec"><span>${icon('ruler')} ${T('المساحة', 'Area')}</span><b>${I.fmtNum(full.area)} ${T('م²', 'm²')}</b></div>` : ''}${specRows(full)}</div>` : ''}
          ${full.description && t(full.description) ? `<h4 class="sub-h">${T('الوصف', 'Description')}</h4><p class="ad-desc">${esc(t(full.description))}</p>` : ''}
          <h4 class="sub-h" id="inq">${full.kind === 'request' ? T('عندك عقار مناسب؟ راسلنا', 'Have a matching property? Contact us') : T('مهتم بهذا العقار؟ أرسل استفسارك', 'Interested? Send your inquiry')}</h4>
          <form novalidate>
            <div class="form-grid">
              ${nameField(u.name)}${phoneField(u.phone)}
              ${field('f-notes', T('رسالتك', 'Your message'), `<textarea id="f-notes" name="notes" placeholder="${T('أرغب بمعاينة العقار / معرفة التفاصيل…', 'I would like to view the property / know more…')}"></textarea>`, { full: true })}
            </div>
            ${formErr}
            <div class="form-actions">
              <button class="btn btn-gold" type="submit">${icon('send')} ${T('إرسال الاستفسار', 'Send inquiry')}</button>
              <a class="btn btn-outline" href="${I.telLink()}">${icon('phone')} ${T('اتصل بنا', 'Call us')}</a>
            </div>
          </form>
        </div>`, { wide: true });
      $$(box, '[data-g]').forEach((b) => b.addEventListener('click', () => { $(box, '.ad-gallery .main').src = $(b, 'img').src; }));
      const form = $(box, 'form');
      guard(form, $(form, '[type=submit]'), async () => {
        if (!validateForm(form)) return;
        const v = Object.fromEntries(new FormData(form).entries());
        const r = await A.post('/requests', { type: 'inquiry', listingId: full.id, name: v.name, phone: v.phone, notes: v.notes });
        successView(box, { title: T('تم إرسال استفسارك', 'Inquiry sent'), ref: r.request.ref, text: T('سنتواصل معك قريباً بخصوص هذا الإعلان.', 'We will contact you shortly about this ad.') });
      });
      if (focusInquiry) setTimeout(() => $(box, '#inq').scrollIntoView({ behavior: 'smooth', block: 'start' }), 300);
    };
    const isV = (x) => !!(x.verified && (x.verified.ad || x.verified.cr || x.verified.fal));
    open(a);
    if (A.online) A.get('/listings/' + id).catch(() => {});   // counts the view
  };
})();
