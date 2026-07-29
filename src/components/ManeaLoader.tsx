import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

interface ManeaLoaderProps {
  onComplete?: () => void;
}

const letters = [
  {
    // M
    d: "M227.6,468.81c0-5.36,0.05-12.96,0.15-17.2h-0.19c-0.76,6.93-2.38,20.95-3.38,28.23h-5.96 c-0.81-7.57-2.38-21.85-3.15-28.32h-0.22c0.09,4.06,0.27,11.57,0.27,17.54v10.78h-6.38v-34.62h10.08 c0.95,6.58,2.02,15.22,2.44,19.91h0.15c0.56-5.01,1.78-12.29,2.9-19.91h10.05v34.62h-6.77v-11.03H227.6z",
    color: "#FFFFFF",
    delay: 0.6,
  },
  {
    // A
    d: "M251.14,471.6l-0.9,8.24h-7.16l5.17-34.62h10.48l5.29,34.62h-7.31l-1.01-8.24H251.14z M255.1,465.73 c-0.52-4.43-1.25-11.17-1.59-14.48h-0.28c-0.13,2.41-0.99,10.2-1.48,14.48H255.1z",
    color: "#FFFFFF",
    delay: 0.64,
  },
  {
    // N
    d: "M272.73,479.84v-34.62h7.77c1.16,4.22,4.82,19.9,5.11,21.42h0.17c-0.39-4.61-0.64-10.9-0.64-15.74v-5.69h6.52 v34.62h-7.85c-0.76-3.29-4.75-21.21-4.99-22.31h-0.19c0.27,4.08,0.49,10.96,0.49,16.4v5.91L272.73,479.84L272.73,479.84z",
    color: "#FFFFFF",
    delay: 0.68,
  },
  {
    // E
    d: "M316.55,464.55h-7.53v9.44h8.83l-0.84,5.85h-15.02v-34.62h14.97v5.89h-7.93v7.59h7.53v5.85H316.55z",
    color: "#FFFFFF",
    delay: 0.72,
  },
  {
    // A
    d: "M334.41,471.6l-0.9,8.24h-7.16l5.17-34.62H342l5.29,34.62h-7.31l-1.01-8.24H334.41z M338.37,465.73 c-0.52-4.43-1.25-11.17-1.59-14.48h-0.28c-0.13,2.41-0.99,10.2-1.48,14.48H338.37z",
    color: "#FFFFFF",
    delay: 0.76,
  },
  {
    // G
    d: "M403.83,479.84h-5.28c-0.16-0.6-0.27-1.84-0.33-2.56c-1.16,2.43-3.5,3.08-5.76,3.08 c-5.69,0-7.28-4.01-7.28-9.67V454.4c0-5.31,2.32-9.7,9.29-9.7c8.41,0,9.26,5.8,9.26,9.29v1.56h-7.07v-1.91 c0-1.68-0.22-3.23-2.17-3.23c-1.61,0-2.2,1.12-2.2,3.37v17.75c0,2.36,0.8,3.22,2.2,3.22c1.71,0,2.29-1.26,2.29-4.11v-4.96h-2.42 v-5.62h9.47V479.84z",
    color: "#F7941D",
    delay: 0.8,
  },
  {
    // R
    d: "M421.34,464.79v15.05h-7.02v-34.62h9.12c6.12,0,9.15,2.55,9.15,8.6v1.25c0,4.93-2.08,6.4-3.65,7.1 c2.27,1.04,3.34,2.62,3.34,7.45c0,3.34-0.05,8.4,0.25,10.22h-6.8c-0.45-1.57-0.42-6.07-0.42-10.49c0-3.89-0.47-4.56-3.15-4.56 L421.34,464.79L421.34,464.79z M421.36,459.55h0.87c2.35,0,3.3-0.7,3.3-3.92v-1.67c0-2.32-0.49-3.48-3.08-3.48h-1.1v9.07H421.36z",
    color: "#F7941D",
    delay: 0.84,
  },
  {
    // A
    d: "M449.26,471.6l-0.9,8.24h-7.16l5.17-34.62h10.48l5.29,34.62h-7.31l-1.01-8.24H449.26z M453.22,465.73 c-0.52-4.43-1.25-11.17-1.59-14.48h-0.28c-0.13,2.41-0.99,10.2-1.48,14.48H453.22z",
    color: "#F7941D",
    delay: 0.88,
  },
  {
    // P
    d: "M470.85,445.22h9.37c6.07,0,9.08,3.04,9.08,9.17v2.11c0,6.06-2.42,9.72-9.35,9.72h-2.06v13.61h-7.04 L470.85,445.22L470.85,445.22z M477.89,460.84h1.14c2.67,0,3.23-1.42,3.23-4.3v-2.39c0-2.24-0.55-3.68-2.89-3.68h-1.47v10.37 H477.89z",
    color: "#F7941D",
    delay: 0.92,
  },
  {
    // H
    d: "M497.9,445.22h7.04v13.32h4.58v-13.32h7.07v34.62h-7.07v-15.42h-4.58v15.42h-7.04L497.9,445.22L497.9,445.22z",
    color: "#F7941D",
    delay: 0.96,
  },
  {
    // I
    d: "M533.95,445.22v34.62h-7.02v-34.62H533.95z",
    color: "#F7941D",
    delay: 1.0,
  },
  {
    // C
    d: "M562.11,468.54v1.88c0,4.37-0.85,9.94-9.22,9.94c-6.19,0-8.87-3.12-8.87-9.49V453.9 c0-6.02,3.17-9.19,9.02-9.19c7.72,0,8.97,4.81,8.97,9.34v2.17h-7.07v-2.95c0-1.91-0.43-2.87-1.9-2.87c-1.45,0-1.91,0.91-1.91,2.87 v18.31c0,1.85,0.33,3.11,1.91,3.11c1.52,0,1.97-1.06,1.97-3.26v-2.88L562.11,468.54L562.11,468.54z",
    color: "#F7941D",
    delay: 1.04,
  },
  {
    // S
    d: "M577.87,469.17v2.4c0,2.28,0.6,3.33,2.2,3.33c1.62,0,2-1.57,2-3.2c0-3.27-0.65-4.21-4.38-7.17 c-4.11-3.3-6.23-5.26-6.23-10.36c0-4.95,1.73-9.5,8.65-9.5c7.35,0,8.43,4.75,8.43,8.71v1.99h-6.63v-2.07 c0-2.1-0.36-3.14-1.75-3.14c-1.3,0-1.72,1.06-1.72,3.02c0,2.08,0.4,3.11,3.42,5.35c5.37,4,7.3,6.25,7.3,11.95 c0,5.42-1.96,9.89-9.21,9.89c-6.97,0-8.96-3.98-8.96-9.11v-2.08L577.87,469.17L577.87,469.17z",
    color: "#F7941D",
    delay: 1.08,
  }
];

