// 🕉️ Dev Authentication Bypass configuration
export var __DEV__ = process.env.NODE_ENV !== "production";
export const DEV_AUTH_BYPASS = __DEV__ && process.env.NEXT_PUBLIC_DEV_AUTH_BYPASS === "true";

// Skip environment validation in dev bypass mode and during build
const isBuildTime = process.env.NODE_ENV === 'production' && typeof window === 'undefined';

if (!DEV_AUTH_BYPASS && !isBuildTime) {
  if (!process.env.NEXT_PUBLIC_LOCAL_URL && __DEV__) {
    console.warn("NEXT_PUBLIC_LOCAL_URL is not set, using default");
  }

  if (!process.env.NEXT_PUBLIC_SITE_URL && !__DEV__) {
    console.warn("NEXT_PUBLIC_SITE_URL is not set, using default");
  }

  if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
    console.warn("NEXT_PUBLIC_SENTRY_DSN is not set");
  }

  if (!process.env.NEXT_PUBLIC_DEV) {
    console.warn("NEXT_PUBLIC_DEV is not set");
  }
}

export const SITE_URL = __DEV__
  ? (process.env.NEXT_PUBLIC_LOCAL_URL || "http://localhost:80") 
  : (process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_LOCAL_URL || "https://dao999nft.com");

export const headers = {
  "Content-Type": "application/json",
};

// 🎭 Realistic Mock User Data (emulating neuro_sage)
export const DEV_MOCK_USER = {
  username: "neuro_sage",
  user_id: "neuro_sage-user-id-999",
  workspace_id: "neuro_sage-workspace-main",
  workspace_name: "Neuro Sage Main Workspace", 
  workspace_type: "personal",
  header_name: "Neuro Sage",
  room_id: "neuro_sage-room-dev",
  room_name: "Neuro Sage Dev Room",
  recording_id: "neuro_sage-recording-01",
  recording_name: "Neuro Sage Dev Recording",
  photo_url: "https://api.dicebear.com/7.x/avataaars/svg?seed=neuro_sage",
  first_name: "Neuro",
  last_name: "Sage",
  language_code: "ru", // русский язык по умолчанию
  telegram_id: 144022504, // 🎯 Реальный Telegram ID пользователя
  is_owner: true,
  // Дополнительные поля для полной эмуляции
  is_premium: true,
  is_admin: true,
  created_at: "2024-01-01T00:00:00.000Z",
  projects: ["999-web", "neurocoder", "neurocalls"],
};

export const botName = __DEV__ ? "dao999nft_dev_bot" : "neurocalls_chat_bot";

console.log(botName, "botName");