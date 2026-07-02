import Link from "next/link";
import type { PostWithLikes } from "@/lib/types";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function PostCard({ post }: { post: PostWithLikes }) {
  return (
    <article className="py-7 border-b border-black/10 last:border-b-0">
      <Link href={`/post/${post.slug}`} className="group block">
        <h2 className="font-serif text-2xl font-bold text-ink group-hover:text-accent transition-colors">
          {post.title}
        </h2>
        <p className="mt-2 text-muted leading-relaxed">{post.excerpt}</p>
        <div className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted">
          <span>By {post.author}</span>
          <span aria-hidden="true">&middot;</span>
          <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
          <span aria-hidden="true">&middot;</span>
          <span>{post.views.toLocaleString()} views</span>
          <span aria-hidden="true">&middot;</span>
          <span>{post.likes.toLocaleString()} likes</span>
        </div>
      </Link>
    </article>
  );
}
