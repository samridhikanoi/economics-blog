import { notFound } from "next/navigation";
import { cookies } from "next/headers";
import type { Metadata } from "next";
import { marked } from "marked";
import { getPostBySlug, incrementViewCount, hasVoterLiked } from "@/lib/posts";
import LikeButton from "@/components/LikeButton";

export const dynamic = "force-dynamic";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  if (!post) return {};

  return {
    title: post.title,
    description: post.excerpt,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: "article",
      publishedTime: post.published_at,
      authors: [post.author],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(params.slug);
  if (!post) notFound();

  // Server-side view increment: runs once per request to this page, so the
  // count reflects real page loads rather than a client-side ping that could
  // be skipped or duplicated by ad blockers / bots.
  const views = await incrementViewCount(post.slug);

  const voterId = cookies().get("voter_id")?.value;
  const liked = voterId ? await hasVoterLiked(post.id, voterId) : false;

  const html = marked.parse(post.content) as string;

  return (
    <article className="mx-auto max-w-3xl px-4 py-10">
      <header className="mb-8">
        <h1 className="font-serif text-4xl font-bold leading-tight text-ink">
          {post.title}
        </h1>
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted">
          <span className="font-medium text-ink">By {post.author}</span>
          <span aria-hidden="true">&middot;</span>
          <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
          <span aria-hidden="true">&middot;</span>
          <span>{views.toLocaleString()} views</span>
        </div>
      </header>

      <div
        className="prose prose-neutral max-w-none prose-p:leading-relaxed prose-headings:font-serif"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      <div className="mt-10 pt-6 border-t border-black/10">
        <LikeButton slug={post.slug} initialLikes={post.likes} initialLiked={liked} />
      </div>
    </article>
  );
}
