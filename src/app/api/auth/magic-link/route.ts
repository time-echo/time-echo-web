import { NextRequest } from "next/server";
import { backendFetch } from "@/lib/server/backend-client";
import { handleRouteError, successResponse } from "@/lib/server/api-response";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, locale } = body;

    const backendRes = await backendFetch<{ message?: string; email?: string }>(
      "/sessions",
      {
        method: "POST",
        body: { email, locale },
        locale,
      },
    );

    return successResponse(backendRes.data, backendRes.status);
  } catch (err) {
    return handleRouteError(err);
  }
}
