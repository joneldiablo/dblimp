const PUBLIC_URL = process.env.PUBLIC_URL || "";

/**
 * Resolves an asset URL relative to the app's public base, mirroring the
 * pattern used by reference projects so `src="/assets/..."` works in dev and
 * when served from a sub-path.
 */
export const resolveAsset = (src: string | null | undefined): string | null => {
  if (!src) return null;
  if (/^(https?:)?\/\//.test(src) || /^data:/.test(src)) return src;
  if (src.startsWith("/")) return `${PUBLIC_URL}${src}`;
  return `${PUBLIC_URL}/${src}`;
};

/** Alias kept for parity with reference projects' `resolveSrc`. */
export const resolveSrc = resolveAsset;

export const deleteUrl = (url: string | null | undefined): string => {
  const resolved = resolveAsset(url);
  if (!resolved) return "";
  try {
    const u = new URL(resolved, window.location.origin);
    u.search = "";
    return u.toString();
  } catch {
    return resolved;
  }
};