import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { i18n } from "@shared/config/i18n";
import heroWave from "@assets/images/cloud/bg.png";
import widgetBg from "@assets/images/cloud/widget.png";
import widget3Bg from "@assets/images/cloud/widget3.png";
import { SearchIcon, HostIcon, TicketIcon,  InvoiceIcon,DomainsIconMINI , DomainsIcon, SettingsIcon, ArrowUpIcon, BackupIcon, ActiveIcon, UnpaidIcon, PendingIcon, TechIcon, DateIcon, ClockIcon, plus as PlusIcon } from "@utilities/icons";

import type { DashboardDataset, DashboardTokens, DomainItem } from "../../types";
import { DiamondIcon, ArrowRight } from "@utilities/icons";
import { CustomSelect } from "@shared/components/CustomSelect";

type DashboardOverviewProps = {
  readonly dataset: DashboardDataset;
  readonly tokens: DashboardTokens;
  readonly onManageDomain?: (domain: DomainItem) => void;
};


type HeroSlide = {
  title: string;
  highlights: readonly string[];
  priceLabel: string;
  price: string;
  gradient: string;
};

const createHeroSlides = (baseHero: DashboardDataset["hero"]): HeroSlide[] => [
  {
    title: baseHero.title,
    highlights: baseHero.highlights,
    priceLabel: baseHero.priceLabel,
    price: baseHero.price,
    gradient: baseHero.gradient
  },
  {
    title: "Premium SSL Certificates",
    highlights: [
      "Enterprise-grade security for your website",
      "Boost SEO rankings with HTTPS",
      "Build customer trust and confidence",
      "Easy installation and management"
    ],
    priceLabel: "Starting from",
    price: "$49/year",
    gradient: "linear-gradient(135deg, rgba(16,185,129,0.95) 0%, rgba(5,150,105,0.95) 45%, rgba(4,120,87,0.9) 100%)"
  },
  {
    title: "24/7 Expert Support",
    highlights: [
      "Round-the-clock technical assistance",
      "Expert team ready to help",
      "Fast response times guaranteed",
      "Multiple support channels available"
    ],
    priceLabel: "Included with",
    price: "All Plans",
    gradient: "linear-gradient(135deg, rgba(59,130,246,0.95) 0%, rgba(37,99,235,0.95) 45%, rgba(29,78,216,0.9) 100%)"
  },
  {
    title: "Advanced Performance",
    highlights: [
      "Lightning-fast page load times",
      "CDN integration included",
      "Automatic caching and optimization",
      "Real-time performance monitoring"
    ],
    priceLabel: "Starting from",
    price: "$9.99/month",
    gradient: "linear-gradient(135deg, rgba(168,85,247,0.95) 0%, rgba(147,51,234,0.95) 45%, rgba(126,34,206,0.9) 100%)"
  }
];

