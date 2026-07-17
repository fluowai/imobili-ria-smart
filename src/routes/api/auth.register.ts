import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import {
  createSession,
  createUser,
  findUserByEmail,
  signAccessToken,
} from "@/lib/auth.server";
import { accessCookie, refreshCookie } from "@/lib/auth-cookies";

const Body = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  nome: z.string().min(2),
});

export const Route = createFileRoute("/api/auth/register")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const json = await request.json().catch(() => null);
        const parsed = Body.safeParse(json);
        if (!parsed.success) {
          return Response.json({ error: "Dados inválidos" }, { status: 400 });
        }
        const existing = await findUserByEmail(parsed.data.email);
        if (existing) return Response.json({ error: "Email já cadastrado" }, { status: 409 });

        const user = await createUser(parsed.data);
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
          { status: 201, headers },
        );
      },
    },
  },
});
