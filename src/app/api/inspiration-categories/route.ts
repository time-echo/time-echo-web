import { backendFetch } from "@/lib/server/backend-client";
import { handleRouteError, successResponse } from "@/lib/server/api-response";

export async function GET() {
  try {
    const backendRes = await backendFetch("/inspiration_categories", {
      method: "GET",
    });

    return successResponse(backendRes.data, backendRes.status);
  } catch (err) {
    return handleRouteError(err);
  }
}
