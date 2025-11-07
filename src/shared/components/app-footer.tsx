import { useTranslation } from "react-i18next";

export const AppFooter = () => {
  const { t } = useTranslation("common");

  return (
    <footer className="border-t border-slate-800 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
      {t("footer.madeWith")}
    </footer>
  );
};

