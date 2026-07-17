import { createFileRoute } from "@tanstack/react-router";

import { revokeSession } from "@/lib/auth.server";
import { clearCookie, cookieNames, parseCookies } from "@/lib/auth-cookies";

export const Route = createFileRoute("/api/auth/logout")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const cookies = parseCookies(request.headers.get("cookie"));
        const rt = cookies[cookieNames.refresh];
        if (rt) {
          const [sid] = rt.split(".");
          if (sid) await revokeSession(sid).catch(() => {});
        }
        const headers = new Headers({ "content-type": "application/json" });
        headers.append("set-cookie", clearCookie(cookieNames.access, "/"));
        headers.append("set-cookie", clearCookie(cookieNames.refresh, "/api/auth"));
        return new Response(JSON.stringify({ ok: true }), { status: 200, headers });
      },
    },
  },
});
