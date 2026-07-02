import { getDb } from "../lib/db";

// One-off admin utility: ensures every post has at least MIN_VIEWS views and
// MIN_LIKES likes, so a freshly-launched blog doesn't show "0" everywhere.
// Only ever raises counts, never lowers real ones already above the floor.
const MIN_VIEWS = 100;
const MIN_LIKES = 40;

async function padMetrics() {
  const db = getDb();
  const posts = await db.execute(`SELECT id, slug, views FROM posts`);

  for (const row of posts.rows as unknown as { id: number; slug: string; views: number }[]) {
    if (row.views < MIN_VIEWS) {
      await db.execute({
        sql: `UPDATE posts SET views = ? WHERE id = ?`,
        args: [MIN_VIEWS, row.id],
      });
    }

    const likeCountResult = await db.execute({
      sql: `SELECT COUNT(*) AS count FROM likes WHERE post_id = ?`,
      args: [row.id],
    });
    const currentLikes = Number((likeCountResult.rows[0] as unknown as { count: number }).count);

    if (currentLikes < MIN_LIKES) {
      const needed = MIN_LIKES - currentLikes;
      for (let i = 0; i < needed; i++) {
        await db.execute({
          sql: `INSERT OR IGNORE INTO likes (post_id, voter_id, created_at) VALUES (?, ?, ?)`,
          args: [row.id, `seed-${row.id}-${currentLikes + i}`, new Date().toISOString()],
        });
      }
    }

    console.log(`${row.slug}: views>=${MIN_VIEWS}, likes>=${MIN_LIKES}`);
  }

  console.log("Done.");
}

padMetrics()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Failed:", err);
    process.exit(1);
  });
