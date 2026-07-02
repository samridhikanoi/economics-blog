import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { v4 as uuidv4 } from "uuid";

const VOTER_COOKIE = "voter_id";

// Assigns every visitor an anonymous, long-lived random ID on first visit.
// This is what the like API keys off to prevent one visitor from stacking
// up unlimited likes on a post (paired with a UNIQUE(post_id, voter_id)
// constraint in the DB) without requiring any login or personal data.
export function middleware(request: NextRequest) {
  const existing = request.cookies.get(VOTER_COOKIE);
  if (existing?.value) {
    return NextResponse.next();
  }

  const response = NextResponse.next();
  response.cookies.set(VOTER_COOKIE, uuidv4(), {
    maxAge: 60 * 60 * 24 * 365 * 2, // 2 years
    httpOnly: true,
    sameSite: "lax",
    path: "/",
  });
  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
