/* =========================================================
   مواصفات العقار — Property specification schema
   Shared by the website forms, the dashboard and the server (validation + labels).
   To add a requirement (e.g. "غرفة سينما"): add it to FIELDS, then list its key in a section of LAYOUT.
   ========================================================= */
(function (root) {
  const yes = { ar: 'نعم', en: 'Yes' };
  const O = (v, ar, en) => ({ v, ar, en });

  /* kind: count (stepper) | number | select | multi (checkbox chips) | bool | text */
  const FIELDS = {
    // ---- rooms & spaces ----
    bedrooms:     { kind: 'count',  ar: 'غرف النوم', en: 'Bedrooms', icon: 'bed-double' },
    bathrooms:    { kind: 'count',  ar: 'دورات المياه', en: 'Bathrooms', icon: 'bath' },
    livingRooms:  { kind: 'count',  ar: 'الصالات', en: 'Living rooms', icon: 'sofa' },
    majlisMen:    { kind: 'count',  ar: 'مجلس رجال', en: 'Men’s majlis', icon: 'armchair' },
    majlisWomen:  { kind: 'count',  ar: 'مجلس نساء', en: 'Women’s majlis', icon: 'armchair' },
    muqallat:     { kind: 'count',  ar: 'مقلط', en: 'Muqallat (family lounge)', icon: 'sofa' },
    kitchens:     { kind: 'count',  ar: 'المطابخ', en: 'Kitchens', icon: 'cooking-pot' },
    diningRooms:  { kind: 'count',  ar: 'غرف الطعام', en: 'Dining rooms', icon: 'utensils' },
    maidRooms:    { kind: 'count',  ar: 'غرفة خادمة', en: 'Maid room', icon: 'bed-single' },
    driverRooms:  { kind: 'count',  ar: 'غرفة سائق', en: 'Driver room', icon: 'car' },
    storeRooms:   { kind: 'count',  ar: 'غرفة مستودع / تخزين', en: 'Storage room', icon: 'package' },
    laundryRooms: { kind: 'count',  ar: 'غرفة غسيل', en: 'Laundry room', icon: 'washing-machine' },
    floors:       { kind: 'count',  ar: 'عدد الأدوار', en: 'Floors', icon: 'layers-3' },
    floorNo:      { kind: 'select', ar: 'رقم الدور', en: 'Floor level', icon: 'layers-3',
                    options: [O('ground', 'أرضي', 'Ground'), O('first', 'أول', 'First'), O('second', 'ثاني', 'Second'), O('third_plus', 'ثالث فأكثر', 'Third or higher'), O('any', 'لا يهم', 'Any')] },
    units:        { kind: 'count',  ar: 'عدد الوحدات / الشقق', en: 'Units / apartments', icon: 'building' },
    // ---- plot & building ----
    areaMin:      { kind: 'number', ar: 'المساحة من (م²)', en: 'Area from (m²)', icon: 'ruler' },
    areaMax:      { kind: 'number', ar: 'المساحة إلى (م²)', en: 'Area to (m²)', icon: 'ruler' },
    area:         { kind: 'number', ar: 'المساحة (م²)', en: 'Area (m²)', icon: 'ruler' },
    buildArea:    { kind: 'number', ar: 'مساحة البناء (م²)', en: 'Built-up area (m²)', icon: 'ruler' },
    streetWidth:  { kind: 'number', ar: 'عرض الشارع (م)', en: 'Street width (m)', icon: 'route' },
    frontage:     { kind: 'number', ar: 'عرض الواجهة (م)', en: 'Frontage (m)', icon: 'move-horizontal' },
    facade:       { kind: 'multi',  ar: 'الواجهة', en: 'Facing', icon: 'compass',
                    options: [O('north', 'شمالية', 'North'), O('south', 'جنوبية', 'South'), O('east', 'شرقية', 'East'), O('west', 'غربية', 'West')] },
    corner:       { kind: 'bool',   ar: 'ركن (على شارعين)', en: 'Corner (two streets)', icon: 'corner-down-right' },
    age:          { kind: 'select', ar: 'عمر العقار', en: 'Property age', icon: 'calendar-clock',
                    options: [O('new', 'جديد', 'New'), O('lt5', 'أقل من 5 سنوات', 'Under 5 years'), O('5to10', '5 – 10 سنوات', '5–10 years'), O('gt10', 'أكثر من 10 سنوات', 'Over 10 years'), O('any', 'لا يهم', 'Any')] },
    finishing:    { kind: 'select', ar: 'التشطيب', en: 'Finishing', icon: 'paint-roller',
                    options: [O('luxury', 'سوبر لوكس', 'Super deluxe'), O('good', 'جيد', 'Good'), O('ready', 'جاهز للسكن', 'Ready to live in'), O('bare', 'عظم / بدون تشطيب', 'Shell only'), O('any', 'لا يهم', 'Any')] },
    // ---- rent / sale terms ----
    furnished:    { kind: 'select', ar: 'الأثاث', en: 'Furnishing', icon: 'sofa',
                    options: [O('unfurnished', 'غير مفروش', 'Unfurnished'), O('semi', 'مفروش جزئياً', 'Semi-furnished'), O('furnished', 'مفروش', 'Furnished'), O('any', 'لا يهم', 'Any')] },
    tenantType:   { kind: 'select', ar: 'نوع السكن', en: 'Occupants', icon: 'users',
                    options: [O('family', 'عائلة', 'Family'), O('singles', 'عزاب', 'Singles'), O('company', 'شركة / موظفين', 'Company staff'), O('any', 'لا يهم', 'Any')] },
    payment:      { kind: 'select', ar: 'طريقة دفع الإيجار', en: 'Rent payment', icon: 'wallet',
                    options: [O('yearly', 'سنوي', 'Yearly'), O('semi', 'نصف سنوي', 'Semi-annual'), O('quarterly', 'ربع سنوي', 'Quarterly'), O('monthly', 'شهري', 'Monthly'), O('any', 'لا يهم', 'Any')] },
    financing:    { kind: 'select', ar: 'طريقة الشراء', en: 'Purchase method', icon: 'banknote',
                    options: [O('cash', 'كاش', 'Cash'), O('bank', 'تمويل بنكي', 'Bank financing'), O('any', 'لا يهم', 'Any')] },
    deedType:     { kind: 'select', ar: 'نوع الصك', en: 'Deed type', icon: 'file-check',
                    options: [O('electronic', 'صك إلكتروني', 'Electronic deed'), O('title', 'تسجيل عيني', 'Real-estate title'), O('manual', 'صك ورقي', 'Paper deed'), O('none', 'بدون صك', 'No deed')] },
    landUse:      { kind: 'select', ar: 'استخدام الأرض', en: 'Land use', icon: 'map',
                    options: [O('residential', 'سكني', 'Residential'), O('commercial', 'تجاري', 'Commercial'), O('mixed', 'سكني تجاري', 'Mixed use'), O('industrial', 'صناعي', 'Industrial'), O('agri', 'زراعي', 'Agricultural')] },
    income:       { kind: 'number', ar: 'الدخل السنوي (ريال)', en: 'Annual income (SAR)', icon: 'trending-up' },
    leased:       { kind: 'select', ar: 'حالة التأجير', en: 'Occupancy', icon: 'key-round',
                    options: [O('full', 'مؤجرة بالكامل', 'Fully leased'), O('part', 'مؤجرة جزئياً', 'Partly leased'), O('vacant', 'شاغرة', 'Vacant')] },
    activity:     { kind: 'text',   ar: 'النشاط المطلوب / المسموح', en: 'Business activity', icon: 'store' },
    mezzanine:    { kind: 'bool',   ar: 'ميزانين', en: 'Mezzanine', icon: 'layers' },
    investType:   { kind: 'text',   ar: 'نوع الفرصة / الشراكة', en: 'Opportunity type', icon: 'handshake' },
    capital:      { kind: 'number', ar: 'رأس المال المتاح (ريال)', en: 'Available capital (SAR)', icon: 'wallet' },
    // ---- features ----
    features:     { kind: 'multi',  ar: 'المرافق والمميزات', en: 'Features', icon: 'sparkles',
                    options: [
                      O('elevator', 'مصعد', 'Elevator'), O('parking', 'مواقف سيارات', 'Parking'), O('garage', 'كراج خاص', 'Private garage'),
                      O('yard', 'حوش', 'Yard'), O('garden', 'حديقة', 'Garden'), O('pool', 'مسبح', 'Pool'), O('annex', 'ملحق', 'Annex'),
                      O('roof', 'سطح', 'Roof'), O('basement', 'بدروم / قبو', 'Basement'), O('central_ac', 'تكييف مركزي', 'Central A/C'),
                      O('split_ac', 'مكيفات سبليت', 'Split A/C'), O('fitted_kitchen', 'مطبخ راكب', 'Fitted kitchen'), O('private_entrance', 'مدخل خاص', 'Private entrance'),
                      O('smart_home', 'منزل ذكي', 'Smart home'), O('cctv', 'كاميرات مراقبة', 'CCTV'), O('security', 'حراسة / أمن', 'Security'),
                      O('gym', 'نادي رياضي', 'Gym'), O('playground', 'ملعب / حديقة أطفال', 'Playground'), O('solar', 'طاقة شمسية', 'Solar power')
                    ] },
    utilities:    { kind: 'multi',  ar: 'الخدمات المتوفرة', en: 'Utilities', icon: 'plug-zap',
                    options: [O('electricity', 'كهرباء', 'Electricity'), O('water', 'مياه', 'Water'), O('sewage', 'صرف صحي', 'Sewage'), O('paved', 'شوارع مسفلتة', 'Paved roads'), O('lights', 'إنارة', 'Street lights')] },
    nearby:       { kind: 'multi',  ar: 'قريب من', en: 'Close to', icon: 'map-pin',
                    options: [O('mosque', 'مسجد', 'Mosque'), O('school', 'مدرسة', 'School'), O('hospital', 'مستشفى', 'Hospital'), O('metro', 'مترو / نقل عام', 'Metro / transit'), O('mall', 'مول / أسواق', 'Mall / market'), O('park', 'حديقة', 'Park'), O('main_road', 'طريق رئيسي', 'Main road')] },
    urgency:      { kind: 'select', ar: 'متى تحتاج العقار؟', en: 'When do you need it?', icon: 'timer',
                    options: [O('now', 'فوراً', 'Immediately'), O('month', 'خلال شهر', 'Within a month'), O('3months', 'خلال 3 أشهر', 'Within 3 months'), O('flexible', 'مرن', 'Flexible')] },
    contactPref:  { kind: 'select', ar: 'طريقة التواصل المفضلة', en: 'Preferred contact', icon: 'phone',
                    options: [O('call', 'اتصال', 'Phone call'), O('whatsapp', 'واتساب', 'WhatsApp'), O('any', 'أي وسيلة', 'Any')] },
    districts:    { kind: 'text',   ar: 'الأحياء المفضلة', en: 'Preferred districts', icon: 'map-pin' }
  };

  /* property type → form group */
  const GROUP_OF = {
    'villa': 'home', 'apartment': 'home', 'floor': 'home', 'compound': 'home',
    'land': 'land',
    'commercial-bldg': 'building', 'residential-bldg': 'building', 'complex': 'building',
    'shop': 'shop',
    'partnership': 'partner'
  };

  /* Sections of the form per group. `deal` conditions: only for rent | sale | invest. */
  const LAYOUT = {
    home: [
      { id: 'size', ar: 'المساحة والتوزيع', en: 'Size & layout', fields: ['areaRange', 'floors', 'floorNo:apartment,floor', 'bedrooms', 'bathrooms', 'livingRooms', 'kitchens', 'diningRooms'] },
      { id: 'majlis', ar: 'المجالس والغرف الإضافية', en: 'Majlis & extra rooms', fields: ['majlisMen', 'majlisWomen', 'muqallat', 'maidRooms', 'driverRooms', 'storeRooms', 'laundryRooms'] },
      { id: 'terms', ar: 'الشروط', en: 'Terms', fields: ['furnished:rent', 'tenantType:rent', 'payment:rent', 'financing:sale', 'finishing:sale', 'age'] },
      { id: 'exterior', ar: 'الموقع والواجهة', en: 'Location & facing', fields: ['facade', 'corner', 'streetWidth'] },
      { id: 'features', ar: 'المرافق والمميزات', en: 'Features', fields: ['features', 'nearby'] }
    ],
    land: [
      { id: 'size', ar: 'الأرض', en: 'The land', fields: ['areaRange', 'landUse', 'streetWidth', 'frontage', 'facade', 'corner'] },
      { id: 'terms', ar: 'الصك والخدمات', en: 'Deed & utilities', fields: ['deedType', 'financing:sale,invest', 'utilities', 'nearby'] }
    ],
    building: [
      { id: 'size', ar: 'العقار', en: 'The building', fields: ['areaRange', 'floors', 'units', 'age', 'streetWidth', 'facade', 'corner'] },
      { id: 'terms', ar: 'الدخل والحالة', en: 'Income & condition', fields: ['leased', 'income', 'financing:sale,invest', 'deedType'] },
      { id: 'features', ar: 'المرافق', en: 'Features', fields: ['features', 'nearby'] }
    ],
    shop: [
      { id: 'size', ar: 'المحل', en: 'The shop', fields: ['areaRange', 'frontage', 'streetWidth', 'activity', 'mezzanine', 'bathrooms'] },
      { id: 'terms', ar: 'الشروط', en: 'Terms', fields: ['payment:rent', 'financing:sale,invest', 'age', 'features', 'nearby'] }
    ],
    partner: [
      { id: 'size', ar: 'الفرصة', en: 'The opportunity', fields: ['investType', 'capital', 'areaRange', 'financing:invest'] }
    ]
  };

  const NUM = (n) => (n === '' || n === null || n === undefined || isNaN(+n)) ? null : +n;

  /* Summary chips for an ad / request: [{icon, text{ar,en}}] built from `details` */
  function labelOf(key, val, lang) {
    const f = FIELDS[key]; if (!f) return String(val);
    const pick = (o) => (lang === 'en' ? o.en : o.ar);
    if (f.kind === 'select') { const o = (f.options || []).find((x) => x.v === val); return o ? pick(o) : String(val); }
    if (f.kind === 'multi') return [].concat(val).map((v) => { const o = (f.options || []).find((x) => x.v === v); return o ? pick(o) : v; }).join('، ');
    if (f.kind === 'bool') return val ? pick(yes) : '';
    return String(val);
  }

  const api = { FIELDS, GROUP_OF, LAYOUT, NUM, labelOf };
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  else root.PROP = api;
})(typeof window !== 'undefined' ? window : globalThis);
