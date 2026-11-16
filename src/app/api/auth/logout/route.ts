import { NextResponse } from "next/server";
import { backendFetch } from "@/lib/server/backend-client";
import { handleRouteError, clearAuthCookie } from "@/lib/server/api-response";

export async function POST() {
  return handleLogout();
}

export async function DELETE() {
  return handleLogout();
}

async function handleLogout() {
  try {
    try {
      await backendFetch("/sessions", {
        method: "DELETE",
      });
    } catch {
      // Even if backend fails (e.g. token already expired), proceed to clear cookie locally
    }

    const response = new NextResponse(null, { status: 204 });
    clearAuthCookie(response);
    return response;
  } catch (err) {
    return handleRouteError(err);
  }
}
