import heroTexture from "@assets/images/cloud/widget2.png";
import heroWave from "@assets/images/cloud/bg.png";
import heroSoftwareBg from "@assets/images/software/bg.png";
import heroAppBg from "@assets/images/app/bg.png";
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
  TicketItem,
  SoftwareDashboardData,
  AppDashboardData
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
    pricing: "$30.00 EGP",
    billingCycle: "Monthly",
    nextDueDate: "2026-03-17",
    status: "Pending"
  },
  {
    id: "srv-002",
    product: "5545dd.com",
    plan: "(Pro)",
    pricing: "$30.00 EGP",
    billingCycle: "Quarterly",
    nextDueDate: "2026-03-17",
    status: "Active"
  },
  {
    id: "srv-003",
    product: "5545dd.com",
    plan: "(Pro)",
    pricing: "$30.00 EGP",
    billingCycle: "Triennially",
    nextDueDate: "2026-03-17",
    status: "Pending"
  },
  {
    id: "srv-004",
    product: "5545dd.com",
    plan: "(Pro)",
    pricing: "$30.00 EGP",
    billingCycle: "Monthly",
    nextDueDate: "2026-03-17",
    status: "Active"
  },
  {
    id: "srv-005",
    product: "5545dd.com",
    plan: "(Pro)",
    pricing: "$30.00 EGP",
    billingCycle: "Monthly",
    nextDueDate: "2026-03-17",
    status: "Active"
  },
  {
    id: "srv-006",
    product: "5545dd.com",
    plan: "(Pro)",
    pricing: "$30.00 EGP",
    billingCycle: "Monthly",
    nextDueDate: "2026-03-17",
    status: "Pending"
  },
  {
    id: "srv-007",
    product: "5545dd.com",
    plan: "(Pro)",
    pricing: "$30.00 EGP",
    billingCycle: "Monthly",
    nextDueDate: "2026-03-17",
    status: "Pending"
  },
  {
    id: "srv-008",
    product: "5545dd.com",
    plan: "(Pro)",
    pricing: "$30.00 EGP",
    billingCycle: "Monthly",
    nextDueDate: "2026-03-17",
    status: "Pending"
  },
  {
    id: "srv-009",
    product: "5545dd.com",
    plan: "(Pro)",
    pricing: "$30.00 EGP",
    billingCycle: "Monthly",
    nextDueDate: "2026-03-17",
    status: "Pending"
  },
  {
    id: "srv-010",
    product: "5545dd.com",
    plan: "(Pro)",
    pricing: "$30.00 EGP",
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
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "applications", label: "Applications", icon: "applications" },
  { id: "marketplace", label: "Marketplace", icon: "marketplace" },
  { id: "billing", label: "Billing", icon: "billing" },
  { id: "settings", label: "Settings", icon: "settings" }
];

