import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence, useSpring } from 'motion/react';
import Lenis from 'lenis';
import { Instagram, Facebook, MessageCircle, Phone, Mail, MapPin, Megaphone, Box, Sparkles, Award, Share2, Video, Globe, Brain, Target, PenTool, Palette, Grid, Compass, Ruler, Layers } from 'lucide-react';
import PortfolioGallery from './components/PortfolioGallery';
import ManeaLoader from './components/ManeaLoader';
import ContactForm from './components/ContactForm';
import ServicesPinnedSection from './components/ServicesPinned';
import ReadingProgress from './components/ReadingProgress';
import AdminPanel from './components/AdminPanel';
import { useLanguage } from './context/LanguageContext';

// --- BRAND IDENTITY COMPONENTS ---

interface MonaLogoProps {
  size?: number;
  className?: string;
}

export const MonaLogo = ({ size = 240, className = "" }: MonaLogoProps) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 708.66 708.66" 
    width={size} 
    height={size} 
    className={`transition-all duration-300 ease-in-out ${className}`}
  >
    <g>
      <g>
        <g>
          <g>
            <g>
              <g>
                <g>
                  <path fill="#F7941D" d="M277.52,264.76v26.66c0,4.58-3.72,8.3-8.3,8.3h-26.66v-26.66c0-4.58,3.72-8.3,8.3-8.3H277.52z"/>
                </g>
              </g>
              <polygon fill="#FFFFFF" points="224.46,276.93 224.46,277.19 224.35,277.06 "/>
              <polygon fill="#FFFFFF" points="331.4,266.82 297.74,266.82 297.74,295.68 331.4,295.68 331.4,393.3 297.74,355.91 283.88,340.51 260.43,314.48 236.98,340.51 221.69,357.52 186.83,396.22 179.1,404.81 160.09,425.92 155.65,430.85 154.68,431.92 125.23,464.62 113.89,477.23 160.79,477.23 179.1,456.89 186.83,448.31 201.58,431.92 202.55,430.85 221.69,409.59 260.43,366.56 297.74,408 319.28,431.92 366.24,431.92 366.24,266.82 "/>
              <path fill="#FFFFFF" d="M473.07,266.83v28.85h27.22l-22.27,24.74l-4.95,5.49l-18.49,20.54l-32.81,36.43V237.72h-34.54v194.2h37.29 l48.55-53.9l4.95-5.52l53.5,59.42h53.56V266.83H473.07z M550.23,400.61l-48.76-54.14l45.73-50.79h3.03V400.61z"/>
            </g>
            <polygon fill="#FFFFFF" points="218.58,266.83 218.58,329.63 181.91,368.34 181.91,295.68 153.76,295.68 153.76,383.7 160.57,390.87 165.74,396.33 166.71,397.36 153.76,411.03 142.04,423.39 141.7,423.03 135.89,416.89 117.09,397.07 117.09,266.83 "/>
          </g>
        </g>
      </g>
      <g>
        <path fill="#FFFFFF" d="M227.6,468.81c0-5.36,0.05-12.96,0.15-17.2h-0.19c-0.76,6.93-2.38,20.95-3.38,28.23h-5.96 c-0.81-7.57-2.38-21.85-3.15-28.32h-0.22c0.09,4.06,0.27,11.57,0.27,17.54v10.78h-6.38v-34.62h10.08 c0.95,6.58,2.02,15.22,2.44,19.91h0.15c0.56-5.01,1.78-12.29,2.9-19.91h10.05v34.62h-6.77v-11.03H227.6z"/>
        <path fill="#FFFFFF" d="M251.14,471.6l-0.9,8.24h-7.16l5.17-34.62h10.48l5.29,34.62h-7.31l-1.01-8.24H251.14z M255.1,465.73 c-0.52-4.43-1.25-11.17-1.59-14.48h-0.28c-0.13,2.41-0.99,10.2-1.48,14.48H255.1z"/>
        <path fill="#FFFFFF" d="M272.73,479.84v-34.62h7.77c1.16,4.22,4.82,19.9,5.11,21.42h0.17c-0.39-4.61-0.64-10.9-0.64-15.74v-5.69h6.52 v34.62h-7.85c-0.76-3.29-4.75-21.21-4.99-22.31h-0.19c0.27,4.08,0.49,10.96,0.49,16.4v5.91L272.73,479.84L272.73,479.84z"/>
        <path fill="#FFFFFF" d="M316.55,464.55h-7.53v9.44h8.83l-0.84,5.85h-15.02v-34.62h14.97v5.89h-7.93v7.59h7.53v5.85H316.55z"/>
        <path fill="#FFFFFF" d="M334.41,471.6l-0.9,8.24h-7.16l5.17-34.62H342l5.29,34.62h-7.31l-1.01-8.24H334.41z M338.37,465.73 c-0.52-4.43-1.25-11.17-1.59-14.48h-0.28c-0.13,2.41-0.99,10.2-1.48,14.48H338.37z"/>
        <path fill="#F7941D" d="M403.83,479.84h-5.28c-0.16-0.6-0.27-1.84-0.33-2.56c-1.16,2.43-3.5,3.08-5.76,3.08 c-5.69,0-7.28-4.01-7.28-9.67V454.4c0-5.31,2.32-9.7,9.29-9.7c8.41,0,9.26,5.8,9.26,9.29v1.56h-7.07v-1.91 c0-1.68-0.22-3.23-2.17-3.23c-1.61,0-2.2,1.12-2.2,3.37v17.75c0,2.36,0.8,3.22,2.2,3.22c1.71,0,2.29-1.26,2.29-4.11v-4.96h-2.42 v-5.62h9.47V479.84z"/>
        <path fill="#F7941D" d="M421.34,464.79v15.05h-7.02v-34.62h9.12c6.12,0,9.15,2.55,9.15,8.6v1.25c0,4.93-2.08,6.4-3.65,7.1 c2.27,1.04,3.34,2.62,3.34,7.45c0,3.34-0.05,8.4,0.25,10.22h-6.8c-0.45-1.57-0.42-6.07-0.42-10.49c0-3.89-0.47-4.56-3.15-4.56 L421.34,464.79L421.34,464.79z M421.36,459.55h0.87c2.35,0,3.3-0.7,3.3-3.92v-1.67c0-2.32-0.49-3.48-3.08-3.48h-1.1v9.07H421.36z"/>
        <path fill="#F7941D" d="M449.26,471.6l-0.9,8.24h-7.16l5.17-34.62h10.48l5.29,34.62h-7.31l-1.01-8.24H449.26z M453.22,465.73 c-0.52-4.43-1.25-11.17-1.59-14.48h-0.28c-0.13,2.41-0.99,10.2-1.48,14.48H453.22z"/>
        <path fill="#F7941D" d="M470.85,445.22h9.37c6.07,0,9.08,3.04,9.08,9.17v2.11c0,6.06-2.42,9.72-9.35,9.72h-2.06v13.61h-7.04 L470.85,445.22L470.85,445.22z M477.89,460.84h1.14c2.67,0,3.23-1.42,3.23-4.3v-2.39c0-2.24-0.55-3.68-2.89-3.68h-1.47v10.37 H477.89z"/>
        <path fill="#F7941D" d="M497.9,445.22h7.04v13.32h4.58v-13.32h7.07v34.62h-7.07v-15.42h-4.58v15.42h-7.04L497.9,445.22L497.9,445.22z"/>
        <path fill="#F7941D" d="M533.95,445.22v34.62h-7.02v-34.62H533.95z"/>
        <path fill="#F7941D" d="M562.11,468.54v1.88c0,4.37-0.85,9.94-9.22,9.94c-6.19,0-8.87-3.12-8.87-9.49V453.9 c0-6.02,3.17-9.19,9.02-9.19c7.72,0,8.97,4.81,8.97,9.34v2.17h-7.07v-2.95c0-1.91-0.43-2.87-1.9-2.87c-1.45,0-1.91,0.91-1.91,2.87 v18.31c0,1.85,0.33,3.11,1.91,3.11c1.52,0,1.97-1.06,1.97-3.26v-2.88L562.11,468.54L562.11,468.54z"/>
        <path fill="#F7941D" d="M577.87,469.17v2.4c0,2.28,0.6,3.33,2.2,3.33c1.62,0,2-1.57,2-3.2c0-3.27-0.65-4.21-4.38-7.17 c-4.11-3.3-6.23-5.26-6.23-10.36c0-4.95,1.73-9.5,8.65-9.5c7.35,0,8.43,4.75,8.43,8.71v1.99h-6.63v-2.07 c0-2.1-0.36-3.14-1.75-3.14c-1.3,0-1.72,1.06-1.72,3.02c0,2.08,0.4,3.11,3.42,5.35c5.37,4,7.3,6.25,7.3,11.95 c0,5.42-1.96,9.89-9.21,9.89c-6.97,0-8.96-3.98-8.96-9.11v-2.08L577.87,469.17L577.87,469.17z"/>
      </g>
    </g>
  </svg>
);

