import type { DashboardTokens, NewsItem } from "../types";

type RecentNewsPanelProps = {
  readonly news: readonly NewsItem[];
  readonly tokens: DashboardTokens;
};

export const RecentNewsPanel = ({
  news,
  tokens
}: RecentNewsPanelProps) => (
  <section className={`${tokens.cardBase} rounded-[32px] px-7 py-6`}>
    <header className="flex items-center justify-between">
      <h2 className="text-xl font-semibold">Recent News</h2>
      <button
        type="button"
        className={`${tokens.buttonGhost} rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide`}
      >
        See All
      </button>
    </header>
    <div className="mt-6 space-y-5">
      {news.map((post) => (
        <article
          key={post.id}
          className={`${tokens.surfaceMuted} rounded-3xl px-5 py-5`}
        >
          <div className="flex items-center gap-4">
            <img
              src={post.image}
              alt=""
              className="h-16 w-16 rounded-2xl object-cover"
            />
            <div>
              <h3 className="text-sm font-semibold">{post.title}</h3>
              <p className={`mt-2 text-xs leading-relaxed ${tokens.subtleText}`}>
                {post.description}
              </p>
            </div>
          </div>
          <div className={`mt-4 flex items-center gap-4 text-xs ${tokens.subtleText}`}>
            <span>{post.date}</span>
            <span className="h-1 w-1 rounded-full bg-current opacity-60" />
            <span>{post.time}</span>
          </div>
        </article>
      ))}
    </div>
  </section>
);


