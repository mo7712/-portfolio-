import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent, useSpring } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { Sparkles } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { EditableText } from './VisualEditor';

interface Service {
  num: string;
  name: string;
  desc: string;
}

const services: Service[] = [
  { num: "01", name: "اللوحات الإعلانية", desc: "تصميم لوحات إعلانية خارجية جذابة ومبتكرة، تضمن لعلامتك التجارية لفت الانتباه في الأماكن العامة، وتحقيق أقصى قدر من المشاهدة والتأثير البصري السريع." },
  { num: "02", name: "النمذجة ثلاثية الأبعاد (3D)", desc: "ابتكار كائنات، شخصيات، وبيئات ثلاثية الأبعاد بتفاصيل دقيقة مصممة خصيصًا لتلائم رؤيتك. تعتبر الخيار الأمثل لتطوير الألعاب، وعرض المنتجات، والتصورات المعمارية بواقعية مبهرة." },
  { num: "03", name: "تنسيق المناسبات والزفاف", desc: "تقديم حلول وتصاميم بصرية متكاملة لحفلات الزفاف والمناسبات الخاصة؛ بدءاً من تصميم الدعوات الأنيقة وحتى ابتكار ثيمات بصرية شاملة، لضمان تجربة استثنائية وذكريات لا تُنسى." },
  { num: "04", name: "العلامات التجارية (Branding)", desc: "صياغة هويات بصرية متكاملة ومبتكرة — بدءاً من تصميم الشعارات وحتى بناء أدلة شاملة للعلامات التجارية — لضمان حضور قوي، مميز، ويعكس شخصية علامتك بوضوح في السوق." },
  { num: "05", name: "إدارة وتسويق حسابات التواصل", desc: "وضع استراتيجيات تسويقية فعّالة وصناعة محتوى جذاب لإدارة حساباتك على السوشيال ميديا، بهدف بناء مجتمع تفاعلي، تعزيز الوعي بعلامتك التجارية، وزيادة ولاء العملاء." },
  { num: "06", name: "التصميم الحركي (الموشن)", desc: "إنتاج رسوم متحركة ديناميكية وفيديوهات موشن جرافيك إبداعية تضفي حيوية وسرداً بصرياً جذاباً لقصص العلامات التجارية، وتجعل عرض المنتجات والتجارب الرقمية أكثر تشويقاً وتأثيراً." },
  { num: "07", name: "تصميم وتطوير المواقع", desc: "تصميم مواقع إلكترونية عصرية وجذابة تركز على رفع معدلات التحويل، مع إيلاء اهتمام فائق لتجربة المستخدم (UX)، وتناسق الألوان والخطوط، لضمان تصفح سلس واحترافي يعكس جودة خدماتك." },
  { num: "08", name: "التصميم بالذكاء الاصطناعي", desc: "توظيف أحدث تقنيات وأدوات الذكاء الاصطناعي لتوليد أفكار وتصاميم فريدة ومبتكرة، مما يتيح استكشاف آفاق إبداعية غير مسبوقة وتسريع عملية الإنتاج البصري بدقة عالية." },
  { num: "09", name: "الحملات الإعلانية الرقمية", desc: "تخطيط وتنفيذ حملات إعلانية ممولة وموجهة بدقة عبر مختلف المنصات الرقمية، مصممة خصيصاً لاستهداف جمهورك المثالي، زيادة المبيعات، وتحقيق أعلى عائد على الاستثمار (ROI)." }
];

const renderServiceIcon = (num: string, customIconName?: string) => {
  const defaultIconNames: Record<string, string> = {
    "01": "Megaphone",
    "02": "Box",
    "03": "Sparkles",
    "04": "Award",
    "05": "Share2",
    "06": "Video",
    "07": "Globe",
    "08": "Brain",
    "09": "Target"
  };
  const iconName = customIconName || defaultIconNames[num] || "Sparkles";
  const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Sparkles;
  return <IconComponent className="w-6 h-6" />;
};

