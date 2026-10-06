// Thin fetch wrapper around the HASH '27 backend.
// Dev: VITE_API_URL is empty and Vite proxies /api + /uploads to the Express server.
const API_BASE = (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "");
const TOKEN_KEY = "hash27_admin_token";
const USER_TOKEN_KEY = "hash27_user_token";

export class ApiError extends Error {
  constructor(message, { status = 0, code = "ERROR", details = [] } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }

  /** { fieldName: "message" } for server-side validation errors */
  get fieldErrors() {
    const out = {};
    for (const d of this.details || []) if (d.field && !out[d.field]) out[d.field] = d.message;
    return out;
  }
}

function makeTokenStore(key) {
  return {
    get() {
      try {
        return window.localStorage.getItem(key);
      } catch {
        return null;
      }
    },
    set(token) {
      try {
        window.localStorage.setItem(key, token);
      } catch {
        /* storage unavailable (private mode) - session just won't persist */
      }
    },
    clear() {
      try {
        window.localStorage.removeItem(key);
      } catch {
        /* ignore */
      }
    },
  };
}

export const tokenStore = makeTokenStore(TOKEN_KEY);
export const userTokenStore = makeTokenStore(USER_TOKEN_KEY);

/** Images uploaded through the API live on the API origin; everything else is served by the frontend. */
export function assetUrl(url) {
  if (!url) return "";
  return url.startsWith("/uploads/") ? `${API_BASE}${url}` : url;
}

function toQuery(params = {}) {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null && v !== "") qs.set(k, String(v));
  }
  const s = qs.toString();
  return s ? `?${s}` : "";
}

async function send(path, { method = "GET", body, auth = false, signal } = {}) {
  const headers = { Accept: "application/json" };
  if (body !== undefined) headers["Content-Type"] = "application/json";
  const store = auth === "user" ? userTokenStore : auth ? tokenStore : null;
  if (store) {
    const token = store.get();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  let res;
  try {
    res = await fetch(`${API_BASE}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (err) {
    if (err?.name === "AbortError") throw err;
    throw new ApiError("Can't reach the server. Check your connection and try again.", { code: "NETWORK_ERROR" });
  }

  if (!res.ok) {
    let payload = null;
    try {
      payload = await res.json();
    } catch {
      /* non-JSON error body */
    }
    if (res.status === 401 && auth) {
      store?.clear();
      window.dispatchEvent(new Event(auth === "user" ? "hash27:user-unauthorized" : "hash27:unauthorized"));
    }
    const e = payload?.error;
    throw new ApiError(e?.message || `Request failed (${res.status})`, {
      status: res.status,
      code: e?.code,
      details: e?.details,
    });
  }
  return res;
}

async function json(path, opts) {
  const res = await send(path, opts);
  return res.json(); // { success, data, meta? }
}

async function download(path, filename) {
  const res = await send(path, { auth: "admin" });
  const blob = await res.blob();
  const href = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = href;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(href);
}

export const api = {
  // ---- public ----
  schedule: (signal) => json("/api/events/schedule", { signal }),
  register: (body) => json("/api/registrations", { method: "POST", body, auth: userTokenStore.get() ? "user" : false }),
  contact: (body) => json("/api/contact", { method: "POST", body }),
  team: (signal) => json("/api/team/grouped", { signal }),
  sponsors: (signal) => json("/api/sponsors/grouped", { signal }),
  gallery: (edition, signal) => json(`/api/gallery${toQuery({ edition })}`, { signal }),

  // ---- user accounts ----
  user: {
    signup: (body) => json("/api/users/signup", { method: "POST", body }),
    login: (email, password) => json("/api/users/login", { method: "POST", body: { email, password } }),
    me: (signal) => json("/api/users/me", { auth: "user", signal }),
    updateMe: (body) => json("/api/users/me", { method: "PUT", auth: "user", body }),
    changePassword: (body) => json("/api/users/change-password", { method: "POST", auth: "user", body }),
    myRegistrations: (signal) => json("/api/users/me/registrations", { auth: "user", signal }),
  },

  // ---- admin ----
  admin: {
    login: (username, password) => json("/api/auth/login", { method: "POST", body: { username, password } }),
    me: (signal) => json("/api/auth/me", { auth: "admin", signal }),
    stats: (signal) => json("/api/admin/stats", { auth: "admin", signal }),
    settings: (signal) => json("/api/settings", { signal }),
    updateSettings: (body) => json("/api/settings", { method: "PATCH", auth: "admin", body }),
    updateEvent: (id, body) => json(`/api/events/${id}`, { method: "PATCH", auth: "admin", body }),
    registrations: (params, signal) => json(`/api/registrations${toQuery(params)}`, { auth: "admin", signal }),
    updateRegistration: (id, body) => json(`/api/registrations/${id}`, { method: "PATCH", auth: "admin", body }),
    deleteRegistration: (id) => json(`/api/registrations/${id}`, { method: "DELETE", auth: "admin" }),
    exportRegistrations: (params) =>
      download(`/api/registrations/export${toQuery(params)}`, `hash27-registrations-${new Date().toISOString().slice(0, 10)}.csv`),
    messages: (params, signal) => json(`/api/contact${toQuery(params)}`, { auth: "admin", signal }),
    updateMessage: (id, status) => json(`/api/contact/${id}`, { method: "PATCH", auth: "admin", body: { status } }),
    deleteMessage: (id) => json(`/api/contact/${id}`, { method: "DELETE", auth: "admin" }),
  },
};
