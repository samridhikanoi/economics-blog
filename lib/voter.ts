import { headers } from "next/headers";

// Falls back to a hashed IP when the voter_id cookie is somehow missing
// (e.g. a client that blocks cookies) so the like endpoint still has a
// stable-ish key to dedupe against, instead of throwing.
export function resolveVoterId(cookieValue: string | undefined): string {
  if (cookieValue) return cookieValue;

  const headersList = headers();
  const forwardedFor = headersList.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() || "unknown";
  return `ip:${ip}`;
}
