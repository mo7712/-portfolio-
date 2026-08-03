import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';
import { preloadImages, STATIC_CRITICAL_IMAGES, getCriticalPortfolioImages } from '../utils/preloader';

interface ManeaLoaderProps {
  onComplete?: () => void;
}

// Logo SVG English Letters with X-positions sorted for RTL staggered animation
const letters = [
  {
    // M (x ~ 227)
    d: "M227.6,468.81c0-5.36,0.05-12.96,0.15-17.2h-0.19c-0.76,6.93-2.38,20.95-3.38,28.23h-5.96 c-0.81-7.57-2.38-21.85-3.15-28.32h-0.22c0.09,4.06,0.27,11.57,0.27,17.54v10.78h-6.38v-34.62h10.08 c0.95,6.58,2.02,15.22,2.44,19.91h0.15c0.56-5.01,1.78-12.29,2.9-19.91h10.05v34.62h-6.77v-11.03H227.6z",
    rtlDelay: 0.86,
  },
  {
    // A (x ~ 251)
    d: "M251.14,471.6l-0.9,8.24h-7.16l5.17-34.62h10.48l5.29,34.62h-7.31l-1.01-8.24H251.14z M255.1,465.73 c-0.52-4.43-1.25-11.17-1.59-14.48h-0.28c-0.13,2.41-0.99,10.2-1.48,14.48H255.1z",
    rtlDelay: 0.81,
  },
  {
    // N (x ~ 272)
    d: "M272.73,479.84v-34.62h7.77c1.16,4.22,4.82,19.9,5.11,21.42h0.17c-0.39-4.61-0.64-10.9-0.64-15.74v-5.69h6.52 v34.62h-7.85c-0.76-3.29-4.75-21.21-4.99-22.31h-0.19c0.27,4.08,0.49,10.96,0.49,16.4v5.91L272.73,479.84L272.73,479.84z",
    rtlDelay: 0.76,
  },
  {
    // E (x ~ 316)
    d: "M316.55,464.55h-7.53v9.44h8.83l-0.84,5.85h-15.02v-34.62h14.97v5.89h-7.93v7.59h7.53v5.85H316.55z",
    rtlDelay: 0.68,
  },
  {
    // A (x ~ 334)
    d: "M334.41,471.6l-0.9,8.24h-7.16l5.17-34.62H342l5.29,34.62h-7.31l-1.01-8.24H334.41z M338.37,465.73 c-0.52-4.43-1.25-11.17-1.59-14.48h-0.28c-0.13,2.41-0.99,10.2-1.48,14.48H338.37z",
    rtlDelay: 0.64,
  },
  {
    // G (x ~ 403)
    d: "M403.83,479.84h-5.28c-0.16-0.6-0.27-1.84-0.33-2.56c-1.16,2.43-3.5,3.08-5.76,3.08 c-5.69,0-7.28-4.01-7.28-9.67V454.4c0-5.31,2.32-9.7,9.29-9.7c8.41,0,9.26,5.8,9.26,9.29v1.56h-7.07v-1.91 c0-1.68-0.22-3.23-2.17-3.23c-1.61,0-2.2,1.12-2.2,3.37v17.75c0,2.36,0.8,3.22,2.2,3.22c1.71,0,2.29-1.26,2.29-4.11v-4.96h-2.42 v-5.62h9.47V479.84z",
    rtlDelay: 0.51,
  },
  {
    // R (x ~ 421)
    d: "M421.34,464.79v15.05h-7.02v-34.62h9.12c6.12,0,9.15,2.55,9.15,8.6v1.25c0,4.93-2.08,6.4-3.65,7.1 c2.27,1.04,3.34,2.62,3.34,7.45c0,3.34-0.05,8.4,0.25,10.22h-6.8c-0.45-1.57-0.42-6.07-0.42-10.49c0-3.89-0.47-4.56-3.15-4.56 L421.34,464.79L421.34,464.79z M421.36,459.55h0.87c2.35,0,3.3-0.7,3.3-3.92v-1.67c0-2.32-0.49-3.48-3.08-3.48h-1.1v9.07H421.36z",
    rtlDelay: 0.47,
  },
  {
    // A (x ~ 449)
    d: "M449.26,471.6l-0.9,8.24h-7.16l5.17-34.62h10.48l5.29,34.62h-7.31l-1.01-8.24H449.26z M453.22,465.73 c-0.52-4.43-1.25-11.17-1.59-14.48h-0.28c-0.13,2.41-0.99,10.2-1.48,14.48H453.22z",
    rtlDelay: 0.41,
  },
  {
    // P (x ~ 470)
    d: "M470.85,445.22h9.37c6.07,0,9.08,3.04,9.08,9.17v2.11c0,6.06-2.42,9.72-9.35,9.72h-2.06v13.61h-7.04 L470.85,445.22L470.85,445.22z M477.89,460.84h1.14c2.67,0,3.23-1.42,3.23-4.3v-2.39c0-2.24-0.55-3.68-2.89-3.68h-1.47v10.37 H477.89z",
    rtlDelay: 0.36,
  },
  {
    // H (x ~ 497)
    d: "M497.9,445.22h7.04v13.32h4.58v-13.32h7.07v34.62h-7.07v-15.42h-4.58v15.42h-7.04L497.9,445.22L497.9,445.22z",
    rtlDelay: 0.30,
  },
  {
    // I (x ~ 533)
    d: "M533.95,445.22v34.62h-7.02v-34.62H533.95z",
    rtlDelay: 0.22,
  },
  {
    // C (x ~ 562)
    d: "M562.11,468.54v1.88c0,4.37-0.85,9.94-9.22,9.94c-6.19,0-8.87-3.12-8.87-9.49V453.9 c0-6.02,3.17-9.19,9.02-9.19c7.72,0,8.97,4.81,8.97,9.34v2.17h-7.07v-2.95c0-1.91-0.43-2.87-1.9-2.87c-1.45,0-1.91,0.91-1.91,2.87 v18.31c0,1.85,0.33,3.11,1.91,3.11c1.52,0,1.97-1.06,1.97-3.26v-2.88L562.11,468.54L562.11,468.54z",
    rtlDelay: 0.15,
  },
  {
    // S (x ~ 577)
    d: "M577.87,469.17v2.4c0,2.28,0.6,3.33,2.2,3.33c1.62,0,2-1.57,2-3.2c0-3.27-0.65-4.21-4.38-7.17 c-4.11-3.3-6.23-5.26-6.23-10.36c0-4.95,1.73-9.5,8.65-9.5c7.35,0,8.43,4.75,8.43,8.71v1.99h-6.63v-2.07 c0-2.1-0.36-3.14-1.75-3.14c-1.3,0-1.72,1.06-1.72,3.02c0,2.08,0.4,3.11,3.42,5.35c5.37,4,7.3,6.25,7.3,11.95 c0,5.42-1.96,9.89-9.21,9.89c-6.97,0-8.96-3.98-8.96-9.11v-2.08L577.87,469.17L577.87,469.17z",
    rtlDelay: 0.10,
  }
];

