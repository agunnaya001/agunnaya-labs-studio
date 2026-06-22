import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "@workspace/db";
import * as schema from "@workspace/db";

function buildTrustedOrigins(): string[] {
  const origins: string[] = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://localhost:8080",
  ];

  if (process.env["REPLIT_DEV_DOMAIN"]) {
    origins.push(`https://${process.env["REPLIT_DEV_DOMAIN"]}`);
  }

  if (process.env["REPLIT_DOMAINS"]) {
    for (const domain of process.env["REPLIT_DOMAINS"].split(",")) {
      const trimmed = domain.trim();
      if (trimmed) origins.push(`https://${trimmed}`);
    }
  }

  if (process.env["BETTER_AUTH_TRUSTED_ORIGINS"]) {
    for (const origin of process.env["BETTER_AUTH_TRUSTED_ORIGINS"].split(",")) {
      const trimmed = origin.trim();
      if (trimmed) origins.push(trimmed);
    }
  }

  return origins;
}

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: schema.user,
      session: schema.session,
      account: schema.account,
      verification: schema.verification,
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  trustedOrigins: buildTrustedOrigins(),
});
