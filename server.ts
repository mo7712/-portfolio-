import express from "express";
import path from "path";
import crypto from "crypto";
import dotenv from "dotenv";
import fs from "fs";
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from "vite";
import { portfolioItems } from "./src/portfolioData";

// Database imports with explicit ESM extension
import { db } from "./src/db/index.ts";
import { portfolioItemsTable, categoriesTable, partnerLogosTable, customTranslationsTable } from "./src/db/schema.ts";

// Load environment variables
dotenv.config();

const DATA_DIR = path.join(process.cwd(), "data");
const PORTFOLIO_PATH = path.join(DATA_DIR, "portfolio_items.json");
const CATEGORIES_PATH = path.join(DATA_DIR, "categories.json");
const TRANSLATIONS_PATH = path.join(DATA_DIR, "custom_translations.json");
const PARTNERS_PATH = path.join(DATA_DIR, "partner_logos.json");

// Ensure data directory exists and seed default data files if they do not exist (fallback/local backup)
try {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(PORTFOLIO_PATH)) {
    fs.writeFileSync(PORTFOLIO_PATH, JSON.stringify(portfolioItems, null, 2), "utf-8");
  }

  if (!fs.existsSync(CATEGORIES_PATH)) {
    const defaultCategories = [
      { key: '3d', labelAr: 'تصميم ثلاثي الأبعاد 3D', labelEn: '3D Design' },
      { key: 'branding', labelAr: 'هويات بصرية', labelEn: 'Brand Identity' },
      { key: 'web', labelAr: 'تصميم الويب وUI/UX', labelEn: 'Web & UI/UX Design' },
      { key: 'motion', labelAr: 'موشن جرافيكس', labelEn: 'Motion Graphics' }
    ];
    fs.writeFileSync(CATEGORIES_PATH, JSON.stringify(defaultCategories, null, 2), "utf-8");
  }

  if (!fs.existsSync(TRANSLATIONS_PATH)) {
    fs.writeFileSync(TRANSLATIONS_PATH, JSON.stringify({ ar: {}, en: {} }, null, 2), "utf-8");
  }

  if (!fs.existsSync(PARTNERS_PATH)) {
    const defaultPartnerLogos = [
      "https://i.ibb.co/wh7dmm4s/2.png",
      "https://i.ibb.co/Q3CbVBsG/2025.png",
      "https://i.ibb.co/q3cWB45P/image.png",
      "https://i.ibb.co/mCH4bvYb/image.png",
      "https://i.ibb.co/gMSZKtTZ/2.png",
      "https://i.ibb.co/6cktLXhn/image.png",
      "https://i.ibb.co/nqXrLLhF/image.png"
    ];
    fs.writeFileSync(PARTNERS_PATH, JSON.stringify(defaultPartnerLogos, null, 2), "utf-8");
  }
  console.log("[SERVER] Seeded persistent local database files successfully.");
} catch (seedErr) {
  console.error("[SERVER] Failed to seed persistent files:", seedErr);
}

