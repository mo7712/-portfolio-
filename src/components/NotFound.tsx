import React from 'react';
import { motion } from 'motion/react';
import { Home, Sparkles, ArrowLeft, ArrowRight, Compass, MessageCircle, RefreshCw } from 'lucide-react';
import notFoundImage from '../assets/images/not_found_3d_graphic_1784830083803.jpg';

interface NotFoundProps {
  onGoHome: () => void;
  onGoPortfolio?: () => void;
  language?: 'ar' | 'en';
  dir?: 'rtl' | 'ltr';
}

export const NotFound: React.FC<NotFoundProps> = ({
  onGoHome,
  onGoPortfolio,
  language = 'ar',
  dir = 'rtl',
}) => {
  const isAr = language === 'ar';

  return (
    <div
      dir={dir}
      className={`min-h-screen w-full bg-[#1D1031] text-white flex items-center justify-center relative overflow-hidden px-4 py-16 font-sans ${
        dir === 'rtl' ? 'text-right' : 'text-left'
      }`}
    >
      {/* Background Ambient Glowing Orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] sm:w-[500px] h-[350px] sm:h-[500px] bg-[#F7941D]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[300px] h-[300px] bg-[#A359FF]/20 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-10 left-10 w-[250px] h-[250px] bg-[#170B28] rounded-full blur-[80px] pointer-events-none" />

      {/* Floating Animated Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Main Content Container */}
      <div className="max-w-3xl w-full mx-auto relative z-10 flex flex-col items-center text-center">
        
        {/* Floating 3D Graphic Asset */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-6 sm:mb-8 group"
        >
          {/* Subtle Rotating Glow Aura behind Graphic */}
          <motion.div
            animate={{
              rotate: [0, 360],
              scale: [1, 1.05, 1],
            }}
            transition={{
              rotate: { duration: 25, repeat: Infinity, ease: 'linear' },
              scale: { duration: 6, repeat: Infinity, ease: 'easeInOut' },
            }}
            className="absolute -inset-4 rounded-3xl bg-gradient-to-r from-[#F7941D]/30 via-[#A359FF]/40 to-[#F7941D]/30 blur-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-500"
          />

          {/* Floating Motion Wrapper for the 3D Graphic */}
          <motion.div
            animate={{
              y: [0, -18, 0],
              rotate: [0, 2, -2, 0],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="relative w-48 h-48 sm:w-64 sm:h-64 rounded-3xl overflow-hidden border-2 border-white/15 shadow-[0_20px_50px_rgba(0,0,0,0.6)] bg-[#2C164B]/80 backdrop-blur-xl p-2"
          >
            <img
              src={notFoundImage}
              alt="404 Not Found 3D Graphic"
              className="w-full h-full object-cover rounded-2xl shadow-inner"
            />

            {/* Glowing Corner Badge */}
            <div className="absolute top-4 right-4 bg-[#1D1031]/90 backdrop-blur-md border border-[#F7941D]/50 px-3 py-1 rounded-full text-xs font-mono font-bold text-[#F7941D] shadow-lg flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#F7941D] animate-ping" />
              <span>404 ERROR</span>
            </div>
          </motion.div>
        </motion.div>

        {/* 404 Large Display Typography */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.04] text-xs sm:text-sm font-medium text-gray-300">
            <Compass className="w-4 h-4 text-[#F7941D] animate-spin-slow" />
            <span>{isAr ? 'عفواً، مسار مفقود' : 'Lost in Creative Space'}</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-white via-orange-100 to-[#F7941D] bg-clip-text text-transparent pb-1.5 leading-tight">
            {isAr ? '404 - الصفحة غير موجودة' : '404 - Page Not Found'}
          </h1>

          <p className="text-gray-300 max-w-md mx-auto text-sm sm:text-base leading-relaxed font-light">
            {isAr
              ? 'يبدو أن الصفحة التي تبحث عنها قد تم نقلها أو أصبحت غير متوفرة حالياً. يمكنك العودة للرئيسية أو استكشاف أعمال مانع جرافيكس.'
              : 'The page you are looking for might have been moved, removed, or is temporarily unavailable. Let’s get you back on track!'}
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4"
        >
          {/* Go Home Button */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onGoHome}
            className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#F7941D] to-[#E06C00] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            <Home className="w-4 h-4" />
            <span>{isAr ? 'الرجوع للرئيسية' : 'Back to Home'}</span>
            {isAr ? (
              <ArrowLeft className="w-4 h-4" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
          </motion.button>

          {/* Go Portfolio Button */}
          {onGoPortfolio && (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={onGoPortfolio}
              className="flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl bg-white/5 border border-white/15 hover:border-[#F7941D]/50 hover:bg-white/10 text-white font-medium text-sm transition-all cursor-pointer"
            >
              <Sparkles className="w-4 h-4 text-[#F7941D]" />
              <span>{isAr ? 'معرض الأعمال' : 'View Portfolio'}</span>
            </motion.button>
          )}

          {/* Reload Page Button */}
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => window.location.reload()}
            className="flex items-center justify-center p-3.5 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 text-gray-300 hover:text-white transition-all cursor-pointer"
            title={isAr ? 'تحديث الصفحة' : 'Reload Page'}
          >
            <RefreshCw className="w-4 h-4" />
          </motion.button>
        </motion.div>

        {/* Footer Credit Tag */}
        <div className="mt-12 text-xs text-gray-400 font-mono tracking-widest">
          <span>MANEA GRAPHICS • DESIGN STUDIO</span>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
