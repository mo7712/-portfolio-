export interface SEOConfig {
  title: string;
  description: string;
  keywords: string;
  author: string;
  siteName: string;
  url: string;
  ogImage: string;
  ogType: string;
  twitterCard: string;
  twitterSite?: string;
  themeColor: string;
  locale: string;
}

export const DEFAULT_SEO_CONFIG: Record<'ar' | 'en', SEOConfig> = {
  ar: {
    title: 'مانع - استديو التصميم ثلاثي الأبعاد والهويات البصرية والموشن جرافيكس',
    description: 'مانع - صانع محتوى بصري متخصص في تصميم الجرافيك ثلاثي الأبعاد 3D، الهويات البصرية المتكاملة، الموشن جرافيكس، ومونتاج الفيديو الاحترافي.',
    keywords: 'تصميم ثلاثي الأبعاد, 3D Design, هويات بصرية, موشن جرافيكس, مانع جرافيكس, Manea Graphics, تصميم جرافيك, تصميم لوحات, مونتاج فيديو',
    author: 'Manea Graphics',
    siteName: 'Manea Portfolio',
    url: 'https://manea-graphics.com',
    ogImage: 'https://i.ibb.co/JWtLY2cB/Rectangle-40443-81459862.webp',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterSite: '@ManeaGraphics',
    themeColor: '#1A0C2F',
    locale: 'ar_SA'
  },
  en: {
    title: 'Manea - 3D Design, Visual Identity & Motion Graphics Studio',
    description: 'Manea - High-end creative media studio specializing in 3D graphic design, brand identities, motion graphics, UI/UX, and professional video editing.',
    keywords: '3D Design, Brand Identity, Motion Graphics, Visual Production, Manea Graphics, UI/UX Design, Video Editing',
    author: 'Manea Graphics',
    siteName: 'Manea Portfolio',
    url: 'https://manea-graphics.com',
    ogImage: 'https://i.ibb.co/JWtLY2cB/Rectangle-40443-81459862.webp',
    ogType: 'website',
    twitterCard: 'summary_large_image',
    twitterSite: '@ManeaGraphics',
    themeColor: '#1A0C2F',
    locale: 'en_US'
  }
};

export function getSEOMeta(language: 'ar' | 'en' = 'ar', customTitle?: string, customDesc?: string, customImage?: string): SEOConfig {
  const base = DEFAULT_SEO_CONFIG[language] || DEFAULT_SEO_CONFIG.ar;
  return {
    ...base,
    title: customTitle ? `${customTitle} | ${base.siteName}` : base.title,
    description: customDesc || base.description,
    ogImage: customImage || base.ogImage,
  };
}
