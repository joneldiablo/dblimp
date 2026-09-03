const ASSETS_PREFIX = "/assets";
const PUBLIC_FILES_PREFIX = "/files/public";

const appendPath = (lhs: string, rhs: string) => {
  if (!lhs) return rhs;
  if (!rhs) return lhs;

  const lhsHasSlash = lhs.endsWith("/");
  const rhsHasSlash = rhs.startsWith("/");

  if (lhsHasSlash && rhsHasSlash) {
    const trimmedRhs = rhs.replace(/^\/+/, "");
    return trimmedRhs ? `${lhs}${trimmedRhs}` : lhs;
  }

  if (!lhsHasSlash && !rhsHasSlash) {
    return `${lhs}/${rhs}`;
  }

  return `${lhs}${rhs}`;
};

const resolveString = (input: string) => {
  const env = (process.env.REACT_APP_ENV ?? "").trim().toLowerCase();
  if (env !== "prod") return input;
  if (!input.startsWith(ASSETS_PREFIX)) return input;

  const api = process.env.REACT_APP_API?.trim();
  if (!api) return input;

  const withPublic = appendPath(api, PUBLIC_FILES_PREFIX);
  return appendPath(withPublic, input.slice(ASSETS_PREFIX.length));
};

const isRecord = (
  value: unknown
): value is Record<string, string | undefined> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

/**
 * Rewrites `/assets` URLs so production builds hit the backend public files
 * endpoint. Non-string values are returned untouched.
 */
export const resolveSrc = (
  value: string | Record<string, string | undefined> | null | undefined
): string | Record<string, string | undefined> | null | undefined => {
  if (!value) return value;

  if (typeof value === "string") {
    return resolveString(value);
  }

  if (!isRecord(value)) return value;

  let mutated = false;
  const result: Record<string, string | undefined> = {};

  for (const [key, current] of Object.entries(value)) {
    if (typeof current !== "string") {
      result[key] = current;
      continue;
    }

    const resolved = resolveString(current);
    if (resolved !== current) mutated = true;
    result[key] = resolved;
  }

  return mutated ? result : value;
};