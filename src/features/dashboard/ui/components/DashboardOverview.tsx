import domainsBg from "@assets/images/cloud/domains-bg.png";
import heroWave from "@assets/images/cloud/bg.png";

import { SearchIcon } from "@utilities/icons";

import { statusColors } from "../constants";
import type { DashboardDataset, DashboardTokens, DomainItem } from "../types";

type DashboardOverviewProps = {
  readonly dataset: DashboardDataset;
  readonly tokens: DashboardTokens;
  readonly onManageDomain?: (domain: DomainItem) => void;
};

const cardBaseClass = (tokens: DashboardTokens) =>
  `${tokens.cardBase} rounded-[28px] border border-[var(--color-card-border)] p-6 transition-colors`;

const getHeroBackground = (tokens: DashboardTokens, dataset: DashboardDataset) => {
  const hero = dataset.hero;
  if (!hero.backgroundImage && !hero.backgroundImageDark) {
    return {};
  }

  const image = tokens.isDark
    ? hero.backgroundImageDark ?? hero.backgroundImage ?? heroWave
    : hero.backgroundImage ?? hero.backgroundImageDark ?? heroWave;

  return {
    backgroundImage: `url(${image})`,
    backgroundSize: "cover",
    backgroundPosition: "center"
  } as const;
};

