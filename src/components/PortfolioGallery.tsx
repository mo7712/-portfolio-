import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Search, Calendar, User, Hammer, ChevronLeft, ChevronRight, MessageCircle, ArrowRight, Play, Pause } from 'lucide-react';
import { PortfolioItem } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { LazyImage, LazyVideo, LazyMedia } from './LazyMedia';

const isVideoUrl = (url: string) => {
  if (!url) return false;
  const lowercaseUrl = url.toLowerCase().trim();
  if (lowercaseUrl.startsWith('data:video/')) return true;
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.m4v'];
  const isDirectVideo = videoExtensions.some(ext => lowercaseUrl.includes(ext));
  const isEmbedVideo = lowercaseUrl.includes('youtube.com') || 
                       lowercaseUrl.includes('youtu.be') || 
                       lowercaseUrl.includes('vimeo.com') ||
                       lowercaseUrl.includes('player.vimeo.com') ||
                       lowercaseUrl.includes('embed');
  return isDirectVideo || isEmbedVideo;
};

interface PortfolioGalleryProps {
  onBackToHome: () => void;
}

type CategoryFilter = string;

export default function PortfolioGallery({ onBackToHome }: PortfolioGalleryProps) {
  const { language, t, dir, translatedPortfolioItems, categoriesList } = useLanguage();
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProject, setSelectedProject] = useState<PortfolioItem | null>(null);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Autoplay slider states
  const [autoplayActive, setAutoplayActive] = useState(true);
  const [autoplayIndex, setAutoplayIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-play interval timer (5 seconds)
  useEffect(() => {
    const isPaused = typeof document !== 'undefined' && document.body.classList.contains('media-paused');
    if (!autoplayActive || isHovered || selectedProject !== null || translatedPortfolioItems.length === 0 || isPaused) return;

    const timer = setInterval(() => {
      setAutoplayIndex((prev) => (prev + 1) % translatedPortfolioItems.length);
    }, 5000);

    return () => clearInterval(timer);
  }, [autoplayActive, isHovered, selectedProject, translatedPortfolioItems.length]);

  // Prevent body scroll when project details modal is open
  useEffect(() => {
    const lenis = (window as any).lenis;
    if (selectedProject) {
      document.body.style.overflow = 'hidden';
      if (lenis) {
        lenis.stop();
      }
    } else {
      document.body.style.overflow = '';
      if (lenis) {
        lenis.start();
      }
    }
    return () => {
      document.body.style.overflow = '';
      if (lenis) {
        lenis.start();
      }
    };
  }, [selectedProject]);

  // Categories list
  const categories: { key: CategoryFilter; label: string }[] = [
    { key: 'all', label: t('portfolioGallery.all') },
    ...categoriesList
  ];

  // Filtering logic
  const filteredItems = translatedPortfolioItems.filter((item) => {
    const matchesCategory = selectedCategory === 'all' || item.categoryKey === selectedCategory;
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tools.some((tool) => tool.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const projectGallery = selectedProject 
    ? [
        ...(selectedProject.videoUrl ? [selectedProject.videoUrl] : []),
        ...(selectedProject.gallery && selectedProject.gallery.length > 0 
          ? selectedProject.gallery.filter(Boolean).map(url => url.trim())
          : (selectedProject.image ? [selectedProject.image] : []))
      ]
    : [];

  const handleOpenProject = (project: PortfolioItem) => {
    setSelectedProject(project);
    setCurrentImageIndex(0);
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedProject || projectGallery.length === 0) return;
    setCurrentImageIndex((prev) => (prev + 1) % projectGallery.length);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedProject || projectGallery.length === 0) return;
    setCurrentImageIndex((prev) => (prev - 1 + projectGallery.length) % projectGallery.length);
  };

  const renderMedia = (url: string) => {
    if (!url) return null;
    if (isVideoUrl(url)) {
      const lowercaseUrl = url.toLowerCase();
      if (lowercaseUrl.includes('youtube.com') || lowercaseUrl.includes('youtu.be') || lowercaseUrl.includes('vimeo.com')) {
        let embedUrl = url;
        if (lowercaseUrl.includes('youtube.com/watch?v=')) {
          const videoId = url.split('v=')[1]?.split('&')[0];
          embedUrl = `https://www.youtube.com/embed/${videoId}`;
        } else if (lowercaseUrl.includes('youtu.be/')) {
          const videoId = url.split('youtu.be/')[1]?.split('?')[0];
          embedUrl = `https://www.youtube.com/embed/${videoId}`;
        } else if (lowercaseUrl.includes('vimeo.com/')) {
          const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
          embedUrl = `https://player.vimeo.com/video/${videoId}`;
        }
        return (
          <iframe
            src={embedUrl}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="w-full h-full border-0 aspect-[4/3] rounded-t-[32px] lg:rounded-tr-none lg:rounded-l-[32px]"
            title="Video Content"
          />
        );
      } else {
        return (
          <LazyVideo 
            src={url} 
            controls 
            autoPlay={false}
            className="w-full h-full object-cover rounded-t-[32px] lg:rounded-tr-none lg:rounded-l-[32px]"
            playsInline
          />
        );
      }
    }
    return (
      <LazyImage 
        src={url} 
        alt="" 
        referrerPolicy="no-referrer"
        className="w-full h-full object-cover"
      />
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      dir={dir} 
      className={`min-h-screen bg-[#2A1E40] text-white pt-24 pb-20 px-4 sm:px-6 md:px-10 font-sans ${dir === 'rtl' ? 'text-right' : 'text-left'}`}
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Header navigation section inside Portfolio */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-12 border-b border-white/10 pb-8">
          <div>
            <span className="text-[#F7941D] font-bold tracking-widest text-xs uppercase block mb-1">{t('portfolioGallery.creativeShowcase')}</span>
            <h1 className="text-3xl sm:text-5xl font-black bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              {t('portfolioGallery.title')}
            </h1>
          </div>
          
          <button 
            onClick={onBackToHome}
            className="group flex items-center gap-2 px-5 py-2.5 rounded-full border border-white/20 hover:border-[#F7941D] bg-white/5 hover:bg-[#F7941D]/10 text-sm font-medium transition-all duration-300 cursor-pointer"
          >
            <ArrowRight size={18} className={`transform transition-transform duration-200 ${dir === 'rtl' ? 'group-hover:translate-x-1 rotate-180' : 'group-hover:-translate-x-1'}`} />
            <span>{t('common.backHome')}</span>
          </button>
        </div>

        {/* Featured Auto-Play Projects Slider */}
        <div 
          className="mb-16 relative bg-[#3A2A56]/40 rounded-[32px] border border-white/10 p-6 sm:p-8 md:p-10 shadow-2xl overflow-hidden group/slider"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {/* Subtle background glow */}
          <div className="absolute -top-40 -left-40 w-96 h-96 bg-[#F7941D]/15 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-[#a359ff]/15 rounded-full blur-[120px] pointer-events-none" />

          {/* Autoplay status overlay header */}
          <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 relative z-10 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
              <span className="text-[#F7941D] text-xs font-bold uppercase tracking-wider bg-[#F7941D]/10 px-3 py-1.5 rounded-full flex items-center gap-2 w-max">
                <span className={`w-2 h-2 rounded-full ${autoplayActive && !isHovered ? 'bg-green-400 animate-pulse' : 'bg-yellow-400'}`} />
                {autoplayActive && !isHovered ? t('portfolioGallery.autoplayOn') : t('portfolioGallery.autoplayOff')}
              </span>
              {isHovered && autoplayActive && (
                <span className="text-gray-400 text-xs">{t('portfolioGallery.autoplayTemp')}</span>
              )}
            </div>

            {/* Play/Pause Control Button */}
            <button
              onClick={() => setAutoplayActive(!autoplayActive)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white hover:text-[#F7941D] text-xs font-semibold border border-white/10 hover:border-[#F7941D]/30 transition-all duration-300 cursor-pointer"
              title={autoplayActive ? t('portfolioGallery.stopAutoplay') : t('portfolioGallery.startAutoplay')}
            >
              {autoplayActive ? (
                <>
                  <Pause size={14} className="fill-current" />
                  <span>{t('portfolioGallery.stopAutoplay')}</span>
                </>
              ) : (
                <>
                  <Play size={14} className="fill-current" />
                  <span>{t('portfolioGallery.startAutoplay')}</span>
                </>
              )}
            </button>
          </div>

          {/* Slider Core Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10 min-h-[340px]">
            {/* Slide Text Details (Arabic Right-Aligned) */}
            <div className={`lg:col-span-5 order-2 lg:order-1 ${dir === 'rtl' ? 'text-right' : 'text-left'} flex flex-col justify-between h-full`}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={autoplayIndex}
                  initial={{ opacity: 0, x: dir === 'rtl' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: dir === 'rtl' ? -20 : 20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-4"
                >
                  <div className={`flex items-center gap-2.5 ${dir === 'rtl' ? 'justify-start' : 'justify-start'}`}>
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#F7941D] bg-[#F7941D]/10 px-3 py-1 rounded-full">
                      {translatedPortfolioItems[autoplayIndex].category}
                    </span>
                    <span className="text-xs font-mono text-gray-400">{translatedPortfolioItems[autoplayIndex].year}</span>
                  </div>

                  <h3 className="text-2xl sm:text-3xl font-black text-white hover:text-[#F7941D] transition-colors duration-300 leading-tight">
                    {translatedPortfolioItems[autoplayIndex].title}
                  </h3>

                  <p className="text-gray-300 text-sm sm:text-base font-light leading-relaxed line-clamp-3">
                    {translatedPortfolioItems[autoplayIndex].description}
                  </p>

                  <div className={`flex flex-wrap gap-1.5 pt-2 ${dir === 'rtl' ? 'justify-start' : 'justify-start'}`}>
                    {translatedPortfolioItems[autoplayIndex].tools.map((tool) => (
                      <span key={tool} className="text-xs font-medium font-mono text-gray-300 bg-white/5 px-2.5 py-1 rounded-md">
                        {tool}
                      </span>
                    ))}
                  </div>

                  <div className={`pt-4 flex ${dir === 'rtl' ? 'justify-start' : 'justify-start'} gap-4`}>
                    <button
                      onClick={() => handleOpenProject(translatedPortfolioItems[autoplayIndex])}
                      className="px-6 py-3 bg-[#F7941D] hover:bg-[#E06C00] text-white text-sm font-bold rounded-xl shadow-lg shadow-[#F7941D]/10 hover:shadow-[#F7941D]/20 hover:scale-[1.02] transition-all duration-300 cursor-pointer flex items-center gap-2"
                    >
                      <span>{t('portfolioGallery.viewFullDetails')}</span>
                      <ArrowRight size={16} className={dir === 'rtl' ? 'rotate-180' : ''} />
                    </button>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Slide Visuals (Left-Aligned in RTL) */}
            <div className="lg:col-span-7 order-1 lg:order-2 relative aspect-[16/9] w-full rounded-2xl overflow-hidden border border-white/5 bg-[#1A122E] shadow-xl group/media">
              <AnimatePresence mode="wait">
                <motion.div
                  key={autoplayIndex}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  transition={{ duration: 0.5 }}
                  className="w-full h-full"
                >
                  <LazyMedia
                    src={translatedPortfolioItems[autoplayIndex].image}
                    alt={translatedPortfolioItems[autoplayIndex].title}
                    className="w-full h-full object-cover cursor-pointer"
                    onClick={() => handleOpenProject(translatedPortfolioItems[autoplayIndex])}
                  />
                </motion.div>
              </AnimatePresence>

              {/* Slider Next/Prev Arrows overlay (visible on touch mobile, hover on desktop) */}
              <div className="absolute inset-x-3 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none opacity-100 sm:opacity-0 sm:group-hover/media:opacity-100 transition-opacity duration-300">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setAutoplayIndex((prev) => (prev - 1 + translatedPortfolioItems.length) % translatedPortfolioItems.length);
                    setAutoplayActive(false); // Stop autoplay on explicit manual control click
                  }}
                  className="p-2.5 rounded-full bg-[#1A122E]/80 hover:bg-[#1A122E] text-white hover:text-[#F7941D] transition-colors pointer-events-auto cursor-pointer border border-white/5 shadow-lg"
                  title={t('portfolioGallery.prevProject')}
                >
                  {dir === 'rtl' ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setAutoplayIndex((prev) => (prev + 1) % translatedPortfolioItems.length);
                    setAutoplayActive(false); // Stop autoplay on explicit manual control click
                  }}
                  className="p-2.5 rounded-full bg-[#1A122E]/80 hover:bg-[#1A122E] text-white hover:text-[#F7941D] transition-colors pointer-events-auto cursor-pointer border border-white/5 shadow-lg"
                  title={t('portfolioGallery.nextProject')}
                >
                  {dir === 'rtl' ? <ChevronLeft size={18} /> : <ChevronRight size={18} />}
                </button>
              </div>

              {/* Sliders Dot Indicators bottom overlay */}
              <div className={`absolute bottom-4 ${dir === 'rtl' ? 'left-4' : 'right-4'} flex gap-1.5 z-10 bg-[#1A122E]/60 px-3 py-1.5 rounded-full`}>
                {translatedPortfolioItems.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setAutoplayIndex(i);
                      setAutoplayActive(false); // Stop autoplay on explicit dot select
                    }}
                    className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                      autoplayIndex === i ? 'bg-[#F7941D] w-4' : 'bg-white/40 hover:bg-white/60'
                    }`}
                    title={`${language === 'ar' ? 'الذهاب إلى مشروع' : 'Go to project'} ${i + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Animated Progress Bar */}
          {autoplayActive && !isHovered && (
            <motion.div 
              key={autoplayIndex}
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 5, ease: 'linear' }}
              className="absolute bottom-0 right-0 h-1 bg-[#F7941D]"
            />
          )}
        </div>

        {/* Search and Filters Section */}
        <div className="flex flex-col lg:flex-row justify-between items-stretch lg:items-center gap-6 mb-12">
          {/* Categories list */}
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat.key}
                onClick={() => setSelectedCategory(cat.key)}
                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer relative ${
                  selectedCategory === cat.key
                    ? 'text-white'
                    : 'text-gray-400 hover:text-white bg-white/5 hover:bg-white/10'
                }`}
              >
                {selectedCategory === cat.key && (
                  <motion.div
                    layoutId="activeCategoryBg"
                    className="absolute inset-0 rounded-full"
                    style={{
                      backgroundColor: '#F7941D',
                      zIndex: -1
                    }}
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{cat.label}</span>
              </button>
            ))}
          </div>

          {/* Search box */}
          <div className="relative max-w-md w-full">
            <input
              type="text"
              placeholder={t('portfolioGallery.searchPlaceholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full ${dir === 'rtl' ? 'pl-4 pr-10' : 'pl-10 pr-4'} py-2.5 rounded-full bg-white/5 border border-white/10 focus:border-[#F7941D]/60 focus:bg-white/10 text-white placeholder-gray-500 outline-none text-sm transition-all duration-300`}
            />
            <Search className={`absolute ${dir === 'rtl' ? 'right-3.5' : 'left-3.5'} top-1/2 -translate-y-1/2 text-gray-400`} size={18} />
          </div>
        </div>

        {/* Portfolio Grid */}
        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.92 }}
                transition={{ duration: 0.4 }}
                onClick={() => handleOpenProject(item)}
                className="group bg-[#1D1031]/90 border-2 border-[#F7941D]/20 hover:border-[#F7941D] rounded-3xl overflow-hidden cursor-pointer flex flex-col h-full shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                {/* Image wrapper with relative aspect ratio */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-[#1A122E]">
                  <LazyMedia
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  {/* Hover visual cue - Cohesive Theme Overlay */}
                  <div className="absolute inset-0 bg-[#1D1031]/85 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-center items-center p-6 text-center">
                    <span className="text-[#F7941D] font-bold text-sm border-2 border-[#F7941D] rounded-full px-4 py-2 bg-[#1D1031] hover:bg-[#F7941D] hover:text-white transition-all duration-300 flex items-center gap-2">
                      <span>{t('portfolioGallery.viewDetails')}</span>
                      <ArrowRight size={14} className={dir === 'rtl' ? 'rotate-180' : ''} />
                    </span>
                  </div>
                </div>

                {/* Info and content */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#F7941D] bg-[#F7941D]/10 px-3 py-1 rounded-full">
                      {item.category}
                    </span>
                    <span className="text-xs font-mono text-gray-400">{item.year}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-white mb-2 leading-snug group-hover:text-[#F7941D] transition-colors duration-300">
                    {item.title}
                  </h3>
                  
                  <p className="text-gray-300 text-xs sm:text-sm font-light leading-relaxed mb-4 line-clamp-2">
                    {item.description}
                  </p>

                  <div className="mt-auto pt-4 border-t border-white/5 flex flex-wrap gap-1.5">
                    {item.tools.slice(0, 3).map((tool) => (
                      <span key={tool} className="text-[10px] font-medium font-mono text-gray-300 bg-white/5 px-2.5 py-0.5 rounded-md">
                        {tool}
                      </span>
                    ))}
                    {item.tools.length > 3 && (
                      <span className="text-[10px] font-medium font-mono text-gray-400 bg-white/5 px-2 py-0.5 rounded-md">
                        +{item.tools.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Empty state */}
        {filteredItems.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24 bg-[#3A2A56]/20 rounded-3xl border border-dashed border-white/10"
          >
            <p className="text-gray-400 text-lg mb-4">{t('portfolioGallery.noResults')}</p>
            <button 
              onClick={() => { setSelectedCategory('all'); setSearchQuery(''); }}
              className="text-[#F7941D] font-semibold text-sm hover:underline cursor-pointer"
            >
              {t('portfolioGallery.showAll')}
            </button>
          </motion.div>
        )}

        {/* Bottom Call to Action */}
        <div className="mt-20 text-center bg-[#3A2A56]/40 border border-white/5 p-8 sm:p-12 rounded-[32px] max-w-4xl mx-auto">
          <h3 className="text-xl sm:text-2xl font-bold mb-3">{t('portfolioGallery.thinkToBuild')}</h3>
          <p className="text-gray-300 text-sm sm:text-base font-light mb-8 max-w-lg mx-auto">
            {language === 'ar' 
              ? 'دعنا نتعاون معاً لإخراج أفكارك وشركتك بأفضل صورة بصرية ممكنة.' 
              : 'Let us collaborate together to bring your ideas and business to the best possible visual outcome.'}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <a 
              href={t('contact.whatsappLink')} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-6 py-3 rounded-full bg-[#F7941D] hover:bg-[#E06C00] text-white font-medium text-sm transition-all duration-300 hover:scale-105"
            >
              <MessageCircle size={18} />
              <span>{t('portfolioGallery.startProjectNow')}</span>
            </a>
            <button 
              onClick={onBackToHome}
              className="px-6 py-3 rounded-full border border-white/20 hover:border-white text-white font-medium text-sm transition-all duration-300 cursor-pointer"
            >
              {t('common.backHome')}
            </button>
          </div>
        </div>

      </div>

      {/* Interactive Project Details Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div 
            data-lenis-prevent
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
            className="fixed inset-0 z-50 bg-[#1A122E]/90 backdrop-blur-md flex flex-col items-center justify-start md:justify-center p-4 md:p-10 overflow-y-auto"
          >
            <motion.div 
              initial={{ scale: 0.92, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.92, y: 15 }}
              transition={{ type: 'spring', duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-[#2A1E40] border border-white/10 rounded-[32px] w-full max-w-5xl overflow-hidden shadow-2xl relative my-8"
            >
              {/* Close Button */}
              <button 
                onClick={() => setSelectedProject(null)}
                className={`absolute top-4 ${dir === 'rtl' ? 'left-4' : 'right-4'} z-10 p-2.5 rounded-full bg-[#1A122E]/80 text-white hover:text-[#F7941D] hover:bg-[#1A122E] transition-all duration-300 border border-white/5 cursor-pointer`}
                title={t('portfolioGallery.close')}
              >
                <X size={20} />
              </button>

              <div className="flex flex-col lg:flex-row min-h-[480px]">
                {/* Left Side: Photo/Video carousel */}
                <div className="lg:w-[55%] relative bg-[#1A122E] flex flex-col justify-center min-h-[280px] lg:min-h-0">
                  <div className="relative aspect-[4/3] w-full flex items-center justify-center overflow-hidden">
                    {renderMedia(projectGallery[currentImageIndex])}
                  </div>

                  {/* Carousel Controls */}
                  {projectGallery.length > 1 && (
                    <>
                      <button 
                        onClick={handlePrevImage}
                        className={`absolute ${dir === 'rtl' ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#1A122E]/70 hover:bg-[#1A122E] text-white hover:text-[#F7941D] transition-colors cursor-pointer border border-white/5 z-10`}
                        title={t('portfolioGallery.prevProject')}
                      >
                        {dir === 'rtl' ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
                      </button>
                      <button 
                        onClick={handleNextImage}
                        className={`absolute ${dir === 'rtl' ? 'left-4' : 'right-4'} top-1/2 -translate-y-1/2 p-2 rounded-full bg-[#1A122E]/70 hover:bg-[#1A122E] text-white hover:text-[#F7941D] transition-colors cursor-pointer border border-white/5 z-10`}
                        title={t('portfolioGallery.nextProject')}
                      >
                        {dir === 'rtl' ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
                      </button>

                      {/* Dot indicators */}
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10 bg-[#1A122E]/60 px-3 py-1.5 rounded-full">
                        {projectGallery.map((_, i) => (
                          <button
                            key={i}
                            onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(i); }}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${
                              currentImageIndex === i ? 'bg-[#F7941D] w-4' : 'bg-white/40'
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                {/* Right Side: Description and Details */}
                <div className={`lg:w-[45%] p-6 sm:p-8 md:p-10 flex flex-col justify-between border-t lg:border-t-0 ${dir === 'rtl' ? 'lg:border-r border-white/10' : 'lg:border-l border-white/10'} bg-[#2A1E40] ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                  <div>
                    {/* Category Label */}
                    <span className="text-xs font-bold text-[#F7941D] tracking-widest uppercase mb-2 block">
                      {selectedProject.category}
                    </span>
                    
                    {/* Title */}
                    <h2 className="text-2xl sm:text-3xl font-black text-white mb-4 leading-tight">
                      {selectedProject.title}
                    </h2>

                    {/* Meta info grid */}
                    <div className="grid grid-cols-2 gap-4 bg-[#1A122E]/40 p-4 rounded-2xl mb-6 border border-white/5">
                      <div className="flex items-center gap-2.5">
                        <User className="text-gray-400 shrink-0" size={16} />
                        <div>
                          <span className="text-[10px] text-gray-500 block">{t('portfolioGallery.client')}</span>
                          <span className="text-xs font-medium text-gray-200 line-clamp-1">{selectedProject.client}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <Calendar className="text-gray-400 shrink-0" size={16} />
                        <div>
                          <span className="text-[10px] text-gray-500 block">{t('portfolioGallery.year')}</span>
                          <span className="text-xs font-medium text-gray-200">{selectedProject.year}</span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <div className="mb-6">
                      <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{t('portfolioGallery.aboutProject')}</h4>
                      <p className="text-gray-200 text-sm font-light leading-relaxed">
                        {selectedProject.description}
                      </p>
                    </div>

                    {/* Tools */}
                    <div className="mb-8">
                      <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                        <Hammer size={12} />
                        <span>{t('portfolioGallery.tools')}</span>
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedProject.tools.map((tool) => (
                          <span key={tool} className="text-xs font-medium font-mono text-[#F7941D] bg-[#F7941D]/10 px-3 py-1 rounded-full border border-[#F7941D]/20">
                            {tool}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Call to action on bottom of details */}
                  <div className="pt-6 border-t border-white/5 flex gap-3">
                    <a 
                      href={`${t('contact.whatsappLink').split('?')[0]}?text=${encodeURIComponent(
                        language === 'ar'
                          ? `مرحباً مانع، لقد أعجبني مشروعك "${selectedProject.title}" وأود الاستفسار عن تفاصيل تصميم مشابه.`
                          : `Hello Manea, I liked your project "${selectedProject.title}" and would like to inquire about a similar design.`
                      )}`}
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-grow flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#F7941D] hover:bg-[#E06C00] text-white font-medium text-sm transition-all duration-300"
                    >
                      <MessageCircle size={18} />
                      <span>{t('portfolioGallery.contactRegardingProj')}</span>
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
