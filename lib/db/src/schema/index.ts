import { pgTable, text, integer, boolean, timestamp } from "drizzle-orm/pg-core";

// better-auth tables
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  walletAddress: text("wallet_address"),
  aglTier: text("agl_tier").default("free"),
  aglCredits: integer("agl_credits").default(30),
  subscriptionExpiresAt: timestamp("subscription_expires_at"),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// App tables
export const solidityProject = pgTable("solidity_projects", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: text("name").notNull(),
  code: text("code").notNull(),
  description: text("description"),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const deployment = pgTable("deployments", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  projectId: integer("project_id").references(() => solidityProject.id, { onDelete: "cascade" }),
  chainId: integer("chain_id").notNull(),
  contractAddress: text("contract_address"),
  txHash: text("tx_hash"),
  status: text("status").notNull().default("pending"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const aglTransaction = pgTable("agl_transactions", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  userId: text("user_id").notNull().references(() => user.id, { onDelete: "cascade" }),
  txHash: text("tx_hash").notNull().unique(),
  type: text("type").notNull(),
  aglAmount: text("agl_amount").notNull(),
  creditsAdded: integer("credits_added").default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export type User = typeof user.$inferSelect;
export type Session = typeof session.$inferSelect;
export type AglTransaction = typeof aglTransaction.$inferSelect;
