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
  readonly icon?: "dashboard" | "host" | "server" | "domains" | "websites" | "billing" | "settings" | "projects" | "products" | "meetings" | "applications" | "marketplace";
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
  readonly registrationDate: string;
  readonly nextDueDate: string;
  readonly autoRenew: boolean;
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
  readonly description?: string;
  readonly priceLabel: string;
  readonly price: string;
  readonly ctaLabel: string;
  readonly gradient: string;
  readonly backgroundImage?: string;
  readonly backgroundImageDark?: string;
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
  readonly softwareData?: SoftwareDashboardData;
  readonly appData?: AppDashboardData;
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

// Software Dashboard Types
export type ProposalStatus = "Pending" | "Declined" | "Accepted";

export type ProposalItem = {
  readonly status: ProposalStatus;
  readonly percentage: number;
  readonly color: string;
};

export type EventItem = {
  readonly id: string;
  readonly title: string;
  readonly date: string;
  readonly location: string;
  readonly time: string;
  readonly day: string;
  readonly hour: string;
  readonly attendees: number;
};

export type InvoiceStatus = "Paid" | "Unpaid" | "Overdue";

export type InvoiceItem = {
  readonly status: InvoiceStatus;
  readonly percentage: number;
  readonly color: string;
};

export type ClientDataPoint = {
  readonly month: string;
  readonly value: number;
  readonly highlight?: boolean;
  readonly highlightLabel?: string;
};

export type ProjectStatus = "Ongoing" | "Pending" | "Not Started";

export type ProjectItem = {
  readonly id: string;
  readonly name: string;
  readonly date: string;
  readonly status: ProjectStatus;
};

export type SoftwareDashboardData = {
  readonly proposals: {
    readonly total: string;
    readonly items: readonly ProposalItem[];
  };
  readonly events: readonly EventItem[];
  readonly invoices: readonly InvoiceItem[];
  readonly clients: readonly ClientDataPoint[];
  readonly projects: readonly ProjectItem[];
};

// App Dashboard Types
export type SubscriptionStatus = "Active" | "Expiring Soon" | "Expired";

export type SubscriptionItem = {
  readonly id: string;
  readonly name: string;
  readonly plan: string;
  readonly expiryDate: string;
  readonly status: SubscriptionStatus;
  readonly amount?: string;
};

export type AppCategory = {
  readonly name: string;
  readonly percentage: number;
  readonly color: string;
  readonly gradient?: { from: string; to: string };
};

export type ActivityItem = {
  readonly id: string;
  readonly message: string;
  readonly timeAgo: string;
  readonly icon: string;
};

export type AppDashboardData = {
  readonly stats: readonly StatItem[];
  readonly subscriptions: readonly SubscriptionItem[];
  readonly quickAccess: readonly SubscriptionItem[];
  readonly categories: {
    readonly total: string;
    readonly items: readonly AppCategory[];
  };
  readonly activities: readonly ActivityItem[];
};