export default function ManeaLoader({ onComplete }: ManeaLoaderProps) {
  const { language, dir } = useLanguage();
  const [showSubtitleText, setShowSubtitleText] = useState(false);
  const [isPortalTriggered, setIsPortalTriggered] = useState(false);
  const [progressPercent, setProgressPercent] = useState(0);

  useEffect(() => {
    let isCancelled = false;
    let minTimePassed = false;
    let assetsLoaded = false;
    let portalTimer: NodeJS.Timeout | null = null;
    let rawLoadedPercent = 0;

    // Smooth visual progress bar ticker
    const progressInterval = setInterval(() => {
      if (isCancelled) return;
      setProgressPercent((prev) => {
        if (prev >= 100) return 100;
        const target = Math.max(prev, rawLoadedPercent);
        if (prev < target) return Math.min(100, prev + 5);
        if (prev < 90 && !assetsLoaded) return Math.min(90, prev + 2);
        if (assetsLoaded && prev < 100) return Math.min(100, prev + 10);
        return prev;
      });
    }, 35);

    // Section 2: Subtitle Text starts ONLY AFTER main logo reveal finishes and stabilizes (~1400ms)
    const subtitleTimer = setTimeout(() => {
      if (!isCancelled) setShowSubtitleText(true);
    }, 1400);

    // Minimum display time to allow full logo reveal + subtitle animation + stability (2900ms)
    const minTimer = setTimeout(() => {
      minTimePassed = true;
      checkFinish();
    }, 2900);

    const checkFinish = () => {
      if (isCancelled || isPortalTriggered) return;
      if (minTimePassed && assetsLoaded) {
        setProgressPercent(100);
        setIsPortalTriggered(true);
        portalTimer = setTimeout(() => {
          try {
            sessionStorage.setItem('manea_loaded', 'true');
          } catch (e) {
            // sandbox fallback
          }
          if (onComplete) onComplete();
        }, 800);
      }
    };

    // Gather critical images for preloading
    const allUrls = [
      ...STATIC_CRITICAL_IMAGES,
      ...getCriticalPortfolioImages()
    ];

    preloadImages(
      allUrls,
      (percent) => {
        if (!isCancelled) {
          rawLoadedPercent = percent;
        }
      },
      4500 // 4.5s max fallback timeout
    ).then(() => {
      if (!isCancelled) {
        rawLoadedPercent = 100;
        assetsLoaded = true;
        checkFinish();
      }
    });

    return () => {
      isCancelled = true;
      clearInterval(progressInterval);
      clearTimeout(subtitleTimer);
      clearTimeout(minTimer);
      if (portalTimer) clearTimeout(portalTimer);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        filter: "blur(6px)"
      }}
      transition={{ duration: 0.85, ease: [0.25, 1, 0.5, 1] }}
      className="fixed inset-0 h-[100dvh] w-full min-h-[100dvh] z-[9999] bg-[#180C2E] flex flex-col items-center justify-center select-none overflow-hidden will-change-[opacity,filter] transform-gpu"
    >
      {/* Background Brand Identity Glow (Deep Violet #180C2E / #1D1031 with subtle Gold/Amber #F7941D Ambient Light) */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#3A2A56]/50 via-[#1D1031]/90 to-[#180C2E] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-[#F7941D]/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-xl px-6 sm:px-8 flex flex-col items-center gap-2 relative z-10">
        
        {/* Section 1: Logo Container with preserved exact geometry & RTL Reveal */}
        <div className="w-[32vw] min-w-[210px] max-w-[310px] aspect-[500/255] relative flex items-center justify-center mb-4 overflow-visible">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="100 230 500 255"
            className="w-full h-full drop-shadow-[0_12px_30px_rgba(0,0,0,0.6)] overflow-visible"
          >
            <defs>
              {/* Crisp White Luminous Gradient for emblem & MANEA */}
              <linearGradient id="whiteLuminous" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFFFFF" />
                <stop offset="60%" stopColor="#FAFAFA" />
                <stop offset="100%" stopColor="#F0F0F0" />
              </linearGradient>

              {/* Gold/Orange Gradient for GRAPHICS */}
              <linearGradient id="goldGradientBrand" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFAD42" />
                <stop offset="50%" stopColor="#F7941D" />
                <stop offset="100%" stopColor="#E06C00" />
              </linearGradient>

              {/* Accent Dot Gradient */}
              <linearGradient id="goldGradientDot" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F7941D" />
                <stop offset="100%" stopColor="#FFC872" />
              </linearGradient>
            </defs>

            {/* SVG G-Group containing emblem & name with Micro-Jitter animation upon reveal completion */}
            <motion.g
              animate={isPortalTriggered ? {
                scale: 0.1,
                rotate: -120,
                opacity: 0,
                filter: "blur(10px)",
              } : {
                scale: 1,
                rotate: 0,
                opacity: 1,
                x: [0, 0, -2, 2, -1.5, 1.5, 0],
                y: [0, 0, 1, -1.5, 1, -0.5, 0],
                filter: "blur(0px)",
              }}
              transition={isPortalTriggered ? {
                duration: 1.1,
                ease: [0.86, 0, 0.07, 1],
              } : {
                scale: { duration: 0.8, ease: "easeOut" },
                opacity: { duration: 0.5 },
                x: { duration: 0.35, delay: 1.25, times: [0, 0.2, 0.4, 0.6, 0.75, 0.9, 1] },
                y: { duration: 0.35, delay: 1.25, times: [0, 0.2, 0.4, 0.6, 0.75, 0.9, 1] },
              }}
              className="will-change-[transform,opacity] transform-gpu"
              style={{ originX: "260.04px", originY: "282.24px" }}
            >
              {/* 1. Right Emblem Part (Starts Far Right - Pure White) */}
              <motion.path
                d="M473.07,266.83v28.85h27.22l-22.27,24.74l-4.95,5.49l-18.49,20.54l-32.81,36.43V237.72h-34.54v194.2h37.29 l48.55-53.9l4.95-5.52l53.5,59.42h53.56V266.83H473.07z M550.23,400.61l-48.76-54.14l45.73-50.79h3.03V400.61z"
                initial={{ opacity: 0, x: 12, fill: "#FFFFFF" }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  fill: "#FFFFFF" 
                }}
                transition={{ 
                  opacity: { duration: 0.6, delay: 0.2, ease: "easeOut" },
                  x: { duration: 0.6, delay: 0.2, ease: "easeOut" }
                }}
                className="will-change-[transform,opacity]"
              />

              {/* 2. Middle Emblem Part (Pure White) */}
              <motion.polygon
                points="331.4,266.82 297.74,266.82 297.74,295.68 331.4,295.68 331.4,393.3 297.74,355.91 283.88,340.51 260.43,314.48 236.98,340.51 221.69,357.52 186.83,396.22 179.1,404.81 160.09,425.92 155.65,430.85 154.68,431.92 125.23,464.62 113.89,477.23 160.79,477.23 179.1,456.89 186.83,448.31 201.58,431.92 202.55,430.85 221.69,409.59 260.43,366.56 297.74,408 319.28,431.92 366.24,431.92 366.24,266.82"
                initial={{ opacity: 0, x: 10, fill: "#FFFFFF" }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  fill: "#FFFFFF" 
                }}
                transition={{ 
                  opacity: { duration: 0.6, delay: 0.55, ease: "easeOut" },
                  x: { duration: 0.6, delay: 0.55, ease: "easeOut" }
                }}
                className="will-change-[transform,opacity]"
              />

              {/* 3. Tiny Polygon Accent (Pure White) */}
              <motion.polygon
                points="224.46,276.93 224.46,277.19 224.35,277.06"
                initial={{ opacity: 0, fill: "#FFFFFF" }}
                animate={{ 
                  opacity: 1, 
                  fill: "#FFFFFF" 
                }}
                transition={{ 
                  opacity: { duration: 0.4, delay: 0.75, ease: "easeInOut" }
                }}
                className="will-change-[opacity]"
              />

              {/* 4. Left Emblem Part (Pure White) */}
              <motion.polygon
                points="218.58,266.83 218.58,329.63 181.91,368.34 181.91,295.68 153.76,295.68 153.76,383.7 160.57,390.87 165.74,396.33 166.71,397.36 153.76,411.03 142.04,423.39 141.7,423.03 135.89,416.89 117.09,397.07 117.09,266.83"
                initial={{ opacity: 0, x: 10, fill: "#FFFFFF" }}
                animate={{ 
                  opacity: 1, 
                  x: 0,
                  fill: "#FFFFFF" 
                }}
                transition={{ 
                  opacity: { duration: 0.6, delay: 0.88, ease: "easeOut" },
                  x: { duration: 0.6, delay: 0.88, ease: "easeOut" }
                }}
                className="will-change-[transform,opacity]"
              />

              {/* 5. English Name Letters Revealed Right-to-Left (RTL): MANEA in pure white, GRAPHICS in orange */}
              {letters.map((letter, i) => (
                <motion.path
                  key={i}
                  d={letter.d}
                  initial={{ opacity: 0, x: 8, fill: i < 5 ? "#FFFFFF" : "#F7941D" }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    fill: i < 5 ? "#FFFFFF" : "url(#goldGradientBrand)"
                  }}
                  transition={{
                    opacity: { duration: 0.4, delay: letter.rtlDelay },
                    x: { duration: 0.4, delay: letter.rtlDelay, ease: "easeOut" },
                    fill: { duration: 0.5, delay: letter.rtlDelay + 0.1, ease: "easeInOut" }
                  }}
                  className="will-change-[transform,opacity]"
                />
              ))}
            </motion.g>

            {/* Master Orange Dot / Expanding Portal Dot */}
            <motion.path
              d="M277.52,264.76v26.66c0,4.58-3.72,8.3-8.3,8.3h-26.66v-26.66c0-4.58,3.72-8.3,8.3-8.3H277.52z"
              initial={{ scale: 0, opacity: 0, fill: "url(#goldGradientDot)" }}
              animate={isPortalTriggered ? {
                scale: 260,
                rotate: 120,
                opacity: 1,
                fill: "#F7941D"
              } : { 
                scale: [1, 1.08, 1], 
                opacity: 1, 
                fill: "#F7941D" 
              }}
              transition={isPortalTriggered ? {
                scale: { duration: 1.1, ease: [0.86, 0, 0.07, 1] },
                rotate: { duration: 1.1, ease: [0.86, 0, 0.07, 1] },
                opacity: { duration: 0.3 },
                fill: { duration: 0.3 }
              } : {
                scale: { repeat: Infinity, duration: 2.2, ease: "easeInOut" },
                opacity: { duration: 0.2, delay: 0.78 },
                fill: { duration: 0.2, delay: 0.78, ease: "easeInOut" }
              }}
              className="will-change-[transform,opacity] transform-gpu"
              style={{ originX: "260.04px", originY: "282.24px" }}
            />
          </svg>
        </div>

        {/* Section 2: Subtitle Text Animation Area */}
        <div className="w-full relative min-h-[50px] flex flex-col items-center justify-start mt-1">
          <AnimatePresence mode="wait">
            {showSubtitleText && (
              <motion.div 
                key="subtitle-container"
                initial={{ opacity: 0 }}
                animate={isPortalTriggered ? { opacity: 0, y: 15, filter: "blur(6px)" } : { opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={isPortalTriggered ? { duration: 0.5, ease: "easeIn" } : { duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="w-full flex items-center justify-center pointer-events-none mt-2 will-change-[transform,opacity] transform-gpu"
              >
                {/* Staggered Subtitle Text Sequence: "هوية بصرية | تصميم ثلاثي الأبعاد | تطوير تفاعلي" with 0.2s Stagger and Ease-Out-Back curve */}
                <div 
                  className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-4 text-[11px] sm:text-xs font-semibold tracking-wider text-purple-100/90"
                  dir={dir}
                >
                  {/* 1. هوية بصرية */}
                  <motion.span
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.1, ease: [0.34, 1.56, 0.64, 1] }}
                    className="bg-clip-text text-transparent bg-gradient-to-r from-purple-200 via-purple-100 to-amber-200 will-change-[transform,opacity]"
                  >
                    {language === 'ar' ? 'هوية بصرية' : 'BRAND IDENTITY'}
                  </motion.span>

                  {/* Separator 1 */}
                  <motion.span
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 0.4, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.2, ease: [0.34, 1.56, 0.64, 1] }}
                    className="text-purple-300/40 will-change-[transform,opacity]"
                  >
                    |
                  </motion.span>

                  {/* 2. تصميم ثلاثي الأبعاد (Staggered +0.2s) */}
                  <motion.span
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
                    className="bg-clip-text text-transparent bg-gradient-to-r from-purple-200 via-amber-200 to-amber-400 will-change-[transform,opacity]"
                  >
                    {language === 'ar' ? 'تصميم ثلاثي الأبعاد' : '3D CREATIVE'}
                  </motion.span>

                  {/* Separator 2 */}
                  <motion.span
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 0.4, y: 0 }}
                    transition={{ duration: 0.45, delay: 0.4, ease: [0.34, 1.56, 0.64, 1] }}
                    className="text-purple-300/40 will-change-[transform,opacity]"
                  >
                    |
                  </motion.span>

                  {/* 3. تطوير تفاعلي (Staggered +0.2s) */}
                  <motion.span
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.55, delay: 0.5, ease: [0.34, 1.56, 0.64, 1] }}
                    className="bg-clip-text text-transparent bg-gradient-to-r from-amber-300 to-amber-500 will-change-[transform,opacity]"
                  >
                    {language === 'ar' ? 'تطوير تفاعلي' : 'INTERACTIVE WEB'}
                  </motion.span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Section 3: Preloading Progress Bar & Percentage */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={isPortalTriggered ? { opacity: 0, scale: 0.9, filter: "blur(4px)" } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="w-full max-w-[220px] sm:max-w-[280px] flex flex-col items-center justify-center mt-6 gap-2 will-change-[transform,opacity] transform-gpu"
          >
            {/* Progress Bar Container */}
            <div className="w-full h-1.5 sm:h-2 rounded-full bg-purple-950/60 overflow-hidden border border-purple-500/20 p-[1px] relative shadow-inner">
              <motion.div
                className="h-full bg-gradient-to-r from-[#621D6B] via-[#F7941D] to-amber-300 rounded-full will-change-[width]"
                initial={{ width: '0%' }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ ease: "easeOut", duration: 0.3 }}
              />
            </div>

            {/* Progress Status */}
            <div className="flex items-center justify-between w-full px-1 text-[11px] sm:text-xs font-mono font-medium text-purple-200/80 tracking-wider">
              <span>{language === 'ar' ? 'جاري تجهيز التجربة...' : 'Loading Experience...'}</span>
              <span className="font-bold text-[#F7941D]">{progressPercent}%</span>
            </div>
          </motion.div>
        </div>

      </div>
    </motion.div>
  );
}


