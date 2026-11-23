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
    const { email, password } = body || {};

    if (!email || !password) {
      return errorResponse(
        400,
        "bad_request",
        "Email and password are required.",
      );
    }

    const backendRes = await backendFetch<BackendSessionData>("/sessions", {
      method: "POST",
      body: { email, password },
    });

    const payload = backendRes.data?.data || backendRes.data;
    const sessionToken = payload?.token;
    const userEmail = payload?.email || email;
    const userId = payload?.userId;
    const isNewUser = Boolean(payload?.isNewUser);

    const response = NextResponse.json(
      { data: { userId, email: userEmail, token: sessionToken, isNewUser } },
      { status: backendRes.status },
    );

    if (sessionToken) {
      setAuthCookie(response, sessionToken);
    }

    return response;
  } catch (err) {
    return handleRouteError(err);
  }
}
