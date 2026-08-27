export const BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const APP_URL = BASE_URL.replace(/\/api\/?$/, "");
