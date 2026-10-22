'use strict';
/* Server-rendered pages (good for Google): blog list, blog article, sitemap.xml, robots.txt */
const { db } = require('./db');
const mdr = require('./md');
const { esc } = mdr;

const SITE_NAME = 'مركز الخدمات المتكاملة';
const baseUrl = (req) => (process.env.PUBLIC_URL || `${req.headers['x-forwarded-proto'] === 'https' ? 'https' : 'http'}://${req.headers.host}`).replace(/\/$/, '');
const pick = (o, k) => (o && o[k]) || '';

function shell(req, { title, desc, canonical, page = 'blog', main, ld, image }) {
  const base = baseUrl(req);
  return `<!doctype html>
<html lang="ar" dir="rtl">
<head>
<meta charset="utf-8">
<base href="/">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${esc(base + canonical)}">
<meta property="og:type" content="article"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${esc(base + canonical)}">${image ? `<meta property="og:image" content="${esc(image.startsWith('http') ? image : base + '/' + image.replace(/^\//, ''))}">` : ''}
<meta name="theme-color" content="#0A2A5A">
<link rel="icon" href="/assets/brand/favicon-32.png">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;800;900&family=Tajawal:wght@400;500;700;800&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/assets/css/style.css">
<script>try{if(localStorage.getItem('isc-lang')==='en'){document.documentElement.lang='en';document.documentElement.dir='ltr'}}catch(e){}</script>
${ld ? `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>` : ''}
</head>
<body data-page="${page}">
<div id="site-header"></div>
<main>
${main}
</main>
<div id="site-footer"></div>
<script src="/assets/js/vendor/lucide.min.js"></script>
<script src="/assets/js/data.js"></script>
<script src="/assets/js/listings.js"></script>
<script src="/assets/js/propschema.js"></script>
<script src="/assets/js/api.js"></script>
<script src="/assets/js/main.js"></script>
<script src="/assets/js/forms.js"></script>
</body>
</html>`;
}

const fmtDate = (iso) => new Date(iso).toLocaleDateString('ar-SA-u-nu-latn-ca-gregory', { year: 'numeric', month: 'long', day: 'numeric' });
const imgSrc = (c) => (c ? (c.startsWith('/') ? c : '/' + c) : '');

function bi(o, ar, en) { // element that switches language through main.js (data-en)
  return `data-en="${esc(en || ar)}"`;
}

function listPage(req) {
  const posts = db.posts.filter((p) => p.status === 'published').sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt)));
  const cards = posts.map((p) => `
    <a class="post-card-b reveal" href="/blog/${encodeURIComponent(p.slug)}">
      ${p.cover ? `<img src="${esc(imgSrc(p.cover))}" alt="" loading="lazy">` : '<div class="pc-ph"><i data-lucide="newspaper"></i></div>'}
      <div class="pc-body">
        <small>${esc(p.category || 'مقالات')} · ${esc(fmtDate(p.publishedAt))}</small>
        <h3 ${bi(p.title, p.title.ar, p.title.en)}>${esc(p.title.ar)}</h3>
        <p ${bi(p.excerpt, p.excerpt.ar, p.excerpt.en)}>${esc(p.excerpt.ar)}</p>
        <span class="more" data-en="Read more">اقرأ المزيد</span>
      </div>
    </a>`).join('');
  const main = `
  <section class="page-hero">
    <div class="bg" style="background-image:url('/assets/img/study.jpg')" aria-hidden="true"></div>
    <div class="container">
      <nav class="crumbs" aria-label="breadcrumb"><a href="/index.html" data-en="Home">الرئيسية</a> <i data-lucide="chevron-left" class="flip-ltr"></i> <span data-en="Blog">المدونة</span></nav>
      <h1 data-en="Our <span class='gold'>Blog</span>">المدونة <span class='gold'>والمقالات</span></h1>
      <p data-en="Guides and tips on real estate, government services and student services.">أدلة ونصائح عن العقار والخدمات الحكومية والخدمات الطلابية.</p>
    </div>
  </section>
  <section class="section"><div class="container">
    ${posts.length ? `<div class="post-grid">${cards}</div>` : '<div class="no-results show"><span class="ico"><i data-lucide="newspaper"></i></span><h3 data-en="No articles yet">لا توجد مقالات بعد</h3></div>'}
  </div></section>`;
  return shell(req, { title: `المدونة | ${SITE_NAME}`, desc: 'مقالات وأدلة عن العقار والخدمات الحكومية والخدمات الطلابية في المملكة العربية السعودية.', canonical: '/blog', main });
}

