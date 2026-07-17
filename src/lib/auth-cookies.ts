const ACCESS_COOKIE = "auth_token";
const REFRESH_COOKIE = "refresh_token";

function isProd() {
  return process.env.NODE_ENV === "production";
}

export function accessCookie(value: string, maxAgeSec = 15 * 60): string {
  const attrs = [
    `${ACCESS_COOKIE}=${value}`,
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAgeSec}`,
  ];
  if (isProd()) attrs.push("Secure");
  return attrs.join("; ");
}

export function refreshCookie(value: string, maxAgeSec = 30 * 24 * 60 * 60): string {
  const attrs = [
    `${REFRESH_COOKIE}=${value}`,
    "Path=/api/auth",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${maxAgeSec}`,
  ];
  if (isProd()) attrs.push("Secure");
  return attrs.join("; ");
}

export function clearCookie(name: string, path = "/"): string {
  return `${name}=; Path=${path}; Max-Age=0; HttpOnly; SameSite=Lax`;
}

export const cookieNames = { access: ACCESS_COOKIE, refresh: REFRESH_COOKIE };

export function parseCookies(header: string | null): Record<string, string> {
  const out: Record<string, string> = {};
  if (!header) return out;
  for (const part of header.split(";")) {
    const [k, ...v] = part.trim().split("=");
    if (k) out[k] = decodeURIComponent(v.join("="));
  }
  return out;
}
