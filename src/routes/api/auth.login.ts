import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import {
  createSession,
  findUserByEmail,
  signAccessToken,
  verifyPassword,
} from "@/lib/auth.server";
import { accessCookie, refreshCookie } from "@/lib/auth-cookies";

const Body = z.object({ email: z.string().email(), password: z.string().min(1) });

export const Route = createFileRoute("/api/auth/login")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const parsed = Body.safeParse(await request.json().catch(() => null));
        if (!parsed.success) return Response.json({ error: "Dados inválidos" }, { status: 400 });

        const user = await findUserByEmail(parsed.data.email);
        if (!user || !(await verifyPassword(parsed.data.password, user.passwordHash))) {
          return Response.json({ error: "Credenciais inválidas" }, { status: 401 });
        }
        const access = signAccessToken({ sub: user.id, email: user.email });
        const { refreshToken } = await createSession(user.id, {
          ip: request.headers.get("x-forwarded-for") ?? undefined,
          userAgent: request.headers.get("user-agent") ?? undefined,
        });
        const headers = new Headers({ "content-type": "application/json" });
        headers.append("set-cookie", accessCookie(access));
        headers.append("set-cookie", refreshCookie(refreshToken));
        return new Response(
          JSON.stringify({ user: { id: user.id, email: user.email, nome: user.nome } }),
          { status: 200, headers },
        );
      },
    },
  },
});
