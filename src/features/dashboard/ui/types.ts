export type DashboardTokens = {
  readonly isDark: boolean;
  readonly rootClass: string;
  readonly sidebarClass: string;
  readonly cardBase: string;
  readonly sidebarNavActiveText: string;
  readonly sidebarNavIdleText: string;
  readonly subtleText: string;
  readonly divider: string;
  readonly buttonFilled: string;
  readonly buttonGhost: string;
  readonly surfaceMuted: string;
  readonly iconActive: string;
  readonly iconIdle: string;
  readonly chipClass: string;
};

export type DashboardAppId = "cloud" | "app" | "software";

export type DashboardApp = {
  readonly id: DashboardAppId;
  readonly name: string;
  readonly theme: "dark" | "light";
};

export type DashboardNavItem = {
  readonly id: string;
  readonly label: string;
  readonly icon?: "dashboard" | "host" | "server" | "domains" | "websites" | "billing";
};

export type StatItem = {
  readonly id: string;
  readonly label: string;
  readonly value: string;
};

export type ProductItem = {
  readonly id: string;
  readonly server: string;
  readonly type: string;
  readonly cost: string;
  readonly renewal: string;
};

export type DomainStatus = "Active" | "Pending" | "Fraud";

export type DomainItem = {
  readonly id: string;
  readonly name: string;
  readonly status: DomainStatus;
};

export type SiteItem = {
  readonly id: string;
  readonly name: string;
  readonly type: string;
};

export type TicketItem = {
  readonly id: string;
  readonly title: string;
  readonly tag: string;
  readonly date: string;
  readonly time: string;
};

export type NewsItem = {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly date: string;
  readonly time: string;
  readonly image: string;
};

export type DashboardHeroContent = {
  readonly title: string;
  readonly highlights: readonly string[];
  readonly priceLabel: string;
  readonly price: string;
  readonly ctaLabel: string;
  readonly gradient: string;
};

export type DashboardDataset = {
  readonly navigation: readonly DashboardNavItem[];
  readonly hero: DashboardHeroContent;
  readonly stats: readonly StatItem[];
  readonly products: readonly ProductItem[];
  readonly domains: readonly DomainItem[];
  readonly sites: readonly SiteItem[];
  readonly tickets: readonly TicketItem[];
  readonly news: readonly NewsItem[];
  readonly placeholder?: string;
};

export type ServerServiceStatus = "Active" | "Pending";

export type ServerService = {
  readonly id: string;
  readonly product: string;
  readonly plan: string;
  readonly pricing: string;
  readonly billingCycle: string;
  readonly nextDueDate: string;
  readonly status: ServerServiceStatus;
};

