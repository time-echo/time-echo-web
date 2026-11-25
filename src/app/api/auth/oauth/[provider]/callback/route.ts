import { NextRequest, NextResponse } from "next/server";
import { backendFetch, BackendClientError } from "@/lib/server/backend-client";
import { setAuthCookie } from "@/lib/server/api-response";
import { buildPublicUrl } from "@/lib/server/public-origin";

interface OAuthCallbackResponse {
  data?: {
    purpose?: string;
    provider?: string;
    token?: string;
    email?: string;
    userId?: string;
    linked?: boolean;
  };
  purpose?: string;
  provider?: string;
  token?: string;
  email?: string;
  userId?: string;
  linked?: boolean;
}

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ provider: string }> },
) {
  const { provider } = await context.params;
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const providerError = request.nextUrl.searchParams.get("error");

  if (providerError || !code || !state) {
    return NextResponse.redirect(
      buildPublicUrl("/login?error=oauth_failed", request),
    );
  }

  try {
    const backendRes = await backendFetch<OAuthCallbackResponse>(
      "/oauth_callbacks",
      {
        method: "POST",
        body: { provider, code, state },
      },
    );

    const payload = backendRes.data?.data || backendRes.data;

    if (payload?.purpose === "link") {
      return NextResponse.redirect(
        buildPublicUrl(
          `/settings?linked=${encodeURIComponent(provider)}`,
          request,
        ),
      );
    }

    const response = NextResponse.redirect(
      buildPublicUrl("/dashboard", request),
    );
    if (payload?.token) {
      setAuthCookie(response, payload.token);
    }
    return response;
  } catch (err) {
    const errorCode =
      err instanceof BackendClientError ? err.code : "oauth_failed";
    return NextResponse.redirect(
      buildPublicUrl(`/login?error=${encodeURIComponent(errorCode)}`, request),
    );
  }
}
