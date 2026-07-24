import React, { createContext, useContext, useState, useEffect } from 'react';
import { PortfolioItem, CategoryItem } from '../types';
import { portfolioItems } from '../portfolioData';

type Language = 'ar' | 'en';
type Dir = 'rtl' | 'ltr';

interface LanguageContextType {
  language: Language;
  dir: Dir;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  translatedPortfolioItems: PortfolioItem[];
  
  // Admin-related states & actions
  rawPortfolioItems: PortfolioItem[];
  setRawPortfolioItems: (items: PortfolioItem[]) => void;
  rawCategories: CategoryItem[];
  setRawCategories: (cats: CategoryItem[]) => void;
  categoriesList: { key: string; label: string }[];
  customTranslations: Record<Language, Record<string, string>>;
  setAllCustomTranslations: (trans: Record<Language, Record<string, string>>) => void;
  rawPartnerLogos: string[];
  setRawPartnerLogos: (logos: string[]) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Helper functions for translating portfolio items on-the-fly
const getEnglishTitle = (id: string): string => {
  const titles: Record<string, string> = {
    'next-level-3d': 'Next Level Studio - 3D Modeling & Rendering',
    'aura-branding': 'Aura Brand Identity',
    'solaris-digital': 'Solaris Digital Brand Identity',
    'space-voyage-web': 'Interactive Space Voyage Website',
    'cosmic-astronaut': '3D Cosmic Astronaut',
    'codenest-reveal': 'CodeNest Motion Graphics Promo Video',
    'stellar-ai-ui': 'AI Dashboard UI Design',
    'orbit-3d-loop': '3D Orbital Motion Loop',
  };
  return titles[id] || id;
};

const getEnglishCategory = (key: string): string => {
  const categories: Record<string, string> = {
    'all': 'All',
    '3d': '3D Design',
    'branding': 'Brand Identity',
    'web': 'Web & UI/UX Design',
    'motion': 'Motion Graphics',
  };
  return categories[key] || key;
};

const getEnglishDescription = (id: string): string => {
  const descs: Record<string, string> = {
    'next-level-3d': 'A comprehensive project to reinvent Next Level Studio\'s brand elements in an isometric 3D style, focusing on light reflections and glowing metallic & glass materials for a premium futuristic look.',
    'aura-branding': 'Full brand identity design for Aura, blending Swiss minimalism with contemporary artistic touches. The logo, color systems, print materials, and marketing assets are presented in a unified style.',
    'solaris-digital': 'An advanced visual identity inspired by solar energy and digital ecosystems for Solaris. The design features high color contrast, modern geometric lines, and bold use of negative space.',
    'space-voyage-web': 'An interactive 3D user interface that takes users on an immersive animated space journey. The site aims to deliver complex astronomical information in a simplified, smooth, and visually engaging way.',
    'cosmic-astronaut': '3D modeling of an astronaut with a reflective glass helmet, precise suit simulation, soft neon lighting, and floating particles to create an extraordinary magical realism.',
    'codenest-reveal': 'Engaging kinetic animation to reveal the logo and identity of the CodeNest platform, utilizing morphing shapes and mock sound effects for a lively experience.',
    'stellar-ai-ui': 'Design of a polished, futuristic dark UI for an AI data management dashboard, featuring dynamic graphs and semi-transparent glassmorphism effects.',
    'orbit-3d-loop': 'A continuous seamless 3D orbital motion loop featuring color harmony and engaging paths, ideal as an interactive background element for luxury websites and metaverse apps.',
  };
  return descs[id] || '';
};

const getEnglishClient = (id: string): string => {
  const clients: Record<string, string> = {
    'next-level-3d': 'Next Level Studio',
    'aura-branding': 'Aura Tech',
    'solaris-digital': 'Solaris Digital',
    'space-voyage-web': 'Modern Astronomical Society',
    'cosmic-astronaut': 'Personal',
    'codenest-reveal': 'CodeNest Platform',
    'stellar-ai-ui': 'Stellar AI',
    'orbit-3d-loop': 'Personal',
  };
  return clients[id] || 'Client';
};

const defaultCategories: CategoryItem[] = [
  { key: '3d', labelAr: 'تصميم ثلاثي الأبعاد 3D', labelEn: '3D Design' },
  { key: 'branding', labelAr: 'هويات بصرية', labelEn: 'Brand Identity' },
  { key: 'web', labelAr: 'تصميم الويب وUI/UX', labelEn: 'Web & UI/UX Design' },
  { key: 'motion', labelAr: 'موشن جرافيكس', labelEn: 'Motion Graphics' }
];

const translations: Record<Language, Record<string, string>> = {
  ar: {
    // Nav Bar
    'nav.brandName': 'مانع جرافيكس',
    'nav.about': 'من أنا',
    'nav.services': 'الخدمات',
    'nav.projects': 'مشاريعي',
    'nav.portfolio': 'معرض الأعمال',
    'nav.contact': 'تواصل معي',
    'nav.homeTitle': 'الرئيسية',
    'nav.logoUrl': '',

    // Hero Section
    'hero.welcome': 'مرحباً، أنا مانع',
    'hero.subtitle': 'أصنع حضورًا بصريًا يترك أثرًا.',
    'hero.contactBtn': 'تواصل معي',
    'hero.profileImage': 'https://i.ibb.co/JWtLY2cB/Rectangle-40443-81459862.png',
    'hero.bgVideoUrl': 'https://i.ibb.co/v61V8K48/manea-hero-1.gif',
    'footer.bgVideoUrl': 'https://i.ibb.co/1t1vRfbg/maneahero-ezgif-com-video-to-gif-converter.gif',

    // About Section
    'about.title': 'من أنا',
    'about.text': 'بخبرة تمتد لأكثر من 12 عامًا في مجال التصميم الرقمي، أكرّس خبرتي لتحويل الأفكار إلى هويات بصرية راسخة وتجارب رقمية استثنائية. أقدّم حلولًا إبداعية تجمع بين الرؤية الفنية والدقة الاحترافية، بدءًا من تصميم الهويات البصرية وصولًا إلى واجهات الويب الحديثة، بما يعزز حضور العلامات التجارية ويمنحها قيمةً وهويةً متميزة.',

    // Services Section
    'services.subtitle': 'مجالات الخبرة والتميز',
    'services.title': 'الخدمات الإبداعية',
    'services.fullRange': 'مجال إبداعي متكامل',
    'services.unlimited': 'ابتكار بلا حدود',
    'services.browseProjects': 'تصفح المشاريع والأعمال',
    'services.01.name': 'اللوحات الإعلانية',
    'services.01.desc': 'تصميم لوحات إعلانية خارجية جذابة ومبتكرة، تضمن لعلامتك التجارية لفت الانتباه في الأماكن العامة، وتحقيق أقصى قدر من المشاهدة والتأثير البصري السريع.',
    'services.02.name': 'النمذجة ثلاثية الأبعاد (3D)',
    'services.02.desc': 'ابتكار كائنات، شخصيات، وبيئات ثلاثية الأبعاد بتفاصيل دقيقة مصممة خصيصاً لتلائم رؤيتك. تعتبر الخيار الأمثل لتطوير الألعاب، وعرض المنتجات، والتصورات المعمارية بواقعية مبهرة.',
    'services.03.name': 'تنسيق المناسبات والزفاف',
    'services.03.desc': 'تقديم حلول وتصاميم بصرية متكاملة لحفلات الزفاف والمناسبات الخاصة؛ بدءاً من تصميم الدعوات الأنيقة وحتى ابتكار ثيمات بصرية شاملة، لضمان تجربة استثنائية وذكريات لا تُنسى.',
    'services.04.name': 'العلامات التجارية (Branding)',
    'services.04.desc': 'صياغة هويات بصرية متكاملة ومبتكرة — بدءاً من تصميم الشعارات وحتى بناء أدلة شاملة للعلامات التجارية — لضمان حضور قوي، مميز، ويعكس شخصية علامتك بوضوح في السوق.',
    'services.05.name': 'إدارة وتسويق حسابات التواصل',
    'services.05.desc': 'وضع استراتيجيات تسويقية فعّالة وصناعة محتوى جذاب لإدارة حساباتك على السوشيال ميديا، بهدف بناء مجتمع تفاعلي، تعزيز الوعي بعلامتك التجارية، وزيادة ولاء العملاء.',
    'services.06.name': 'التصميم الحركي (الموشن)',
    'services.06.desc': 'إنتاج رسوم متحركة ديناميكية وفيديوهات موشن جرافيك إبداعية تضفي حيوية وسرداً بصرياً جذاباً لقصص العلامات التجارية، وتجعل عرض المنتجات والتجارب الرقمية أكثر تشويقاً وتأثيراً.',
    'services.07.name': 'تصميم وتطوير المواقع',
    'services.07.desc': 'تصميم مواقع إلكترونية عصرية وجذابة تركز على رفع معدلات التحويل، مع إيلاء اهتمام فائق لتجربة المستخدم (UX)، وتناسق الألوان والخطوط، لضمان تصفح سلس واحترافي يعكس جودة خدماتك.',
    'services.08.name': 'التصميم بالذكاء الاصطناعي',
    'services.08.desc': 'توظيف أحدث تقنيات وأدوات الذكاء الاصطناعي لتوليد أفكار وتصاميم فريدة ومبتكرة، مما يتيح استكشاف آفاق إبداعية غير مسبوقة وتسريع عملية الإنتاج البصري بدقة عالية.',
    'services.09.name': 'الحملات الإعلانية الرقمية',
    'services.09.desc': 'تخطيط وتنفيذ حملات إعلانية ممولة وموجهة بدقة عبر مختلف المنصات الرقمية، مصممة خصيصاً لاستهداف جمهورك المثالي، زيادة المبيعات، وتحقيق أعلى عائد على الاستثمار (ROI).',

    // Projects Section
    'projects.title': 'المشاريع',
    'projects.01.category': 'عميل',
    'projects.01.name': 'ستوديو نكست ليفل',
    'projects.02.category': 'شخصي',
    'projects.02.name': 'هوية أورا البصرية',
    'projects.03.category': 'عميل',
    'projects.03.name': 'سولاريس ديجيتال',

    // Success Partners Section
    'partners.trust': 'نعتز بثقتهم',
    'partners.title': 'شركاء النجاح',

    // Contact Form / Footer Section
    'contact.stayInTouch': 'يسعدني تواصلك الإبداعي المباشر',
    'contact.description': 'دعنا نبني شيئاً مذهلاً معاً. يسعدني تواصلك معي لمناقشة مشروعك القادم وتجسيد رؤيتك الإبداعية، وسأقوم بتحويل أفكارك وتطلعاتك إلى تصاميم فريدة تعبر عن تميز علامتك التجارية.',
    'contact.directPhone': 'الهاتف والواتساب المباشر',
    'contact.officialEmail': 'البريد الإلكتروني الرسمي',
    'contact.phoneValue': '+967772655825',
    'contact.emailValue': 'manea.izz2013@gmail.com',
    'contact.whatsappLink': 'https://wa.me/967772655825',
    'contact.instagramLink': 'https://instagram.com/7l9iz',
    'contact.facebookLink': 'https://facebook.com/7l9iz',
    'contact.socialPlatforms': 'منصات التواصل الاجتماعي الرسمية:',
    'contact.copyEmail': 'نسخ البريد',
    'contact.emailCopied': 'تم نسخ البريد الإلكتروني!',
    'contact.fullName': 'الاسم بالكامل',
    'contact.fullNameExample': 'مثال: مانع عزالدين',
    'contact.emailLabel': 'البريد الإلكتروني',
    'contact.phoneLabel': 'رقم الهاتف أو الواتساب',
    'contact.selectService': 'الخدمة المطلوبة',
    'contact.selectServicePlaceholder': 'اختر الخدمة الإبداعية التي ترغب بها...',
    'contact.msgLabel': 'تفاصيل مشروعك أو فكرتك الإبداعية',
    'contact.msgPlaceholder': 'اكتب لنا أفكارك وتطلعاتك بالتفصيل هنا...',
    'contact.reqName': 'الرجاء إدخال الاسم بالكامل',
    'contact.minName': 'يجب أن يكون الاسم 3 أحرف على الأقل',
    'contact.reqEmail': 'الرجاء إدخال البريد الإلكتروني',
    'contact.invalidEmail': 'البريد الإلكتروني غير صالح',
    'contact.reqPhone': 'الرجاء إدخال رقم الهاتف أو الواتساب',
    'contact.reqMsg': 'الرجاء كتابة تفاصيل مشروعك أو فكرتك',
    'contact.successSubmit': 'شكراً لثقتك. تم استلام تفاصيل مشروعك وسأقوم بمراجعتها وإعداد خطة العمل والتواصل معك عبر البريد الإلكتروني أو الواتساب في أقرب وقت.',
    'contact.successShort': 'شكراً لتواصلك معنا. سنقوم بالرد عليك عبر الهاتف أو البريد الإلكتروني في أقرب وقت ممكن.',
    'contact.sending': 'جاري الإرسال...',
    'contact.sendBtn': 'أرسل تفاصيل مشروعك الآن',

    // Portfolio Gallery Section
    'portfolioGallery.creativeShowcase': 'المعرض الإبداعي',
    'portfolioGallery.title': 'معرض أعمال مانع',
    'portfolioGallery.all': 'الكل',
    'portfolioGallery.cat_3d': 'تصميم ثلاثي الأبعاد 3D',
    'portfolioGallery.cat_branding': 'هويات بصرية',
    'portfolioGallery.cat_web': 'تصميم الويب وUI/UX',
    'portfolioGallery.cat_motion': 'موشن جرافيكس',
    'portfolioGallery.searchPlaceholder': 'ابحث عن مشروع أو أداة (مثال: Blender)...',
    'portfolioGallery.viewDetails': 'عرض التفاصيل',
    'portfolioGallery.viewFullDetails': 'عرض كامل التفاصيل',
    'portfolioGallery.prevProject': 'المشروع السابق',
    'portfolioGallery.nextProject': 'المشروع التالي',
    'portfolioGallery.close': 'إغلاق',
    'portfolioGallery.noResults': 'لم يتم العثور على مشاريع تطابق بحثك أو تصنيفك.',
    'portfolioGallery.showAll': 'عرض جميع المشاريع',
    'portfolioGallery.thinkToBuild': 'هل لديك مشروع تفكر في بنائه؟',
    'portfolioGallery.startProjectNow': 'ابدأ مشروعك الآن',
    'portfolioGallery.client': 'العميل',
    'portfolioGallery.year': 'السنة',
    'portfolioGallery.tools': 'الأدوات المستخدمة',
    'portfolioGallery.aboutProject': 'عن المشروع',
    'portfolioGallery.contactRegardingProj': 'تواصل بخصوص المشروع',
    'portfolioGallery.autoplayOn': 'عرض تلقائي مستمر (5 ثوانٍ)',
    'portfolioGallery.autoplayOff': 'العرض التلقائي موقوف',
    'portfolioGallery.autoplayTemp': '(تم إيقافه مؤقتاً لتفاعلك مع المشروع)',
    'portfolioGallery.stopAutoplay': 'إيقاف التصفح التلقائي',
    'portfolioGallery.startAutoplay': 'تشغيل التصفح التلقائي',

    // Common
    'common.backHome': 'الرئيسية',
    'common.rights': '© 2026 مانع جرافيكس. جميع الحقوق محفوظة.',
  },
  en: {
    // Nav Bar
    'nav.brandName': 'Manea Graphics',
    'nav.about': 'About',
    'nav.services': 'Services',
    'nav.projects': 'Projects',
    'nav.portfolio': 'Portfolio',
    'nav.contact': 'Contact Me',
    'nav.homeTitle': 'Home',
    'nav.logoUrl': '',

    // Hero Section
    'hero.welcome': 'Hi, I am Manea',
    'hero.subtitle': 'Crafting a visual presence that leaves a lasting impact.',
    'hero.contactBtn': 'Contact Me',
    'hero.profileImage': 'https://i.ibb.co/JWtLY2cB/Rectangle-40443-81459862.png',
    'hero.bgVideoUrl': 'https://i.ibb.co/v61V8K48/manea-hero-1.gif',
    'footer.bgVideoUrl': 'https://i.ibb.co/1t1vRfbg/maneahero-ezgif-com-video-to-gif-converter.gif',

    // About Section
    'about.title': 'About Me',
    'about.text': 'With over 12 years of experience in digital design, I dedicate my expertise to transforming ideas into established visual identities and exceptional digital experiences. I deliver creative solutions blending artistic vision with professional precision—from branding design to modern web interfaces—elevating brand presence and delivering distinctive value.',

    // Services Section
    'services.subtitle': 'Areas of Expertise & Excellence',
    'services.title': 'Creative Services',
    'services.fullRange': 'Integrated Creative Fields',
    'services.unlimited': 'Limitless Innovation',
    'services.browseProjects': 'Browse Projects & Work',
    'services.01.name': 'Billboards & Signage',
    'services.01.desc': 'Creative outdoor billboard designs that ensure your brand grabs attention in public spaces, maximizing visibility and instant visual impact.',
    'services.02.name': '3D Modeling & Design',
    'services.02.desc': 'Crafting 3D objects, characters, and environments with meticulous details tailored to your vision. Perfect for games, product showcases, and stunning architectural visualizations.',
    'services.03.name': 'Events & Weddings Planning',
    'services.03.desc': 'Providing comprehensive visual themes and designs for weddings and special occasions; from elegant invitation designs to immersive themes that ensure unforgettable memories.',
    'services.04.name': 'Brand Identity (Branding)',
    'services.04.desc': 'Formulating innovative and comprehensive visual identities—from logo design to full brand guidelines—to ensure a robust, distinct market presence reflecting your brand persona.',
    'services.05.name': 'Social Media Management',
    'services.05.desc': 'Developing effective marketing strategies and engaging content to manage your social media accounts, building active communities, boosting brand awareness, and driving customer loyalty.',
    'services.06.name': 'Motion Graphics',
    'services.06.desc': 'Producing dynamic animations and creative motion graphic videos that inject life and compelling storytelling into brand stories, making product showcases and digital journeys more engaging.',
    'services.07.name': 'Web Design & UI/UX',
    'services.07.desc': 'Designing modern, high-converting websites focused deeply on user experience (UX), responsive layouts, and typographic harmony, guaranteeing a seamless browsing experience representing your quality.',
    'services.08.name': 'AI Creative Design',
    'services.08.desc': 'Leveraging cutting-edge artificial intelligence platforms to generate unique, imaginative design concepts, unlocking unprecedented horizons and accelerating visual pipelines.',
    'services.09.name': 'Paid Digital Campaigns',
    'services.09.desc': 'Planning and executing laser-focused paid ad campaigns across digital channels, tailored to target your ideal audience, scale conversion rates, and maximize return on investment (ROI).',

    // Projects Section
    'projects.title': 'Projects',
    'projects.01.category': 'Client',
    'projects.01.name': 'Next Level Studio',
    'projects.02.category': 'Personal',
    'projects.02.name': 'Aura Visual Identity',
    'projects.03.category': 'Client',
    'projects.03.name': 'Solaris Digital',

    // Success Partners Section
    'partners.trust': 'Proud of Their Trust',
    'partners.title': 'Success Partners',

    // Contact Form / Footer Section
    'contact.stayInTouch': 'Stay In Touch',
    'contact.description': 'Let\'s build something spectacular together. I am delighted to discuss your upcoming project and materialize your creative vision, translating your concepts into unmatched designs reflecting your premium brand.',
    'contact.directPhone': 'Direct Phone & WhatsApp',
    'contact.officialEmail': 'Official Email',
    'contact.phoneValue': '+967772655825',
    'contact.emailValue': 'manea.izz2013@gmail.com',
    'contact.whatsappLink': 'https://wa.me/967772655825',
    'contact.instagramLink': 'https://instagram.com/7l9iz',
    'contact.facebookLink': 'https://facebook.com/7l9iz',
    'contact.socialPlatforms': 'Official Social Media Platforms:',
    'contact.copyEmail': 'Copy Email',
    'contact.emailCopied': 'Email Copied!',
    'contact.fullName': 'Full Name',
    'contact.fullNameExample': 'e.g. Manea Ezzeddine',
    'contact.emailLabel': 'Email Address',
    'contact.phoneLabel': 'Phone Number / WhatsApp',
    'contact.selectService': 'Requested Service',
    'contact.selectServicePlaceholder': 'Choose the creative service you desire...',
    'contact.msgLabel': 'Your Project Details or Creative Idea',
    'contact.msgPlaceholder': 'Write your thoughts and requirements in detail here...',
    'contact.reqName': 'Please enter your full name',
    'contact.minName': 'Name must be at least 3 characters',
    'contact.reqEmail': 'Please enter your email',
    'contact.invalidEmail': 'Invalid email address',
    'contact.reqPhone': 'Please enter your phone number or WhatsApp',
    'contact.reqMsg': 'Please write your project details or idea',
    'contact.successSubmit': 'Thank you for your trust. Your project details have been received. I will review them, prepare the plan of action, and get back to you via email or WhatsApp as soon as possible.',
    'contact.successShort': 'Thank you for reaching out. We will respond via phone or email as soon as possible.',
    'contact.sending': 'Sending...',
    'contact.sendBtn': 'Send Project Details Now',

    // Portfolio Gallery Section
    'portfolioGallery.creativeShowcase': 'Creative Showcase',
    'portfolioGallery.title': "Manea's Portfolio Gallery",
    'portfolioGallery.all': 'All',
    'portfolioGallery.cat_3d': '3D Design',
    'portfolioGallery.cat_branding': 'Brand Identity',
    'portfolioGallery.cat_web': 'Web & UI/UX Design',
    'portfolioGallery.cat_motion': 'Motion Graphics',
    'portfolioGallery.searchPlaceholder': 'Search for a project or tool (e.g. Blender)...',
    'portfolioGallery.viewDetails': 'View Details',
    'portfolioGallery.viewFullDetails': 'View Full Details',
    'portfolioGallery.prevProject': 'Previous Project',
    'portfolioGallery.nextProject': 'Next Project',
    'portfolioGallery.close': 'Close',
    'portfolioGallery.noResults': 'No projects found matching your search or category.',
    'portfolioGallery.showAll': 'Show All Projects',
    'portfolioGallery.thinkToBuild': 'Have a project in mind?',
    'portfolioGallery.startProjectNow': 'Start Your Project Now',
    'portfolioGallery.client': 'Client',
    'portfolioGallery.year': 'Year',
    'portfolioGallery.tools': 'Tools Used',
    'portfolioGallery.aboutProject': 'About the Project',
    'portfolioGallery.contactRegardingProj': 'Discuss this project',
    'portfolioGallery.autoplayOn': 'Continuous Autoplay (5s)',
    'portfolioGallery.autoplayOff': 'Autoplay Stopped',
    'portfolioGallery.autoplayTemp': '(Temporarily paused for your interaction)',
    'portfolioGallery.stopAutoplay': 'Stop Autoplay',
    'portfolioGallery.startAutoplay': 'Start Autoplay',

    // Common
    'common.backHome': 'Home',
    'common.rights': '© 2026 Manea Graphics. All rights reserved.',
  }
};

const safeSetItem = (key: string, value: string) => {
  try {
    localStorage.setItem(key, value);
  } catch (error) {
    console.error(`Failed to save to localStorage for key "${key}":`, error);
    window.dispatchEvent(new CustomEvent('storage-quota-exceeded', { detail: { key } }));
  }
};

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('manea_lang');
    return (saved === 'ar' || saved === 'en') ? saved : 'ar';
  });

  const [rawPortfolioItems, setRawPortfolioItemsState] = useState<PortfolioItem[]>(() => {
    const saved = localStorage.getItem('manea_portfolio_items');
    return saved ? JSON.parse(saved) : portfolioItems;
  });

  const [rawCategories, setRawCategoriesState] = useState<CategoryItem[]>(() => {
    const saved = localStorage.getItem('manea_categories');
    return saved ? JSON.parse(saved) : defaultCategories;
  });

  const [customTranslations, setCustomTranslationsState] = useState<Record<Language, Record<string, string>>>(() => {
    const saved = localStorage.getItem('manea_custom_translations');
    return saved ? JSON.parse(saved) : { ar: {}, en: {} };
  });

  const [rawPartnerLogos, setRawPartnerLogosState] = useState<string[]>(() => {
    const saved = localStorage.getItem('manea_partner_logos');
    return saved ? JSON.parse(saved) : [
      "https://i.ibb.co/wh7dmm4s/2.png",
      "https://i.ibb.co/Q3CbVBsG/2025.png",
      "https://i.ibb.co/q3cWB45P/image.png",
      "https://i.ibb.co/mCH4bvYb/image.png",
      "https://i.ibb.co/gMSZKtTZ/2.png",
      "https://i.ibb.co/6cktLXhn/image.png",
      "https://i.ibb.co/nqXrLLhF/image.png"
    ];
  });

  const dir: Dir = language === 'ar' ? 'rtl' : 'ltr';

  // 1. Initial Data Fetching from Backend Database Files
  useEffect(() => {
    fetch('/api/public/data')
      .then(async (res) => {
        const contentType = res.headers.get("content-type");
        if (!res.ok || !contentType || !contentType.includes("application/json")) {
          throw new Error(`Server returned non-JSON response (${res.status})`);
        }
        return res.json();
      })
      .then(data => {
        if (data.success) {
          if (data.portfolioItems) {
            setRawPortfolioItemsState(data.portfolioItems);
            safeSetItem('manea_portfolio_items', JSON.stringify(data.portfolioItems));
          }
          if (data.categories) {
            setRawCategoriesState(data.categories);
            safeSetItem('manea_categories', JSON.stringify(data.categories));
          }
          if (data.customTranslations) {
            setCustomTranslationsState(data.customTranslations);
            safeSetItem('manea_custom_translations', JSON.stringify(data.customTranslations));
          }
          if (data.partnerLogos) {
            setRawPartnerLogosState(data.partnerLogos);
            safeSetItem('manea_partner_logos', JSON.stringify(data.partnerLogos));
          }
        }
      })
      .catch(err => {
        console.warn("Could not load backend data. Falling back to local storage and offline defaults.", err);
      });
  }, []);

  useEffect(() => {
    safeSetItem('manea_lang', language);
    // Apply direction and language attribute to HTML tag
    document.documentElement.dir = dir;
    document.documentElement.lang = language;
    
    // Dynamically adjust body font class based on language for premium feel
    if (language === 'en') {
      document.documentElement.classList.add('font-sans-en');
      document.documentElement.classList.remove('font-sans-ar');
    } else {
      document.documentElement.classList.add('font-sans-ar');
      document.documentElement.classList.remove('font-sans-en');
    }
  }, [language, dir]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  // Helper to persist single fields to server
  const saveToServer = (payload: any) => {
    const token = sessionStorage.getItem('manea_admin_auth_token');
    if (!token) return;

    fetch('/api/admin/save-data', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        token,
        ...payload
      })
    })
    .then(async (res) => {
      const contentType = res.headers.get("content-type");
      if (!res.ok) {
        const errText = (contentType && contentType.includes("application/json"))
          ? (await res.json()).error
          : `HTTP error ${res.status}`;
        console.error("Failed to sync modification to backend server:", errText);
        return;
      }
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        if (!data.success) {
          console.error("Failed to sync modification to backend server:", data.error);
        } else {
          console.log("Successfully synchronized change with backend persistence storage!");
        }
      }
    })
    .catch(err => {
      console.error("Network error while syncing change to backend server:", err);
    });
  };

  const setRawPortfolioItems = (items: PortfolioItem[]) => {
    setRawPortfolioItemsState(items);
    safeSetItem('manea_portfolio_items', JSON.stringify(items));
    saveToServer({ portfolioItems: items });
  };

  const setRawCategories = (cats: CategoryItem[]) => {
    setRawCategoriesState(cats);
    safeSetItem('manea_categories', JSON.stringify(cats));
    saveToServer({ categories: cats });
  };

  const setAllCustomTranslations = (trans: Record<Language, Record<string, string>>) => {
    setCustomTranslationsState(trans);
    safeSetItem('manea_custom_translations', JSON.stringify(trans));
    saveToServer({ customTranslations: trans });
  };

  const setRawPartnerLogos = (logos: string[]) => {
    setRawPartnerLogosState(logos);
    safeSetItem('manea_partner_logos', JSON.stringify(logos));
    saveToServer({ partnerLogos: logos });
  };

  const t = (key: string): string => {
    const customSection = customTranslations[language];
    if (customSection && customSection[key] !== undefined) {
      return customSection[key];
    }
    const section = translations[language];
    return section[key] || translations['ar'][key] || key;
  };

  // On-the-fly translated portfolio items list
  const translatedPortfolioItems: PortfolioItem[] = rawPortfolioItems.map(item => {
    const categoryObj = rawCategories.find(c => c.key === item.categoryKey);
    const categoryAr = categoryObj ? categoryObj.labelAr : item.category;
    const categoryEn = categoryObj ? categoryObj.labelEn : (getEnglishCategory(item.categoryKey) || item.category);

    return {
      ...item,
      title: language === 'ar' ? item.title : (item.titleEn || getEnglishTitle(item.id)),
      category: language === 'ar' ? categoryAr : categoryEn,
      description: language === 'ar' ? item.description : (item.descriptionEn || getEnglishDescription(item.id)),
      client: language === 'ar' ? item.client : (item.clientEn || getEnglishClient(item.id)),
    };
  });

  const categoriesList = rawCategories.map(c => ({
    key: c.key,
    label: language === 'ar' ? c.labelAr : c.labelEn
  }));

  return (
    <LanguageContext.Provider value={{ 
      language, 
      dir, 
      setLanguage, 
      t, 
      translatedPortfolioItems,
      rawPortfolioItems,
      setRawPortfolioItems,
      rawCategories,
      setRawCategories,
      categoriesList,
      customTranslations,
      setAllCustomTranslations,
      rawPartnerLogos,
      setRawPartnerLogos
    }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
