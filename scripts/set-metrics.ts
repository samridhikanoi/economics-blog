import { getDb } from "../lib/db";

// One-off admin utility: sets a distinct, organic-looking view/like count per
// post instead of a flat number across every post. Re-runnable — it wipes
// only its own seed-* like rows before topping back up to the target, so it
// never touches genuine visitor likes.
const TARGETS: Record<string, { views: number; likes: number }> = {
  "global-inflation-trends-central-bank-responses": { views: 842, likes: 67 },
  "state-of-the-us-labor-market": { views: 613, likes: 51 },
  "india-gdp-growth-macroeconomic-outlook": { views: 429, likes: 38 },
  "global-trade-and-supply-chain-shifts": { views: 356, likes: 29 },
  "cryptocurrency-and-monetary-policy": { views: 701, likes: 58 },
  "housing-market-trends": { views: 528, likes: 44 },
  "energy-prices-and-economic-ripple-effects": { views: 287, likes: 22 },
  "emerging-market-debt-risks": { views: 194, likes: 17 },
};

async function setMetrics() {
  const db = getDb();

  for (const [slug, target] of Object.entries(TARGETS)) {
    const postResult = await db.execute({
      sql: `SELECT id FROM posts WHERE slug = ?`,
      args: [slug],
    });
    const post = postResult.rows[0] as unknown as { id: number } | undefined;
    if (!post) {
      console.log(`Skipping ${slug}: not found`);
      continue;
    }

    await db.execute({
      sql: `UPDATE posts SET views = ? WHERE id = ?`,
      args: [target.views, post.id],
    });

    await db.execute({
      sql: `DELETE FROM likes WHERE post_id = ? AND voter_id LIKE 'seed-%'`,
      args: [post.id],
    });

    const realLikesResult = await db.execute({
      sql: `SELECT COUNT(*) AS count FROM likes WHERE post_id = ?`,
      args: [post.id],
    });
    const realLikes = Number((realLikesResult.rows[0] as unknown as { count: number }).count);
    const needed = Math.max(0, target.likes - realLikes);

    for (let i = 0; i < needed; i++) {
      await db.execute({
        sql: `INSERT OR IGNORE INTO likes (post_id, voter_id, created_at) VALUES (?, ?, ?)`,
        args: [post.id, `seed-${post.id}-${i}`, new Date().toISOString()],
      });
    }

    console.log(`${slug}: views=${target.views}, likes=${realLikes + needed}`);
  }

  console.log("Done.");
}

setMetrics()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Failed:", err);
    process.exit(1);
  });
