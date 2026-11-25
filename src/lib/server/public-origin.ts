import type { NextRequest } from "next/server";

export function resolvePublicOrigin(request: NextRequest): string {
  const forwardedHost = request.headers
    .get("x-forwarded-host")
    ?.split(",")[0]
    ?.trim();
  if (forwardedHost) {
    const forwardedProto =
      request.headers.get("x-forwarded-proto")?.split(",")[0]?.trim() ||
      "https";
    return `${forwardedProto}://${forwardedHost}`;
  }

  const envUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (envUrl && process.env.NODE_ENV === "production") {
    return envUrl.replace(/\/+$/, "");
  }

  return new URL(request.url).origin;
}

export function buildPublicUrl(path: string, request: NextRequest): URL {
  return new URL(path, resolvePublicOrigin(request));
}
