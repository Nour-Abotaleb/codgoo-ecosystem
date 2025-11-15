import heroTexture from "@assets/images/cloud/widget2.png";
import heroWave from "@assets/images/cloud/bg.png";
import recentOne from "@assets/images/cloud/recent-1.png";
import recentTwo from "@assets/images/cloud/recent-2.png";
import logoAppDark from "@assets/logos/logo-app-dark.svg";
import logoAppWhite from "@assets/logos/logo-app-white.svg";
import logoCloudDark from "@assets/logos/logo-cloud-dark.svg";
import logoCloudWhite from "@assets/logos/logo-cloud-white.svg";
import logoSoftwareDark from "@assets/logos/logo-software-dark.svg";
import logoSoftwareWhite from "@assets/logos/logo-software-white.svg";

import type {
  DashboardApp,
  DashboardAppId,
  DashboardDataset,
  DashboardNavItem,
  DomainStatus,
  NewsItem,
  ProductItem,
  ServerService,
  ServerServiceStatus,
  SiteItem,
  StatItem,
  TicketItem
} from "./types";

export const supportChannels = ["Chat", "Tickets", "Knowledgebase"] as const;
export type SupportChannel = (typeof supportChannels)[number];

export const statusColors: Record<DomainStatus, string> = {
  Active: "bg-emerald-500/10 text-emerald-300",
  Pending: "bg-amber-500/10 text-amber-300",
  Fraud: "bg-rose-500/10 text-rose-300"
};

export const serverServiceStatusStyles: Record<ServerServiceStatus, string> = {
  Active: "text-white",
  Pending: "text-white"
};

export const serverServices: readonly ServerService[] = [
  {
    id: "srv-001",
    product: "11aveafrica.com",
    plan: "(Starter cPanel)",
    pricing: "$30.00 USD",
    billingCycle: "Monthly",
    nextDueDate: "2026-03-17",
    status: "Pending"
  },
  {
    id: "srv-002",
    product: "5545dd.com",
    plan: "(Pro)",
    pricing: "$30.00 USD",
    billingCycle: "Quarterly",
    nextDueDate: "2026-03-17",
    status: "Active"
  },
  {
    id: "srv-003",
    product: "5545dd.com",
    plan: "(Pro)",
    pricing: "$30.00 USD",
    billingCycle: "Triennially",
    nextDueDate: "2026-03-17",
    status: "Pending"
  },
  {
    id: "srv-004",
    product: "5545dd.com",
    plan: "(Pro)",
    pricing: "$30.00 USD",
    billingCycle: "Monthly",
    nextDueDate: "2026-03-17",
    status: "Active"
  },
  {
    id: "srv-005",
    product: "5545dd.com",
    plan: "(Pro)",
    pricing: "$30.00 USD",
    billingCycle: "Monthly",
    nextDueDate: "2026-03-17",
    status: "Active"
  },
  {
    id: "srv-006",
    product: "5545dd.com",
    plan: "(Pro)",
    pricing: "$30.00 USD",
    billingCycle: "Monthly",
    nextDueDate: "2026-03-17",
    status: "Pending"
  },
  {
    id: "srv-007",
    product: "5545dd.com",
    plan: "(Pro)",
    pricing: "$30.00 USD",
    billingCycle: "Monthly",
    nextDueDate: "2026-03-17",
    status: "Pending"
  },
  {
    id: "srv-008",
    product: "5545dd.com",
    plan: "(Pro)",
    pricing: "$30.00 USD",
    billingCycle: "Monthly",
    nextDueDate: "2026-03-17",
    status: "Pending"
  },
  {
    id: "srv-009",
    product: "5545dd.com",
    plan: "(Pro)",
    pricing: "$30.00 USD",
    billingCycle: "Monthly",
    nextDueDate: "2026-03-17",
    status: "Pending"
  },
  {
    id: "srv-010",
    product: "5545dd.com",
    plan: "(Pro)",
    pricing: "$30.00 USD",
    billingCycle: "Monthly",
    nextDueDate: "2026-03-17",
    status: "Active"
  }
] as const;

export const heroAssets = {
  texture: heroTexture,
  wave: heroWave
} as const;

