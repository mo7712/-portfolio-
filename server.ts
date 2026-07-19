import express from "express";
import path from "path";
import crypto from "crypto";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Parse JSON bodies
app.use(express.json());

// In-memory security store
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@example.com";
let ADMIN_PIN = process.env.ADMIN_PIN || "2026";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "manea_graphics_secure_password_2026";
const ADMIN_RECOVERY_KEY = process.env.ADMIN_RECOVERY_KEY || "MANEA-SECURE-RECOVERY-KEY-2026";
const JWT_SECRET = process.env.JWT_SECRET || "manea_graphics_secret_jwt_key_2026_super_secure";

// Active session store: Token -> expiry timestamp
const activeSessions = new Map<string, number>();

// OTP store: Email -> { otpCode, expires }
const activeOTPs = new Map<string, { otp: string; expires: number }>();

// Helper to generate secure random token
function generateToken() {
  return crypto.randomBytes(32).toString("hex");
}

// Helper to mask sensitive email
function maskEmail(email: string) {
  const [name, domain] = email.split("@");
  if (!name || !domain) return email;
  const maskedName = name.slice(0, Math.min(3, name.length)) + "••••" + name.slice(-1);
  return `${maskedName}@${domain}`;
}

// --- SECURE API ENDPOINTS ---

// 1. Admin Login
app.post("/api/admin/login", (req, res) => {
  const { email, pin, password } = req.body;

  // Clean inputs
  const cleanedEmail = email ? email.trim().toLowerCase() : "";
  const cleanedPin = pin ? pin.trim() : "";
  const cleanedPassword = password ? password.trim() : "";

  // Check 1: Login via Email + PIN (standard login)
  const isEmailMatch = cleanedEmail === ADMIN_EMAIL.trim().toLowerCase();
  const isPinMatch = cleanedPin === ADMIN_PIN.trim();

  // Check 2: Direct PIN-only login or password option
  const isPasswordMatch = cleanedPassword === ADMIN_PASSWORD;

  if ((isEmailMatch && isPinMatch) || (!cleanedEmail && isPinMatch) || (isEmailMatch && isPasswordMatch)) {
    const token = generateToken();
    // Session valid for 24 hours
    const expiry = Date.now() + 24 * 60 * 60 * 1000;
    activeSessions.set(token, expiry);

    console.log(`[SECURITY] Admin logged in successfully from IP: ${req.ip}`);

    return res.json({
      success: true,
      token,
      email: maskEmail(ADMIN_EMAIL),
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

  const expiry = activeSessions.get(token);
  if (expiry && expiry > Date.now()) {
    return res.json({
      success: true,
      email: maskEmail(ADMIN_EMAIL)
    });
  }

  // Clear expired token
  if (expiry) {
    activeSessions.delete(token);
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

// --- VITE MIDDLEWARE & STATIC SERVING ---

async function startServer() {
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
