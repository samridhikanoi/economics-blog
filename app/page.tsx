import { getAllPosts } from "@/lib/posts";
import PostCard from "@/components/PostCard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const posts = await getAllPosts();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-ink">
          The Economics Desk
        </h1>
        <p className="mt-2 text-muted">
          Analysis on inflation, labor markets, trade, and global
          macroeconomics — written by Samridhi Kanoi.
        </p>
      </div>

      {posts.length === 0 ? (
        <p className="text-muted">
          No posts yet. Run <code>npm run db:seed</code> to add the starter
          articles.
        </p>
      ) : (
        <div>
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
