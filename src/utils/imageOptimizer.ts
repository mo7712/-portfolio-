/**
 * Utility for image optimization, client-side WebP conversion, and quality compression.
 */

export interface WebPConversionResult {
  webpDataUrl: string;
  originalSize: number;
  newSize: number;
  savedPercent: number;
  width: number;
  height: number;
}

/**
 * Converts any image URL, blob URL, or base64 string to an optimized WebP format.
 * 
 * @param imageUrl The source image URL or data URI.
 * @param quality Quality factor between 0.1 and 1.0 (default 0.85).
 * @param maxWidth Maximum width bound for scaling (default 1920).
 * @param maxHeight Maximum height bound for scaling (default 1920).
 */
export const convertToWebP = (
  imageUrl: string,
  quality = 0.85,
  maxWidth = 1920,
  maxHeight = 1920
): Promise<WebPConversionResult> => {
  return new Promise((resolve, reject) => {
    if (!imageUrl || !imageUrl.trim()) {
      reject(new Error("No image URL provided for conversion"));
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";

    img.onload = () => {
      let width = img.width;
      let height = img.height;

      // Downscale proportionally if larger than bounds
      if (width > maxWidth || height > maxHeight) {
        if (width > height) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        } else {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error("Failed to acquire 2D canvas context"));
        return;
      }

      // Draw image onto canvas
      ctx.drawImage(img, 0, 0, width, height);

      // Export as image/webp
      const webpDataUrl = canvas.toDataURL('image/webp', quality);
      const originalSize = imageUrl.length;
      const newSize = webpDataUrl.length;
      const savedPercent = originalSize > 0 
        ? Math.max(0, Math.round(((originalSize - newSize) / originalSize) * 100)) 
        : 0;

      resolve({
        webpDataUrl,
        originalSize,
        newSize,
        savedPercent,
        width,
        height
      });
    };

    img.onerror = (err) => {
      reject(new Error("Failed to load image for WebP optimization"));
    };

    img.src = imageUrl;
  });
};

/**
 * Validates if an image string is already in WebP format.
 */
export const isWebP = (url: string): boolean => {
  if (!url) return false;
  return url.startsWith('data:image/webp') || url.toLowerCase().endsWith('.webp');
};
