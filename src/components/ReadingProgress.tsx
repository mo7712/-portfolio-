import React, { useState } from 'react';
import { motion, AnimatePresence, useScroll, useSpring, useMotionValueEvent } from 'motion/react';
import { ArrowUp } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export default function ReadingProgress() {
  const { language, dir } = useLanguage();
  const { scrollY, scrollYProgress } = useScroll();
  const [isVisible, setIsVisible] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Smooth out the progress representation for a premium liquid feel
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 15,
    restDelta: 0.001
  });

  // Only reveal the indicator after scrolling past the hero fold (300px)
  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsVisible(latest > 300);
  });

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const percentage = Math.round(scrollYProgress.get() * 100);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className={`fixed bottom-6 sm:bottom-8 z-[90] flex items-center gap-3 ${
            dir === 'rtl' 
              ? 'left-6 sm:left-8 flex-row-reverse' 
              : 'right-6 sm:right-8 flex-row'
          }`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Subtle percentage popover tooltip on hover */}
          <AnimatePresence>
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, x: dir === 'rtl' ? 10 : -10, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: dir === 'rtl' ? 10 : -10, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className={`bg-[#3A2A56]/90 backdrop-blur-md border border-white/10 px-2.5 py-1.5 rounded-lg text-[10px] font-mono tracking-wider text-white shadow-xl flex items-center gap-1.5 ${
                  dir === 'rtl' ? 'ml-1' : 'mr-1'
                }`}
              >
                <span className="w-1.5 h-1.5 bg-[#F7941D] rounded-full animate-pulse" />
                <span>{percentage}% {language === 'ar' ? 'مقروء' : 'READ'}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Floating Action Button containing the progress circle */}
          <button
            id="reading-progress-btn"
            onClick={scrollToTop}
            className="w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-[#3A2A56]/85 backdrop-blur-md border border-white/10 flex items-center justify-center relative cursor-pointer group hover:bg-[#3A2A56] hover:border-white/20 shadow-lg hover:shadow-[0_0_20px_rgba(247,148,29,0.15)] transition-colors duration-300"
            aria-label={language === 'ar' ? 'الرجوع للأعلى' : 'Scroll to top'}
          >
            {/* SVG Progress Circle Wrapper */}
            <svg className="absolute inset-0 w-full h-full transform -rotate-90 p-1 select-none pointer-events-none">
              {/* Backing track */}
              <circle
                cx="50%"
                cy="50%"
                r="46%"
                fill="none"
                stroke="rgba(255,255,255,0.05)"
                strokeWidth="2.5"
              />
              
              {/* Animated Progress Stroke */}
              <motion.circle
                cx="50%"
                cy="50%"
                r="46%"
                fill="none"
                stroke="url(#progressCircleGrad)"
                strokeWidth="2.5"
                strokeLinecap="round"
                style={{
                  pathLength: smoothProgress
                }}
              />

              {/* Define brand gradient color scheme */}
              <defs>
                <linearGradient id="progressCircleGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#A78BFA" />
                  <stop offset="100%" stopColor="#F7941D" />
                </linearGradient>
              </defs>
            </svg>

            {/* Core Icon & Percentage Stagger */}
            <div className="relative flex items-center justify-center w-full h-full">
              <motion.div
                animate={{
                  y: isHovered ? -3 : 0,
                  scale: isHovered ? 1.1 : 1,
                  color: isHovered ? "#F7941D" : "#FFFFFF"
                }}
                transition={{ type: "spring", stiffness: 300, damping: 15 }}
                className="text-white transition-colors duration-300"
              >
                <ArrowUp className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
              </motion.div>
            </div>
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
