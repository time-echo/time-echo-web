import { NextResponse } from "next/server";
import { mockApiStore } from "@/lib/mockApiStore";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const archived = mockApiStore.archive(id);
    return NextResponse.json(archived, { status: 200 });
  } catch (error) {
    console.error("[API /letters/[id]/archive POST] Error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Failed to archive letter",
      },
      { status: 500 },
    );
  }
}
