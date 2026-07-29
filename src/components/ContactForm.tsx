import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { z } from 'zod';
import { useLanguage } from '../context/LanguageContext';
import { useAnalytics } from '../hooks/useAnalytics';
import { 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Phone, 
  Mail, 
  MapPin, 
  MessageCircle, 
  Instagram, 
  Facebook, 
  Copy, 
  Check, 
  Briefcase, 
  User, 
  FileText,
  Layers,
  X,
  Globe,
  ExternalLink
} from 'lucide-react';

// --- LOCAL MINIFIED BRAND LOGO TO AVOID CIRCULAR IMPORT ---
interface LocalLogoProps {
  size?: number;
  className?: string;
}

function LocalMonaLogo({ size = 70, className = "" }: LocalLogoProps) {
  return (
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
}

// --- DYNAMIC EXPANDING SOCIAL LINK FOR FOOTER ---
interface DynamicSocialLinkProps {
  href: string;
  label: string;
  handle: string;
  colorClass: string;
  icon: React.ReactNode;
}

function DynamicSocialLink({ href, label, handle, colorClass, icon }: DynamicSocialLinkProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} (${handle})`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative flex items-center h-12 rounded-2xl bg-white/[0.02] border border-white/10 overflow-hidden cursor-pointer select-none transition-colors duration-300 hover:border-transparent"
      animate={{
        width: isHovered ? '220px' : '48px',
      }}
      transition={{
        type: 'spring',
        stiffness: 260,
        damping: 25,
      }}
    >
      {/* Background Hover color */}
      <div 
        className={`absolute inset-0 transition-opacity duration-300 ${colorClass} ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} 
      />

      {/* Content wrapper */}
      <div className="absolute inset-0 flex items-center justify-start px-3.5 gap-3 z-10 w-full">
        {/* Icon wrapper */}
        <div className="shrink-0 text-white flex items-center justify-center">
          {icon}
        </div>
        
        {/* Revealable text */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col text-right justify-center overflow-hidden select-none"
            >
              <span className="text-[10px] text-white/70 font-medium leading-none mb-0.5">{label}</span>
              <span className="text-xs text-white font-bold tracking-wide leading-none truncate">{handle}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.a>
  );
}

