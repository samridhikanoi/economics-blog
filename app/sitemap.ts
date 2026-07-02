import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();

  return [
    { url: siteUrl, lastModified: new Date() },
    { url: `${siteUrl}/about`, lastModified: new Date() },
    ...posts.map((post) => ({
      url: `${siteUrl}/post/${post.slug}`,
      lastModified: new Date(post.published_at),
    })),
  ];
}
