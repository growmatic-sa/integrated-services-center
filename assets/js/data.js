/* =========================================================
   Services catalog (AR / EN)
   Each item: [icon, titleAr, titleEn, descAr, descEn]
   Icons: https://lucide.dev (v0.460)
   ========================================================= */

window.SITE = {
  name: { ar: 'مركز الخدمات المتكاملة', en: 'Integrated Services Center' },
  tagline: { ar: 'كل خدماتك .. في مكان واحد', en: 'All your services .. in one place' },
  // رقم الجوال والواتساب: 0552408287
  phone: '+966552408287',
  phoneDisplay: '055 240 8287',
  unified: '',                 // الرقم الموحد (اتركه فارغاً إن لم يوجد)
  whatsapp: '966552408287',
  email: 'info@example.com',   // بريد مؤقت — Placeholder email
  address: { ar: 'الرياض، حي العليا، طريق الملك فهد', en: 'King Fahd Rd, Al Olaya, Riyadh' },
  hours: { ar: 'السبت – الخميس: 9 ص – 10 م', en: 'Sat – Thu: 9 AM – 10 PM' },
  cities: [
    ['الرياض', 'Riyadh'], ['جدة', 'Jeddah'], ['مكة المكرمة', 'Makkah'], ['المدينة المنورة', 'Madinah'],
    ['الدمام', 'Dammam'], ['الخبر', 'Khobar'], ['الظهران', 'Dhahran'], ['الأحساء', 'Al Ahsa'],
    ['الطائف', 'Taif'], ['بريدة', 'Buraidah'], ['عنيزة', 'Unaizah'], ['حائل', 'Hail'], ['تبوك', 'Tabuk'],
    ['أبها', 'Abha'], ['خميس مشيط', 'Khamis Mushait'], ['جازان', 'Jazan'], ['نجران', 'Najran'],
    ['الباحة', 'Al Baha'], ['الجوف', 'Al Jouf'], ['عرعر', 'Arar'], ['ينبع', 'Yanbu'], ['الجبيل', 'Jubail'],
    ['القطيف', 'Qatif'], ['حفر الباطن', 'Hafar Al Batin']
  ]
};

