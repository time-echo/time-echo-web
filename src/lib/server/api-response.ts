import "server-only";
import { NextResponse } from "next/server";
import { BackendClientError, SESSION_COOKIE_NAME } from "./backend-client";

export function successResponse<T>(data: T, status = 200, init?: ResponseInit) {
  return NextResponse.json(data, {
    status,
    ...init,
  });
}

export function errorResponse(
  status: number,
  code: string,
  message: string,
  details?: Record<string, string[]>,
) {
  return NextResponse.json(
    {
      error: {
        code,
        message,
        ...(details ? { details } : {}),
      },
    },
    { status },
  );
}

export function handleRouteError(err: unknown) {
  if (err instanceof BackendClientError) {
    return errorResponse(err.status, err.code, err.message, err.details);
  }

  const message =
    err instanceof Error ? err.message : "An unexpected server error occurred.";
  return errorResponse(500, "internal_server_error", message);
}

export function setAuthCookie(
  response: NextResponse,
  token: string,
  maxAge = 2592000, // 30 days
) {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge,
  });
}

export function clearAuthCookie(response: NextResponse) {
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
