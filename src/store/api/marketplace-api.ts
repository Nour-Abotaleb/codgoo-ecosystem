import { baseApi } from "./base-api";

export interface MarketplaceApp {
  id: number;
  name: string;
  type: "General" | "Master";
  category: string;
  description: string;
  appDetails: {
    appUrl: string;
    ssoEntrypoint: string;
  };
  price: {
    amount: number;
    currency: string;
  };
  rating: {
    average: number;
    scale: number;
    reviewsCount: number;
  };
  icon: {
    type: string;
    url: string;
    alt: string | null;
  };
}

export interface BusinessApp {
  id: number;
  name: string;
  slug: string;
  description: string;
  is_active: number;
  created_at: string;
  updated_at: string;
}

export interface MarketplaceResponse {
  status: boolean;
  services: MarketplaceApp[];
  business_apps: BusinessApp[];
}

export interface ApplicationApp {
  id: number;
  name: string;
  slug: string;
  type: string;
  category: string;
  description: string;
  isExternal: number;
  price: {
    amount: number;
    currency: string;
  };
  rating: {
    average: number;
    scale: number;
  };
  reviewsCount: number;
  icon: {
    type: string;
    url: string;
    alt: string | null;
  };
  launchUrl: string;
  subscriptionExpiresAt: string;
  bundlePrice: number;
  bundlePriceCurrency: string;
}

export interface ApplicationsResponse {
  status: boolean;
  data: ApplicationApp[];
}

export interface PackagePrice {
  id: number;
  name: string;
  amount: number;
  currency: string;
  duration_days: number;
}

export interface PackageBundle {
  id: number;
  apps_count: number;
  name: string;
  tagline: string;
  features: string; // JSON string array
  savings: {
    percentage: number;
    text: string;
  };
  prices: PackagePrice[];
  badges: string; // JSON string array
}

export interface PackagesResponse {
  data: PackageBundle[];
}

export interface BuildBundleRequest {
  bundleId: number;
  priceId: number;
  customer: {
    id: number;
  };
  applications: number[];
}

export interface BuildBundleResponse {
  status: boolean;
  message?: string;
  data?: any;
}

export interface UploadAttachmentRequest {
  bundleId: number;
  attachment: File;
}

export interface UploadAttachmentResponse {
  status: boolean;
  message?: string;
  data?: any;
}

export interface AttachAppRequest {
  bundleId: number;
  applications: number[];
}

export interface AttachAppResponse {
  status: boolean;
  message?: string;
  data?: any;
}

export interface UpgradeBundleRequest {
  bundleId: number;
  applications: number[];
}

export interface UpgradeBundleResponse {
  status: boolean;
  message?: string;
  data?: any;
}

export const marketplaceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMarketplaceApps: builder.query<MarketplaceResponse, void>({
      query: () => ({
        url: "Marketplace/ServicesApps",
        method: "GET",
      }),
      transformResponse: (response: MarketplaceResponse): MarketplaceResponse => {
        console.log("API Response received:", response);
        return {
          status: response.status,
          services: response.services || [],
          business_apps: response.business_apps || [],
        };
      },
      transformErrorResponse: (response) => {
        console.error("API Error:", response);
        return response;
      },
    }),
    getMarketplacePackages: builder.query<PackagesResponse, void>({
      query: () => "Marketplace/packages",
    }),
    getApplications: builder.query<ApplicationsResponse, void>({
      query: () => "Marketplace/applications",
      transformResponse: (response: {
        status: boolean;
        data: Array<{
          id: number;
          name: string;
          slug: string;
          type: string;
          category: string;
          description: string;
          is_external: number;
          price_amount: number;
          price_currency: string;
          rating_average: number;
          rating_scale: number;
          reviews_count: number;
          icon_type: string;
          icon_url: string;
          icon_alt: string | null;
          launch_url: string;
          subscription_expires_at: string;
          bundle_price: number;
          bundle_price_currency: string;
        }>;
      }): ApplicationsResponse => ({
        status: response.status,
        data: response.data.map((app) => ({
          id: app.id,
          name: app.name,
          slug: app.slug,
          type: app.type,
          category: app.category,
          description: app.description,
          isExternal: app.is_external,
          price: {
            amount: app.price_amount,
            currency: app.price_currency,
          },
          rating: {
            average: app.rating_average,
            scale: app.rating_scale,
          },
          reviewsCount: app.reviews_count,
          icon: {
            type: app.icon_type,
            url: app.icon_url,
            alt: app.icon_alt,
          },
          launchUrl: app.launch_url,
          subscriptionExpiresAt: app.subscription_expires_at,
          bundlePrice: app.bundle_price,
          bundlePriceCurrency: app.bundle_price_currency,
        })),
      }),
    }),
    buildBundle: builder.mutation<BuildBundleResponse, BuildBundleRequest>({
      query: (body) => ({
        url: "Marketplace/BuildBundle",
        method: "POST",
        body,
      }),
    }),
    uploadBundleAttachment: builder.mutation<UploadAttachmentResponse, UploadAttachmentRequest>({
      query: ({ bundleId, attachment }) => {
        const formData = new FormData();
        formData.append("attachment", attachment);
        
        return {
          url: `Marketplace/custom-bundles/${bundleId}/upload-attachment`,
          method: "POST",
          body: formData,
        };
      },
    }),
    attachAppToBundle: builder.mutation<AttachAppResponse, AttachAppRequest>({
      query: ({ bundleId, applications }) => ({
        url: `Marketplace/bundles/${bundleId}/attach-apps`,
        method: "POST",
        body: { applications },
      }),
    }),
    upgradeBundle: builder.mutation<UpgradeBundleResponse, { currentBundleId: number; upgradeBundleId: number; applications: number[] }>({
      query: ({ currentBundleId, upgradeBundleId, applications }) => ({
        url: `Marketplace/bundle/${currentBundleId}`,
        method: "PATCH",
        body: {
          bundleId: upgradeBundleId,
          applications,
        },
      }),
    }),
  }),
});

export const { 
  useGetMarketplaceAppsQuery, 
  useGetMarketplacePackagesQuery, 
  useGetApplicationsQuery,
  useBuildBundleMutation,
  useUploadBundleAttachmentMutation,
  useAttachAppToBundleMutation,
  useUpgradeBundleMutation
} = marketplaceApi;