interface ButtonProps {
  className?: string;
}

const ContactButton = ({ className = "" }: ButtonProps) => {
  const { t } = useLanguage();
  return (
    <button 
      className={`relative rounded-full px-8 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 text-xs sm:text-sm md:text-base font-medium uppercase tracking-widest text-white transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer bg-[#F7941D] hover:bg-[#ffaa3a] border-2 border-[#F7941D] hover:border-[#ffaa3a] ${className}`}
    >
      {t('hero.contactBtn')}
    </button>
  );
};

const LiveProjectButton = ({ className = "" }: ButtonProps) => {
  const { t } = useLanguage();
  return (
    <button 
      className={`rounded-full border-2 border-[#F7941D] text-[#F7941D] hover:text-white hover:bg-[#F7941D] px-8 py-3 sm:px-10 sm:py-3.5 text-sm sm:text-base font-medium uppercase tracking-widest transition-all duration-300 cursor-pointer ${className}`}
    >
      {t('portfolioGallery.viewDetails')}
    </button>
  );
};

// --- HERO WAVY BACKGROUND ---

const isVideoUrl = (url: string | undefined): boolean => {
  if (!url) return false;
  const lowercaseUrl = url.toLowerCase().trim();
  if (lowercaseUrl.startsWith('data:video/')) return true;
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.m4v'];
  return (
    videoExtensions.some(ext => lowercaseUrl.includes(ext)) ||
    lowercaseUrl.includes('youtube.com') ||
    lowercaseUrl.includes('youtu.be') ||
    lowercaseUrl.includes('vimeo.com') ||
    lowercaseUrl.includes('player.vimeo.com')
  );
};

const renderMotionMedia = (url: string, delay: number) => {
  const isVideo = isVideoUrl(url);
  const commonProps = {
    className: "w-full h-full object-cover",
    initial: { scale: 1.15, opacity: 0, y: 30 },
    whileInView: { scale: 1, opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.1 },
    transition: { duration: 0.85, delay, ease: [0.16, 1, 0.3, 1] },
    whileHover: { scale: 1.05 }
  };

  if (isVideo) {
    return (
      <motion.video
        src={url}
        autoPlay
        loop
        muted
        playsInline
        referrerPolicy="no-referrer"
        {...commonProps}
      />
    );
  }

  return (
    <motion.img
      src={url}
      alt=""
      referrerPolicy="no-referrer"
      {...commonProps}
    />
  );
};

const HeroWavyBackground = () => {
  const { t } = useLanguage();
  const videoUrl = t('hero.bgVideoUrl');

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 select-none bg-[#110724]">
      {/* Subtle looping 3D showreel video or ambient image/gif */}
      {videoUrl && (
        isVideoUrl(videoUrl) ? (
          <video
            src={videoUrl}
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-35 mix-blend-screen"
            style={{ filter: "brightness(0.85) contrast(1.1) saturate(1.15)" }}
          />
        ) : (
          <img
            src={videoUrl}
            alt=""
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover opacity-35 mix-blend-screen"
            style={{ filter: "brightness(0.85) contrast(1.1) saturate(1.15)" }}
          />
        )
      )}

      {/* Dark Purple Gradient Overlay to guarantee high text contrast and legibility */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#1D1031]/40 via-transparent to-[#1D1031]/95 z-10" />

      {/* Ambient glowing blobs with drift animations behind the video for soft depth glow */}
      <div className="absolute top-[-20%] left-[-15%] w-[70%] h-[70%] rounded-full bg-gradient-to-br from-[#4C3475]/15 to-transparent blur-[130px] animate-blob-drift" />
      <div className="absolute bottom-[-10%] right-[-15%] w-[65%] h-[65%] rounded-full bg-gradient-to-tr from-[#6C4EA2]/12 to-transparent blur-[120px] animate-blob-drift-reverse" />

      {/* SVG Waves Container on top of the video (z-20) */}
      <div className="absolute inset-0 opacity-25 select-none overflow-hidden z-20">
        {/* Layer 1: Slow Wavy Stream */}
        <svg 
          className="absolute bottom-0 left-0 w-[300%] h-[65%] min-h-[400px] animate-wave-slow origin-bottom" 
          viewBox="0 0 1440 74" 
          fill="none" 
          preserveAspectRatio="none"
        >
          <path d="M0,32 C240,70 480,0 720,32 C960,64 1200,10 1440,32 L1440,74 L0,74 Z" fill="url(#wave-grad-1)" />
          <defs>
            <linearGradient id="wave-grad-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4C3475" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#311E4E" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#1D1031" stopOpacity="0.8" />
            </linearGradient>
          </defs>
        </svg>

        {/* Layer 2: Medium Wavy Stream */}
        <svg 
          className="absolute bottom-0 left-0 w-[300%] h-[55%] min-h-[350px] animate-wave-medium origin-bottom" 
          viewBox="0 0 1440 74" 
          fill="none" 
          preserveAspectRatio="none"
        >
          <path d="M0,45 C280,10 560,60 840,30 C1120,0 1400,50 1440,45 L1440,74 L0,74 Z" fill="url(#wave-grad-2)" />
          <defs>
            <linearGradient id="wave-grad-2" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#6C4EA2" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#22133A" stopOpacity="0.9" />
            </linearGradient>
          </defs>
        </svg>

        {/* Layer 3: Fast Wavy Stream */}
        <svg 
          className="absolute bottom-0 left-0 w-[300%] h-[45%] min-h-[300px] animate-wave-fast origin-bottom" 
          viewBox="0 0 1440 74" 
          fill="none" 
          preserveAspectRatio="none"
        >
          <path d="M0,15 C180,45 360,5 540,25 C720,45 900,15 1080,25 C1260,35 1440,15 1440,15 L1440,74 L0,74 Z" fill="url(#wave-grad-3)" />
          <defs>
            <linearGradient id="wave-grad-3" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#F7941D" stopOpacity="0.08" />
              <stop offset="50%" stopColor="#553982" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#170A28" stopOpacity="0.95" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
};

// --- ANIMATION COMPONENTS ---

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  duration?: number;
  x?: number;
  y?: number;
  className?: string;
  key?: React.Key;
}

const FadeIn = ({ children, delay = 0, duration = 0.7, x = 0, y = 30, className = "" }: FadeInProps) => {
  const { dir } = useLanguage();
  const adjustedX = dir === 'rtl' ? x : -x;
  return (
    <motion.div
      initial={{ opacity: 0, x: adjustedX, y }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "50px", amount: 0 }}
      transition={{ duration, delay, ease: [0.25, 0.1, 0.25, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// --- STAGGER CONTAINER & CINEMATIC TITLE ---

interface StaggerSectionProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
}

const StaggerSection = ({ children, id, className = "" }: StaggerSectionProps) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.15,
      }
    }
  };

  return (
    <motion.section
      id={id}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
      className={className}
    >
      {children}
    </motion.section>
  );
};

