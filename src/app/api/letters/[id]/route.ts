import { NextResponse } from "next/server";
import { mockApiStore } from "@/lib/mockApiStore";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const letter = mockApiStore.getById(id);

    if (!letter) {
      return NextResponse.json(
        { error: `Letter with ID ${id} not found` },
        { status: 404 },
      );
    }

    return NextResponse.json(letter, { status: 200 });
  } catch (error) {
    console.error("[API /letters/[id] GET] Error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve letter" },
      { status: 500 },
    );
  }
}
