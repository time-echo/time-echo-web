import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/server/backend-client";
import {
  handleRouteError,
  clearAuthCookie,
  successResponse,
} from "@/lib/server/api-response";

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const backendRes = await backendFetch("/account", {
      method: "PATCH",
      body,
    });

    return successResponse(backendRes.data, backendRes.status);
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function DELETE() {
  try {
    const backendRes = await backendFetch("/account", {
      method: "DELETE",
    });

    const response =
      backendRes.status === 204
        ? new NextResponse(null, { status: 204 })
        : successResponse(backendRes.data, backendRes.status);

    clearAuthCookie(response);
    return response;
  } catch (err) {
    return handleRouteError(err);
  }
}
