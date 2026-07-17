import { createMiddleware } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";

import { verifyAccessToken } from "./auth.server";
import { cookieNames, parseCookies } from "./auth-cookies";

export const requireAuth = createMiddleware({ type: "function" }).server(async ({ next }) => {
  const req = getRequest();
  const cookies = parseCookies(req.headers.get("cookie"));
  const token = cookies[cookieNames.access];
  if (!token) throw new Response("Unauthorized", { status: 401 });
  try {
    const claims = verifyAccessToken(token);
    return next({ context: { userId: claims.sub, email: claims.email } });
  } catch {
    throw new Response("Unauthorized", { status: 401 });
  }
});