export const DashboardOverview = ({
  dataset,
  tokens,
}: DashboardOverviewProps) => {
  const { t } = useTranslation("landing");
  const navigate = useNavigate();
  const [activeSlide, setActiveSlide] = useState(0);
  const [activeNewsPage, setActiveNewsPage] = useState(0);
  const [activeTicketPage, setActiveTicketPage] = useState(0);
  const [domainSearchQuery, setDomainSearchQuery] = useState("");
  const [imageLoaded, setImageLoaded] = useState(false);
  const [selectedDomain, setSelectedDomain] = useState("");
  const isRTL = i18n.language === "ar";
  const cardClass = `${tokens.cardBase} rounded-[20px] px-6 py-4 transition-colors`;
  const heroSlides = createHeroSlides(dataset.hero);
  const currentSlide = heroSlides[activeSlide];
  const heroImage = dataset.hero.backgroundImage ?? heroWave;

  // Preload hero image
  useEffect(() => {
    // Add preload link to document head
    const link = document.createElement("link");
    link.rel = "preload";
    link.as = "image";
    link.href = heroImage;
    link.setAttribute("fetchpriority", "high");
    document.head.appendChild(link);

    // Preload image
    const img = new Image();
    img.src = heroImage;
    img.onload = () => setImageLoaded(true);
    img.onerror = () => setImageLoaded(true); // Still show content even if image fails

    return () => {
      // Cleanup: remove preload link when component unmounts
      document.head.removeChild(link);
    };
  }, [heroImage]);

  const filteredDomains = useMemo(() => {
    if (!domainSearchQuery.trim()) {
      return dataset.domains.slice(0, 3);
    }
    const query = domainSearchQuery.toLowerCase();
    return dataset.domains.filter((domain) =>
      domain.name.toLowerCase().includes(query) ||
      domain.status.toLowerCase().includes(query)
    );
  }, [dataset.domains, domainSearchQuery]);

  // News pagination: 2 items per page (2 columns)
  const newsPerPage = 2;
  const totalNewsPages = Math.ceil(dataset.news.length / newsPerPage);
  const paginatedNews = dataset.news.slice(
    activeNewsPage * newsPerPage,
    (activeNewsPage + 1) * newsPerPage
  );

  // Tickets pagination: 1 item per page
  const ticketsPerPage = 1;
  const totalTicketPages = Math.ceil(dataset.tickets.length / ticketsPerPage);
  const paginatedTickets = dataset.tickets.slice(
    activeTicketPage * ticketsPerPage,
    (activeTicketPage + 1) * ticketsPerPage
  );

  const getStatIcon = (statId: string) => {
    switch (statId) {
      case "hosting":
        return HostIcon;
      case "tickets":
        return TicketIcon;
      case "invoices":
        return InvoiceIcon;
      case "domains":
        return DomainsIcon;
      default:
        return HostIcon;
    }
  };

  return (
    <div className="flex flex-col gap-6 ">
      {/* Hero Section */}
      <section>
        <div
          className="relative z-10 overflow-hidden rounded-[20px] px-8 py-8 text-white transition-all duration-500"
          style={currentSlide.gradient ? { background: currentSlide.gradient } : undefined}
        >
          {/* Hero Image */}
          <img
            src={heroImage}
            alt="Hero background"
            className={`absolute inset-0  rounded-[20px]  w-full h-full object-cover transition-opacity duration-500 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            loading="eager"
            fetchPriority="high"
            onLoad={() => setImageLoaded(true)}
          />
          <div className="relative z-10 flex flex-col">
            <div className="flex-1 space-y-4 md:space-y-5 max-w-2xl">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight transition-opacity duration-500">
                {currentSlide.title}
              </h1>
              <ul className="space-y-2.5 text-xs sm:text-sm md:text-base text-white grid grid-cols-1 sm:grid-cols-2 gap-2">
                {currentSlide.highlights.map((highlight, idx) => (
                  <li key={`${activeSlide}-${idx}`} className="flex items-start gap-3 transition-opacity duration-500">
                    <DiamondIcon className="h-3 w-3 sm:h-4 sm:w-4 mt-1 flex-shrink-0" />
                    <span className="truncate sm:whitespace-normal">{highlight}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                className="inline-flex items-center gap-1 rounded-full border border-white bg-transparent px-5 md:px-6 py-2.5 md:py-3 text-sm text-white transition hover:opacity-90 whitespace-nowrap"
              >
                <span>{currentSlide.priceLabel} {currentSlide.price}</span>
                <ArrowRight className={`h-4 w-4 flex-shrink-0 [&_path]:stroke-white ${isRTL ? "rotate-180" : ""}`} />
              </button>
            </div>
          </div>
        </div>
        {/* Carousel Dots */}
        <div className="flex justify-center gap-2 mt-4">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setActiveSlide(index)}
              className={`transition-all duration-200 rounded-full md:w-2.5 md:h-2.5 xl:w-3 xl:h-3 w-2.5 h-2.5 ${
                activeSlide === index
                  ? "bg-[#584ABC]"
                  : "bg-[#BBB5E4] hover:bg-[#584ABC]/60"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

     <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dataset.stats.map((stat) => {
          const Icon = getStatIcon(stat.id);
          return (
            <div
              key={stat.id}
              className={`${cardClass} flex flex-col gap-2 px-4 py-7 `}
            >
              <div className="flex flex-wrap items-center gap-3">
                <div className={`flex items-center justify-center rounded-full p-3 ${tokens.isDark ? "bg-[var(--color-icon-surface)]" : "bg-[#EEEDF8]"}`}>
                  <Icon 
                    className={`h-6 w-6 md:h-8 md:w-8 ${tokens.isDark ? "[&_path]:fill-white" : "[&_path]:fill-[#584ABC]"}`}
                  />
                </div>
                <div>
                  <p className="text-sm md:text-base font-medium text-[#A3AED0]">{stat.label}</p>
                  <p className={`text-2xl mt-2 font-bold ${tokens.isDark ? "text-white" : "text-[#2B3674]"}`}>{stat.value}</p>
                </div>
              </div>
            </div>
          );
        })}
      </section> 

       <section className="grid gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <div className={cardClass}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className={`text-lg lg:text-xl font-bold ${tokens.isDark ? "text-[var(--color-page-text)]" : "text-[#2B3674]"}`}>
              Your Active Products/Services
            </h3>
            <button type="button" className="px-1 text-sm font-bold text-[#A3AED0] flex items-center gap-1 cursor-pointer">
              {t("dashboard.overview.seeAll")} <ArrowRight className={`h-4 w-4 [&_path]:stroke-[#A3AED0] ${isRTL ? "rotate-180" : ""}`} />
            </button>
          </div>
          <div className="mt-4 flex flex-col gap-4">
            {dataset.products.map((product) => (
              <div
                key={product.id}
                className={`grid gap-3 rounded-[20px] ${tokens.isDark ? "stroke" : "bg-[#F4F4FF] "} px-4 py-1 text-sm  md:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1fr)_auto] md:items-center`}
              >
                <div>
                  <p className="font-medium text-base text-[var(--color-page-text)]">{product.server}</p>
                  <p className="text-sm md:text-base text-[#718EBF]">{product.type}</p>
                </div>
                <p className="font-medium text-[var(--color-page-text)] flex items-start flex-col gap-1">{product.cost}<span className="text-[#718EBF]">Cost</span></p>
                <p className="text-sm text-[var(--color-page-text)]/70 flex items-start flex-col gap-1">{product.renewal}<span className="text-[#718EBF]">Renewal Date</span></p>
                <button
                  type="button"
                  className="flex items-start flex-col gap-2 rounded-full px-4 py-2 text-xs font-semibold"
                >
                  <div className={`flex items-center justify-center rounded-full p-1.5 ${tokens.isDark ? "bg-[var(--color-icon-surface)]" : "bg-[#EEEDF8]"}`}>
                    <SettingsIcon className={`h-4 w-4 ${tokens.isDark ? "[&_path]:fill-white" : "[&_path]:fill-[#584ABC]"}`} />
                  </div>
                  <span className="text-sm font-medium text-[#718EBF]">Manage</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <img src={widgetBg} alt="" className="w-full object-cover" />
          <div className="absolute inset-0 p-6 flex flex-col gap-5">
            <div>
              <div className="flex items-start justify-between">
                <h3 className="text-lg md:text-3xl lg:text-[44px] font-light text-[#F2F2F2]">
                  Build Your <br />
                  <span className="font-bold">Website</span>
                </h3>
              </div>
            </div>
             <div className="flex items-start flex-col gap-2 w-full">
               <p className="text-white mt-2 font-light text-sm md:text-base">Choose Domain</p>
               <CustomSelect
                 options={dataset.domains.map((domain) => ({
                   value: domain.id,
                   label: domain.name,
                 }))}
                 placeholder="Choose Domain"
                 value={selectedDomain}
                 onChange={setSelectedDomain}
                 icon={
                   <div className="w-10 h-10 m-1 bg-[#584ABC] rounded-full flex items-center justify-center text-center cursor-pointer flex-shrink-0 -ml-2">
                     <ArrowUpIcon className="w-8 h-8 p-1 rounded-full" />
                   </div>
                 }
               />
             </div>
          </div>
        </div>
      </section>

      <section className="md:grid gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1.8fr)]">
        <div className="relative">
          <img src={widget3Bg} alt="" className="w-full object-cover" />
          <div className="absolute inset-0 p-10 flex flex-col gap-5">
            <div>
              <div className="flex items-start justify-between">
                <h3 className="text-lg md:text-3xl lg:text-[44px] font-light text-[#7469C7]">
                  Manage Your <br />
                  <span className="font-bold">Security</span>
                </h3>
              </div>
            </div>
             <div className="flex items-start flex-col gap-2 w-full">
               <p className=" text-[#7469C7] mt-2 font-light text-sm md:text-base ">Choose Domain</p>
               <CustomSelect
                 options={dataset.domains.map((domain) => ({
                   value: domain.id,
                   label: domain.name,
                 }))}
                 placeholder="Choose Domain"
                 value={selectedDomain}
                 onChange={setSelectedDomain}
                 icon={
                   <div className="w-10 h-10 m-1 bg-[#584ABC] rounded-full flex items-center justify-center text-center cursor-pointer flex-shrink-0 -ml-2">
                     <ArrowUpIcon className="w-8 h-8 p-1 rounded-full" />
                   </div>
                 }
               />
             </div>
          </div>
        </div>

        <div className={cardClass}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className={`text-lg lg:text-xl font-bold ${tokens.isDark ? "text-[var(--color-page-text)]" : "text-[#2B3674]"}`}>Domains</h3>
            <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--color-page-text)]/60">
              <div className="flex h-10 items-center gap-2 rounded-full border border-[var(--color-border-divider)]  px-4">
                <SearchIcon className="h-4 w-4" />
                <input
                  type="search"
                  placeholder="Search for New Domain"
                  value={domainSearchQuery}
                  onChange={(e) => setDomainSearchQuery(e.target.value)}
                  className="w-48 bg-transparent text-sm text-[var(--color-page-text)] placeholder:text-[var(--color-page-text)]/50 focus:outline-none"
                />
              </div>
              <button type="button" className="px-1 text-sm font-bold text-[#A3AED0] flex items-center gap-1 cursor-pointer">
                {t("dashboard.overview.seeAll")} <ArrowRight className={`h-4 w-4 [&_path]:stroke-[#A3AED0] ${isRTL ? "rotate-180" : ""}`} />
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto border-separate border-spacing-y-3 text-sm">
              <thead className={tokens.isDark ? "" : "bg-[#F7F6FF]"}>
                <tr className="text-left uppercase text-sm [&>th]:border-b [&>th]:border-[var(--color-border-divider)]">
                  <th className={`px-4 py-4 ${tokens.isDark ? "text-white/70" : "text-[var(--color-page-text)]/65"}`}>Domain Name</th>
                  <th className={`px-4 py-4 ${tokens.isDark ? "text-white/70" : "text-[var(--color-page-text)]/65"}`}>Status</th>
                  <th className={`px-4 py-4 text-right ${tokens.isDark ? "text-white/70" : "text-[var(--color-page-text)]/65"}`}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDomains.map((domain) => {
                  return (
                    <tr key={domain.id} className="">
                      <td className="rounded-l-2xl px-4 py-2 font-medium text-[var(--color-card-text)]">
                        {domain.name}
                      </td>
                      <td className="px-4 py-2">
                        <span
                          className={`inline-flex items-center gap-1 text-sm font-medium ${
                            tokens.isDark ? "text-white" : "text-[#2B3674]"
                          }`}
                        >
                          {domain.status === "Active" ? (
                            <ActiveIcon className="h-5 w-5" />
                          ) : domain.status === "Pending" ? (
                            <PendingIcon className="h-5 w-5" />
                          ) : (
                            <UnpaidIcon className="h-5 w-5" />
                          )}
                          {domain.status}
                        </span>
                      </td>
                      <td className="rounded-r-2xl px-4 py-2">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            type="button"
                            className={`${tokens.buttonGhost} flex h-9 w-9 items-center justify-center rounded-full`}
                            onClick={() => navigate(`/dashboard/manage-domain/${domain.id}`)}
                            aria-label={`Manage ${domain.name}`}
                          >
                            <SettingsIcon className={`h-4 w-4 ${tokens.isDark ? "" : "text-[#584ABC]"}`} />
                          </button>
                          <button
                            type="button"
                            className={`${tokens.buttonGhost} flex h-9 w-9 items-center justify-center rounded-full`}
                            aria-label={`Backup ${domain.name}`}
                          >
                            <BackupIcon className={`h-4 w-4 ${tokens.isDark ? "" : "[&_path]:fill-[#584ABC]"}`} />
                          </button>
                          <button
                            type="button"
                            className={`${tokens.buttonGhost} flex h-9 w-9 items-center justify-center rounded-full`}
                            aria-label={`Domain settings for ${domain.name}`}
                          >
                            <DomainsIconMINI  className={`h-4 w-4 ${tokens.isDark ? "" : "text-[#584ABC]"}`} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section>
        <div className={cardClass}>
          <div className="flex flex-wrap items-center justify-between">
            <h3 className={`text-lg lg:text-xl font-bold ${tokens.isDark ? "text-[var(--color-page-text)]" : "text-[#2B3674]"}`}>Managed Sites</h3>
            <button type="button" className="px-1 text-sm font-bold text-[#A3AED0] flex items-center gap-1 cursor-pointer">
              {t("dashboard.overview.seeAll")} <ArrowRight className={`h-4 w-4 [&_path]:stroke-[#A3AED0] ${isRTL ? "rotate-180" : ""}`} />
            </button>
          </div>
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {dataset.sites.map((site) => (
              <div
                key={site.id}
                className={`relative rounded-[20px] px-6 py-4 transition-colors hover:border-[#7469C7] ${tokens.isDark ? "bg-transparent stroke" : "bg-[#F4F4FF]"}`}
              >
                {/* Domain Name */}
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-[var(--color-page-text)]">
                    {site.name}
                  </h3>
                </div>

                {/* Technology Type */}
                <div className="mb-6 flex flex-wrap items-center gap-2">
                  <TechIcon 
                    className={`h-4 w-4 ${tokens.isDark ? "" : "[&_path]:fill-[#584ABC]"}`}
                  />
                  <span className={`text-sm font-semibold ${tokens.subtleText} ${tokens.isDark ? "text-white/70" : "!text-[#3E3484]"}`}>{site.type}</span>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-center cursor-pointer w-full pt-4 pb-2" onClick={() => navigate(`/dashboard/manage-website/${site.id}`)}>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/dashboard/manage-website/${site.id}`);
                    }}
                    className={`${tokens.isDark ? "bg-[#584ABC] text-white" : "bg-[#584ABC] text-white"} transition text-[#584ABC] w-[100%] flex justify-center cursor-pointer flex items-center  rounded-full  py-2.5 text-sm md:text-base font-semibold`}
                  >
                    Manage Site
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className={cardClass}>
          <div className="flex flex-wrap items-center justify-between">
            <h3 className={`text-lg lg:text-xl font-bold ${tokens.isDark ? "text-[var(--color-page-text)]" : "text-[#2B3674]"}`}>Recent Support Tickets</h3>
            <button type="button" className="px-1 text-sm font-bold text-[#A3AED0] flex items-center gap-1 cursor-pointer">
              {t("dashboard.overview.seeAll")} <ArrowRight className={`h-4 w-4 [&_path]:stroke-[#A3AED0] ${isRTL ? "rotate-180" : ""}`} />
            </button>
          </div>
          <div className="mt-4 space-y-4">
            {paginatedTickets.map((ticket) => (
              <div
                key={ticket.id}
                className={`flex flex-col gap-3 rounded-[20px] p-6 transition-colors hover:border-[#7469C7] ${tokens.isDark ? "bg-transparent stroke" : "bg-[#F4F4FF]"}`}
              >
                <div className="flex flex-wrap items-center justify-between">
                  <p className={`text-sm md:text-base font-medium ${tokens.isDark ? "text-white" : "text-[#2B3674]"}`}>{ticket.id}</p>
                  {/* Badge */}
                  <span className="bg-[#FCE1DF] rounded-full px-6 py-2.5 text-sm font-medium text-[#B60F00]">Customer-Reply</span>
                </div>
                <h4 className="text-base font-semibold text-[var(--color-page-text)]">
                  {ticket.title}
                </h4>
                <div className="flex flex-wrap items-center gap-2">
                  <div className={`flex items-center gap-1 rounded-[20px] py-2.5 max-w-fit px-4 text-sm ${tokens.isDark ? "bg-[#393C4C] text-white" : "bg-white text-[#584ABC]"}`}>
                    <DateIcon className="h-4 w-4" />
                    <span>
                      {ticket.date} 
                    </span>
                  </div>
                  <div className={`flex items-center gap-1 rounded-[20px] py-2.5 max-w-fit px-4 text-sm ${tokens.isDark ? "bg-[#393C4C] text-white" : "bg-white text-[#584ABC]"}`}>
                    <ClockIcon className="h-4 w-4" />
                    <span>{ticket.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* Tickets Carousel Dots */}
          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: totalTicketPages }).map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveTicketPage(index)}
                className={`transition-all duration-200 rounded-full md:w-2.5 md:h-2.5 xl:w-3 xl:h-3 w-2.5 h-2.5 ${
                  activeTicketPage === index
                    ? "bg-[#584ABC]"
                    : "bg-[#BBB5E4] hover:bg-[#584ABC]/60"
                }`}
                aria-label={`Go to ticket page ${index + 1}`}
              />
            ))}
          </div>
          <div className="mt-16 flex justify-center bg-[#584ABC] text-white border border-dashed border-[#584ABC] rounded-full cursor-pointer px-8 py-2 text-sm md:text-base font-semibold">
            <button
                type="button"
                onClick={() => navigate("/dashboard/manage-nameservers")}
                className="py-2.5 flex flex-wrap items-center gap-2 cursor-pointer "
              >
           <PlusIcon className="h-4 w-4" />
                Open New Ticket
              </button>
          </div>
        </div>

        <div className={cardClass}>
          <div className="flex flex-wrap items-center justify-between">
            <h3 className={`text-lg lg:text-xl font-bold ${tokens.isDark ? "text-[var(--color-page-text)]" : "text-[#2B3674]"}`}>Recent News</h3>
            <button type="button" className="px-1 text-sm font-bold text-[#A3AED0] flex items-center gap-1 cursor-pointer">
              {t("dashboard.overview.seeAll")} <ArrowRight className={`h-4 w-4 [&_path]:stroke-[#A3AED0] ${isRTL ? "rotate-180" : ""}`} />
            </button>
          </div>
          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {paginatedNews.map((news) => (
              <div
                key={news.id}
                className={`flex flex-col gap-3 rounded-[20px] px-6 py-4 transition-colors hover:border-[#7469C7] ${tokens.isDark ? "bg-transparent stroke" : "bg-[#F4F4FF]"}`}
              >
                <div>
                  <h4 className="text-base font-semibold text-[var(--color-page-text)]">
                    {news.title}
                  </h4>
                  <p className="mt-2 text-sm text-[var(--color-page-text)]/70">
                    {news.description}
                  </p>
                </div>
                <p className="text-sm text-[var(--color-page-text)]/60 text-end">
                  {news.time} | {news.date}
                </p>
                <img
                  src={news.image}
                  alt={news.title}
                  className="w-full object-cover"
                />
              </div>
            ))}
          </div>
          {/* News Carousel Dots */}
          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: totalNewsPages }).map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveNewsPage(index)}
                className={`transition-all duration-200 rounded-full md:w-2.5 md:h-2.5 xl:w-3 xl:h-3 w-2.5 h-2.5 ${
                  activeNewsPage === index
                    ? "bg-[#584ABC]"
                    : "bg-[#BBB5E4] hover:bg-[#584ABC]/60"
                }`}
                aria-label={`Go to news page ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};


