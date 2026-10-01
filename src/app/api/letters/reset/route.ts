import { NextResponse } from "next/server";
import { mockApiStore } from "@/lib/mockApiStore";

export async function POST() {
  try {
    mockApiStore.reset();
    const letters = mockApiStore.getAll();
    return NextResponse.json(letters, { status: 200 });
  } catch (error) {
    console.error("[API /letters/reset POST] Error:", error);
    return NextResponse.json(
      { error: "Failed to reset vault" },
      { status: 500 },
    );
  }
}
