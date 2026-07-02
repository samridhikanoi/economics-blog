import { insertPost } from "../lib/posts";
import { seedPosts } from "./seed-data";

// Safe to re-run: insertPost upserts on slug, so this can also be used
// as the pattern for adding a single new post later (see README).
async function seed() {
  for (const post of seedPosts) {
    await insertPost(post);
    console.log(`Seeded: ${post.slug}`);
  }
  console.log(`Done. ${seedPosts.length} posts seeded.`);
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exit(1);
  });
