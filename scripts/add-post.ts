import { insertPost } from "../lib/posts";

// Simple admin script for adding ONE new post later. Edit the object below,
// then run:  npm run db:add-post
// Re-running with the same slug safely overwrites that post's content
// (upsert on slug) without touching its existing view/like counts.
const NEW_POST = {
  slug: "your-post-slug-here",
  title: "Your Post Title Here",
  excerpt: "A one-to-two sentence summary shown on the homepage list.",
  content: `## Introduction

Write your post body here in Markdown. Use "##" for section headings,
blank lines between paragraphs, and "-" for bullet lists.
`,
  author: "Samridhi Kanoi",
  published_at: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
};

insertPost(NEW_POST)
  .then(() => {
    console.log(`Saved post: ${NEW_POST.slug}`);
    process.exit(0);
  })
  .catch((err) => {
    console.error("Failed to save post:", err);
    process.exit(1);
  });