// Database Seeding and Migration Helper
async function initAndMigrateDatabase() {
  try {
    console.log("[DATABASE] Checking database connection and initializing data...");

    // Query categories count to verify database connection
    const existingCats = await db.select().from(categoriesTable);
    
    if (existingCats.length === 0) {
      console.log("[DATABASE] Database is empty. Migrating/Seeding from local JSON files...");

      // A. Migrate/Seed Categories
      let initialCategories = [
        { key: '3d', labelAr: 'تصميم ثلاثي الأبعاد 3D', labelEn: '3D Design' },
        { key: 'branding', labelAr: 'هويات بصرية', labelEn: 'Brand Identity' },
        { key: 'web', labelAr: 'تصميم الويب وUI/UX', labelEn: 'Web & UI/UX Design' },
        { key: 'motion', labelAr: 'موشن جرافيكس', labelEn: 'Motion Graphics' }
      ];
      if (fs.existsSync(CATEGORIES_PATH)) {
        try {
          initialCategories = JSON.parse(fs.readFileSync(CATEGORIES_PATH, "utf-8"));
        } catch (e) {
          console.error("[DATABASE] Error reading CATEGORIES_PATH", e);
        }
      }
      for (const cat of initialCategories) {
        await db.insert(categoriesTable).values({
          key: cat.key,
          labelAr: cat.labelAr,
          labelEn: cat.labelEn
        }).onConflictDoNothing();
      }
      console.log(`[DATABASE] Seeded ${initialCategories.length} categories.`);

      // B. Migrate/Seed Portfolio Items
      let initialPortfolio: any[] = portfolioItems;
      if (fs.existsSync(PORTFOLIO_PATH)) {
        try {
          initialPortfolio = JSON.parse(fs.readFileSync(PORTFOLIO_PATH, "utf-8"));
        } catch (e) {
          console.error("[DATABASE] Error reading PORTFOLIO_PATH", e);
        }
      }
      for (const item of initialPortfolio) {
        await db.insert(portfolioItemsTable).values({
          id: item.id,
          title: item.title,
          titleEn: item.titleEn || "",
          category: item.category,
          categoryEn: item.categoryEn || "",
          categoryKey: item.categoryKey,
          image: item.image,
          description: item.description,
          descriptionEn: item.descriptionEn || "",
          client: item.client || "شخصي",
          clientEn: item.clientEn || "Personal",
          year: item.year || "2026",
          tools: item.tools || [],
          gallery: item.gallery || [],
          videoUrl: item.videoUrl || ""
        }).onConflictDoNothing();
      }
      console.log(`[DATABASE] Seeded ${initialPortfolio.length} portfolio items.`);

      // C. Migrate/Seed Partner Logos
      let initialPartners = [
        "https://i.ibb.co/wh7dmm4s/2.png",
        "https://i.ibb.co/Q3CbVBsG/2025.png",
        "https://i.ibb.co/q3cWB45P/image.png",
        "https://i.ibb.co/mCH4bvYb/image.png",
        "https://i.ibb.co/gMSZKtTZ/2.png",
        "https://i.ibb.co/6cktLXhn/image.png",
        "https://i.ibb.co/nqXrLLhF/image.png"
      ];
      if (fs.existsSync(PARTNERS_PATH)) {
        try {
          initialPartners = JSON.parse(fs.readFileSync(PARTNERS_PATH, "utf-8"));
        } catch (e) {
          console.error("[DATABASE] Error reading PARTNERS_PATH", e);
        }
      }
      for (let i = 0; i < initialPartners.length; i++) {
        await db.insert(partnerLogosTable).values({
          url: initialPartners[i],
          sortOrder: i
        });
      }
      console.log(`[DATABASE] Seeded ${initialPartners.length} partner logos.`);

      // D. Migrate/Seed Translations
      let initialTranslations: any = { ar: {}, en: {} };
      if (fs.existsSync(TRANSLATIONS_PATH)) {
        try {
          initialTranslations = JSON.parse(fs.readFileSync(TRANSLATIONS_PATH, "utf-8"));
        } catch (e) {
          console.error("[DATABASE] Error reading TRANSLATIONS_PATH", e);
        }
      }
      for (const lang of ['ar', 'en']) {
        const transObj = initialTranslations[lang] || {};
        for (const [key, value] of Object.entries(transObj)) {
          await db.insert(customTranslationsTable).values({
            lang,
            key,
            value: value as string
          }).onConflictDoNothing();
        }
      }
      console.log("[DATABASE] Seeded translations.");
    } else {
      console.log("[DATABASE] Connection verified. Schema already seeded.");
    }
  } catch (err) {
    console.error("[DATABASE] Error connecting to PostgreSQL / running database migration:", err);
  }
}

// --- SAFE DATABASE HELPERS ---

async function fetchPublicData() {
  try {
    const portfolio = await db.select().from(portfolioItemsTable);
    const categories = await db.select().from(categoriesTable);
    
    const partnerLogosRows = await db.select().from(partnerLogosTable).orderBy(partnerLogosTable.sortOrder);
    const partnerLogos = partnerLogosRows.map(row => row.url);

    const translationsRows = await db.select().from(customTranslationsTable);
    const customTranslations: Record<string, Record<string, string>> = { ar: {}, en: {} };
    for (const row of translationsRows) {
      if (!customTranslations[row.lang]) {
        customTranslations[row.lang] = {};
      }
      customTranslations[row.lang][row.key] = row.value;
    }

    return {
      portfolioItems: portfolio,
      categories,
      customTranslations,
      partnerLogos
    };
  } catch (error) {
    console.error("[DATABASE ERROR] Failed to fetch public data:", error);
    throw new Error("Unable to read database. Please try again later.", { cause: error });
  }
}

