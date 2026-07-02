import { getDb } from "./db";
import type { Post, PostWithLikes } from "./types";

export async function getAllPosts(): Promise<PostWithLikes[]> {
  const db = getDb();
  const result = await db.execute(`
    SELECT p.*, COALESCE(l.like_count, 0) AS likes
    FROM posts p
    LEFT JOIN (
      SELECT post_id, COUNT(*) AS like_count FROM likes GROUP BY post_id
    ) l ON l.post_id = p.id
    ORDER BY p.published_at DESC
  `);
  return result.rows as unknown as PostWithLikes[];
}

export async function getPostBySlug(slug: string): Promise<PostWithLikes | null> {
  const db = getDb();
  const result = await db.execute({
    sql: `
      SELECT p.*, COALESCE(l.like_count, 0) AS likes
      FROM posts p
      LEFT JOIN (
        SELECT post_id, COUNT(*) AS like_count FROM likes GROUP BY post_id
      ) l ON l.post_id = p.id
      WHERE p.slug = ?
    `,
    args: [slug],
  });
  return (result.rows[0] as unknown as PostWithLikes) ?? null;
}

// Increments the view counter server-side, once per page render. Returns the
// updated count so the page shows a fresh number on the same request.
export async function incrementViewCount(slug: string): Promise<number> {
  const db = getDb();
  await db.execute({
    sql: `UPDATE posts SET views = views + 1 WHERE slug = ?`,
    args: [slug],
  });
  const result = await db.execute({
    sql: `SELECT views FROM posts WHERE slug = ?`,
    args: [slug],
  });
  const row = result.rows[0] as unknown as { views: number } | undefined;
  return row?.views ?? 0;
}

export async function hasVoterLiked(postId: number, voterId: string): Promise<boolean> {
  const db = getDb();
  const result = await db.execute({
    sql: `SELECT 1 FROM likes WHERE post_id = ? AND voter_id = ?`,
    args: [postId, voterId],
  });
  return result.rows.length > 0;
}

// Toggles a like for a given voter. One voter_id (cookie-backed, falling
// back to IP) can only ever hold a single row per post thanks to the
// UNIQUE(post_id, voter_id) constraint, so repeated clicks can't inflate
// the count — they just flip like/unlike.
export async function toggleLike(
  postId: number,
  voterId: string
): Promise<{ liked: boolean; likes: number }> {
  const db = getDb();
  const already = await hasVoterLiked(postId, voterId);

  if (already) {
    await db.execute({
      sql: `DELETE FROM likes WHERE post_id = ? AND voter_id = ?`,
      args: [postId, voterId],
    });
  } else {
    await db.execute({
      sql: `INSERT OR IGNORE INTO likes (post_id, voter_id, created_at) VALUES (?, ?, ?)`,
      args: [postId, voterId, new Date().toISOString()],
    });
  }

  const countResult = await db.execute({
    sql: `SELECT COUNT(*) AS count FROM likes WHERE post_id = ?`,
    args: [postId],
  });
  const likes = Number((countResult.rows[0] as unknown as { count: number }).count);

  return { liked: !already, likes };
}

export async function insertPost(post: Omit<Post, "id" | "views">): Promise<void> {
  const db = getDb();
  await db.execute({
    sql: `
      INSERT INTO posts (slug, title, excerpt, content, author, published_at)
      VALUES (?, ?, ?, ?, ?, ?)
      ON CONFLICT(slug) DO UPDATE SET
        title = excluded.title,
        excerpt = excluded.excerpt,
        content = excluded.content,
        author = excluded.author,
        published_at = excluded.published_at
    `,
    args: [
      post.slug,
      post.title,
      post.excerpt,
      post.content,
      post.author,
      post.published_at,
    ],
  });
}
