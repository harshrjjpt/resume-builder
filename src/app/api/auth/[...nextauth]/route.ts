import { getAuthOptions, isAuthConfigured } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function authNotConfigured() {
  return Response.json(
    {
      error:
        "Auth is not configured. Set NEXTAUTH_SECRET and at least one provider credentials pair."
    },
    { status: 503 }
  );
}

export async function GET(req: Request, ctx: unknown) {
  if (!isAuthConfigured()) return authNotConfigured();
  const NextAuth = (await import("next-auth")).default;
  const handler = NextAuth(getAuthOptions());
  return handler(req, ctx as never);
}

export async function POST(req: Request, ctx: unknown) {
  if (!isAuthConfigured()) return authNotConfigured();
  const NextAuth = (await import("next-auth")).default;
  const handler = NextAuth(getAuthOptions());
  return handler(req, ctx as never);
}
