import axios from "axios";

// Build baseURL using Vite env variables if provided. This allows setting
// company/app slugs via environment for multi-tenant requests.

// Build baseURL using Vite env variables OR extract slugs directly from
// the browser URL path. The frontend must be accessed under a path that
// includes the company and app slug in the first two segments so we can
// derive them automatically (e.g. https://fe-host/<company>/<app>/admin/...)
const API_HOST = import.meta.env.VITE_API_HOST || "http://localhost:4000";
const ENV_COMPANY = import.meta.env.VITE_COMPANY_SLUG || "";
const ENV_APP = import.meta.env.VITE_APP_SLUG || "";

// Try to extract slugs from the browser location first. We expect the
// frontend to be accessed like: /<company>/<app>/... so the first two
// pathname segments are company and app.
let companyFromPath = "";
let appFromPath = "";
try {
  const parts = window.location.pathname.split("/").filter(Boolean);
  if (parts.length >= 2) {
    companyFromPath = parts[0];
    appFromPath = parts[1];
  }
} catch (e) {
  // window may not be available in some test environments - ignore
}

// Prefer slugs from the browser URL (as user requested). Fall back to env vars.
const COMPANY = companyFromPath || ENV_COMPANY;
const APP = appFromPath || ENV_APP;

let baseURL = `${API_HOST}/api`;
if (COMPANY && APP) {
  baseURL = `${API_HOST}/api/${COMPANY}/${APP}`;
} else if (COMPANY && !APP) {
  baseURL = `${API_HOST}/api/${COMPANY}`;
}

const instance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
  // Ensure cookies (JWT token from backend) are sent with requests
  withCredentials: true,
});

// Request interceptor
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/admin/register";
    }
    return Promise.reject(error);
  }
);

export default instance;
