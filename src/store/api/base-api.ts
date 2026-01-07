import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const BASE_URL = "https://back.codgoo.com/codgoo/public/api/client/";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      // Get token from localStorage
      const token = localStorage.getItem("auth_token");
      
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      } else {
        console.warn("No auth token found in localStorage");
      }
      
      headers.set("Accept", "application/json");
      headers.set("API-Password", "Nf:upZTg^7A?Hj");
      headers.set("Accept-Language", localStorage.getItem("locale") || "en");
      
      return headers;
    },
  }),
  tagTypes: ["Projects", "Meetings", "Dashboard", "ClientEmails", "PaymentMethods"], // Add your cache tags here as needed
  endpoints: () => ({}), // Endpoints will be injected from feature slices
});

export const {} = baseApi;
