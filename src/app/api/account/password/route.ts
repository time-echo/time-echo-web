import { NextRequest } from "next/server";
import { backendFetch } from "@/lib/server/backend-client";
import { handleRouteError, successResponse } from "@/lib/server/api-response";

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { current_password, password, password_confirmation } = body || {};

    const backendRes = await backendFetch("/account/password", {
      method: "PATCH",
      body: {
        current_password,
        password,
        password_confirmation,
      },
    });

    return successResponse(backendRes.data, backendRes.status);
  } catch (err) {
    return handleRouteError(err);
  }
}