const StaggerItem = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  const itemVariants = {
    hidden: { opacity: 0, y: 35 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1],
      }
    }
  };

  return (
    <motion.div variants={itemVariants} className={className}>
      {children}
    </motion.div>
  );
};

const CinematicTitle = ({ text }: { text: string; key?: string }) => {
  const words = text.split(' ');
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.15,
      },
    },
  };

  const wordVariants = {
    hidden: { 
      y: "100%", 
      opacity: 0 
    },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 1.3,
        ease: [0.16, 1, 0.3, 1], // Cinematic ultra-smooth easeOutExpo
      },
    },
  };

  return (
    <motion.h1 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="text-[clamp(2.25rem,10vw,7.5rem)] font-black uppercase tracking-tight leading-none text-center flex flex-wrap justify-center gap-x-3 sm:gap-x-4 gap-y-1 sm:gap-y-2 select-none"
    >
      {words.map((word, i) => (
        <span key={i} className="inline-block overflow-hidden py-4 px-2 -my-4 -mx-2">
          <motion.span 
            variants={wordVariants} 
            className="inline-block bg-gradient-to-b from-white via-white to-gray-400 bg-clip-text text-transparent pb-2"
          >
            {word}
          </motion.span>
        </span>
      ))}
    </motion.h1>
  );
};

interface MagnetProps {
  children: React.ReactNode;
  padding?: number;
  strength?: number;
  className?: string;
}

const Magnet = ({ children, padding = 150, strength = 3, className = "" }: MagnetProps) => {
  const [isActive, setIsActive] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const magnetRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: globalThis.MouseEvent) => {
    if (!magnetRef.current) return;
    const { left, top, width, height } = magnetRef.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    
    const distance = Math.sqrt(distanceX ** 2 + distanceY ** 2);
    
    if (distance < padding + width / 2) {
      setIsActive(true);
      setPosition({ x: distanceX / strength, y: distanceY / strength });
    } else {
      setIsActive(false);
      setPosition({ x: 0, y: 0 });
    }
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [padding, strength]);

  return (
    <div 
      ref={magnetRef} 
      className={className}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: isActive ? 'transform 0.3s ease-out' : 'transform 0.6s ease-in-out',
        willChange: 'transform'
      }}
    >
      {children}
    </div>
  );
};

interface WordProps {
  key?: React.Key;
  word: string;
  index: number;
  total: number;
  progress: any;
}

const Word = ({ word, index, total, progress }: WordProps) => {
  const start = index / total;
  const end = start + (1 / total);
  const opacity = useTransform(progress, [start, end], [0.2, 1]);

  return (
    <span className="relative inline-block ml-[0.3em]">
      <span className="invisible">{word}</span>
      <motion.span className="absolute top-0 right-0" style={{ opacity }}>
        {word}
      </motion.span>
    </span>
  );
};

interface AnimatedTextProps {
  text: string;
  className?: string;
}

const AnimatedText = ({ text, className = "" }: AnimatedTextProps) => {
  const containerRef = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start 0.8', 'end 0.2']
  });

  const words = text.split(' ');
  
  return (
    <p ref={containerRef} className={`relative flex flex-wrap justify-center ${className}`}>
      {words.map((word, i) => (
        <Word 
          key={i} 
          word={word} 
          index={i} 
          total={words.length} 
          progress={scrollYProgress} 
        />
      ))}
    </p>
  );
};

// --- SOCIAL LINK WITH TOOLTIP ---

interface SocialLinkWithTooltipProps {
  href: string;
  tooltip: string;
  icon: React.ReactNode;
}

function SocialLinkWithTooltip({ href, tooltip, icon }: SocialLinkWithTooltipProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="relative flex flex-col items-center">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        className="p-4 rounded-full bg-[#3A2A56] text-white hover:bg-[#F7941D] hover:scale-110 transition-all duration-300 shadow-lg relative z-10"
      >
        {icon}
      </a>
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute bottom-full mb-3 px-3.5 py-1.5 bg-[#1A122E] text-xs font-medium text-white rounded-lg shadow-xl border border-white/10 whitespace-nowrap z-20 pointer-events-none"
          >
            {tooltip}
            {/* Tooltip Arrow */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1A122E]" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- STAGGER ANIMATION VARIANTS ---

const servicesContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.05,
    }
  }
};