export default function ContactForm() {
  const { language, t, dir } = useLanguage();
  const { trackCTA, trackEvent } = useAnalytics();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    projectSubject: '',
    message: '',
  });

  const [errors, setErrors] = useState({
    name: '',
    email: '',
    phone: '',
    projectSubject: '',
    message: '',
  });

  const [touched, setTouched] = useState({
    name: false,
    email: false,
    phone: false,
    message: false,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (showToast) {
      const timer = setTimeout(() => {
        setShowToast(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showToast]);

  // Copy states
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(t('contact.emailValue'));
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  const handleCopyPhone = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(t('contact.phoneValue'));
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2000);
  };

  const getContactSchema = () => z.object({
    name: z.string()
      .trim()
      .min(1, { message: t('contact.reqName') })
      .min(3, { message: t('contact.minName') }),
    email: z.string()
      .trim()
      .min(1, { message: t('contact.reqEmail') })
      .email({ message: t('contact.invalidEmail') }),
    phone: z.string()
      .trim()
      .min(1, { message: t('contact.reqPhone') })
      .regex(/^[\d\s+\-()]{7,20}$/, {
        message: language === 'ar' ? 'رقم الهاتف غير صالح' : 'Invalid phone number format'
      }),
    projectSubject: z.string().optional(),
    message: z.string()
      .trim()
      .min(1, { message: t('contact.reqMsg') })
      .min(10, { message: language === 'ar' ? 'يجب أن تحتوي التفاصيل على 10 أحرف على الأقل' : 'Details must be at least 10 characters' })
  });

  const validateField = (fieldName: string, value: string) => {
    const schema = getContactSchema();
    const shape = schema.shape as Record<string, z.ZodTypeAny>;
    let errorMsg = '';

    if (shape[fieldName]) {
      const result = shape[fieldName].safeParse(value);
      if (!result.success) {
        errorMsg = result.error.issues[0]?.message || '';
      }
    }

    setErrors((prev) => ({ ...prev, [fieldName]: errorMsg }));
    return errorMsg === '';
  };

  const handleBlur = (fieldName: string) => {
    setTouched((prev) => ({ ...prev, [fieldName]: true }));
    validateField(fieldName, formData[fieldName as keyof typeof formData]);
  };

  const validateForm = () => {
    const schema = getContactSchema();
    const result = schema.safeParse(formData);

    if (!result.success) {
      const newErrors = { name: '', email: '', phone: '', projectSubject: '', message: '' };
      result.error.issues.forEach((err) => {
        const fieldName = err.path[0] as keyof typeof newErrors;
        if (fieldName && !newErrors[fieldName]) {
          newErrors[fieldName] = err.message;
        }
      });
      setErrors(newErrors);
      setTouched({ name: true, email: true, phone: true, message: true });
      return false;
    }

    setErrors({ name: '', email: '', phone: '', projectSubject: '', message: '' });
    setTouched({ name: true, email: true, phone: true, message: true });
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Clear error/validate dynamically as user types
    if (touched[name as keyof typeof touched] || value.length > 2 || name === 'phone') {
      validateField(name, value);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    trackCTA('Contact Form Submit', 'Contact Section', {
      subject: formData.projectSubject || 'General Inquiry',
    });

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setIsSubmitted(true);
    setShowToast(true);
    setFormData({
      name: '',
      email: '',
      phone: '',
      projectSubject: '',
      message: '',
    });
    setTouched({
      name: false,
      email: false,
      phone: false,
      message: false,
    });
  };

  return (
    <>
      {/* Completely Transparent Outer Card Container */}
      <div className={`w-full max-w-6xl mx-auto bg-transparent border-none rounded-3xl p-0 transition-all duration-300 relative overflow-visible z-10 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
        
        {/* Subtle decorative gradient highlights */}
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-32 h-32 bg-[#F7941D]/5 rounded-full blur-2xl group-hover:bg-[#F7941D]/10 transition-colors duration-300 pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-32 h-32 bg-[#A359FF]/5 rounded-full blur-2xl group-hover:bg-[#A359FF]/10 transition-colors duration-300 pointer-events-none" />

        {/* Cohesive 50/50 Balanced Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-stretch relative z-10">
          
          {/* RIGHT COLUMN: BRAND & CONTACT PANEL (6 COLS Equivalent via lg:grid-cols-2) */}
          <div className={`flex flex-col justify-between h-full py-2 ${dir === 'rtl' ? 'lg:border-l lg:border-white/10 lg:pl-10' : 'lg:border-r lg:border-white/10 lg:pr-10'}`}>
            
            <div>
              {/* Brand Logo - Compact Size */}
              <div className="mb-4 flex justify-start">
                <LocalMonaLogo size={52} className="hover:scale-105 transition-transform duration-300" />
              </div>

              <h3 className="text-lg sm:text-xl lg:text-2xl font-black text-white mb-2 tracking-tight leading-snug">
                {t('contact.stayInTouch')}
              </h3>
              <p className="text-gray-400 text-xs leading-relaxed font-light mb-5">
                {t('contact.description')}
              </p>

              {/* Contact List (Compact, Borderless, Sleek rows) */}
              <div className="flex flex-col border-y border-white/5 mb-5">
                
                {/* Phone block */}
                <div className="py-2.5 flex items-center justify-between group border-b border-white/5 last:border-0">
                  <div className={`flex items-center gap-4 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                    <div className="text-[#F7941D] group-hover:scale-110 transition-transform duration-300 shrink-0">
                      <Phone size={18} className="stroke-[1.5]" />
                    </div>
                    <div>
                      <span className="text-gray-500 text-[10px] block mb-0.5 font-medium">{t('contact.phoneLabel')}</span>
                      <a 
                        href={`tel:${t('contact.phoneValue')}`} 
                        className="text-white text-xs sm:text-sm font-bold tracking-wider hover:text-[#F7941D] transition-colors dir-ltr block"
                      >
                        {t('contact.phoneValue')}
                      </a>
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleCopyPhone}
                    className="w-8 h-8 rounded-lg bg-white/[0.02] hover:bg-white/[0.08] text-gray-400 hover:text-white transition-all cursor-pointer flex items-center justify-center border border-white/5 active:scale-95"
                    title={language === 'ar' ? 'نسخ الرقم' : 'Copy number'}
                    aria-label={language === 'ar' ? 'نسخ رقم الهاتف' : 'Copy phone number'}
                  >
                    {copiedPhone ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
                  </button>
                </div>

                {/* Email block */}
                <div className="py-2.5 flex items-center justify-between group border-b border-white/5 last:border-0">
                  <div className={`flex items-center gap-4 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                    <div className="text-[#F7941D] group-hover:scale-110 transition-transform duration-300 shrink-0">
                      <Mail size={18} className="stroke-[1.5]" />
                    </div>
                    <div>
                      <span className="text-gray-500 text-[10px] block mb-0.5 font-medium">{t('contact.officialEmail')}</span>
                      <a 
                        href={`mailto:${t('contact.emailValue')}`} 
                        className="text-white text-xs sm:text-sm font-bold hover:text-[#F7941D] transition-colors block"
                      >
                        {t('contact.emailValue')}
                      </a>
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleCopyEmail}
                    className="w-8 h-8 rounded-lg bg-white/[0.02] hover:bg-white/[0.08] text-gray-400 hover:text-white transition-all cursor-pointer flex items-center justify-center border border-white/5 active:scale-95"
                    title={t('contact.copyEmail')}
                    aria-label={t('contact.copyEmail')}
                  >
                    {copiedEmail ? <Check size={13} className="text-green-400" /> : <Copy size={13} />}
                  </button>
                </div>

                {/* Location block */}
                <div className={`py-2.5 flex items-center gap-4 ${dir === 'rtl' ? 'text-right' : 'text-left'} last:border-0`}>
                  <div className="text-[#F7941D] shrink-0">
                    <MapPin size={18} className="stroke-[1.5]" />
                  </div>
                  <div>
                    <span className="text-gray-500 text-[10px] block mb-0.5 font-medium">{language === 'ar' ? 'المقر المعتمد' : 'Official Location'}</span>
                    <span className="text-white text-xs sm:text-sm font-bold">
                      {language === 'ar' ? 'الجمهورية اليمنية' : 'Republic of Yemen'}
                    </span>
                  </div>
                </div>

              </div>
            </div>

            {/* Centralized Dynamic Social Footer Hub */}
            <div className="pt-1">
              <h4 className={`text-gray-400 text-[10px] font-semibold mb-2.5 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>{t('contact.socialPlatforms')}</h4>
              <div className="flex flex-wrap gap-2 justify-start">
                <DynamicSocialLink 
                  href={t('contact.whatsappLink')}
                  label={language === 'ar' ? 'واتساب' : 'WhatsApp'}
                  handle={t('contact.phoneValue')}
                  colorClass="bg-gradient-to-r from-emerald-500 to-teal-600"
                  icon={<MessageCircle size={18} className="stroke-[1.8]" />}
                />
                <DynamicSocialLink 
                  href={t('contact.instagramLink')}
                  label={language === 'ar' ? 'إنستغرام' : 'Instagram'}
                  handle={t('contact.instagramLink').split('/').filter(Boolean).pop() ? `@${t('contact.instagramLink').split('/').filter(Boolean).pop()}` : '@7l9iz'}
                  colorClass="bg-gradient-to-r from-pink-500 via-red-500 to-purple-600"
                  icon={<Instagram size={18} className="stroke-[1.8]" />}
                />
                <DynamicSocialLink 
                  href={t('contact.facebookLink')}
                  label={language === 'ar' ? 'فيسبوك' : 'Facebook'}
                  handle={language === 'ar' ? 'مانع عزالدين' : 'Manea Ezzeddine'}
                  colorClass="bg-gradient-to-r from-blue-600 to-indigo-700"
                  icon={<Facebook size={18} className="stroke-[1.8]" />}
                />
              </div>
            </div>

          </div>

          {/* LEFT COLUMN: PROJECT REQUEST FORM (6 COLS Equivalent via lg:grid-cols-2) */}
          <div className="flex flex-col h-full justify-between py-2">
            
            <AnimatePresence mode="wait">
              {!isSubmitted ? (
                <motion.form
                  key="project-form"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-4 h-full justify-between"
                  noValidate
                >
                  <div>
                    {/* Form Heading - Compact */}
                    <div className={`${dir === 'rtl' ? 'text-right' : 'text-left'} border-b border-white/5 pb-3 mb-4`}>
                      <h3 className="text-base sm:text-lg font-black text-white mb-1 flex items-center justify-start gap-2">
                        <Briefcase size={18} className="text-[#F7941D] stroke-[1.5]" />
                        <span>{language === 'ar' ? 'خطط لمشروعك الإبداعي الجديد' : 'Plan Your New Creative Project'}</span>
                      </h3>
                      <p className="text-gray-400 text-xs font-light leading-relaxed">
                        {language === 'ar' ? 'يرجى تزويدي بالمتطلبات الأساسية ليتسنى لي دراسة رؤية مشروعك بدقة وتقديم حلول إبداعية متكاملة.' : 'Please share your key details so I can study your project and deliver tailored, comprehensive creative solutions.'}
                      </p>
                    </div>

                    {/* Grid of Name & Email */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      
                      {/* Full Name */}
                      <div className={`flex flex-col gap-1.5 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                        <label htmlFor="name" className="text-gray-300 text-[10px] font-bold flex items-center justify-between w-full">
                          <span className="flex items-center gap-1.5">
                            <User size={12} className="text-[#F7941D]" />
                            <span>{t('contact.fullName')} <span className="text-[#F7941D]">*</span></span>
                          </span>
                          {formData.name.trim().length >= 3 && !errors.name && (
                            <span className="text-emerald-400 text-[9px] font-medium flex items-center gap-0.5">
                              <Check size={10} />
                              {language === 'ar' ? 'ممتاز' : 'Looks good'}
                            </span>
                          )}
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          onBlur={() => handleBlur('name')}
                          placeholder={language === 'ar' ? 'مثال: مانع عزالدين' : 'e.g. Manea Izz'}
                          className={`w-full px-3.5 py-2 bg-white/[0.02] focus:bg-white/[0.04] rounded-xl text-white placeholder-gray-600 border focus:outline-none transition-all duration-300 text-xs ${
                            errors.name 
                              ? 'border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/15' 
                              : touched.name && formData.name.trim().length >= 3
                                ? 'border-emerald-500/50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/15 bg-emerald-500/[0.01]'
                                : 'border-white/10 focus:border-[#F7941D] focus:ring-2 focus:ring-[#F7941D]/15 hover:border-white/20'
                          }`}
                        />
                        {errors.name && (
                          <p className={`text-red-400 text-[10px] flex items-center gap-1 mt-0.5 ${dir === 'rtl' ? 'mr-1' : 'ml-1'}`}>
                            <AlertCircle size={10} />
                            {errors.name}
                          </p>
                        )}
                      </div>

                      {/* Email */}
                      <div className={`flex flex-col gap-1.5 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                        <label htmlFor="email" className="text-gray-300 text-[10px] font-bold flex items-center justify-between w-full">
                          <span className="flex items-center gap-1.5">
                            <Mail size={12} className="text-[#F7941D]" />
                            <span>{t('contact.emailLabel')} <span className="text-[#F7941D]">*</span></span>
                          </span>
                          {formData.email.trim() && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim()) && !errors.email && (
                            <span className="text-emerald-400 text-[9px] font-medium flex items-center gap-0.5">
                              <Check size={10} />
                              {language === 'ar' ? 'صالح' : 'Valid'}
                            </span>
                          )}
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          onBlur={() => handleBlur('email')}
                          placeholder="name@example.com"
                          dir="ltr"
                          className={`w-full px-3.5 py-2 bg-white/[0.02] focus:bg-white/[0.04] rounded-xl text-white placeholder-gray-600 border focus:outline-none transition-all duration-300 ${dir === 'rtl' ? 'text-right' : 'text-left'} text-xs ${
                            errors.email 
                              ? 'border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/15' 
                              : touched.email && formData.email.trim() && !errors.email
                                ? 'border-emerald-500/50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/15 bg-emerald-500/[0.01]'
                                : 'border-white/10 focus:border-[#F7941D] focus:ring-2 focus:ring-[#F7941D]/15 hover:border-white/20'
                          }`}
                        />
                        {errors.email && (
                          <p className={`text-red-400 text-[10px] flex items-center gap-1 mt-0.5 ${dir === 'rtl' ? 'mr-1' : 'ml-1'}`}>
                            <AlertCircle size={10} />
                            {errors.email}
                          </p>
                        )}
                      </div>

                    </div>

                    {/* Grid of Phone & Project Subject */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">

                      {/* Phone Input */}
                      <div className={`flex flex-col gap-1.5 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                        <label htmlFor="phone" className="text-gray-300 text-[10px] font-bold flex items-center justify-between w-full">
                          <span className="flex items-center gap-1.5">
                            <Phone size={12} className="text-[#F7941D]" />
                            <span>{t('contact.phoneLabel')} <span className="text-[#F7941D]">*</span></span>
                          </span>
                          {formData.phone.trim() && /^[\d\s+\-()]{7,20}$/.test(formData.phone.trim()) && !errors.phone && (
                            <span className="text-emerald-400 text-[9px] font-medium flex items-center gap-0.5">
                              <Check size={10} />
                              {language === 'ar' ? 'صالح' : 'Valid'}
                            </span>
                          )}
                        </label>
                        <input
                          type="text"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          onBlur={() => handleBlur('phone')}
                          placeholder={language === 'ar' ? 'مثال: +967 772 655 825' : 'e.g. +967 772 655 825'}
                          dir="ltr"
                          className={`w-full px-3.5 py-2 bg-white/[0.02] focus:bg-white/[0.04] rounded-xl text-white placeholder-gray-600 border focus:outline-none transition-all duration-300 ${dir === 'rtl' ? 'text-right' : 'text-left'} text-xs ${
                            errors.phone 
                              ? 'border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/15' 
                              : touched.phone && formData.phone.trim() && !errors.phone
                                ? 'border-emerald-500/50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/15 bg-emerald-500/[0.01]'
                                : 'border-white/10 focus:border-[#F7941D] focus:ring-2 focus:ring-[#F7941D]/15 hover:border-white/20'
                          }`}
                        />
                        {errors.phone && (
                          <p className={`text-red-400 text-[10px] flex items-center gap-1 mt-0.5 ${dir === 'rtl' ? 'mr-1' : 'ml-1'}`}>
                            <AlertCircle size={10} />
                            {errors.phone}
                          </p>
                        )}
                      </div>

                      {/* Project Subject Input */}
                      <div className={`flex flex-col gap-1.5 ${dir === 'rtl' ? 'text-right' : 'text-left'}`}>
                        <label htmlFor="projectSubject" className={`text-gray-300 text-[10px] font-bold ${dir === 'rtl' ? 'mr-1' : 'ml-1'} flex items-center gap-1.5`}>
                          <Layers size={12} className="text-[#F7941D]" />
                          <span>{t('contact.selectService')}</span>
                        </label>
                        <input
                          type="text"
                          id="projectSubject"
                          name="projectSubject"
                          value={formData.projectSubject}
                          onChange={handleChange}
                          placeholder={language === 'ar' ? 'مثال: تصميم هوية بصرية كاملة' : 'e.g. Full Visual Identity Design'}
                          className={`w-full px-3.5 py-2 bg-white/[0.02] focus:bg-white/[0.04] rounded-xl text-white placeholder-gray-600 border border-white/10 focus:border-[#F7941D] focus:ring-2 focus:ring-[#F7941D]/15 hover:border-white/20 focus:outline-none transition-all duration-300 ${dir === 'rtl' ? 'text-right' : 'text-left'} text-xs`}
                        />
                      </div>

                    </div>

                    {/* Project details / requirements */}
                    <div className={`flex flex-col gap-1.5 ${dir === 'rtl' ? 'text-right' : 'text-left'} mb-4`}>
                      <label htmlFor="message" className="text-gray-300 text-[10px] font-bold flex items-center justify-between w-full">
                        <span className="flex items-center gap-1.5">
                          <FileText size={12} className="text-[#F7941D]" />
                          <span>{t('contact.msgLabel')} <span className="text-[#F7941D]">*</span></span>
                        </span>
                        {formData.message.trim().length >= 10 && !errors.message && (
                          <span className="text-emerald-400 text-[9px] font-medium flex items-center gap-0.5">
                            <Check size={10} />
                            {language === 'ar' ? 'جاهز' : 'Ready'}
                          </span>
                        )}
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={3}
                        value={formData.message}
                        onChange={handleChange}
                        onBlur={() => handleBlur('message')}
                        placeholder={language === 'ar' ? 'اكتب فكرة مشروعك، الألوان المفضلة، متطلبات العمل، وأي معلومات تساعدنا على البدء...' : 'Write your project idea, preferred colors, requirements, and any starting details...'}
                        className={`w-full px-3.5 py-2 bg-white/[0.02] focus:bg-white/[0.04] rounded-xl text-white placeholder-gray-600 border focus:outline-none transition-all duration-300 resize-none ${dir === 'rtl' ? 'text-right' : 'text-left'} text-xs ${
                          errors.message 
                            ? 'border-red-500/50 focus:border-red-500 focus:ring-2 focus:ring-red-500/15' 
                            : touched.message && formData.message.trim().length >= 10
                              ? 'border-emerald-500/50 focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/15 bg-emerald-500/[0.01]'
                              : 'border-white/10 focus:border-[#F7941D] focus:ring-2 focus:ring-[#F7941D]/15 hover:border-white/20'
                        }`}
                      />
                      {errors.message && (
                        <p className={`text-red-400 text-[10px] flex items-center gap-1 mt-0.5 ${dir === 'rtl' ? 'mr-1' : 'ml-1'}`}>
                          <AlertCircle size={10} />
                          {errors.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Submit Button - Compact */}
                  <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    whileTap={{ scale: 0.99 }}
                    className="w-full py-3 bg-[#F7941D] hover:bg-[#ffaa3a] text-white font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-[#F7941D]/10 hover:shadow-[#F7941D]/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-xs font-sans"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span>{language === 'ar' ? 'جاري إرسال بيانات مشروعك...' : 'Sending project details...'}</span>
                      </>
                    ) : (
                      <>
                        <Send size={13} className={dir === 'rtl' ? 'rotate-180' : ''} />
                        <span>{language === 'ar' ? 'إرسال تفاصيل المشروع' : 'Send Project Details'}</span>
                      </>
                    )}
                  </motion.button>

                </motion.form>
              ) : (
                <motion.div
                  key="success-message"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 180 }}
                  className="flex flex-col items-center justify-center text-center py-6 px-4 h-full"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, type: 'spring', stiffness: 220, damping: 12 }}
                    className="w-12 h-12 bg-green-500/10 text-green-400 rounded-2xl flex items-center justify-center mb-4 border border-green-500/20 shadow-sm"
                  >
                    <CheckCircle2 size={24} />
                  </motion.div>
                  <h3 className="text-white text-base font-black mb-1">{language === 'ar' ? 'تم الإرسال بنجاح!' : 'Sent Successfully!'}</h3>
                  <p className="text-gray-300 text-xs max-w-xs mb-4 leading-relaxed font-light">
                    {t('contact.successSubmit')}
                  </p>
                  <motion.button
                    onClick={() => setIsSubmitted(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-5 py-2 bg-[#F7941D] hover:bg-[#ffaa3a] rounded-xl text-white text-[11px] font-bold transition-all duration-300 cursor-pointer shadow-md shadow-[#F7941D]/10"
                  >
                    {language === 'ar' ? 'إرسال تفاصيل أخرى' : 'Send Another Request'}
                  </motion.button>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>

      </div>

      {/* Toast Notification for submission success */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9, transition: { duration: 0.2 } }}
            className={`fixed bottom-6 ${dir === 'rtl' ? 'right-6' : 'left-6'} z-[100000] max-w-sm w-[calc(100vw-3rem)] sm:w-full bg-[#2A1151]/95 backdrop-blur-md border border-emerald-500/30 rounded-2xl shadow-[0_12px_40px_rgba(0,0,0,0.6)] overflow-hidden ${dir === 'rtl' ? 'text-right' : 'text-left'}`}
          >
            <div className={`p-4 sm:p-5 flex items-start gap-4 ${dir === 'rtl' ? 'flex-row-reverse' : 'flex-row'}`}>
              {/* Green indicator icon */}
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex items-center justify-center shrink-0 shadow-inner">
                <CheckCircle2 size={22} />
              </div>

              {/* Toast content */}
              <div className="flex-1 min-w-0">
                <h4 className="text-white text-sm sm:text-base font-black mb-1">{language === 'ar' ? 'تم إرسال الرسالة بنجاح!' : 'Message Sent Successfully!'}</h4>
                <p className="text-gray-300 text-[11px] sm:text-xs leading-relaxed font-light">
                  {t('contact.successShort')}
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowToast(false)}
                className="text-gray-400 hover:text-white transition-colors duration-200 shrink-0 mt-0.5 cursor-pointer"
                title={language === 'ar' ? 'إغلاق' : 'Close'}
              >
                <X size={16} />
              </button>
            </div>

            {/* Decreasing/shrinking loading/progress bar at the bottom */}
            <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-white/5">
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 5, ease: "linear" }}
                className="h-full bg-gradient-to-l from-[#F7941D] to-emerald-500 origin-right"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
