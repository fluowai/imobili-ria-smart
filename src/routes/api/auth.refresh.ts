import { createFileRoute } from "@tanstack/react-router";

import { rotateSession, signAccessToken } from "@/lib/auth.server";
import { accessCookie, cookieNames, parseCookies, refreshCookie } from "@/lib/auth-cookies";
import { db, schema } from "@/lib/db.server";
import { eq } from "drizzle-orm";

export const Route = createFileRoute("/api/auth/refresh")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const cookies = parseCookies(request.headers.get("cookie"));
        const rt = cookies[cookieNames.refresh];
        if (!rt) return Response.json({ error: "sem refresh" }, { status: 401 });

        try {
          const { refreshToken, sessionId } = await rotateSession(rt);
          // recuperar user para claims
          const [session] = await db.select().from(schema.sessions).where(eq(schema.sessions.id, sessionId));
          const [user] = await db.select().from(schema.users).where(eq(schema.users.id, session.userId));
          const access = signAccessToken({ sub: user.id, email: user.email });
          const headers = new Headers({ "content-type": "application/json" });
          headers.append("set-cookie", accessCookie(access));
          headers.append("set-cookie", refreshCookie(refreshToken));
          return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
        } catch {
          return Response.json({ error: "refresh inválido" }, { status: 401 });
        }
      },
    },
  },
});