const softwareNavigation: DashboardNavItem[] = [
  { id: "dashboard", label: "Dashboard", icon: "dashboard" },
  { id: "projects", label: "Projects", icon: "projects" },
  { id: "products", label: "Products", icon: "products" },
  { id: "meetings", label: "Meetings", icon: "meetings" },
  { id: "billing", label: "Billing", icon: "billing" },
  { id: "settings", label: "Settings", icon: "settings" }
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
        cost: "300 EGP / Year",
        renewal: "25 Oct 2026"
      },
      {
        id: "wp-cloud",
        server: "WP Cloud",
        type: "WordPress Hosting",
        cost: "300 EGP / Year",
        renewal: "10 Nov 2025"
      },
      {
        id: "mysql-pro",
        server: "MySQL Pro",
        type: "Node.js VPS",
        cost: "520 EGP / Year",
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
      },
      {
        id: "#162797",
        title: "One Page Orderform Template Released",
        tag: "Customer-Reply",
        date: "Monday, June 23rd, 2025",
        time: "15:20"
      },
      {
        id: "#162798",
        title: "One Page Orderform Template Released",
        tag: "Customer-Reply",
        date: "Tuesday, June 24th, 2025",
        time: "16:30"
      },
      {
        id: "#162799",
        title: "One Page Orderform Template Released",
        tag: "Customer-Reply",
        date: "Wednesday, June 25th, 2025",
        time: "17:40"
      },
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
      },
      {
        id: "news-3",
        title: "One Page Orderform Template Released",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et.",
        date: "July 5th, 2025",
        time: "09:15",
        image: recentOne
      },
      {
        id: "news-4",
        title: "One Page Orderform Template Released",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et.",
        date: "July 6th, 2025",
        time: "11:30",
        image: recentTwo
      },
      {
        id: "news-5",
        title: "One Page Orderform Template Released",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et.",
        date: "July 7th, 2025",
        time: "14:20",
        image: recentOne
      },
      {
        id: "news-6",
        title: "One Page Orderform Template Released",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et.",
        date: "July 8th, 2025",
        time: "16:45",
        image: recentTwo
      },
      {
        id: "news-7",
        title: "One Page Orderform Template Released",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et.",
        date: "July 9th, 2025",
        time: "10:00",
        image: recentOne
      },
      {
        id: "news-8",
        title: "One Page Orderform Template Released",
        description:
          "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et.",
        date: "July 10th, 2025",
        time: "13:25",
        image: recentTwo
      }
    ])
  },
  app: {
    navigation: appNavigation,
    hero: {
      title: "Let's Get Started",
      highlights: [
        "Discover powerful applications",
        "Manage your subscriptions easily",
        "Access marketplace features",
        "Get 24/7 support"
      ],
      priceLabel: "Starting from",
      price: "$9.99/month",
      ctaLabel: "Discover now",
      gradient:
        "linear-gradient(135deg, #093F46 0%, rgba(56,129,139,0.7) 100%)",
      backgroundImage: heroAppBg
    },
    stats: createStats(["12", "4", "3", "32002"]),
    products: [],
    domains: [],
    sites: [],
    tickets: [],
    news: [],
    appData: {
      stats: [
        { id: "apps", label: "Number Of Apps", value: "12" },
        { id: "subscriptions", label: "Active Subscriptions", value: "4" },
        { id: "types", label: "Types of apps", value: "3" },
        { id: "revenue", label: "Total revenue", value: "32002" }
      ],
      subscriptions: [
        {
          id: "sub-1",
          name: "Codgoo Hosting",
          plan: "Business",
          expiryDate: "10 Nov 2025",
          status: "Active",
          amount: "$7,098.00"
        },
        {
          id: "sub-2",
          name: "Codgoo Hosting",
          plan: "Business",
          expiryDate: "10 Nov 2025",
          status: "Expiring Soon",
          amount: "$7,098.00"
        },
        {
          id: "sub-3",
          name: "Codgoo Hosting",
          plan: "general",
          expiryDate: "10 Nov 2025",
          status: "Expired",
          amount: "$7,098.00"
        },
        {
          id: "sub-4",
          name: "Codgoo Hosting",
          plan: "general",
          expiryDate: "10 Nov 2025",
          status: "Active",
          amount: "$7,098.00"
        }
      ],
      quickAccess: [
        {
          id: "qa-1",
          name: "Codgoo Hosting",
          plan: "Premium",
          expiryDate: "15 Dec 2025",
          status: "Active"
        },
        {
          id: "qa-2",
          name: "Codgoo Marketing",
          plan: "Basic",
          expiryDate: "10 Nov 2025",
          status: "Expiring Soon"
        },
        {
          id: "qa-3",
          name: "FixMate App",
          plan: "Pro",
          expiryDate: "05 Feb 2026",
          status: "Active"
        }
      ],
      categories: {
        total: "12 Total Apps",
        items: [
          { name: "Hr", percentage: 40, color: "#0F6773" },
          { name: "CRM", percentage: 10, color: "url(#web-gradient)", gradient: { from: "#34D8D6", to: "#76E6E5" } },
          { name: "AI", percentage: 30, color: "#D3D3D3" },
          { name: "Marketing", percentage: 20, color: "url(#marketing-gradient)", gradient: { from: "rgba(15, 103, 115, 0.16)", to: "#0F6773" } }
        ]
      },
      activities: [
        {
          id: "act-1",
          message: "You renewed your subscription for FixMate App",
          timeAgo: "3h ago",
          icon: "refresh"
        },
        {
          id: "act-2",
          message: "New update available for App Builder",
          timeAgo: "5h ago",
          icon: "chart"
        },
        {
          id: "act-3",
          message: "New update available for App Builder",
          timeAgo: "5h ago",
          icon: "dots"
        },
        {
          id: "act-4",
          message: "New update available for App Builder",
          timeAgo: "5h ago",
          icon: "chart"
        },
        {
          id: "act-5",
          message: "New update available for App Builder",
          timeAgo: "5h ago",
          icon: "chart"
        }
      ]
    } as AppDashboardData
  },
  software: {
    navigation: softwareNavigation,
    hero: {
      title: "Let's Get Started",
      highlights: [
        "Create and manage projects",
        "Track proposals and invoices",
        "Monitor client relationships",
        "Streamline your workflow"
      ],
      priceLabel: "Starting from",
      price: "$19.99/month",
      ctaLabel: "Add project",
      gradient:
        "linear-gradient(135deg, rgba(7,31,215,0.6) 0%, rgba(7,31,215,0.7) 100%)",
      backgroundImage: heroSoftwareBg
    },
    stats: [],
    products: [],
    domains: [],
    sites: [],
    tickets: [],
    news: [],
    softwareData: {
      proposals: {
        total: "100.00",
        items: [
          { status: "Pending", percentage: 30, color: "#F8D20D" },
          { status: "Declined", percentage: 40, color: "#E00A48" },
          { status: "Accepted", percentage: 20, color: "#000000" }
        ]
      },
      events: [
        {
          id: "event-1",
          title: "Digital Marketing Workshop",
          date: "July 25, 2025",
          location: "Online",
          time: "8:00 PM",
          day: "Tues 02",
          hour: "11:00",
          attendees: 5
        },
        {
          id: "event-2",
          title: "Digital Marketing Workshop",
          date: "July 25, 2025",
          location: "Online",
          time: "8:00 PM",
          day: "Thu 04",
          hour: "11:00",
          attendees: 5
        },
        {
          id: "event-3",
          title: "Digital Marketing Workshop",
          date: "July 25, 2025",
          location: "Online",
          time: "8:00 PM",
          day: "Sat 06",
          hour: "11:00",
          attendees: 5
        }
      ],
      invoices: [
        { status: "Paid", percentage: 40, color: "rgb(94,177,218)" },
        { status: "Unpaid", percentage: 25, color: "#071FD7" },
        { status: "Overdue", percentage: 35, color: "#000000" }
      ],
      clients: [
        { month: "Jan", value: 20 },
        { month: "Feb", value: 25 },
        { month: "Mar", value: 30 },
        { month: "Apr", value: 35 },
        { month: "May", value: 50, highlight: true, highlightLabel: "Client +35" },
        { month: "Jun", value: 45 },
        { month: "Jul", value: 40 },
        { month: "Aug", value: 50 },
        { month: "Sep", value: 55 },
        { month: "Oct", value: 60 },
        { month: "Nov", value: 65 },
        { month: "Dec", value: 70 }
      ],
      projects: [
        {
          id: "proj-1",
          name: "Codgoo UI.com",
          date: "14 Apr, 2024",
          status: "Ongoing"
        },
        {
          id: "proj-2",
          name: "Codgoo UI.com",
          date: "14 Apr, 2024",
          status: "Pending"
        },
        {
          id: "proj-3",
          name: "Marketplace.com",
          date: "14 Apr, 2024",
          status: "Not Started"
        },
        {
          id: "proj-4",
          name: "Weekly Updates.com",
          date: "14 Apr, 2024",
          status: "Pending"
        }
      ]
    } as SoftwareDashboardData
  }
};