export const DashboardOverview = ({
  dataset,
  tokens,
  onManageDomain
}: DashboardOverviewProps) => {
  const cardClass = cardBaseClass(tokens);
  const heroBackgroundStyle = getHeroBackground(tokens, dataset);

  return (
    <div className="flex flex-col gap-6">
      <section>
        <div
          className="relative overflow-hidden rounded-[32px] p-8 text-white shadow-lg"
          style={{
            background: dataset.hero.gradient,
            ...heroBackgroundStyle
          }}
        >
          <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="max-w-xl space-y-4">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-white/70">
                {dataset.hero.priceLabel}
              </p>
              <h1 className="text-3xl font-semibold leading-tight md:text-4xl">
                {dataset.hero.title}
              </h1>
              {dataset.hero.description ? (
                <p className="text-sm text-white/85">{dataset.hero.description}</p>
              ) : null}
              <ul className="space-y-2 text-sm text-white/85">
                {dataset.hero.highlights.map((highlight) => (
                  <li key={highlight} className="flex items-start gap-3">
                    <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-white/70" />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-6">
                <button
                  type="button"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2 text-sm font-semibold text-[#4F3BD3] shadow-md transition hover:opacity-90"
                >
                  {dataset.hero.ctaLabel}
                </button>
                <p className="text-sm text-white/75">
                  <span className="font-semibold text-white">{dataset.hero.price}</span>
                </p>
              </div>
            </div>
          </div>
          <div className="absolute inset-x-0 bottom-8 flex justify-center gap-2">
            {[0, 1, 2].map((index) => (
              <span
                key={index}
                className={`h-2 w-2 rounded-full ${
                  index === 0 ? "bg-white" : "bg-white/40"
                }`}
              />
            ))}
          </div>
          <div className="pointer-events-none absolute inset-0 bg-black/10" />
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dataset.stats.map((stat) => (
          <div
            key={stat.id}
            className={`${cardClass} flex flex-col gap-2 bg-[var(--color-table-row-bg)]`}
          >
            <p className="text-sm font-medium text-[var(--color-page-text)]/60">{stat.label}</p>
            <p className="text-2xl font-semibold text-[var(--color-page-text)]">{stat.value}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className={cardClass}>
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-lg font-semibold text-[var(--color-page-text)]">
              Your Active Products/Services
            </h3>
            <button type="button" className={`${tokens.buttonGhost} rounded-full px-4 py-1 text-xs`}>
              See All →
            </button>
          </div>
          <div className="mt-6 flex flex-col gap-4">
            {dataset.products.map((product) => (
              <div
                key={product.id}
                className="grid gap-3 rounded-2xl border border-[var(--color-border-divider)] bg-[var(--color-card-bg)] px-4 py-3 text-sm md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] md:items-center"
              >
                <div>
                  <p className="font-semibold text-[var(--color-page-text)]">{product.server}</p>
                  <p className="text-xs text-[var(--color-page-text)]/60">{product.type}</p>
                </div>
                <p className="font-medium text-[var(--color-page-text)]">{product.cost}</p>
                <p className="text-sm text-[var(--color-page-text)]/70">Renewal: {product.renewal}</p>
                <button
                  type="button"
                  className={`${tokens.buttonGhost} rounded-full px-4 py-2 text-xs font-semibold`}
                >
                  Manage
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className={`${cardClass} relative overflow-hidden`}>
          <div className="flex flex-col gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[var(--color-page-text)]/60">
                Build Your Website
              </p>
              <h2 className="mt-2 text-2xl font-semibold text-[var(--color-page-text)]">
                Choose Domain
              </h2>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex h-12 flex-1 items-center gap-3 rounded-full border border-[var(--color-border-divider)] bg-[var(--color-card-bg)] px-4 text-[var(--color-page-text)]">
                <input
                  type="text"
                  placeholder="Domain Name"
                  className="flex-1 bg-transparent text-sm text-[var(--color-page-text)] placeholder:text-[var(--color-page-text)]/50 focus:outline-none"
                />
              </div>
              <button
                type="button"
                className={`${tokens.buttonFilled} inline-flex h-12 w-12 items-center justify-center rounded-full text-xl`}
              >
                ↗
              </button>
            </div>
          </div>
          <img
            src={domainsBg}
            alt="Domains illustration"
            className="absolute -bottom-10 right-4 w-36 opacity-80"
          />
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.8fr)]">
        <div className={`${cardClass} relative overflow-hidden bg-gradient-to-br from-[#4A3AD1] via-[#6C4DF4] to-[#A890FF] text-white`}>
          <div className="space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/70">
              Manage Your Security
            </p>
            <h3 className="text-2xl font-semibold">Choose Domain</h3>
            <div className="mt-4 flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm">
              <span className="text-white/80">Domain Name</span>
              <span className="ms-auto text-xl">⌄</span>
            </div>
          </div>
          <img
            src={domainsBg}
            alt="Manage security illustration"
            className="absolute -bottom-12 right-4 w-40 opacity-70"
          />
        </div>

        <div className={cardClass}>
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-lg font-semibold text-[var(--color-page-text)]">Domains</h3>
            <div className="flex items-center gap-3 text-sm text-[var(--color-page-text)]/60">
              <div className="flex h-10 items-center gap-2 rounded-full border border-[var(--color-border-divider)] bg-[var(--color-card-bg)] px-4">
                <SearchIcon className="h-4 w-4" />
                <input
                  type="search"
                  placeholder="Search for New Domain"
                  className="w-48 bg-transparent text-sm text-[var(--color-page-text)] placeholder:text-[var(--color-page-text)]/50 focus:outline-none"
                />
              </div>
              <button type="button" className={`${tokens.buttonGhost} rounded-full px-4 py-1 text-xs`}>
                See All →
              </button>
            </div>
          </div>
          <div className="mt-6 space-y-4">
            {dataset.domains.slice(0, 4).map((domain) => {
              const statusClass =
                statusColors[domain.status] ?? "bg-slate-500/10 text-slate-200";

              return (
                <div
                  key={domain.id}
                  className="flex items-center gap-4 rounded-2xl border border-[var(--color-border-divider)] bg-[var(--color-card-bg)] px-4 py-3 text-sm"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-[var(--color-page-text)]">{domain.name}</p>
                    <p className="text-xs text-[var(--color-page-text)]/60">Status</p>
                  </div>
                  <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${statusClass}`}>
                    {domain.status}
                  </span>
                  <button
                    type="button"
                    className={`${tokens.buttonGhost} rounded-full px-3 py-1 text-xs`}
                    onClick={() => onManageDomain?.(domain)}
                  >
                    Manage
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section>
        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[var(--color-page-text)]">Managed Sites</h3>
            <button type="button" className={`${tokens.buttonGhost} rounded-full px-4 py-1 text-xs`}>
              See All →
            </button>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {dataset.sites.map((site) => (
              <div
                key={site.id}
                className="flex flex-col gap-3 rounded-2xl border border-[var(--color-border-divider)] bg-[var(--color-card-bg)] p-4 text-sm"
              >
                <div>
                  <p className="font-semibold text-[var(--color-page-text)]">{site.name}</p>
                  <p className="text-xs text-[var(--color-page-text)]/60">{site.type}</p>
                </div>
                <button
                  type="button"
                  className={`${tokens.buttonFilled} inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-semibold`}
                >
                  Manage Site
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[var(--color-page-text)]">Recent Support Tickets</h3>
            <button type="button" className={`${tokens.buttonGhost} rounded-full px-4 py-1 text-xs`}>
              See All →
            </button>
          </div>
          <div className="mt-6 space-y-4">
            {dataset.tickets.map((ticket) => (
              <div
                key={ticket.id}
                className="rounded-2xl border border-[var(--color-border-divider)] bg-[var(--color-card-bg)] p-4"
              >
                <p className="text-xs font-medium text-[var(--color-page-text)]/60">{ticket.id}</p>
                <h4 className="mt-1 text-base font-semibold text-[var(--color-page-text)]">
                  {ticket.title}
                </h4>
                <div className="mt-4 flex items-center justify-between text-xs text-[var(--color-page-text)]/60">
                  <span>{ticket.tag}</span>
                  <span>
                    {ticket.date} • {ticket.time}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 flex justify-center">
            <button
              type="button"
              className={`${tokens.buttonFilled} inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold`}
            >
              + Open New Ticket
            </button>
          </div>
        </div>

        <div className={cardClass}>
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-[var(--color-page-text)]">Recent News</h3>
            <button type="button" className={`${tokens.buttonGhost} rounded-full px-4 py-1 text-xs`}>
              See All →
            </button>
          </div>
          <div className="mt-6 space-y-4">
            {dataset.news.map((news) => (
              <div
                key={news.id}
                className="flex flex-col gap-3 rounded-2xl border border-[var(--color-border-divider)] bg-[var(--color-card-bg)] p-4 sm:flex-row sm:items-center"
              >
                <img
                  src={news.image}
                  alt={news.title}
                  className="h-20 w-28 rounded-xl object-cover"
                />
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-page-text)]/60">
                    {news.time} | {news.date}
                  </p>
                  <h4 className="mt-1 text-base font-semibold text-[var(--color-page-text)]">
                    {news.title}
                  </h4>
                  <p className="mt-1 text-sm text-[var(--color-page-text)]/70 line-clamp-2">
                    {news.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};


