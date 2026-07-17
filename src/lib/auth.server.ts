import { randomBytes, createHash } from "node:crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { and, eq, gt, isNull } from "drizzle-orm";

import { db, schema } from "./db.server";

const ACCESS_TTL_SEC = 15 * 60; // 15 min
const REFRESH_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 dias

function getSecret(): string {
  const s = process.env.JWT_SECRET;
  if (!s || s.length < 32) throw new Error("JWT_SECRET ausente ou curto (>=32 chars)");
  return s;
}

export type AccessClaims = {
  sub: string; // userId
  email: string;
};

export function signAccessToken(claims: AccessClaims): string {
  return jwt.sign(claims, getSecret(), { expiresIn: ACCESS_TTL_SEC });
}

export function verifyAccessToken(token: string): AccessClaims {
  return jwt.verify(token, getSecret()) as AccessClaims;
}

export async function hashPassword(pw: string): Promise<string> {
  return bcrypt.hash(pw, 12);
}
export async function verifyPassword(pw: string, hash: string): Promise<boolean> {
  return bcrypt.compare(pw, hash);
}

function hashToken(t: string): string {
  return createHash("sha256").update(t).digest("hex");
}

export async function createSession(userId: string, meta: { ip?: string; userAgent?: string } = {}) {
  const raw = randomBytes(48).toString("base64url");
  const expiresAt = new Date(Date.now() + REFRESH_TTL_MS);
  const [row] = await db
    .insert(schema.sessions)
    .values({
      userId,
      refreshTokenHash: hashToken(raw),
      ip: meta.ip,
      userAgent: meta.userAgent,
      expiresAt,
    })
    .returning({ id: schema.sessions.id });
  return { sessionId: row.id, refreshToken: `${row.id}.${raw}`, expiresAt };
}

export async function rotateSession(refreshToken: string) {
  const [sid, raw] = refreshToken.split(".");
  if (!sid || !raw) throw new Error("refresh inválido");
  const [row] = await db
    .select()
    .from(schema.sessions)
    .where(and(eq(schema.sessions.id, sid), isNull(schema.sessions.revokedAt), gt(schema.sessions.expiresAt, new Date())));
  if (!row || row.refreshTokenHash !== hashToken(raw)) throw new Error("refresh inválido");

  await db.update(schema.sessions).set({ revokedAt: new Date() }).where(eq(schema.sessions.id, sid));
  return createSession(row.userId);
}

export async function revokeSession(sessionId: string) {
  await db.update(schema.sessions).set({ revokedAt: new Date() }).where(eq(schema.sessions.id, sessionId));
}

export async function findUserByEmail(email: string) {
  const [u] = await db.select().from(schema.users).where(eq(schema.users.email, email.toLowerCase()));
  return u ?? null;
}

export async function createUser(input: { email: string; password: string; nome: string }) {
  const passwordHash = await hashPassword(input.password);
  const [u] = await db
    .insert(schema.users)
    .values({ email: input.email.toLowerCase(), passwordHash, nome: input.nome })
    .returning();
  return u;
}
