import { createClient, type Client } from "@libsql/client";

// Uses libSQL, a SQLite-compatible engine. Locally it writes to a plain
// SQLite file (local.db). In production, point it at a free Turso database
// (hosted libSQL) so data survives Vercel's ephemeral/read-only filesystem —
// a raw better-sqlite3 file would be wiped on every serverless cold start
// because Vercel functions don't persist local disk writes across invocations.
let client: Client | undefined;

export function getDb(): Client {
  if (client) return client;

  const url = process.env.TURSO_DATABASE_URL || "file:local.db";
  const authToken = process.env.TURSO_AUTH_TOKEN;

  client = createClient(
    url.startsWith("file:") ? { url } : { url, authToken }
  );

  return client;
}
