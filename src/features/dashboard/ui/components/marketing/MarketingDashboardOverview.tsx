import { useEffect, useState } from "react";
import type { DashboardTokens, DashboardHeroContent } from "../../types";

type MarketingDashboardOverviewProps = {
  readonly hero: DashboardHeroContent;
  readonly tokens: DashboardTokens;
};

export const MarketingDashboardOverview = ({
  hero,
  tokens
}: MarketingDashboardOverviewProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const cardClass = `rounded-[20px] px-6 py-4 transition-colors ${tokens.isDark ? tokens.cardBase : "bg-[#FCFDFF]"}`;
  const primaryColor = "#FE572A";
  const bgColor = "#FFF0EB";

  // Preload hero image
  useEffect(() => {
    if (hero.backgroundImage) {
      const link = document.createElement("link");
      link.rel = "preload";
      link.as = "image";
      link.href = hero.backgroundImage;
      link.setAttribute("fetchpriority", "high");
      document.head.appendChild(link);

      const img = new Image();
      img.src = hero.backgroundImage;
      img.onload = () => setImageLoaded(true);
      img.onerror = () => setImageLoaded(true);

      return () => {
        document.head.removeChild(link);
      };
    } else {
      setImageLoaded(true);
    }
  }, [hero.backgroundImage]);

  const stats = [
    {
      id: "reach",
      label: "Reach",
      value: "12.4K",
      icon: (
        <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.9873 22.08C13.386 21.2013 13.0469 20.1375 13.0469 18.9967C13.0469 15.9442 15.5135 13.4775 18.566 13.4775C21.6185 13.4775 24.0852 15.9442 24.0852 18.9967C24.0852 22.0492 21.6185 24.5159 18.566 24.5159" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M27.1373 9.09915C24.5319 7.24915 21.6028 6.24707 18.5657 6.24707C13.1236 6.24707 8.05151 9.45374 4.52109 15.0037C3.13359 17.1775 3.13359 20.8312 4.52109 23.005C8.05151 28.555 13.1236 31.7617 18.5657 31.7617C24.0078 31.7617 29.0798 28.555 32.6103 23.005C33.9978 20.8312 33.9978 17.1775 32.6103 15.0037" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: "engagement",
      label: "Engagement",
      value: "5.8%",
      icon: (
        <svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.7287 4.7793C13.2416 4.7793 15.4616 5.98178 16.8491 7.8472C18.252 5.98178 20.472 4.7793 22.9695 4.7793C27.1937 4.7793 30.6162 8.2172 30.6162 12.4722C30.6162 13.1197 30.5699 13.7518 30.4929 14.353C29.7837 14.0447 29.0129 13.8751 28.1958 13.8751C26.315 13.8751 24.65 14.7847 23.617 16.1722C22.5687 14.7847 20.9037 13.8751 19.0229 13.8751C15.8624 13.8751 13.3033 16.4497 13.3033 19.6409C13.3033 23.7726 15.4925 26.933 17.9283 29.0759C17.8512 29.1222 17.7741 29.1376 17.697 29.1685C17.2345 29.3381 16.4637 29.3381 16.0012 29.1685C12.0083 27.7964 3.08203 22.123 3.08203 12.4722C3.08203 10.6684 3.69871 9.00344 4.73163 7.69302" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M33.9168 19.6408C33.9168 26.8558 27.2414 31.1108 24.2505 32.1283C23.8959 32.2517 23.3255 32.2517 22.9709 32.1283C21.6913 31.6967 19.7334 30.6637 17.9297 29.0758C15.4939 26.9329 13.3047 23.7725 13.3047 19.6408C13.3047 16.4496 15.8638 13.875 19.0243 13.875C20.9051 13.875 22.5701 14.7846 23.6184 16.1721C24.6514 14.7846 26.3164 13.875 28.1972 13.875C29.0143 13.875 29.7851 14.0446 30.4943 14.3529" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      id: "clicks",
      label: "Clicks",
      value: "1.2K",
      icon: (
        <svg width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M7.8378 29.1199C7.11817 28.2498 6.21862 26.4854 4.65084 24.2861C3.75129 23.0776 1.54097 20.7815 0.872736 19.5972C0.391019 18.8776 0.251239 18.0012 0.487216 17.1803C0.890624 15.6195 2.46509 14.5841 4.16251 14.7634C5.47534 15.0114 6.68182 15.6165 7.63219 16.5036C8.29575 17.0913 8.90613 17.73 9.45699 18.4129C9.86821 18.8963 9.97102 19.0897 10.4336 19.6456C10.8963 20.2015 11.2047 20.7574 10.9734 19.9356C10.7935 18.7271 10.485 16.6969 10.0481 14.8843C9.714 13.5066 9.6369 13.2891 9.32848 12.2498C9.02007 11.2105 8.84016 10.3404 8.50604 9.15616C8.20062 7.99259 7.96041 6.81473 7.7864 5.62746C7.46244 4.10892 7.69813 2.53191 8.45464 1.15617C9.35262 0.361896 10.6699 0.15226 11.7958 0.624447C12.9282 1.41076 13.7725 2.5088 14.2117 3.76644C14.8853 5.3142 15.3348 6.94 15.5482 8.60027C15.9594 11.0172 16.7562 14.5459 16.7819 15.271C16.7819 14.3767 16.602 12.4915 16.7819 11.6456C16.9601 10.7637 17.6119 10.0318 18.5039 9.71205C19.2693 9.49121 20.079 9.44155 20.8684 9.56704C21.6652 9.72369 22.3711 10.1547 22.8474 10.7755C23.4428 12.1855 23.7733 13.6821 23.824 15.1985C23.8929 13.8706 24.1346 12.5556 24.5437 11.283C24.9732 10.714 25.6004 10.3037 26.3171 10.1229C27.1667 9.97684 28.0375 9.97684 28.8872 10.1229C29.584 10.342 30.1935 10.755 30.6349 11.3072C31.1792 12.589 31.5087 13.9425 31.6116 15.3193C31.6116 15.6577 31.7915 14.3767 32.3569 13.5308C32.6507 12.7105 33.3876 12.0999 34.29 11.929C35.1923 11.7582 36.1231 12.053 36.7316 12.7024C37.3401 13.3519 37.534 14.2573 37.2402 15.0776C37.2402 16.6486 37.2402 16.5761 37.2402 17.6395C37.2402 18.703 37.2402 19.6456 37.2402 20.5398C37.1465 21.9542 36.9403 23.3599 36.6233 24.7453C36.1761 25.9709 35.5535 27.1337 34.7728 28.2015C33.5249 29.5065 32.4938 30.9814 31.7144 32.5761C31.521 33.3684 31.4346 34.1804 31.4574 34.993C31.4548 35.7438 31.5585 36.4915 31.7658 37.2166C30.7149 37.321 29.6553 37.321 28.6045 37.2166C27.6021 37.0715 26.3685 35.1863 26.0344 34.6063C25.8691 34.2948 25.5307 34.098 25.1605 34.098C24.7903 34.098 24.452 34.2948 24.2867 34.6063C23.7212 35.5247 22.4619 37.1924 21.588 37.2891C19.866 37.4824 16.3193 37.2891 13.5178 37.2891C13.5178 37.2891 13.9804 34.8721 12.9267 34.0021C11.8729 33.132 10.7935 32.1169 9.99672 31.4401L7.8378 29.1199Z" stroke="currentColor" strokeWidth="0.75" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M29.6307 30.4392V22.0966C29.6307 21.5972 29.1992 21.1924 28.6669 21.1924C28.1346 21.1924 27.7031 21.5972 27.7031 22.0966V30.4392C27.7031 30.9386 28.1346 31.3434 28.6669 31.3434C29.1992 31.3434 29.6307 30.9386 29.6307 30.4392Z" fill="currentColor"/>
          <path d="M24.5454 30.4362L24.494 22.0892C24.4909 21.5911 24.0569 21.1895 23.5247 21.1924C22.9924 21.1953 22.5634 21.6014 22.5664 22.0996L22.6178 30.4466C22.6209 30.9448 23.0549 31.3463 23.5872 31.3434C24.1194 31.3405 24.5485 30.9344 24.5454 30.4362Z" fill="currentColor"/>
          <path d="M17.4258 22.1084L17.4772 30.4381C17.4803 30.941 17.9143 31.3463 18.4466 31.3434C18.9789 31.3405 19.4079 30.9304 19.4048 30.4274L19.3534 22.0978C19.3503 21.5948 18.9162 21.1895 18.384 21.1924C17.8517 21.1953 17.4227 21.6054 17.4258 22.1084Z" fill="currentColor"/>
        </svg>
      )
    },
    {
      id: "growth",
      label: "Growth",
      value: "+3.2%",
      icon: (
        <svg width="37" height="37" viewBox="0 0 37 37" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3.08203 20.0105V23.1247C3.08203 30.833 6.16536 33.9163 13.8737 33.9163H23.1237C30.832 33.9163 33.9154 30.833 33.9154 23.1247V13.8747C33.9154 6.16634 30.832 3.08301 23.1237 3.08301H13.8737C6.16536 3.08301 3.08203 6.16634 3.08203 13.8747" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M17.2204 18.5001L16.4958 17.4209L11.5625 22.3542" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M25.4362 14.6455L23.1083 16.9734L21.582 18.4997" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M22.3555 14.6455H25.4388V17.7288" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    }
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Hero Section */}
      {/* Hero Section */}
      <section>
        <div
          className="relative overflow-hidden rounded-[20px] px-8 py-8 text-white transition-all duration-500"
        >
          {/* Hero Image */}
          {hero.backgroundImage && (
            <img
              src={hero.backgroundImage}
              alt="Hero background"
              className={`absolute inset-0 rounded-[20px]  w-full object-cover transition-opacity duration-500 ${
                imageLoaded ? "opacity-100" : "opacity-0"
              }`}
              loading="eager"
              fetchPriority="high"
              onLoad={() => setImageLoaded(true)}
            />
          )}
          {/* Software Mobile Image */}

          <div className="relative z-10 flex flex-col">
            <h1 className="text-3xl md:text-4xl py-8 lg:text-5xl font-bold leading-tight transition-opacity duration-500 max-w-2xl">
              Let's <br />Get Started
            </h1>

          </div>
        </div>
      </section>

      {/* Statistics Cards - App Dashboard Style */}
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className={`${cardClass} flex flex-col gap-2 px-4 py-7`}
          >
            <div className="flex items-center gap-3">
              <div 
                className={`flex items-center justify-center rounded-full p-2 ${tokens.isDark ? "bg-[var(--color-icon-surface)]" : ""}`}
                style={tokens.isDark ? {} : { backgroundColor: bgColor }}
              >
                <div style={{ color: tokens.isDark ? "white" : primaryColor }}>
                  {stat.icon}
                </div>
              </div>
              <div>
                <p className="text-sm md:text-base font-medium text-[#A3AED0]">{stat.label}</p>
                <p className={`text-2xl mt-2 font-bold ${tokens.isDark ? "text-white" : "text-[#2B3674]"}`}>{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Charts Section - Placeholder */}
      <section className="grid gap-6 lg:grid-cols-2">
        <div className={`${cardClass}`}>
          <h3 className={`text-lg font-bold mb-4 ${tokens.isDark ? 'text-white' : 'text-[#2B3674]'}`}>
            Campaign Performance
          </h3>
          <div className="flex items-center justify-center h-64">
            <p className={`text-center ${tokens.isDark ? 'text-white/70' : 'text-[#A3AED0]'}`}>
              تحت الإنشاء
            </p>
          </div>
        </div>

        <div className={`${cardClass}`}>
          <h3 className={`text-lg font-bold mb-4 ${tokens.isDark ? 'text-white' : 'text-[#2B3674]'}`}>
            Social Media Insights
          </h3>
          <div className="flex items-center justify-center h-64">
            <p className={`text-center ${tokens.isDark ? 'text-white/70' : 'text-[#A3AED0]'}`}>
              تحت الإنشاء
            </p>
          </div>
        </div>
      </section>

      {/* Additional Section - Placeholder */}
      <section>
        <div className={`${cardClass}`}>
          <h3 className={`text-lg font-bold mb-4 ${tokens.isDark ? 'text-white' : 'text-[#2B3674]'}`}>
            Recent Activities
          </h3>
          <div className="flex items-center justify-center h-32">
            <p className={`text-center ${tokens.isDark ? 'text-white/70' : 'text-[#A3AED0]'}`}>
              تحت الإنشاء
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
