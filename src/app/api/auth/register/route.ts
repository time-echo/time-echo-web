import { NextRequest, NextResponse } from "next/server";
import { backendFetch } from "@/lib/server/backend-client";
import {
  handleRouteError,
  setAuthCookie,
  errorResponse,
} from "@/lib/server/api-response";

interface BackendRegistrationData {
  data?: {
    userId?: string;
    email?: string;
    token?: string;
    isNewUser?: boolean;
    requiresEmailVerification?: boolean;
    message?: string;
  };
  userId?: string;
  email?: string;
  token?: string;
  isNewUser?: boolean;
  requiresEmailVerification?: boolean;
  message?: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, password, password_confirmation, locale } = body || {};

    if (!email || !password) {
      return errorResponse(
        400,
        "bad_request",
        "Email and password are required.",
      );
    }

    const backendRes = await backendFetch<BackendRegistrationData>(
      "/registrations",
      {
        method: "POST",
        body: {
          email,
          password,
          password_confirmation,
          locale,
        },
        locale,
      },
    );

    const payload = backendRes.data?.data || backendRes.data;
    const sessionToken = payload?.token;

    const response = NextResponse.json(
      { data: payload },
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