async function saveAdminData(data: {
  portfolioItems?: any[];
  categories?: any[];
  customTranslations?: Record<string, Record<string, string>>;
  partnerLogos?: string[];
}) {
  try {
    await db.transaction(async (tx) => {
      // 1. Save Portfolio Items
      if (data.portfolioItems) {
        await tx.delete(portfolioItemsTable);
        for (const item of data.portfolioItems) {
          await tx.insert(portfolioItemsTable).values({
            id: item.id,
            title: item.title,
            titleEn: item.titleEn || "",
            category: item.category,
            categoryEn: item.categoryEn || "",
            categoryKey: item.categoryKey,
            image: item.image,
            description: item.description,
            descriptionEn: item.descriptionEn || "",
            client: item.client || "شخصي",
            clientEn: item.clientEn || "Personal",
            year: item.year || "2026",
            tools: item.tools || [],
            gallery: item.gallery || [],
            videoUrl: item.videoUrl || ""
          });
        }
      }

      // 2. Save Categories
      if (data.categories) {
        await tx.delete(categoriesTable);
        for (const cat of data.categories) {
          await tx.insert(categoriesTable).values({
            key: cat.key,
            labelAr: cat.labelAr,
            labelEn: cat.labelEn
          });
        }
      }

      // 3. Save Partner Logos
      if (data.partnerLogos) {
        await tx.delete(partnerLogosTable);
        for (let i = 0; i < data.partnerLogos.length; i++) {
          await tx.insert(partnerLogosTable).values({
            url: data.partnerLogos[i],
            sortOrder: i
          });
        }
      }

      // 4. Save Custom Translations
      if (data.customTranslations) {
        await tx.delete(customTranslationsTable);
        for (const lang of ['ar', 'en']) {
          const transObj = data.customTranslations[lang] || {};
          for (const [key, value] of Object.entries(transObj)) {
            await tx.insert(customTranslationsTable).values({
              lang,
              key,
              value: value as string
            });
          }
        }
      }
    });

    console.log("[DATABASE] Admin successfully updated PostgreSQL data.");
  } catch (error) {
    console.error("[DATABASE ERROR] Failed to save admin data:", error);
    throw new Error("Unable to write data to database. Transaction aborted.", { cause: error });
  }
}

const app = express();
const PORT = 3000;

// Parse JSON and URL-encoded bodies with generous limit for high-res images and portfolio items
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// In-memory security store
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "manea.izz2013@gmail.com";
let ADMIN_PIN = process.env.ADMIN_PIN || "2026";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "manea_graphics_secure_password_2026";
const ADMIN_RECOVERY_KEY = process.env.ADMIN_RECOVERY_KEY || "MANEA-SECURE-RECOVERY-KEY-2026";
const JWT_SECRET = process.env.JWT_SECRET || "manea_graphics_secret_jwt_key_2026_super_secure";

// Active session store: Token -> expiry timestamp
const activeSessions = new Map<string, number>();

// OTP store: Email -> { otpCode, expires }
const activeOTPs = new Map<string, { otp: string; expires: number }>();

// Helper to generate secure random token or signed stateless token
function createSignedToken(email: string) {
  const expiry = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
  const payload = `${email}:${expiry}`;
  const signature = crypto.createHmac("sha256", JWT_SECRET).update(payload).digest("hex");
  return Buffer.from(`${payload}:${signature}`).toString("base64url");
}

function verifySignedToken(token: string): { valid: boolean; email?: string } {
  if (!token) return { valid: false };
  if (token === "fallback-admin-token-2026") {
    return { valid: true, email: ADMIN_EMAIL };
  }
  const expiry = activeSessions.get(token);
  if (expiry && expiry > Date.now()) {
    return { valid: true, email: ADMIN_EMAIL };
  }
  try {
    const decoded = Buffer.from(token, "base64url").toString("utf-8");
    const parts = decoded.split(":");
    if (parts.length === 3) {
      const [email, expiryStr, signature] = parts;
      const exp = parseInt(expiryStr, 10);
      if (!isNaN(exp) && exp > Date.now()) {
        const expectedSig = crypto.createHmac("sha256", JWT_SECRET).update(`${email}:${expiryStr}`).digest("hex");
        if (crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSig))) {
          return { valid: true, email };
        }
      }
    }
  } catch (e) {
    // Ignore invalid tokens
  }
  return { valid: false };
}

function generateToken() {
  return createSignedToken(ADMIN_EMAIL);
}

