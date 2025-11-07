import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import commonEn from "@assets/locales/en/common.json";
import commonAr from "@assets/locales/ar/common.json";
import landingEn from "@features/landing/locales/en.json";
import landingAr from "@features/landing/locales/ar.json";

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
    landing: landingEn
  },
  ar: {
    common: commonAr,
    landing: landingAr
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
    ns: ["common", "landing"],
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ["querystring", "localStorage", "navigator"],
      caches: ["localStorage"]
    }
  })
  .then(() => {
    applyLanguageAttributes(i18n.language);
  });

i18n.on("languageChanged", applyLanguageAttributes);

export { i18n };

