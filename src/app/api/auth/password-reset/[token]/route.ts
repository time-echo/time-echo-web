import { NextRequest } from "next/server";
import { backendFetch } from "@/lib/server/backend-client";
import { handleRouteError, successResponse } from "@/lib/server/api-response";

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ token: string }> },
) {
  try {
    const { token } = await context.params;
    const body = await request.json().catch(() => ({}));
    const { password, password_confirmation } = body || {};

    const backendRes = await backendFetch(
      `/password_resets/${encodeURIComponent(token)}`,
      {
        method: "PATCH",
        body: { password, password_confirmation },
      },
    );

    return successResponse(backendRes.data, backendRes.status);
  } catch (err) {
    return handleRouteError(err);
  }
}