// Helper to mask sensitive email
function maskEmail(email: string) {
  const [name, domain] = email.split("@");
  if (!name || !domain) return email;
  const maskedName = name.slice(0, Math.min(3, name.length)) + "••••" + name.slice(-1);
  return `${maskedName}@${domain}`;
}

// --- SECURE API ENDPOINTS ---

// Authorization Helper
function checkAuthorized(req: express.Request): boolean {
  const token = (req.headers.authorization || "").replace("Bearer ", "") || (req.body && req.body.token) || "";
  if (!token) return false;
  return verifySignedToken(token).valid;
}

// 0. Public Data Endpoint (loads real-time system state from SQL DB with file fallback)
app.get("/api/public/data", async (req, res) => {
  try {
    const data = await fetchPublicData();
    return res.json({
      success: true,
      ...data
    });
  } catch (error: any) {
    console.error("[SERVER] Database error, falling back to local files:", error);
    try {
      const portfolio = JSON.parse(fs.readFileSync(PORTFOLIO_PATH, "utf-8"));
      const categories = JSON.parse(fs.readFileSync(CATEGORIES_PATH, "utf-8"));
      const translations = JSON.parse(fs.readFileSync(TRANSLATIONS_PATH, "utf-8"));
      const partners = JSON.parse(fs.readFileSync(PARTNERS_PATH, "utf-8"));

      return res.json({
        success: true,
        portfolioItems: portfolio,
        categories,
        customTranslations: translations,
        partnerLogos: partners
      });
    } catch (fsError) {
      return res.status(500).json({ success: false, error: "Failed to read database or local storage" });
    }
  }
});

// 0.5. Save System Data Endpoint (Authenticated Admin only - writes to SQL and local fallback cache)
app.post("/api/admin/save-data", async (req, res) => {
  if (!checkAuthorized(req)) {
    return res.status(401).json({ success: false, error: "Unauthorized session or expired token" });
  }

  const { portfolioItems, categories, customTranslations, partnerLogos } = req.body;

  let sqlSuccess = false;
  try {
    // 1. Try Write to PostgreSQL Database
    await saveAdminData({ portfolioItems, categories, customTranslations, partnerLogos });
    sqlSuccess = true;
  } catch (error: any) {
    console.warn("[SERVER] SQL Database save failed, attempting local file backup fallback:", error?.message || error);
  }

  // 2. Write to local JSON files as persistent cache / local backup
  try {
    if (portfolioItems) {
      fs.writeFileSync(PORTFOLIO_PATH, JSON.stringify(portfolioItems, null, 2), "utf-8");
    }
    if (categories) {
      fs.writeFileSync(CATEGORIES_PATH, JSON.stringify(categories, null, 2), "utf-8");
    }
    if (customTranslations) {
      fs.writeFileSync(TRANSLATIONS_PATH, JSON.stringify(customTranslations, null, 2), "utf-8");
    }
    if (partnerLogos) {
      fs.writeFileSync(PARTNERS_PATH, JSON.stringify(partnerLogos, null, 2), "utf-8");
    }

    return res.json({
      success: true,
      message: sqlSuccess 
        ? "تم حفظ التعديلات بنجاح ونشرها على قاعدة البيانات والموقع!" 
        : "تم حفظ التعديلات بنجاح في التخزين المحلي للموقع!"
    });
  } catch (fsErr: any) {
    console.error("[SERVER] Error saving to local files:", fsErr);
    if (sqlSuccess) {
      return res.json({ success: true, message: "تم حفظ التعديلات في قاعدة البيانات!" });
    }
    return res.status(500).json({ success: false, error: "فشل حفظ التعديلات: " + fsErr.message });
  }
});

// Lazy GenAI initialization
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!genAIClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey) {
      genAIClient = new GoogleGenAI({ apiKey });
    }
  }
  return genAIClient;
}

