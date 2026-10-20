# مركز الخدمات المتكاملة — Integrated Services Center

> كل خدماتك .. في مكان واحد

Bilingual (Arabic / English) website for a Saudi services company offering **real estate services**, **government transaction services (تعقيب)** and **student services**.

## Pages

| File | Page |
|---|---|
| `index.html` | الرئيسية — opening logo animation + the three main sections (عقار · خدمات عامة · خدمات طلابية) |
| `real-estate.html` | العقار — choose إيجار / بيع / استثمار → property type → market, plus supporting real estate services |
| `market.html` | سوق العقار (عرض وطلب) — filterable board of offers & requests; customers post via a form that sends to WhatsApp |
| `general-services.html` | الخدمات العامة — every general service in categories (government transactions, delivery, utilities…) |
| `students.html` | الخدمات الطلابية |
| `taqib.html` | Redirects to `general-services.html` (kept for old links) |
| `about.html` | من نحن |
| `contact.html` | تواصل معنا |

## Editing

- **Contact details** (phone, WhatsApp, email, address, hours, cities): top of `assets/js/data.js`.
- **Services catalog** (all sections and services, AR/EN): `assets/js/data.js`.
- **Property market** (sections, property types and the published ads): `assets/js/listings.js`. Ads customers send arrive on WhatsApp; after review, add them to `listings` there. Delete the ads marked `sample: true` before going live.
- **Styles / brand colors**: `assets/css/style.css`.
- **Behaviour** (language switch, service search, request form → WhatsApp, animations): `assets/js/main.js`.

Static site — no build step. Open `index.html` or host on any static host (GitHub Pages).

> Phone/WhatsApp is 0552408287. The email and address are still placeholders, the homepage testimonials and the market ads marked `sample` are samples. Replace them before going live.

Photos: [Unsplash](https://unsplash.com/license). Icons: [Lucide](https://lucide.dev) (ISC).
