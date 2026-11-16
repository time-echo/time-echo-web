import { NextRequest } from "next/server";
import { backendFetch } from "@/lib/server/backend-client";
import { handleRouteError, successResponse } from "@/lib/server/api-response";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function POST(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const backendRes = await backendFetch(
      `/letters/${encodeURIComponent(id)}/restore`,
      {
        method: "POST",
      },
    );

    return successResponse(backendRes.data, backendRes.status);
  } catch (err) {
    return handleRouteError(err);
  }
}