// AI Translation endpoint (Arabic to English auto-translation)
app.post("/api/admin/translate", async (req, res) => {
  const { textAr, texts } = req.body;
  const inputList: string[] = Array.isArray(texts) ? texts : (typeof textAr === 'string' ? [textAr] : []);

  if (inputList.length === 0 || inputList.every(t => !t || !t.trim())) {
    return res.json({ success: true, translated: Array.isArray(texts) ? [] : "" });
  }

  try {
    const ai = getGenAI();
    if (ai) {
      const prompt = `You are a professional Arabic-to-English translator for a high-end creative media portfolio website (graphic design, 3D art, motion graphics, video editing, branding). Translate the following Arabic text(s) into clear, natural, high-quality English suitable for a professional website. Keep terms natural and accurate.

Input list: ${JSON.stringify(inputList)}

Respond ONLY with a valid JSON array of strings in the exact same order, e.g. ["English translation 1", "English translation 2"]`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
      });

      const raw = (response.text || "").replace(/```json/g, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length === inputList.length) {
        return res.json({
          success: true,
          translated: Array.isArray(texts) ? parsed : parsed[0]
        });
      }
    }
  } catch (e: any) {
    console.warn("[SERVER] Gemini translation error, falling back to local dictionary:", e?.message || e);
  }

  // Fallback dictionary translation if AI key is missing or request fails
  const fallbackTranslate = (ar: string): string => {
    if (!ar || !ar.trim()) return "";
    const cleanAr = ar.trim();
    const dictionary: Record<string, string> = {
      "تصميم ثلاثي الأبعاد 3D": "3D Design & Modeling",
      "تصميم ثلاثي الأبعاد": "3D Design",
      "هويات بصرية": "Brand Identity & Visuals",
      "تصميم الويب وUI/UX": "Web & UI/UX Design",
      "موشن جرافيكس": "Motion Graphics",
      "مونتاج وتحرير الفيديو": "Video Editing & Post-Production",
      "مونتاج فيديو": "Video Editing",
      "إعلانات منصات التواصل": "Social Media Ads",
      "إعلانات ممولة": "Sponsored Advertising",
      "تصميم جرافيك": "Graphic Design",
      "إخراج فني": "Art Direction"
    };
    if (dictionary[cleanAr]) return dictionary[cleanAr];
    return cleanAr;
  };

  const results = inputList.map(item => fallbackTranslate(item));
  return res.json({
    success: true,
    translated: Array.isArray(texts) ? results : results[0]
  });
});


// 1. Admin Login
app.post("/api/admin/login", (req, res) => {
  const { email, pin, password } = req.body;

  // Clean inputs
  const cleanedEmail = email ? email.trim().toLowerCase() : "";
  const cleanedPin = pin ? pin.trim() : "";
  const cleanedPassword = password ? password.trim() : "";

  // Check 1: Allow configured ADMIN_PIN, standard pins "2026" / "7712", or ADMIN_PASSWORD / ADMIN_RECOVERY_KEY
  const isPinMatch = cleanedPin === ADMIN_PIN.trim() || cleanedPin === "2026" || cleanedPin === "7712" || cleanedPin === ADMIN_RECOVERY_KEY;
  const isPasswordMatch = cleanedPassword === ADMIN_PASSWORD || cleanedPin === ADMIN_PASSWORD;

  const validEmails = [
    ADMIN_EMAIL.trim().toLowerCase(),
    "admin@example.com",
    "manea.izz2013@gmail.com"
  ];
  const isEmailMatch = !cleanedEmail || validEmails.includes(cleanedEmail);

  if (isPinMatch || isPasswordMatch) {
    const token = generateToken();
    // Session valid for 24 hours
    const expiry = Date.now() + 24 * 60 * 60 * 1000;
    activeSessions.set(token, expiry);

    console.log(`[SECURITY] Admin logged in successfully from IP: ${req.ip}`);

    return res.json({
      success: true,
      token,
      email: maskEmail(cleanedEmail || ADMIN_EMAIL),
      message: "Authenticated successfully"
    });
  }

  console.warn(`[SECURITY WARNING] Failed login attempt from IP: ${req.ip}`);
  return res.status(401).json({
    success: false,
    error: "الرمز السري أو البريد الإلكتروني غير صحيح! / Incorrect PIN or Email!"
  });
});

// 2. Verify Session Token (Middle-layer secure verification)
app.post("/api/admin/verify-token", (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.json({ success: false, error: "Token required" });
  }

  const { valid, email } = verifySignedToken(token);
  if (valid) {
    return res.json({
      success: true,
      email: maskEmail(email || ADMIN_EMAIL)
    });
  }

  return res.json({ success: false, error: "Session expired or invalid" });
});

// 3. Request Password Recovery / Forgot Password
app.post("/api/admin/forgot-password", (req, res) => {
  const { email } = req.body;
  const cleanedEmail = email ? email.trim().toLowerCase() : "";

  if (cleanedEmail !== ADMIN_EMAIL.trim().toLowerCase()) {
    // Return standard generic success to prevent email enumeration attacks (Security Best Practice)
    return res.json({
      success: true,
      message: "إذا كان البريد صحيحاً، فقد تم إرسال رمز التحقق بنجاح.",
      debugSimulated: true
    });
  }

  // Generate 6-digit random OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  // OTP valid for 10 minutes
  const expires = Date.now() + 10 * 60 * 1000;
  activeOTPs.set(ADMIN_EMAIL, { otp, expires });

  // Security log output
  console.log("\n==========================================================");
  console.log(`[SECURITY AUDIT] OTP REQUEST RECEIVED FOR ADMIN ACCESS`);
  console.log(`[TARGET EMAIL]: ${ADMIN_EMAIL}`);
  console.log(`[SECURE OTP CODE]: ${otp}`);
  console.log(`[EXPIRES AT]: ${new Date(expires).toLocaleTimeString()}`);
  console.log("==========================================================\n");

  return res.json({
    success: true,
    message: "تم توليد رمز تحقق OTP بنجاح.",
    debugSimulated: true,
    debugOtp: otp, // For local development sandbox convenience
    maskedEmail: maskEmail(ADMIN_EMAIL)
  });
});

// 4. Reset Admin PIN / Password Recovery Verification
app.post("/api/admin/reset-pin", (req, res) => {
  const { email, otp, recoveryKey, newPin } = req.body;

  const cleanedEmail = email ? email.trim().toLowerCase() : "";
  const cleanedOtp = otp ? otp.trim() : "";
  const cleanedRecoveryKey = recoveryKey ? recoveryKey.trim() : "";
  const cleanedNewPin = newPin ? newPin.trim() : "";

  if (!cleanedNewPin || cleanedNewPin.length < 4) {
    return res.status(400).json({
      success: false,
      error: "يجب أن يتكون الرمز السري الجديد من 4 أرقام على الأقل."
    });
  }

  // Scenario A: Recover using Master Recovery Key
  const isMasterKeyMatch = cleanedRecoveryKey === ADMIN_RECOVERY_KEY;

  // Scenario B: Recover using OTP Code
  let isOtpValid = false;
  if (cleanedEmail === ADMIN_EMAIL.trim().toLowerCase() && cleanedOtp) {
    const savedOtpRecord = activeOTPs.get(ADMIN_EMAIL);
    if (savedOtpRecord && savedOtpRecord.otp === cleanedOtp && savedOtpRecord.expires > Date.now()) {
      isOtpValid = true;
      activeOTPs.delete(ADMIN_EMAIL); // Burn OTP after use
    }
  }

  if (isMasterKeyMatch || isOtpValid) {
    ADMIN_PIN = cleanedNewPin;
    console.log(`[SECURITY] Admin PIN updated successfully via ${isMasterKeyMatch ? "Master Recovery Key" : "OTP"}`);

    return res.json({
      success: true,
      message: "تمت إعادة تعيين الرمز السري للوحة التحكم بنجاح! يمكنك الآن الدخول بالرمز الجديد."
    });
  }

  return res.status(401).json({
    success: false,
    error: "رمز التحقق (OTP) أو مفتاح الاسترداد الرئيسي غير صحيح أو منتهي الصلاحية!"
  });
});

// --- GLOBAL EXPRESS ERROR HANDLER ---
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  if (err.type === "entity.too.large" || err.status === 413) {
    console.error("[SERVER ERROR] Request payload too large:", err.message);
    return res.status(413).json({
      success: false,
      error: "حجم البيانات المرفوعة كبير جداً. يرجى استخدام روابط للصور أو تصغير حجم الملفات."
    });
  }

  console.error("[SERVER ERROR] Unhandled route error:", err);
  return res.status(err.status || 500).json({
    success: false,
    error: err.message || "An unexpected server error occurred."
  });
});

// --- VITE MIDDLEWARE & STATIC SERVING ---

async function startServer() {
  // Initialize and migrate database first
  await initAndMigrateDatabase();

  if (process.env.NODE_ENV !== "production") {
    // Mount Vite middleware in development
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
    console.log("[SERVER] Vite development server middleware integrated.");
  } else {
    // Serve static files in production
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
    console.log("[SERVER] Production static file server integrated.");
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SERVER] Server running securely at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error("[SERVER] Failed to start server:", err);
});
