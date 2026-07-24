import React, { useState, useEffect, useRef } from 'react';

export const isVideoUrlHelper = (url: string) => {
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

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt?: string;
  className?: string;
  placeholderClassName?: string;
  rootMargin?: string;
  threshold?: number;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt = '',
  className = '',
  placeholderClassName = '',
  rootMargin = '250px',
  threshold = 0.01,
  style,
  referrerPolicy = 'no-referrer',
  onClick,
  ...props
}) => {
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!src) return;

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            if (containerRef.current) {
              observer.unobserve(containerRef.current);
            }
          }
        });
      },
      { rootMargin, threshold }
    );

    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [src, rootMargin, threshold]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${placeholderClassName || ''}`}
      onClick={onClick}
    >
      {/* Skeleton / Shimmer background while image is loading */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-[#2A1E40]/60 animate-pulse pointer-events-none z-0" />
      )}

      {isInView && (
        <img
          src={src}
          alt={alt}
          referrerPolicy={referrerPolicy}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          className={`${className} transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={style}
          {...props}
        />
      )}
    </div>
  );
};

interface LazyVideoProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  src: string;
  className?: string;
  placeholderClassName?: string;
  rootMargin?: string;
  threshold?: number;
  pauseWhenOutOfView?: boolean;
}

export const LazyVideo: React.FC<LazyVideoProps> = ({
  src,
  className = '',
  placeholderClassName = '',
  rootMargin = '250px',
  threshold = 0.01,
  pauseWhenOutOfView = false,
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
  controls,
  style,
  referrerPolicy = 'no-referrer',
  onClick,
  ...props
}) => {
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!src) return;

    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            const isPaused = typeof document !== 'undefined' && document.body.classList.contains('media-paused');
            if (videoRef.current && autoPlay && !isPaused) {
              videoRef.current.play().catch(() => {});
            }
            if (!pauseWhenOutOfView && containerRef.current) {
              observer.unobserve(containerRef.current);
            }
          } else if (pauseWhenOutOfView && videoRef.current) {
            videoRef.current.pause();
          }
        });
      },
      { rootMargin, threshold }
    );

    const currentRef = containerRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    const handleMediaChange = (e: any) => {
      const isPlaying = e.detail?.isPlaying;
      if (videoRef.current) {
        if (!isPlaying) {
          videoRef.current.pause();
        } else if (autoPlay) {
          videoRef.current.play().catch(() => {});
        }
      }
    };

    window.addEventListener('mediaPlaybackChange', handleMediaChange);

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
      window.removeEventListener('mediaPlaybackChange', handleMediaChange);
    };
  }, [src, rootMargin, threshold, autoPlay, pauseWhenOutOfView]);

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${placeholderClassName || ''}`}
      onClick={onClick}
    >
      {!isLoaded && (
        <div className="absolute inset-0 bg-[#2A1E40]/60 animate-pulse pointer-events-none z-0" />
      )}

      {isInView && (
        <video
          ref={videoRef}
          src={src}
          autoPlay={autoPlay}
          loop={loop}
          muted={muted}
          playsInline={playsInline}
          controls={controls}
          referrerPolicy={referrerPolicy}
          onLoadedData={() => setIsLoaded(true)}
          onPlay={(e) => {
            if (typeof document !== 'undefined' && document.body.classList.contains('media-paused')) {
              e.currentTarget.pause();
            }
          }}
          className={`${className} transition-opacity duration-500 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          style={style}
          {...props}
        />
      )}
    </div>
  );
};

interface LazyMediaProps {
  src: string;
  alt?: string;
  className?: string;
  placeholderClassName?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  playsInline?: boolean;
  controls?: boolean;
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
  style?: React.CSSProperties;
  rootMargin?: string;
}

export const LazyMedia: React.FC<LazyMediaProps> = ({
  src,
  alt = '',
  className = '',
  placeholderClassName = '',
  autoPlay = true,
  loop = true,
  muted = true,
  playsInline = true,
  controls,
  referrerPolicy = 'no-referrer',
  onClick,
  style,
  rootMargin = '250px'
}) => {
  if (isVideoUrlHelper(src)) {
    return (
      <LazyVideo
        src={src}
        className={className}
        placeholderClassName={placeholderClassName}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline={playsInline}
        controls={controls}
        referrerPolicy={referrerPolicy}
        onClick={onClick}
        style={style}
        rootMargin={rootMargin}
      />
    );
  }

  return (
    <LazyImage
      src={src}
      alt={alt}
      className={className}
      placeholderClassName={placeholderClassName}
      referrerPolicy={referrerPolicy}
      onClick={onClick}
      style={style}
      rootMargin={rootMargin}
    />
  );
};
