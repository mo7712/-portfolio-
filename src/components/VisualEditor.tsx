import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, Save, X, Edit3, Image as ImageIcon, Globe, Check, 
  RefreshCw, LayoutDashboard, Zap, FileText, Upload, Copy, Lock
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

// WebP image conversion utility
export const convertToWebP = (
  imageUrl: string,
  quality = 0.85,
  maxWidth = 1600,
  maxHeight = 1600
): Promise<{ webpDataUrl: string; originalSize: number; newSize: number; savedPercent: number }> => {
  return new Promise((resolve, reject) => {
    if (!imageUrl) {
      reject(new Error("No image URL provided"));
      return;
    }
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      let width = img.width;
      let height = img.height;

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
        reject(new Error("Canvas context failed"));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      const webpDataUrl = canvas.toDataURL('image/webp', quality);
      const originalSize = imageUrl.length;
      const newSize = webpDataUrl.length;
      const savedPercent = originalSize > 0 ? Math.max(0, Math.round(((originalSize - newSize) / originalSize) * 100)) : 0;

      resolve({ webpDataUrl, originalSize, newSize, savedPercent });
    };
    img.onerror = () => {
      reject(new Error("Failed to load image for WebP conversion"));
    };
    img.src = imageUrl;
  });
};

interface VisualEditorBarProps {
  onOpenAdmin: () => void;
}