interface CardTheme {
  bgColor: string;
  glowColor: string;
  cardBg: string;
  activeCardBg: string;
  borderColor: string;
  activeBorderColor: string;
  accentColor: string;
}

const cardThemes: CardTheme[] = [
  {
    // Card 01: Royal Violet
    bgColor: "#1D1031",
    glowColor: "rgba(139, 92, 246, 0.45)",
    cardBg: "from-[#2B154B]/95 via-[#1E0D3A]/98 to-[#15072B]/98",
    activeCardBg: "from-[#3A1C63]/98 via-[#28114A]/98 to-[#1C0A38]/98",
    borderColor: "border-[#8B5CF6]/30",
    activeBorderColor: "border-[#8B5CF6]",
    accentColor: "#8B5CF6"
  },
  {
    // Card 02: Midnight Amethyst
    bgColor: "#1D1031",
    glowColor: "rgba(168, 85, 247, 0.45)",
    cardBg: "from-[#230C3F]/95 via-[#18072D]/98 to-[#100320]/98",
    activeCardBg: "from-[#311257]/98 via-[#220B3F]/98 to-[#17052C]/98",
    borderColor: "border-[#A855F7]/30",
    activeBorderColor: "border-[#A855F7]",
    accentColor: "#A855F7"
  },
  {
    // Card 03: Magenta Plum
    bgColor: "#1D1031",
    glowColor: "rgba(192, 132, 252, 0.45)",
    cardBg: "from-[#33114B]/95 via-[#230936]/98 to-[#170527]/98",
    activeCardBg: "from-[#451765]/98 via-[#2E0C47]/98 to-[#1E0732]/98",
    borderColor: "border-[#C084FC]/30",
    activeBorderColor: "border-[#C084FC]",
    accentColor: "#C084FC"
  },
  {
    // Card 04: Dark Amethyst
    bgColor: "#1D1031",
    glowColor: "rgba(147, 51, 234, 0.45)",
    cardBg: "from-[#260C3B]/95 via-[#190729]/98 to-[#11031F]/98",
    activeCardBg: "from-[#371154]/98 via-[#240A3C]/98 to-[#18042B]/98",
    borderColor: "border-[#9333EA]/30",
    activeBorderColor: "border-[#9333EA]",
    accentColor: "#9333EA"
  },
  {
    // Card 05: Midnight Indigo Purple
    bgColor: "#1D1031",
    glowColor: "rgba(126, 34, 206, 0.45)",
    cardBg: "from-[#1C0C34]/95 via-[#120624]/98 to-[#0D031A]/98",
    activeCardBg: "from-[#2A124B]/98 via-[#1C0936]/98 to-[#130426]/98",
    borderColor: "border-[#7E22CE]/30",
    activeBorderColor: "border-[#7E22CE]",
    accentColor: "#7E22CE"
  },
  {
    // Card 06: Electric Radiant Purple
    bgColor: "#1D1031",
    glowColor: "rgba(163, 89, 255, 0.5)",
    cardBg: "from-[#36114F]/95 via-[#25093A]/98 to-[#1A052A]/98",
    activeCardBg: "from-[#4A186B]/98 via-[#310C4E]/98 to-[#220638]/98",
    borderColor: "border-[#A359FF]/30",
    activeBorderColor: "border-[#A359FF]",
    accentColor: "#A359FF"
  },
  {
    // Card 07: Velvet Dark Violet
    bgColor: "#1D1031",
    glowColor: "rgba(139, 92, 246, 0.45)",
    cardBg: "from-[#230A34]/95 via-[#170624]/98 to-[#10031A]/98",
    activeCardBg: "from-[#320F4B]/98 via-[#210935]/98 to-[#160426]/98",
    borderColor: "border-[#8B5CF6]/30",
    activeBorderColor: "border-[#8B5CF6]",
    accentColor: "#8B5CF6"
  },
  {
    // Card 08: Cosmic Orchid Night
    bgColor: "#1D1031",
    glowColor: "rgba(216, 180, 254, 0.45)",
    cardBg: "from-[#2B0C42]/95 via-[#1C072E]/98 to-[#140421]/98",
    activeCardBg: "from-[#3D115C]/98 via-[#27093D]/98 to-[#1B042C]/98",
    borderColor: "border-[#D8B4FE]/30",
    activeBorderColor: "border-[#D8B4FE]",
    accentColor: "#D8B4FE"
  },
  {
    // Card 09: Imperial Purple & Gold
    bgColor: "#1D1031",
    glowColor: "rgba(247, 148, 29, 0.5)",
    cardBg: "from-[#37114A]/95 via-[#250835]/98 to-[#1A0525]/98",
    activeCardBg: "from-[#4B1763]/98 via-[#320B4B]/98 to-[#230635]/98",
    borderColor: "border-[#F7941D]/40",
    activeBorderColor: "border-[#F7941D]",
    accentColor: "#F7941D"
  }
];

