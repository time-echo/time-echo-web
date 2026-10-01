import { NextResponse } from "next/server";
import { mockApiStore } from "@/lib/mockApiStore";
import { UpdateRealityInput } from "@/types/timeecho";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const body = await request.json();

    const input: UpdateRealityInput = {
      id,
      revealHappiness: body.reveal_happiness ?? body.revealHappiness,
      revealAnxiety: body.reveal_anxiety ?? body.revealAnxiety,
      revealMotivation: body.reveal_motivation ?? body.revealMotivation,
      isWaxBroken: body.is_wax_broken ?? body.isWaxBroken,
      openedAt: body.opened_at ?? body.openedAt,
      predictions: body.predictions?.map(
        (p: {
          id: string;
          reality: string;
          matched?: boolean | null;
          outcome?: "fulfilled" | "unfulfilled" | "diverged" | "pending";
        }) => ({
          id: String(p.id),
          reality: p.reality,
          matched: p.matched,
          outcome: p.outcome,
        }),
      ),
    };

    const updated = mockApiStore.updateReality(input);
    return NextResponse.json(updated, { status: 200 });
  } catch (error) {
    console.error("[API /letters/[id]/predictions POST] Error:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to update predictions",
      },
      { status: 500 },
    );
  }
}
