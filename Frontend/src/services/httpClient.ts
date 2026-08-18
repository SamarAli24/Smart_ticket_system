const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "https://localhost:7276/api";

export class ApiError extends Error {
  status: number;
  code?: number;

  constructor(status: number, message: string, code?: number) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

// Set by AuthContext after login so every subsequent request carries the JWT.
let authToken: string | null = null;
export const authTokenStore = {
  set: (token: string | null) => {
    authToken = token;
  },
  get: () => authToken,
};

// Set by AuthContext to react to a session that the server has revoked (401 on a protected call).
let unauthorizedHandler: (() => void) | null = null;
export function setUnauthorizedHandler(handler: (() => void) | null) {
  unauthorizedHandler = handler;
}

// The backend wraps every response in a Result envelope:
// { statusCode, success, message, count, data, error: { code, message } | null }.
// ASP.NET's built-in [ApiController] model-validation errors bypass that envelope and use
// the standard ValidationProblemDetails shape ({ title, errors }) instead, so both are handled here.
interface ResultEnvelope<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: { code: number; message: string } | null;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (authToken) headers.Authorization = `Bearer ${authToken}`;

  const response = await fetch(`${API_BASE_URL}${path}`, { headers, ...options });

  if (response.status === 204) return undefined as T;

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401 && path !== "/auth/login") {
      unauthorizedHandler?.();
    }
    const message =
      body?.error?.message ?? body?.message ?? body?.title ?? response.statusText;
    throw new ApiError(response.status, message, body?.error?.code);
  }

  const envelope = body as ResultEnvelope<T> | null;
  return (envelope && "data" in envelope ? envelope.data : body) as T;
}

export const httpClient = {
  get: <T>(path: string) => request<T>(path),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, { method: "PATCH", body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
