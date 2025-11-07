import { ChangeEvent } from "react";
import { useTranslation } from "react-i18next";

import { supportedLanguages } from "@shared/config/i18n";

const languageLabels: Record<(typeof supportedLanguages)[number], string> = {
  en: "English",
  es: "Español"
};

export const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation("common");

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    void i18n.changeLanguage(event.target.value);
  };

  return (
    <label className="inline-flex items-center gap-2 text-sm font-medium">
      <span className="text-slate-300">{t("navigation.language")}:</span>
      <select
        onChange={handleChange}
        value={i18n.language}
        className="rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400"
      >
        {supportedLanguages.map((lng) => (
          <option key={lng} value={lng}>
            {languageLabels[lng]}
          </option>
        ))}
      </select>
    </label>
  );
};