export default function ManeaLoader({ onComplete }: ManeaLoaderProps) {
  const { language, dir } = useLanguage();
  const [showServiceTitles, setShowServiceTitles] = useState(false);
  const [isPortalTriggered, setIsPortalTriggered] = useState(false);

  // Fast-track loader for returning sessions or initial visit optimization
  useEffect(() => {
    const isAlreadyLoaded = typeof window !== 'undefined' && sessionStorage.getItem('manea_loaded');
    
    if (isAlreadyLoaded) {
      setShowServiceTitles(true);
      setIsPortalTriggered(true);
      const quickTimeout = setTimeout(() => {
        if (onComplete) onComplete();
      }, 500);
      return () => clearTimeout(quickTimeout);
    }

    // 1. Show service titles (1000ms)
    const serviceTitlesTimeout = setTimeout(() => {
      setShowServiceTitles(true);
    }, 1000);

    // 2. Trigger portal transition at 1700ms
    const portalTimeout = setTimeout(() => {
      setIsPortalTriggered(true);
    }, 1700);

    // 3. Complete transition at 2400ms (fast & punchy entrance)
    const completeTimeout = setTimeout(() => {
      try {
        sessionStorage.setItem('manea_loaded', 'true');
      } catch (e) {
        // Ignore quota/sandbox storage exceptions
      }
      if (onComplete) onComplete();
    }, 2400);

    return () => {
      clearTimeout(serviceTitlesTimeout);
      clearTimeout(portalTimeout);
      clearTimeout(completeTimeout);
    };
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0,
        scale: 1.05,
        filter: "blur(10px)"
      }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed inset-0 z-[9999] bg-[#3A2A56] flex flex-col items-center justify-center select-none overflow-hidden"
    >
      {/* Background Ambient Cosmic Glows */}
      <motion.div 
        animate={isPortalTriggered ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="absolute top-1/4 left-1/4 w-[35vw] h-[35vw] bg-[#F7941D]/10 rounded-full blur-[100px] pointer-events-none" 
      />
      <motion.div 
        animate={isPortalTriggered ? { opacity: 0 } : { opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="absolute bottom-1/4 right-1/4 w-[35vw] h-[35vw] bg-[#A78BFA]/10 rounded-full blur-[100px] pointer-events-none" 
      />

      <div className="w-full max-w-xl px-6 sm:px-8 flex flex-col items-center gap-2 relative z-10">
        
        {/* Centered Logo Container */}
        <div className="w-[28vw] min-w-[190px] max-w-[280px] aspect-[500/255] relative flex items-center justify-center mb-4 overflow-visible">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="100 230 500 255"
            className="w-full h-full drop-shadow-[0_15px_40px_rgba(0,0,0,0.5)] overflow-visible"
          >
            {/* SVG G-Group containing everything except the expanding portal dot */}
            {/* This group implements a counter-clockwise vortex collapse into the exact center of the orange square (260.04px, 282.24px) */}
            <motion.g
              animate={isPortalTriggered ? {
                scale: 0.12,
                rotate: -135,
                opacity: 0,
                filter: "blur(12px)",
              } : {
                scale: 1,
                rotate: 0,
                opacity: 1,
                filter: "blur(0px)",
              }}
              transition={{
                duration: 1.2,
                ease: [0.86, 0, 0.07, 1],
              }}
              style={{ originX: "260.04px", originY: "282.24px" }}
            >
              {/* Right Part (starts far right) */}
              <motion.path
                d="M473.07,266.83v28.85h27.22l-22.27,24.74l-4.95,5.49l-18.49,20.54l-32.81,36.43V237.72h-34.54v194.2h37.29 l48.55-53.9l4.95-5.52l53.5,59.42h53.56V266.83H473.07z M550.23,400.61l-48.76-54.14l45.73-50.79h3.03V400.61z"
                initial={{ opacity: 0, fill: "rgba(167, 139, 250, 1)" }}
                animate={{ 
                  opacity: 1, 
                  fill: "#FFFFFF" 
                }}
                transition={{ 
                  opacity: { duration: 1.2, delay: 0, ease: "easeInOut" },
                  fill: { duration: 1.2, delay: 0, ease: "easeInOut" }
                }}
              />

              {/* Middle Part */}
              <motion.polygon
                points="331.4,266.82 297.74,266.82 297.74,295.68 331.4,295.68 331.4,393.3 297.74,355.91 283.88,340.51 260.43,314.48 236.98,340.51 221.69,357.52 186.83,396.22 179.1,404.81 160.09,425.92 155.65,430.85 154.68,431.92 125.23,464.62 113.89,477.23 160.79,477.23 179.1,456.89 186.83,448.31 201.58,431.92 202.55,430.85 221.69,409.59 260.43,366.56 297.74,408 319.28,431.92 366.24,431.92 366.24,266.82"
                initial={{ opacity: 0, fill: "rgba(167, 139, 250, 1)" }}
                animate={{ 
                  opacity: 1, 
                  fill: "#FFFFFF" 
                }}
                transition={{ 
                  opacity: { duration: 1.2, delay: 0.4, ease: "easeInOut" },
                  fill: { duration: 1.2, delay: 0.4, ease: "easeInOut" }
                }}
              />

              {/* Tiny Polygon */}
              <motion.polygon
                points="224.46,276.93 224.46,277.19 224.35,277.06"
                initial={{ opacity: 0, fill: "rgba(167, 139, 250, 1)" }}
                animate={{ 
                  opacity: 1, 
                  fill: "#FFFFFF" 
                }}
                transition={{ 
                  opacity: { duration: 0.8, delay: 0.9, ease: "easeInOut" },
                  fill: { duration: 0.8, delay: 0.9, ease: "easeInOut" }
                }}
              />

              {/* Left Part */}
              <motion.polygon
                points="218.58,266.83 218.58,329.63 181.91,368.34 181.91,295.68 153.76,295.68 153.76,383.7 160.57,390.87 165.74,396.33 166.71,397.36 153.76,411.03 142.04,423.39 141.7,423.03 135.89,416.89 117.09,397.07 117.09,266.83"
                initial={{ opacity: 0, fill: "rgba(167, 139, 250, 1)" }}
                animate={{ 
                  opacity: 1, 
                  fill: "#FFFFFF" 
                }}
                transition={{ 
                  opacity: { duration: 1.2, delay: 1.0, ease: "easeInOut" },
                  fill: { duration: 1.2, delay: 1.0, ease: "easeInOut" }
                }}
              />

              {/* English Name Group */}
              {letters.map((letter, i) => (
                <motion.path
                  key={i}
                  d={letter.d}
                  initial={{ opacity: 0, y: 3, fill: "rgba(167, 139, 250, 1)" }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    fill: letter.color
                  }}
                  transition={{
                    opacity: { duration: 0.35, delay: letter.delay },
                    y: { duration: 0.35, delay: letter.delay, ease: "easeOut" },
                    fill: { duration: 0.5, delay: letter.delay + 0.1, ease: "easeInOut" }
                  }}
                />
              ))}
            </motion.g>

            {/* The Master Orange Square / Expanding Portal Dot */}
            {/* Kept outside of the group so it does not scale down, but expands to cover the screen with a clockwise twist */}
            <motion.path
              d="M277.52,264.76v26.66c0,4.58-3.72,8.3-8.3,8.3h-26.66v-26.66c0-4.58,3.72-8.3,8.3-8.3H277.52z"
              initial={{ scale: 0, opacity: 0, fill: "rgba(167, 139, 250, 1)" }}
              animate={isPortalTriggered ? {
                scale: 260,
                rotate: 135,
                opacity: 1,
                fill: "#F7941D"
              } : { 
                scale: [1, 1.05, 1], 
                opacity: 1, 
                fill: "#F7941D" 
              }}
              transition={isPortalTriggered ? {
                scale: { duration: 1.2, ease: [0.86, 0, 0.07, 1] },
                rotate: { duration: 1.2, ease: [0.86, 0, 0.07, 1] },
                opacity: { duration: 0.3 },
                fill: { duration: 0.3 }
              } : {
                scale: { repeat: Infinity, duration: 2.0, ease: "easeInOut" },
                opacity: { duration: 0.15, delay: 0.8 },
                fill: { duration: 0.15, delay: 0.9, ease: "easeInOut" }
              }}
              style={{ originX: "260.04px", originY: "282.24px" }}
            />
          </svg>
        </div>

        {/* Minimalistic & Clean Service Titles Area Directly Under Logo */}
        <div className="w-full relative min-h-[50px] flex flex-col items-center justify-start mt-2">
          <AnimatePresence mode="wait">
            {/* Service Titles final presentation under logo */}
            {showServiceTitles && (
              <motion.div 
                key="service-titles"
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={isPortalTriggered ? { opacity: 0, y: 15, scale: 0.95, filter: "blur(6px)" } : { opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -8, scale: 0.98 }}
                transition={isPortalTriggered ? { duration: 0.6, ease: "easeIn" } : { duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="w-full flex items-center justify-center pointer-events-none mt-2"
              >
                <div 
                  className="flex flex-wrap items-center justify-center gap-3.5 sm:gap-5 text-[10px] sm:text-xs font-semibold tracking-[0.16em] sm:tracking-[0.2em] text-gray-200"
                  dir={dir}
                >
                  {/* هوية بصرية */}
                  <motion.span
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                  >
                    {language === 'ar' ? 'هوية بصرية' : 'BRAND IDENTITY'}
                  </motion.span>

                  {/* Separator 1 */}
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    transition={{ duration: 0.3, delay: 0.35 }}
                    className="text-white/30"
                  >
                    |
                  </motion.span>

                  {/* تصميم ثلاثي الأبعاد */}
                  <motion.span
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                  >
                    {language === 'ar' ? 'تصميم ثلاثي الأبعاد' : '3D CREATIVE'}
                  </motion.span>

                  {/* Separator 2 */}
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.3 }}
                    transition={{ duration: 0.3, delay: 0.7 }}
                    className="text-white/30"
                  >
                    |
                  </motion.span>

                  {/* تطوير تفاعلي */}
                  <motion.span
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.85 }}
                  >
                    {language === 'ar' ? 'تطوير تفاعلي' : 'INTERACTIVE WEB'}
                  </motion.span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </motion.div>
  );
}

