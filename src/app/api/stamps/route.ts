import { NextRequest } from "next/server";
import { backendFetch } from "@/lib/server/backend-client";
import { handleRouteError, successResponse } from "@/lib/server/api-response";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const params: Record<string, string> = {};

    searchParams.forEach((val, key) => {
      params[key] = val;
    });

    const backendRes = await backendFetch("/stamps", {
      method: "GET",
      params,
    });

    return successResponse(backendRes.data, backendRes.status);
  } catch (err) {
    return handleRouteError(err);
  }
}
