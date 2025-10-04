// src/db.ts
import { neon } from "@neondatabase/serverless";

export function getDb(env) {
  if (!env?.NEON_DATABASE_URL) {
    throw new Error(
      "NEON_DATABASE_URL is missing. In dev, create .dev.vars. In prod, use `wrangler secret put`."
    );
  }
  return neon(env.NEON_DATABASE_URL);
}
