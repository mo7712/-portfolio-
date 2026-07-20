import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, Lock, LayoutDashboard, FolderPlus, Settings, FileCode, Plus, Trash2, Edit2, 
  Save, Eye, CheckCircle, AlertTriangle, HelpCircle, Image as ImageIcon, 
  ChevronRight, Globe, KeyRound, LogOut, Copy, RefreshCw 
} from 'lucide-react';
import * as LucideIcons from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { PortfolioItem, CategoryItem } from '../types';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ImageFileUploaderProps {
  onUpload: (url: string) => void;
  className?: string;
  multiple?: boolean;
}

const compressImage = (base64Str: string, maxWidth = 1000, maxHeight = 1000, quality = 0.7): Promise<string> => {
  return new Promise((resolve) => {
    // If it's not an image, or is an animated GIF, or SVG, bypass compression to prevent losing animation/quality
    if (
      !base64Str.startsWith('data:image/') || 
      base64Str.startsWith('data:image/gif') || 
      base64Str.startsWith('data:image/svg') || 
      base64Str.includes('image/gif') || 
      base64Str.includes('image/svg')
    ) {
      resolve(base64Str);
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
        resolve(base64Str);
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      
      const isPng = base64Str.includes('image/png') || base64Str.includes('image/svg');
      const format = isPng ? 'image/png' : 'image/jpeg';
      const compressedDataUrl = canvas.toDataURL(format, format === 'image/jpeg' ? quality : undefined);
      
      resolve(compressedDataUrl.length < base64Str.length ? compressedDataUrl : base64Str);
    };
    img.onerror = () => {
      resolve(base64Str);
    };
    img.src = base64Str;
  });
};

const isVideoUrl = (url: string | undefined): boolean => {
  if (!url) return false;
  const lowercaseUrl = url.toLowerCase().trim();
  if (lowercaseUrl.startsWith('data:video/')) return true;
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.m4v'];
  return (
    videoExtensions.some(ext => lowercaseUrl.includes(ext)) ||
    lowercaseUrl.includes('youtube.com') ||
    lowercaseUrl.includes('youtu.be') ||
    lowercaseUrl.includes('vimeo.com') ||
    lowercaseUrl.includes('player.vimeo.com')
  );
};

const renderAdminMediaPreview = (url: string, heightClass = "h-16", className = "max-h-full max-w-full object-contain") => {
  if (!url) return null;
  const isVideo = isVideoUrl(url);

  if (isVideo) {
    return (
      <video 
        src={url} 
        autoPlay 
        loop 
        muted 
        playsInline 
        className={`${heightClass} w-full rounded-xl object-cover`}
      />
    );
  }

  return (
    <img 
      src={url} 
      alt="Preview" 
      className={className} 
      referrerPolicy="no-referrer" 
      onError={(e) => {
        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=120&q=80";
      }}
    />
  );
};

