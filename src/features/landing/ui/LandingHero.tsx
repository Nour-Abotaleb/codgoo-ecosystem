import { useTranslation } from "react-i18next";

export const LandingHero = () => {
  const { t } = useTranslation(["landing", "common"]);

  return (
    <section className="mx-auto max-w-4xl space-y-8 rounded-[20px] bg-slate-900/60 px-8 py-16 text-slate-100 shadow-xl shadow-slate-900/30 ring-1 ring-slate-800">
      <span className="inline-flex flex-wrap items-center gap-2 rounded-full border border-indigo-500/60 bg-indigo-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-indigo-200">
        {t("app.title", { ns: "common" })}
      </span>
      <h1 className="text-balance text-4xl font-black tracking-tight text-start sm:text-5xl">
        {t("hero.headline")}
      </h1>
      <p className="text-pretty text-start text-lg text-slate-300">
        {t("hero.subheading")}
      </p>

      <div className="flex flex-wrap gap-3">
        <button className="inline-flex items-center rounded-full bg-indigo-500 px-6 py-2 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-300">
          {t("cta.primary")}
        </button>
        <button className="inline-flex items-center rounded-full border border-slate-600 px-6 py-2 text-sm font-semibold text-slate-200 transition hover:border-indigo-400 hover:text-indigo-200">
          {t("cta.secondary")}
        </button>
      </div>
    </section>
  );
};

