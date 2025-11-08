import { heroAssets } from "../constants";
import type { DashboardTokens, DashboardHeroContent } from "../types";

type DashboardHeroProps = {
  readonly tokens: DashboardTokens;
  readonly hero: DashboardHeroContent;
};

export const DashboardHero = ({ tokens, hero }: DashboardHeroProps) => (
  <div
    className="relative overflow-hidden rounded-[40px] px-8 py-10 md:px-12"
    style={{ background: hero.gradient }}
  >
    <div className="absolute inset-0 opacity-80">
      <img
        src={heroAssets.texture}
        alt=""
        className="h-full w-full object-cover"
        loading="lazy"
      />
    </div>
    <img
      src={heroAssets.wave}
      alt=""
      className="pointer-events-none absolute -right-10 bottom-0 h-[280px] w-auto opacity-80 md:-right-6 md:h-[320px]"
      loading="lazy"
    />

    <div className="relative z-10 grid gap-8 md:grid-cols-[minmax(0,1fr)_minmax(0,240px)] md:items-center">
      <div className="max-w-xl">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/60">
          {hero.eyebrow}
        </p>
        <h2 className="mt-3 text-3xl font-semibold leading-tight md:text-4xl">
          {hero.title}
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {hero.highlights.map((text) => (
            <div
              key={text}
              className="flex items-start gap-3 text-sm font-medium text-white/90"
            >
              <span className="mt-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-white text-xs text-[#6d49ff]">
                •
              </span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </div>

      <div
        className={`${tokens.cardBase} rounded-[28px] bg-white/10 p-6 text-center backdrop-blur`}
      >
        <p className="text-sm font-semibold text-white/80">
          {hero.priceLabel}
        </p>
        <p className="mt-2 text-3xl font-semibold">{hero.price}</p>
        <button
          type="button"
          className={`mt-6 inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-sm font-semibold ${tokens.buttonFilled}`}
        >
          {hero.ctaLabel}
        </button>
      </div>
    </div>
  </div>
);


