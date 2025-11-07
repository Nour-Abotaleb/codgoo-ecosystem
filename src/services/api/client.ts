const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "https://api.example.com";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type RequestOptions = Omit<RequestInit, "method"> & {
  readonly query?: Record<string, string | number | boolean>;
};

const serializeQuery = (query: RequestOptions["query"]) =>
  query
    ? `?${new URLSearchParams(
        Object.entries(query).map(([key, value]) => [key, String(value)]),
      ).toString()}`
    : "";

async function request<TResponse>(
  method: HttpMethod,
  endpoint: string,
  options: RequestOptions = {},
): Promise<TResponse> {
  const { query, headers, body, ...rest } = options;

  const response = await fetch(
    `${API_BASE_URL}${endpoint}${serializeQuery(query)}`,
    {
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
      body: body instanceof FormData ? body : body ?? undefined,
      ...rest,
    },
  );

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const contentType = response.headers.get("content-type");

  if (contentType?.includes("application/json")) {
    return (await response.json()) as TResponse;
  }

  return (await response.text()) as TResponse;
}

export const apiClient = {
  get: <TResponse>(endpoint: string, options?: RequestOptions) =>
    request<TResponse>("GET", endpoint, options),
  post: <TResponse>(
    endpoint: string,
    options?: RequestOptions & { readonly body?: unknown },
  ) => request<TResponse>("POST", endpoint, options),
};

