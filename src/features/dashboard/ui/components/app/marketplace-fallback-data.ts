import type { MarketplaceResponse } from "@/store/api/marketplace-api";

export const fallbackMarketplaceData: MarketplaceResponse = {
  data: [
    {
      id: 1,
      name: "Beepost App",
      type: "General",
      category: "Logistics",
      description: "The dedicated logistics and posting application.",
      appDetails: {
        appUrl: "http://127.0.0.1:8000/",
        ssoEntrypoint: "/sso/auth"
      },
      price: {
        amount: 110,
        currency: "EGP"
      },
      rating: {
        average: 4.9,
        scale: 5,
        reviewsCount: 1500
      },
      icon: {
        type: "image",
        url: "https://cdn.example.com/icons/review.svg",
        alt: null
      }
    },
    {
      id: 2,
      name: "worksuite",
      type: "General",
      category: "Finance",
      description: "A fast and lightweight POS system for small businesses.",
      appDetails: {
        appUrl: "https://whatsapp.codgoo.app/",
        ssoEntrypoint: "/auth/sso"
      },
      price: {
        amount: 90,
        currency: "EGP"
      },
      rating: {
        average: 4.8,
        scale: 5,
        reviewsCount: 980
      },
      icon: {
        type: "image",
        url: "https://cdn.example.com/icons/pos.svg",
        alt: null
      }
    },
    {
      id: 3,
      name: "SmartInventory",
      type: "Master",
      category: "Inventory",
      description: "Advanced inventory management with analytics and warehouse tools.",
      appDetails: {
        appUrl: "https://smartinventory.io/api",
        ssoEntrypoint: "/sso/login"
      },
      price: {
        amount: 150,
        currency: "EGP"
      },
      rating: {
        average: 4.7,
        scale: 5,
        reviewsCount: 1220
      },
      icon: {
        type: "image",
        url: "https://cdn.example.com/icons/inventory.svg",
        alt: null
      }
    },
    {
      id: 4,
      name: "FoodDash Delivery",
      type: "General",
      category: "Food Delivery",
      description: "Delivery management system for restaurants and couriers.",
      appDetails: {
        appUrl: "https://fooddash.app/api",
        ssoEntrypoint: "/v1/sso"
      },
      price: {
        amount: 105,
        currency: "EGP"
      },
      rating: {
        average: 4.6,
        scale: 5,
        reviewsCount: 860
      },
      icon: {
        type: "image",
        url: "https://cdn.example.com/icons/delivery.svg",
        alt: null
      }
    },
    {
      id: 5,
      name: "EduMaster LMS",
      type: "Master",
      category: "Education",
      description: "A modern LMS platform for academies and online tutors.",
      appDetails: {
        appUrl: "https://edumaster.io/api",
        ssoEntrypoint: "/sso/access"
      },
      price: {
        amount: 180,
        currency: "EGP"
      },
      rating: {
        average: 4.9,
        scale: 5,
        reviewsCount: 2100
      },
      icon: {
        type: "image",
        url: "https://cdn.example.com/icons/education.svg",
        alt: null
      }
    },
    {
      id: 6,
      name: "ClinicOne EMR",
      type: "General",
      category: "Healthcare",
      description: "Electronic medical records & patient management system.",
      appDetails: {
        appUrl: "https://clinicone.health/api",
        ssoEntrypoint: "/auth/sso"
      },
      price: {
        amount: 250,
        currency: "EGP"
      },
      rating: {
        average: 4.5,
        scale: 5,
        reviewsCount: 740
      },
      icon: {
        type: "image",
        url: "https://cdn.example.com/icons/health.svg",
        alt: null
      }
    },
    {
      id: 7,
      name: "FleetTrack Pro",
      type: "General",
      category: "Transport",
      description: "Fleet and vehicle tracking system with GPS integration.",
      appDetails: {
        appUrl: "https://fleettrack.pro/api",
        ssoEntrypoint: "/sso/login"
      },
      price: {
        amount: 200,
        currency: "EGP"
      },
      rating: {
        average: 4.7,
        scale: 5,
        reviewsCount: 1350
      },
      icon: {
        type: "image",
        url: "https://cdn.example.com/icons/gps.svg",
        alt: null
      }
    },
    {
      id: 8,
      name: "HotelEase PMS",
      type: "Master",
      category: "Hospitality",
      description: "A complete hotel management and reservation system.",
      appDetails: {
        appUrl: "https://hoteleaze.app/api",
        ssoEntrypoint: "/connect/sso"
      },
      price: {
        amount: 220,
        currency: "EGP"
      },
      rating: {
        average: 4.8,
        scale: 5,
        reviewsCount: 1620
      },
      icon: {
        type: "image",
        url: "https://cdn.example.com/icons/hotel.svg",
        alt: null
      }
    },
    {
      id: 9,
      name: "BusinessSuite CRM",
      type: "General",
      category: "CRM",
      description: "Powerful CRM for sales, leads, and customer engagement.",
      appDetails: {
        appUrl: "https://businesssuite.io/api",
        ssoEntrypoint: "/oauth/sso"
      },
      price: {
        amount: 130,
        currency: "EGP"
      },
      rating: {
        average: 4.8,
        scale: 5,
        reviewsCount: 1900
      },
      icon: {
        type: "image",
        url: "https://cdn.example.com/icons/crm.svg",
        alt: null
      }
    },
    {
      id: 10,
      name: "ShopStack Ecommerce",
      type: "Master",
      category: "E‑commerce",
      description: "A complete e‑commerce backend with catalog, orders, and analytics.",
      appDetails: {
        appUrl: "https://shopstack.app/api",
        ssoEntrypoint: "/sso/auth"
      },
      price: {
        amount: 160,
        currency: "EGP"
      },
      rating: {
        average: 4.9,
        scale: 5,
        reviewsCount: 2300
      },
      icon: {
        type: "image",
        url: "https://cdn.example.com/icons/shop.svg",
        alt: null
      }
    }
  ]
};
