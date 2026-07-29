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

export const getWebPUrlHelper = (url: string): string | null => {
  if (!url || typeof url !== 'string') return null;
  const lowercase = url.toLowerCase().trim();
  if (lowercase.startsWith('data:') || isVideoUrlHelper(url)) return null;

  // If already WebP, return as is
  if (lowercase.includes('.webp')) return url;

  // Unsplash image optimization
  if (lowercase.includes('images.unsplash.com')) {
    if (lowercase.includes('fm=')) {
      return url.replace(/fm=[^&]+/i, 'fm=webp');
    }
    return url + (url.includes('?') ? '&fm=webp' : '?fm=webp');
  }

  // Cloudinary optimization
  if (lowercase.includes('res.cloudinary.com')) {
    if (!lowercase.includes('f_webp')) {
      return url.replace('/upload/', '/upload/f_webp,q_auto/');
    }
    return url;
  }

  // Do not attempt extension swapping on ibb.co as it causes 404 errors
  if (lowercase.includes('ibb.co')) {
    return null;
  }

  return null;
};

export const getSrcSetHelper = (url: string, format?: 'webp' | 'original'): string | undefined => {
  if (!url || typeof url !== 'string' || isVideoUrlHelper(url)) return undefined;
  const lowercase = url.toLowerCase().trim();
  if (lowercase.startsWith('data:')) return undefined;

  // Unsplash image optimization
  if (lowercase.includes('images.unsplash.com')) {
    const cleanUrl = url.replace(/([?&])w=\d+/gi, '').replace(/([?&])fm=[^&]+/gi, '').replace(/([?&])auto=[^&]+/gi, '');
    const sep = cleanUrl.includes('?') ? '&' : '?';
    const fmParam = format === 'webp' ? '&fm=webp' : '&auto=format';
    return [
      `${cleanUrl}${sep}w=400${fmParam}&q=80 400w`,
      `${cleanUrl}${sep}w=800${fmParam}&q=80 800w`,
      `${cleanUrl}${sep}w=1200${fmParam}&q=80 1200w`,
      `${cleanUrl}${sep}w=1600${fmParam}&q=80 1600w`
    ].join(', ');
  }

  // Cloudinary optimization
  if (lowercase.includes('res.cloudinary.com') && lowercase.includes('/upload/')) {
    const fParam = format === 'webp' ? 'f_webp,' : '';
    return [
      url.replace('/upload/', `/upload/w_400,q_auto,${fParam}/`) + ' 400w',
      url.replace('/upload/', `/upload/w_800,q_auto,${fParam}/`) + ' 800w',
      url.replace('/upload/', `/upload/w_1200,q_auto,${fParam}/`) + ' 1200w',
      url.replace('/upload/', `/upload/w_1600,q_auto,${fParam}/`) + ' 1600w'
    ].join(', ');
  }

  // For static image URLs (e.g. ibb.co, motionsites.ai, local images)
  return `${url} 1x, ${url} 2x`;
};

interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt?: string;
  className?: string;
  placeholderClassName?: string;
  rootMargin?: string;
  threshold?: number;
  srcSet?: string;
  sizes?: string;
}

export const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt = '',
  className = '',
  placeholderClassName = '',
  rootMargin = '250px',
  threshold = 0.01,
  srcSet,
  sizes,
  style,
  referrerPolicy = 'no-referrer',
  onClick,
  ...props
}) => {
  const [isInView, setIsInView] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const webpCandidate = getWebPUrlHelper(src);
  const isGif = src && (src.toLowerCase().includes('.gif') || src.toLowerCase().includes('ezgif') || src.toLowerCase().includes('gif'));

  const computedSrcSet = srcSet || getSrcSetHelper(src);
  const computedWebpSrcSet = getSrcSetHelper(src, 'webp') || webpCandidate || undefined;
  const computedSizes = sizes || '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw';

  useEffect(() => {
    setUseFallback(false);
    setIsLoaded(false);
  }, [src]);

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

  useEffect(() => {
    const handleMediaChange = (e: any) => {
      const isPlaying = e.detail?.isPlaying;
      if (!isPlaying && isGif && imgRef.current && canvasRef.current) {
        try {
          const img = imgRef.current;
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          if (ctx && img.complete && img.naturalWidth > 0) {
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            setIsFrozen(true);
            return;
          }
        } catch (err) {
          // Fallback: keep image visible if cross-origin canvas fails
        }
        setIsFrozen(false);
      } else {
        setIsFrozen(false);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('mediaPlaybackChange', handleMediaChange);
      if (document.body.classList.contains('media-paused') && isGif) {
        handleMediaChange({ detail: { isPlaying: false } });
      }
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('mediaPlaybackChange', handleMediaChange);
      }
    };
  }, [src, isGif]);

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
        <>
          <picture className="contents">
            {computedWebpSrcSet && !useFallback && (
              <source type="image/webp" srcSet={computedWebpSrcSet} sizes={computedSizes} />
            )}
            <img
              ref={imgRef}
              src={src}
              srcSet={computedSrcSet}
              sizes={computedSizes}
              alt={alt}
              referrerPolicy={referrerPolicy}
              loading="lazy"
              decoding="async"
              onLoad={() => setIsLoaded(true)}
              onError={() => {
                if (!useFallback && webpCandidate) {
                  setUseFallback(true);
                } else {
                  setIsLoaded(true);
                }
              }}
              className={`${className} transition-opacity duration-500 ${
                isLoaded ? (isFrozen ? 'hidden' : 'opacity-100') : 'opacity-0'
              }`}
              style={style}
              {...props}
            />
          </picture>
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            className={`${className} ${isFrozen ? 'block' : 'hidden'}`}
            style={style}
          />
        </>
      )}
    </div>
  );
};

interface LazyVideoProps extends Omit<React.VideoHTMLAttributes<HTMLVideoElement>, 'onClick'> {
  src: string;
  className?: string;
  placeholderClassName?: string;
  rootMargin?: string;
  threshold?: number;
  pauseWhenOutOfView?: boolean;
  referrerPolicy?: string;
  onClick?: (e: React.MouseEvent<any>) => void;
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
          {...(referrerPolicy ? ({ referrerPolicy } as Record<string, any>) : {})}
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
  srcSet?: string;
  sizes?: string;
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
  rootMargin = '250px',
  srcSet,
  sizes
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
      srcSet={srcSet}
      sizes={sizes}
    />
  );
};
