import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, useMotionValueEvent } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

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
  // Dynamically resolve component
  const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Sparkles;
  return <IconComponent className="w-6 h-6" />;
};

interface ServiceStickyCardProps {
  scrollYProgress: any;
  index: number;
  total: number;
  service: Service;
  key?: string;
}

const ServiceStickyCard = ({ scrollYProgress, index, total, service }: ServiceStickyCardProps) => {
  const { t, dir } = useLanguage();
  const isLast = index === total - 1;
  const customIconName = t(`services.${service.num}.icon`);

  // Title takes up 0.18, cards take up 0.18 -> 0.92
  const cardsEnd = 0.92;
  const step = (cardsEnd - 0.18) / (total - 1);
  const center = 0.18 + index * step;

  const p0 = Math.max(0, Math.min(1, center - 2 * step));
  const p1 = Math.max(0, Math.min(1, center - step));
  const p2 = Math.max(0, Math.min(1, center));
  const p3 = Math.max(0, Math.min(1, center + step));
  const p4 = Math.max(0, Math.min(1, center + 2 * step));

  const range = [p0, p1, p2, p3, p4];

  // Responsive percentages and vertical displacement for elegant scroll-triggered reveal
  const x = useTransform(
    scrollYProgress, 
    range, 
    dir === 'rtl' 
      ? ["-140%", "-85%", "0%", "85%", "140%"] 
      : ["140%", "85%", "0%", "-85%", "-140%"]
  );
  const y = useTransform(scrollYProgress, range, ["100px", "40px", "0px", "-40px", "-100px"]);
  const opacity = useTransform(scrollYProgress, range, [0, 0.4, 1, 0.4, 0]);
  const scale = useTransform(scrollYProgress, range, [0.72, 0.85, 1, 0.85, 0.72]);
  const rotate = useTransform(
    scrollYProgress, 
    range, 
    dir === 'rtl' 
      ? [-6, -3, 0, 3, 6] 
      : [6, 3, 0, -3, -6]
  );

  // Numeric blur value dynamically transformed to CSS filter string (disabled on mobile for GPU optimization)
  const blurValue = useTransform(scrollYProgress, range, [10, 3, 0, 3, 10]);
  const filter = useTransform(blurValue, (v) => (typeof window !== 'undefined' && window.innerWidth < 640) ? 'none' : `blur(${v}px)`);

  return (
    <motion.div
      style={{
        opacity,
        x,
        y,
        scale,
        rotate,
        filter,
        zIndex: total - index,
      }}
      className={`absolute group w-full max-w-[85vw] sm:max-w-[340px] md:max-w-[370px] lg:max-w-[390px] xl:max-w-[420px] min-h-[340px] sm:min-h-[400px] md:min-h-[400px] rounded-[32px] p-5 sm:p-7 md:p-8 flex flex-col justify-between ${dir === 'rtl' ? 'text-right' : 'text-left'} select-none transition-all duration-500 ease-out backdrop-blur-md ${
        isLast 
          ? "bg-gradient-to-br from-[#271542]/98 to-[#130824]/98 border-2 border-[#F7941D]/40 hover:border-[#F7941D] shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_35px_rgba(247,148,29,0.1)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.7),0_0_45px_rgba(247,148,29,0.2)]" 
          : "bg-gradient-to-br from-[#1F1135]/98 to-[#130922]/98 border border-[#F7941D]/20 hover:border-[#F7941D]/80 shadow-[0_20px_50px_rgba(0,0,0,0.5),0_0_30px_rgba(247,148,29,0.03)] hover:shadow-[0_25px_60px_rgba(0,0,0,0.6),0_0_40px_rgba(247,148,29,0.12)]"
      }`}
    >
      {/* Glow Hover Backlight Effect */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_120%,rgba(247,148,29,0.08),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-[32px] pointer-events-none" />

      {/* Card Content Spring Effect */}
      <motion.div 
        className="w-full h-full flex flex-col justify-between flex-grow relative z-10"
        whileHover={{ y: -6 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
      >
        <div>
          {/* Top Header Row */}
          <div className="w-full flex items-center justify-between border-b border-[#F7941D]/10 pb-3 mb-4 sm:pb-4 sm:mb-6">
            {/* Left: Giant translucent index number */}
            <span className="text-[#F7941D]/15 group-hover:text-[#F7941D]/30 font-black text-4xl sm:text-5xl md:text-6xl font-mono leading-none tracking-tighter select-none transition-colors duration-500">
              {service.num}
            </span>
            
            {/* Right: Premium Glowing Icon */}
            <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shadow-[0_0_15px_rgba(247,148,29,0.1)] group-hover:shadow-[0_0_20px_rgba(247,148,29,0.25)] group-hover:scale-110 transition-all duration-500 ${
              isLast 
                ? "bg-gradient-to-tr from-[#F7941D]/25 to-[#A359FF]/25 border border-[#F7941D]/40 text-[#F7941D]" 
                : "bg-gradient-to-tr from-[#F7941D]/10 to-[#F7941D]/20 border border-[#F7941D]/30 text-[#F7941D]"
            }`}>
              {renderServiceIcon(service.num, customIconName)}
            </div>
          </div>

          {/* Service Info Content */}
          <div className="flex-grow">
            <h3 className="text-white group-hover:text-[#F7941D] font-extrabold text-lg sm:text-xl md:text-2xl mb-2 sm:mb-3 leading-snug tracking-wide transition-colors duration-500">
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
              className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-[#F7941D] to-[#A359FF] hover:from-[#A359FF] hover:to-[#F7941D] text-white font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(247,148,29,0.25)] hover:shadow-[0_4px_25px_rgba(163,89,255,0.35)] hover:scale-[1.03] active:scale-[0.98] transition-all duration-300 cursor-pointer select-none"
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
              <span className="w-2 h-2 rounded-full bg-[#F7941D] animate-pulse" />
              <span className="text-white/40 group-hover:text-white/60 transition-colors duration-300">{t('services.fullRange')}</span>
            </div>
            <span className="text-[#F7941D]/70 group-hover:text-[#F7941D] transition-colors duration-300 font-bold">{t('services.unlimited')}</span>
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

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"]
  });

  // Title Text Reveal & Scale Animation based on scrollYProgress
  // 1. Initial State: Centered text with slide up on exit
  // 2. Color fill/reveal: 0.0 to 0.10 (Right-to-left for RTL, Left-to-right for LTR)
  // 3. Exit (slide up and fade out): 0.10 to 0.18
  const titleClip = useTransform(
    scrollYProgress, 
    [0.0, 0.10], 
    dir === 'rtl' 
      ? ["inset(0% 0% 0% 100%)", "inset(0% 0% 0% 0%)"] 
      : ["inset(0% 100% 0% 0%)", "inset(0% 0% 0% 0%)"]
  );
  const titleOpacity = useTransform(scrollYProgress, [0.10, 0.18], [1, 0]);
  const titleY = useTransform(scrollYProgress, [0.0, 0.10, 0.18], ["28vh", "28vh", "-15vh"]);
  const titleScale = useTransform(scrollYProgress, [0.0, 0.10, 0.18], [1.15, 1.15, 0.85]);

  // Keep track of active card index based on scrollYProgress (from 0.18 to 0.92)
  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    const titleOffset = 0.18;
    const cardsEnd = 0.92;
    const cardsProgress = Math.min(1, Math.max(0, latest - titleOffset) / (cardsEnd - titleOffset));
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
      className={`relative min-h-[280vh] md:min-h-[600vh] bg-[#331B5A] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] ${dir === 'rtl' ? 'text-right' : 'text-left'}`}
    >
      {/* Bottom transition gradient to Projects section for flawless color merging */}
      <div className="absolute bottom-0 left-0 w-full h-[40vh] bg-gradient-to-t from-[#2A1E40] via-[#2D1B4D]/60 to-transparent pointer-events-none z-10" />

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
        className="sticky top-0 h-screen w-full flex flex-col justify-between overflow-hidden py-8 sm:py-12 md:py-16 px-6 sm:px-12 md:px-16 lg:px-20 z-20"
      >
        
        {/* Ambient background blur */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#F7941D]/10 rounded-full blur-[140px] pointer-events-none" />

        {/* Animated Section Header */}
        <motion.div 
          style={{
            y: titleY,
            scale: titleScale,
            opacity: titleOpacity,
          }}
          className="w-full text-center relative z-10 max-w-3xl mx-auto flex flex-col items-center justify-center select-none"
        >
          <span className="text-[#F7941D] text-xs sm:text-sm font-bold uppercase tracking-widest bg-[#F7941D]/10 px-4 py-2 rounded-full mb-4 inline-block">
            {t('services.subtitle')}
          </span>
          
          <div className="relative inline-block mt-2">
            {/* Background Base Text (Dimmed / Unrevealed state) */}
            <h2 className="text-white/20 font-black uppercase text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-none drop-shadow-md select-none">
              {t('services.title')}
            </h2>
            
            {/* Foreground Fill Text (Revealed Brand Gradient state) */}
            <motion.h2 
              style={{ clipPath: titleClip }}
              className="absolute top-0 left-0 w-full h-full text-transparent bg-clip-text bg-gradient-to-r from-[#F7941D] via-[#A359FF] to-[#F7941D] font-black uppercase text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-none drop-shadow-md select-none whitespace-nowrap"
            >
              {t('services.title')}
            </motion.h2>
          </div>
        </motion.div>

        {/* Dynamic Card Presenter Area */}
        <div className="flex-grow flex items-center justify-center relative w-full h-full max-w-5xl mx-auto min-h-[360px] sm:min-h-[420px]">
          <div className="relative w-full flex items-center justify-center h-[350px] sm:h-[410px] md:h-[390px]">
            {services.map((service, idx) => (
              <ServiceStickyCard
                key={service.num}
                scrollYProgress={scrollYProgress}
                index={idx}
                total={services.length}
                service={service}
              />
            ))}
          </div>
        </div>

        {/* Bottom Progress Controls & Indicator */}
        <div className="w-full flex flex-col items-center gap-4 relative z-10 max-w-xl mx-auto">
          {/* Active number status pill */}
          <div className="text-white bg-[#1D1031]/80 border border-white/10 px-4 py-2 rounded-full text-xs font-mono font-bold flex items-center gap-2 shadow-lg">
            <span className="text-[#F7941D]">{(activeIndex + 1).toString().padStart(2, '0')}</span>
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
                    const cardsEnd = 0.92;
                    const targetProgress = 0.18 + (idx / (services.length - 1)) * (cardsEnd - 0.18);
                    const targetScroll = containerTop + targetProgress * (scrollHeight - window.innerHeight);
                    lenis.scrollTo(targetScroll, { duration: 1.5 });
                  }
                }}
                className={`h-2 rounded-full transition-all duration-500 cursor-pointer ${
                  activeIndex === idx 
                    ? 'w-8 bg-[#F7941D]' 
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
