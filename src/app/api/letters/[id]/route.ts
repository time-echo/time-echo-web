import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/server/backend-client";
import { handleRouteError, successResponse } from "@/lib/server/api-response";

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const backendRes = await backendFetch(
      `/letters/${encodeURIComponent(id)}`,
      {
        method: "GET",
      },
    );

    return successResponse(backendRes.data, backendRes.status);
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function DELETE(_request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;
    const backendRes = await backendFetch(
      `/letters/${encodeURIComponent(id)}`,
      {
        method: "DELETE",
      },
    );

    if (backendRes.status === 204) {
      return new NextResponse(null, { status: 204 });
    }

    return successResponse(backendRes.data, backendRes.status);
  } catch (err) {
    return handleRouteError(err);
  }
}