function postPage(req, p) {
  const both = p.body.en && p.body.en.trim();
  const body = both
    ? `<div class="post-body" data-l="ar">${mdr.render(p.body.ar)}</div><div class="post-body" data-l="en" hidden>${mdr.render(p.body.en)}</div>`
    : `<div class="post-body">${mdr.render(p.body.ar)}</div>`;
  const related = db.posts.filter((x) => x.status === 'published' && x.id !== p.id).sort((a, b) => String(b.publishedAt).localeCompare(String(a.publishedAt))).slice(0, 3);
  const desc = p.seoDesc || p.excerpt.ar || mdr.plain(p.body.ar);
  const main = `
  <section class="page-hero post-hero">
    ${p.cover ? `<div class="bg" style="background-image:url('${esc(imgSrc(p.cover))}')" aria-hidden="true"></div>` : '<div class="bg" style="background-image:url(\'/assets/img/study.jpg\')" aria-hidden="true"></div>'}
    <div class="container">
      <nav class="crumbs" aria-label="breadcrumb"><a href="/index.html" data-en="Home">الرئيسية</a> <i data-lucide="chevron-left" class="flip-ltr"></i> <a href="/blog" data-en="Blog">المدونة</a></nav>
      <h1 ${bi(p.title, p.title.ar, p.title.en)}>${esc(p.title.ar)}</h1>
      <p class="post-meta">${esc(p.category || '')}${p.category ? ' · ' : ''}${esc(fmtDate(p.publishedAt))}${p.author ? ' · ' + esc(p.author) : ''}</p>
    </div>
  </section>
  <section class="section"><div class="container post-wrap">
    <article>${body}
      ${p.tags && p.tags.length ? `<div class="post-tags">${p.tags.map((t) => `<span>#${esc(t)}</span>`).join('')}</div>` : ''}
      <div class="cta-band" style="margin-top:50px"><div><h2 data-en="Need help with this?">تحتاج مساعدة في هذا الموضوع؟</h2><p data-en="Send us your request and our team will follow up.">أرسل طلبك وسيتواصل معك فريقنا.</p></div>
      <div class="cta-actions"><a class="btn btn-gold" href="/contact.html#request" data-en="Request a service">اطلب خدمة</a></div></div>
    </article>
    ${related.length ? `<aside class="post-related"><h3 data-en="More articles">مقالات أخرى</h3>${related.map((r) => `<a href="/blog/${encodeURIComponent(r.slug)}" ${bi(r.title, r.title.ar, r.title.en)}>${esc(r.title.ar)}</a>`).join('')}</aside>` : ''}
  </div></section>`;
  const ld = { '@context': 'https://schema.org', '@type': 'BlogPosting', headline: p.title.ar, description: desc, datePublished: p.publishedAt, dateModified: p.updatedAt, author: { '@type': 'Organization', name: SITE_NAME }, image: p.cover ? imgSrc(p.cover) : undefined, inLanguage: 'ar' };
  return shell(req, { title: `${p.seoTitle || p.title.ar} | ${SITE_NAME}`, desc, canonical: `/blog/${encodeURIComponent(p.slug)}`, main, ld, image: p.cover });
}

function sitemap(req) {
  const base = baseUrl(req);
  const urls = ['/index.html', '/real-estate.html', '/market.html', '/general-services.html', '/students.html', '/about.html', '/contact.html', '/blog']
    .map((u) => `<url><loc>${base}${u}</loc></url>`)
    .concat(db.posts.filter((p) => p.status === 'published').map((p) => `<url><loc>${base}/blog/${encodeURIComponent(p.slug)}</loc><lastmod>${String(p.updatedAt).slice(0, 10)}</lastmod></url>`));
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}</urlset>`;
}

function handle(req, res, url, SECURITY) {
  const p = url.pathname;
  const out = (type, body, extra = {}) => { res.writeHead(200, Object.assign({ 'Content-Type': type, 'Cache-Control': 'no-cache' }, SECURITY, extra)); res.end(req.method === 'HEAD' ? undefined : body); return true; };
  if (p === '/blog' || p === '/blog/') return out('text/html; charset=utf-8', listPage(req));
  let m;
  if ((m = p.match(/^\/blog\/([^/]+)$/))) {
    let slug; try { slug = decodeURIComponent(m[1]); } catch (e) { return false; }
    const post = db.posts.find((x) => x.slug === slug && x.status === 'published');
    if (post) return out('text/html; charset=utf-8', postPage(req, post));
    res.writeHead(404, Object.assign({ 'Content-Type': 'text/html; charset=utf-8' }, SECURITY)); res.end('<meta charset="utf-8"><p style="font:18px sans-serif;padding:40px">المقال غير موجود — <a href="/blog">المدونة</a></p>'); return true;
  }
  if (p === '/sitemap.xml') return out('application/xml; charset=utf-8', sitemap(req));
  if (p === '/robots.txt') return out('text/plain; charset=utf-8', `User-agent: *\nDisallow: /api/\nDisallow: /admin.html\nDisallow: /account.html\nSitemap: ${baseUrl(req)}/sitemap.xml\n`);
  return false;
}

module.exports = { handle };
