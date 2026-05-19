const API_BASE = "http://3.38.165.56:8080";

/**
 * Ensures a profile image URL is absolute.
 * If the server returns a relative path (e.g. "/uploads/xxx.jpg"),
 * prepend the API base so React Native can load it.
 * Returns null for empty / null input so callers can fall back to a placeholder.
 */
export function normalizeImageUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${API_BASE}${url.startsWith("/") ? url : `/${url}`}`;
}