export const dashboardApps: readonly DashboardApp[] = [
  {
    id: "cloud",
    name: "Codgoo Cloud",
    theme: "dark"
  },
  {
    id: "app",
    name: "Codgoo App",
    theme: "light"
  },
  {
    id: "software",
    name: "Codgoo Software",
    theme: "dark"
  }
] as const;

export const dashboardAppLogos: Record<DashboardAppId, string> = {
  cloud: logoCloudWhite,
  app: logoAppWhite,
  software: logoSoftwareWhite
};

export const dashboardAppLogosLight: Record<DashboardAppId, string> = {
  cloud: logoCloudDark,
  app: logoAppDark,
  software: logoSoftwareDark
};

const createStats = (values: [string, string, string, string]): StatItem[] => [
  { id: "hosting", label: "Active Hosting", value: values[0] },
  { id: "tickets", label: "Active Tickets", value: values[1] },
  { id: "invoices", label: "Due Invoices", value: values[2] },
  { id: "domains", label: "Registered Domains", value: values[3] }
];

const createProducts = (items: ProductItem[]): ProductItem[] => items;

const createDomains = (items: {
  id: string;
  name: string;
  registrationDate: string;
  nextDueDate: string;
  autoRenew: boolean;
  status: DomainStatus;
}[]) => items;

const createSites = (items: SiteItem[]): SiteItem[] => items;

const createTickets = (items: TicketItem[]): TicketItem[] => items;

const createNews = (items: NewsItem[]): NewsItem[] => items;

const cloudNavigation: DashboardNavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "host", label: "Host", icon: "host" },
  { id: "server", label: "Servers", icon: "server" },
  { id: "domains", label: "Domains", icon: "domains" },
  { id: "websites", label: "Websites", icon: "websites" },
  { id: "billing", label: "Billing", icon: "billing" },
  { id: "settings", label: "Settings", icon: "settings" }
];

const appNavigation: DashboardNavItem[] = [
  { id: "release-center", label: "Release Center" },
  { id: "experiments", label: "Experiments" },
  { id: "distribution", label: "Distribution" },
  { id: "crash-analytics", label: "Crash Analytics" }
];

const softwareNavigation: DashboardNavItem[] = [
  { id: "ops-overview", label: "Ops Overview" },
  { id: "runbooks", label: "Runbooks" },
  { id: "automation", label: "Automation" },
  { id: "finance", label: "Finance Insights" }
];

