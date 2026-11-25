import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/server/backend-client";
import { buildPublicUrl } from "@/lib/server/public-origin";

interface OAuthAuthzResponse {
  data?: {
    url?: string;
    provider?: string;
  };
  url?: string;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ provider: string }> },
) {
  const { provider } = await context.params;
  const purpose = request.nextUrl.searchParams.get("purpose") || "login";
  const fallbackPath = purpose === "link" ? "/settings" : "/login";

  try {
    const backendRes = await backendFetch<OAuthAuthzResponse>(
      "/oauth_authorizations",
      {
        method: "POST",
        body: { provider, purpose },
      },
    );

    const payload = backendRes.data?.data || backendRes.data;
    const redirectUrl = payload?.url;

    if (!redirectUrl) {
      return NextResponse.redirect(
        buildPublicUrl(`${fallbackPath}?error=oauth_failed`, request),
      );
    }

    return NextResponse.redirect(redirectUrl);
  } catch {
    return NextResponse.redirect(
      buildPublicUrl(`${fallbackPath}?error=oauth_failed`, request),
    );
  }
}