function ImageFileUploader({ onUpload, className = '', multiple = false }: ImageFileUploaderProps) {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const { language } = useLanguage();

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files) as File[];
    
    const processFile = (file: File): Promise<string> => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = async () => {
          const rawUrl = reader.result as string;
          const compressed = await compressImage(rawUrl);
          resolve(compressed);
        };
        reader.onerror = () => resolve('');
        reader.readAsDataURL(file);
      });
    };

    if (multiple) {
      Promise.all(fileList.map((f) => processFile(f)))
        .then((urls) => {
          const filteredUrls = urls.filter(Boolean);
          if (filteredUrls.length > 0) {
            onUpload(filteredUrls.join(', '));
          }
        })
        .catch((err) => {
          console.error("Error compressing files:", err);
        });
    } else {
      processFile(fileList[0]).then((url) => {
        if (url) onUpload(url);
      });
    }
    
    e.target.value = '';
  };

  return (
    <div className={`inline-block shrink-0 ${className}`}>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*,video/*"
        multiple={multiple}
        className="hidden"
      />
      <button
        type="button"
        onClick={handleButtonClick}
        className="flex items-center gap-1.5 px-3.5 py-2 bg-[#F7941D]/10 hover:bg-[#F7941D]/20 border border-[#F7941D]/30 hover:border-[#F7941D]/50 text-[#F7941D] text-xs font-bold rounded-xl transition-all duration-300 cursor-pointer active:scale-95 shadow-sm"
        title={language === 'ar' ? 'تصفح صور ومقاطع فيديو من جهازك مباشرة' : 'Upload direct image or video file'}
      >
        <LucideIcons.Upload size={13} />
        <span>{language === 'ar' ? 'رفع ملف' : 'Upload'}</span>
      </button>
    </div>
  );
}

export default function AdminPanel({ isOpen, onClose }: AdminPanelProps) {
  const { 
    language, 
    dir, 
    rawPortfolioItems, 
    setRawPortfolioItems, 
    rawCategories, 
    setRawCategories,
    customTranslations,
    setAllCustomTranslations,
    rawPartnerLogos,
    setRawPartnerLogos,
    t 
  } = useLanguage();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return sessionStorage.getItem('manea_admin_auth') === 'true';
  });
  
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');
  const [activeTab, setActiveTab] = useState<'projects' | 'categories' | 'translations' | 'media' | 'settings'>('projects');
  const [notification, setNotification] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  // Listen to storage quota exceeded event
  useEffect(() => {
    const handleQuotaExceeded = () => {
      showNotification(
        language === 'ar' 
          ? 'تنبيه: تم تجاوز المساحة المتاحة للتخزين (5MB). يرجى استخدام روابط صور (URLs) أو مسح بعض الصور الكبيرة لحفظ التعديلات بنجاح.'
          : 'Warning: Storage quota exceeded (5MB). Please use direct image URLs or remove large files to ensure successful saves.',
        'error'
      );
    };
    window.addEventListener('storage-quota-exceeded', handleQuotaExceeded);
    return () => window.removeEventListener('storage-quota-exceeded', handleQuotaExceeded);
  }, [language]);

  const [localPartnerLogos, setLocalPartnerLogos] = useState<string[]>([]);

  // Sync local partner logos when the modal opens or context state changes
  useEffect(() => {
    if (isOpen) {
      setLocalPartnerLogos(rawPartnerLogos);
    }
  }, [isOpen, rawPartnerLogos]);

  // Form states for Projects with Auto-save Draft Support
  const [editingProject, setEditingProject] = useState<PortfolioItem | null>(() => {
    try {
      const saved = localStorage.getItem('manea_admin_proj_form_draft');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.editingProject;
      }
    } catch (e) {
      console.error("Error reading project draft from localStorage", e);
    }
    return null;
  });

  const [isAddingProject, setIsAddingProject] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('manea_admin_proj_form_draft');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.isAddingProject;
      }
    } catch (e) {
      console.error("Error reading project draft state", e);
    }
    return false;
  });

  const [projForm, setProjForm] = useState(() => {
    try {
      const saved = localStorage.getItem('manea_admin_proj_form_draft');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.projForm;
      }
    } catch (e) {
      console.error("Error reading project draft form", e);
    }
    return {
      id: '',
      titleAr: '',
      titleEn: '',
      categoryKey: '',
      image: '',
      descriptionAr: '',
      descriptionEn: '',
      clientAr: '',
      clientEn: '',
      year: '2026',
      toolsString: '',
      galleryString: '',
      videoUrl: ''
    };
  });

  const [hasRestoredProjDraft, setHasRestoredProjDraft] = useState(() => {
    return !!localStorage.getItem('manea_admin_proj_form_draft');
  });

  // Auto-save project draft effect
  useEffect(() => {
    if (isAddingProject || editingProject) {
      localStorage.setItem('manea_admin_proj_form_draft', JSON.stringify({
        projForm,
        editingProject,
        isAddingProject
      }));
    } else {
      localStorage.removeItem('manea_admin_proj_form_draft');
    }
  }, [projForm, editingProject, isAddingProject]);

  // Form states for Categories with Auto-save Draft Support
  const [editingCategory, setEditingCategory] = useState<CategoryItem | null>(() => {
    try {
      const saved = localStorage.getItem('manea_admin_cat_form_draft');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.editingCategory;
      }
    } catch (e) {
      console.error("Error reading category draft from localStorage", e);
    }
    return null;
  });

  const [isAddingCategory, setIsAddingCategory] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem('manea_admin_cat_form_draft');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.isAddingCategory;
      }
    } catch (e) {
      console.error("Error reading category draft state", e);
    }
    return false;
  });

  const [catForm, setCatForm] = useState(() => {
    try {
      const saved = localStorage.getItem('manea_admin_cat_form_draft');
      if (saved) {
        const parsed = JSON.parse(saved);
        return parsed.catForm;
      }
    } catch (e) {
      console.error("Error reading category draft form", e);
    }
    return {
      key: '',
      labelAr: '',
      labelEn: ''
    };
  });

  const [hasRestoredCatDraft, setHasRestoredCatDraft] = useState(() => {
    return !!localStorage.getItem('manea_admin_cat_form_draft');
  });

  // Auto-save category draft effect
  useEffect(() => {
    if (isAddingCategory || editingCategory) {
      localStorage.setItem('manea_admin_cat_form_draft', JSON.stringify({
        catForm,
        editingCategory,
        isAddingCategory
      }));
    } else {
      localStorage.removeItem('manea_admin_cat_form_draft');
    }
  }, [catForm, editingCategory, isAddingCategory]);

  const handleClearProjDraft = () => {
    localStorage.removeItem('manea_admin_proj_form_draft');
    setHasRestoredProjDraft(false);
    setIsAddingProject(false);
    setEditingProject(null);
    setProjForm({
      id: '',
      titleAr: '',
      titleEn: '',
      categoryKey: rawCategories[0]?.key || '3d',
      image: '',
      descriptionAr: '',
      descriptionEn: '',
      clientAr: '',
      clientEn: '',
      year: '2026',
      toolsString: '',
      galleryString: '',
      videoUrl: ''
    });
  };

  const handleClearCatDraft = () => {
    localStorage.removeItem('manea_admin_cat_form_draft');
    setHasRestoredCatDraft(false);
    setIsAddingCategory(false);
    setEditingCategory(null);
    setCatForm({
      key: '',
      labelAr: '',
      labelEn: ''
    });
  };

  // Search filter for project management
  const [projectSearch, setProjectSearch] = useState('');

  // Drag and drop states
  const [draggedProjectIndex, setDraggedProjectIndex] = useState<number | null>(null);
  const [draggedLogoIndex, setDraggedLogoIndex] = useState<number | null>(null);

  const handleProjectDragStart = (e: React.DragEvent, id: string) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'BUTTON' || target.closest('button') || target.closest('input')) {
      e.preventDefault();
      return;
    }
    const globalIndex = rawPortfolioItems.findIndex(item => item.id === id);
    setDraggedProjectIndex(globalIndex);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleProjectDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (draggedProjectIndex === null) return;
    const currentGlobalIndex = rawPortfolioItems.findIndex(item => item.id === id);
    if (draggedProjectIndex === currentGlobalIndex) return;

    const updated = [...rawPortfolioItems];
    const draggedItem = updated[draggedProjectIndex];
    updated.splice(draggedProjectIndex, 1);
    updated.splice(currentGlobalIndex, 0, draggedItem);

    setDraggedProjectIndex(currentGlobalIndex);
    setRawPortfolioItems(updated);
  };

  const handleProjectDragEnd = () => {
    setDraggedProjectIndex(null);
    showNotification(language === 'ar' ? 'تم إعادة ترتيب المشاريع بنجاح!' : 'Projects reordered successfully!');
  };

  const handleLogoDragStart = (e: React.DragEvent, index: number) => {
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'BUTTON' || target.closest('button') || target.closest('input')) {
      e.preventDefault();
      return;
    }
    setDraggedLogoIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleLogoDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedLogoIndex === null) return;
    if (draggedLogoIndex === index) return;

    const updated = [...localPartnerLogos];
    const draggedItem = updated[draggedLogoIndex];
    updated.splice(draggedLogoIndex, 1);
    updated.splice(index, 0, draggedItem);

    setDraggedLogoIndex(index);
    setLocalPartnerLogos(updated);
    setRawPartnerLogos(updated);
  };

  const handleLogoDragEnd = () => {
    setDraggedLogoIndex(null);
    showNotification(language === 'ar' ? 'تم إعادة ترتيب الشعارات بنجاح!' : 'Logos reordered successfully!');
  };

  // Password PIN code for admin access (fallback client verification)
  const [adminPin, setAdminPin] = useState<string>(() => {
    return localStorage.getItem('manea_admin_pin') || '2026';
  });

  // Full-stack secure state variables
  const [adminEmailDisplay, setAdminEmailDisplay] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [isForgotMode, setIsForgotMode] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState('');
  const [recoveryOtp, setRecoveryOtp] = useState('');
  const [recoveryKey, setRecoveryKey] = useState('');
  const [newPinInput, setNewPinInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [recoverySuccessMessage, setRecoverySuccessMessage] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  // Filter for translations section
  const [translationSectionFilter, setTranslationSectionFilter] = useState<string>('all');
  const [translationTypeFilter, setTranslationTypeFilter] = useState<'all' | 'text' | 'media' | 'icon'>('all');
  const [translationSearch, setTranslationSearch] = useState<string>('');

  // Verify existing token on open
  useEffect(() => {
    if (isOpen) {
      const storedToken = sessionStorage.getItem('manea_admin_auth_token');
      if (storedToken) {
        fetch('/api/admin/verify-token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ token: storedToken })
        })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setIsAuthenticated(true);
            setAdminEmailDisplay(data.email || '');
          } else {
            setIsAuthenticated(false);
            sessionStorage.removeItem('manea_admin_auth_token');
          }
        })
        .catch(() => {
          // If server is starting up or offline, fallback to session auth safely
          const fallback = sessionStorage.getItem('manea_admin_auth') === 'true';
          setIsAuthenticated(fallback);
        });
      }
    }
  }, [isOpen]);

  // Keyboard shortcut listener to open admin
  useEffect(() => {
    let typedBuffer = '';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
      }

      const target = e.target as HTMLElement;
      if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable)) {
        return;
      }

      if (/^[0-9]$/.test(e.key)) {
        typedBuffer += e.key;
        if (typedBuffer.length > 4) {
          typedBuffer = typedBuffer.slice(-4);
        }
        if (typedBuffer === '7712') {
          typedBuffer = '';
        }
      } else {
        typedBuffer = '';
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Prevent body scroll when admin panel is open
  useEffect(() => {
    const lenis = (window as any).lenis;
    if (isOpen) {
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
  }, [isOpen]);

  // Notification helper
  const showNotification = (text: string, type: 'success' | 'error' = 'success') => {
    setNotification({ text, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) {
      setAuthError(language === 'ar' ? 'يرجى إدخال الرمز السري' : 'Please enter the PIN code');
      return;
    }
    setIsSubmitting(true);
    setAuthError('');
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: loginEmail,
          pin: passwordInput
        })
      });
      const data = await response.json();
      if (data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem('manea_admin_auth_token', data.token);
        sessionStorage.setItem('manea_admin_auth', 'true');
        setAdminEmailDisplay(data.email || '');
        setAuthError('');
        setPasswordInput('');
        setLoginEmail('');
        showNotification(language === 'ar' ? 'تم تسجيل الدخول بنجاح كأدمن' : 'Logged in successfully as Admin');
      } else {
        setAuthError(data.error || (language === 'ar' ? 'الرمز السري غير صحيح!' : 'Incorrect PIN code!'));
      }
    } catch (err) {
      // Fallback in case backend server is unreachable or offline
      if (passwordInput === adminPin) {
        setIsAuthenticated(true);
        sessionStorage.setItem('manea_admin_auth', 'true');
        setAuthError('');
        setPasswordInput('');
        showNotification(language === 'ar' ? 'تم الدخول بنجاح كأدمن (وضع الاحتياط)' : 'Logged in successfully as Admin (Fallback)');
      } else {
        setAuthError(language === 'ar' ? 'الرمز السري غير صحيح!' : 'Incorrect PIN code!');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('manea_admin_auth');
    sessionStorage.removeItem('manea_admin_auth_token');
    showNotification(language === 'ar' ? 'تم تسجيل الخروج' : 'Logged out successfully');
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recoveryEmail.trim()) {
      setAuthError(language === 'ar' ? 'يرجى إدخال البريد الإلكتروني' : 'Please enter email address');
      return;
    }
    setIsSubmitting(true);
    setAuthError('');
    setRecoverySuccessMessage('');
    try {
      const response = await fetch('/api/admin/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: recoveryEmail })
      });
      const data = await response.json();
      if (data.success) {
        setOtpSent(true);
        setRecoverySuccessMessage(
          language === 'ar'
            ? `تم توليد رمز تحقق OTP لـ ${data.maskedEmail || recoveryEmail}. في بيئة الإنتاج يتم إرساله للبريد. للمعاينة الآمنة، تم طباعته في سجلات الخادم (Server log) أو يمكنك استخدام مفتاح الاسترداد الرئيسي.`
            : `OTP generated for ${data.maskedEmail || recoveryEmail}. For security preview, check server log or use your master Recovery Key.`
        );
        // Sandbox convenience: autofill OTP for easier preview!
        if (data.debugOtp) {
          setRecoveryOtp(data.debugOtp);
        }
      } else {
        setAuthError(data.error || (language === 'ar' ? 'حدث خطأ أثناء إرسال الرمز!' : 'Error generating recovery code!'));
      }
    } catch (err) {
      setAuthError(language === 'ar' ? 'تعذر الاتصال بالخادم، يرجى التحقق من تشغيل الخادم الخلفي.' : 'Cannot connect to backend server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPinInput.trim() || newPinInput.length < 4) {
      setAuthError(language === 'ar' ? 'يجب أن يتكون الرمز الجديد من 4 أرقام على الأقل.' : 'New PIN must be at least 4 digits.');
      return;
    }
    if (!recoveryOtp.trim() && !recoveryKey.trim()) {
      setAuthError(language === 'ar' ? 'يرجى إدخال رمز التحقق OTP أو مفتاح الاسترداد الرئيسي.' : 'Please enter OTP or Recovery Key.');
      return;
    }
    setIsSubmitting(true);
    setAuthError('');
    try {
      const response = await fetch('/api/admin/reset-pin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: recoveryEmail,
          otp: recoveryOtp,
          recoveryKey: recoveryKey,
          newPin: newPinInput
        })
      });
      const data = await response.json();
      if (data.success) {
        showNotification(data.message);
        setAdminPin(newPinInput);
        // Also update local fallback PIN
        localStorage.setItem('manea_admin_pin', newPinInput);
        setIsForgotMode(false);
        setOtpSent(false);
        setRecoveryEmail('');
        setRecoveryOtp('');
        setRecoveryKey('');
        setNewPinInput('');
        setAuthError('');
      } else {
        setAuthError(data.error || (language === 'ar' ? 'رمز التحقق أو مفتاح الاسترداد غير صحيح.' : 'Invalid recovery data.'));
      }
    } catch (err) {
      setAuthError(language === 'ar' ? 'تعذر الاتصال بالخادم.' : 'Cannot connect to server.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // --- PROJECT CRUD HANDLERS ---
  const handleOpenAddProject = () => {
    setEditingProject(null);
    setProjForm({
      id: 'proj-' + Math.random().toString(36).substr(2, 9),
      titleAr: '',
      titleEn: '',
      categoryKey: rawCategories[0]?.key || '3d',
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      descriptionAr: '',
      descriptionEn: '',
      clientAr: '',
      clientEn: '',
      year: new Date().getFullYear().toString(),
      toolsString: 'Blender, Cycles, Photoshop',
      galleryString: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80',
      videoUrl: ''
    });
    setIsAddingProject(true);
  };

  const handleOpenEditProject = (p: PortfolioItem) => {
    setEditingProject(p);
    setProjForm({
      id: p.id,
      titleAr: p.title,
      titleEn: p.titleEn || '',
      categoryKey: p.categoryKey,
      image: p.image,
      descriptionAr: p.description,
      descriptionEn: p.descriptionEn || '',
      clientAr: p.client,
      clientEn: p.clientEn || '',
      year: p.year,
      toolsString: p.tools.join(', '),
      galleryString: p.gallery.join(', '),
      videoUrl: p.videoUrl || ''
    });
    setIsAddingProject(false);
  };

  const handleSaveProject = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!projForm.titleAr || !projForm.image || !projForm.descriptionAr) {
      showNotification(language === 'ar' ? 'يرجى تعبئة الحقول الأساسية بالعربية' : 'Please fill in primary Arabic fields', 'error');
      return;
    }

    const categoryObj = rawCategories.find(c => c.key === projForm.categoryKey);
    const categoryNameAr = categoryObj ? categoryObj.labelAr : 'عام';

    const updatedItem: PortfolioItem = {
      id: projForm.id || 'proj-' + Date.now(),
      title: projForm.titleAr,
      titleEn: projForm.titleEn || projForm.titleAr,
      category: categoryNameAr,
      categoryEn: categoryObj ? categoryObj.labelEn : 'General',
      categoryKey: projForm.categoryKey,
      image: projForm.image,
      description: projForm.descriptionAr,
      descriptionEn: projForm.descriptionEn || projForm.descriptionAr,
      client: projForm.clientAr || 'شخصي',
      clientEn: projForm.clientEn || 'Personal',
      year: projForm.year,
      tools: projForm.toolsString.split(',').map(s => s.trim()).filter(Boolean),
      gallery: projForm.galleryString.split(',').map(s => s.trim()).filter(Boolean),
      videoUrl: projForm.videoUrl || ''
    };

    let newItems = [...rawPortfolioItems];
    if (editingProject) {
      newItems = newItems.map(item => item.id === editingProject.id ? updatedItem : item);
      showNotification(language === 'ar' ? 'تم تحديث المشروع بنجاح!' : 'Project updated successfully!');
    } else {
      newItems = [updatedItem, ...newItems];
      showNotification(language === 'ar' ? 'تمت إضافة المشروع الجديد بنجاح!' : 'New project added successfully!');
    }

    setRawPortfolioItems(newItems);
    setEditingProject(null);
    setIsAddingProject(false);
    setHasRestoredProjDraft(false);
    localStorage.removeItem('manea_admin_proj_form_draft');
  };

  const handleDeleteProject = (id: string) => {
    if (window.confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا المشروع نهائياً؟' : 'Are you sure you want to permanently delete this project?')) {
      const newItems = rawPortfolioItems.filter(item => item.id !== id);
      setRawPortfolioItems(newItems);
      showNotification(language === 'ar' ? 'تم حذف المشروع' : 'Project deleted successfully');
    }
  };

  const handleUpdateProjectMedia = (projectId: string, field: 'image' | 'gallery', value: string | string[]) => {
    const updatedItems = rawPortfolioItems.map(item => {
      if (item.id === projectId) {
        return {
          ...item,
          [field]: value
        };
      }
      return item;
    });
    setRawPortfolioItems(updatedItems);
  };

  // --- CATEGORY CRUD HANDLERS ---
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCatForm({
      key: '',
      labelAr: '',
      labelEn: ''
    });
    setIsAddingCategory(true);
  };

  const handleOpenEditCategory = (c: CategoryItem) => {
    setEditingCategory(c);
    setCatForm({
      key: c.key,
      labelAr: c.labelAr,
      labelEn: c.labelEn
    });
    setIsAddingCategory(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catForm.key || !catForm.labelAr || !catForm.labelEn) {
      showNotification(language === 'ar' ? 'يرجى ملء جميع حقول التصنيف' : 'Please fill all category fields', 'error');
      return;
    }

    const newCat: CategoryItem = {
      key: catForm.key.toLowerCase().trim(),
      labelAr: catForm.labelAr.trim(),
      labelEn: catForm.labelEn.trim()
    };

    let newCats = [...rawCategories];
    if (editingCategory) {
      newCats = newCats.map(c => c.key === editingCategory.key ? newCat : c);
      showNotification(language === 'ar' ? 'تم تعديل التصنيف بنجاح' : 'Category updated successfully');
    } else {
      if (newCats.some(c => c.key === newCat.key)) {
        showNotification(language === 'ar' ? 'مفتاح التصنيف هذا موجود مسبقاً!' : 'Category key already exists!', 'error');
        return;
      }
      newCats.push(newCat);
      showNotification(language === 'ar' ? 'تمت إضافة التصنيف الجديد' : 'New category added');
    }

    setRawCategories(newCats);
    setIsAddingCategory(false);
    setEditingCategory(null);
    setHasRestoredCatDraft(false);
    localStorage.removeItem('manea_admin_cat_form_draft');
  };

  const handleDeleteCategory = (key: string) => {
    if (key === '3d' || key === 'branding') {
      showNotification(language === 'ar' ? 'لا يمكن حذف التصنيفات الأساسية للنظام' : 'System core categories cannot be deleted', 'error');
      return;
    }
    if (window.confirm(language === 'ar' ? 'هل تريد حذف هذا القسم؟ قد لا تظهر المشاريع المرتبطة به بشكل صحيح.' : 'Delete category? Associated projects might not filter correctly.')) {
      const newCats = rawCategories.filter(c => c.key !== key);
      setRawCategories(newCats);
      showNotification(language === 'ar' ? 'تم حذف التصنيف' : 'Category deleted');
    }
  };

  // --- TRANSLATIONS / TEXTS HANDLERS ---
  const customizableTextKeys = [
    { key: 'nav.brandName', desc: 'اسم الشعار والبراند', section: 'العام والروابط' },
    { key: 'common.rights', desc: 'حقوق الملكية والنشر أسفل الموقع', section: 'العام والروابط' },
    
    // Contact Info Section
    { key: 'contact.phoneValue', desc: 'رقم الهاتف المباشر للاتصال', section: 'بيانات الاتصال والروابط' },
    { key: 'contact.emailValue', desc: 'البريد الإلكتروني الرسمي', section: 'بيانات الاتصال والروابط' },
    { key: 'contact.whatsappLink', desc: 'رابط واتساب المباشر (https://wa.me/...)', section: 'بيانات الاتصال والروابط' },
    { key: 'contact.instagramLink', desc: 'رابط حساب إنستغرام', section: 'بيانات الاتصال والروابط' },
    { key: 'contact.facebookLink', desc: 'رابط صفحة فيسبوك', section: 'بيانات الاتصال والروابط' },

    // Sections Headers
    { key: 'hero.welcome', desc: 'عنوان الهيرو الترحيبي الرئيسي', section: 'الهيرو' },
    { key: 'hero.subtitle', desc: 'عنوان الهيرو الفرعي والوصف المكتوب', section: 'الهيرو' },
    { key: 'hero.contactBtn', desc: 'نص زر تواصل معي في الهيرو', section: 'الهيرو' },
    { key: 'hero.bgVideoUrl', desc: 'رابط فيديو الخلفية ثلاثي الأبعاد للهيرو (MP4)', section: 'الهيرو' },

    { key: 'about.title', desc: 'عنوان قسم من أنا', section: 'من أنا' },
    { key: 'about.text', desc: 'وصف ونص سيرة من أنا الذاتية بالتفصيل', section: 'من أنا' },

    { key: 'services.title', desc: 'العنوان الرئيسي لقسم الخدمات المطور', section: 'الخدمات الإبداعية' },
    { key: 'services.subtitle', desc: 'العنوان الفرعي لقسم الخدمات الإبداعية', section: 'الخدمات الإبداعية' },
    { key: 'services.fullRange', desc: 'العنوان الجانبي العمودي الطويل لقسم الخدمات', section: 'الخدمات الإبداعية' },
    { key: 'services.unlimited', desc: 'العنوان الصغير جداً أعلى عنوان الخدمات', section: 'الخدمات الإبداعية' },
    { key: 'services.browseProjects', desc: 'رابط تصفح المشاريع في بطاقة الخدمات الأخيرة', section: 'الخدمات الإبداعية' },
    
    // Services List (01 to 09)
    { key: 'services.01.name', desc: 'الخدمة 1: الاسم', section: 'الخدمات الإبداعية' },
    { key: 'services.01.desc', desc: 'الخدمة 1: الوصف', section: 'الخدمات الإبداعية' },
    { key: 'services.01.icon', desc: 'الخدمة 1: اسم أيقونة Lucide المكتوب (مثل Megaphone)', section: 'الخدمات الإبداعية' },
    
    { key: 'services.02.name', desc: 'الخدمة 2: الاسم', section: 'الخدمات الإبداعية' },
    { key: 'services.02.desc', desc: 'الخدمة 2: الوصف', section: 'الخدمات الإبداعية' },
    { key: 'services.02.icon', desc: 'الخدمة 2: اسم أيقونة Lucide المكتوب (مثل Box)', section: 'الخدمات الإبداعية' },
    
    { key: 'services.03.name', desc: 'الخدمة 3: الاسم', section: 'الخدمات الإبداعية' },
    { key: 'services.03.desc', desc: 'الخدمة 3: الوصف', section: 'الخدمات الإبداعية' },
    { key: 'services.03.icon', desc: 'الخدمة 3: اسم أيقونة Lucide المكتوب (مثل Sparkles)', section: 'الخدمات الإبداعية' },
    
    { key: 'services.04.name', desc: 'الخدمة 4: الاسم', section: 'الخدمات الإبداعية' },
    { key: 'services.04.desc', desc: 'الخدمة 4: الوصف', section: 'الخدمات الإبداعية' },
    { key: 'services.04.icon', desc: 'الخدمة 4: اسم أيقونة Lucide المكتوب (مثل Award)', section: 'الخدمات الإبداعية' },
    
    { key: 'services.05.name', desc: 'الخدمة 5: الاسم', section: 'الخدمات الإبداعية' },
    { key: 'services.05.desc', desc: 'الخدمة 5: الوصف', section: 'الخدمات الإبداعية' },
    { key: 'services.05.icon', desc: 'الخدمة 5: اسم أيقونة Lucide المكتوب (مثل Share2)', section: 'الخدمات الإبداعية' },
    
    { key: 'services.06.name', desc: 'الخدمة 6: الاسم', section: 'الخدمات الإبداعية' },
    { key: 'services.06.desc', desc: 'الخدمة 6: الوصف', section: 'الخدمات الإبداعية' },
    { key: 'services.06.icon', desc: 'الخدمة 6: اسم أيقونة Lucide المكتوب (مثل Video)', section: 'الخدمات الإبداعية' },
    
    { key: 'services.07.name', desc: 'الخدمة 7: الاسم', section: 'الخدمات الإبداعية' },
    { key: 'services.07.desc', desc: 'الخدمة 7: الوصف', section: 'الخدمات الإبداعية' },
    { key: 'services.07.icon', desc: 'الخدمة 7: اسم أيقونة Lucide المكتوب (مثل Globe)', section: 'الخدمات الإبداعية' },
    
    { key: 'services.08.name', desc: 'الخدمة 8: الاسم', section: 'الخدمات الإبداعية' },
    { key: 'services.08.desc', desc: 'الخدمة 8: الوصف', section: 'الخدمات الإبداعية' },
    { key: 'services.08.icon', desc: 'الخدمة 8: اسم أيقونة Lucide المكتوب (مثل Brain)', section: 'الخدمات الإبداعية' },
    
    { key: 'services.09.name', desc: 'الخدمة 9: الاسم', section: 'الخدمات الإبداعية' },
    { key: 'services.09.desc', desc: 'الخدمة 9: الوصف', section: 'الخدمات الإبداعية' },
    { key: 'services.09.icon', desc: 'الخدمة 9: اسم أيقونة Lucide المكتوب (مثل Target)', section: 'الخدمات الإبداعية' },

    // Success Partners
    { key: 'partners.title', desc: 'العنوان الرئيسي لشركاء النجاح', section: 'شركاء النجاح' },
    { key: 'partners.trust', desc: 'العنوان الصغير لشركاء النجاح', section: 'شركاء النجاح' },

    // Portfolio Gallery Section
    { key: 'portfolioGallery.creativeShowcase', desc: 'معرض الأعمال: العنوان الصغير الأعلى', section: 'معرض الأعمال' },
    { key: 'portfolioGallery.title', desc: 'معرض الأعمال: العنوان العريض الرئيسي', section: 'معرض الأعمال' },
    { key: 'portfolioGallery.searchPlaceholder', desc: 'معرض الأعمال: تلميح حقل البحث', section: 'معرض الأعمال' },
    { key: 'portfolioGallery.thinkToBuild', desc: 'معرض الأعمال: نص دعوة التفكير والعمل', section: 'معرض الأعمال' },
    { key: 'portfolioGallery.startProjectNow', desc: 'معرض الأعمال: نص زر بدء المشروع', section: 'معرض الأعمال' },

    // Contact Form Details
    { key: 'contact.stayInTouch', desc: 'عنوان التواصل الرئيسي المباشر', section: 'التواصل' },
    { key: 'contact.description', desc: 'الوصف الإبداعي لقسم تواصل معي', section: 'التواصل' },
    { key: 'contact.directPhone', desc: 'عنوان حقل الهاتف والواتساب', section: 'التواصل' },
    { key: 'contact.officialEmail', desc: 'عنوان حقل البريد الرسمي', section: 'التواصل' },
    { key: 'contact.sendBtn', desc: 'نص زر إرسال المشروع الرئيسي', section: 'التواصل' },
  ];

  const handleUpdateTranslation = (key: string, lang: 'ar' | 'en', value: string) => {
    const updated = {
      ...customTranslations,
      [lang]: {
        ...customTranslations[lang],
        [key]: value
      }
    };
    setAllCustomTranslations(updated);
  };

  const handleResetTranslations = () => {
    if (window.confirm(language === 'ar' ? 'هل تريد استعادة جميع النصوص الافتراضية للموقع؟' : 'Reset all website texts to default?')) {
      setAllCustomTranslations({ ar: {}, en: {} });
      showNotification(language === 'ar' ? 'تمت استعادة النصوص الافتراضية' : 'Default texts restored');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div data-lenis-prevent className="fixed inset-0 z-[100] flex flex-col items-center justify-start md:justify-center p-4 md:p-10 bg-black/80 backdrop-blur-md overflow-y-auto font-sans" dir={dir}>
        
        {/* Floating Notification */}
        {notification && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={`fixed top-6 left-1/2 -translate-x-1/2 z-[110] px-6 py-3 rounded-full flex items-center gap-3 shadow-2xl text-sm font-semibold border ${
              notification.type === 'success' 
                ? 'bg-emerald-950/90 text-emerald-300 border-emerald-500/30' 
                : 'bg-rose-950/90 text-rose-300 border-rose-500/30'
            }`}
          >
            <CheckCircle size={18} />
            <span>{notification.text}</span>
          </motion.div>
        )}

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25 }}
          className="relative w-full max-w-6xl bg-[#0D071E]/95 backdrop-blur-2xl border border-white/10 rounded-[28px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
        >
          {/* Header background glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[75%] h-36 bg-[#F7941D]/5 rounded-full blur-[90px] pointer-events-none" />

          {/* Top Header Panel */}
          <div className="flex items-center justify-between p-5 border-b border-white/[0.08] relative z-10 shrink-0 bg-black/10">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#F7941D]/15 border border-[#F7941D]/30 flex items-center justify-center text-[#F7941D]">
                <LayoutDashboard size={18} />
              </div>
              <div>
                <h2 className="font-extrabold text-lg text-white tracking-tight">
                  {language === 'ar' ? 'لوحة التحكم السريّة' : 'Secret Admin Panel'}
                </h2>
                <p className="text-[11px] text-gray-400">
                  {language === 'ar' ? 'تحكم كامل بالمشاريع والأقسام ونصوص الموقع بسلاسة' : 'Manage your portfolio items, categories and website copy'}
                </p>
              </div>
            </div>

            <button 
              onClick={onClose}
              className="p-2 rounded-full border border-white/5 bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-all duration-200 cursor-pointer"
            >
              <X size={18} />
            </button>
          </div>

          {!isAuthenticated ? (
            /* SECURE DUAL-METHOD ACCESS & RECOVERY SCREEN */
            <div className="p-8 flex flex-col items-center justify-center text-center space-y-6 flex-grow py-12 md:py-16 relative z-10 overflow-y-auto max-h-[80vh]">
              <div className="w-16 h-16 rounded-full bg-[#F7941D]/10 border border-[#F7941D]/30 flex items-center justify-center text-[#F7941D] mb-1">
                {isForgotMode ? (
                  <RefreshCw size={30} className="animate-spin" style={{ animationDuration: '6s' }} />
                ) : (
                  <Lock size={30} className="animate-pulse" />
                )}
              </div>

              {!isForgotMode ? (
                <>
                  <div className="max-w-md">
                    <div className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
                      <LucideIcons.Shield size={12} />
                      <span>{language === 'ar' ? 'حماية ثنائية مطورة' : 'Enhanced Server-side Shield'}</span>
                    </div>
                    <h3 className="text-2xl font-black text-white mb-2">
                      {language === 'ar' ? 'لوحة التحكم الآمنة' : 'Secure Admin Portal'}
                    </h3>
                    <p className="text-xs text-gray-400 leading-relaxed">
                      {language === 'ar' 
                        ? 'هذه المنطقة مخصصة بالكامل لمدير الموقع الرئيسي (مانع). يرجى تسجيل الدخول بالرمز السري المشفر.' 
                        : 'This area is strictly restricted to the main administrator (Manea). Please unlock with your encrypted PIN.'}
                    </p>
                  </div>

                  <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full max-w-sm">
                    {/* Optional email field for added protection */}
                    <div className="space-y-1 text-right" dir={dir}>
                      <label className="text-[11px] text-gray-400 font-bold block px-1">
                        {language === 'ar' ? 'البريد الإلكتروني (اختياري للأمان الإضافي):' : 'Email address (Optional extra validation):'}
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500 pointer-events-none">
                          <LucideIcons.Mail size={14} />
                        </span>
                        <input 
                          type="email"
                          placeholder="admin@example.com"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 hover:border-[#F7941D]/40 focus:border-[#F7941D] rounded-xl text-white placeholder-gray-600 text-sm focus:outline-none transition-all duration-200"
                        />
                      </div>
                    </div>

                    <div className="space-y-1 text-right" dir={dir}>
                      <label className="text-[11px] text-gray-400 font-bold block px-1">
                        {language === 'ar' ? 'الرمز السري للوحة التحكم (PIN):' : 'Dashboard PIN Code:'}
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500 pointer-events-none font-mono">
                          ***
                        </span>
                        <input 
                          type="password"
                          placeholder="••••"
                          value={passwordInput}
                          onChange={(e) => setPasswordInput(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 bg-black/40 border border-white/10 hover:border-[#F7941D]/45 focus:border-[#F7941D] rounded-xl text-white placeholder-gray-600 text-center font-mono text-lg tracking-widest focus:outline-none transition-all duration-200"
                          autoFocus
                          required
                        />
                      </div>
                    </div>

                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 bg-gradient-to-r from-[#F7941D] to-amber-600 hover:from-amber-600 hover:to-[#F7941D] disabled:from-gray-700 disabled:to-gray-800 text-white font-bold rounded-xl shadow-lg shadow-amber-500/10 flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-95 transition-all duration-200 cursor-pointer text-sm"
                    >
                      {isSubmitting ? (
                        <>
                          <RefreshCw size={15} className="animate-spin" />
                          <span>{language === 'ar' ? 'جاري التحقق...' : 'Verifying credentials...'}</span>
                        </>
                      ) : (
                        <>
                          <KeyRound size={15} />
                          <span>{language === 'ar' ? 'إلغاء قفل لوحة التحكم' : 'Unlock Dashboard'}</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setIsForgotMode(true);
                        setAuthError('');
                        setRecoverySuccessMessage('');
                      }}
                      className="text-xs text-amber-500/80 hover:text-[#F7941D] font-bold underline transition-colors cursor-pointer self-center py-1 mt-1"
                    >
                      {language === 'ar' ? 'نسيت الرمز السري الخاص بك؟ استرداد الحساب' : 'Forgot PIN? Request account recovery'}
                    </button>
                  </form>
                </>
              ) : (
                /* RECOVERY & OTP RESET SCREEN */
                <div className="w-full max-w-md space-y-4">
                  <div className="max-w-md">
                    <div className="inline-flex items-center gap-1.5 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
                      <LucideIcons.ShieldAlert size={12} />
                      <span>{language === 'ar' ? 'بوابة استرداد الحساب الآمنة' : 'Secure Emergency Bypass'}</span>
                    </div>
                    <h3 className="text-xl font-extrabold text-white mb-1.5">
                      {language === 'ar' ? 'استعادة وتعيين الرمز السري' : 'Reset Administrative PIN'}
                    </h3>
                    <p className="text-[11px] text-gray-400 leading-relaxed">
                      {language === 'ar' 
                        ? 'يرجى إدخال البريد الإلكتروني المعتمد لتوليد رمز التحقق (OTP) أو إدخال مفتاح الاسترداد الرئيسي مباشرة للتعيين السريع.' 
                        : 'Enter your administrator email to trigger an OTP code, or provide your master Recovery Key to reset instantly.'}
                    </p>
                  </div>

                  {!otpSent ? (
                    <form onSubmit={handleRequestOtp} className="space-y-3.5 text-right" dir={dir}>
                      <div className="space-y-1">
                        <label className="text-[11px] text-gray-400 font-bold block px-1">
                          {language === 'ar' ? 'بريد المشرف المسجل:' : 'Registered Admin Email:'}
                        </label>
                        <div className="relative">
                          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-gray-500">
                            <LucideIcons.Mail size={14} />
                          </span>
                          <input 
                            type="email"
                            placeholder="m••••@gmail.com"
                            value={recoveryEmail}
                            onChange={(e) => setRecoveryEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-black/40 border border-white/10 hover:border-amber-500/40 focus:border-amber-500 rounded-xl text-white text-sm focus:outline-none transition-all duration-200"
                            required
                          />
                        </div>
                      </div>

                      <button 
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full py-2.5 bg-[#F7941D]/20 hover:bg-[#F7941D]/30 text-[#F7941D] font-bold border border-[#F7941D]/40 hover:border-[#F7941D] rounded-xl flex items-center justify-center gap-2 transition-all duration-200 text-xs cursor-pointer"
                      >
                        {isSubmitting ? (
                          <RefreshCw size={13} className="animate-spin" />
                        ) : (
                          <LucideIcons.MailOpen size={13} />
                        )}
                        <span>{language === 'ar' ? 'توليد وإرسال رمز التحقق (OTP)' : 'Generate & Dispatch OTP'}</span>
                      </button>
                    </form>
                  ) : (
                    <div className="bg-emerald-950/20 border border-emerald-500/20 px-3.5 py-2.5 rounded-xl text-right text-[11px] text-emerald-400/95 leading-relaxed" dir={dir}>
                      <LucideIcons.CheckCircle2 size={14} className="inline-block shrink-0 mr-1.5 text-emerald-400 align-middle" />
                      <span className="align-middle">{recoverySuccessMessage}</span>
                    </div>
                  )}

                  {/* RESET SUBMISSION FORM */}
                  <form onSubmit={handleResetPinSubmit} className="space-y-3 text-right" dir={dir}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <label className="text-[11px] text-gray-400 font-bold block px-1">
                          {language === 'ar' ? 'رمز التحقق (OTP):' : 'Verification OTP:'}
                        </label>
                        <input 
                          type="text"
                          placeholder="123456"
                          value={recoveryOtp}
                          onChange={(e) => setRecoveryOtp(e.target.value)}
                          disabled={!otpSent}
                          className="w-full px-3.5 py-2.5 bg-black/40 disabled:opacity-50 border border-white/10 focus:border-amber-500 rounded-xl text-white text-center font-mono focus:outline-none transition-all duration-200 text-sm"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] text-gray-400 font-bold block px-1">
                          {language === 'ar' ? 'أو مفتاح الاسترداد الرئيسي:' : 'Or Master Recovery Key:'}
                        </label>
                        <input 
                          type="password"
                          placeholder="MANEA-SECURE-RECOVERY..."
                          value={recoveryKey}
                          onChange={(e) => setRecoveryKey(e.target.value)}
                          className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 focus:border-amber-500 rounded-xl text-white placeholder-gray-600 focus:outline-none transition-all duration-200 text-xs"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[11px] text-gray-400 font-bold block px-1">
                        {language === 'ar' ? 'الرمز السري الجديد (PIN):' : 'New Dashboard PIN:'}
                      </label>
                      <input 
                        type="password"
                        placeholder="••••"
                        value={newPinInput}
                        onChange={(e) => setNewPinInput(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-black/40 border border-white/10 focus:border-amber-500 rounded-xl text-white text-center font-mono text-sm tracking-widest focus:outline-none transition-all duration-200"
                        required
                      />
                    </div>

                    <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="w-full py-3 bg-gradient-to-r from-amber-500 to-amber-700 hover:from-amber-600 hover:to-amber-800 text-white font-bold rounded-xl shadow-lg flex items-center justify-center gap-2 hover:scale-[1.01] transition-all duration-200 text-xs cursor-pointer"
                    >
                      <LucideIcons.KeyRound size={13} />
                      <span>{language === 'ar' ? 'تحديث وإعادة تعيين الرمز السري' : 'Reset & Apply New PIN'}</span>
                    </button>
                  </form>

                  <button
                    type="button"
                    onClick={() => {
                      setIsForgotMode(false);
                      setAuthError('');
                    }}
                    className="text-xs text-gray-400 hover:text-white font-bold transition-colors cursor-pointer inline-flex items-center gap-1 mt-2"
                  >
                    <ChevronRight size={14} className="rotate-180" />
                    <span>{language === 'ar' ? 'العودة لصفحة الدخول' : 'Return to Login'}</span>
                  </button>
                </div>
              )}

              {authError && (
                <p className="text-rose-400 text-xs font-semibold flex items-center gap-1.5 bg-rose-500/10 px-4 py-2.5 rounded-xl border border-rose-500/20 max-w-sm">
                  <AlertTriangle size={13} />
                  <span>{authError}</span>
                </p>
              )}
            </div>
          ) : (
            /* MAIN ADMIN CONTROL INTERFACE */
            <div className="flex flex-col md:flex-row flex-grow overflow-hidden relative z-10 min-h-0">
              
              {/* Sidebar navigation tabs */}
              <div className="w-full md:w-60 bg-black/10 border-b md:border-b-0 md:border-r border-white/5 p-3 flex flex-row md:flex-col gap-1 shrink-0 overflow-x-auto md:overflow-x-visible">
                <button
                  onClick={() => { setActiveTab('projects'); setIsAddingProject(false); setEditingProject(null); }}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer w-full whitespace-nowrap ${
                    activeTab === 'projects' 
                      ? 'bg-[#F7941D]/10 border border-[#F7941D]/30 text-[#F7941D]' 
                      : 'text-gray-400 hover:text-white hover:bg-white/[0.03] border border-transparent'
                  }`}
                >
                  <LayoutDashboard size={15} />
                  <span>{language === 'ar' ? 'إدارة المشاريع' : 'Manage Projects'}</span>
                </button>

                <button
                  onClick={() => { setActiveTab('media'); }}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer w-full whitespace-nowrap ${
                    activeTab === 'media' 
                      ? 'bg-[#F7941D]/10 border border-[#F7941D]/30 text-[#F7941D]' 
                      : 'text-gray-400 hover:text-white hover:bg-white/[0.03] border border-transparent'
                  }`}
                >
                  <ImageIcon size={15} />
                  <span>{language === 'ar' ? 'تعديل صور التطبيق' : 'App Media & Images'}</span>
                </button>

                <button
                  onClick={() => { setActiveTab('categories'); setIsAddingCategory(false); setEditingCategory(null); }}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer w-full whitespace-nowrap ${
                    activeTab === 'categories' 
                      ? 'bg-[#F7941D]/10 border border-[#F7941D]/30 text-[#F7941D]' 
                      : 'text-gray-400 hover:text-white hover:bg-white/[0.03] border border-transparent'
                  }`}
                >
                  <FolderPlus size={15} />
                  <span>{language === 'ar' ? 'الأقسام والتصنيفات' : 'Manage Categories'}</span>
                </button>

                <button
                  onClick={() => { setActiveTab('translations'); }}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer w-full whitespace-nowrap ${
                    activeTab === 'translations' 
                      ? 'bg-[#F7941D]/10 border border-[#F7941D]/30 text-[#F7941D]' 
                      : 'text-gray-400 hover:text-white hover:bg-white/[0.03] border border-transparent'
                  }`}
                >
                  <FileCode size={15} />
                  <span>{language === 'ar' ? 'تعديل نصوص الموقع' : 'Edit Website Texts'}</span>
                </button>

                <button
                  onClick={() => { setActiveTab('settings'); }}
                  className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer w-full whitespace-nowrap ${
                    activeTab === 'settings' 
                      ? 'bg-[#F7941D]/10 border border-[#F7941D]/30 text-[#F7941D]' 
                      : 'text-gray-400 hover:text-white hover:bg-white/[0.03] border border-transparent'
                  }`}
                >
                  <KeyRound size={15} />
                  <span>{language === 'ar' ? 'الأمان والمظهر' : 'Security & Appearance'}</span>
                </button>

                <div className="md:mt-auto pt-3 border-t border-white/5 w-full">
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:text-rose-300 hover:bg-rose-500/5 transition-all duration-200 cursor-pointer w-full text-right md:text-left whitespace-nowrap border border-transparent"
                  >
                    <LogOut size={15} />
                    <span>{language === 'ar' ? 'تسجيل الخروج' : 'Log Out'}</span>
                  </button>
                </div>
              </div>

              {/* Main dynamic panel viewport */}
              <div className="flex-grow p-6 overflow-y-auto min-h-0">
                
                {/* TAB 1: PROJECTS PANEL */}
                {activeTab === 'projects' && (
                  <div className="space-y-6">
                    {/* Toolbar header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          {language === 'ar' ? 'إدارة ونشر المشاريع الكلية' : 'Portfolio Projects Management'}
                          <span className="text-xs bg-[#F7941D]/15 text-[#F7941D] px-2.5 py-1 rounded-full font-mono font-bold">
                            {rawPortfolioItems.length}
                          </span>
                        </h3>
                        <p className="text-xs text-gray-400">
                          {language === 'ar' ? 'يمكنك إضافة مشاريع جديدة بالكامل أو التعديل على القائمة الحالية وحذفها.' : 'Add new items or modify, rearrange, and delete existing works.'}
                        </p>
                      </div>

                      {!isAddingProject && !editingProject && (
                        <button
                          onClick={handleOpenAddProject}
                          className="px-5 py-2.5 bg-gradient-to-r from-[#F7941D] to-amber-500 hover:from-amber-500 hover:to-[#F7941D] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-amber-500/5 hover:scale-[1.02] transition-all duration-200 cursor-pointer self-start sm:self-auto"
                        >
                          <Plus size={16} />
                          <span>{language === 'ar' ? 'إضافة مشروع جديد' : 'Publish New Project'}</span>
                        </button>
                      )}
                    </div>

                    {/* PROJECT FORM (ADD / EDIT) */}
                    {(isAddingProject || editingProject) ? (
                      <motion.form 
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        onSubmit={handleSaveProject} 
                        className="bg-white/[0.02] border border-white/[0.08] rounded-2xl p-5 space-y-5 relative"
                      >
                        <div className="flex justify-between items-center border-b border-white/5 pb-4">
                          <h4 className="font-bold text-[#F7941D] text-sm flex items-center gap-2">
                            <ImageIcon size={16} />
                            {editingProject 
                              ? (language === 'ar' ? `تعديل مشروع: ${editingProject.title}` : `Edit Project: ${editingProject.title}`) 
                              : (language === 'ar' ? 'إضافة ونشر مشروع جديد للموقع' : 'Publish a New Artwork')}
                          </h4>
                          <button
                            type="button"
                            onClick={() => { setIsAddingProject(false); setEditingProject(null); setHasRestoredProjDraft(false); }}
                            className="text-xs text-gray-400 hover:text-white flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-white/5 transition-all cursor-pointer"
                          >
                            {language === 'ar' ? 'إلغاء التعديل' : 'Cancel'}
                          </button>
                        </div>

                        {hasRestoredProjDraft && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="bg-amber-500/10 border border-amber-500/20 text-xs text-amber-500 p-3 rounded-xl flex items-center justify-between gap-4"
                          >
                            <span className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
                              {language === 'ar' 
                                ? 'تمت استعادة مسودة غير محفوظة تلقائياً لتجنب فقدان البيانات!' 
                                : 'An unsaved draft has been automatically restored to prevent data loss!'}
                            </span>
                            <button
                              type="button"
                              onClick={handleClearProjDraft}
                              className="underline font-bold text-amber-500 hover:text-amber-400 cursor-pointer whitespace-nowrap"
                            >
                              {language === 'ar' ? 'حذف المسودة والبدء من جديد' : 'Discard & Reset'}
                            </button>
                          </motion.div>
                        )}

                        {/* Form grid layout */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          
                          {/* Title Arabic */}
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-300 block">
                              {language === 'ar' ? 'العنوان الإبداعي (بالعربية) *' : 'Creative Title (Arabic) *'}
                            </label>
                            <input 
                              type="text"
                              value={projForm.titleAr}
                              onChange={(e) => setProjForm({...projForm, titleAr: e.target.value})}
                              placeholder="مثال: هوية بصرية متميزة ستوديو نكست"
                              className="w-full px-4 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white text-sm focus:border-[#F7941D] focus:outline-none"
                              required
                            />
                          </div>

                          {/* Title English */}
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-300 block">
                              {language === 'ar' ? 'العنوان الإبداعي (بالإنجليزية)' : 'Creative Title (English)'}
                            </label>
                            <input 
                              type="text"
                              value={projForm.titleEn}
                              onChange={(e) => setProjForm({...projForm, titleEn: e.target.value})}
                              placeholder="e.g. Next Level Studio Brand Identity"
                              className="w-full px-4 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white text-sm focus:border-[#F7941D] focus:outline-none"
                            />
                          </div>

                          {/* Category and Year */}
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-300 block">
                              {language === 'ar' ? 'قسم أو تصنيف المشروع *' : 'Project Category *'}
                            </label>
                            <select
                              value={projForm.categoryKey}
                              onChange={(e) => setProjForm({...projForm, categoryKey: e.target.value})}
                              className="w-full px-4 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white text-sm focus:border-[#F7941D] focus:outline-none"
                            >
                              {rawCategories.map(cat => (
                                <option key={cat.key} value={cat.key} className="bg-[#1D1031] text-white">
                                  {language === 'ar' ? cat.labelAr : cat.labelEn} ({cat.key})
                                </option>
                              ))}
                            </select>
                          </div>

                          {/* Year */}
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-300 block">
                              {language === 'ar' ? 'السنة / تاريخ الإنجاز' : 'Year / Launch Date'}
                            </label>
                            <input 
                              type="text"
                              value={projForm.year}
                              onChange={(e) => setProjForm({...projForm, year: e.target.value})}
                              placeholder="e.g. 2026"
                              className="w-full px-4 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white text-sm focus:border-[#F7941D] focus:outline-none"
                            />
                          </div>

                          {/* Main Thumbnail Image */}
                          <div className="space-y-2 md:col-span-2">
                            <label className="text-xs font-bold text-gray-300 block">
                              {language === 'ar' ? 'رابط الصورة البارزة الرئيسية للمشروع *' : 'Main Thumbnail Image URL *'}
                            </label>
                            <div className="flex gap-2 items-center">
                              <input 
                                type="text"
                                value={projForm.image}
                                onChange={(e) => setProjForm({...projForm, image: e.target.value})}
                                placeholder="https://images.unsplash.com/..."
                                className="flex-grow px-4 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white text-xs focus:border-[#F7941D] focus:outline-none font-mono"
                                required
                              />
                              <ImageFileUploader onUpload={(url) => setProjForm(p => ({ ...p, image: url }))} />
                            </div>
                            <p className="text-[10px] text-gray-400">
                              {language === 'ar' ? 'يمكنك استخدام روابط صور مباشرة أو رفع صورة مباشرة من جهازك لتتحول إلى كود مشفر وتعمل فوراً.' : 'Provide an image link or upload a direct image file from your device.'}
                            </p>
                          </div>

                          {/* Description Arabic */}
                          <div className="space-y-2 md:col-span-2">
                            <label className="text-xs font-bold text-gray-300 block">
                              {language === 'ar' ? 'تفاصيل ووصف المشروع المكتوب (بالعربية) *' : 'Project Story & Description (Arabic) *'}
                            </label>
                            <textarea 
                              rows={3}
                              value={projForm.descriptionAr}
                              onChange={(e) => setProjForm({...projForm, descriptionAr: e.target.value})}
                              placeholder="اكتب بالتفصيل هنا حول فكرة المشروع الإبداعية والخطوات البصرية..."
                              className="w-full px-4 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white text-sm focus:border-[#F7941D] focus:outline-none"
                              required
                            />
                          </div>

                          {/* Description English */}
                          <div className="space-y-2 md:col-span-2">
                            <label className="text-xs font-bold text-gray-300 block">
                              {language === 'ar' ? 'تفاصيل ووصف المشروع المكتوب (بالإنجليزية)' : 'Project Story & Description (English)'}
                            </label>
                            <textarea 
                              rows={3}
                              value={projForm.descriptionEn}
                              onChange={(e) => setProjForm({...projForm, descriptionEn: e.target.value})}
                              placeholder="Describe details regarding this custom branding layout, creative steps, and final outcome..."
                              className="w-full px-4 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white text-sm focus:border-[#F7941D] focus:outline-none"
                            />
                          </div>

                          {/* Client Arabic */}
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-300 block">
                              {language === 'ar' ? 'اسم العميل / الجهة المستفيدة (بالعربية)' : 'Client Name (Arabic)'}
                            </label>
                            <input 
                              type="text"
                              value={projForm.clientAr}
                              onChange={(e) => setProjForm({...projForm, clientAr: e.target.value})}
                              placeholder="مثال: ستوديو أورا أو عمل شخصي"
                              className="w-full px-4 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white text-sm focus:border-[#F7941D] focus:outline-none"
                            />
                          </div>

                          {/* Client English */}
                          <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-300 block">
                              {language === 'ar' ? 'اسم العميل / الجهة المستفيدة (بالإنجليزية)' : 'Client Name (English)'}
                            </label>
                            <input 
                              type="text"
                              value={projForm.clientEn}
                              onChange={(e) => setProjForm({...projForm, clientEn: e.target.value})}
                              placeholder="e.g. Aura Studio or Personal project"
                              className="w-full px-4 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white text-sm focus:border-[#F7941D] focus:outline-none"
                            />
                          </div>

                          {/* Tools string */}
                          <div className="space-y-2 md:col-span-2">
                            <label className="text-xs font-bold text-gray-300 block">
                              {language === 'ar' ? 'الأدوات والبرامج المستخدمة (مفصولة بفاصلة)' : 'Tools Used (Separated by comma)'}
                            </label>
                            <input 
                              type="text"
                              value={projForm.toolsString}
                              onChange={(e) => setProjForm({...projForm, toolsString: e.target.value})}
                              placeholder="Blender, Figma, Adobe Illustrator, Premiere"
                              className="w-full px-4 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white text-sm focus:border-[#F7941D] focus:outline-none"
                            />
                          </div>

                          {/* Gallery string */}
                          <div className="space-y-2 md:col-span-2">
                            <label className="text-xs font-bold text-gray-300 block">
                              {language === 'ar' ? 'روابط صور المعرض الداخلي الإضافية (مفصولة بفاصلة)' : 'Additional Gallery Image URLs (Separated by comma)'}
                            </label>
                            <div className="flex gap-2 items-start">
                              <textarea 
                                rows={2}
                                value={projForm.galleryString}
                                onChange={(e) => setProjForm({...projForm, galleryString: e.target.value})}
                                placeholder="https://image1.png, https://image2.jpg, https://image3.png"
                                className="flex-grow px-4 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white text-xs focus:border-[#F7941D] focus:outline-none font-mono"
                              />
                              <ImageFileUploader 
                                onUpload={(urls) => {
                                  const current = projForm.galleryString.trim();
                                  if (current) {
                                    setProjForm(p => ({ ...p, galleryString: current + ', ' + urls }));
                                  } else {
                                    setProjForm(p => ({ ...p, galleryString: urls }));
                                  }
                                }} 
                                multiple={true} 
                              />
                            </div>
                            <p className="text-[10px] text-gray-400">
                              {language === 'ar' ? 'سيتم تشغيل سلايدر تصفح تلقائي بهذه الصور للمشروع داخل المعرض. يمكنك تحديد عدة صور معاً لرفعها دفعة واحدة!' : 'These will be displayed as an autoplay slider when viewing this project details. You can select multiple files at once!'}
                            </p>
                          </div>

                          {/* Video Link */}
                          <div className="space-y-2 md:col-span-2">
                            <label className="text-xs font-bold text-gray-300 block">
                              {language === 'ar' ? 'رابط فيديو للمشروع (MP4 مباشر أو رابط YouTube/Vimeo)' : 'Project Video URL (Direct MP4 or YouTube/Vimeo Link)'}
                            </label>
                            <input 
                              type="text"
                              value={projForm.videoUrl}
                              onChange={(e) => setProjForm({...projForm, videoUrl: e.target.value})}
                              placeholder="https://example.com/video.mp4 or https://www.youtube.com/watch?v=..."
                              className="w-full px-4 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white text-xs focus:border-[#F7941D] focus:outline-none font-mono"
                            />
                            <p className="text-[10px] text-gray-400">
                              {language === 'ar' ? 'سيتم إدراج هذا الفيديو كأول عنصر يتم تشغيله وتصفحه داخل تفاصيل المشروع بالمعرض.' : 'This video will appear as the first interactive element in the project detail slide.'}
                            </p>
                          </div>

                        </div>

                        {/* Submit Actions */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-white/5">
                          <div className="flex items-center gap-2 text-emerald-400 text-[11px] font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span>{language === 'ar' ? 'تم الحفظ تلقائياً في المتصفح' : 'Draft auto-saved to browser'}</span>
                          </div>
                          <div className="flex justify-end gap-3">
                            <button
                              type="button"
                              onClick={() => { setIsAddingProject(false); setEditingProject(null); setHasRestoredProjDraft(false); }}
                              className="px-5 py-2.5 rounded-xl border border-white/10 hover:bg-white/5 text-gray-300 text-xs font-bold cursor-pointer transition-all duration-200"
                            >
                              {language === 'ar' ? 'إلغاء' : 'Cancel'}
                            </button>
                            <button
                              type="submit"
                              className="px-6 py-2.5 bg-gradient-to-r from-[#F7941D] to-amber-600 hover:from-amber-600 hover:to-[#F7941D] text-white text-xs font-bold rounded-xl shadow-md cursor-pointer transition-all duration-200"
                            >
                              <Save size={14} className="inline-block mr-1.5 align-middle" />
                              <span className="align-middle">{language === 'ar' ? 'حفظ ونشر المشروع الآن' : 'Publish & Save Project'}</span>
                            </button>
                          </div>
                        </div>
                      </motion.form>
                    ) : (
                      /* PROJECTS DIRECTORY TABLE LIST */
                      <div className="space-y-4">
                        {/* Search project */}
                        <div className="relative">
                          <input 
                            type="text"
                            placeholder={language === 'ar' ? 'ابحث في المشاريع المحفوظة...' : 'Filter saved projects...'}
                            value={projectSearch}
                            onChange={(e) => setProjectSearch(e.target.value)}
                            className="w-full px-4 py-2.5 bg-white/[0.02] border border-white/10 rounded-xl text-white text-xs focus:border-[#F7941D] focus:outline-none transition-all duration-200"
                          />
                        </div>

                        {/* Project Grid */}
                        <p className="text-[11px] text-gray-500 bg-white/[0.02] px-3 py-2 rounded-lg border border-white/5 flex items-center gap-1.5">
                          <LucideIcons.GripVertical size={13} className="text-[#F7941D]" />
                          <span>
                            {language === 'ar' 
                              ? 'يمكنك سحب وإفلات المشاريع باستخدام مقبض السحب لترتيبها يدوياً.' 
                              : 'You can drag and drop projects using the drag handle to rearrange them.'}
                          </span>
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {rawPortfolioItems
                            .filter(p => p.title.toLowerCase().includes(projectSearch.toLowerCase()) || p.category.toLowerCase().includes(projectSearch.toLowerCase()))
                            .map((p, idx) => {
                              const isDragging = draggedProjectIndex !== null && rawPortfolioItems[draggedProjectIndex]?.id === p.id;
                              return (
                                <div 
                                  key={p.id} 
                                  draggable
                                  onDragStart={(e) => handleProjectDragStart(e, p.id)}
                                  onDragOver={(e) => handleProjectDragOver(e, p.id)}
                                  onDragEnd={handleProjectDragEnd}
                                  className={`bg-white/[0.02] border p-3.5 flex gap-3.5 transition-all duration-200 rounded-xl relative ${
                                    isDragging 
                                      ? 'opacity-40 border-dashed border-[#F7941D]/50 bg-[#F7941D]/5' 
                                      : 'border-white/[0.05] hover:border-white/10 hover:bg-white/[0.04]'
                                  }`}
                                >
                                  {/* Drag Handle */}
                                  <div 
                                    className="flex items-center text-gray-500 hover:text-gray-300 shrink-0 cursor-grab active:cursor-grabbing self-stretch px-1"
                                    title={language === 'ar' ? 'اسحب لإعادة الترتيب' : 'Drag to reorder'}
                                  >
                                    <LucideIcons.GripVertical size={16} />
                                  </div>

                                  <div className="w-16 h-16 rounded-lg bg-black/40 overflow-hidden shrink-0 relative border border-white/5">
                                    <img 
                                      src={p.image} 
                                      alt="" 
                                      referrerPolicy="no-referrer"
                                      className="w-full h-full object-cover" 
                                      onError={(e) => {
                                        // Fallback for broken images
                                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80';
                                      }}
                                    />
                                  </div>

                                  <div className="flex-grow min-w-0 flex flex-col justify-between">
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-[10px] uppercase font-bold text-[#F7941D] bg-[#F7941D]/10 px-2 py-0.5 rounded-full">
                                          {p.category}
                                        </span>
                                        <span className="text-[10px] text-gray-400 font-mono">
                                          {p.year}
                                        </span>
                                      </div>
                                      <h4 className="font-bold text-white text-sm mt-1.5 truncate">
                                        {p.title}
                                      </h4>
                                      <p className="text-[11px] text-gray-400 truncate mt-0.5">
                                        {p.description}
                                      </p>
                                    </div>

                                    <div className="flex justify-end gap-2 mt-3">
                                      <button
                                        type="button"
                                        onClick={() => handleOpenEditProject(p)}
                                        className="p-1.5 rounded-lg border border-white/5 hover:border-amber-500/20 bg-white/5 hover:bg-[#F7941D]/15 text-gray-300 hover:text-[#F7941D] transition-all cursor-pointer z-10"
                                        title={language === 'ar' ? 'تعديل' : 'Edit'}
                                      >
                                        <Edit2 size={13} />
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteProject(p.id)}
                                        className="p-1.5 rounded-lg border border-white/5 hover:border-rose-500/20 bg-white/5 hover:bg-rose-500/15 text-gray-300 hover:text-rose-400 transition-all cursor-pointer z-10"
                                        title={language === 'ar' ? 'حذف' : 'Delete'}
                                      >
                                        <Trash2 size={13} />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: CATEGORIES PANEL */}
                {activeTab === 'categories' && (
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          {language === 'ar' ? 'تخصيص الأقسام والتصنيفات' : 'Custom Categories Manager'}
                          <span className="text-xs bg-[#F7941D]/15 text-[#F7941D] px-2.5 py-1 rounded-full font-mono font-bold">
                            {rawCategories.length}
                          </span>
                        </h3>
                        <p className="text-xs text-gray-400">
                          {language === 'ar' ? 'أضف أقساماً بصرية جديدة لفرز أعمالك (مثال: اللوحات الإعلانية، تصميم زفاف).' : 'Add visual subdivisions to classify and filter your creative projects.'}
                        </p>
                      </div>

                      {!isAddingCategory && (
                        <button
                          onClick={handleOpenAddCategory}
                          className="px-5 py-2.5 bg-[#F7941D] hover:bg-amber-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-md cursor-pointer transition-all duration-200"
                        >
                          <Plus size={16} />
                          <span>{language === 'ar' ? 'إضافة قسم جديد' : 'Create Category'}</span>
                        </button>
                      )}
                    </div>

                    {isAddingCategory && (
                      <motion.form 
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        onSubmit={handleSaveCategory}
                        className="bg-white/[0.02] border border-white/[0.08] rounded-xl p-5 space-y-4"
                      >
                        <h4 className="font-bold text-[#F7941D] text-sm flex items-center gap-2">
                          <FolderPlus size={16} />
                          {editingCategory 
                            ? (language === 'ar' ? 'تعديل بيانات القسم الحالي' : 'Edit Category Details') 
                            : (language === 'ar' ? 'إضافة قسم تصفية جديد بالكامل' : 'Create a New Portfolio Category')}
                        </h4>

                        {hasRestoredCatDraft && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="bg-amber-500/10 border border-amber-500/20 text-xs text-amber-500 p-3 rounded-xl flex items-center justify-between gap-4"
                          >
                            <span className="flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
                              {language === 'ar' 
                                ? 'تمت استعادة مسودة قسم غير محفوظة تلقائياً!' 
                                : 'An unsaved category draft has been automatically restored!'}
                            </span>
                            <button
                              type="button"
                              onClick={handleClearCatDraft}
                              className="underline font-bold text-amber-500 hover:text-amber-400 cursor-pointer whitespace-nowrap"
                            >
                              {language === 'ar' ? 'حذف المسودة والبدء من جديد' : 'Discard & Reset'}
                            </button>
                          </motion.div>
                        )}

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          {/* Key */}
                          <div className="space-y-1">
                            <label className="text-xs text-gray-300 block font-bold">
                              {language === 'ar' ? 'مفتاح التعريف الفريد (إنجليزي) *' : 'Unique ID Key (English) *'}
                            </label>
                            <input 
                              type="text"
                              value={catForm.key}
                              onChange={(e) => setCatForm({...catForm, key: e.target.value})}
                              placeholder="e.g. billboards"
                              disabled={!!editingCategory}
                              className="w-full px-4 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white text-sm focus:border-[#F7941D] focus:outline-none font-mono"
                              required
                            />
                            <p className="text-[10px] text-gray-500">
                              {language === 'ar' ? 'يجب أن يكون بحروف إنجليزية صغيرة بدون مسافات.' : 'Must be lowercase letters, e.g. wedding'}
                            </p>
                          </div>

                          {/* Arabic Label */}
                          <div className="space-y-1">
                            <label className="text-xs text-gray-300 block font-bold">
                              {language === 'ar' ? 'اسم القسم بالعربية *' : 'Category Name (Arabic) *'}
                            </label>
                            <input 
                              type="text"
                              value={catForm.labelAr}
                              onChange={(e) => setCatForm({...catForm, labelAr: e.target.value})}
                              placeholder="مثال: اللوحات الإعلانية"
                              className="w-full px-4 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white text-sm focus:border-[#F7941D] focus:outline-none"
                              required
                            />
                          </div>

                          {/* English Label */}
                          <div className="space-y-1">
                            <label className="text-xs text-gray-300 block font-bold">
                              {language === 'ar' ? 'اسم القسم بالإنجليزية *' : 'Category Name (English) *'}
                            </label>
                            <input 
                              type="text"
                              value={catForm.labelEn}
                              onChange={(e) => setCatForm({...catForm, labelEn: e.target.value})}
                              placeholder="e.g. Billboards & Signage"
                              className="w-full px-4 py-2.5 bg-black/30 border border-white/10 rounded-xl text-white text-sm focus:border-[#F7941D] focus:outline-none"
                              required
                            />
                          </div>
                        </div>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-white/5">
                          <div className="flex items-center gap-2 text-emerald-400 text-[11px] font-semibold">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span>{language === 'ar' ? 'تم الحفظ تلقائياً في المتصفح' : 'Draft auto-saved to browser'}</span>
                          </div>
                          <div className="flex justify-end gap-3">
                            <button
                              type="button"
                              onClick={() => { setIsAddingCategory(false); setEditingCategory(null); setHasRestoredCatDraft(false); }}
                              className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold text-gray-300 transition-all cursor-pointer"
                            >
                              {language === 'ar' ? 'إلغاء' : 'Cancel'}
                            </button>
                            <button
                              type="submit"
                              className="px-5 py-2 bg-[#F7941D] hover:bg-amber-600 rounded-xl text-xs font-bold text-white transition-all cursor-pointer"
                            >
                              {language === 'ar' ? 'حفظ القسم الجديد' : 'Save Category'}
                            </button>
                          </div>
                        </div>
                      </motion.form>
                    )}

                    {/* Categories listing */}
                    <div className="bg-black/10 border border-white/5 rounded-2xl overflow-hidden">
                      <table className="w-full text-sm text-gray-300">
                        <thead className="bg-white/[0.02] text-xs uppercase text-gray-400 font-bold border-b border-white/5">
                          <tr>
                            <th className="px-6 py-4 text-right md:text-right">{language === 'ar' ? 'مفتاح التعريف (ID)' : 'Key ID'}</th>
                            <th className="px-6 py-4 text-right md:text-right">{language === 'ar' ? 'الاسم بالعربية' : 'Arabic Name'}</th>
                            <th className="px-6 py-4 text-right md:text-right">{language === 'ar' ? 'الاسم بالإنجليزية' : 'English Name'}</th>
                            <th className="px-6 py-4 text-center">{language === 'ar' ? 'إجراءات' : 'Actions'}</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5">
                          {rawCategories.map((cat) => (
                            <tr key={cat.key} className="hover:bg-white/[0.02] transition-colors">
                              <td className="px-6 py-4 font-mono text-xs font-semibold text-amber-400">{cat.key}</td>
                              <td className="px-6 py-4 font-medium text-white">{cat.labelAr}</td>
                              <td className="px-6 py-4 text-gray-300">{cat.labelEn}</td>
                              <td className="px-6 py-4 text-center">
                                <div className="flex justify-center gap-2">
                                  <button
                                    onClick={() => handleOpenEditCategory(cat)}
                                    className="p-1.5 rounded-lg hover:bg-amber-500/10 text-amber-400 border border-transparent hover:border-amber-500/20 transition-all cursor-pointer"
                                  >
                                    <Edit2 size={13} />
                                  </button>
                                  <button
                                    onClick={() => handleDeleteCategory(cat.key)}
                                    className="p-1.5 rounded-lg hover:bg-rose-500/10 text-rose-400 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer"
                                  >
                                    <Trash2 size={13} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* TAB 3: TRANSLATIONS MANAGER */}
                {activeTab === 'translations' && (() => {
                  // Advanced categorization & filtering logic
                  const filteredKeys = customizableTextKeys.filter((item) => {
                    // Section filter
                    if (translationSectionFilter !== 'all' && item.section !== translationSectionFilter) {
                      return false;
                    }
                    
                    // Type classification
                    const isIcon = item.key.endsWith('.icon');
                    const isMedia = item.key.includes('Url') || item.key.includes('Link') || item.key.includes('Image') || item.key === 'hero.profileImage';
                    const isText = !isIcon && !isMedia;
                    
                    if (translationTypeFilter === 'icon' && !isIcon) return false;
                    if (translationTypeFilter === 'media' && !isMedia) return false;
                    if (translationTypeFilter === 'text' && !isText) return false;
                    
                    // Real-time multi-field search (searches keys, descriptions, sections, and active values)
                    if (translationSearch) {
                      const searchLower = translationSearch.toLowerCase();
                      const currentValAr = (customTranslations.ar[item.key] !== undefined ? customTranslations.ar[item.key] : t(item.key)) || '';
                      const currentValEn = (customTranslations.en[item.key] !== undefined ? customTranslations.en[item.key] : t(item.key)) || '';
                      
                      const matchesKey = item.key.toLowerCase().includes(searchLower);
                      const matchesDesc = item.desc.toLowerCase().includes(searchLower);
                      const matchesSection = item.section.toLowerCase().includes(searchLower);
                      const matchesValue = currentValAr.toLowerCase().includes(searchLower) || currentValEn.toLowerCase().includes(searchLower);
                      
                      if (!matchesKey && !matchesDesc && !matchesSection && !matchesValue) {
                        return false;
                      }
                    }
                    
                    return true;
                  });

                  // Premium background video presets
                  const bgVideoPresets = [
                    {
                      nameAr: 'شبكة بلكسوس مضيئة',
                      nameEn: 'Glowing Plexus Grid',
                      url: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-dark-plexus-glowing-dots-connection-loop-42865-large.mp4'
                    },
                    {
                      nameAr: 'تموجات الليزر السيبرانية',
                      nameEn: 'Cyber Laser Waves',
                      url: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-lights-background-loop-42867-large.mp4'
                    },
                    {
                      nameAr: 'الجسيمات البنفسجية المتوهجة',
                      nameEn: 'Glow Violet Particles',
                      url: 'https://assets.mixkit.co/videos/preview/mixkit-dust-particles-glowing-in-the-purple-light-42284-large.mp4'
                    },
                    {
                      nameAr: 'تدفق الخطوط الرقمية الذهبية',
                      nameEn: 'Golden Lines Stream',
                      url: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-digital-background-of-golden-lines-and-particles-42866-large.mp4'
                    }
                  ];

                  return (
                    <div className="space-y-6">
                      {/* Section Header */}
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-[#2A1E40]/20 border border-white/5 rounded-3xl p-6">
                        <div>
                          <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            {language === 'ar' ? 'مخصّص المحتوى والمظهر المطور' : 'Enhanced Content & Appearance Customizer'}
                            <span className="text-xs bg-[#F7941D]/10 text-[#F7941D] border border-[#F7941D]/20 px-2.5 py-1 rounded-full font-mono font-bold">
                              {filteredKeys.length} {language === 'ar' ? 'عنصر مطابق' : 'matching items'}
                            </span>
                          </h3>
                          <p className="text-xs text-gray-400 mt-1">
                            {language === 'ar' 
                              ? 'عدّل جميع نصوص الموقع، روابط الصور، فيديو الخلفية، والأيقونات الإبداعية التفاعلية بكل سهولة وسرعة.' 
                              : 'Easily edit any text, image URL, looping background video, and interactive creative icon.'}
                          </p>
                        </div>

                        <button
                          onClick={handleResetTranslations}
                          className="px-4 py-2 bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/20 hover:border-rose-500/40 text-rose-300 text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 self-start lg:self-auto shrink-0"
                        >
                          <RefreshCw size={14} className="animate-spin-hover" />
                          <span>{language === 'ar' ? 'استعادة الافتراضيات' : 'Restore Defaults'}</span>
                        </button>
                      </div>

                      {/* Search Bar & Primary Classification Tabs */}
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
                        {/* Instant Search Field */}
                        <div className="lg:col-span-5 relative">
                          <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-400">
                            <LucideIcons.Search size={14} />
                          </div>
                          <input
                            type="text"
                            value={translationSearch}
                            onChange={(e) => setTranslationSearch(e.target.value)}
                            placeholder={language === 'ar' ? 'ابحث بالمفتاح، النص أو الوصف المكتوب...' : 'Search by key, description or text content...'}
                            className="w-full pl-9 pr-9 py-2 bg-white/[0.02] border border-white/10 rounded-xl text-white text-xs placeholder:text-gray-500 focus:border-[#F7941D] focus:outline-none transition-all font-sans"
                          />
                          {translationSearch && (
                            <button
                              onClick={() => setTranslationSearch('')}
                              className="absolute inset-y-0 left-3 flex items-center text-gray-400 hover:text-white transition-colors cursor-pointer"
                            >
                              <LucideIcons.X size={13} />
                            </button>
                          )}
                        </div>

                        {/* Classification Filter Tabs */}
                        <div className="lg:col-span-7 flex flex-wrap gap-1.5">
                          {[
                            { key: 'all', labelAr: 'الكل', labelEn: 'All', icon: 'Layers' },
                            { key: 'text', labelAr: 'نصوص وعناوين', labelEn: 'Texts', icon: 'Type' },
                            { key: 'media', labelAr: 'وسائط وروابط', labelEn: 'Media & Links', icon: 'Image' },
                            { key: 'icon', labelAr: 'أيقونات إبداعية', labelEn: 'Creative Icons', icon: 'Sparkles' }
                          ].map((tab) => {
                            const TabIcon = (LucideIcons as any)[tab.icon] || LucideIcons.Layers;
                            return (
                              <button
                                key={tab.key}
                                onClick={() => setTranslationTypeFilter(tab.key as any)}
                                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all duration-200 cursor-pointer ${
                                  translationTypeFilter === tab.key
                                    ? 'bg-[#F7941D]/10 border border-[#F7941D]/30 text-[#F7941D]'
                                    : 'bg-white/[0.01] text-gray-400 hover:text-white hover:bg-white/[0.03] border border-white/5'
                                }`}
                              >
                                <TabIcon size={13} />
                                <span>{language === 'ar' ? tab.labelAr : tab.labelEn}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Section pills selection */}
                      <div className="bg-white/[0.01] border border-white/5 p-2.5 rounded-xl space-y-2">
                        <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">
                          {language === 'ar' ? 'تصفية حسب قسم الصفحة الرئيسي:' : 'Filter by Page Section:'}
                        </span>
                        <div className="flex flex-wrap gap-1.5 overflow-x-auto no-scrollbar">
                          {[
                            { key: 'all', labelAr: 'كل الأقسام', labelEn: 'All Sections' },
                            { key: 'العام والروابط', labelAr: 'العام والروابط', labelEn: 'General & Links' },
                            { key: 'بيانات الاتصال والروابط', labelAr: 'الاتصال والروابط', labelEn: 'Links & Contact' },
                            { key: 'الهيرو', labelAr: 'الهيرو (البداية)', labelEn: 'Hero Section' },
                            { key: 'من أنا', labelAr: 'من أنا (السيرة)', labelEn: 'About Me' },
                            { key: 'الخدمات الإبداعية', labelAr: 'الخدمات الإبداعية', labelEn: 'Creative Services' },
                            { key: 'شركاء النجاح', labelAr: 'شركاء النجاح', labelEn: 'Success Partners' },
                            { key: 'معرض الأعمال', labelAr: 'معرض الأعمال', labelEn: 'Portfolio Gallery' },
                            { key: 'التواصل', labelAr: 'نموذج التواصل', labelEn: 'Contact Form' },
                          ].map((sec) => (
                            <button
                              key={sec.key}
                              onClick={() => setTranslationSectionFilter(sec.key)}
                              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all duration-150 cursor-pointer whitespace-nowrap ${
                                translationSectionFilter === sec.key
                                  ? 'bg-[#F7941D]/10 text-[#F7941D] border border-[#F7941D]/20'
                                  : 'bg-white/[0.01] text-gray-400 hover:text-white hover:bg-white/[0.03] border border-white/5'
                              }`}
                            >
                              {language === 'ar' ? sec.labelAr : sec.labelEn}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Render filtered content */}
                      {filteredKeys.length === 0 ? (
                        <div className="text-center py-16 bg-black/20 border border-white/5 rounded-3xl space-y-3">
                          <LucideIcons.HelpCircle className="mx-auto text-gray-500 animate-pulse" size={32} />
                          <p className="text-sm text-gray-400">
                            {language === 'ar' ? 'لم يتم العثور على أي عناصر مطابقة لبحثك أو تصفيتك.' : 'No matching customizable items found.'}
                          </p>
                          <button
                            onClick={() => { setTranslationSearch(''); setTranslationSectionFilter('all'); setTranslationTypeFilter('all'); }}
                            className="text-xs text-[#F7941D] hover:underline cursor-pointer"
                          >
                            {language === 'ar' ? 'إعادة تعيين الفلاتر' : 'Reset all filters'}
                          </button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-6">
                          {filteredKeys.map((item) => {
                            const currentValAr = customTranslations.ar[item.key] !== undefined ? customTranslations.ar[item.key] : t(item.key);
                            const currentValEn = customTranslations.en[item.key] !== undefined ? customTranslations.en[item.key] : t(item.key);

                            const isIcon = item.key.endsWith('.icon');
                            const isMedia = item.key.includes('Url') || item.key.includes('Link') || item.key.includes('Image') || item.key === 'hero.profileImage';

                            // Render ICON Editor Card
                            if (isIcon) {
                              const popularIcons = [
                                'Megaphone', 'Box', 'Sparkles', 'Award', 'Share2', 'Video', 'Globe', 'Brain', 'Target',
                                'Camera', 'Heart', 'Palette', 'PenTool', 'Laptop', 'Code', 'Smartphone', 'Search',
                                'Compass', 'Layers', 'Briefcase', 'Clock', 'Settings', 'Users', 'MapPin', 'Mail',
                                'Phone', 'Shield', 'Zap', 'Cloud', 'Paintbrush', 'Music', 'Tv', 'ShoppingBag', 'Gamepad2'
                              ];
                              const currentIcon = currentValAr || currentValEn || 'Sparkles';
                              const SelectedIcon = (LucideIcons as any)[currentIcon] || LucideIcons.Sparkles;

                              return (
                                <div 
                                  key={item.key} 
                                  className="bg-[#2A1E40]/25 border border-white/5 rounded-2xl p-5 space-y-4 hover:border-white/10 transition-all duration-300"
                                >
                                  {/* Card Info Header */}
                                  <div className="flex justify-between items-start gap-4">
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-[9px] bg-[#F7941D]/15 text-[#F7941D] font-mono font-bold px-2 py-0.5 rounded-full uppercase">
                                          {language === 'ar' ? 'أيقونة إبداعية' : 'Creative Icon'}
                                        </span>
                                        <span className="text-[10px] text-indigo-300 font-bold">
                                          {item.section}
                                        </span>
                                      </div>
                                      <h4 className="font-bold text-white text-sm mt-1.5">
                                        {item.desc}
                                      </h4>
                                      <code className="text-[10px] text-gray-500 block font-mono mt-0.5">{item.key}</code>
                                    </div>
                                  </div>

                                  {/* Icon customizer layout */}
                                  <div className="flex flex-col xl:flex-row items-start gap-4 bg-black/20 p-4 rounded-xl border border-white/5">
                                    {/* Big dynamic preview */}
                                    <div className="w-14 h-14 rounded-xl bg-[#F7941D]/10 text-[#F7941D] flex items-center justify-center border border-[#F7941D]/30 shrink-0 select-none shadow-inner">
                                      <SelectedIcon size={28} />
                                    </div>

                                    <div className="flex-grow w-full space-y-3">
                                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                                        <div className="space-y-1">
                                          <span className="text-[10px] font-bold text-gray-400 block">
                                            {language === 'ar' ? 'اسم أيقونة Lucide المكتوب' : 'Lucide Icon String'}
                                          </span>
                                          <input
                                            type="text"
                                            value={currentIcon}
                                            onChange={(e) => {
                                              const cleanVal = e.target.value.trim();
                                              handleUpdateTranslation(item.key, 'ar', cleanVal);
                                              handleUpdateTranslation(item.key, 'en', cleanVal);
                                            }}
                                            className="w-full px-4 py-2 bg-black/45 border border-white/10 rounded-xl text-white text-xs focus:border-[#F7941D] focus:outline-none font-mono"
                                          />
                                        </div>

                                        <div className="space-y-1">
                                          <span className="text-[10px] font-bold text-gray-400 block">
                                            {language === 'ar' ? 'اختيار فوري' : 'Instant Select Option'}
                                          </span>
                                          <select
                                            value={popularIcons.includes(currentIcon) ? currentIcon : ''}
                                            onChange={(e) => {
                                              if (e.target.value) {
                                                handleUpdateTranslation(item.key, 'ar', e.target.value);
                                                handleUpdateTranslation(item.key, 'en', e.target.value);
                                              }
                                            }}
                                            className="w-full px-4 py-2 bg-black/45 border border-white/10 rounded-xl text-white text-xs focus:border-[#F7941D] focus:outline-none cursor-pointer"
                                          >
                                            <option value="" disabled>{language === 'ar' ? '-- اختر أيقونة شائعة --' : '-- Choose popular icon --'}</option>
                                            {popularIcons.map(icon => (
                                              <option key={icon} value={icon}>{icon}</option>
                                            ))}
                                          </select>
                                        </div>
                                      </div>

                                      {/* Quick Click Icons Bar */}
                                      <div className="space-y-1.5">
                                        <span className="text-[9px] font-bold text-gray-500 block">
                                          {language === 'ar' ? 'انقر على أيقونة للتطبيق فوراً:' : 'Quick tap to assign icon instantly:'}
                                        </span>
                                        <div className="flex flex-wrap gap-1 bg-black/35 p-2 rounded-lg max-h-[75px] overflow-y-auto custom-scrollbar">
                                          {popularIcons.slice(0, 18).map(icon => {
                                            const TinyIcon = (LucideIcons as any)[icon] || LucideIcons.Sparkles;
                                            const isSelected = icon === currentIcon;
                                            return (
                                              <button
                                                type="button"
                                                key={icon}
                                                onClick={() => {
                                                  handleUpdateTranslation(item.key, 'ar', icon);
                                                  handleUpdateTranslation(item.key, 'en', icon);
                                                }}
                                                title={icon}
                                                className={`p-1.5 rounded-lg border transition-all hover:scale-110 active:scale-95 cursor-pointer ${
                                                  isSelected 
                                                    ? 'bg-[#F7941D] text-white border-[#F7941D]' 
                                                    : 'bg-[#2A1E40]/30 hover:bg-white/10 text-gray-400 hover:text-white border-white/5'
                                                }`}
                                              >
                                                <TinyIcon size={14} />
                                              </button>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              );
                            }

                            // Render MEDIA / URL / LINK Editor Card
                            if (isMedia) {
                              const isVideo = currentValAr.endsWith('.mp4') || currentValAr.includes('video') || item.key === 'hero.bgVideoUrl';
                              const isImage = !isVideo && (item.key.includes('Image') || item.key.includes('logoUrl') || currentValAr.includes('png') || currentValAr.includes('jpg') || currentValAr.includes('jpeg') || currentValAr.includes('webp') || currentValAr.includes('gif'));

                              return (
                                <div 
                                  key={item.key} 
                                  className="bg-[#2A1E40]/25 border border-white/5 rounded-2xl p-5 space-y-4 hover:border-white/10 transition-all duration-300"
                                >
                                  {/* Card Header */}
                                  <div className="flex justify-between items-start gap-4">
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <span className="text-[9px] bg-sky-500/10 text-sky-300 border border-sky-500/20 font-mono font-bold px-2 py-0.5 rounded-full uppercase">
                                          {isVideo ? (language === 'ar' ? 'فيديو خلفية' : 'Loop Video') : isImage ? (language === 'ar' ? 'رابط صورة' : 'Image URL') : (language === 'ar' ? 'رابط مباشر' : 'Direct Link')}
                                        </span>
                                        <span className="text-[10px] text-indigo-300 font-bold">
                                          {item.section}
                                        </span>
                                      </div>
                                      <h4 className="font-bold text-white text-sm mt-1.5">
                                        {item.desc}
                                      </h4>
                                      <code className="text-[10px] text-gray-500 block font-mono mt-0.5">{item.key}</code>
                                    </div>

                                    {/* Action button to copy Ar to En easily */}
                                    <button
                                      type="button"
                                      onClick={() => {
                                        handleUpdateTranslation(item.key, 'en', currentValAr);
                                        showNotification(language === 'ar' ? 'تمت مزامنة الرابط للغتين بنجاح!' : 'URL synced to both languages!');
                                      }}
                                      className="px-2.5 py-1 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white rounded-lg text-[10px] font-bold flex items-center gap-1 cursor-pointer transition-colors"
                                      title={language === 'ar' ? 'نسخ الرابط واللصق في الإنجليزية أيضاً لتوحيد الرابط' : 'Copy and sync to English URL'}
                                    >
                                      <Copy size={11} />
                                      <span>{language === 'ar' ? 'مزامنة اللغتين' : 'Sync Language URLs'}</span>
                                    </button>
                                  </div>

                                  {/* Media customization layout */}
                                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 bg-black/15 p-4 rounded-xl border border-white/5">
                                    
                                    {/* Inputs Column */}
                                    <div className="lg:col-span-8 space-y-3">
                                      <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 block flex items-center gap-1">
                                          <Globe size={11} className="text-[#F7941D]" />
                                          {language === 'ar' ? 'رابط عربي / افتراضي' : 'Arabic / Default URL'}
                                        </label>
                                        <div className="flex gap-2 items-center">
                                          <input
                                            type="text"
                                            value={currentValAr}
                                            onChange={(e) => {
                                              const val = e.target.value.trim();
                                              handleUpdateTranslation(item.key, 'ar', val);
                                              // Auto-mirror to English if English URL is empty or matches previous Ar
                                              if (!currentValEn || currentValEn === currentValAr) {
                                                handleUpdateTranslation(item.key, 'en', val);
                                              }
                                            }}
                                            placeholder="https://example.com/asset.mp4"
                                            className="flex-grow px-4 py-2 bg-black/45 border border-white/10 rounded-xl text-white text-xs focus:border-[#F7941D] focus:outline-none font-mono"
                                          />
                                          <ImageFileUploader 
                                            onUpload={(url) => {
                                              handleUpdateTranslation(item.key, 'ar', url);
                                              if (!currentValEn || currentValEn === currentValAr) {
                                                handleUpdateTranslation(item.key, 'en', url);
                                              }
                                            }} 
                                          />
                                        </div>
                                      </div>

                                      <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-400 block flex items-center gap-1">
                                          <Globe size={11} className="text-blue-400" />
                                          {language === 'ar' ? 'رابط إنجليزي' : 'English URL'}
                                        </label>
                                        <div className="flex gap-2 items-center">
                                          <input
                                            type="text"
                                            value={currentValEn}
                                            onChange={(e) => handleUpdateTranslation(item.key, 'en', e.target.value.trim())}
                                            placeholder="https://example.com/asset.mp4"
                                            className="flex-grow px-4 py-2 bg-black/45 border border-white/10 rounded-xl text-white text-xs focus:border-[#F7941D] focus:outline-none font-mono"
                                            dir="ltr"
                                          />
                                          <ImageFileUploader onUpload={(url) => handleUpdateTranslation(item.key, 'en', url)} />
                                        </div>
                                      </div>

                                      {/* Specific video background quick presets for high impact! */}
                                      {item.key === 'hero.bgVideoUrl' && (
                                        <div className="pt-2 border-t border-white/5 space-y-2">
                                          <span className="text-[10px] font-bold text-amber-400 block flex items-center gap-1">
                                            <LucideIcons.Sparkles size={12} />
                                            {language === 'ar' ? 'فيديوهات خلفية احترافية مقترحة (انقر للتطبيق الفوري):' : 'Suggested Pro Loops (Click to apply instantly):'}
                                          </span>
                                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                            {bgVideoPresets.map((preset, pIdx) => {
                                              const isApplied = currentValAr === preset.url;
                                              return (
                                                <button
                                                  type="button"
                                                  key={pIdx}
                                                  onClick={() => {
                                                    handleUpdateTranslation(item.key, 'ar', preset.url);
                                                    handleUpdateTranslation(item.key, 'en', preset.url);
                                                    showNotification(language === 'ar' ? `تم تطبيق خلفية: ${preset.nameAr}!` : `Applied loop background: ${preset.nameEn}!`);
                                                  }}
                                                  className={`p-2 rounded-lg border text-left flex flex-col text-[10px] font-bold transition-all ${
                                                    isApplied 
                                                      ? 'bg-[#F7941D]/15 text-[#F7941D] border-[#F7941D]' 
                                                      : 'bg-white/5 text-gray-400 hover:text-white border-white/5 hover:bg-white/10'
                                                  }`}
                                                >
                                                  <span className="truncate">{language === 'ar' ? preset.nameAr : preset.nameEn}</span>
                                                  <span className="text-[8px] opacity-50 font-mono mt-0.5 truncate">{preset.nameEn}</span>
                                                </button>
                                              );
                                            })}
                                          </div>
                                        </div>
                                      )}
                                    </div>

                                    {/* Preview Column */}
                                    <div className="lg:col-span-4 flex flex-col items-center justify-center bg-black/30 border border-white/5 rounded-xl p-3 select-none">
                                      <span className="text-[9px] font-mono font-bold text-gray-500 uppercase tracking-wider mb-2 block text-center">
                                        {language === 'ar' ? 'معاينة حية للمحتوى' : 'Live Media Preview'}
                                      </span>

                                      {isVideo && currentValAr ? (
                                        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-[#1D1031] border border-white/10 group shadow-inner">
                                          <video
                                            key={currentValAr}
                                            src={currentValAr}
                                            autoPlay
                                            loop
                                            muted
                                            playsInline
                                            className="w-full h-full object-cover opacity-80"
                                            onError={(e) => {
                                              // Handle bad source URL gracefully
                                              const parent = (e.target as HTMLElement).parentElement;
                                              if (parent) parent.innerHTML = '<div class="text-[10px] text-rose-400 p-4 text-center">Error playing video URL</div>';
                                            }}
                                          />
                                        </div>
                                      ) : isImage && currentValAr ? (
                                        <div className="w-full aspect-square md:w-24 md:h-24 rounded-lg overflow-hidden bg-white/5 border border-white/10 flex items-center justify-center p-1">
                                          <img
                                            src={currentValAr}
                                            alt="Media Preview"
                                            referrerPolicy="no-referrer"
                                            className="w-full h-full object-contain"
                                            onError={(e) => {
                                              (e.target as HTMLImageElement).src = 'https://placehold.co/150x150/1d1031/ffffff?text=Error';
                                            }}
                                          />
                                        </div>
                                      ) : (
                                        <div className="text-center py-4 text-gray-500 space-y-2">
                                          <LucideIcons.Link size={20} className="mx-auto text-gray-600" />
                                          <a
                                            href={currentValAr}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-1 text-[10px] bg-indigo-500/10 text-indigo-300 hover:bg-indigo-500/20 border border-indigo-500/20 px-2 py-1 rounded-md"
                                          >
                                            <span>{language === 'ar' ? 'اختبار الرابط الخارجي' : 'Test External Link'}</span>
                                            <LucideIcons.Globe size={10} />
                                          </a>
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            }

                            // Render STANDARD TEXT / TEXTAREA Editor Card
                            const isLongText = item.key === 'about.text' || item.key === 'contact.description' || item.key === 'hero.subtitle';

                            return (
                              <div 
                                key={item.key} 
                                className="bg-[#2A1E40]/25 border border-white/5 rounded-2xl p-5 space-y-4 hover:border-white/10 transition-all duration-300"
                              >
                                {/* Card Title Block */}
                                <div className="flex justify-between items-start gap-4">
                                  <div>
                                    <div className="flex items-center gap-2">
                                      <span className="text-[9px] bg-emerald-500/10 text-emerald-300 border border-emerald-500/20 font-mono font-bold px-2 py-0.5 rounded-full uppercase">
                                        {isLongText ? (language === 'ar' ? 'نص طويل' : 'Long Paragraph') : (language === 'ar' ? 'نص وعنوان' : 'Short Heading')}
                                      </span>
                                      <span className="text-[10px] text-indigo-300 font-bold">
                                        {item.section}
                                      </span>
                                    </div>
                                    <h4 className="font-bold text-white text-sm mt-1.5">
                                      {item.desc}
                                    </h4>
                                    <code className="text-[10px] text-gray-500 block font-mono mt-0.5">{item.key}</code>
                                  </div>
                                </div>

                                {/* Custom Input Text Areas */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                  {/* Arabic text input */}
                                  <div className="space-y-1.5">
                                    <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                                      <Globe size={11} className="text-[#F7941D]" />
                                      {language === 'ar' ? 'النسخة العربية' : 'Arabic Version'}
                                    </span>
                                    {isLongText ? (
                                      <div className="relative">
                                        <textarea
                                          rows={3}
                                          value={currentValAr}
                                          onChange={(e) => handleUpdateTranslation(item.key, 'ar', e.target.value)}
                                          className="w-full px-4 py-2.5 bg-black/45 border border-white/10 rounded-xl text-white text-xs focus:border-[#F7941D] focus:outline-none leading-relaxed"
                                        />
                                        <span className="absolute bottom-2 left-3 text-[8px] font-mono text-gray-500 select-none">
                                          {currentValAr.length} ch
                                        </span>
                                      </div>
                                    ) : (
                                      <input
                                        type="text"
                                        value={currentValAr}
                                        onChange={(e) => handleUpdateTranslation(item.key, 'ar', e.target.value)}
                                        className="w-full px-4 py-2.5 bg-black/45 border border-white/10 rounded-xl text-white text-xs focus:border-[#F7941D] focus:outline-none"
                                      />
                                    )}
                                  </div>

                                  {/* English text input */}
                                  <div className="space-y-1.5">
                                    <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1">
                                      <Globe size={11} className="text-blue-400" />
                                      {language === 'ar' ? 'النسخة الإنجليزية' : 'English Version'}
                                    </span>
                                    {isLongText ? (
                                      <div className="relative">
                                        <textarea
                                          rows={3}
                                          value={currentValEn}
                                          onChange={(e) => handleUpdateTranslation(item.key, 'en', e.target.value)}
                                          className="w-full px-4 py-2.5 bg-black/45 border border-white/10 rounded-xl text-white text-xs focus:border-[#F7941D] focus:outline-none leading-relaxed"
                                          dir="ltr"
                                        />
                                        <span className="absolute bottom-2 right-3 text-[8px] font-mono text-gray-500 select-none">
                                          {currentValEn.length} ch
                                        </span>
                                      </div>
                                    ) : (
                                      <input
                                        type="text"
                                        value={currentValEn}
                                        onChange={(e) => handleUpdateTranslation(item.key, 'en', e.target.value)}
                                        className="w-full px-4 py-2.5 bg-black/45 border border-white/10 rounded-xl text-white text-xs focus:border-[#F7941D] focus:outline-none"
                                        dir="ltr"
                                      />
                                    )}
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })()}

                {activeTab === 'media' && (
                  <div className="space-y-8 animate-fade-in">
                    {/* Tab Header */}
                    <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                          <ImageIcon size={20} className="text-[#F7941D]" />
                          {language === 'ar' ? 'معرض التحكم الموحد بالوسائط والصور' : 'Unified Media & Image Dashboard'}
                        </h3>
                        <p className="text-xs text-gray-400 mt-1">
                          {language === 'ar' 
                            ? 'تحكم بجميع صور الموقع، الشعار، البروفايل، شركاء النجاح، ومعارض أعمال المشاريع بسهولة من مكان واحد.' 
                            : 'Control all website images, brand assets, profile photo, success partners logos, and portfolio project media in one unified panel.'}
                        </p>
                      </div>
                      <div className="text-xs text-gray-500 font-mono bg-black/20 px-3 py-1.5 rounded-xl border border-white/5">
                        {language === 'ar' ? 'إجمالي الملفات المرئية: ' : 'Total Visual Files: '}
                        <span className="text-[#F7941D] font-bold">
                          {3 + localPartnerLogos.length + rawPortfolioItems.reduce((acc, item) => acc + 1 + (item.gallery?.length || 0), 0)}
                        </span>
                      </div>
                    </div>

                    {/* SECTION 1: MAIN ASSETS */}
                    <div className="bg-white/[0.01] border border-white/5 rounded-3xl p-6 space-y-6">
                      <h4 className="text-sm font-bold text-[#F7941D] flex items-center gap-2 border-b border-white/5 pb-3">
                        <LucideIcons.Sparkles size={16} />
                        {language === 'ar' ? 'القسم الأول: أصول الهوية والواجهة الرئيسية' : 'Section 1: Brand & Hero Main Media'}
                      </h4>

                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* BRAND LOGO */}
                        <div className="bg-black/15 border border-white/5 p-4 rounded-2xl flex flex-col justify-between space-y-4">
                          <div>
                            <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">
                              {language === 'ar' ? 'شعار الموقع المخصص' : 'Custom Brand Logo'}
                            </span>
                            <p className="text-[11px] text-gray-500 mt-0.5">
                              {language === 'ar' ? 'يظهر في القائمة العلوية للهواتف والحاسوب.' : 'Displays in top navbar.'}
                            </p>
                          </div>
                          <div className="w-full h-16 bg-white/5 border border-white/10 rounded-xl flex items-center justify-center overflow-hidden p-2">
                            {customTranslations.ar['nav.logoUrl'] ? (
                              renderAdminMediaPreview(customTranslations.ar['nav.logoUrl'], "h-16", "max-h-full max-w-full object-contain")
                            ) : (
                              <span className="text-[10px] text-gray-500 font-mono">{language === 'ar' ? 'الشعار ثلاثي الأبعاد الافتراضي' : 'Default 3D interactive logo'}</span>
                            )}
                          </div>
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <input 
                                type="text"
                                value={customTranslations.ar['nav.logoUrl'] || ''}
                                onChange={(e) => {
                                  const url = e.target.value.trim();
                                  handleUpdateTranslation('nav.logoUrl', 'ar', url);
                                  handleUpdateTranslation('nav.logoUrl', 'en', url);
                                }}
                                placeholder="https://example.com/logo.png"
                                className="flex-grow px-3 py-1.5 bg-black/45 border border-white/5 rounded-lg text-white text-xs focus:border-[#F7941D] focus:outline-none font-mono"
                              />
                              <ImageFileUploader onUpload={(url) => {
                                handleUpdateTranslation('nav.logoUrl', 'ar', url);
                                handleUpdateTranslation('nav.logoUrl', 'en', url);
                              }} />
                            </div>
                          </div>
                        </div>

                        {/* PROFILE IMAGE */}
                        <div className="bg-black/15 border border-white/5 p-4 rounded-2xl flex flex-col justify-between space-y-4">
                          <div>
                            <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">
                              {language === 'ar' ? 'صورة الملف الشخصي لمانع' : 'Manea Profile Photo'}
                            </span>
                            <p className="text-[11px] text-gray-500 mt-0.5">
                              {language === 'ar' ? 'تظهر في واجهة الترحيب والتعريف.' : 'Displays in main welcome banner.'}
                            </p>
                          </div>
                          <div className="w-full h-16 flex items-center justify-center bg-black/25 rounded-xl border border-white/5 p-1">
                            {renderAdminMediaPreview(
                              customTranslations.ar['hero.profileImage'] || 'https://i.ibb.co/JWtLY2cB/Rectangle-40443-81459862.png',
                              "h-16",
                              "h-16 w-16 rounded-full object-cover border border-white/10 shadow-lg"
                            )}
                          </div>
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <input 
                                type="text"
                                value={customTranslations.ar['hero.profileImage'] || 'https://i.ibb.co/JWtLY2cB/Rectangle-40443-81459862.png'}
                                onChange={(e) => {
                                  const url = e.target.value.trim();
                                  handleUpdateTranslation('hero.profileImage', 'ar', url);
                                  handleUpdateTranslation('hero.profileImage', 'en', url);
                                }}
                                placeholder="https://example.com/profile.png"
                                className="flex-grow px-3 py-1.5 bg-black/45 border border-white/5 rounded-lg text-white text-xs focus:border-[#F7941D] focus:outline-none font-mono"
                              />
                              <ImageFileUploader onUpload={(url) => {
                                handleUpdateTranslation('hero.profileImage', 'ar', url);
                                handleUpdateTranslation('hero.profileImage', 'en', url);
                              }} />
                            </div>
                          </div>
                        </div>

                        {/* HERO BG VIDEO */}
                        <div className="bg-black/15 border border-white/5 p-4 rounded-2xl flex flex-col justify-between space-y-4">
                          <div>
                            <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">
                              {language === 'ar' ? 'فيديو خلفية الهيرو التفاعلي' : 'Hero Background Video'}
                            </span>
                            <p className="text-[11px] text-gray-500 mt-0.5">
                              {language === 'ar' ? 'خلفية فيديو MP4 دائرية مكررة.' : 'Looping ambient MP4 video background.'}
                            </p>
                          </div>
                          <div className="w-full h-16 bg-black/40 border border-white/10 rounded-xl overflow-hidden relative flex items-center justify-center">
                            {renderAdminMediaPreview(
                              customTranslations.ar['hero.bgVideoUrl'] || 'https://assets.mixkit.co/videos/preview/mixkit-abstract-dark-plexus-glowing-dots-connection-loop-42865-large.mp4',
                              "h-16",
                              "w-full h-full object-cover opacity-60"
                            )}
                          </div>
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <input 
                                type="text"
                                value={customTranslations.ar['hero.bgVideoUrl'] || ''}
                                onChange={(e) => {
                                  const url = e.target.value.trim();
                                  handleUpdateTranslation('hero.bgVideoUrl', 'ar', url);
                                  handleUpdateTranslation('hero.bgVideoUrl', 'en', url);
                                }}
                                placeholder="https://example.com/video.mp4"
                                className="flex-grow px-3 py-1.5 bg-black/45 border border-white/5 rounded-lg text-white text-xs focus:border-[#F7941D] focus:outline-none font-mono"
                              />
                              <ImageFileUploader onUpload={(url) => {
                                handleUpdateTranslation('hero.bgVideoUrl', 'ar', url);
                                handleUpdateTranslation('hero.bgVideoUrl', 'en', url);
                              }} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* SECTION 2: SUCCESS PARTNERS */}
                    <div className="bg-white/[0.01] border border-white/5 rounded-3xl p-6 space-y-6">
                      <div className="flex items-center justify-between border-b border-white/5 pb-3">
                        <h4 className="text-sm font-bold text-[#F7941D] flex items-center gap-2">
                          <LucideIcons.Users size={16} />
                          {language === 'ar' ? 'القسم الثاني: شعارات شركاء النجاح' : 'Section 2: Success Partners Logos'}
                        </h4>
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...localPartnerLogos, ''];
                            setLocalPartnerLogos(updated);
                            setRawPartnerLogos(updated);
                          }}
                          className="px-3 py-1 bg-[#F7941D]/10 hover:bg-[#F7941D]/20 border border-[#F7941D]/30 text-[#F7941D] text-xs font-bold rounded-lg transition-all flex items-center gap-1 cursor-pointer"
                        >
                          <Plus size={12} />
                          <span>{language === 'ar' ? 'إضافة شعار جديد' : 'Add Partner'}</span>
                        </button>
                      </div>

                      {localPartnerLogos.length === 0 ? (
                        <div className="text-center py-6 text-gray-500 text-xs">
                          {language === 'ar' ? 'لا يوجد شعارات مضافة حالياً.' : 'No partner logos added.'}
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <p className="text-[11px] text-gray-500 bg-white/[0.02] px-3 py-2 rounded-lg border border-white/5 flex items-center gap-1.5">
                            <LucideIcons.GripVertical size={13} className="text-[#F7941D]" />
                            <span>
                              {language === 'ar' 
                                ? 'يمكنك سحب وإفلات الشعارات لإعادة ترتيبها.' 
                                : 'You can drag and drop logos to rearrange them.'}
                            </span>
                          </p>

                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {localPartnerLogos.map((logoUrl, index) => {
                              const isDragging = draggedLogoIndex === index;
                              return (
                                <div 
                                  key={index} 
                                  draggable
                                  onDragStart={(e) => handleLogoDragStart(e, index)}
                                  onDragOver={(e) => handleLogoDragOver(e, index)}
                                  onDragEnd={handleLogoDragEnd}
                                  className={`bg-black/15 border p-3 rounded-2xl space-y-3 relative group transition-all duration-200 cursor-grab active:cursor-grabbing ${
                                    isDragging 
                                      ? 'opacity-40 border-dashed border-[#F7941D]/50 bg-[#F7941D]/5' 
                                      : 'border-white/5 hover:border-white/10'
                                  }`}
                                >
                                  {/* Drag Handle at top-left overlay */}
                                  <div 
                                    className="absolute top-2 left-2 p-1 text-gray-500 hover:text-gray-300 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-grab active:cursor-grabbing"
                                    title={language === 'ar' ? 'اسحب لإعادة الترتيب' : 'Drag to reorder'}
                                  >
                                    <LucideIcons.GripVertical size={12} />
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => {
                                      const updated = localPartnerLogos.filter((_, i) => i !== index);
                                      setLocalPartnerLogos(updated);
                                      setRawPartnerLogos(updated);
                                      showNotification(language === 'ar' ? 'تم حذف الشعار' : 'Logo deleted');
                                    }}
                                    className="absolute top-2 right-2 p-1 bg-black/60 hover:bg-rose-950 text-rose-400 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 border border-white/10 z-10"
                                    title={language === 'ar' ? 'حذف الشعار' : 'Delete Logo'}
                                  >
                                    <Trash2 size={12} />
                                  </button>

                                  <div className="w-full h-14 bg-white rounded-xl flex items-center justify-center overflow-hidden border border-white/10">
                                    {logoUrl ? (
                                      renderAdminMediaPreview(logoUrl, "h-14", "max-h-full max-w-full object-contain p-1.5")
                                    ) : (
                                      <span className="text-[10px] text-gray-500 font-mono">Empty</span>
                                    )}
                                  </div>

                                  <div className="flex gap-1.5">
                                    <input 
                                      type="text"
                                      value={logoUrl}
                                      onChange={(e) => {
                                        const updated = [...localPartnerLogos];
                                        updated[index] = e.target.value.trim();
                                        setLocalPartnerLogos(updated);
                                        setRawPartnerLogos(updated);
                                      }}
                                      placeholder="https://example.com/logo.png"
                                      className="w-full px-2 py-1 bg-black/45 border border-white/5 rounded-lg text-white text-[10px] focus:border-[#F7941D] focus:outline-none font-mono"
                                    />
                                    <ImageFileUploader onUpload={(url) => {
                                      const updated = [...localPartnerLogos];
                                      updated[index] = url;
                                      setLocalPartnerLogos(updated);
                                      setRawPartnerLogos(updated);
                                    }} />
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* SECTION 3: PORTFOLIO PROJECTS MEDIA */}
                    <div className="bg-white/[0.01] border border-white/5 rounded-3xl p-6 space-y-6">
                      <h4 className="text-sm font-bold text-[#F7941D] flex items-center gap-2 border-b border-white/5 pb-3">
                        <LucideIcons.LayoutDashboard size={16} />
                        {language === 'ar' ? 'القسم الثالث: صور ومعارض أعمال المشاريع المضافة' : 'Section 3: Portfolio Projects Media & Galleries'}
                      </h4>

                      <div className="space-y-6">
                        {rawPortfolioItems.map((item) => (
                          <div key={item.id} className="bg-black/15 border border-white/5 rounded-2xl p-5 space-y-5 hover:border-white/10 transition-colors">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-white/5 pb-2 gap-2">
                              <div>
                                <h5 className="font-bold text-white text-sm">{item.title}</h5>
                                <span className="text-[10px] font-mono text-gray-500">{item.id} • {item.category}</span>
                              </div>
                              <span className="text-[10px] bg-amber-500/10 text-amber-300 px-2 py-0.5 rounded-full border border-amber-500/20 font-mono">
                                {1 + (item.gallery?.length || 0)} {language === 'ar' ? 'ملفات وسائط' : 'media files'}
                              </span>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                              {/* Left side: Main cover image */}
                              <div className="lg:col-span-5 space-y-3">
                                <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">
                                  {language === 'ar' ? 'الصورة الرئيسية للمشروع (الغلاف)' : 'Main Project Cover Image'}
                                </span>
                                <div className="flex items-center gap-4 bg-black/25 p-3 rounded-xl border border-white/5">
                                  <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-lg overflow-hidden shrink-0 flex items-center justify-center">
                                    {renderAdminMediaPreview(item.image, "h-20", "w-full h-full object-cover")}
                                  </div>
                                  <div className="flex-grow space-y-2">
                                    <input 
                                      type="text"
                                      value={item.image}
                                      onChange={(e) => handleUpdateProjectMedia(item.id, 'image', e.target.value.trim())}
                                      className="w-full px-3 py-1.5 bg-black/45 border border-white/5 rounded-lg text-white text-xs focus:border-[#F7941D] focus:outline-none font-mono"
                                    />
                                    <ImageFileUploader onUpload={(url) => {
                                      handleUpdateProjectMedia(item.id, 'image', url);
                                      showNotification(language === 'ar' ? 'تم تحديث غلاف المشروع!' : 'Cover updated!');
                                    }} />
                                  </div>
                                </div>
                              </div>

                              {/* Right side: Gallery images */}
                              <div className="lg:col-span-7 space-y-3">
                                <div className="flex items-center justify-between">
                                  <span className="text-[10px] font-bold text-gray-400 block uppercase tracking-wider">
                                    {language === 'ar' ? 'معرض صور المشروع التفصيلية' : 'Project Gallery Showcase'}
                                  </span>
                                  <ImageFileUploader 
                                    multiple
                                    onUpload={(urls) => {
                                      const newUrls = urls.split(',').map(u => u.trim()).filter(Boolean);
                                      const currentGallery = item.gallery || [];
                                      const updatedGallery = [...currentGallery, ...newUrls];
                                      handleUpdateProjectMedia(item.id, 'gallery', updatedGallery);
                                      showNotification(language === 'ar' ? 'تم إضافة الصور للمعرض!' : 'Added images to gallery!');
                                    }} 
                                  />
                                </div>

                                <div className="bg-black/25 p-3 rounded-xl border border-white/5 space-y-3">
                                  {/* Visual grid of gallery items */}
                                  {(!item.gallery || item.gallery.length === 0) ? (
                                    <div className="text-center py-4 text-gray-500 text-xs">
                                      {language === 'ar' ? 'لا توجد صور تفصيلية مضافة في معرض هذا المشروع.' : 'No gallery images in this project.'}
                                    </div>
                                  ) : (
                                    <div className="flex flex-wrap gap-2">
                                      {item.gallery.map((gUrl, gIdx) => (
                                        <div key={gIdx} className="w-14 h-14 bg-white/5 border border-white/10 rounded-lg overflow-hidden relative group">
                                          {renderAdminMediaPreview(gUrl, "h-14", "w-full h-full object-cover")}
                                          <button
                                            type="button"
                                            onClick={() => {
                                              const updatedGallery = (item.gallery || []).filter((_, idx) => idx !== gIdx);
                                              handleUpdateProjectMedia(item.id, 'gallery', updatedGallery);
                                              showNotification(language === 'ar' ? 'تم إزالة الصورة من المعرض' : 'Removed from gallery');
                                            }}
                                            className="absolute inset-0 bg-black/70 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-rose-400 cursor-pointer"
                                            title="Remove"
                                          >
                                            <Trash2 size={14} />
                                          </button>
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  {/* Fallback raw text editor for copy-paste convenience */}
                                  <div className="space-y-1">
                                    <label className="text-[9px] text-gray-500 block">
                                      {language === 'ar' ? 'الروابط المفصولة بفواصل (،)' : 'Comma-separated URLs list'}
                                    </label>
                                    <input 
                                      type="text"
                                      value={(item.gallery || []).join(', ')}
                                      onChange={(e) => {
                                        const urls = e.target.value.split(',').map(u => u.trim()).filter(Boolean);
                                        handleUpdateProjectMedia(item.id, 'gallery', urls);
                                      }}
                                      className="w-full px-3 py-1.5 bg-black/45 border border-white/5 rounded-lg text-white text-[10px] focus:border-[#F7941D] focus:outline-none font-mono"
                                      placeholder="https://example.com/img1.png, https://example.com/img2.png"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <KeyRound className="text-[#F7941D]" size={20} />
                        {language === 'ar' ? 'إعدادات الأمان والمظهر الخاصة بك' : 'Security & Appearance Settings'}
                      </h3>
                      <p className="text-xs text-gray-400">
                        {language === 'ar' 
                          ? 'قم بتعديل رمز الدخول الخاص بك، أو تخصيص شعار الموقع وصورة البطل بسهولة تامة.' 
                          : 'Change your security PIN code, customize the navbar logo URL, and update your main hero image.'}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Security PIN Settings Card */}
                      <div className="bg-[#2A1E40]/30 border border-white/5 rounded-2xl p-6 space-y-4 hover:border-white/10 transition-all duration-200">
                        <h4 className="font-bold text-white text-sm flex items-center gap-2 border-b border-white/5 pb-2">
                          <Lock size={16} className="text-[#F7941D]" />
                          {language === 'ar' ? 'تغيير رمز الدخول الثنائي (PIN)' : 'Change Security PIN'}
                        </h4>
                        
                        <div className="space-y-2">
                          <label className="text-xs text-gray-400 block">
                            {language === 'ar' ? 'الرمز السري الحالي' : 'Current Admin PIN Code'}
                          </label>
                          <input
                            type="text"
                            value={adminPin}
                            disabled
                            className="w-full px-4 py-2.5 bg-black/30 border border-white/5 rounded-xl text-gray-500 text-xs font-mono select-none"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs text-gray-300 block">
                            {language === 'ar' ? 'الرمز السري الجديد (4 أرقام على الأقل)' : 'New Admin PIN Code (at least 4 digits)'}
                          </label>
                          <input
                            type="password"
                            placeholder="••••"
                            maxLength={8}
                            id="newPinInput"
                            className="w-full px-4 py-2.5 bg-black/45 border border-white/10 rounded-xl text-white text-xs font-mono focus:border-[#F7941D] focus:outline-none"
                          />
                        </div>

                        <button
                          onClick={() => {
                            const input = document.getElementById('newPinInput') as HTMLInputElement;
                            if (input) {
                              const val = input.value.trim();
                              if (!val || val.length < 4) {
                                showNotification(language === 'ar' ? 'الرجاء إدخال رمز صحيح بطول 4 خانات على الأقل' : 'Please enter a PIN at least 4 digits long', 'error');
                                return;
                              }
                              localStorage.setItem('manea_admin_pin', val);
                              setAdminPin(val);
                              input.value = '';
                              showNotification(language === 'ar' ? 'تم تحديث رمز PIN السري بنجاح!' : 'Admin PIN updated successfully!');
                            }
                          }}
                          className="px-4 py-2 bg-[#F7941D] hover:bg-amber-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all duration-200"
                        >
                          <Save size={14} />
                          <span>{language === 'ar' ? 'حفظ الرمز الجديد' : 'Save PIN'}</span>
                        </button>
                      </div>

                      {/* Brand Assets Settings Card */}
                      <div className="bg-[#2A1E40]/30 border border-white/5 rounded-2xl p-6 space-y-4 hover:border-white/10 transition-all duration-200">
                        <h4 className="font-bold text-white text-sm flex items-center gap-2 border-b border-white/5 pb-2">
                          <ImageIcon size={16} className="text-[#F7941D]" />
                          {language === 'ar' ? 'تخصيص الهوية والشعار والصور' : 'Brand Logo & Custom Assets'}
                        </h4>

                        <div className="space-y-2">
                          <label className="text-xs text-gray-300 block">
                            {language === 'ar' ? 'رابط الشعار المخصص (Logo URL)' : 'Custom Brand Logo URL'}
                          </label>
                          <div className="flex gap-2 items-center">
                            <input
                              type="text"
                              placeholder="https://example.com/logo.png (اتركه فارغاً للافتراضي ثلاثي الأبعاد)"
                              defaultValue={customTranslations.ar['nav.logoUrl'] || ''}
                              id="customLogoInput"
                              className="flex-grow px-4 py-2.5 bg-black/45 border border-white/10 rounded-xl text-white text-xs focus:border-[#F7941D] focus:outline-none"
                            />
                            <ImageFileUploader 
                              onUpload={(url) => {
                                const el = document.getElementById('customLogoInput') as HTMLInputElement;
                                if (el) el.value = url;
                              }} 
                            />
                          </div>
                          <p className="text-[10px] text-gray-500">
                            {language === 'ar' 
                              ? 'اترك الحقل فارغاً لعرض الشعار ثلاثي الأبعاد التفاعلي الافتراضي أو قم برفع شعار مخصص.' 
                              : 'Leave blank to fall back to the dynamic interactive 3D logo or upload a custom one.'}
                          </p>
                        </div>

                        <div className="space-y-2">
                          <label className="text-xs text-gray-300 block">
                            {language === 'ar' ? 'رابط صورة مانع الشخصية (Profile Photo)' : 'Manea\'s Profile Image URL'}
                          </label>
                          <div className="flex gap-2 items-center">
                            <input
                              type="text"
                              placeholder="https://example.com/profile.png"
                              defaultValue={customTranslations.ar['hero.profileImage'] || 'https://i.ibb.co/JWtLY2cB/Rectangle-40443-81459862.png'}
                              id="customProfileInput"
                              className="flex-grow px-4 py-2.5 bg-black/45 border border-white/10 rounded-xl text-white text-xs focus:border-[#F7941D] focus:outline-none"
                            />
                            <ImageFileUploader 
                              onUpload={(url) => {
                                const el = document.getElementById('customProfileInput') as HTMLInputElement;
                                if (el) el.value = url;
                              }} 
                            />
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            const logoInput = document.getElementById('customLogoInput') as HTMLInputElement;
                            const profileInput = document.getElementById('customProfileInput') as HTMLInputElement;
                            if (logoInput && profileInput) {
                              const logoVal = logoInput.value.trim();
                              const profileVal = profileInput.value.trim();

                              handleUpdateTranslation('nav.logoUrl', 'ar', logoVal);
                              handleUpdateTranslation('nav.logoUrl', 'en', logoVal);

                              handleUpdateTranslation('hero.profileImage', 'ar', profileVal);
                              handleUpdateTranslation('hero.profileImage', 'en', profileVal);

                              showNotification(language === 'ar' ? 'تم حفظ الهوية والصور بنجاح!' : 'Brand assets saved successfully!');
                            }
                          }}
                          className="px-4 py-2 bg-[#F7941D] hover:bg-amber-600 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-all duration-200"
                        >
                          <Save size={14} />
                          <span>{language === 'ar' ? 'حفظ الأصول والهوية' : 'Save Brand Assets'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Success Partners Logo Manager (Full Width below the grid) */}
                    <div className="bg-[#2A1E40]/30 border border-white/5 rounded-2xl p-6 space-y-4 hover:border-white/10 transition-all duration-200">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-3">
                        <div>
                          <h4 className="font-bold text-white text-sm flex items-center gap-2">
                            <ImageIcon size={16} className="text-[#F7941D]" />
                            {language === 'ar' ? 'إدارة شعارات شركاء النجاح (صور الماركي)' : 'Manage Success Partners Logos (Marquee Images)'}
                          </h4>
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            {language === 'ar' 
                              ? 'أضف أو عدل أو احذف روابط صور شعارات الشركاء التي تظهر في شريط الماركي الدائري.' 
                              : 'Add, edit, or remove logo image URLs for your partners marquee track.'}
                          </p>
                        </div>
                        
                        <button
                          type="button"
                          onClick={() => {
                            setLocalPartnerLogos([...localPartnerLogos, '']);
                          }}
                          className="px-3.5 py-1.5 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-200 border border-indigo-500/30 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all cursor-pointer self-start sm:self-auto"
                        >
                          <Plus size={14} />
                          <span>{language === 'ar' ? 'إضافة شعار جديد' : 'Add New Logo'}</span>
                        </button>
                      </div>

                      {localPartnerLogos.length === 0 ? (
                        <div className="text-center py-8 text-gray-500 text-xs">
                          {language === 'ar' ? 'لا يوجد شعارات مضافة حالياً. انقر على "إضافة شعار جديد".' : 'No partner logos added. Click "Add New Logo".'}
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {localPartnerLogos.map((logoUrl, index) => (
                            <div key={index} className="flex items-center gap-3 bg-black/20 border border-white/5 p-3 rounded-xl hover:border-white/10 transition-colors">
                              {/* Thumbnail Preview */}
                              <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center overflow-hidden border border-white/10 shrink-0">
                                {logoUrl ? (
                                  <img 
                                    src={logoUrl} 
                                    alt="Partner Logo Preview" 
                                    referrerPolicy="no-referrer"
                                    className="w-full h-full object-contain p-1"
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).src = 'https://placehold.co/100x100/1e1e24/ffffff?text=Error';
                                    }}
                                  />
                                ) : (
                                  <div className="text-[10px] text-gray-500 font-mono">Empty</div>
                                )}
                              </div>

                              <div className="flex-grow space-y-1">
                                <label className="text-[9px] font-mono font-bold text-[#F7941D] uppercase block">
                                  {language === 'ar' ? `الشعار رقم ${index + 1}` : `Logo #${index + 1}`}
                                </label>
                                <div className="flex gap-2 items-center">
                                  <input 
                                    type="text"
                                    value={logoUrl}
                                    onChange={(e) => {
                                      const updated = [...localPartnerLogos];
                                      updated[index] = e.target.value.trim();
                                      setLocalPartnerLogos(updated);
                                    }}
                                    placeholder="https://example.com/logo.png"
                                    className="flex-grow px-3 py-1.5 bg-black/45 border border-white/5 rounded-lg text-white text-xs focus:border-[#F7941D] focus:outline-none"
                                  />
                                  <ImageFileUploader 
                                    onUpload={(url) => {
                                      const updated = [...localPartnerLogos];
                                      updated[index] = url;
                                      setLocalPartnerLogos(updated);
                                    }} 
                                  />
                                </div>
                              </div>

                              <button
                                type="button"
                                onClick={() => {
                                  const updated = localPartnerLogos.filter((_, i) => i !== index);
                                  setLocalPartnerLogos(updated);
                                }}
                                className="p-2 rounded-lg hover:bg-rose-500/15 text-rose-400 border border-transparent hover:border-rose-500/20 transition-all cursor-pointer self-center"
                                title={language === 'ar' ? 'حذف الشعار' : 'Delete Logo'}
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex justify-end pt-2 border-t border-white/5">
                        <button
                          type="button"
                          onClick={() => {
                            // Filter out empty URLs before saving
                            const validLogos = localPartnerLogos.filter(url => !!url);
                            setRawPartnerLogos(validLogos);
                            setLocalPartnerLogos(validLogos);
                            showNotification(language === 'ar' ? 'تم حفظ قائمة شركاء النجاح بنجاح!' : 'Partners logos list saved successfully!');
                          }}
                          className="px-5 py-2 bg-[#F7941D] hover:bg-amber-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer transition-all duration-200"
                        >
                          <Save size={14} />
                          <span>{language === 'ar' ? 'حفظ شعارات الشركاء' : 'Save Partners Logos'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

              </div>

            </div>
          )}

          {/* Bottom status/credit bar */}
          <div className="p-4 bg-black/30 border-t border-white/5 flex items-center justify-between text-gray-500 text-[10px] font-mono shrink-0 relative z-10">
            <span>DATABASE: LOCALPERSISTENCE_SECURE</span>
            <span>ADMIN MODE {isAuthenticated ? '● ACTIVE' : '○ LOCKED'}</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