export const VisualEditorBar: React.FC<VisualEditorBarProps> = ({ onOpenAdmin }) => {
  const { 
    language, 
    setIsVisualEditorActive, 
    customTranslations, 
    setAllCustomTranslations,
    saveAdminData,
    t
  } = useLanguage();

  const [isSaving, setIsSaving] = useState(false);
  const [isTranslatingAll, setIsTranslatingAll] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setNotification(msg);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleSaveAllEdits = async () => {
    setIsSaving(true);
    try {
      await saveAdminData({
        customTranslations
      });
      showToast(language === 'ar' ? '💾 تم حفظ جميع التعديلات البصرية وتحديث الموقع بنجاح!' : '💾 All visual edits saved & published successfully!');
    } catch (e) {
      showToast(language === 'ar' ? 'حدث خطأ أثناء الحفظ' : 'Error saving edits');
    } finally {
      setIsSaving(false);
    }
  };

  const handleTranslateAllEdits = async () => {
    setIsTranslatingAll(true);
    try {
      // Find all custom translations keys in AR
      const arKeys = Object.keys(customTranslations.ar || {});
      const arValues = arKeys.map(k => customTranslations.ar[k] || '');

      if (arValues.length === 0) {
        showToast(language === 'ar' ? 'لا توجد نصوص مخصصة للترجمة' : 'No custom text to translate');
        setIsTranslatingAll(false);
        return;
      }

      const res = await fetch('/api/admin/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texts: arValues })
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.translated)) {
        const updatedEn = { ...customTranslations.en };
        arKeys.forEach((key, idx) => {
          if (data.translated[idx]) {
            updatedEn[key] = data.translated[idx];
          }
        });
        setAllCustomTranslations({
          ...customTranslations,
          en: updatedEn
        });
        showToast(language === 'ar' ? '✨ تمت ترجمة جميع النصوص المعدلة إلى الإنجليزية 100% بنجاح!' : '✨ All edited texts translated to English 100% successfully!');
      } else {
        showToast(language === 'ar' ? 'فشلت الترجمة التلقائية' : 'Translation failed');
      }
    } catch (e) {
      showToast(language === 'ar' ? 'حدث خطأ أثناء الترجمة' : 'Error during batch translation');
    } finally {
      setIsTranslatingAll(false);
    }
  };

  return (
    <div className="fixed top-0 inset-x-0 z-[9999] bg-[#120B20]/95 border-b border-[#F7941D]/40 backdrop-blur-md text-white px-4 py-2.5 shadow-2xl transition-all">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
        
        {/* Left Badge */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#F7941D] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#F7941D]"></span>
          </span>
          <div className="flex items-center gap-1.5 font-bold text-amber-300">
            <Sparkles size={16} className="text-[#F7941D]" />
            <span>{language === 'ar' ? '🎨 وضع التعديل البصري المباشر (Visual Live Editor)' : '🎨 Visual Live Editor Active'}</span>
          </div>
          <span className="hidden md:inline-block text-[10px] text-gray-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10 font-mono">
            {language === 'ar' ? 'انقر على أي عنصر للتعديل الحي' : 'Click any element to edit inline'}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleSaveAllEdits}
            disabled={isSaving}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
          >
            <Save size={14} />
            <span>{isSaving ? (language === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (language === 'ar' ? '💾 حفظ التعديلات' : 'Save Edits')}</span>
          </button>

          <button
            type="button"
            onClick={handleTranslateAllEdits}
            disabled={isTranslatingAll}
            className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:opacity-90 text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer shadow-md transition-all active:scale-95"
          >
            <Globe size={14} />
            <span>{isTranslatingAll ? (language === 'ar' ? 'جاري الترجمة...' : 'Translating...') : (language === 'ar' ? '✨ ترجمة للإنجليزية' : '✨ Translate All')}</span>
          </button>

          <button
            type="button"
            onClick={onOpenAdmin}
            className="px-3 py-1.5 bg-white/10 hover:bg-white/20 border border-white/15 text-gray-200 hover:text-white font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-all"
          >
            <LayoutDashboard size={14} />
            <span className="hidden sm:inline">{language === 'ar' ? 'لوحة التحكم' : 'Admin Panel'}</span>
          </button>

          <button
            type="button"
            onClick={() => setIsVisualEditorActive(false)}
            className="px-2.5 py-1.5 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 text-red-300 hover:text-red-200 font-bold rounded-xl flex items-center gap-1 cursor-pointer transition-all"
            title={language === 'ar' ? 'إغلاق التعديل البصري' : 'Close Visual Editor'}
          >
            <X size={15} />
            <span>{language === 'ar' ? 'إغلاق' : 'Close'}</span>
          </button>
        </div>
      </div>

      {/* Toast Notification */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-4 py-2 bg-[#F7941D] text-white font-bold text-xs rounded-full shadow-2xl border border-amber-300 flex items-center gap-2 z-[10000]"
          >
            <Sparkles size={14} />
            <span>{notification}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Inline Editable Text Wrapper
interface EditableTextProps {
  textKey: string;
  fallbackText?: string;
  className?: string;
  as?: 'span' | 'p' | 'h1' | 'h2' | 'h3' | 'h4' | 'div';
  multiline?: boolean;
  children?: React.ReactNode;
}

export const EditableText: React.FC<EditableTextProps> = ({
  textKey,
  fallbackText = '',
  className = '',
  as = 'span',
  multiline = false,
  children
}) => {
  const { isVisualEditorActive, t, updateTranslationKey, language, customTranslations } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [valAr, setValAr] = useState('');
  const [valEn, setValEn] = useState('');
  const [isTranslating, setIsTranslating] = useState(false);

  const currentText = t(textKey) || fallbackText;

  const handleStartEdit = (e: React.MouseEvent) => {
    if (!isVisualEditorActive) return;
    e.preventDefault();
    e.stopPropagation();

    const arVal = customTranslations?.ar?.[textKey] !== undefined 
      ? customTranslations.ar[textKey] 
      : (language === 'ar' ? currentText : (t(textKey) || fallbackText));
    const enVal = customTranslations?.en?.[textKey] !== undefined 
      ? customTranslations.en[textKey] 
      : (language === 'en' ? currentText : (t(textKey) || fallbackText));

    setValAr(arVal || '');
    setValEn(enVal || '');
    setIsEditing(true);
  };

  const handleSave = () => {
    updateTranslationKey(textKey, valAr, 'ar');
    updateTranslationKey(textKey, valEn, 'en');
    setIsEditing(false);
  };

  const handleTranslateSingle = async () => {
    if (!valAr.trim()) return;
    setIsTranslating(true);
    try {
      const res = await fetch('/api/admin/translate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ textAr: valAr })
      });
      const data = await res.json();
      if (data.success && data.translated) {
        setValEn(data.translated);
      }
    } catch (e) {
      console.error("Single translation error:", e);
    } finally {
      setIsTranslating(false);
    }
  };

  const ElementTag = as as any;

  if (!isVisualEditorActive) {
    return children ? <>{children}</> : <ElementTag className={className}>{currentText}</ElementTag>;
  }

  const modalContent = (
    <AnimatePresence>
      {isEditing && (
        <div className="fixed inset-0 z-[100000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 text-white text-xs font-sans">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-[#1A122E] border-2 border-[#F7941D] rounded-3xl p-5 max-w-lg w-full space-y-4 shadow-2xl relative"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Edit3 size={16} className="text-[#F7941D]" />
                <h4 className="font-extrabold text-sm text-white">
                  {language === 'ar' ? 'تعديل النص مباشر (Inline Edit)' : 'Inline Text Editor'}
                </h4>
              </div>
              <span className="text-[10px] font-mono text-gray-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                {textKey}
              </span>
            </div>

            {/* Arabic Input */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-amber-300 block">
                {language === 'ar' ? 'النص بالعربية (Arabic):' : 'Arabic Text:'}
              </label>
              {multiline ? (
                <textarea
                  rows={3}
                  value={valAr}
                  onChange={(e) => setValAr(e.target.value)}
                  className="w-full bg-black/50 border border-white/15 rounded-xl p-2.5 text-white focus:border-[#F7941D] outline-none"
                />
              ) : (
                <input
                  type="text"
                  value={valAr}
                  onChange={(e) => setValAr(e.target.value)}
                  className="w-full bg-black/50 border border-white/15 rounded-xl p-2.5 text-white focus:border-[#F7941D] outline-none"
                />
              )}
            </div>

            {/* English Input & Auto Translate */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-[11px] font-bold text-indigo-300 block">
                  {language === 'ar' ? 'النص بالإنجليزية (English):' : 'English Text:'}
                </label>
                <button
                  type="button"
                  onClick={handleTranslateSingle}
                  disabled={isTranslating}
                  className="text-[10px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-bold cursor-pointer"
                >
                  <Sparkles size={11} />
                  <span>{isTranslating ? (language === 'ar' ? 'ترجمة...' : 'Translating...') : (language === 'ar' ? '✨ ترجمة ذكية' : '✨ Auto Translate')}</span>
                </button>
              </div>
              {multiline ? (
                <textarea
                  rows={3}
                  value={valEn}
                  onChange={(e) => setValEn(e.target.value)}
                  className="w-full bg-black/50 border border-white/15 rounded-xl p-2.5 text-white focus:border-[#F7941D] outline-none"
                />
              ) : (
                <input
                  type="text"
                  value={valEn}
                  onChange={(e) => setValEn(e.target.value)}
                  className="w-full bg-black/50 border border-white/15 rounded-xl p-2.5 text-white focus:border-[#F7941D] outline-none"
                />
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-gray-300 rounded-xl font-bold cursor-pointer transition-colors"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-1.5 bg-[#F7941D] hover:bg-amber-600 text-white font-bold rounded-xl cursor-pointer shadow-lg transition-all"
              >
                {language === 'ar' ? 'تطبيق وحفظ' : 'Apply & Save'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <ElementTag
        onClick={handleStartEdit}
        className={`${className} relative group cursor-pointer transition-all hover:outline hover:outline-2 hover:outline-dashed hover:outline-[#F7941D] hover:bg-[#F7941D]/10 rounded px-1 py-0.5 inline-block`}
        title={language === 'ar' ? `تعديل بصري حي: ${textKey}` : `Visual edit: ${textKey}`}
      >
        {children || currentText}
        <span className="opacity-0 group-hover:opacity-100 absolute -top-3 -right-3 bg-[#F7941D] text-white p-1 rounded-full shadow-lg transition-opacity z-20">
          <Edit3 size={11} />
        </span>
      </ElementTag>

      {typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent}
    </>
  );
};

// Inline Editable Image Component
interface EditableImageProps {
  imageKey: string;
  src: string;
  alt?: string;
  className?: string;
  onImageChange?: (newUrl: string) => void;
}

export const EditableImage: React.FC<EditableImageProps> = ({
  imageKey,
  src,
  alt = '',
  className = '',
  onImageChange
}) => {
  const { isVisualEditorActive, updateTranslationKey, language } = useLanguage();
  const [isEditing, setIsEditing] = useState(false);
  const [imageUrl, setImageUrl] = useState(src);
  const [isConverting, setIsConverting] = useState(false);
  const [conversionMsg, setConversionMsg] = useState<string | null>(null);

  const handleOpenEdit = (e: React.MouseEvent) => {
    if (!isVisualEditorActive) return;
    e.preventDefault();
    e.stopPropagation();
    setImageUrl(src);
    setIsEditing(true);
  };

  const handleSave = () => {
    if (onImageChange) {
      onImageChange(imageUrl);
    } else {
      updateTranslationKey(imageKey, imageUrl, 'ar');
      updateTranslationKey(imageKey, imageUrl, 'en');
    }
    setIsEditing(false);
  };

  const handleConvertWebP = async () => {
    if (!imageUrl) return;
    setIsConverting(true);
    try {
      const res = await convertToWebP(imageUrl, 0.85);
      setImageUrl(res.webpDataUrl);
      setConversionMsg(
        language === 'ar'
          ? `⚡ تم تحويل الصورة لـ WebP بنجاح (وفرت ${res.savedPercent}% من الحجم)!`
          : `⚡ Converted to WebP successfully (Saved ${res.savedPercent}% size)!`
      );
    } catch (err) {
      setConversionMsg(language === 'ar' ? 'فشل تحويل الصورة إلى WebP' : 'Failed to convert to WebP');
    } finally {
      setIsConverting(false);
    }
  };

  if (!isVisualEditorActive) {
    return <img src={src} alt={alt} className={className} referrerPolicy="no-referrer" />;
  }

  const imageModalContent = (
    <AnimatePresence>
      {isEditing && (
        <div className="fixed inset-0 z-[100000] bg-black/80 backdrop-blur-md flex items-center justify-center p-4 text-white text-xs font-sans">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-[#1A122E] border-2 border-[#F7941D] rounded-3xl p-5 max-w-md w-full space-y-4 shadow-2xl"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <ImageIcon size={16} className="text-[#F7941D]" />
                <h4 className="font-extrabold text-sm text-white">
                  {language === 'ar' ? 'تعديل رابط الصورة وتغيير الصيغة' : 'Edit Image & Format'}
                </h4>
              </div>
              <span className="text-[10px] font-mono text-gray-400 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                {imageKey}
              </span>
            </div>

            {/* Preview */}
            <div className="w-full h-40 bg-black/60 rounded-2xl border border-white/10 overflow-hidden flex items-center justify-center p-2">
              {imageUrl ? (
                <img src={imageUrl} alt="Preview" className="max-h-full max-w-full object-contain rounded-xl" referrerPolicy="no-referrer" />
              ) : (
                <span className="text-gray-500">{language === 'ar' ? 'لا توجد صورة' : 'No image'}</span>
              )}
            </div>

            {/* URL Input */}
            <div className="space-y-1">
              <label className="text-[11px] font-bold text-amber-300 block">
                {language === 'ar' ? 'رابط الصورة (Image URL / Data Base64):' : 'Image URL / Base64:'}
              </label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="w-full bg-black/50 border border-white/15 rounded-xl p-2.5 text-white focus:border-[#F7941D] outline-none text-xs font-mono"
              />
            </div>

            {/* Convert to WebP button */}
            <button
              type="button"
              onClick={handleConvertWebP}
              disabled={isConverting || !imageUrl}
              className="w-full py-2 bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-90 text-white font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-md transition-all"
            >
              <Zap size={14} />
              <span>{isConverting ? (language === 'ar' ? 'جاري الضغط والتحويل...' : 'Converting...') : (language === 'ar' ? '⚡ تحويل الصورة إلى WebP (تخفيف الحجم والسرعة)' : '⚡ Convert Image to WebP')}</span>
            </button>

            {conversionMsg && (
              <p className="text-[11px] font-bold text-emerald-400 text-center bg-emerald-500/10 p-2 rounded-xl border border-emerald-500/20">
                {conversionMsg}
              </p>
            )}

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-gray-300 rounded-xl font-bold cursor-pointer"
              >
                {language === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="px-4 py-1.5 bg-[#F7941D] hover:bg-amber-600 text-white font-bold rounded-xl cursor-pointer shadow-lg"
              >
                {language === 'ar' ? 'تطبيق وحفظ' : 'Apply & Save'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      <div onClick={handleOpenEdit} className="relative group cursor-pointer inline-block w-full h-full">
        <img src={src} alt={alt} className={`${className} hover:opacity-80 transition-opacity`} referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-[#F7941D]/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-2xl">
          <span className="bg-[#120B20] text-white px-3 py-1.5 rounded-full text-xs font-bold border border-[#F7941D] flex items-center gap-1.5 shadow-xl">
            <ImageIcon size={14} className="text-[#F7941D]" />
            <span>{language === 'ar' ? 'تعديل الصورة / WebP' : 'Edit Image / WebP'}</span>
          </span>
        </div>
      </div>

      {typeof document !== 'undefined' ? createPortal(imageModalContent, document.body) : imageModalContent}
    </>
  );
};
