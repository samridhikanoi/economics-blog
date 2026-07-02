# The Economics Desk

A blog built with Next.js 14 (App Router), TypeScript, and Tailwind CSS, featuring 8 original posts on
current macroeconomic topics, authored by Samridhi Kanoi. Posts, view counts, and like counts are stored
in a real database, not hardcoded — view counts increment server-side on every page load, and likes are
deduplicated per visitor via a cookie (with an IP fallback).

## Tech stack & one important decision: the database

The brief asked for SQLite. Plain SQLite (e.g. `better-sqlite3` writing to a local `.db` file) works great
in local development, but **it will not persist on Vercel** — Vercel's serverless functions run on an
ephemeral, often read-only filesystem, so any file written in one request can vanish or be invisible to the
next request/instance.

This project uses **[libSQL](https://turso.tech/libsql)** via `@libsql/client` instead:

- libSQL is a SQLite-compatible fork — same SQL, same file format, same mental model.
- Locally, it just writes to a SQLite file (`local.db`) — zero setup, no account needed to run `npm run dev`.
- In production, it points at a **[Turso](https://turso.tech)** database — hosted libSQL, with a generous
  free tier, that persists properly across serverless invocations.

This gets you real SQLite semantics everywhere, with no code branching between environments, and no need to
adopt a heavier database like Postgres just to deploy. The tradeoff: it's an extra (free) account to create
(Turso), and you're trusting a third-party host for your data rather than a file on disk — a fair trade for
"actually works on Vercel."

**Other stack pieces:**
- **Next.js 14 App Router** — server components fetch posts and increment view counts on the server (not a
  client-side ping that bots/ad-blockers could skip).
- **Tailwind CSS** (+ `@tailwindcss/typography`) for the article typography and responsive layout.
- **`marked`** to render post content (written in Markdown) to HTML.
- **Middleware** (`middleware.ts`) assigns every visitor an anonymous `voter_id` cookie, which the like
  endpoint uses — combined with a `UNIQUE(post_id, voter_id)` database constraint — to guarantee one visitor
  can never push a post's like count up by more than 1, no matter how many times they click.

## Project structure

```
app/
  page.tsx                 Homepage — lists all posts, newest first
  post/[slug]/page.tsx     Full post page — increments views, renders content, like button
  about/page.tsx           Bio for Samridhi Kanoi
  api/posts/[slug]/like/   Like toggle endpoint
  sitemap.ts, robots.ts    SEO basics
lib/
  db.ts                    DB client (local file vs. Turso, based on env vars)
  posts.ts                 All post/like/view queries
  voter.ts                 Cookie/IP resolution for like dedup
scripts/
  migrate.ts               Creates the posts/likes tables
  seed.ts + seed-data.ts   The 8 starter posts
  add-post.ts              Admin script — edit one object, run one command, post is live
middleware.ts              Sets the anonymous voter_id cookie
```

## Running locally

Requires Node.js 18+ and npm.

```bash
npm install
npm run db:migrate   # creates the posts + likes tables in local.db
npm run db:seed      # inserts the 8 starter posts
npm run dev           # http://localhost:3000
```

No environment variables are required for local development — it automatically uses a local SQLite file.

## Adding new posts later

**Option A — one-off post (recommended for day-to-day use):**
1. Open `scripts/add-post.ts`, edit the `NEW_POST` object (slug, title, excerpt, Markdown content, date).
2. Run `npm run db:add-post`.
3. Done — it'll appear on the homepage immediately. Re-running with the same slug safely updates that
   post's content without resetting its views/likes.

**Option B — bulk/seed content:** add an entry to the array in `scripts/seed-data.ts` and run `npm run
db:seed`.

Either way this talks directly to whichever database is configured (local file, or Turso in production —
see below), so in production you'd run the command with your Turso env vars set (e.g. via `vercel env pull`
first, see Step 3 below).

---

# Deployment walkthrough (GitHub → Vercel → Turso)

This assumes you have `git` and `node` installed, and have never done this before. Run these commands from
inside the `economics-blog` project folder unless told otherwise.

## Step 1 — Push the code to GitHub

1. Create a new, empty repository on GitHub (click the **+** in the top right of github.com → **New
   repository**). Name it e.g. `economics-blog`. Do **not** initialize it with a README/gitignore — you
   already have those.
2. Back in your terminal:

   ```bash
   git init
   git add .
   git commit -m "Initial commit: economics blog"
   git branch -M main
   git remote add origin https://github.com/<your-username>/economics-blog.git
   git push -u origin main
   ```

   Replace `<your-username>` with your actual GitHub username. If prompted to log in, follow GitHub's
   device/browser login flow.

## Step 2 — Create your free Turso database

1. Install the Turso CLI:
   ```bash
   curl -sSfL https://get.tur.so/install.sh | bash
   ```
   (On Windows, use WSL, or see https://docs.turso.tech/cli/installation for alternatives.)
2. Sign up / log in (opens a browser):
   ```bash
   turso auth signup
   ```
3. Create the database:
   ```bash
   turso db create economics-blog
   ```
4. Get the connection URL:
   ```bash
   turso db show economics-blog --url
   ```
   Copy this — it looks like `libsql://economics-blog-<yourname>.turso.io`.
5. Create an auth token:
   ```bash
   turso db tokens create economics-blog
   ```
   Copy this long string too — you won't be able to see it again (you can always create a new one if you
   lose it).
6. Create the tables on this remote database (run locally, pointing at Turso):
   ```bash
   TURSO_DATABASE_URL="libsql://<paste-your-url>" TURSO_AUTH_TOKEN="<paste-your-token>" npm run db:migrate
   TURSO_DATABASE_URL="libsql://<paste-your-url>" TURSO_AUTH_TOKEN="<paste-your-token>" npm run db:seed
   ```
   This creates the schema and inserts the 8 starter posts directly into your production database.

## Step 3 — Deploy to Vercel

1. Install the Vercel CLI and log in:
   ```bash
   npm install -g vercel
   vercel login
   ```
2. From inside the `economics-blog` folder, deploy:
   ```bash
   vercel
   ```
   Answer the prompts: link to a new project, accept the defaults (it auto-detects Next.js).
3. Add your database credentials as environment variables. Easiest via the CLI:
   ```bash
   vercel env add TURSO_DATABASE_URL production
   # paste the libsql://... URL when prompted

   vercel env add TURSO_AUTH_TOKEN production
   # paste the token when prompted
   ```
   (You can also do this in the Vercel dashboard: your project → **Settings** → **Environment Variables**.)

   Optionally also set `NEXT_PUBLIC_SITE_URL` (production) to your final Vercel URL (e.g.
   `https://economics-blog.vercel.app`) — this is used for sitemap/Open Graph URLs. You can add it after
   Step 4 once you know the URL, then redeploy.

4. Deploy to production:
   ```bash
   vercel --prod
   ```
   Vercel will print your live URL, e.g. `https://economics-blog.vercel.app` — that's your public site.

## Step 4 (optional but recommended) — connect GitHub for automatic deploys

If you deployed via the CLI above, link the project to your GitHub repo so every `git push` auto-deploys:
1. Go to https://vercel.com/dashboard → your project → **Settings** → **Git**.
2. Click **Connect Git Repository**, choose the `economics-blog` repo you pushed in Step 1.
3. From now on, `git push` to `main` automatically triggers a new deployment — no need to run `vercel
   --prod` manually again.

## Adding a post after you're live

Run the add-post command with your Turso credentials pointed at production (same as Step 2.6):
```bash
TURSO_DATABASE_URL="libsql://<your-url>" TURSO_AUTH_TOKEN="<your-token>" npm run db:add-post
```
It'll appear on the live site immediately — no redeploy needed, since posts are read from the database on
every request.

## Costs

Both Vercel's Hobby plan and Turso's free tier are free for a project at this scale (personal blog traffic).
Turso's free tier includes a generous request and storage allowance well beyond what a blog like this would
use; Vercel's Hobby plan is free for personal, non-commercial projects.
