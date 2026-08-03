import { portfolioItems } from '../portfolioData';

export const STATIC_CRITICAL_IMAGES: string[] = [
  // Hero & Core Profile
  'https://i.ibb.co/JWtLY2cB/Rectangle-40443-81459862.webp',
  'https://i.ibb.co/v61V8K48/manea-hero-1.gif',
  'https://i.ibb.co/1t1vRfbg/maneahero-ezgif-com-video-to-gif-converter.gif',

  // 3D Floating Elements
  'https://i.ibb.co/vxYLRcRs/video-editing-v2.webp',
  'https://i.ibb.co/F43mtR51/social-ads-v2.webp',
  'https://i.ibb.co/NddHTbg7/pen-tool-v2.webp',
  'https://i.ibb.co/CsXrWskK/web-design-v2.webp',

  // Marquee Showcase Images
  'https://i.ibb.co/wh7dmm4s/2.webp',
  'https://i.ibb.co/Q3CbVBsG/2025.webp',
  'https://i.ibb.co/q3cWB45P/image.webp',
  'https://i.ibb.co/mCH4bvYb/image.webp',
  'https://i.ibb.co/gMSZKtTZ/2.webp',
  'https://i.ibb.co/6cktLXhn/image.webp',
  'https://i.ibb.co/nqXrLLhF/image.webp'
];

/**
 * Gather all primary portfolio cover images
 */
export const getCriticalPortfolioImages = (): string[] => {
  return portfolioItems
    .map(item => item.image)
    .filter((url): url is string => Boolean(url && typeof url === 'string' && url.trim().length > 0));
};

/**
 * Preload an array of image URLs and report progress (0 to 100%)
 */
export function preloadImages(
  urls: string[],
  onProgress?: (progress: number, loadedCount: number, totalCount: number) => void,
  maxTimeoutMs: number = 7000
): Promise<void> {
  return new Promise((resolve) => {
    // Filter and deduplicate valid image URLs
    const uniqueUrls = Array.from(
      new Set(
        urls.filter(url => url && typeof url === 'string' && url.trim().startsWith('http'))
      )
    );

    if (uniqueUrls.length === 0) {
      if (onProgress) onProgress(100, 0, 0);
      resolve();
      return;
    }

    let loadedCount = 0;
    const totalCount = uniqueUrls.length;
    let isSettled = false;

    const finish = () => {
      if (!isSettled) {
        isSettled = true;
        if (onProgress) onProgress(100, totalCount, totalCount);
        resolve();
      }
    };

    // Safety timeout to prevent hanging infinitely on slow or blocked network requests
    const timeoutTimer = setTimeout(() => {
      finish();
    }, maxTimeoutMs);

    const updateProgress = () => {
      loadedCount++;
      const percent = Math.min(100, Math.round((loadedCount / totalCount) * 100));
      if (onProgress) {
        onProgress(percent, loadedCount, totalCount);
      }
      if (loadedCount >= totalCount) {
        clearTimeout(timeoutTimer);
        finish();
      }
    };

    uniqueUrls.forEach((url) => {
      const img = new Image();
      img.onload = updateProgress;
      img.onerror = updateProgress;
      // Trigger background fetch
      img.src = url;
    });
  });
}
