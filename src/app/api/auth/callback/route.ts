import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/server/backend-client";
import {
  handleRouteError,
  setAuthCookie,
  errorResponse,
} from "@/lib/server/api-response";

interface BackendSessionData {
  data?: {
    userId?: string;
    email: string;
    token: string;
    isNewUser?: boolean;
  };
  userId?: string;
  email?: string;
  token?: string;
  isNewUser?: boolean;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const token = body?.token;

    if (!token || typeof token !== "string") {
      return errorResponse(400, "invalid_token", "Session token is required.");
    }

    const backendRes = await backendFetch<BackendSessionData>(
      `/sessions/${encodeURIComponent(token)}`,
      { method: "GET" },
    );

    const payload = backendRes.data?.data || backendRes.data;
    const sessionToken = payload?.token || token;
    const email = payload?.email;
    const userId = payload?.userId;
    const isNewUser = payload?.isNewUser;

    const response = NextResponse.json(
      { data: { userId, email, token: sessionToken, isNewUser } },
      { status: backendRes.status },
    );

    setAuthCookie(response, sessionToken);
    return response;
  } catch (err) {
    return handleRouteError(err);
  }
}

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get("token");

    if (!token) {
      return errorResponse(400, "invalid_token", "Session token is required.");
    }

    const backendRes = await backendFetch<BackendSessionData>(
      `/sessions/${encodeURIComponent(token)}`,
      { method: "GET" },
    );

    const payload = backendRes.data?.data || backendRes.data;
    const sessionToken = payload?.token || token;
    const email = payload?.email;
    const userId = payload?.userId;
    const isNewUser = payload?.isNewUser;

    const response = NextResponse.json(
      { data: { userId, email, token: sessionToken, isNewUser } },
      { status: backendRes.status },
    );

    setAuthCookie(response, sessionToken);
    return response;
  } catch (err) {
    return handleRouteError(err);
  }
}