export const dashboardContent: Record<DashboardAppId, DashboardDataset> = {
  cloud: {
    navigation: cloudNavigation,
    hero: {
      title: "Daily Website Backup",
      highlights: [
        "Automatic daily backup of your website",
        "Keep your WordPress or website updated automatically",
        "Monitor for malware and get alerts",
        "One-click restore whenever you need it"
      ],
      priceLabel: "Starting from just",
      price: "$2.09/month",
      ctaLabel: "Get Started",
      gradient:
        "linear-gradient(135deg, rgba(64,41,158,0.95) 0%, rgba(98,52,204,0.95) 45%, rgba(168,113,255,0.9) 100%)",
      backgroundImage: heroWave
    },
    stats: createStats(["24", "24", "24", "1"]),
    products: createProducts([
      {
        id: "sherd",
        server: "Sherd Hosten",
        type: "PHP Hosting",
        cost: "300 SAR / Year",
        renewal: "25 Oct 2026"
      },
      {
        id: "wp-cloud",
        server: "WP Cloud",
        type: "WordPress Hosting",
        cost: "300 SAR / Year",
        renewal: "10 Nov 2025"
      },
      {
        id: "mysql-pro",
        server: "MySQL Pro",
        type: "Node.js VPS",
        cost: "520 SAR / Year",
        renewal: "12 Dec 2025"
      }
    ]),
    domains: createDomains([
      {
        id: "domain-001",
        name: "Codgoo UI.com",
        registrationDate: "2026-03-17",
        nextDueDate: "2026-03-17",
        autoRenew: true,
        status: "Active"
      },
      {
        id: "domain-002",
        name: "Codgoo Dashboard.com",
        registrationDate: "2026-03-17",
        nextDueDate: "2026-03-17",
        autoRenew: true,
        status: "Pending"
      },
      {
        id: "domain-003",
        name: "Marketplace.com",
        registrationDate: "2026-03-17",
        nextDueDate: "2026-03-17",
        autoRenew: true,
        status: "Fraud"
      },
      {
        id: "domain-004",
        name: "Weekly Updates.com",
        registrationDate: "2026-03-17",
        nextDueDate: "2026-03-17",
        autoRenew: true,
        status: "Pending"
      },
      {
        id: "domain-005",
        name: "codgoo.dev",
        registrationDate: "2026-03-17",
        nextDueDate: "2026-03-17",
        autoRenew: true,
        status: "Pending"
      },
      {
        id: "domain-006",
        name: "codgoo.app",
        registrationDate: "2026-03-17",
        nextDueDate: "2026-03-17",
        autoRenew: true,
        status: "Pending"
      },
      {
        id: "domain-007",
        name: "codgoo.software",
        registrationDate: "2026-03-17",
        nextDueDate: "2026-03-17",
        autoRenew: true,
        status: "Pending"
      },
      {
        id: "domain-008",
        name: "codgoo-suite.com",
        registrationDate: "2026-03-17",
        nextDueDate: "2026-03-17",
        autoRenew: true,
        status: "Pending"
      },
      {
        id: "domain-009",
        name: "codgoo-labs.com",
        registrationDate: "2026-03-17",
        nextDueDate: "2026-03-17",
        autoRenew: true,
        status: "Pending"
      },
      {
        id: "domain-010",
        name: "codgoo-beta.com",
        registrationDate: "2026-03-17",
        nextDueDate: "2026-03-17",
        autoRenew: true,
        status: "Pending"
      }
    ]),
    sites: createSites([
      { id: "business", name: "mybusiness.com", type: "WordPress" },
      { id: "beauty", name: "beautyworld.net", type: "PHP" },
      { id: "garden", name: "greengarden.org", type: "Laravel" },
      { id: "marketly", name: "marketly.store", type: "HTML / Static" }
    ]),
    tickets: createTickets([
      {
        id: "#162796",
        title: "One Page Orderform Template Released",
        tag: "Customer-Reply",
        date: "Sunday, June 22nd, 2025",
        time: "14:10"
      }
    ]),
    news: createNews([
      {
        id: "news-1",
        title: "One Page Orderform Template Released",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et.",
        date: "July 4th, 2025",
        time: "07:40",
        image: recentOne
      },
      {
        id: "news-2",
        title: "One Page Orderform Template Released",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et.",
        date: "July 4th, 2025",
        time: "07:40",
        image: recentTwo
      }
    ])
  },
  app: {
    navigation: appNavigation,
    hero: {
      title: "Ship Codgoo App updates without downtime",
      highlights: [
        "Automatic rollout waves with health checks",
        "Feature flags synced across platforms",
        "Real-time crash alerts and diagnostics",
        "Integrated store listing management"
      ],
      priceLabel: "Plans beginning at",
      price: "$149/month",
      ctaLabel: "Launch Rollout",
      gradient:
        "linear-gradient(125deg, rgba(255,137,102,0.9) 0%, rgba(240,78,164,0.85) 45%, rgba(77,15,120,0.95) 100%)"
    },
    stats: [],
    products: [],
    domains: [],
    sites: [],
    tickets: [],
    news: [],
    placeholder:
      "Codgoo App dashboard content will appear here soon. Try the new sidebar routes to explore the layout."
  },
  software: {
    navigation: softwareNavigation,
    hero: {
      title: "Codgoo Software keeps teams in sync",
      highlights: [
        "Unified dashboards for engineering, ops, and finance",
        "Smart anomaly detection powered by Codgoo AI",
        "Built-in playbooks for rapid incident response",
        "Cross-team OKR tracking with live forecasts"
      ],
      priceLabel: "Suite access from",
      price: "$329/month",
      ctaLabel: "View Suite",
      gradient:
        "linear-gradient(125deg, rgba(85,217,233,0.9) 0%, rgba(90,113,255,0.85) 45%, rgba(18,27,95,0.95) 100%)"
    },
    stats: [],
    products: [],
    domains: [],
    sites: [],
    tickets: [],
    news: [],
    placeholder:
      "Codgoo Software dashboards are under construction. Sidebar navigation reflects the upcoming modules."
  }
};