interface ServiceStickyCardProps {
  scrollYProgress: any;
  index: number;
  total: number;
  service: Service;
  effectiveIndex: number;
  onHover: (idx: number | null) => void;
  key?: string;
}

const ServiceStickyCard = ({ scrollYProgress, index, total, service, effectiveIndex, onHover }: ServiceStickyCardProps) => {
  const { t, dir } = useLanguage();
  const isLast = index === total - 1;
  const customIconName = t(`services.${service.num}.icon`);
  const cardTheme = cardThemes[index] || cardThemes[0];
  const isCardActive = index === effectiveIndex;

  // Cards scroll range: 0.16 -> 0.96
  const cardsStart = 0.16;
  const cardsEnd = 0.96;
  const step = (cardsEnd - cardsStart) / Math.max(1, total - 1);
  const center = cardsStart + index * step;

  // 7-Point Keyframe Range with Hold Plateau for Pinned Card Snap
  const p0 = Math.max(0, center - 1.2 * step);
  const p1 = Math.max(0, center - 0.45 * step);
  const p2 = Math.max(0, center - 0.18 * step); // Start of center hold
  const p3 = center;                            // Active center
  const p4 = Math.min(1, center + 0.18 * step); // End of center hold
  const p5 = Math.min(1, center + 0.45 * step);
  const p6 = Math.min(1, center + 1.2 * step);

  const range = [p0, p1, p2, p3, p4, p5, p6];

  // Synchronized Scroll Transforms with Hold Plateau
  const x = useTransform(
    scrollYProgress, 
    range, 
    dir === 'rtl' 
      ? ["-140%", "-70%", "0%", "0%", "0%", "70%", "140%"] 
      : ["140%", "70%", "0%", "0%", "0%", "-70%", "-140%"]
  );
  const y = useTransform(scrollYProgress, range, ["50px", "15px", "0px", "0px", "0px", "-15px", "-50px"]);
  const opacity = useTransform(scrollYProgress, range, [0, 0.75, 1, 1, 1, 0.75, 0]);
  const scale = useTransform(scrollYProgress, range, [0.72, 0.88, 1.04, 1.04, 1.04, 0.88, 0.72]);
  const rotate = useTransform(
    scrollYProgress, 
    range, 
    dir === 'rtl' 
      ? [-6, -2, 0, 0, 0, 2, 6] 
      : [6, 2, 0, 0, 0, -2, -6]
  );

  // Numeric blur value dynamically transformed
  const blurValue = useTransform(scrollYProgress, range, [12, 3, 0, 0, 0, 3, 12]);
  const filter = useTransform(blurValue, (v) => (typeof window !== 'undefined' && window.innerWidth < 640) ? 'none' : `blur(${v}px)`);

  return (
    <motion.div
      onMouseEnter={() => onHover(index)}
      onMouseLeave={() => onHover(null)}
      style={{
        opacity,
        x,
        y,
        scale,
        rotate,
        filter,
        zIndex: total - index,
        boxShadow: isCardActive
          ? `0 25px 50px rgba(0,0,0,0.7)`
          : `0 15px 35px rgba(0,0,0,0.4)`
      }}
      className={`absolute group w-full max-w-[88vw] sm:max-w-[340px] md:max-w-[380px] lg:max-w-[400px] xl:max-w-[420px] min-h-[300px] sm:min-h-[340px] md:min-h-[360px] rounded-[28px] sm:rounded-[32px] p-5 sm:p-6 md:p-7 flex flex-col justify-between ${dir === 'rtl' ? 'text-right' : 'text-left'} select-none transition-all duration-300 ease-out backdrop-blur-2xl bg-gradient-to-br ${
        isCardActive ? cardTheme.activeCardBg : cardTheme.cardBg
      } border-2 ${
        isCardActive ? cardTheme.activeBorderColor : cardTheme.borderColor
      } ${
        isLast 
          ? "border-[#F7941D]/60 hover:border-[#F7941D]" 
          : ""
      }`}
    >
      {/* Card Content Spring & Hover Physics */}
      <motion.div 
        className="w-full h-full flex flex-col justify-between flex-grow relative z-10"
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 350, damping: 22 }}
      >
        <div>
          {/* Top Header Row */}
          <div className="w-full flex items-center justify-between border-b border-white/10 pb-3 mb-4 sm:pb-4 sm:mb-6">
            {/* Left: Giant translucent index number */}
            <span 
              className="font-black text-4xl sm:text-5xl md:text-6xl font-mono leading-none tracking-tighter select-none transition-colors duration-500"
              style={{
                color: isCardActive ? cardTheme.accentColor : '#F7941D',
                opacity: isCardActive ? 0.75 : 0.3
              }}
            >
              {service.num}
            </span>
            
            {/* Right: Premium Glowing Icon */}
            <div 
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-500"
              style={{
                backgroundColor: `${cardTheme.accentColor}25`,
                border: `1px solid ${cardTheme.accentColor}70`,
                color: cardTheme.accentColor,
                boxShadow: `0 0 25px ${cardTheme.glowColor}`
              }}
            >
              {renderServiceIcon(service.num, customIconName)}
            </div>
          </div>

          {/* Service Info Content */}
          <div className="flex-grow">
            <h3 
              className="font-extrabold text-lg sm:text-xl md:text-2xl mb-2 sm:mb-3 leading-snug tracking-wide transition-colors duration-500"
              style={{
                color: isCardActive ? '#FFFFFF' : '#F3E8FF'
              }}
            >
              {t(`services.${service.num}.name`)}
            </h3>
            <p className="text-gray-300/90 font-light leading-relaxed text-xs sm:text-sm md:text-[15px]">
              {t(`services.${service.num}.desc`)}
            </p>
          </div>
        </div>

        {/* Bottom Interactive Decorative Badge or CTA for the last card */}
        {isLast ? (
          <div className="mt-4 pt-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                const element = document.getElementById('projects');
                if (element) {
                  const lenis = (window as any).lenis;
                  if (lenis) {
                    lenis.scrollTo(element, { duration: 1.2, offset: -40 });
                  } else {
                    element.scrollIntoView({ behavior: 'smooth' });
                  }
                }
              }}
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#F7941D] to-[#A359FF] hover:from-[#A359FF] hover:to-[#F7941D] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer select-none"
            >
              <span>{t('services.browseProjects')}</span>
              <motion.span
                animate={{ y: [0, 4, 0] }}
                transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                className="text-sm font-bold"
              >
                ↓
              </motion.span>
            </button>
          </div>
        ) : (
          <div className="mt-4 pt-3 sm:mt-6 sm:pt-4 border-t border-white/5 flex items-center justify-between text-[10px] sm:text-xs font-medium">
            <div className="flex items-center gap-2">
              <span 
                className="w-2 h-2 rounded-full animate-pulse" 
                style={{ backgroundColor: cardTheme.accentColor }}
              />
              <span className="text-white/50 group-hover:text-white/80 transition-colors duration-300">{t('services.fullRange')}</span>
            </div>
            <span 
              className="transition-colors duration-300 font-bold"
              style={{ color: cardTheme.accentColor }}
            >
              {t('services.unlimited')}
            </span>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
};

