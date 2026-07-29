import React from 'react';
import { LazyImage } from './LazyMedia';

export interface ResponsiveImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt?: string;
  sizes?: string;
  widths?: number[];
  className?: string;
  placeholderClassName?: string;
  referrerPolicy?: React.HTMLAttributeReferrerPolicy;
  onClick?: (e: React.MouseEvent<HTMLImageElement>) => void;
  width?: number;
  height?: number;
}

export function generateSrcSet(src: string, widths: number[] = [400, 800, 1200, 1600], format?: 'webp' | 'original'): string | undefined {
  if (!src || typeof src !== 'string' || src.startsWith('data:')) return undefined;

  const lowercase = src.toLowerCase().trim();

  // Unsplash Image URL handling
  if (lowercase.includes('images.unsplash.com')) {
    const cleanUrl = src.replace(/([?&])w=\d+/gi, '').replace(/([?&])fm=[^&]+/gi, '').replace(/([?&])auto=[^&]+/gi, '');
    const sep = cleanUrl.includes('?') ? '&' : '?';
    const fmParam = format === 'webp' ? '&fm=webp' : '&auto=format';
    return widths.map(w => `${cleanUrl}${sep}w=${w}${fmParam}&q=80 ${w}w`).join(', ');
  }

  // Cloudinary Image URL handling
  if (lowercase.includes('res.cloudinary.com') && lowercase.includes('/upload/')) {
    const fParam = format === 'webp' ? 'f_webp,' : '';
    return widths.map(w => `${src.replace('/upload/', `/upload/w_${w},q_auto,${fParam}/`)} ${w}w`).join(', ');
  }

  // Default fallback for static/hosting URLs (e.g. ibb.co, local assets)
  return `${src} 1x, ${src} 2x`;
}

export const ResponsiveImage: React.FC<ResponsiveImageProps> = ({
  src,
  alt = '',
  sizes = '(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw',
  widths = [400, 800, 1200, 1600],
  className = '',
  placeholderClassName = '',
  referrerPolicy = 'no-referrer',
  onClick,
  srcSet,
  width,
  height,
  ...rest
}) => {
  const computedSrcSet = srcSet || generateSrcSet(src, widths);

  return (
    <LazyImage
      src={src}
      alt={alt}
      srcSet={computedSrcSet}
      sizes={sizes}
      className={className}
      placeholderClassName={placeholderClassName}
      referrerPolicy={referrerPolicy}
      onClick={onClick}
      width={width}
      height={height}
      {...rest}
    />
  );
};

export default ResponsiveImage;
