import { NextResponse } from "next/server";
import { mockApiStore } from "@/lib/mockApiStore";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const restored = mockApiStore.restore(id);
    return NextResponse.json(restored, { status: 200 });
  } catch (error) {
    console.error("[API /letters/[id]/restore POST] Error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to restore letter",
      },
      { status: 500 },
    );
  }
}
