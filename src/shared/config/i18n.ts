import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import commonEn from "@assets/locales/en/common.json";
import commonAr from "@assets/locales/ar/common.json";
import authEn from "@assets/locales/en/auth.json";
import authAr from "@assets/locales/ar/auth.json";
import landingEn from "@features/landing/locales/en.json";
import landingAr from "@features/landing/locales/ar.json";
import dashboardEn from "@features/dashboard/locales/en.json";
import dashboardAr from "@features/dashboard/locales/ar.json";

export const defaultNS = "common";
export const supportedLanguages = ["en", "ar"] as const;

const rtlLanguages = new Set<string>(["ar"]);

const applyLanguageAttributes = (language: string) => {
  if (typeof document === "undefined") {
    return;
  }

  document.documentElement.lang = language;
  document.documentElement.dir = rtlLanguages.has(language) ? "rtl" : "ltr";
};

const resources = {
  en: {
    common: commonEn,
    auth: authEn,
    landing: landingEn,
    dashboard: dashboardEn
  },
  ar: {
    common: commonAr,
    auth: authAr,
    landing: landingAr,
    dashboard: dashboardAr
  }
} as const;

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    supportedLngs: supportedLanguages,
    defaultNS,
    ns: ["common", "auth", "landing", "dashboard"],
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ["querystring", "localStorage", "navigator"],
      caches: ["localStorage"],
      lookupLocalStorage: "locale", // Change from default 'i18nextLng' to 'locale'
    }
  })
  .then(() => {
    applyLanguageAttributes(i18n.language);
    
    // Migrate from old 'i18nextLng' key to new 'locale' key
    try {
      const oldKey = "i18nextLng";
      const newKey = "locale";
      const oldValue = localStorage.getItem(oldKey);
      const newValue = localStorage.getItem(newKey);
      
      // If old key exists and new key doesn't, migrate the value
      if (oldValue && !newValue) {
        localStorage.setItem(newKey, oldValue);
        localStorage.removeItem(oldKey);
        console.log(`Migrated language preference from '${oldKey}' to '${newKey}'`);
      }
      // If old key exists but new key also exists, just remove the old key
      else if (oldValue && newValue) {
        localStorage.removeItem(oldKey);
      }
    } catch (error) {
      console.error("Failed to migrate language preference:", error);
    }
  });

i18n.on("languageChanged", applyLanguageAttributes);

export { i18n };

