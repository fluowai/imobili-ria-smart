import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";

import { verifyAccessToken } from "@/lib/auth.server";
import { cookieNames, parseCookies } from "@/lib/auth-cookies";
import { db, schema } from "@/lib/db.server";

export const Route = createFileRoute("/api/auth/me")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const cookies = parseCookies(request.headers.get("cookie"));
        const token = cookies[cookieNames.access];
        if (!token) return Response.json({ user: null }, { status: 200 });
        try {
          const claims = verifyAccessToken(token);
          const [user] = await db
            .select({ id: schema.users.id, email: schema.users.email, nome: schema.users.nome })
            .from(schema.users)
            .where(eq(schema.users.id, claims.sub));
          return Response.json({ user: user ?? null });
        } catch {
          return Response.json({ user: null }, { status: 200 });
        }
      },
    },
  },
});