window.CATALOG = {

  /* =====================================================
     الخدمات العقارية — Real Estate
     ===================================================== */
  realestate: {
    title: { ar: 'الخدمات العقارية', en: 'Real Estate Services' },
    categories: [
      {
        id: 'sale', icon: 'home', img: 'villa-1.jpg',
        title: { ar: 'البيع والشراء والتسويق', en: 'Sales, Purchase & Marketing' },
        desc: { ar: 'نوصلك بالعقار المناسب أو المشتري الجاد بأفضل قيمة', en: 'Connecting you with the right property or a serious buyer at the best value' },
        items: [
          ['home', 'بيع الفلل والشقق', 'Selling Villas & Apartments', 'تسويق وبيع عقارك السكني بسعر عادل وإجراءات واضحة حتى الإفراغ.', 'Marketing and selling your residential property at a fair price with clear steps through to title transfer.'],
          ['map', 'بيع وشراء الأراضي', 'Land Sales & Purchase', 'أراضٍ سكنية وتجارية وزراعية مع التحقق من الصك والمخطط والاستخدام.', 'Residential, commercial and agricultural land with deed, plan and land-use verification.'],
          ['building-2', 'بيع العمائر والمباني التجارية', 'Buildings & Commercial Assets', 'تسويق العمائر السكنية والتجارية والمجمعات للمستثمرين.', 'Marketing residential/commercial buildings and compounds to investors.'],
          ['search', 'البحث عن عقار حسب الطلب', 'Property Search on Request', 'أخبرنا بمواصفاتك وميزانيتك ونبحث لك ونرشّح الأنسب.', 'Tell us your criteria and budget — we search and shortlist the best matches.'],
          ['handshake', 'الوساطة العقارية', 'Real Estate Brokerage', 'وساطة مرخّصة بين البائع والمشتري والتفاوض نيابةً عنك.', 'Licensed brokerage between buyer and seller, negotiating on your behalf.'],
          ['megaphone', 'التسويق العقاري الرقمي', 'Digital Property Marketing', 'حملات إعلانية ونشر العقار في المنصات المرخّصة ووسائل التواصل.', 'Ad campaigns and listings on licensed platforms and social media.'],
          ['camera', 'التصوير الاحترافي والجولات الافتراضية', 'Professional Photography & 3D Tours', 'تصوير فوتوغرافي وجوي (درون) وجولات 360° تُبرز عقارك.', 'Photography, drone shots and 360° virtual tours that showcase your property.'],
          ['gavel', 'المزادات العقارية', 'Real Estate Auctions', 'تنظيم المزادات العقارية أو تمثيلك في المزادات القائمة.', 'Organizing property auctions or representing you in ongoing ones.'],
          ['layout-grid', 'البيع على الخارطة (وافي)', 'Off-Plan Sales (Wafi)', 'تسويق مشاريع البيع على الخارطة المرخّصة من برنامج وافي.', 'Marketing off-plan projects licensed under the Wafi program.'],
          ['scale', 'إعداد عقود البيع والشراء', 'Sale & Purchase Contracts', 'صياغة عقود واضحة تحفظ حقوق الطرفين قبل الإفراغ.', 'Drafting clear contracts that protect both parties before transfer.'],
          ['clipboard-check', 'فحص العقار قبل الشراء', 'Pre-Purchase Inspection', 'فحص هندسي شامل للهيكل والكهرباء والسباكة والعزل قبل قرار الشراء.', 'Full engineering inspection of structure, electrical, plumbing and insulation before you buy.'],
          ['badge-percent', 'استبدال العقار (البدل)', 'Property Exchange', 'مساعدتك في استبدال عقارك الحالي بعقار آخر يناسب احتياجك.', 'Helping you swap your current property for one that fits your needs.']
        ]
      },
      {
        id: 'rent', icon: 'key-round', img: 'keys.jpg',
        title: { ar: 'التأجير وعقود الإيجار', en: 'Leasing & Rental Contracts' },
        desc: { ar: 'تأجير سكني وتجاري موثّق ومتابعة كاملة للعقد', en: 'Documented residential & commercial leasing with full contract follow-up' },
        items: [
          ['key-round', 'تأجير الوحدات السكنية', 'Residential Leasing', 'شقق وفلل ودوبلكس للعائلات والأفراد مع التحقق من المستأجر.', 'Apartments, villas and duplexes for families and individuals with tenant screening.'],
          ['store', 'تأجير المحلات والمعارض', 'Shops & Showrooms Leasing', 'محلات تجارية ومعارض في مواقع حيوية تناسب نشاطك.', 'Retail shops and showrooms in prime locations for your business.'],
          ['briefcase', 'تأجير المكاتب الإدارية', 'Office Leasing', 'مكاتب مجهّزة وغير مجهّزة ومساحات عمل مشتركة.', 'Furnished/unfurnished offices and co-working spaces.'],
          ['warehouse', 'تأجير المستودعات والأراضي', 'Warehouses & Land Leasing', 'مستودعات وورش وأراضٍ للتخزين والأنشطة الصناعية.', 'Warehouses, workshops and land for storage and industrial use.'],
          ['file-pen-line', 'توثيق العقود عبر منصة إيجار', 'Ejar Contract Registration', 'تسجيل وتوثيق عقد الإيجار الإلكتروني الموحّد عبر منصة إيجار.', 'Registering the unified electronic lease on the Ejar platform.'],
          ['refresh-cw', 'تجديد وتعديل عقود الإيجار', 'Lease Renewal & Amendment', 'تجديد العقود قبل انتهائها وتعديل بنودها وفق الاتفاق.', 'Renewing leases before expiry and amending terms as agreed.'],
          ['banknote', 'تحصيل الإيجارات', 'Rent Collection', 'تحصيل الدفعات في مواعيدها ومتابعة المتأخرات وتقارير دورية للمالك.', 'On-time collection, arrears follow-up and periodic owner reports.'],
          ['user-check', 'التحقق من المستأجرين', 'Tenant Screening', 'التحقق من هوية المستأجر وسجله والتزاماته قبل التوقيع.', 'Verifying tenant identity, history and commitments before signing.'],
          ['door-open', 'الاستلام والتسليم وتقارير الحالة', 'Move-in / Move-out Reports', 'محضر استلام وتسليم موثّق بالصور يحفظ حقوق الطرفين.', 'Photo-documented handover reports that protect both parties.'],
          ['scale', 'إخلاء الوحدات والمطالبات', 'Evictions & Claims', 'متابعة الإخلاء والمطالبة بالمتأخرات عبر السند التنفيذي لعقد إيجار.', 'Eviction and arrears claims via the enforceable Ejar contract.'],
          ['bed-double', 'الوحدات المفروشة والتأجير قصير المدى', 'Furnished & Short-Term Rentals', 'تشغيل الشقق المفروشة وبيوت العطلات وإدارتها على منصات الحجز مع التراخيص اللازمة.', 'Operating furnished units and holiday homes on booking platforms with required licensing.'],
          ['tent-tree', 'تأجير الاستراحات والشاليهات', 'Rest Houses & Chalets', 'تأجير الاستراحات والشاليهات والمخيمات لليوم أو المواسم.', 'Daily and seasonal rental of rest houses, chalets and camps.']
        ]
      },
      {
        id: 'pro', icon: 'briefcase', img: 'consult.jpg',
        title: { ar: 'الخدمات المهنية وإدارة الأملاك', en: 'Professional Services & Property Management' },
        desc: { ar: 'إدارة احترافية لعقارك تحافظ على قيمته وتنمّي عائده', en: 'Professional management that protects value and grows your returns' },
        items: [
          ['building', 'إدارة الأملاك', 'Property Management', 'إدارة شاملة للوحدات: تسويق، تأجير، تحصيل، صيانة، وتقارير مالية.', 'End-to-end management: marketing, leasing, collection, maintenance and financial reports.'],
          ['settings', 'إدارة المرافق', 'Facility Management', 'تشغيل وصيانة الأنظمة والخدمات المشتركة في المباني والمجمعات.', 'Operating and maintaining systems and shared services in buildings and compounds.'],
          ['users', 'إدارة اتحاد الملاك (ملاك)', 'Owners Association (Mullak)', 'تأسيس اتحاد الملاك وتسجيله في منصة ملاك وإدارة الأجزاء المشتركة.', 'Setting up and registering owners associations on Mullak and managing common areas.'],
          ['calculator', 'التقييم العقاري المعتمد', 'Certified Property Valuation', 'تقارير تقييم صادرة عن مقيّمين معتمدين لدى الهيئة السعودية للمقيّمين المعتمدين (تقييم).', 'Valuation reports by valuers accredited with the Saudi Authority for Accredited Valuers (Taqeem).'],
          ['message-square-text', 'الاستشارات العقارية', 'Real Estate Consulting', 'رأي مهني قبل الشراء أو البيع أو الاستثمار مبني على بيانات السوق.', 'Professional advice before buying, selling or investing, backed by market data.'],
          ['chart-line', 'دراسات السوق والجدوى', 'Market & Feasibility Studies', 'دراسات جدوى للمشاريع وتحليل العرض والطلب والأسعار في الحي والمدينة.', 'Project feasibility and supply, demand and price analysis by district and city.'],
          ['briefcase-business', 'إدارة المحافظ العقارية', 'Portfolio Management', 'إدارة محفظة متعددة الأصول وتحسين الإشغال والعائد.', 'Managing multi-asset portfolios to improve occupancy and yield.'],
          ['scale', 'الاستشارات القانونية العقارية', 'Real Estate Legal Advice', 'مراجعة العقود والصكوك والنزاعات العقارية بالتعاون مع مختصين.', 'Reviewing contracts, deeds and disputes with specialist partners.'],
          ['file-bar-chart', 'التقارير الدورية للملاك', 'Owner Reporting', 'تقارير شهرية بالإشغال والإيرادات والمصروفات والصيانة.', 'Monthly reports on occupancy, revenue, expenses and maintenance.'],
          ['heart-handshake', 'إدارة أملاك الورثة والأوقاف', 'Estates & Endowments Management', 'إدارة عادلة وشفافة لعقارات الورثة والأوقاف وتوزيع العوائد.', 'Fair, transparent management of inherited and endowed properties and distributions.']
        ]
      },
      {
        id: 'docs', icon: 'file-check', img: 'docs-sign.jpg',
        title: { ar: 'التوثيق والإجراءات العقارية', en: 'Real Estate Documentation & Permits' },
        desc: { ar: 'نُنجز الإجراءات الحكومية لعقارك من الصك حتى الرخصة', en: 'We complete government procedures for your property — from deed to permit' },
        items: [
          ['file-check', 'الإفراغ العقاري', 'Title Transfer (Ifragh)', 'إتمام نقل الملكية إلكترونياً بين البائع والمشتري.', 'Completing electronic ownership transfer between seller and buyer.'],
          ['scroll-text', 'استخراج وتحديث الصكوك', 'Deed Issuance & Update', 'استخراج الصك الإلكتروني وتحديث بيانات الصكوك الورقية القديمة.', 'Issuing electronic deeds and updating legacy paper deeds.'],
          ['database', 'التسجيل العيني للعقار', 'Real Estate Registry (RER)', 'تسجيل العقار في السجل العقاري والحصول على رقم الهوية العقارية.', 'Registering the property in the Real Estate Registry and obtaining its ID.'],
          ['split', 'فرز الوحدات والصكوك', 'Unit Subdivision', 'فرز الشقق والوحدات وإصدار صك مستقل لكل وحدة.', 'Subdividing units and issuing a separate deed for each.'],
          ['ruler', 'القرار المساحي والرفع المساحي', 'Survey Report & Land Survey', 'إصدار القرار المساحي ورفع الحدود والأطوال بدقة.', 'Issuing survey decisions and precise boundary surveys.'],
          ['hard-hat', 'رخص البناء', 'Building Permits', 'استخراج رخصة البناء عبر منصة بلدي مع المخططات المعتمدة.', 'Obtaining building permits via Balady with approved drawings.'],
          ['hammer', 'رخص الترميم والهدم', 'Renovation & Demolition Permits', 'تراخيص الترميم والإضافة والهدم وفق اشتراطات البلدية.', 'Renovation, extension and demolition permits per municipal requirements.'],
          ['badge-check', 'شهادة إتمام البناء والإشغال', 'Completion & Occupancy Certificates', 'إصدار شهادة إتمام البناء بعد مطابقة التنفيذ للرخصة.', 'Issuing completion certificates after verifying compliance with the permit.'],
          ['receipt', 'ضريبة التصرفات العقارية', 'Real Estate Transaction Tax', 'حساب وسداد ضريبة التصرفات العقارية (5%) قبل الإفراغ.', 'Calculating and paying the 5% Real Estate Transaction Tax before transfer.'],
          ['landmark', 'رسوم الأراضي البيضاء', 'White Land Fees', 'الاستعلام عن الرسوم والاعتراض والتطوير لتجنب الغرامات.', 'Fee inquiries, objections and development options to avoid penalties.'],
          ['house-plus', 'الدعم السكني (سكني)', 'Housing Support (Sakani)', 'التسجيل في سكني واختيار المنتج المناسب وإتمام الإجراءات.', 'Registering on Sakani, choosing the right product and completing steps.'],
          ['file-search', 'الاستعلام عن العقار والتحقق من الصك', 'Deed Verification', 'التحقق من سريان الصك وخلوه من الرهن أو الإيقاف قبل الشراء.', 'Verifying deed validity and that it is free of mortgage or holds before purchase.']
        ]
      },
      {
        id: 'dev', icon: 'drafting-compass', img: 'blueprint.jpg',
        title: { ar: 'التصميم والتطوير والمقاولات', en: 'Design, Development & Contracting' },
        desc: { ar: 'من الفكرة والمخطط إلى المفتاح', en: 'From concept and drawings to handover' },
        items: [
          ['drafting-compass', 'التصميم المعماري والإنشائي', 'Architectural & Structural Design', 'مخططات معمارية وإنشائية وكهربائية وصحية معتمدة.', 'Approved architectural, structural, electrical and plumbing drawings.'],
          ['sofa', 'التصميم الداخلي', 'Interior Design', 'تصاميم داخلية عصرية مع صور ثلاثية الأبعاد وجداول كميات.', 'Modern interiors with 3D renders and bills of quantities.'],
          ['brick-wall', 'المقاولات العامة والبناء', 'General Contracting', 'تنفيذ العظم والتشطيب للفلل والعمائر والمباني التجارية.', 'Shell and finishing works for villas, buildings and commercial projects.'],
          ['paint-roller', 'التشطيبات والديكورات', 'Finishing & Decor', 'تشطيب كامل بجودة عالية: لياسة، بلاط، دهانات، جبس، إضاءة.', 'Complete high-quality finishing: plaster, tiling, paint, gypsum, lighting.'],
          ['construction', 'الترميم وإعادة التأهيل', 'Renovation & Rehabilitation', 'تجديد المباني القديمة ورفع كفاءتها وقيمتها السوقية.', 'Renovating older buildings to raise efficiency and market value.'],
          ['eye', 'الإشراف الهندسي', 'Engineering Supervision', 'إشراف مكتب هندسي على التنفيذ وجودة المواد والجدول الزمني.', 'Engineering oversight of execution, material quality and schedule.'],
          ['kanban', 'إدارة المشاريع', 'Project Management', 'تخطيط ومتابعة المشروع والتكلفة والمقاولين حتى التسليم.', 'Planning and tracking project, cost and contractors to handover.'],
          ['building-2', 'التطوير العقاري', 'Real Estate Development', 'تطوير الأراضي إلى مشاريع سكنية وتجارية مدروسة العائد.', 'Turning land into residential and commercial projects with solid returns.'],
          ['trees', 'تنسيق الحدائق واللاندسكيب', 'Landscaping', 'تصميم وتنفيذ الحدائق والمسطحات الخضراء وأنظمة الري.', 'Designing and building gardens, lawns and irrigation systems.'],
          ['waves', 'إنشاء المسابح', 'Swimming Pool Construction', 'تصميم وتنفيذ المسابح وأنظمة الفلترة والإضاءة.', 'Designing and building pools with filtration and lighting.'],
          ['shield-check', 'العزل المائي والحراري', 'Water & Thermal Insulation', 'عزل الأسطح والخزانات ودورات المياه لتوفير الطاقة ومنع التسربات.', 'Insulating roofs, tanks and wet areas to save energy and prevent leaks.']
        ]
      },
      {
        id: 'maint', icon: 'wrench', img: 'electric.jpg',
        title: { ar: 'الصيانة والخدمات الفنية', en: 'Maintenance & Technical Services' },
        desc: { ar: 'فنيون موثوقون لكل أعطال المنزل والمبنى', en: 'Trusted technicians for every home and building fix' },
        items: [
          ['droplets', 'السباكة', 'Plumbing', 'إصلاح التسربات وتمديدات المياه والصرف وتركيب الأدوات الصحية.', 'Leak repairs, water and drainage lines, and sanitary fixtures.'],
          ['zap', 'الكهرباء', 'Electrical', 'تمديدات وإصلاح الأعطال واللوحات والإنارة والمقابس.', 'Wiring, fault repairs, panels, lighting and sockets.'],
          ['snowflake', 'التكييف والتبريد', 'Air Conditioning', 'صيانة وتنظيف وتركيب المكيفات السبليت والشباك والمركزي وتعبئة الفريون.', 'Servicing, cleaning and installing split, window and central AC units, and gas refills.'],
          ['scan-search', 'كشف التسربات إلكترونياً', 'Electronic Leak Detection', 'كشف تسربات المياه بالأجهزة الحرارية دون تكسير.', 'Thermal leak detection without breaking walls.'],
          ['container', 'تنظيف وعزل الخزانات', 'Water Tank Cleaning', 'تنظيف وتعقيم الخزانات العلوية والأرضية وعزلها.', 'Cleaning, sanitizing and sealing roof and ground tanks.'],
          ['flame', 'السخانات', 'Water Heaters', 'تركيب وصيانة السخانات الكهربائية والمركزية.', 'Installing and servicing electric and central heaters.'],
          ['hammer', 'النجارة', 'Carpentry', 'أبواب، خزائن، مطابخ، وإصلاح الأثاث الخشبي.', 'Doors, wardrobes, kitchens and wooden furniture repairs.'],
          ['paintbrush', 'الدهانات', 'Painting', 'دهانات داخلية وخارجية وورق جدران بألوان وتشطيبات متنوعة.', 'Interior and exterior painting and wallpaper in many finishes.'],
          ['grid-3x3', 'البلاط والسيراميك والرخام', 'Tiling, Ceramics & Marble', 'تركيب وصيانة البلاط والرخام والجلي والتلميع.', 'Installing and repairing tiles and marble, plus polishing.'],
          ['layers', 'الجبس والأسقف المعلّقة', 'Gypsum & False Ceilings', 'أعمال الجبس بورد والأسقف المعلقة والديكورات.', 'Gypsum board, suspended ceilings and decorative works.'],
          ['app-window', 'الألمنيوم والزجاج', 'Aluminium & Glass', 'نوافذ وأبواب ومطابخ ألمنيوم وواجهات زجاجية.', 'Aluminium windows, doors, kitchens and glass façades.'],
          ['washing-machine', 'صيانة الأجهزة المنزلية', 'Home Appliance Repair', 'غسالات، ثلاجات، أفران، ونشافات بقطع غيار أصلية.', 'Washers, fridges, ovens and dryers with genuine parts.'],
          ['arrow-up-down', 'صيانة المصاعد', 'Elevator Maintenance', 'عقود صيانة دورية وإصلاح أعطال المصاعد.', 'Periodic maintenance contracts and elevator repairs.'],
          ['cctv', 'كاميرات المراقبة والأنظمة الأمنية', 'CCTV & Security Systems', 'تركيب كاميرات وأنظمة إنذار وانتركم وبوابات ذكية.', 'Cameras, alarms, intercoms and smart gates.'],
          ['siren', 'أنظمة الإطفاء والإنذار', 'Fire Alarm & Fighting', 'تركيب وصيانة أنظمة الحريق وفق اشتراطات الدفاع المدني.', 'Installing and servicing fire systems per Civil Defense requirements.'],
          ['sun', 'الطاقة الشمسية', 'Solar Energy', 'ألواح شمسية للمنازل والمنشآت لخفض فاتورة الكهرباء.', 'Solar panels for homes and facilities to cut power bills.'],
          ['wifi', 'الشبكات والمنزل الذكي', 'Networks & Smart Home', 'تمديد الشبكات وتقوية الواي فاي وأنظمة المنزل الذكي.', 'Network cabling, Wi-Fi boosting and smart home systems.'],
          ['lock', 'الأقفال والأبواب', 'Locks & Doors', 'فتح وتغيير الأقفال وتركيب الأقفال الذكية.', 'Unlocking, changing and installing smart locks.'],
          ['clipboard-list', 'عقود الصيانة الدورية', 'Preventive Maintenance Contracts', 'زيارات دورية مجدولة لفحص كل الأنظمة قبل أن تتعطل.', 'Scheduled visits to inspect all systems before they fail.']
        ]
      },
      {
        id: 'ops', icon: 'sparkles', img: 'cleaning.jpg',
        title: { ar: 'التشغيل والنظافة والأمن', en: 'Operations, Cleaning & Security' },
        desc: { ar: 'تشغيل يومي يجعل عقارك نظيفاً وآمناً ومريحاً', en: 'Daily operations that keep your property clean, safe and comfortable' },
        items: [
          ['sparkles', 'النظافة العامة والدورية', 'General & Periodic Cleaning', 'تنظيف المنازل والمكاتب والمباني بعقود يومية أو أسبوعية أو شهرية.', 'Home, office and building cleaning on daily, weekly or monthly contracts.'],
          ['spray-can', 'تنظيف ما بعد البناء', 'Post-Construction Cleaning', 'إزالة مخلفات البناء والتنظيف العميق قبل السكن.', 'Debris removal and deep cleaning before move-in.'],
          ['armchair', 'تنظيف الكنب والسجاد والمفروشات', 'Upholstery & Carpet Cleaning', 'غسيل بالبخار والتعقيم وإزالة البقع.', 'Steam cleaning, sanitizing and stain removal.'],
          ['building', 'تنظيف الواجهات الزجاجية', 'Façade & Glass Cleaning', 'تنظيف الواجهات والنوافذ العالية بمعدات آمنة.', 'Cleaning façades and high windows with safe equipment.'],
          ['bug', 'مكافحة الحشرات والقوارض', 'Pest Control', 'رش ومكافحة النمل الأبيض والصراصير والقوارض بمواد آمنة.', 'Treating termites, cockroaches and rodents with safe materials.'],
          ['shield', 'الحراسة والأمن', 'Security Guards', 'حراس أمن مدرّبون للمجمعات والمباني والمواقع.', 'Trained guards for compounds, buildings and sites.'],
          ['trash-2', 'إدارة النفايات', 'Waste Management', 'جمع ونقل النفايات ومخلفات البناء بشكل نظامي.', 'Regulated collection and removal of waste and construction debris.'],
          ['leaf', 'صيانة الحدائق', 'Garden Maintenance', 'قص وتشذيب وري وتسميد المسطحات الخضراء.', 'Mowing, trimming, irrigation and fertilizing.'],
          ['waves', 'صيانة المسابح', 'Pool Maintenance', 'تنظيف وتعقيم المسابح ومعالجة المياه وصيانة المضخات.', 'Pool cleaning, water treatment and pump servicing.'],
          ['user-cog', 'حارس العقار والمشرف المقيم', 'Building Caretaker', 'مشرف مقيم لمتابعة احتياجات السكان والطوارئ.', 'Resident supervisor for tenant needs and emergencies.'],
          ['truck', 'نقل العفش والتغليف', 'Moving & Packing', 'فك وتغليف ونقل وتركيب الأثاث بأمان داخل المدينة وخارجها.', 'Safe dismantling, packing, moving and reassembly — local and intercity.'],
          ['gauge', 'إدارة استهلاك الطاقة', 'Energy Management', 'خطط لخفض استهلاك الكهرباء والمياه في المباني.', 'Plans to reduce electricity and water consumption in buildings.']
        ]
      },
      {
        id: 'invest', icon: 'trending-up', img: 'towers.jpg',
        title: { ar: 'التمويل والاستثمار العقاري', en: 'Real Estate Finance & Investment' },
        desc: { ar: 'قرارات استثمارية مدروسة وتمويل يناسب دخلك', en: 'Informed investment decisions and financing that fits your income' },
        items: [
          ['landmark', 'التمويل العقاري', 'Mortgage Assistance', 'مقارنة عروض البنوك وجهات التمويل وتجهيز ملف الطلب.', 'Comparing bank and lender offers and preparing your application.'],
          ['piggy-bank', 'التمويل المدعوم', 'Subsidized Financing', 'الاستفادة من برامج الدعم السكني مع جهات التمويل المعتمدة.', 'Benefiting from housing support programs with approved lenders.'],
          ['trending-up', 'الفرص الاستثمارية', 'Investment Opportunities', 'عقارات مدرّة للدخل مختارة بعناية مع تحليل العائد.', 'Carefully selected income-generating properties with yield analysis.'],
          ['pie-chart', 'تحليل العائد على الاستثمار', 'ROI Analysis', 'حساب العائد والتدفقات النقدية وفترة الاسترداد قبل الشراء.', 'Calculating yield, cash flow and payback period before buying.'],
          ['coins', 'استشارات صناديق الاستثمار العقاري', 'REIT Guidance', 'التعريف بصناديق الريت والصناديق العقارية وآلية الاستثمار فيها.', 'An introduction to REITs and real estate funds and how to invest.'],
          ['globe', 'خدمات المستثمر الأجنبي', 'Foreign Investor Services', 'توضيح أنظمة تملّك غير السعوديين ومساعدتهم في الإجراءات.', 'Explaining non-Saudi ownership rules and helping with procedures.']
        ]
      }
    ]
  },

  /* =====================================================
     الخدمات العامة والمعاملات الحكومية — General Services
     ===================================================== */
  taqib: {
    title: { ar: 'الخدمات العامة', en: 'General Services' },
    categories: [
      {
        id: 'jawazat', icon: 'book-user', img: 'docs-work.jpg',
        title: { ar: 'الجوازات والإقامة', en: 'Passports & Residency (Jawazat)' },
        desc: { ar: 'خدمات الجوازات للمواطنين والمقيمين عبر أبشر', en: 'Passport services for citizens and residents via Absher' },
        items: [
          ['id-card', 'إصدار الإقامة', 'Iqama Issuance', 'إصدار هوية مقيم جديدة للعامل أو التابع وسداد الرسوم.', 'Issuing a new resident ID for a worker or dependent and paying fees.'],
          ['refresh-cw', 'تجديد الإقامة', 'Iqama Renewal', 'تجديد الإقامة وسداد الرسوم قبل انتهائها لتفادي الغرامات.', 'Renewing the iqama and paying fees before expiry to avoid fines.'],
          ['copy', 'بدل فاقد أو تالف للإقامة', 'Lost / Damaged Iqama Replacement', 'استخراج بدل فاقد أو تالف للإقامة.', 'Obtaining a replacement for a lost or damaged iqama.'],
          ['printer', 'طباعة الإقامة', 'Iqama Printing', 'طباعة الإقامة أو نسخة رسمية منها.', 'Printing the iqama or an official copy.'],
          ['book-open', 'إصدار الجواز', 'Passport Issuance', 'إصدار الجواز السعودي لأول مرة وإضافة التابعين.', 'First-time Saudi passport issuance and adding dependents.'],
          ['file-pen-line', 'تحديث بيانات الجواز', 'Passport Data Update', 'تحديث معلومات جواز المقيم في أنظمة الجوازات.', 'Updating a resident’s passport details in the system.'],
          ['refresh-cw', 'تجديد الجواز', 'Passport Renewal', 'تجديد الجواز السعودي أو تحديث بياناته إلكترونياً.', 'Renewing the Saudi passport or updating its details online.'],
          ['book-x', 'بدل فاقد للجواز', 'Lost Passport Replacement', 'تقديم بلاغ الفقدان واستخراج البدل.', 'Filing the loss report and obtaining a replacement.'],
          ['plane-takeoff', 'إصدار تأشيرة الخروج والعودة', 'Exit / Re-entry Visa Issuance', 'إصدار تأشيرة الخروج والعودة المفردة أو المتعددة.', 'Issuing single or multiple exit/re-entry visas.'],
          ['plane-landing', 'إلغاء تأشيرة الخروج والعودة', 'Exit / Re-entry Visa Cancellation', 'إلغاء تأشيرة خروج وعودة صادرة مسبقاً.', 'Cancelling a previously issued exit/re-entry visa.'],
          ['log-out', 'إصدار تأشيرة الخروج النهائي', 'Final Exit Visa Issuance', 'إصدار تأشيرة الخروج النهائي وإنهاء متطلباتها.', 'Issuing final exit visas and completing requirements.'],
          ['circle-x', 'إلغاء تأشيرة الخروج النهائي', 'Final Exit Visa Cancellation', 'إلغاء تأشيرة الخروج النهائي قبل السفر.', 'Cancelling a final exit visa before travel.'],
          ['ticket', 'إصدار تأشيرة الزيارة', 'Visit Visa Issuance', 'إصدار تأشيرات الزيارة العائلية والشخصية للأقارب.', 'Issuing family and personal visit visas for relatives.'],
          ['calendar-plus', 'تمديد تأشيرة الزيارة', 'Visit Visa Extension', 'تمديد تأشيرات الزيارة العائلية والشخصية.', 'Extending family and personal visit visas.'],
          ['users', 'خدمة التابعين والمرافقين', 'Dependents & Companions Service', 'إضافة التابعين وسداد رسوم المرافقين وتحديث البيانات.', 'Adding dependents, paying companion fees and updating records.'],
          ['ticket-check', 'تصاريح سفر التابعين', 'Dependents Travel Permits', 'إصدار تصاريح سفر التابعين عبر الخدمات الإلكترونية.', 'Issuing dependents’ travel permits online.'],
          ['clock', 'الإقامة المؤقتة', 'Temporary Residency', 'إصدار الإقامة المؤقتة ومتابعة متطلباتها.', 'Issuing temporary residency and following its requirements.'],
          ['baby', 'تسجيل مواليد المقيمين', 'Registering Residents’ Newborns', 'تسجيل المولود وإضافته في إقامة الوالد.', 'Registering newborns and adding them to the parent’s iqama.'],
          ['crown', 'الإقامة المميزة', 'Premium Residency', 'التعريف بالشروط وتجهيز طلب الإقامة المميزة.', 'Explaining eligibility and preparing the Premium Residency application.'],
          ['calendar-check', 'حجز مواعيد الجوازات', 'Jawazat Appointment Booking', 'حجز موعد لك في إدارة الجوازات للخدمات التي تتطلب الحضور.', 'Booking a Jawazat appointment for services that require attendance.']
        ]
      },
      {
        id: 'absher', icon: 'smartphone', img: 'docs-work.jpg',
        title: { ar: 'أبشر (أفراد وأعمال)', en: 'Absher (Individuals & Business)' },
        desc: { ar: 'تحديث وتفعيل حسابات أبشر وإدارة التفويضات', en: 'Updating and activating Absher accounts and managing authorizations' },
        items: [
          ['user-round-cog', 'تحديث أبشر أفراد', 'Absher Individuals Update', 'تحديث بيانات حساب أبشر أفراد وتفعيله وتغيير الجوال.', 'Updating an Absher Individuals account, activating it and changing the mobile.'],
          ['briefcase', 'تحديث أبشر أعمال', 'Absher Business Update', 'تحديث بيانات منشأتك والمخولين في أبشر أعمال.', 'Updating your establishment and authorized users on Absher Business.'],
          ['badge-check', 'تفعيل أبشر أعمال', 'Absher Business Activation', 'تفعيل حساب أبشر أعمال وربط المنشأة وإضافة المفوضين.', 'Activating Absher Business, linking the establishment and adding delegates.'],
          ['user-plus', 'التفويض الإلكتروني في أبشر', 'Absher E-Authorization', 'إعداد تفويض إلكتروني يتيح متابعة معاملاتك نيابةً عنك.', 'Setting up an e-authorization so we can handle transactions for you.']
        ]
      },
      {
        id: 'delivery', icon: 'truck', img: 'docs-work.jpg',
        title: { ar: 'خدمات التوصيل', en: 'Delivery Services' },
        desc: { ar: 'نوصّل أغراضك ومستنداتك ومشاويرك داخل المدينة وبين المدن', en: 'We deliver your items, documents and errands within and between cities' },
        items: [
          ['package', 'توصيل الطلبات والأغراض', 'Parcel & Item Delivery', 'استلام أغراضك من أي مكان وتوصيلها لباب البيت أو العمل في نفس اليوم.', 'Picking up your items from anywhere and delivering them to your door the same day.'],
          ['file-text', 'توصيل المستندات والمعاملات', 'Document Delivery', 'استلام وتسليم المستندات والأوراق الرسمية من الجهات والمكاتب بأمان.', 'Safely collecting and delivering documents and official papers to and from offices.'],
          ['car', 'توصيل المشاوير', 'Rides & Errands', 'سائق لمشاويرك اليومية: العمل، المستشفى، المطار، والتسوق.', 'A driver for your daily trips: work, hospital, airport and shopping.'],
          ['bus', 'توصيل الطلاب والمعلمات', 'Student & Teacher Transport', 'اشتراكات شهرية آمنة لتوصيل الطلاب والطالبات والمعلمات للمدارس والجامعات.', 'Safe monthly subscriptions for students and teachers to schools and universities.'],
          ['plane-landing', 'التوصيل من وإلى المطار', 'Airport Transfers', 'استقبال وتوصيل من وإلى المطار بمواعيد دقيقة.', 'Punctual pick-ups and drop-offs to and from the airport.'],
          ['map', 'الشحن والتوصيل بين المدن', 'Intercity Shipping', 'شحن وتوصيل الأغراض والطرود بين مدن المملكة.', 'Shipping items and parcels between cities across the Kingdom.'],
          ['shopping-cart', 'شراء وتوصيل المشتريات', 'Shopping & Delivery', 'نشتري لك مقاضيك واحتياجاتك ونوصلها لك.', 'We buy your groceries and essentials and bring them to you.'],
          ['truck', 'نقل العفش والأثاث', 'Furniture Moving', 'فك وتغليف ونقل وتركيب الأثاث داخل المدينة وخارجها.', 'Dismantling, packing, moving and reassembling furniture — local and intercity.']
        ]
      },
      {
        id: 'ahwal', icon: 'users', img: 'meeting.jpg',
        title: { ar: 'الأحوال المدنية', en: 'Civil Affairs' },
        desc: { ar: 'الهوية الوطنية وسجل الأسرة وتسجيل الوقائع', en: 'National ID, family register and vital records' },
        items: [
          ['id-card', 'إصدار الهوية الوطنية', 'National ID Issuance', 'إصدار الهوية لأول مرة وتجهيز المتطلبات.', 'First-time ID issuance and preparing requirements.'],
          ['refresh-cw', 'تجديد الهوية الوطنية', 'National ID Renewal', 'تجديد الهوية الوطنية إلكترونياً واستلامها.', 'Online ID renewal and pickup.'],
          ['copy', 'بدل فاقد الهوية الوطنية', 'Lost ID Replacement', 'استخراج بدل للهوية المفقودة أو التالفة.', 'Replacing lost or damaged IDs.'],
          ['calendar-check', 'حجز موعد الأحوال المدنية', 'Civil Affairs Appointment Booking', 'حجز موعد لك في مكتب الأحوال المدنية.', 'Booking an appointment for you at the Civil Affairs office.'],
          ['book-marked', 'إصدار سجل الأسرة', 'Family Register Issuance', 'إصدار وتحديث سجل الأسرة وإضافة الزوجة والأبناء.', 'Issuing and updating the family register and adding family members.'],
          ['book-x', 'إصدار سجل الأسرة لمتوفي', 'Family Register for the Deceased', 'استخراج سجل أسرة لمتوفى لأغراض الإرث والمعاملات.', 'Obtaining a family register for a deceased person for inheritance and transactions.'],
          ['baby', 'تسجيل المواليد وشهادة الميلاد', 'Birth Registration & Certificate', 'تسجيل المولود وإصدار شهادة الميلاد أو بدلها.', 'Registering births and issuing certificates or replacements.'],
          ['heart', 'تسجيل واقعة الزواج', 'Marriage Registration', 'تسجيل عقد الزواج في الأحوال المدنية وتحديث السجل.', 'Registering marriage with Civil Affairs and updating records.'],
          ['file-x', 'تسجيل وفاة', 'Death Registration', 'تسجيل الوفاة وإصدار شهادة الوفاة وتحديث السجلات.', 'Registering deaths, issuing certificates and updating records.'],
          ['pen-line', 'تعديل المهنة', 'Occupation Amendment', 'تعديل المهنة أو البيانات المدنية في السجل.', 'Amending occupation or civil data in the register.']
        ]
      },
      {
        id: 'address', icon: 'map-pinned', img: 'docs-work.jpg',
        title: { ar: 'العنوان الوطني (سبل)', en: 'National Address (SPL)' },
        desc: { ar: 'تسجيل وتعديل العنوان الوطني للأفراد والأعمال', en: 'Registering and amending the national address for individuals and business' },
        items: [
          ['map-pin', 'تسجيل العنوان الوطني', 'National Address Registration', 'تسجيل العنوان الوطني للأفراد وإصدار إثبات العنوان.', 'Registering your national address and issuing proof of address.'],
          ['map-pinned', 'تعديل العنوان الوطني', 'National Address Amendment', 'تعديل أو تحديث بيانات العنوان الوطني.', 'Amending or updating national address details.'],
          ['building', 'تسجيل العنوان الوطني أعمال', 'Business National Address Registration', 'تسجيل عنوان المنشأة وربطه بالسجل التجاري.', 'Registering an establishment’s address and linking it to the CR.']
        ]
      },
      {
        id: 'muroor', icon: 'car-front', img: 'docs-work.jpg',
        title: { ar: 'المرور والمركبات', en: 'Traffic & Vehicles' },
        desc: { ar: 'رخص القيادة والمركبات والمخالفات', en: 'Driving licenses, vehicles and violations' },
        items: [
          ['id-card', 'إصدار وتجديد رخصة القيادة', 'Driving License Issue & Renewal', 'تجديد الرخصة إلكترونياً وتجهيز متطلبات الإصدار.', 'Online renewal and preparing first-issue requirements.'],
          ['repeat', 'استبدال رخصة قيادة أجنبية', 'Foreign License Exchange', 'استبدال الرخصة الأجنبية برخصة سعودية حسب الدولة.', 'Exchanging a foreign license for a Saudi one, by country.'],
          ['file-text', 'تجديد رخصة السير (الاستمارة)', 'Vehicle Registration Renewal', 'تجديد الاستمارة بعد التأكد من الفحص والتأمين.', 'Renewing registration after inspection and insurance checks.'],
          ['arrow-left-right', 'نقل ملكية المركبة', 'Vehicle Ownership Transfer', 'نقل الملكية بين البائع والمشتري إلكترونياً.', 'Electronic ownership transfer between seller and buyer.'],
          ['clipboard-check', 'حجز موعد الفحص الدوري', 'Periodic Inspection Booking', 'حجز موعد الفحص الفني الدوري ومتابعة النتيجة.', 'Booking periodic technical inspection and following results.'],
          ['user-plus', 'إضافة مستخدم فعلي للمركبة', 'Add Actual Vehicle User', 'تفويض شخص آخر بقيادة المركبة نظامياً.', 'Authorizing another person to drive the vehicle.'],
          ['receipt', 'المخالفات المرورية والاعتراض', 'Traffic Violations & Objections', 'الاستعلام عن المخالفات وسدادها وتقديم الاعتراض.', 'Checking, paying and objecting to violations.'],
          ['plane', 'تفويض السفر بالمركبة', 'Vehicle Travel Authorization', 'إصدار تفويض قيادة المركبة خارج المملكة.', 'Authorization to drive the vehicle outside the Kingdom.'],
          ['circle-slash', 'إسقاط المركبة', 'Vehicle Deregistration', 'إسقاط المركبات التالفة أو المنتهية وتسليم اللوحات.', 'Deregistering scrapped vehicles and returning plates.'],
          ['rectangle-horizontal', 'بدل فاقد أو تالف للوحات', 'Plate Replacement', 'استخراج لوحات بديلة للمفقودة أو التالفة.', 'Replacing lost or damaged plates.'],
          ['shield-check', 'تأمين المركبات', 'Vehicle Insurance', 'مقارنة عروض التأمين الشامل وضد الغير وإصدار الوثيقة.', 'Comparing comprehensive and third-party quotes and issuing policies.']
        ]
      },
      {
        id: 'hr', icon: 'hard-hat', img: 'team.jpg',
        title: { ar: 'وزارة الموارد البشرية (مكتب العمل)', en: 'Ministry of Human Resources (Labor Office)' },
        desc: { ar: 'خدمات مكتب العمل والضمان والتأهيل وتأشيرات العمالة والإعاقة', en: 'Labor office services, social security, rehabilitation, work visas and disability services' },
        items: [
          ['handshake', 'دعوى تسوية ودية', 'Amicable Settlement Claim', 'تقديم طلب التسوية الودية للخلافات العمالية ومتابعة الجلسات.', 'Filing an amicable settlement claim for labor disputes and following sessions.'],
          ['graduation-cap', 'التأهيل الشامل', 'Comprehensive Rehabilitation', 'التسجيل في برنامج التأهيل الشامل ومتابعة الطلب.', 'Registering for the comprehensive rehabilitation program and tracking the request.'],
          ['hand-heart', 'الضمان المطور', 'Developed Social Security', 'التسجيل في الضمان الاجتماعي المطوّر ومتابعة الطلب.', 'Registering for developed social security and tracking the application.'],
          ['baby', 'تحديث بيانات ملف الطفل', 'Child File Data Update', 'تحديث بيانات ملف الطفل لدى الوزارة.', 'Updating the child’s file with the ministry.'],
          ['shield-check', 'إصدار شهادة حماية الأجور', 'Wage Protection Certificate', 'إصدار شهادة الالتزام بحماية الأجور.', 'Issuing the wage protection compliance certificate.'],
          ['repeat', 'تغيير نشاط المنشأة', 'Change of Establishment Activity', 'تغيير نشاط المنشأة في نظام مكتب العمل.', 'Changing the establishment’s activity in the labor system.'],
          ['arrow-left-right', 'نقل خدمات عامل لصاحب عمل آخر', 'Worker Service Transfer', 'نقل خدمات العامل بين أصحاب العمل وفق الأنظمة.', 'Transferring a worker between employers per regulations.'],
          ['search', 'استعلام عن نطاق المنشأة', 'Establishment Nitaqat Inquiry', 'الاستعلام عن نطاق المنشأة ونسب السعودة.', 'Checking the establishment’s Nitaqat band and Saudization ratios.'],
          ['stamp', 'طلب إصدار التأشيرات', 'Visa Issuance Request', 'طلب إصدار تأشيرات العمل للمنشأة.', 'Requesting work visas for the establishment.'],
          ['home', 'حماية أجور العمالة المنزلية', 'Domestic Workers Wage Protection', 'تسجيل وحماية أجور العمالة المنزلية.', 'Registering and protecting domestic workers’ wages.'],
          ['file-badge', 'طلب شهادة وظيفية', 'Employment Certificate Request', 'طلب شهادة وظيفية للموظف.', 'Requesting an employment certificate for an employee.'],
          ['flag', 'إصدار شهادة التوطين', 'Localization (Saudization) Certificate', 'إصدار شهادة التوطين للمنشأة.', 'Issuing the Saudization certificate for the establishment.'],
          ['home', 'نقل خدمات العمالة المنزلية من منشأة إلى فرد', 'Domestic Worker Transfer: Establishment → Individual', 'نقل خدمات عمالة منزلية من منشأة إلى فرد.', 'Transferring a domestic worker from an establishment to an individual.'],
          ['home', 'نقل خدمات العمالة المنزلية من فرد إلى فرد', 'Domestic Worker Transfer: Individual → Individual', 'نقل خدمات عمالة منزلية بين فردين.', 'Transferring a domestic worker between two individuals.'],
          ['file-text', 'إصدار تصاريح أجير', 'Ajeer Permits Issuance', 'إصدار تصاريح أجير للعمالة المعارة.', 'Issuing Ajeer permits for seconded workers.'],
          ['octagon-alert', 'الاعتراض على إيقاف الإعانة المالية لذوي الإعاقة', 'Objection to Disability Aid Suspension', 'تقديم اعتراض على إيقاف الإعانة المالية لذوي الإعاقة.', 'Filing an objection against suspension of financial aid for persons with disabilities.'],
          ['calendar-check', 'حجز موعد مكتب العمل', 'Labor Office Appointment Booking', 'حجز موعد لك في مكتب العمل.', 'Booking an appointment at the labor office.'],
          ['graduation-cap', 'إقرار مكافأة الطلبة الجامعيين ذوي الإعاقة', 'Disabled University Students Stipend', 'تقديم خدمة إقرار المكافأة للطلبة الجامعيين ذوي الإعاقة.', 'Applying for the stipend for university students with disabilities.'],
          ['file-check', 'إصدار وتوثيق وثيقة العمل الحر', 'Freelance Document Issuance & Authentication', 'إصدار وثيقة العمل الحر وتوثيقها.', 'Issuing and authenticating the freelance document.'],
          ['laptop', 'إنشاء وتوثيق عقد عمل عن بعد', 'Remote Work Contract Creation & Authentication', 'إنشاء عقد عمل عن بعد وتوثيقه.', 'Creating and authenticating a remote work contract.'],
          ['clipboard-list', 'تقييم الإعاقة', 'Disability Assessment', 'التقديم على تقييم الإعاقة ومتابعة النتيجة.', 'Applying for a disability assessment and following the result.'],
          ['banknote', 'الإعانة المالية لأشخاص ذوي الإعاقة', 'Financial Aid for Persons with Disabilities', 'التسجيل في الإعانة المالية لذوي الإعاقة.', 'Registering for financial aid for persons with disabilities.'],
          ['stethoscope', 'صرف الأجهزة الطبية المعينة', 'Assistive Medical Devices', 'طلب صرف الأجهزة الطبية المعينة.', 'Requesting assistive medical devices.'],
          ['award', 'الشهادات الرقمية لتسهيلات المرورية', 'Digital Certificates for Traffic Facilities', 'إصدار الشهادات الرقمية للتسهيلات المرورية لذوي الإعاقة.', 'Issuing digital certificates for traffic facilities for persons with disabilities.'],
          ['bus', 'إصدار بطاقة تخفيض أجور الاركاب لذوي الإعاقة', 'Fare Discount Card for Persons with Disabilities', 'إصدار بطاقة تخفيض أجور الركاب لذوي الإعاقة ومرافقيهم.', 'Issuing fare discount cards for persons with disabilities and companions.'],
          ['badge-check', 'إصدار وتجديد رخص العمل', 'Work Permits Issuance & Renewal', 'إصدار رخص العمل وتجديدها وسداد المقابل المالي.', 'Issuing and renewing work permits and paying levies.'],
          ['upload', 'رفع ملف حماية الأجور', 'Wage Protection File Upload', 'رفع ملفات الأجور الشهرية لنظام حماية الأجور.', 'Uploading monthly payroll files to the wage protection system.'],
          ['wallet', 'حساب المواطن', 'Citizen Account', 'التسجيل وتحديث البيانات والاعتراض على الأهلية.', 'Registration, data updates and eligibility objections.'],
          ['plane', 'إصدار تأشيرات ذوي الإعاقة', 'Visas for Persons with Disabilities', 'إصدار تأشيرات الاستقدام لذوي الإعاقة.', 'Issuing recruitment visas for persons with disabilities.']
        ]
      },
      {
        id: 'labor', icon: 'hard-hat', img: 'team.jpg',
        title: { ar: 'منصة قوى ومدد ومساند', en: 'Qiwa, Mudad & Musaned' },
        desc: { ar: 'كل ما تحتاجه منشأتك وعمالتك المنزلية', en: 'Everything your business and domestic workers need' },
        items: [
          ['building', 'فتح وتحديث ملف المنشأة', 'Establishment File Setup', 'فتح ملف المنشأة في قوى وتحديث بياناتها.', 'Opening and updating the establishment file on Qiwa.'],
          ['pen-line', 'تعديل المهنة في قوى', 'Occupation Change (Qiwa)', 'تعديل مهنة العامل بما يطابق عمله الفعلي.', 'Changing an employee’s occupation to match the actual job.'],
          ['file-signature', 'توثيق عقود العمل', 'Employment Contract Authentication', 'توثيق العقود إلكترونياً في منصة قوى.', 'Authenticating contracts electronically on Qiwa.'],
          ['chart-column', 'نطاقات وشهادة السعودة', 'Nitaqat & Saudization Certificate', 'متابعة نطاق المنشأة واستخراج شهادة السعودة.', 'Tracking Nitaqat status and issuing the Saudization certificate.'],
          ['wallet', 'حماية الأجور (مدد)', 'Wage Protection (Mudad)', 'رفع ملفات الأجور والالتزام بنظام حماية الأجور.', 'Uploading payroll files and staying WPS-compliant.'],
          ['stamp', 'تأشيرات العمل والاستقدام', 'Work Visas & Recruitment', 'طلب تأشيرات العمل وإجراءات استقدام العمالة.', 'Applying for work visas and recruitment procedures.'],
          ['home', 'العمالة المنزلية (مساند)', 'Domestic Workers (Musaned)', 'طلب الاستقدام وتوثيق العقد ونقل خدمات العمالة المنزلية.', 'Recruitment, contract authentication and transfers for domestic workers.'],
          ['user-x', 'بلاغ الانقطاع عن العمل', 'Absence from Work Report', 'تقديم بلاغ الانقطاع أو إلغاؤه وفق النظام.', 'Filing or cancelling absence-from-work reports.'],
          ['handshake', 'التسوية الودية للخلافات العمالية', 'Amicable Labor Settlement', 'تقديم طلب التسوية الودية ومتابعة الجلسات.', 'Filing for amicable settlement and following sessions.'],
          ['door-closed', 'إنهاء العلاقة التعاقدية', 'Contract Termination', 'إنهاء العقد وتسوية المستحقات والخروج النهائي.', 'Ending contracts, settling dues and final exit.'],
          ['smartphone', 'منصة قوى', 'Qiwa Platform', 'إدارة حساب منصة قوى للمنشأة والموظفين وإنجاز طلباتها.', 'Managing your establishment’s Qiwa account, employees and requests.'],
          ['arrow-left-right', 'نقل الخدمات عبر قوى', 'Service Transfer via Qiwa', 'نقل خدمات العامل بين المنشآت عبر منصة قوى.', 'Transferring workers between establishments through Qiwa.']
        ]
      },
      {
        id: 'cards', icon: 'badge-check', img: 'docs-work.jpg',
        title: { ar: 'الشهادات الصحية والبطاقات والتأمين', en: 'Health Certificates, Cards & Insurance' },
        desc: { ar: 'الشهادات الصحية وكروت العمل والتأمين الطبي وتأمين المركبات', en: 'Health certificates, work cards, medical insurance and vehicle insurance' },
        items: [
          ['heart-pulse', 'إصدار الشهادة الصحية', 'Health Certificate Issuance', 'إصدار الشهادة الصحية للعاملين في المنشآت الغذائية والخدمية.', 'Issuing health certificates for food and service establishment workers.'],
          ['refresh-cw', 'تجديد الشهادة الصحية', 'Health Certificate Renewal', 'تجديد الشهادة الصحية قبل انتهائها.', 'Renewing the health certificate before expiry.'],
          ['copy', 'بدل فاقد لشهادة صحية', 'Lost Health Certificate Replacement', 'استخراج بدل فاقد للشهادة الصحية.', 'Replacing a lost health certificate.'],
          ['id-card', 'إصدار كرت العمل', 'Work Card Issuance', 'إصدار كرت العمل للعامل.', 'Issuing a work card for a worker.'],
          ['refresh-cw', 'تجديد كرت العمل', 'Work Card Renewal', 'تجديد كرت العمل وسداد الرسوم.', 'Renewing the work card and paying fees.'],
          ['truck', 'كرت التشغيل للنقليات', 'Transport Operating Card', 'إصدار وتجديد كرت التشغيل لمركبات النقل.', 'Issuing and renewing the operating card for transport vehicles.'],
          ['heart-pulse', 'تأمين طبي للأفراد', 'Medical Insurance — Individuals', 'مقارنة باقات التأمين الطبي للأفراد والعائلات وإصدار الوثيقة.', 'Comparing individual and family medical insurance plans and issuing the policy.'],
          ['building-2', 'تأمين طبي للمؤسسات والشركات', 'Medical Insurance — Companies', 'عروض التأمين الطبي للمنشآت والموظفين وفق متطلبات مجلس الضمان.', 'Medical insurance quotes for establishments and staff per CCHI requirements.'],
          ['car', 'تأمين سيارات', 'Car Insurance', 'مقارنة عروض التأمين الشامل وضد الغير وإصدار الوثيقة.', 'Comparing comprehensive and third-party quotes and issuing policies.']
        ]
      },
      {
        id: 'electricity', icon: 'zap', img: 'electric.jpg',
        title: { ar: 'شركة الكهرباء', en: 'Saudi Electricity Company' },
        desc: { ar: 'العدادات والحسابات وخدمات الكهرباء', en: 'Meters, accounts and electricity services' },
        items: [
          ['plus-circle', 'إضافة عداد', 'Add a Meter', 'طلب إضافة عداد كهرباء جديد.', 'Requesting a new electricity meter.'],
          ['file-check', 'توثيق العداد', 'Meter Authentication', 'توثيق ملكية العداد وربطه بالهوية.', 'Authenticating meter ownership and linking it to the ID.'],
          ['arrow-left-right', 'نقل عداد', 'Meter Transfer', 'نقل العداد إلى موقع أو اسم آخر.', 'Moving the meter to another location or name.'],
          ['plug-zap', 'إيصال الخدمة الكهربائية', 'Connecting Electricity Service', 'إيصال الخدمة الكهربائية لمبنى أو منشأة جديدة.', 'Connecting electricity to a new building or establishment.'],
          ['user-plus', 'إضافة حساب', 'Add an Account', 'إضافة حساب كهرباء جديد.', 'Adding a new electricity account.'],
          ['user-minus', 'إزالة الحساب', 'Remove an Account', 'إزالة حساب كهرباء.', 'Removing an electricity account.'],
          ['file-badge', 'شهادة إطلاق خدمة كهربائية', 'Electricity Service Launch Certificate', 'إصدار شهادة إطلاق الخدمة الكهربائية.', 'Issuing the electricity service launch certificate.'],
          ['split', 'تجزئة (دمج عداد)', 'Meter Splitting / Merging', 'تجزئة العداد أو دمج عدادين.', 'Splitting a meter or merging two meters.'],
          ['gauge', 'تقوية العداد', 'Meter Upgrade', 'رفع سعة العداد لتحمل أحمال أكبر.', 'Upgrading meter capacity to handle larger loads.'],
          ['replace', 'استبدال العداد بنفس السعة', 'Meter Replacement (Same Capacity)', 'استبدال العداد التالف بنفس السعة.', 'Replacing a faulty meter with the same capacity.'],
          ['timer-reset', 'إعادة عداد مزال مؤقت', 'Reinstating a Temporarily Removed Meter', 'إعادة تركيب عداد أزيل مؤقتاً.', 'Reinstalling a temporarily removed meter.'],
          ['calendar-range', 'خطة الأقساط', 'Installment Plan', 'التقديم على خطة تقسيط الفواتير.', 'Applying for a bill installment plan.'],
          ['siren', 'خدمة الاحتياجات الماسة', 'Urgent Needs Service', 'طلب خدمة الاحتياجات الماسة لدعم الفواتير.', 'Requesting the urgent-needs service for bill support.']
        ]
      },
      {
        id: 'water', icon: 'droplets', img: 'pipes.jpg',
        title: { ar: 'شركة المياه الوطنية', en: 'National Water Company' },
        desc: { ar: 'بلاغات وصرف وعدادات وتوصيلات المياه', en: 'Water reports, sewage, meters and connections' },
        items: [
          ['megaphone', 'بلاغات المياه', 'Water Reports', 'تقديم بلاغات التسريب والانقطاع ومتابعتها.', 'Filing and following up leak and outage reports.'],
          ['waves', 'خدمات صهاريج المياه', 'Water Tanker Services', 'طلب صهريج مياه وتوصيله.', 'Requesting a water tanker delivery.'],
          ['hammer', 'خدمات الترميم أو إعادة البناء', 'Restoration & Rebuilding Services', 'طلبات الترميم أو إعادة بناء الخدمات.', 'Restoration or rebuilding service requests.'],
          ['file-text', 'خطاب التعريف', 'Introduction Letter', 'إصدار خطاب التعريف من شركة المياه.', 'Issuing an introduction letter from the water company.'],
          ['calendar-check', 'خدمات المواعيد', 'Appointment Services', 'حجز المواعيد في شركة المياه الوطنية.', 'Booking appointments with the National Water Company.'],
          ['refresh-cw', 'تحديث البيانات', 'Data Update', 'تحديث بيانات الحساب والعداد.', 'Updating account and meter data.'],
          ['building', 'تعديل معلومات العقار', 'Property Information Amendment', 'تعديل بيانات العقار المسجلة.', 'Amending registered property data.'],
          ['gauge', 'خدمات العدادات', 'Meter Services', 'طلبات العدادات: تركيب ونقل واستبدال.', 'Meter requests: installation, transfer and replacement.'],
          ['log-in', 'إدخال العداد', 'Meter Installation', 'طلب إدخال عداد المياه للعقار.', 'Requesting a water meter connection for the property.']
        ]
      },
      {
        id: 'workvisas', icon: 'stamp', img: 'meeting.jpg',
        title: { ar: 'تأشيرات العمالة والتفويض', en: 'Work Visas & Authorization' },
        desc: { ar: 'إصدار وتفويض تأشيرات العمالة المهنية والمنزلية والسائقين والزراعية', en: 'Issuing and authorizing visas for professional, domestic, driver and agricultural workers' },
        items: [
          ['hard-hat', 'إصدار تأشيرة عامل مهني', 'Professional Worker Visa', 'إصدار تأشيرة استقدام عامل مهني للمنشأة.', 'Issuing a recruitment visa for a professional worker.'],
          ['home', 'إصدار تأشيرة عامل منزلي', 'Domestic Worker Visa', 'إصدار تأشيرة استقدام عامل منزلي.', 'Issuing a recruitment visa for a domestic worker.'],
          ['car-front', 'إصدار تأشيرة سائق خاص', 'Private Driver Visa', 'إصدار تأشيرة استقدام سائق خاص.', 'Issuing a recruitment visa for a private driver.'],
          ['wheat', 'إصدار تأشيرة عامل زراعي', 'Agricultural Worker Visa', 'إصدار تأشيرة استقدام عامل زراعي.', 'Issuing a recruitment visa for an agricultural worker.'],
          ['file-signature', 'تفويض تأشيرة مهنية', 'Professional Visa Authorization', 'تفويض مكتب الاستقدام لاستخدام التأشيرة المهنية.', 'Authorizing a recruitment office to use the professional visa.'],
          ['file-signature', 'تفويض تأشيرة عامل منزلي', 'Domestic Worker Visa Authorization', 'تفويض مكتب الاستقدام لاستخدام تأشيرة العامل المنزلي.', 'Authorizing a recruitment office to use the domestic worker visa.'],
          ['file-signature', 'تفويض تأشيرة سائق خاص', 'Private Driver Visa Authorization', 'تفويض مكتب الاستقدام لاستخدام تأشيرة السائق الخاص.', 'Authorizing a recruitment office to use the private driver visa.'],
          ['file-signature', 'تفويض تأشيرة عامل زراعي', 'Agricultural Visa Authorization', 'تفويض مكتب الاستقدام لاستخدام تأشيرة العامل الزراعي.', 'Authorizing a recruitment office to use the agricultural visa.']
        ]
      },
      {
        id: 'commerce', icon: 'store', img: 'docs-sign.jpg',
        title: { ar: 'المركز السعودي للأعمال والسجلات التجارية', en: 'Saudi Business Center & Commercial Registration' },
        desc: { ar: 'السجل التجاري والأسماء والعلامات والغرف التجارية', en: 'CRs, trade names, trademarks and chambers of commerce' },
        items: [
          ['file-plus', 'إصدار السجل التجاري', 'Commercial Registration Issuance', 'إصدار السجل التجاري للمؤسسات والشركات عبر المركز السعودي للأعمال.', 'Issuing CRs for sole proprietorships and companies via the Saudi Business Center.'],
          ['refresh-cw', 'تجديد السجل التجاري', 'Commercial Registration Renewal', 'تجديد السجل التجاري وسداد الرسوم.', 'Renewing the CR and paying fees.'],
          ['arrow-left-right', 'نقل السجل التجاري', 'Commercial Registration Transfer', 'نقل السجل التجاري إلى مدينة أو مالك آخر.', 'Transferring the CR to another city or owner.'],
          ['calendar-check', 'التأكيد السنوي للسجل', 'Annual CR Confirmation', 'تأكيد بيانات السجل التجاري سنوياً لتجنب الإيقاف.', 'Confirming CR data annually to avoid suspension.'],
          ['pen-line', 'تعديل السجل التجاري', 'CR Amendment', 'تعديل النشاط أو العنوان أو المدير أو رأس المال.', 'Changing activity, address, manager or capital.'],
          ['file-x', 'شطب السجل التجاري', 'CR Cancellation', 'شطب السجل وإنهاء الالتزامات المرتبطة به.', 'Cancelling the CR and closing related obligations.'],
          ['bookmark', 'حجز الاسم التجاري', 'Trade Name Reservation', 'البحث عن الاسم وحجزه قبل قيد السجل.', 'Searching and reserving a trade name before registration.'],
          ['copyright', 'تسجيل العلامة التجارية', 'Trademark Registration', 'تسجيل العلامة لدى الهيئة السعودية للملكية الفكرية وحمايتها.', 'Registering and protecting trademarks with SAIP.'],
          ['landmark', 'اشتراك الغرفة التجارية', 'Chamber of Commerce Membership', 'الاشتراك والتجديد وتصديق الخطابات والمستندات.', 'Membership, renewal and attestation of letters and documents.'],
          ['globe', 'شهادة المنشأ', 'Certificate of Origin', 'إصدار شهادات المنشأ للصادرات.', 'Issuing certificates of origin for exports.'],
          ['shopping-cart', 'توثيق المتاجر الإلكترونية', 'E-Store Verification', 'توثيق المتجر الإلكتروني ووثيقة العمل الحر.', 'E-store verification and freelance document.'],
          ['package-check', 'شهادات المطابقة (سابر)', 'Conformity Certificates (SABER)', 'إصدار شهادات المطابقة للمنتجات المستوردة.', 'Product conformity certificates for imports.'],
          ['file-text', 'الإفادة التجارية', 'Commercial Statement', 'إصدار الإفادة التجارية بيانات السجل التجاري.', 'Issuing the commercial statement of CR data.']
        ]
      },
      {
        id: 'companies', icon: 'building-2', img: 'towers.jpg',
        title: { ar: 'تأسيس الشركات والاستثمار', en: 'Company Formation & Investment' },
        desc: { ar: 'ابدأ مشروعك بهيكل نظامي صحيح', en: 'Start your business with the right legal structure' },
        items: [
          ['building-2', 'تأسيس الشركات', 'Company Formation', 'تأسيس الشركات ذات المسؤولية المحدودة والمساهمة المبسّطة.', 'Forming LLCs and simplified joint-stock companies.'],
          ['scroll-text', 'عقود التأسيس والأنظمة الأساسية', 'Articles of Association', 'إعداد عقد التأسيس ونظام الشركة وتعديلاتها.', 'Drafting and amending articles of association.'],
          ['users', 'تعديل الشركاء ورأس المال', 'Partners & Capital Changes', 'دخول وخروج الشركاء وزيادة أو تخفيض رأس المال.', 'Adding/removing partners and changing capital.'],
          ['globe', 'ترخيص الاستثمار الأجنبي', 'Foreign Investment License', 'استخراج ترخيص وزارة الاستثمار للمستثمر الأجنبي.', 'Obtaining the Ministry of Investment license.'],
          ['git-branch', 'فتح فروع الشركات', 'Branch Registration', 'تسجيل فرع شركة محلية أو أجنبية.', 'Registering local or foreign company branches.'],
          ['circle-off', 'تصفية الشركات', 'Company Liquidation', 'إجراءات التصفية وشطب السجلات وإنهاء الالتزامات.', 'Liquidation, deregistration and closing obligations.'],
          ['hard-hat', 'تصنيف المقاولين', 'Contractor Classification', 'التسجيل والتصنيف في منصة المقاولين.', 'Registering and classifying with the contractors’ platform.'],
          ['rocket', 'تسجيل المنشآت الصغيرة والمتوسطة', 'SME Registration (Monshaat)', 'التسجيل في منشآت والاستفادة من برامج الدعم.', 'Registering with Monshaat and accessing support programs.']
        ]
      },
      {
        id: 'balady', icon: 'landmark', img: 'construction.jpg',
        title: { ar: 'البلديات والتراخيص (بلدي)', en: 'Municipal Licenses (Balady)' },
        desc: { ar: 'رخص المحلات والأنشطة واللوحات والشهادات الصحية', en: 'Shop & activity licenses, signboards and health certificates' },
        items: [
          ['store', 'رخصة النشاط التجاري', 'Commercial Activity License', 'إصدار وتجديد رخصة المحل عبر منصة بلدي.', 'Issuing and renewing shop licenses on Balady.'],
          ['signpost', 'رخصة اللوحات التجارية', 'Signboard License', 'ترخيص اللوحة التجارية وفق الاشتراطات.', 'Licensing shop signboards per requirements.'],
          ['hard-hat', 'رخص البناء والترميم', 'Building & Renovation Permits', 'رخص البناء والإضافة والترميم والتسوير.', 'Permits for building, extensions, renovation and fencing.'],
          ['shovel', 'رخص الحفريات', 'Excavation Permits', 'تصاريح الحفر وتمديد الخدمات.', 'Excavation and utility connection permits.'],
          ['tent', 'تصاريح الأنشطة المؤقتة', 'Temporary Activity Permits', 'تصاريح الأكشاك والفعاليات والأنشطة الموسمية.', 'Permits for kiosks, events and seasonal activities.'],
          ['shield-alert', 'تراخيص السلامة (الدفاع المدني)', 'Civil Defense Safety Licenses', 'استخراج شهادة السلامة للمنشأة عبر منصة سلامة.', 'Obtaining facility safety certificates via the Salama platform.'],
          ['ban', 'الاعتراض على المخالفات البلدية', 'Municipal Violation Objections', 'الاستعلام عن المخالفات والاعتراض عليها.', 'Checking and objecting to municipal violations.']
        ]
      },
      {
        id: 'zakat', icon: 'receipt', img: 'docs-work.jpg',
        title: { ar: 'الزكاة والضريبة والجمارك', en: 'Zakat, Tax & Customs' },
        desc: { ar: 'التزام ضريبي كامل بدون غرامات', en: 'Full tax compliance, no penalties' },
        items: [
          ['file-plus', 'التسجيل في ضريبة القيمة المضافة', 'VAT Registration', 'تسجيل المنشأة واستخراج الرقم الضريبي.', 'Registering for VAT and obtaining a tax number.'],
          ['file-spreadsheet', 'الإقرارات الضريبية', 'Tax Returns', 'إعداد وتقديم إقرارات القيمة المضافة في مواعيدها.', 'Preparing and filing VAT returns on time.'],
          ['badge-check', 'الإقرار الزكوي وشهادة الزكاة', 'Zakat Return & Certificate', 'تقديم الإقرار الزكوي واستخراج الشهادة.', 'Filing zakat returns and obtaining the certificate.'],
          ['receipt-text', 'الفوترة الإلكترونية (فاتورة)', 'E-Invoicing (Fatoora)', 'الربط مع منظومة الفوترة الإلكترونية والتأكد من الامتثال.', 'Integrating with e-invoicing and ensuring compliance.'],
          ['percent', 'ضريبة الاستقطاع', 'Withholding Tax', 'حساب وسداد ضريبة الاستقطاع على المدفوعات الخارجية.', 'Calculating and paying withholding tax on foreign payments.'],
          ['ship', 'التخليص الجمركي', 'Customs Clearance', 'تخليص الواردات والصادرات واستخراج الرقم الجمركي.', 'Clearing imports and exports and obtaining a customs number.'],
          ['scale', 'الاعتراض على الربط الزكوي والضريبي', 'Tax Assessment Objections', 'تقديم الاعتراضات ومتابعتها مع الهيئة.', 'Filing and tracking objections with ZATCA.']
        ]
      },
      {
        id: 'gosi', icon: 'shield-check', img: 'meeting.jpg',
        title: { ar: 'التأمينات الاجتماعية', en: 'Social Insurance (GOSI)' },
        desc: { ar: 'تسجيل المنشأة والموظفين وشهادات الالتزام', en: 'Registering establishments and employees, compliance certificates' },
        items: [
          ['building', 'تسجيل منشأة', 'Establishment Registration', 'تسجيل المنشأة في التأمينات الاجتماعية.', 'Registering the establishment with GOSI.'],
          ['user-plus', 'تسجيل مشترك', 'Subscriber Registration', 'تسجيل الموظف مشتركاً في التأمينات.', 'Registering an employee as a GOSI subscriber.'],
          ['user-minus', 'استبعاد مشترك', 'Subscriber Exclusion', 'استبعاد مشترك عند انتهاء الخدمة.', 'Excluding a subscriber at the end of service.'],
          ['printer', 'طباعة تعريف بالراتب', 'Salary Certificate Printing', 'طباعة التعريف بالراتب من التأمينات.', 'Printing the GOSI salary certificate.'],
          ['hand-coins', 'ساند', 'SANED (Unemployment Insurance)', 'التقديم على ساند ومتابعة الصرف.', 'Applying for SANED and following disbursement.'],
          ['heart-pulse', 'إصابة العمل', 'Work Injury', 'تقديم بلاغ إصابة العمل ومتابعة التعويض.', 'Filing a work injury report and following compensation.'],
          ['pen-line', 'تعديل الأجور', 'Wage Amendment', 'تعديل أجور المشتركين في التأمينات.', 'Amending subscribers’ wages with GOSI.'],
          ['file-badge', 'شهادة التأمينات', 'GOSI Certificate', 'استخراج شهادة التأمينات الاجتماعية للمنشأة.', 'Issuing the GOSI certificate for the establishment.'],
          ['hand-coins', 'طلبات المعاش والتقاعد', 'Pension & Retirement Requests', 'تقديم طلبات المعاش ومتابعتها.', 'Filing pension requests and following them up.'],
          ['calendar-check', 'حجز موعد التأمينات', 'GOSI Appointment Booking', 'حجز موعد لك في التأمينات الاجتماعية.', 'Booking a GOSI appointment for you.']
        ]
      },
      {
        id: 'justice', icon: 'scale', img: 'docs-sign.jpg',
        title: { ar: 'وزارة العدل (ناجز)', en: 'Ministry of Justice (Najiz)' },
        desc: { ar: 'الوكالات والصكوك والطلبات القضائية الإلكترونية', en: 'Powers of attorney, deeds and online court requests' },
        items: [
          ['file-signature', 'إصدار الوكالات الإلكترونية', 'Electronic Power of Attorney', 'إصدار وكالة عامة أو خاصة إلكترونياً.', 'Issuing general or specific POAs online.'],
          ['file-x', 'فسخ الوكالات', 'POA Revocation', 'فسخ الوكالة وإشعار الوكيل.', 'Revoking POAs and notifying the agent.'],
          ['folder-open', 'قيد الدعاوى وصحائف الدعوى', 'Filing Lawsuits', 'تجهيز صحيفة الدعوى وقيدها إلكترونياً بالتنسيق مع محامٍ.', 'Preparing and filing claims online in coordination with a lawyer.'],
          ['gavel', 'طلبات التنفيذ', 'Enforcement Requests', 'تقديم طلبات التنفيذ على السندات والأحكام.', 'Filing enforcement requests for instruments and judgments.'],
          ['scroll-text', 'صكوك الولاية والإعالة', 'Guardianship & Dependency Deeds', 'استخراج صكوك الولاية والإعالة.', 'Issuing guardianship and dependency deeds.'],
          ['stamp', 'خدمات التوثيق', 'Notarization Services', 'توثيق العقود والإقرارات لدى الموثّقين المرخّصين.', 'Notarizing contracts and declarations with licensed notaries.'],
          ['calendar-clock', 'حجز مواعيد المحاكم وكتابات العدل', 'Court & Notary Appointments', 'حجز المواعيد ومتابعة الجلسات والطلبات.', 'Booking appointments and tracking sessions and requests.'],
          ['heart-crack', 'فسخ نكاح', 'Marriage Annulment', 'تقديم طلب فسخ النكاح عبر ناجز.', 'Filing a marriage annulment request via Najiz.'],
          ['wallet', 'طلب نفقة', 'Alimony Request', 'تقديم طلب نفقة ومتابعته.', 'Filing an alimony request and following it up.'],
          ['house', 'طلب مسكن', 'Housing Request', 'تقديم طلب مسكن للمطلقة أو الحاضن.', 'Filing a housing request for the divorcee or custodian.'],
          ['shirt', 'طلب كسوة', 'Clothing Allowance Request', 'تقديم طلب كسوة ومتابعته.', 'Filing a clothing allowance request and following it up.'],
          ['file-signature', 'توثيق طلاق', 'Divorce Documentation', 'توثيق الطلاق إلكترونياً.', 'Documenting a divorce electronically.'],
          ['truck', 'حجز مواعيد كتابات العدل المتنقلة', 'Mobile Notary Appointments', 'حجز موعد مع كتابة العدل المتنقلة.', 'Booking a mobile notary appointment.'],
          ['baby', 'طلب خدمة حضانة', 'Custody Service Request', 'تقديم طلب حضانة ومتابعته.', 'Filing a custody request and following it up.'],
          ['file-check', 'توثيق حضانة', 'Custody Documentation', 'توثيق الحضانة إلكترونياً.', 'Documenting custody electronically.'],
          ['scroll-text', 'الوكالات', 'Powers of Attorney', 'إصدار وتعديل الوكالات إلكترونياً.', 'Issuing and amending powers of attorney electronically.']
        ]
      },
      {
        id: 'turkah', icon: 'scale', img: 'docs-sign.jpg',
        title: { ar: 'منصة تركة', en: 'Turkah Platform' },
        desc: { ar: 'حصر الورثة وقسمة التركات', en: 'Heirs’ inventories and estate division' },
        items: [
          ['file-text', 'إصدار حصر ورثة', 'Heirs Inventory Issuance', 'إصدار صك حصر الورثة عبر منصة تركة.', 'Issuing the heirs inventory deed through Turkah.'],
          ['shield-check', 'التحقق من الوثائق', 'Document Verification', 'التحقق من وثائق التركة وصحتها.', 'Verifying estate documents and their validity.'],
          ['binary', 'إصدار رقمنة حصر ورثة', 'Heirs Inventory Digitization', 'رقمنة حصر الورثة القديم وإصداره إلكترونياً.', 'Digitizing an older heirs inventory and issuing it electronically.'],
          ['split', 'قسمة تركة اتفاقية', 'Agreed Estate Division', 'إعداد قسمة تركة اتفاقية بين الورثة.', 'Preparing an agreed estate division among heirs.']
        ]
      },
      {
        id: 'attest', icon: 'stamp', img: 'docs-sign.jpg',
        title: { ar: 'التصديقات والترجمة المعتمدة', en: 'Attestation & Certified Translation' },
        desc: { ar: 'مستنداتك جاهزة للاستخدام داخل المملكة وخارجها', en: 'Documents ready for use in Saudi Arabia and abroad' },
        items: [
          ['languages', 'الترجمة المعتمدة', 'Certified Translation', 'ترجمة معتمدة للوثائق الرسمية والشهادات والعقود.', 'Certified translation of official documents, certificates and contracts.'],
          ['stamp', 'تصديق وزارة الخارجية', 'MOFA Attestation', 'تصديق الوثائق إلكترونياً من وزارة الخارجية.', 'Electronic document attestation by MOFA.'],
          ['badge-check', 'التصديق بالأبوستيل', 'Apostille', 'تصديق الوثائق بالأبوستيل للدول الأعضاء في الاتفاقية.', 'Apostille certification for convention member countries.'],
          ['flag', 'تصديق السفارات والقنصليات', 'Embassy Attestation', 'تصديق المستندات لدى السفارات والقنصليات.', 'Attesting documents at embassies and consulates.'],
          ['graduation-cap', 'تصديق الشهادات الدراسية', 'Educational Certificate Attestation', 'تصديق الشهادات من جهة الإصدار والجهات المختصة.', 'Attesting certificates with issuers and authorities.'],
          ['landmark', 'تصديق الغرفة التجارية', 'Chamber Attestation', 'تصديق المستندات والخطابات التجارية.', 'Attesting commercial documents and letters.'],
          ['stethoscope', 'تصديق التقارير الطبية', 'Medical Report Attestation', 'تصديق التقارير الطبية لاستخدامها رسمياً.', 'Attesting medical reports for official use.'],
          ['file-check', 'تصديق عقد العمل من الخارجية', 'Employment Contract Attestation (MOFA)', 'تصديق عقد العمل من وزارة الخارجية.', 'Attesting the employment contract with the Ministry of Foreign Affairs.'],
          ['stamp', 'تصديق التأشيرة من الغرفة التجارية', 'Visa Attestation (Chamber of Commerce)', 'تصديق التأشيرة من الغرفة التجارية.', 'Attesting the visa with the Chamber of Commerce.'],
          ['pen-tool', 'تصديق التوقيع والختم من الغرفة التجارية', 'Signature & Stamp Attestation (Chamber)', 'تصديق التوقيع والختم من الغرفة التجارية.', 'Attesting signature and stamp with the Chamber of Commerce.']
        ]
      },
      {
        id: 'visas', icon: 'plane', img: 'meeting.jpg',
        title: { ar: 'التأشيرات والسفر', en: 'Visas & Travel' },
        desc: { ar: 'تأشيرات السفر للخارج والزيارات إلى المملكة', en: 'Outbound visas and visits to Saudi Arabia' },
        items: [
          ['plane', 'تأشيرات شنغن', 'Schengen Visas', 'تعبئة الطلب وتجهيز الملف وحجز موعد البصمة.', 'Application filling, file preparation and biometrics booking.'],
          ['plane-takeoff', 'تأشيرات بريطانيا وأمريكا وكندا', 'UK, US & Canada Visas', 'تجهيز النماذج والمستندات وحجز المقابلات.', 'Preparing forms and documents and booking interviews.'],
          ['map-pinned', 'تأشيرات الدول الأخرى', 'Other Country Visas', 'تأشيرات سياحية وعلاج وأعمال لمختلف الدول.', 'Tourist, medical and business visas for many countries.'],
          ['users', 'تأشيرة الزيارة العائلية', 'Family Visit Visa', 'طلب تأشيرة زيارة الأقارب إلى المملكة.', 'Applying for family visit visas to Saudi Arabia.'],
          ['moon-star', 'تأشيرات العمرة والزيارة', 'Umrah & Visit Visas', 'المساعدة في طلبات تأشيرة العمرة والسياحة.', 'Assistance with Umrah and tourist visa applications.'],
          ['shield-plus', 'تأمين السفر الطبي', 'Travel Medical Insurance', 'إصدار تأمين سفر مقبول لدى السفارات.', 'Issuing embassy-accepted travel insurance.']
        ]
      },
      {
        id: 'social', icon: 'heart-handshake', img: 'team.jpg',
        title: { ar: 'الخدمات الاجتماعية والأسرية', en: 'Social & Family Services' },
        desc: { ar: 'برامج الدعم والضمان والتقاعد', en: 'Support programs, social security and retirement' },
        items: [
          ['hand-heart', 'الضمان الاجتماعي المطوّر', 'Developed Social Security', 'التسجيل في الضمان ومتابعة الطلب.', 'Registering for social security and tracking applications.'],
          ['accessibility', 'خدمات الأشخاص ذوي الإعاقة', 'Persons with Disabilities Services', 'إصدار البطاقات والتسجيل في البرامج المخصصة.', 'Card issuance and enrollment in dedicated programs.'],
          ['hand-coins', 'التقاعد', 'Retirement', 'طلب التقاعد ومتابعة المستحقات.', 'Retirement applications and entitlement follow-up.'],
          ['briefcase', 'برامج دعم التوظيف (هدف)', 'Employment Support (HRDF)', 'التسجيل في برامج صندوق تنمية الموارد البشرية.', 'Enrollment in HRDF programs.'],
          ['heart-pulse', 'التأمين الطبي للعائلة والعمالة', 'Family & Worker Health Insurance', 'مقارنة عروض التأمين الطبي وإصدار الوثائق.', 'Comparing health insurance quotes and issuing policies.']
        ]
      },
      {
        id: 'daily', icon: 'zap', img: 'electric.jpg',
        title: { ar: 'خدمات يومية', en: 'Everyday Services' },
        desc: { ar: 'فواتير ومواعيد واتصالات وطباعة — نخلّصها عنك', en: 'Bills, appointments, telecom and printing — done for you' },
        items: [
          ['receipt', 'سداد الفواتير والرسوم', 'Bill & Fee Payments', 'سداد الفواتير الحكومية والمخالفات والرسوم عبر سداد ومتابعة الإيصالات.', 'Paying government bills, fines and fees via SADAD and keeping the receipts.'],
          ['calendar-check', 'حجز المواعيد الحكومية والصحية', 'Government & Health Appointments', 'حجز المواعيد في الجهات الحكومية والمستشفيات عبر أبشر وصحتي.', 'Booking appointments with government offices and hospitals via Absher and Sehhaty.'],
          ['smartphone', 'خدمات الاتصالات', 'Telecom Services', 'نقل ملكية الأرقام وإلغاؤها والاستعلام عن الأرقام المسجلة باسمك.', 'Transferring and cancelling numbers, and checking numbers registered in your name.'],
          ['printer', 'الطباعة وتعبئة النماذج', 'Printing & Form Filling', 'تعبئة النماذج والطلبات الإلكترونية وطباعة المستندات وتصويرها.', 'Filling out forms and online applications, printing and scanning documents.']
        ]
      },
      {
        id: 'others', icon: 'landmark', img: 'meeting.jpg',
        title: { ar: 'جهات ومنصات حكومية وخيرية', en: 'Other Government & Charity Platforms' },
        desc: { ar: 'منصات حكومية وجمعيات ودعم سكني وتسجيل وظائف وجامعات', en: 'Government platforms, charities, housing support, jobs and university registration' },
        items: [
          ['building-2', 'مكتب العمل', 'Labor Office', 'متابعة معاملاتك في مكتب العمل وإنجازها.', 'Handling your labor office transactions.'],
          ['wheat', 'الزراعة', 'Agriculture', 'خدمات وزارة البيئة والمياه والزراعة وتراخيصها.', 'Services and licenses of the Ministry of Environment, Water and Agriculture.'],
          ['scale', 'منصة ناجز', 'Najiz Platform', 'إنجاز معاملاتك القضائية عبر منصة ناجز.', 'Completing your judicial transactions through Najiz.'],
          ['scroll-text', 'منصة تركه', 'Turkah Platform', 'خدمات حصر الورثة وقسمة التركات.', 'Heirs inventory and estate division services.'],
          ['chart-candlestick', 'منصة البورصة العقارية', 'Real Estate Exchange Platform', 'التسجيل في البورصة العقارية ومتابعة الصفقات.', 'Registering on the real estate exchange and following deals.'],
          ['building', 'دعم الإسكان التنموي', 'Developmental Housing Support', 'التقديم على دعم الإسكان التنموي ومتابعة الطلب.', 'Applying for developmental housing support and following up.'],
          ['house', 'الدعم السكني', 'Housing Support', 'التقديم على الدعم السكني عبر سكني ومتابعته.', 'Applying for housing support via Sakani and following up.'],
          ['heart-handshake', 'الجمعية الخيرية للإسكان', 'Housing Charity Association', 'التقديم على خدمات الجمعية الخيرية للإسكان.', 'Applying for the housing charity association’s services.'],
          ['heart-handshake', 'جمعية البر الخيرية', 'Al-Birr Charity Society', 'التقديم على خدمات جمعية البر الخيرية.', 'Applying for Al-Birr Charity Society services.'],
          ['gavel', 'رفع دعوى لمكتب العامل', 'Filing a Claim with the Labor Office', 'تجهيز ورفع دعوى عمالية لمكتب العمل.', 'Preparing and filing a labor claim with the labor office.'],
          ['landmark', 'المحكمة العمالية', 'Labor Court', 'متابعة القضايا العمالية لدى المحكمة العمالية.', 'Following labor cases at the labor court.'],
          ['flame', 'الدفاع المدني', 'Civil Defense', 'خدمات وتراخيص السلامة لدى الدفاع المدني.', 'Civil defense services and safety licenses.'],
          ['users', 'الأحوال المدنية', 'Civil Affairs', 'خدمات الأحوال المدنية وإنجازها.', 'Civil Affairs services and transactions.'],
          ['calendar-check', 'حجز المواعيد', 'Appointment Booking', 'حجز موعد لك في أي جهة حكومية.', 'Booking an appointment for you at any government entity.']
        ]
      },
      {
        id: 'personal', icon: 'file-pen-line', img: 'consult.jpg',
        title: { ar: 'الوظائف والمعاريض والسير الذاتية', en: 'Jobs, Petitions & CVs' },
        desc: { ar: 'التقديم على الوظائف وكتابة المعاريض وإعداد السير الذاتية', en: 'Job applications, petition writing and CV preparation' },
        items: [
          ['briefcase', 'التقديم على الوظائف', 'Job Applications', 'التقديم على الوظائف الحكومية والخاصة وتجهيز ملفاتك.', 'Applying for government and private jobs and preparing your files.'],
          ['file-pen-line', 'كتابة المعاريض', 'Petition Writing', 'كتابة المعاريض والخطابات الرسمية بصياغة سليمة.', 'Writing petitions and official letters properly.'],
          ['file-user', 'عمل CV عربي وانجليزي', 'Arabic & English CV', 'إعداد سيرة ذاتية احترافية بالعربية والإنجليزية.', 'Preparing a professional CV in Arabic and English.']
        ]
      }
    ]
  },

  /* =====================================================
     الخدمات الطلابية — Student Services
     ===================================================== */
  students: {
    title: { ar: 'الخدمات الطلابية', en: 'Student Services' },
    categories: [
      {
        id: 'admission', icon: 'graduation-cap', img: 'students.jpg',
        title: { ar: 'القبول والتسجيل الجامعي', en: 'University Admission & Registration' },
        desc: { ar: 'خطوة بخطوة حتى مقعدك الجامعي', en: 'Step by step to your university seat' },
        items: [
          ['graduation-cap', 'التقديم على الجامعات الحكومية', 'Public University Applications', 'التقديم عبر منصات القبول وترتيب الرغبات بذكاء.', 'Applying via admission portals and ranking choices wisely.'],
          ['school', 'القبول في الجامعات والكليات الأهلية', 'Private University Admission', 'مقارنة البرامج والرسوم والمنح وتقديم الطلب.', 'Comparing programs, fees and scholarships and applying.'],
          ['book-open-check', 'القبول في الدراسات العليا', 'Postgraduate Admission', 'تجهيز ملف الماجستير والدكتوراه وخطابات التوصية.', 'Preparing Master’s/PhD files and recommendation letters.'],
          ['wrench', 'الكليات التقنية والمعاهد', 'Technical Colleges & Institutes', 'التقديم في الكليات التقنية والمعاهد المهنية.', 'Applying to technical colleges and vocational institutes.'],
          ['calculator', 'حساب النسبة الموزونة', 'Weighted Score Calculation', 'حساب نسبتك ومقارنتها بنسب القبول السابقة.', 'Calculating your score and comparing it with past cut-offs.'],
          ['compass', 'الإرشاد واختيار التخصص', 'Major Selection Guidance', 'جلسة إرشادية تربط ميولك بسوق العمل.', 'A guidance session matching your interests to the job market.'],
          ['arrow-left-right', 'التحويل بين الجامعات والتخصصات', 'Transfers', 'إجراءات التحويل الداخلي والخارجي ومعادلة المقررات.', 'Internal/external transfers and course credit matching.'],
          ['layers', 'برامج التجسير', 'Bridging Programs', 'التقديم على برامج التجسير من الدبلوم إلى البكالوريوس.', 'Applying to diploma-to-bachelor bridging programs.'],
          ['calendar-check', 'تسجيل المقررات والجداول', 'Course Registration', 'مساعدتك في تسجيل المقررات وتنظيم الجدول.', 'Helping you register courses and organize your schedule.'],
          ['globe', 'قبول الطلاب غير السعوديين', 'Admission for Non-Saudi Students', 'التقديم في الجامعات السعودية للمقيمين والطلاب الدوليين.', 'Applying to Saudi universities for residents and international students.']
        ]
      },
      {
        id: 'abroad', icon: 'plane-takeoff', img: 'graduation.jpg',
        title: { ar: 'الابتعاث والدراسة بالخارج', en: 'Scholarships & Study Abroad' },
        desc: { ar: 'من اختيار الجامعة حتى الوصول والاستقرار', en: 'From choosing a university to arrival and settling in' },
        items: [
          ['award', 'برنامج الابتعاث', 'Scholarship Program', 'التعريف بمسارات برنامج الابتعاث وتجهيز طلب التقديم.', 'Explaining scholarship tracks and preparing your application.'],
          ['search', 'البحث عن الجامعات والقبول', 'University Search & Admission', 'ترشيح الجامعات الموصى بها والحصول على القبول.', 'Shortlisting recommended universities and securing admission.'],
          ['languages', 'القبول اللغوي ومعاهد اللغة', 'Language School Admission', 'التسجيل في معاهد اللغة المعتمدة قبل الدراسة.', 'Enrolling in accredited language schools before study.'],
          ['stamp', 'التأشيرة الدراسية', 'Student Visa', 'تجهيز ملف التأشيرة وحجز المقابلة.', 'Preparing the visa file and booking interviews.'],
          ['user-plus', 'الإلحاق بالبعثة', 'Joining the Scholarship', 'إلحاق الدارسين على حسابهم الخاص بالبعثة.', 'Joining the scholarship for self-funded students.'],
          ['file-check', 'الموافقة المسبقة للدراسة', 'Prior Study Approval', 'الحصول على موافقة الدراسة على الحساب الخاص.', 'Obtaining approval for self-funded study.'],
          ['monitor', 'خدمات المبتعثين (سفير)', 'Scholar Services (Safeer)', 'متابعة طلبات المبتعث في نظام سفير.', 'Tracking scholar requests on the Safeer system.'],
          ['house', 'السكن والاستقبال', 'Housing & Arrival', 'حجز السكن الجامعي أو العائلي وترتيب الاستقبال.', 'Booking university or homestay housing and arrival pickup.']
        ]
      },
      {
        id: 'equiv', icon: 'badge-check', img: 'docs-sign.jpg',
        title: { ar: 'معادلة وتقييم وتصديق الشهادات', en: 'Certificate Equivalency & Evaluation' },
        desc: { ar: 'اعتماد مؤهلاتك داخل المملكة', en: 'Getting your qualifications recognized in Saudi Arabia' },
        items: [
          ['badge-check', 'معادلة الشهادات الصادرة من الخارج', 'Foreign Degree Equivalency', 'تجهيز ورفع طلب المعادلة لدى وزارة التعليم ومتابعته.', 'Preparing and tracking equivalency requests with the Ministry of Education.'],
          ['stethoscope', 'التصنيف والتسجيل المهني الصحي', 'Health Professional Classification', 'التسجيل في الهيئة السعودية للتخصصات الصحية والتحقق من الشهادات.', 'Registering with the Saudi Commission for Health Specialties and credential verification.'],
          ['hard-hat', 'الاعتماد المهني للمهندسين', 'Engineers Accreditation', 'التسجيل والاعتماد المهني لدى الهيئة السعودية للمهندسين.', 'Registration and accreditation with the Saudi Council of Engineers.'],
          ['clipboard-check', 'تقييم المؤهلات المهنية', 'Professional Qualification Assessment', 'المساعدة في برامج الاعتماد والتحقق المهني للعمالة.', 'Assistance with professional verification programs for workers.'],
          ['stamp', 'تصديق الشهادات والوثائق', 'Certificate Attestation', 'تصديق الشهادات من الجهات التعليمية والخارجية.', 'Attesting certificates with education bodies and MOFA.'],
          ['languages', 'ترجمة الشهادات وكشوف الدرجات', 'Transcript Translation', 'ترجمة معتمدة للشهادات والسجلات الأكاديمية.', 'Certified translation of certificates and transcripts.'],
          ['copy', 'بدل فاقد للشهادات والوثائق', 'Certificate Replacement', 'استخراج بدل الشهادة أو الوثيقة المفقودة.', 'Replacing lost certificates and documents.'],
          ['file-text', 'السجل الأكاديمي والإفادات', 'Transcripts & Letters', 'استخراج السجل الأكاديمي وخطاب التعريف وإفادة التخرج.', 'Obtaining transcripts, enrollment letters and graduation statements.']
        ]
      },
      {
        id: 'tests', icon: 'clipboard-check', img: 'study.jpg',
        title: { ar: 'الاختبارات والتأهيل', en: 'Tests & Exam Preparation' },
        desc: { ar: 'تسجيل في الاختبارات وتجهيز يرفع درجتك', en: 'Test registration and preparation that raises your score' },
        items: [
          ['brain', 'اختبار القدرات العامة', 'General Aptitude Test (GAT)', 'التسجيل في الاختبار ودورات التأسيس والتدريب.', 'Registration plus foundation and practice courses.'],
          ['flask-conical', 'الاختبار التحصيلي', 'Achievement Test', 'التسجيل والمراجعات المركّزة للمواد العلمية والأدبية.', 'Registration and focused science/humanities reviews.'],
          ['languages', 'اختبار ستيب STEP', 'STEP English Test', 'التسجيل والتدريب على أقسام الاختبار.', 'Registration and practice on all sections.'],
          ['globe', 'آيلتس وتوفل', 'IELTS & TOEFL', 'حجز موعد الاختبار وخطة تحضير مناسبة لهدفك.', 'Booking test dates and a prep plan for your target score.'],
          ['presentation', 'الرخصة المهنية للمعلمين', 'Teacher Professional License', 'التسجيل في اختبارات الرخصة المهنية والتحضير لها.', 'Registering and preparing for teacher licensing exams.'],
          ['stethoscope', 'اختبارات التخصصات الصحية', 'Health Specialties Exams', 'حجز مواعيد اختبارات الهيئة والتحضير لها.', 'Booking and preparing for SCFHS exams.'],
          ['target', 'الاختبارات التجريبية', 'Mock Exams', 'اختبارات محاكية للواقع مع تحليل نقاط الضعف.', 'Realistic mock tests with weakness analysis.'],
          ['clipboard-check', 'التسجيل في اختبارات القدرات والقياس', 'Qudurat & Qiyas Registration', 'التسجيل في اختبارات القدرات والقياس وحجز المواعيد.', 'Registering for Qudurat and Qiyas tests and booking dates.']
        ]
      },
      {
        id: 'academic', icon: 'book-open', img: 'study.jpg',
        title: { ar: 'الدعم الأكاديمي والبحثي', en: 'Academic & Research Support' },
        desc: { ar: 'نساعدك تتعلم وتنجز عملك بنفسك بجودة أعلى', en: 'Helping you learn and produce your own work at a higher standard' },
        items: [
          ['spell-check', 'التدقيق اللغوي والنحوي', 'Proofreading & Editing', 'تدقيق لغوي ونحوي للأبحاث والرسائل العلمية.', 'Language and grammar proofreading for papers and theses.'],
          ['align-right', 'تنسيق الأبحاث والرسائل', 'Research Formatting', 'تنسيق الرسالة وفق دليل الجامعة وأنماط APA و MLA.', 'Formatting per university guides and APA/MLA styles.'],
          ['languages', 'الترجمة الأكاديمية', 'Academic Translation', 'ترجمة الملخصات والمقالات والمراجع العلمية.', 'Translating abstracts, articles and references.'],
          ['chart-scatter', 'الاستشارات الإحصائية', 'Statistical Consulting', 'شرح وتوجيه في تحليل البيانات باستخدام SPSS وغيرها.', 'Guidance on data analysis with SPSS and other tools.'],
          ['lightbulb', 'الإرشاد في منهجية البحث', 'Research Methodology Mentoring', 'جلسات توجيهية لاختيار العنوان وبناء الخطة والمنهج.', 'Mentoring sessions on topic choice, proposal and method.'],
          ['scan-text', 'فحص نسبة الاقتباس', 'Similarity Check', 'فحص نسبة التشابه وإرشادك لتحسين التوثيق.', 'Similarity checks and guidance to improve citations.'],
          ['user-round-pen', 'الدروس الخصوصية والتقوية', 'Private Tutoring', 'معلمون متخصصون حضورياً أو عن بُعد لجميع المراحل.', 'Specialist tutors in-person or online for all levels.'],
          ['mic', 'دورات اللغة الإنجليزية', 'English Language Courses', 'برامج محادثة وكتابة أكاديمية لجميع المستويات.', 'Conversation and academic writing programs for all levels.']
        ]
      },
      {
        id: 'works', icon: 'notebook-pen', img: 'study.jpg',
        title: { ar: 'الأعمال الدراسية والبحوث', en: 'Coursework & Research' },
        desc: { ar: 'أوراق العمل والمطويات والملازم والتقارير والبحوث وإعداد المشاريع', en: 'Worksheets, brochures, notes, reports, research and project preparation' },
        items: [
          ['file-text', 'أوراق عمل', 'Worksheets', 'إعداد أوراق عمل منظمة للمواد الدراسية.', 'Preparing organized worksheets for school subjects.'],
          ['book-open', 'مطويات', 'Brochures', 'تصميم مطويات تعليمية جاهزة للطباعة.', 'Designing print-ready educational brochures.'],
          ['network', 'خرائط مفاهيم', 'Concept Maps', 'إعداد خرائط مفاهيم توضح الدروس بصرياً.', 'Preparing concept maps that explain lessons visually.'],
          ['notebook', 'ملازم طلابية', 'Student Study Notes', 'تجميع وتنسيق ملازم المواد الدراسية.', 'Compiling and formatting study notes.'],
          ['clipboard-list', 'خطة بحث', 'Research Proposal', 'المساعدة في إعداد خطة البحث وتنظيم عناصرها.', 'Helping prepare a research plan and organize its sections.'],
          ['file-bar-chart', 'تقارير', 'Reports', 'إعداد وتنسيق التقارير الدراسية.', 'Preparing and formatting academic reports.'],
          ['folder-kanban', 'مشاريع', 'Projects', 'إعداد المشاريع الدراسية وتجهيز عرضها.', 'Preparing school projects and getting them ready to present.'],
          ['graduation-cap', 'رسائل تخرج', 'Graduation Theses', 'دعم إعداد وتنسيق رسائل التخرج حسب لائحة الجامعة.', 'Support preparing and formatting graduation theses per university rules.'],
          ['pencil-ruler', 'حل واجبات وتمارين', 'Homework & Exercises Help', 'مساعدة في فهم وحل الواجبات والتمارين وشرحها.', 'Help understanding, solving and explaining homework and exercises.'],
          ['flask-conical', 'بحوث علمية', 'Scientific Research', 'دعم إعداد البحوث العلمية وتنظيمها.', 'Support in preparing and structuring scientific research.'],
          ['book-marked', 'بحوث أكاديمية', 'Academic Research', 'دعم إعداد البحوث الأكاديمية وتوثيق المراجع.', 'Support preparing academic research and citing references.'],
          ['text', 'تلخيص', 'Summarization', 'تلخيص الكتب والمقررات والمحاضرات.', 'Summarizing books, courses and lectures.']
        ]
      },
      {
        id: 'design', icon: 'presentation', img: 'students.jpg',
        title: { ar: 'العروض والتصاميم وتجهيز الملفات', en: 'Presentations, Designs & File Prep' },
        desc: { ar: 'عروض بوربوينت وتصاميم وشهادات وتجهيز وتحويل الملفات', en: 'PowerPoint presentations, designs, certificates, and preparing/converting files' },
        items: [
          ['presentation', 'عروض تقديمية', 'Presentations', 'تصميم عروض تقديمية احترافية للمدرسة والجامعة.', 'Designing professional presentations for school and university.'],
          ['monitor-play', 'عروض بوربوينت', 'PowerPoint Presentations', 'إعداد عروض بوربوينت منسقة ومتحركة.', 'Preparing well-formatted, animated PowerPoint presentations.'],
          ['folder-check', 'تجهيز الملفات', 'File Preparation', 'تجهيز وترتيب ملفاتك الدراسية والرسمية.', 'Preparing and organizing your study and official files.'],
          ['award', 'شهادات وتصاميم', 'Certificates & Designs', 'تصميم الشهادات والبطاقات والتصاميم المخصصة.', 'Designing certificates, cards and custom designs.'],
          ['file-output', 'تحويل الملفات الى PDF', 'Convert Files to PDF', 'تحويل ملفاتك إلى PDF بجودة عالية.', 'Converting your files to high-quality PDF.'],
          ['file-user', 'عمل سيرة ذاتية', 'CV Preparation', 'إعداد سيرة ذاتية احترافية.', 'Preparing a professional CV.']
        ]
      },
      {
        id: 'schools', icon: 'school', img: 'students.jpg',
        title: { ar: 'المدارس والأنظمة التعليمية', en: 'Schools & Education Systems' },
        desc: { ar: 'تسجيل ونقل ومتابعة لأبنائك', en: 'Enrollment, transfers and follow-up for your children' },
        items: [
          ['user-plus', 'تسجيل الطلاب المستجدين', 'New Student Enrollment', 'تسجيل الطلاب المستجدين في المدارس الحكومية والأهلية.', 'Enrolling new students in public and private schools.'],
          ['search', 'البحث عن المدارس الأهلية والعالمية', 'Private & International Schools', 'مقارنة المدارس والمناهج والرسوم وحجز المقعد.', 'Comparing schools, curricula and fees and reserving a seat.'],
          ['baby', 'تسجيل رياض الأطفال', 'Kindergarten Enrollment', 'التسجيل في رياض الأطفال الحكومية والأهلية.', 'Enrolling in public and private kindergartens.'],
          ['file-text', 'الشهادات المدرسية وبدل الفاقد', 'School Certificates', 'طباعة الشهادات واستخراج بدل الفاقد.', 'Printing certificates and obtaining replacements.'],
          ['book-open', 'برامج التأسيس والتقوية', 'Foundation & Support Programs', 'تأسيس القراءة والكتابة والرياضيات ومتابعة المستوى.', 'Reading, writing and math foundations with progress tracking.'],
          ['user-plus', 'تسجيل طالب', 'Student Registration', 'تسجيل الطالب في المدرسة وإكمال إجراءاتها.', 'Registering a student at school and completing procedures.'],
          ['arrow-left-right', 'نقل طالب', 'Student Transfer', 'نقل الطالب بين المدارس وإنهاء أوراقه.', 'Transferring a student between schools and finishing paperwork.'],
          ['bus', 'تسجيل طالب في النقل المدرسي', 'School Transport Registration', 'تسجيل الطالب في النقل المدرسي.', 'Registering a student in school transport.'],
          ['monitor', 'نظام نور', 'Noor System', 'خدمات نظام نور: التسجيل والنقل والشهادات.', 'Noor system services: registration, transfer and certificates.'],
          ['school', 'نظام مدرستي', 'Madrasati System', 'الدخول وإدارة حسابات منصة مدرستي.', 'Accessing and managing Madrasati platform accounts.'],
          ['video', 'منصة تيمز', 'Teams Platform', 'تفعيل وإدارة حسابات منصة تيمز للتعليم.', 'Activating and managing Teams education accounts.']
        ]
      },
      {
        id: 'career', icon: 'briefcase', img: 'team.jpg',
        title: { ar: 'التدريب والمسار المهني', en: 'Training & Career' },
        desc: { ar: 'من مقاعد الدراسة إلى سوق العمل', en: 'From the classroom to the job market' },
        items: [
          ['file-user', 'عمل سيرة ذاتية (CV)', 'CV Preparation', 'سيرة ذاتية احترافية بالعربي والإنجليزي متوافقة مع أنظمة التوظيف.', 'Professional Arabic/English CVs that pass applicant tracking systems.'],
          ['briefcase', 'التدريب التعاوني والصيفي', 'Co-op & Summer Training', 'البحث عن جهة تدريب وتجهيز خطاب الطلب.', 'Finding a training placement and preparing the request letter.'],
          ['monitor', 'التسجيل في منصات التوظيف', 'Job Platforms Registration', 'التسجيل في جدارات ومنصات التوظيف الوطنية.', 'Registering on Jadarat and national job platforms.'],
          ['message-circle', 'التدريب على المقابلات', 'Interview Coaching', 'مقابلات تجريبية ونصائح عملية للنجاح.', 'Mock interviews and practical tips to succeed.'],
          ['linkedin', 'بناء الملف المهني على لينكدإن', 'LinkedIn Profile Building', 'ملف احترافي يلفت انتباه أصحاب العمل.', 'A professional profile that gets employers’ attention.'],
          ['award', 'الشهادات الاحترافية', 'Professional Certifications', 'إرشادك للشهادات المناسبة لتخصصك والتسجيل فيها.', 'Guiding you to the right certifications and registration.'],
          ['book-open-check', 'التسجيل في دورات دروب وأثرائي والتطوع', 'Doroob, Athrai & Volunteering Courses', 'التسجيل في دورات دروب وأثرائي والفرص التطوعية.', 'Registering in Doroob and Athrai courses and volunteering opportunities.']
        ]
      },
      {
        id: 'life', icon: 'house', img: 'graduation.jpg',
        title: { ar: 'خدمات الحياة الطلابية', en: 'Student Life Services' },
        desc: { ar: 'سكن ونقل وتأمين ووثائق — كل احتياجاتك', en: 'Housing, transport, insurance and documents — all you need' },
        items: [
          ['bed-double', 'السكن الطلابي', 'Student Housing', 'سكن قريب من الجامعة للطلاب والطالبات بأسعار مناسبة.', 'Affordable housing near campus for male and female students.'],
          ['globe', 'منح الطلاب الدوليين (ادرس في السعودية)', 'International Scholarships (Study in Saudi)', 'التقديم على المنح المتاحة للطلاب الدوليين في الجامعات السعودية.', 'Applying for scholarships for international students at Saudi universities.'],
          ['id-card', 'إقامة الطالب الدولي', 'International Student Iqama', 'إجراءات الإقامة والتأشيرة للطلاب غير السعوديين.', 'Residency and visa procedures for non-Saudi students.'],
          ['heart-pulse', 'التأمين الطبي للطلاب', 'Student Health Insurance', 'مقارنة باقات التأمين الطبي للطلاب.', 'Comparing student health insurance plans.'],
          ['wallet', 'المكافأة الجامعية', 'University Stipend', 'الاستعلام عن المكافأة ومتابعة صرفها.', 'Checking and following up on stipend payments.'],
          ['bus', 'النقل الجامعي', 'University Transport', 'اشتراكات نقل يومية آمنة للطلاب والطالبات.', 'Safe daily transport subscriptions for students.'],
          ['mail', 'خطابات التعريف والإفادات', 'Enrollment Letters', 'استخراج خطابات التعريف والإفادات الجامعية.', 'Obtaining enrollment letters and university statements.']
        ]
      }
    ]
  }
};
