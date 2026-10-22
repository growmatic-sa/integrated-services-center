'use strict';
/* Markdown-lite → safe HTML for blog posts. Everything is escaped first, so no raw HTML can get through.
   Supports: # ## ### headings, **bold**, *italic*, [text](url), ![alt](image-url), - lists, 1. lists, > quotes, --- rule, paragraphs. */
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const safeUrl = (u, allowRel = true) => {
  u = u.trim();
  if (/^https?:\/\//i.test(u) || /^mailto:/i.test(u) || /^tel:/i.test(u)) return u;
  if (allowRel && /^(\/|#|[a-z0-9_\-./]+$)/i.test(u) && !/^\s*(javascript|data|vbscript):/i.test(u)) return u;
  return '';
};

function inline(s) {
  let t = esc(s);
  t = t.replace(/!\[([^\]]*)\]\(([^)\s]+)\)/g, (m, alt, url) => {
    const u = safeUrl(url.replace(/&amp;/g, '&'));
    return u ? `<img src="${esc(u)}" alt="${alt}" loading="lazy">` : m;
  });
  t = t.replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (m, text, url) => {
    const u = safeUrl(url.replace(/&amp;/g, '&'));
    if (!u) return m;
    const ext = /^https?:/i.test(u) ? ' target="_blank" rel="noopener nofollow"' : '';
    return `<a href="${esc(u)}"${ext}>${text}</a>`;
  });
  t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>').replace(/(^|[^*])\*([^*\n]+)\*/g, '$1<em>$2</em>');
  return t;
}

function render(md) {
  const lines = String(md || '').replace(/\r\n?/g, '\n').split('\n');
  const out = [];
  let list = null; let para = [];
  const flushPara = () => { if (para.length) { out.push(`<p>${para.map(inline).join('<br>')}</p>`); para = []; } };
  const flushList = () => { if (list) { out.push(`</${list}>`); list = null; } };
  for (const raw of lines) {
    const line = raw.trimEnd();
    let m;
    if (!line.trim()) { flushPara(); flushList(); continue; }
    if ((m = line.match(/^(#{1,3})\s+(.*)$/))) { flushPara(); flushList(); const n = m[1].length + 1; out.push(`<h${n}>${inline(m[2])}</h${n}>`); continue; }
    if (/^(-{3,}|\*{3,})$/.test(line.trim())) { flushPara(); flushList(); out.push('<hr>'); continue; }
    if ((m = line.match(/^>\s?(.*)$/))) { flushPara(); flushList(); out.push(`<blockquote>${inline(m[1])}</blockquote>`); continue; }
    if ((m = line.match(/^[-*•]\s+(.*)$/))) { flushPara(); if (list !== 'ul') { flushList(); out.push('<ul>'); list = 'ul'; } out.push(`<li>${inline(m[1])}</li>`); continue; }
    if ((m = line.match(/^\d+[.)]\s+(.*)$/))) { flushPara(); if (list !== 'ol') { flushList(); out.push('<ol>'); list = 'ol'; } out.push(`<li>${inline(m[1])}</li>`); continue; }
    flushList(); para.push(line);
  }
  flushPara(); flushList();
  return out.join('\n');
}

const plain = (md, n = 160) => String(md || '').replace(/!\[[^\]]*\]\([^)]*\)/g, '').replace(/\[([^\]]+)\]\([^)]*\)/g, '$1').replace(/[#>*_`\-]/g, '').replace(/\s+/g, ' ').trim().slice(0, n);

module.exports = { render, esc, plain };
