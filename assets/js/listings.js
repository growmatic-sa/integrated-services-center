/* =========================================================
   سوق العقار (عرض وطلب) — Real estate market (offers & requests)
   - deals: the three real estate sections and the property types in each
   - types: every property type (label, singular, icon)
   - listings: the ads shown on market.html. Add, edit or remove ads here.
     Ads sent by customers arrive on WhatsApp; after review, copy them here.
   ========================================================= */

window.MARKET = {
  deals: [
    {
      id: 'rent', icon: 'key-round', img: 'keys.jpg',
      ar: 'الإيجار', en: 'For Rent',
      dar: 'فلل وشقق ومجمعات وأدوار ومحلات للإيجار', den: 'Villas, apartments, compounds, floors and shops for rent',
      types: ['villa', 'apartment', 'compound', 'floor', 'shop']
    },
    {
      id: 'sale', icon: 'badge-dollar-sign', img: 'villa-1.jpg',
      ar: 'البيع', en: 'For Sale',
      dar: 'فلل وشقق وأراضٍ وعمائر ومجمعات للبيع', den: 'Villas, apartments, land, buildings and complexes for sale',
      types: ['villa', 'apartment', 'land', 'commercial-bldg', 'residential-bldg', 'complex']
    },
    {
      id: 'invest', icon: 'trending-up', img: 'towers.jpg',
      ar: 'الاستثمار', en: 'Investment',
      dar: 'فرص عقارية مدرّة للدخل وشراكات تطوير', den: 'Income-generating properties and development partnerships',
      types: ['land', 'commercial-bldg', 'residential-bldg', 'complex', 'shop', 'partnership']
    }
  ],

  types: {
    'villa':            { ar: 'فلل', en: 'Villas', one: { ar: 'فيلا', en: 'Villa' }, icon: 'house' },
    'apartment':        { ar: 'شقق', en: 'Apartments', one: { ar: 'شقة', en: 'Apartment' }, icon: 'building' },
    'compound':         { ar: 'مجمع سكني', en: 'Residential Compound', one: { ar: 'مجمع سكني', en: 'Residential compound' }, icon: 'hotel' },
    'floor':            { ar: 'أدوار', en: 'Floors', one: { ar: 'دور', en: 'Floor' }, icon: 'layers-3' },
    'shop':             { ar: 'محلات تجارية', en: 'Shops', one: { ar: 'محل تجاري', en: 'Shop' }, icon: 'store' },
    'land':             { ar: 'أراضي', en: 'Land', one: { ar: 'أرض', en: 'Land plot' }, icon: 'land-plot' },
    'commercial-bldg':  { ar: 'عمائر تجارية', en: 'Commercial Buildings', one: { ar: 'عمارة تجارية', en: 'Commercial building' }, icon: 'building-2' },
    'residential-bldg': { ar: 'عمائر سكنية', en: 'Residential Buildings', one: { ar: 'عمارة سكنية', en: 'Residential building' }, icon: 'building' },
    'complex':          { ar: 'مجمعات', en: 'Complexes', one: { ar: 'مجمع', en: 'Complex' }, icon: 'hotel' },
    'partnership':      { ar: 'شراكات وتطوير', en: 'Partnerships & Development', one: { ar: 'فرصة شراكة', en: 'Partnership' }, icon: 'handshake' }
  },

  /* Each ad:
     id       رقم الإعلان (unique)
     kind     'offer' = عرض (عندي عقار)  |  'request' = طلب (أبحث عن عقار)
     deal     'rent' | 'sale' | 'invest'
     type     key from types above
     city     Arabic city name as in SITE.cities
     district { ar, en }
     title    { ar, en }
     price    SAR (for a request: the maximum budget)   per: 'year' | 'month' (rent only)
     area     m²,  rooms, baths (optional)
     img      file in assets/img (optional)
     date     'YYYY-MM-DD'
     sample   true → shows a "sample" badge. Delete the sample ads before going live. */
  listings: [
    { id: 1012, kind: 'offer', deal: 'rent', type: 'apartment', city: 'الرياض', district: { ar: 'حي النرجس', en: 'Al Narjis' },
      title: { ar: 'شقة عوائل 3 غرف مع مدخل خاص', en: 'Family apartment, 3 bedrooms, private entrance' },
      price: 42000, per: 'year', area: 165, rooms: 3, baths: 3, img: 'interior.jpg', date: '2026-10-18', sample: true },
    { id: 1011, kind: 'request', deal: 'rent', type: 'villa', city: 'جدة', district: { ar: 'شمال جدة', en: 'North Jeddah' },
      title: { ar: 'مطلوب فيلا للإيجار لعائلة — 5 غرف فأكثر', en: 'Wanted: villa for a family — 5+ bedrooms' },
      price: 90000, per: 'year', rooms: 5, date: '2026-10-18', sample: true },
    { id: 1010, kind: 'offer', deal: 'sale', type: 'villa', city: 'الرياض', district: { ar: 'حي الملقا', en: 'Al Malqa' },
      title: { ar: 'فيلا دورين وملحق بتشطيب فاخر', en: 'Two-floor villa with annex, luxury finish' },
      price: 2650000, area: 375, rooms: 6, baths: 7, img: 'villa-2.jpg', date: '2026-10-17', sample: true },
    { id: 1009, kind: 'offer', deal: 'sale', type: 'land', city: 'الدمام', district: { ar: 'حي الشعلة', en: 'Al Shulah' },
      title: { ar: 'أرض سكنية على شارعين بصك إلكتروني', en: 'Residential corner plot, electronic deed' },
      price: 780000, area: 600, img: 'construction.jpg', date: '2026-10-16', sample: true },
    { id: 1008, kind: 'offer', deal: 'rent', type: 'shop', city: 'الرياض', district: { ar: 'طريق الملك عبدالعزيز', en: 'King Abdulaziz Rd' },
      title: { ar: 'محل تجاري على شارع رئيسي بواجهة زجاجية', en: 'Main-road retail shop with glass front' },
      price: 65000, per: 'year', area: 90, img: 'towers.jpg', date: '2026-10-16', sample: true },
    { id: 1007, kind: 'request', deal: 'sale', type: 'apartment', city: 'الخبر', district: { ar: 'الخبر الشمالية', en: 'North Khobar' },
      title: { ar: 'مطلوب شقة تمليك 4 غرف قريبة من الخدمات', en: 'Wanted: 4-bedroom apartment to buy near amenities' },
      price: 750000, rooms: 4, date: '2026-10-15', sample: true },
    { id: 1006, kind: 'offer', deal: 'invest', type: 'commercial-bldg', city: 'جدة', district: { ar: 'حي الروضة', en: 'Al Rawdah' },
      title: { ar: 'عمارة تجارية مؤجرة بالكامل — دخل سنوي ثابت', en: 'Fully leased commercial building — steady annual income' },
      price: 6800000, area: 900, img: 'towers.jpg', date: '2026-10-14', sample: true },
    { id: 1005, kind: 'offer', deal: 'rent', type: 'floor', city: 'المدينة المنورة', district: { ar: 'حي العزيزية', en: 'Al Aziziyah' },
      title: { ar: 'دور أرضي مستقل 4 غرف مع حوش', en: 'Independent ground floor, 4 rooms with yard' },
      price: 30000, per: 'year', area: 220, rooms: 4, baths: 3, img: 'villa-3.jpg', date: '2026-10-13', sample: true },
    { id: 1004, kind: 'request', deal: 'invest', type: 'land', city: 'الرياض', district: { ar: 'شرق الرياض', en: 'East Riyadh' },
      title: { ar: 'مطلوب أرض تجارية للاستثمار والتطوير', en: 'Wanted: commercial land for investment and development' },
      price: 5000000, area: 1500, date: '2026-10-12', sample: true },
    { id: 1003, kind: 'offer', deal: 'sale', type: 'residential-bldg', city: 'مكة المكرمة', district: { ar: 'حي العوالي', en: 'Al Awali' },
      title: { ar: 'عمارة سكنية 12 شقة بحالة ممتازة', en: 'Residential building, 12 apartments, excellent condition' },
      price: 4200000, area: 750, img: 'house-night.jpg', date: '2026-10-11', sample: true },
    { id: 1002, kind: 'offer', deal: 'rent', type: 'compound', city: 'الخبر', district: { ar: 'حي العقربية', en: 'Al Aqrabiyah' },
      title: { ar: 'مجمع سكني 20 فيلا لشركات ومؤسسات', en: 'Residential compound of 20 villas for companies' },
      price: 1500000, per: 'year', img: 'villa-1.jpg', date: '2026-10-10', sample: true },
    { id: 1001, kind: 'request', deal: 'rent', type: 'apartment', city: 'الدمام', district: { ar: 'حي الفيصلية', en: 'Al Faisaliyah' },
      title: { ar: 'مطلوب شقة عزاب غرفتين بسعر مناسب', en: 'Wanted: 2-room apartment for singles at a fair price' },
      price: 18000, per: 'year', rooms: 2, date: '2026-10-09', sample: true }
  ]
};
