import { NextRequest, NextResponse } from "next/server";
import { getPostBySlug, toggleLike } from "@/lib/posts";
import { resolveVoterId } from "@/lib/voter";

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const post = await getPostBySlug(params.slug);
  if (!post) {
    return NextResponse.json({ error: "Post not found" }, { status: 404 });
  }

  const voterId = resolveVoterId(request.cookies.get("voter_id")?.value);
  const result = await toggleLike(post.id, voterId);

  return NextResponse.json(result);
}
