import { getDb } from "../lib/db";

async function migrate() {
  const db = getDb();

  await db.execute(`
    CREATE TABLE IF NOT EXISTS posts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE NOT NULL,
      title TEXT NOT NULL,
      excerpt TEXT NOT NULL,
      content TEXT NOT NULL,
      author TEXT NOT NULL DEFAULT 'Samridhi Kanoi',
      published_at TEXT NOT NULL,
      views INTEGER NOT NULL DEFAULT 0
    )
  `);

  await db.execute(`
    CREATE TABLE IF NOT EXISTS likes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      post_id INTEGER NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
      voter_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      UNIQUE(post_id, voter_id)
    )
  `);

  await db.execute(`
    CREATE INDEX IF NOT EXISTS idx_likes_post_id ON likes(post_id)
  `);

  console.log("Migration complete: posts + likes tables ready.");
}

migrate()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Migration failed:", err);
    process.exit(1);
  });
