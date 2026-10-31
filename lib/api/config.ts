export const API_BASE_URL =
  process.env.API_BASE_URL?.trim() ||
  process.env.NEXT_PUBLIC_API_URL?.trim() ||
  "http://localhost:8080";

export const isBackendConfigured = Boolean(API_BASE_URL);

