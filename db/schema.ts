import { pgTable, uuid, text, timestamp, pgEnum, uniqueIndex, index } from "drizzle-orm/pg-core";

// Roles globais e por imobiliária
export const appRoleEnum = pgEnum("app_role", [
  "super_admin",
  "admin_imob",
  "corretor",
  "cliente",
]);

// Usuários
export const users = pgTable(
  "users",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    email: text("email").notNull(),
    passwordHash: text("password_hash").notNull(),
    nome: text("nome").notNull(),
    avatarUrl: text("avatar_url"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    emailIdx: uniqueIndex("users_email_idx").on(t.email),
  }),
);

// Sessões (refresh tokens rotativos)
export const sessions = pgTable(
  "sessions",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    refreshTokenHash: text("refresh_token_hash").notNull(),
    userAgent: text("user_agent"),
    ip: text("ip"),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userIdx: index("sessions_user_idx").on(t.userId),
  }),
);

// Imobiliárias (tenants)
export const imobiliarias = pgTable("imobiliarias", {
  id: uuid("id").primaryKey().defaultRandom(),
  nome: text("nome").notNull(),
  slug: text("slug").notNull().unique(),
  cnpj: text("cnpj"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

// Vínculo user <-> imobiliária com role
export const memberships = pgTable(
  "memberships",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    imobiliariaId: uuid("imobiliaria_id")
      .notNull()
      .references(() => imobiliarias.id, { onDelete: "cascade" }),
    role: appRoleEnum("role").notNull().default("corretor"),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    unq: uniqueIndex("memberships_user_imob_idx").on(t.userId, t.imobiliariaId),
  }),
);

// Roles globais (super_admin da plataforma)
export const userRoles = pgTable(
  "user_roles",
  {
    id: uuid("id").primaryKey().defaultRandom(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    role: appRoleEnum("role").notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    unq: uniqueIndex("user_roles_user_role_idx").on(t.userId, t.role),
  }),
);