const serviceItemVariants = {
  hidden: { opacity: 0, y: 35 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
};

// --- MAIN APP COMPONENT ---
export default function App() {
  const { language, setLanguage, t, dir, translatedPortfolioItems, rawPartnerLogos } = useLanguage();
  const partnerLogos = rawPartnerLogos;
  const [scrollOffset, setScrollOffset] = useState(0);
  const [activeView, setActiveView] = useState<'home' | 'portfolio'>('home');
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Global keyboard shortcut and secret sequence "7712" typing code trigger to open Admin Panel
  useEffect(() => {
    let typedBuffer = '';
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Keep standard Ctrl + Shift + A shortcut too, just in case
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        setIsAdminOpen(true);
        return;
      }

      // 2. Ignore key inputs if the user is typing inside an input/textarea
      const target = e.target as HTMLElement;
      if (
        target && 
        (target.tagName === 'INPUT' || 
         target.tagName === 'TEXTAREA' || 
         target.isContentEditable)
      ) {
        return;
      }

      // 3. Keep track of typed number keys
      if (/^[0-9]$/.test(e.key)) {
        typedBuffer += e.key;
        // Keep only the last 4 typed digits
        if (typedBuffer.length > 4) {
          typedBuffer = typedBuffer.slice(-4);
        }
        
        // If they type 7712, open the admin login modal
        if (typedBuffer === '7712') {
          typedBuffer = '';
          setIsAdminOpen(true);
        }
      } else {
        // Reset sequence on other non-number keys (or just ignore them, but better reset)
        typedBuffer = '';
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Global scroll progress for the top window progress bar
  const { scrollYProgress: windowScrollProgress } = useScroll();
  const scaleX = useSpring(windowScrollProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001
  });
  const progressBarColor = useTransform(
    scaleX,
    [0, 0.5, 1],
    ["#F7941D", "#A359FF", "#F7941D"]
  );

  const aboutRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: aboutRef,
    offset: ["start end", "end start"]
  });

  const projectsTitleRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: projectsTitleScrollProgress } = useScroll({
    target: projectsTitleRef,
    offset: ["start 90%", "start 40%"]
  });
  const projectsTitleClip = useTransform(
    projectsTitleScrollProgress,
    [0, 1],
    dir === 'rtl'
      ? ["inset(0% 0% 0% 100%)", "inset(0% 0% 0% 0%)"]
      : ["inset(0% 100% 0% 0%)", "inset(0% 0% 0% 0%)"]
  );

  const yMoon = useTransform(scrollYProgress, [0, 1], [-80, 80]);
  const yObj2 = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const yLego = useTransform(scrollYProgress, [0, 1], [-70, 70]);
  const yGroup = useTransform(scrollYProgress, [0, 1], [90, -90]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeView]);

  // Integrated Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };

    rafId = requestAnimationFrame(raf);

    lenis.on('scroll', (e) => {
      setScrollOffset(e.scroll);
    });

    (window as any).lenis = lenis;

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, [activeView]);

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const lenis = (window as any).lenis;
    if (activeView !== 'home') {
      setActiveView('home');
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          if (lenis) {
            lenis.scrollTo(element, { offset: -80 });
          } else {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }
      }, 150);
    } else {
      const element = document.getElementById(id);
      if (element) {
        if (lenis) {
          lenis.scrollTo(element, { offset: -80 });
        } else {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    }
  };

  const marqueeGifs = [
    "https://motionsites.ai/assets/hero-space-voyage-preview-eECLH3Yc.gif",
    "https://motionsites.ai/assets/hero-codenest-preview-Cgppc2qV.gif",
    "https://motionsites.ai/assets/hero-vex-ventures-preview-BczMFIiw.gif",
    "https://motionsites.ai/assets/hero-stellar-ai-v2-preview-DjvxjG3C.gif",
    "https://motionsites.ai/assets/hero-asme-preview-B_nGDnTP.gif",
    "https://motionsites.ai/assets/hero-transform-data-preview-Cx5OU29N.gif",
    "https://motionsites.ai/assets/hero-vitara-preview-Cjz2QYyU.gif",
    "https://motionsites.ai/assets/hero-terra-preview-BFjrCr7T.gif",
    "https://motionsites.ai/assets/hero-skyelite-preview-DHaZIgUv.gif",
    "https://motionsites.ai/assets/hero-aethera-preview-DknSlcTa.gif",
    "https://motionsites.ai/assets/hero-designpro-preview-D8c5_een.gif",
    "https://motionsites.ai/assets/hero-stellar-ai-preview-D3HL6bw1.gif",
    "https://motionsites.ai/assets/hero-xportfolio-preview-D4A8maiC.gif",
    "https://motionsites.ai/assets/hero-orbit-web3-preview-BXt4OttD.gif",
    "https://motionsites.ai/assets/hero-nexora-preview-cx5HmUgo.gif",
    "https://motionsites.ai/assets/hero-evr-ventures-preview-DZxeVFEX.gif",
    "https://motionsites.ai/assets/hero-planet-orbit-preview-DWAP8Z1P.gif",
    "https://motionsites.ai/assets/hero-new-era-preview-CocuDUm9.gif",
    "https://motionsites.ai/assets/hero-wealth-preview-B70idl_u.gif",
    "https://motionsites.ai/assets/hero-luminex-preview-CxOP7ce6.gif",
    "https://motionsites.ai/assets/hero-celestia-preview-0yO3jXO8.gif"
  ];

  const row1 = [...marqueeGifs.slice(0, 11), ...marqueeGifs.slice(0, 11), ...marqueeGifs.slice(0, 11)];
  const row2 = [...marqueeGifs.slice(11), ...marqueeGifs.slice(11), ...marqueeGifs.slice(11)];

  return (
    <div dir={dir} className="min-h-screen bg-[#3A2A56] text-white font-sans overflow-x-clip selection:bg-[#F7941D] selection:text-white">
      
      <AnimatePresence mode="wait">
        {isLoading && (
          <ManeaLoader onComplete={() => setIsLoading(false)} />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: isLoading ? 0 : 1, scale: isLoading ? 0.97 : 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Global Scroll Progress Bar at the top of the window */}
        <motion.div
          className="fixed top-0 left-0 right-0 h-[3px] z-[9999] origin-left"
          style={{
            scaleX,
            backgroundColor: progressBarColor,
          }}
        />
        {activeView === 'portfolio' ? (
          <PortfolioGallery onBackToHome={() => setActiveView('home')} />
        ) : (
          <>
          {/* 1. HERO SECTION */}
          <section className="min-h-[640px] sm:min-h-[740px] md:min-h-screen md:h-screen flex flex-col overflow-x-clip relative">
            {/* Subtle animated wavy background with purple brand identity */}
            <HeroWavyBackground />

            <FadeIn delay={0} y={-20} className="fixed top-0 left-0 right-0 z-50">
              <nav className={`w-full transition-all duration-500 border-b ${
                scrollOffset > 20
                  ? 'bg-[#1D1031]/95 backdrop-blur-xl border-white/10 shadow-xl py-2 md:py-3'
                  : 'bg-transparent backdrop-blur-none border-transparent py-4 md:py-5'
              }`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 lg:px-16 flex justify-between items-center text-gray-300 font-medium tracking-wide text-xs sm:text-sm md:text-base">
                  <div 
                    onClick={() => {
                      setActiveView('home');
                      const lenis = (window as any).lenis;
                      if (lenis) {
                        lenis.scrollTo(0);
                      } else {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }
                    }} 
                    className="flex items-center gap-3 hover:opacity-90 transition-opacity duration-200 cursor-pointer"
                    title={t('nav.homeTitle')}
                  >
                    {t('nav.logoUrl') ? (
                      <img 
                        src={t('nav.logoUrl')} 
                        alt={t('nav.brandName')} 
                        referrerPolicy="no-referrer"
                        className="w-[48px] h-[48px] md:w-[56px] md:h-[56px] object-contain rounded-xl"
                        onError={(e) => {
                          // Fallback to text or hide on error
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    ) : (
                      <MonaLogo size={56} className="w-[48px] h-[48px] md:w-[56px] md:h-[56px]" />
                    )}
                    <span className="hidden sm:inline font-bold bg-gradient-to-r from-[#F7941D] to-white bg-clip-text text-transparent text-sm md:text-lg">{t('nav.brandName')}</span>
                  </div>
                  
                  <div className="flex items-center gap-2 sm:gap-4 md:gap-6 lg:gap-8">
                    <a 
                      href="#about" 
                      onClick={(e) => handleScrollTo(e, 'about')} 
                      className="hidden md:inline-block hover:text-[#F7941D] transition-colors duration-300"
                    >
                      {t('nav.about')}
                    </a>
                    <a 
                      href="#services" 
                      onClick={(e) => handleScrollTo(e, 'services')} 
                      className="hidden md:inline-block hover:text-[#F7941D] transition-colors duration-300"
                    >
                      {t('nav.services')}
                    </a>
                    <a 
                      href="#projects" 
                      onClick={(e) => handleScrollTo(e, 'projects')} 
                      className="hidden sm:inline-block hover:text-[#F7941D] transition-colors duration-300"
                    >
                      {t('nav.projects')}
                    </a>
                    <button 
                      onClick={() => setActiveView('portfolio')} 
                      className="hover:text-[#F7941D] transition-colors duration-300 cursor-pointer font-bold"
                    >
                      {t('nav.portfolio')}
                    </button>
                    <a 
                      href="#contact" 
                      onClick={(e) => handleScrollTo(e, 'contact')} 
                      className="hover:text-white transition-all duration-300 text-[#F7941D] border border-[#F7941D]/30 hover:bg-[#F7941D] hover:border-transparent px-2.5 py-1.5 sm:px-4 sm:py-2 rounded-full font-medium whitespace-nowrap text-xs sm:text-sm"
                    >
                      {t('nav.contact')}
                    </a>

                    {/* Dynamic Language Switcher with rotating globe animation */}
                    <button
                      onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
                      className="relative overflow-hidden flex items-center justify-center gap-1 px-2 py-1.5 rounded-xl border border-white/10 hover:border-[#F7941D]/40 bg-white/[0.03] hover:bg-[#F7941D]/10 text-[10px] sm:text-xs font-bold uppercase text-gray-300 hover:text-white transition-all duration-300 cursor-pointer group shadow-sm shrink-0"
                      title={language === 'ar' ? 'Switch to English' : 'التحويل إلى العربية'}
                    >
                      <Globe size={12} className="text-[#F7941D] group-hover:rotate-180 transition-transform duration-500 shrink-0" />
                      <span className="font-mono text-[9px] md:text-xs shrink-0">{language === 'ar' ? 'EN' : 'عربي'}</span>
                    </button>
                  </div>
                </div>
              </nav>
            </FadeIn>

        <div className="flex-grow flex flex-col justify-center items-center relative z-0">
          <div className="w-full text-center mt-6 sm:mt-4 md:-mt-5">
            <CinematicTitle key={language} text={t('hero.welcome')} />
          </div>
        </div>

        <div className="w-full max-w-7xl mx-auto px-6 sm:px-12 md:px-16 lg:px-20 flex justify-between items-end pb-7 sm:pb-8 md:pb-10 z-20">
          <FadeIn delay={0.35} y={20}>
            <p className="text-gray-200 font-light uppercase tracking-wide leading-snug text-[clamp(0.75rem,1.4vw,1.5rem)] max-w-[160px] sm:max-w-[220px] md:max-w-[260px]">
              {t('hero.subtitle')}
            </p>
          </FadeIn>
          <FadeIn delay={0.5} y={20}>
            <a href="#contact" onClick={(e) => handleScrollTo(e, 'contact')}>
              <ContactButton />
            </a>
          </FadeIn>
        </div>

        <FadeIn delay={0.6} y={30} className="absolute left-1/2 -translate-x-1/2 bottom-0 z-10 w-[210px] xs:w-[250px] sm:w-[340px] md:w-[420px] lg:w-[500px]">
          <Magnet>
            <motion.div
              animate={{
                y: -15,
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            >
              {(() => {
                const profileImg = t('hero.profileImage') || "https://i.ibb.co/JWtLY2cB/Rectangle-40443-81459862.png";
                if (isVideoUrl(profileImg)) {
                  return (
                    <video 
                      src={profileImg} 
                      autoPlay 
                      loop 
                      muted 
                      playsInline 
                      className="w-full h-auto object-contain drop-shadow-2xl rounded-[40px] md:rounded-[60px]"
                    />
                  );
                }
                return (
                  <img 
                    src={profileImg} 
                    alt="مانع - صانع ثلاثي الأبعاد" 
                    referrerPolicy="no-referrer"
                    className="w-full h-auto object-contain drop-shadow-2xl rounded-[40px] md:rounded-[60px]"
                  />
                );
              })()}
            </motion.div>
          </Magnet>
        </FadeIn>
      </section>

      {/* 2. MARQUEE SECTION */}
      <section className="bg-[#2A1E40] pt-24 sm:pt-32 md:pt-40 pb-10 overflow-hidden relative border-t border-[#331B5A]">
        <div 
          className="flex gap-3 mb-3"
          style={{ 
            transform: `translate3d(${(scrollOffset * 0.3 * (dir === 'rtl' ? 1 : -1)) - 200}px, 0, 0)`,
            willChange: 'transform'
          }}
        >
          {row1.map((url, i) => (
            <img key={i} src={url} alt="" referrerPolicy="no-referrer" loading="lazy" className="w-[420px] h-[270px] rounded-2xl object-cover shrink-0 border border-[#331B5A]" />
          ))}
        </div>
        <div 
          className="flex gap-3"
          style={{ 
            transform: `translate3d(${-(scrollOffset * 0.3 * (dir === 'rtl' ? 1 : -1)) - 200}px, 0, 0)`,
            willChange: 'transform'
          }}
        >
          {row2.map((url, i) => (
            <img key={i} src={url} alt="" referrerPolicy="no-referrer" loading="lazy" className="w-[420px] h-[270px] rounded-2xl object-cover shrink-0 border border-[#331B5A]" />
          ))}
        </div>
      </section>

      {/* 3. ABOUT SECTION */}
      <section id="about" ref={aboutRef} className="min-h-screen bg-[#3A2A56] relative flex flex-col items-center justify-center py-20 overflow-hidden">
        
        {/* Decorative 3D Images */}
        <FadeIn delay={0.1} x={-80} y={0} duration={0.9} className="absolute top-[4%] right-[2%] w-[60px] xs:w-[85px] sm:w-[120px] md:w-[170px] lg:w-[210px] opacity-40 sm:opacity-100">
          <motion.div style={{ y: yMoon }}>
            <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/moon_icon.11395d36.png" alt="Moon 3D" referrerPolicy="no-referrer" className="w-full h-auto drop-shadow-xl" />
          </motion.div>
        </FadeIn>
        
        <FadeIn delay={0.25} x={-80} y={0} duration={0.9} className="absolute bottom-[8%] right-[4%] w-[50px] xs:w-[75px] sm:w-[100px] md:w-[140px] lg:w-[180px] opacity-40 sm:opacity-100">
          <motion.div style={{ y: yObj2 }}>
            <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/p59_1.4659672e.png" alt="3D Object" referrerPolicy="no-referrer" className="w-full h-auto drop-shadow-xl" />
          </motion.div>
        </FadeIn>

        <FadeIn delay={0.15} x={80} y={0} duration={0.9} className="absolute top-[4%] left-[2%] w-[60px] xs:w-[85px] sm:w-[120px] md:w-[170px] lg:w-[210px] opacity-40 sm:opacity-100">
          <motion.div style={{ y: yLego }}>
            <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/lego_icon-1.703bb594.png" alt="Lego 3D" referrerPolicy="no-referrer" className="w-full h-auto drop-shadow-xl" />
          </motion.div>
        </FadeIn>

        <FadeIn delay={0.3} x={80} y={0} duration={0.9} className="absolute bottom-[8%] left-[4%] w-[65px] xs:w-[90px] sm:w-[130px] md:w-[170px] lg:w-[220px] opacity-40 sm:opacity-100">
          <motion.div style={{ y: yGroup }}>
            <img src="https://shrug-person-78902957.figma.site/_components/v2/ebb2b8f25d8e24d5f0a5ca8af4c950de81aa2fd7/Group_134-1.2e04f3ce.png" alt="3D Group" referrerPolicy="no-referrer" className="w-full h-auto drop-shadow-xl" />
          </motion.div>
        </FadeIn>

        <div className="flex flex-col items-center gap-10 sm:gap-14 md:gap-16 z-10 w-full max-w-4xl px-6 sm:px-12 md:px-16 lg:px-20">
          <FadeIn delay={0} y={40}>
            <h2 className="text-[clamp(3rem,12vw,160px)] font-black uppercase leading-none tracking-tight text-center bg-gradient-to-b from-white to-[#F7941D] bg-clip-text text-transparent">
              {t('about.title')}
            </h2>
          </FadeIn>

          <AnimatedText 
            text={t('about.text')}
            className="text-gray-200 font-medium leading-relaxed max-w-[560px] text-[clamp(1rem,2vw,1.35rem)] text-center"
          />

          <div className="mt-6 sm:mt-10">
            <a href="#contact" onClick={(e) => handleScrollTo(e, 'contact')}>
              <ContactButton />
            </a>
          </div>
        </div>
      </section>

      {/* 4. SERVICES SECTION */}
      <ServicesPinnedSection />

      {/* 5. PROJECTS SECTION */}
      <section id="projects" className="bg-[#2A1E40] rounded-t-[40px] sm:rounded-t-[50px] md:rounded-t-[60px] -mt-10 sm:-mt-12 md:-mt-14 z-30 relative py-20 pb-40">
        <div ref={projectsTitleRef} className="w-full text-center relative z-10 max-w-7xl mx-auto flex flex-col items-center justify-center select-none mb-16 px-6">
          <div className="relative inline-block">
            {/* Background Base Text (Dimmed / Unrevealed state) */}
            <h2 className="text-center font-black uppercase text-[clamp(3rem,11vw,140px)] leading-none text-white/10 select-none">
              {t('projects.title')}
            </h2>
            
            {/* Foreground Fill Text (Revealed Brand Gradient state) */}
            <motion.h2 
              style={{ clipPath: projectsTitleClip }}
              className="absolute top-0 left-0 w-full h-full text-center font-black uppercase text-[clamp(3rem,11vw,140px)] leading-none text-transparent bg-clip-text bg-gradient-to-r from-[#F7941D] via-[#A359FF] to-[#F7941D] select-none whitespace-nowrap"
            >
              {t('projects.title')}
            </motion.h2>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 sm:px-12 md:px-16 lg:px-20 relative">
          {translatedPortfolioItems.slice(0, 4).map((item, i, arr) => {
            const num = `0${i + 1}`;
            const targetScale = 1 - (arr.length - 1 - i) * 0.03;
            const galleryList = item.gallery && item.gallery.length > 0 ? item.gallery.filter(Boolean) : [];
            const img1 = galleryList[0] || item.image;
            const img2 = galleryList[1] || item.image || galleryList[0] || item.image;
            const img3 = galleryList[2] || item.image || galleryList[0] || item.image;
            return (
              <div 
                key={num} 
                className="sticky top-24 md:top-32 h-[85vh] flex items-center justify-center w-full"
                style={{ paddingTop: `${i * 28}px` }}
              >
                <motion.div 
                  className="w-full h-full bg-[#3A2A56] rounded-[40px] sm:rounded-[50px] md:rounded-[60px] border border-[#F7941D]/30 p-4 sm:p-6 md:p-8 flex flex-col shadow-2xl overflow-hidden"
                  initial={{ scale: 1 }}
                  whileInView={{ scale: targetScale }}
                  viewport={{ margin: "-100px", amount: "all" }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
                    <div className="flex items-center gap-4 sm:gap-6">
                      <span className="text-[#F7941D] font-black text-4xl sm:text-6xl md:text-8xl leading-none">{num}</span>
                      <div>
                        <span className="text-gray-300 text-sm md:text-base uppercase tracking-wider block mb-1">{item.category}</span>
                        <h3 className="text-white font-medium text-xl sm:text-2xl md:text-4xl uppercase">{item.title}</h3>
                      </div>
                    </div>
                    <LiveProjectButton />
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-4 h-full min-h-0">
                    <div className="hidden md:flex flex-col gap-4 w-full md:w-[40%] h-full">
                      <div className="overflow-hidden rounded-[30px] sm:rounded-[40px] h-[clamp(130px,16vw,230px)] bg-[#2A1E40] w-full relative">
                        {renderMotionMedia(img1, 0.1)}
                      </div>
                      <div className="overflow-hidden rounded-[30px] sm:rounded-[40px] h-[clamp(160px,22vw,340px)] flex-grow bg-[#2A1E40] w-full relative">
                        {renderMotionMedia(img2, 0.2)}
                      </div>
                    </div>
                    <div className="w-full md:w-[60%] h-[220px] xs:h-[260px] sm:h-[340px] md:h-full flex-grow md:flex-none overflow-hidden rounded-[24px] sm:rounded-[40px] bg-[#2A1E40] relative">
                      {renderMotionMedia(img3, 0.3)}
                    </div>
                  </div>
                </motion.div>
              </div>
            );
          })}
        </div>

      </section>

      {/* 5.5 SUCCESS PARTNERS SECTION */}
      <section id="partners" className="bg-[#1D1031] py-20 relative z-35 overflow-hidden">
        {/* Decorative background ambient glowing orbs */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#F7941D]/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-6 sm:px-12 md:px-16 lg:px-20 text-center mb-12 sm:mb-16 relative z-10">
          <FadeIn y={20} duration={0.6}>
            <span className="text-[#F7941D] text-xs sm:text-sm font-bold uppercase tracking-widest bg-[#F7941D]/10 px-4 py-2 rounded-full mb-3 inline-block">
              {t('partners.trust')}
            </span>
            <h2 className="text-white font-black text-3xl sm:text-4xl md:text-5xl uppercase leading-tight mt-1">
              {t('partners.title')}
            </h2>
          </FadeIn>
        </div>

        {/* Continuous Infinite Marquee Track (LTR scrolling direction for consistent marquee animation) */}
        <div className="relative w-full overflow-hidden py-4" dir="ltr">
          {/* Edge fading gradients for high-end aesthetic blending */}
          <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-[#1D1031] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-[#1D1031] to-transparent z-10 pointer-events-none" />

          {/* Marquee sliding track container */}
          <div className="animate-marquee flex gap-6">
            {/* Duplicating array elements once to achieve a seamless, continuous, endless infinite loop */}
            {[...partnerLogos, ...partnerLogos].map((logo, idx) => (
              <motion.div 
                key={idx}
                initial="initial"
                whileInView="animate"
                whileHover="hover"
                viewport={{ once: true, margin: "-100px" }}
                variants={{
                  initial: { opacity: 0, y: 40 },
                  animate: { 
                    opacity: 1, 
                    y: 0,
                    transition: {
                      duration: 0.7, 
                      delay: (idx % partnerLogos.length) * 0.06,
                      ease: [0.215, 0.61, 0.355, 1.0] 
                    }
                  },
                  hover: {
                    y: -10,
                    scale: 1.07,
                    transition: {
                      duration: 0.4,
                      ease: [0.25, 1, 0.5, 1]
                    }
                  }
                }}
                className="partner-card group bg-white rounded-3xl shadow-sm hover:shadow-[0_15px_30px_rgba(247,148,29,0.15)] border border-gray-100 hover:border-[#F7941D] p-6 flex items-center justify-center w-40 sm:w-52 h-24 sm:h-28 shrink-0 transition-colors duration-300 select-none cursor-pointer backdrop-blur-md"
              >
                {isVideoUrl(logo) ? (
                  <video 
                    src={logo} 
                    autoPlay 
                    loop 
                    muted 
                    playsInline 
                    className="partner-logo max-w-[85%] max-h-[85%] object-contain"
                  />
                ) : (
                  <motion.img 
                    src={logo} 
                    alt={`شريك النجاح ${idx + 1}`} 
                    referrerPolicy="no-referrer"
                    variants={{
                      hover: { scale: 1.12 }
                    }}
                    transition={{
                      duration: 0.4,
                      ease: "easeOut"
                    }}
                    className="partner-logo max-w-[85%] max-h-[85%] object-contain"
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. FOOTER / CONTACT SECTION */}
      <footer id="contact" className={`bg-[#1F0C3B] py-8 sm:py-12 border-t border-[#3A2A56] relative z-40 ${dir === 'rtl' ? 'text-right' : 'text-left'} overflow-hidden`}>
        {/* Immersive Animated Graphic Design & Brand Identity Background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
          
          {/* Subtle Cybernetic Grid Pattern Overlay with moving gradient mask */}
          <div 
            className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
              backgroundSize: '24px 24px',
            }}
          />

          {/* Dynamic Floating Brand Sparkles and Creative Particles */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
            {Array.from({ length: 18 }).map((_, i) => {
              const size = Math.floor(Math.random() * 6) + 3; // 3px to 9px
              const isPurple = Math.random() > 0.5;
              const color = isPurple ? 'bg-[#A359FF]' : 'bg-[#F7941D]';
              const shadow = isPurple ? 'shadow-[0_0_10px_rgba(163,89,255,0.4)]' : 'shadow-[0_0_10px_rgba(247,148,29,0.4)]';
              const left = `${Math.random() * 100}%`;
              const top = `${Math.random() * 100}%`;
              const duration = Math.random() * 14 + 10; // 10s to 24s
              const delay = Math.random() * 6;
              const xOffset = Math.random() * 80 - 40;
              const yOffset = Math.random() * -180 - 60;
              return (
                <motion.div
                  key={i}
                  className={`absolute rounded-full opacity-[0.2] ${color} ${shadow}`}
                  style={{
                    width: size,
                    height: size,
                    left,
                    top,
                  }}
                  animate={{
                    y: [0, yOffset, yOffset * 2, yOffset, 0],
                    x: [0, xOffset, xOffset * -1.5, xOffset * 0.5, 0],
                    scale: [1, 1.5, 0.7, 1.3, 1],
                    opacity: [0.1, 0.4, 0.05, 0.3, 0.1]
                  }}
                  transition={{
                    duration,
                    delay,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              );
            })}
          </div>
          
          {/* Large Dynamic Shifting Glowing Blobs (Nebula/Lava-Lamp Fluid Effect) */}
          <motion.div 
            className="absolute -top-[20%] -left-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#F7941D]/15 to-[#A359FF]/10 blur-[100px]"
            animate={{
              x: [0, 80, -50, 0],
              y: [0, -60, 80, 0],
              scale: [1, 1.25, 0.9, 1]
            }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute -bottom-[20%] -right-[15%] w-[600px] h-[600px] rounded-full bg-gradient-to-tl from-[#A359FF]/18 to-[#F7941D]/12 blur-[120px]"
            animate={{
              x: [0, -90, 60, 0],
              y: [0, 80, -80, 0],
              scale: [1, 1.2, 0.85, 1]
            }}
            transition={{
              duration: 26,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute top-[25%] left-[20%] w-[380px] h-[380px] rounded-full bg-[#F7941D]/12 blur-[110px]"
            animate={{
              x: [0, 50, -40, 0],
              y: [0, 40, -50, 0],
              scale: [0.9, 1.2, 1.05, 0.9]
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.div 
            className="absolute top-[45%] right-[20%] w-[320px] h-[320px] rounded-full bg-[#A359FF]/10 blur-[90px]"
            animate={{
              x: [0, -40, 40, 0],
              y: [0, 60, -30, 0],
              scale: [1, 0.85, 1.15, 1]
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />

          {/* Interactive Floating Graphic Designer Guides & Bezier Anchor Points */}
          <div className="absolute inset-0 opacity-25">
            {/* Vector Node 1 */}
            <motion.div 
              className="absolute top-[20%] left-[15%] flex items-center justify-center"
              animate={{ y: [0, -15, 0], x: [0, 10, 0] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="w-3 h-3 bg-white border border-[#F7941D] rounded-sm shadow-lg shadow-[#F7941D]/30" />
              <div className="absolute w-[80px] h-[1px] bg-[#F7941D]/40 -z-10 rotate-12" />
              <div className="absolute left-[40px] top-[8px] w-1.5 h-1.5 bg-[#F7941D] rounded-full" />
              <div className="absolute right-[40px] bottom-[8px] w-1.5 h-1.5 bg-[#F7941D] rounded-full" />
            </motion.div>

            {/* Vector Node 2 */}
            <motion.div 
              className="absolute bottom-[25%] right-[25%] flex items-center justify-center"
              animate={{ y: [0, 18, 0], x: [0, -12, 0] }}
              transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="w-3 h-3 bg-[#A359FF] border border-white rounded-sm shadow-lg shadow-[#A359FF]/30" />
              <div className="absolute w-[100px] h-[1px] bg-[#A359FF]/40 -z-10 -rotate-15" />
              <div className="absolute left-[50px] -top-[13px] w-1.5 h-1.5 bg-white rounded-sm border border-[#A359FF]" />
              <div className="absolute right-[50px] top-[13px] w-1.5 h-1.5 bg-white rounded-sm border border-[#A359FF]" />
            </motion.div>
          </div>

          {/* Floating Designer Tools and Wireframe Shapes in Brand Accent Colors */}
          <motion.div 
            className="absolute top-[12%] left-[6%] text-[#F7941D]/12 opacity-50 md:opacity-75"
            animate={{ 
              y: [0, -20, 0], 
              rotate: [12, 28, 12] 
            }}
            transition={{ 
              duration: 12, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <PenTool size={110} strokeWidth={1} />
          </motion.div>

          <motion.div 
            className="absolute top-[18%] right-[10%] text-[#A359FF]/12 opacity-50 md:opacity-75"
            animate={{ 
              y: [0, 25, 0], 
              rotate: [-12, -28, -12] 
            }}
            transition={{ 
              duration: 16, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <Palette size={130} strokeWidth={0.8} />
          </motion.div>

          <motion.div 
            className="absolute bottom-[22%] left-[10%] text-[#F7941D]/12 opacity-45 md:opacity-70"
            animate={{ 
              x: [0, 20, 0], 
              y: [0, -20, 0],
              rotate: [0, 15, 0] 
            }}
            transition={{ 
              duration: 14, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <Layers size={120} strokeWidth={0.8} />
          </motion.div>

          <motion.div 
            className="absolute top-[48%] right-[5%] text-white/[0.03]"
            animate={{ 
              scale: [1, 1.08, 1],
              rotate: [0, 8, 0]
            }}
            transition={{ 
              duration: 24, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <Grid size={160} strokeWidth={0.5} />
          </motion.div>

          <motion.div 
            className="absolute bottom-[12%] right-[16%] text-[#A359FF]/12 opacity-40 md:opacity-65"
            animate={{ 
              y: [0, -25, 0], 
              rotate: [0, 360] 
            }}
            transition={{ 
              duration: 38, 
              repeat: Infinity, 
              ease: "linear" 
            }}
          >
            <Compass size={110} strokeWidth={1} />
          </motion.div>

          <motion.div 
            className="absolute top-[58%] left-[14%] text-white/[0.03]"
            animate={{ 
              x: [0, -15, 0],
              rotate: [-6, 8, -6] 
            }}
            transition={{ 
              duration: 18, 
              repeat: Infinity, 
              ease: "easeInOut" 
            }}
          >
            <Ruler size={90} strokeWidth={0.8} className="rotate-45" />
          </motion.div>

          {/* Abstract Floating Sparkles & Soft Glow Particles in Identity Colors */}
          {[...Array(18)].map((_, i) => {
            const size = Math.random() * 5 + 3;
            const delay = Math.random() * 5;
            const duration = Math.random() * 12 + 10;
            const isOrange = i % 2 === 0;
            return (
              <motion.div
                key={`footer-particle-${i}`}
                className={`absolute rounded-full blur-[0.3px] ${
                  isOrange ? 'bg-[#F7941D]/35' : 'bg-[#A359FF]/35'
                }`}
                style={{
                  width: size,
                  height: size,
                  top: `${Math.random() * 85 + 5}%`,
                  left: `${Math.random() * 85 + 5}%`,
                }}
                animate={{
                  y: [0, -100 - Math.random() * 80, 0],
                  x: [0, Math.random() * 50 - 25, 0],
                  opacity: [0.15, 0.75, 0.15],
                  scale: [1, 1.5, 1]
                }}
                transition={{
                  duration: duration,
                  delay: delay,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            );
          })}

          {/* Geometric Bezier curves representing creative path vectors */}
          <svg className="absolute inset-0 w-full h-full text-white/[0.03] pointer-events-none select-none" xmlns="http://www.w3.org/2000/svg">
            <motion.path 
              d="M -100 400 C 300 100, 600 800, 1500 400" 
              fill="none" 
              stroke="url(#gradient-accent)" 
              strokeWidth="2.5" 
              strokeDasharray="8,8"
              animate={{
                strokeDashoffset: [0, -50]
              }}
              transition={{
                duration: 18,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <motion.path 
              d="M -50 200 C 400 600, 800 -100, 1600 600" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5" 
              animate={{
                strokeDashoffset: [0, 50]
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                ease: "linear"
              }}
            />
            <defs>
              <linearGradient id="gradient-accent" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F7941D" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#A359FF" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#F7941D" stopOpacity="0.1" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
          
          <div className="mb-6">
            <FadeIn 
              y={40} 
              duration={0.8} 
              delay={0.2}
            >
              <ContactForm />
            </FadeIn>
          </div>

          <FadeIn y={15} duration={0.6} delay={0.6}>
            <p 
              onDoubleClick={() => setIsAdminOpen(true)}
              className="text-gray-400 text-[11px] md:text-xs uppercase tracking-widest font-light text-center border-t border-white/5 pt-6 select-none cursor-default hover:text-gray-300 transition-colors duration-200"
              title={language === 'ar' ? 'انقر مرتين للدخول السري' : 'Double click for secret access'}
            >
              {t('common.rights')}
            </p>
          </FadeIn>

        </div>
      </footer>
      <ReadingProgress />
      <AdminPanel isOpen={isAdminOpen} onClose={() => setIsAdminOpen(false)} />
          </>
        )}
      </motion.div>
    </div>
  );
}
