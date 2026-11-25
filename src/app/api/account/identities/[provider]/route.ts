import { NextRequest } from "next/server";
import { backendFetch } from "@/lib/server/backend-client";
import { handleRouteError, successResponse } from "@/lib/server/api-response";

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ provider: string }> },
) {
  try {
    const { provider } = await context.params;
    const backendRes = await backendFetch(
      `/account/identities/${encodeURIComponent(provider)}`,
      {
        method: "DELETE",
      },
    );

    return successResponse(backendRes.data, backendRes.status);
  } catch (err) {
    return handleRouteError(err);
  }
}