export default function ServicesPinnedSection() {
  const { t, dir } = useLanguage();
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const effectiveIndex = hoveredIndex !== null ? hoveredIndex : activeIndex;
  const currentTheme = cardThemes[effectiveIndex] || cardThemes[0];

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Precision Spring Interpolation: Synchronizes perfectly with slow and fast scrolling
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 110,
    damping: 24,
    restDelta: 0.0001
  });

  // Section Title Text Reveal -> Hold -> Ascend UP & Fade Exit before cards appear
  const titleClip = useTransform(
    smoothProgress, 
    [0.0, 0.06], 
    dir === 'rtl' 
      ? ["inset(-20px -30px -20px 100%)", "inset(-20px -30px -20px -30px)"] 
      : ["inset(-20px 100% -20px -30px)", "inset(-20px -30px -20px -30px)"]
  );
  const titleOpacity = useTransform(smoothProgress, [0.0, 0.06, 0.09, 0.15], [1, 1, 1, 0]);
  const titleY = useTransform(smoothProgress, [0.0, 0.06, 0.09, 0.15], ["0px", "0px", "-40px", "-300px"]);
  const titleScale = useTransform(smoothProgress, [0.0, 0.06, 0.09, 0.15], [1, 1, 1, 0.92]);

  // Pointer events disabled when title opacity is low
  const titlePointerEvents = useTransform(titleOpacity, (o) => ((o as number) > 0.05 ? 'auto' : 'none'));

  // Keep track of active card index based on smoothProgress (from 0.16 to 0.96)
  useMotionValueEvent(smoothProgress, "change", (latest: any) => {
    const cardsStart = 0.16;
    const cardsEnd = 0.96;
    const cardsProgress = Math.min(1, Math.max(0, ((latest as number) - cardsStart) / (cardsEnd - cardsStart)));
    const currentIdx = Math.min(
      Math.floor(cardsProgress * services.length),
      services.length - 1
    );
    if (currentIdx !== activeIndex) {
      setActiveIndex(currentIdx);
    }
  });

  return (
    <div 
      ref={containerRef} 
      id="services" 
      dir={dir}
      style={{
        backgroundColor: currentTheme.bgColor,
        backgroundImage: `radial-gradient(circle at 50% 30%, ${currentTheme.accentColor}30, transparent 70%), radial-gradient(circle at 20% 80%, ${currentTheme.glowColor}, transparent 65%)`,
        transition: 'background-color 0.8s cubic-bezier(0.16, 1, 0.3, 1), background-image 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
      className={`relative min-h-[450vh] sm:min-h-[550vh] md:min-h-[750vh] lg:min-h-[850vh] ${dir === 'rtl' ? 'text-right' : 'text-left'}`}
    >
      {/* Bottom transition gradient to Projects section for flawless color merging */}
      <div className="absolute bottom-0 left-0 w-full h-[40vh] bg-gradient-to-t from-[#1D1031] via-[#1D1031]/60 to-transparent pointer-events-none z-10" />

      {/* Sticky viewport frame with premium spring lift/entrance animation */}
      <motion.div 
        initial={{ opacity: 0, y: 150, scale: 0.93 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-10%" }}
        transition={{ 
          type: "spring", 
          stiffness: 65, 
          damping: 14,
          mass: 1.1
        }}
        className="sticky top-0 h-screen w-full flex flex-col justify-between overflow-hidden py-4 sm:py-6 md:py-8 px-4 sm:px-8 md:px-12 lg:px-16 z-20"
      >
        {/* Animated Section Header (Centered vertically in viewport on section entry) */}
        <motion.div 
          style={{
            y: titleY,
            scale: titleScale,
            opacity: titleOpacity,
            pointerEvents: titlePointerEvents
          }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center z-30 max-w-4xl px-4 flex flex-col items-center justify-center select-none py-2"
        >
          <EditableText textKey="services.subtitle" fallbackText="خدماتنا الإبداعية">
            <span 
              className="text-xs sm:text-sm font-bold uppercase tracking-widest px-4 py-2 rounded-full mb-3 inline-block transition-colors duration-500 shadow-md"
              style={{
                color: currentTheme.accentColor,
                backgroundColor: `${currentTheme.accentColor}20`,
                border: `1px solid ${currentTheme.accentColor}50`
              }}
            >
              {t('services.subtitle')}
            </span>
          </EditableText>
          
          <div className="relative w-full text-center mt-1 px-2 py-2 overflow-visible">
            <EditableText textKey="services.title" fallbackText="ما نقدمه لعلامتك التجارية" className="w-full">
              <motion.h2 
                style={{ clipPath: titleClip }}
                className="text-transparent bg-clip-text bg-gradient-to-r from-white via-[#F7941D] via-[#A359FF] to-[#F7941D] font-black uppercase text-3xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight sm:leading-snug select-none py-3 px-2 text-center w-full overflow-visible"
              >
                {t('services.title')}
              </motion.h2>
            </EditableText>
          </div>
        </motion.div>

        {/* Dynamic Card Presenter Area */}
        <div className="flex-grow flex items-center justify-center relative w-full h-full max-w-5xl mx-auto min-h-[300px] sm:min-h-[350px] translate-y-2 sm:translate-y-4">
          <div className="relative w-full flex items-center justify-center h-[310px] sm:h-[350px] md:h-[370px]">
            {services.map((service, idx) => (
              <ServiceStickyCard
                key={service.num}
                scrollYProgress={smoothProgress}
                index={idx}
                total={services.length}
                service={service}
                effectiveIndex={effectiveIndex}
                onHover={setHoveredIndex}
              />
            ))}
          </div>
        </div>

        {/* Bottom Progress Controls & Indicator */}
        <div className="w-full flex flex-col items-center gap-4 relative z-10 max-w-xl mx-auto">
          {/* Active number status pill */}
          <div 
            className="text-white bg-[#1D1031]/90 border px-4.5 py-2 rounded-full text-xs font-mono font-bold flex items-center gap-2.5 shadow-xl transition-colors duration-500 backdrop-blur-md"
            style={{ borderColor: `${currentTheme.accentColor}60` }}
          >
            <Sparkles size={13} style={{ color: currentTheme.accentColor }} />
            <span style={{ color: currentTheme.accentColor }}>{(effectiveIndex + 1).toString().padStart(2, '0')}</span>
            <span className="text-white/40">/</span>
            <span className="text-white/60">{services.length.toString().padStart(2, '0')}</span>
          </div>

          {/* Dots Indicator */}
          <div className="flex gap-2.5">
            {services.map((_, idx) => (
              <div 
                key={idx}
                onClick={() => {
                  const lenis = (window as any).lenis;
                  if (lenis && containerRef.current) {
                    const rect = containerRef.current.getBoundingClientRect();
                    const containerTop = window.scrollY + rect.top;
                    const scrollHeight = rect.height;
                    const cardsEnd = 0.94;
                    const targetProgress = 0.16 + (idx / (services.length - 1)) * (cardsEnd - 0.16);
                    const targetScroll = containerTop + targetProgress * (scrollHeight - window.innerHeight);
                    lenis.scrollTo(targetScroll, { duration: 1.5 });
                  }
                }}
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
                style={{
                  backgroundColor: effectiveIndex === idx ? cardThemes[idx].accentColor : undefined
                }}
                className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${
                  effectiveIndex === idx 
                    ? 'w-8 shadow-lg' 
                    : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
              />
            ))}
          </div>
        </div>

      </motion.div>
    </div>
  );
}


