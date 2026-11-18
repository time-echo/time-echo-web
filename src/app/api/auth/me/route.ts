import { NextResponse } from "next/server";
import { backendFetch, BackendClientError } from "@/lib/server/backend-client";
import {
  handleRouteError,
  clearAuthCookie,
  successResponse,
} from "@/lib/server/api-response";

interface MeResponse {
  data?: {
    authenticated: boolean;
    userId?: string;
    email: string;
    locale: string;
  };
  userId?: string;
  email?: string;
}

export async function GET() {
  try {
    const backendRes = await backendFetch<MeResponse>("/sessions/me", {
      method: "GET",
    });

    const data = backendRes.data?.data || backendRes.data;
    return successResponse(data, backendRes.status);
  } catch (err) {
    if (err instanceof BackendClientError && err.status === 401) {
      const response = NextResponse.json(
        { error: { code: "unauthorized", message: "Not authenticated" } },
        { status: 401 },
      );
      clearAuthCookie(response);
      return response;
    }
    return handleRouteError(err);
  }
}
