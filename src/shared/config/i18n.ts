import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import commonEn from "@assets/locales/en/common.json";
import commonEs from "@assets/locales/es/common.json";
import landingEn from "@features/landing/locales/en.json";
import landingEs from "@features/landing/locales/es.json";

export const defaultNS = "common";
export const supportedLanguages = ["en", "es"] as const;

const resources = {
  en: {
    common: commonEn,
    landing: landingEn
  },
  es: {
    common: commonEs,
    landing: landingEs
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
  });

export { i18n };

