import { NextResponse } from "next/server";
import { mockApiStore } from "@/lib/mockApiStore";
import { CreateLetterInput } from "@/types/timeecho";

export async function GET() {
  try {
    const letters = mockApiStore.getAll();
    return NextResponse.json(letters, { status: 200 });
  } catch (error) {
    console.error("[API /letters GET] Error:", error);
    return NextResponse.json(
      { error: "Failed to retrieve letters" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Support both direct CreateLetterInput and Rails wrapped format { letter: ... }
    const input: CreateLetterInput = body.letter
      ? {
          title: body.letter.title,
          content: body.letter.content,
          email: body.letter.email,
          scheduledAt: body.letter.scheduled_at || body.letter.scheduledAt,
          language: body.letter.language,
          timezone: body.letter.timezone,
          emotionalSnapshot: {
            happinessLevel:
              body.letter.emotional_snapshot_attributes?.happiness_level ??
              body.letter.emotionalSnapshot?.happinessLevel ??
              5,
            anxietyLevel:
              body.letter.emotional_snapshot_attributes?.anxiety_level ??
              body.letter.emotionalSnapshot?.anxietyLevel ??
              5,
            motivationLevel:
              body.letter.emotional_snapshot_attributes?.motivation_level ??
              body.letter.emotionalSnapshot?.motivationLevel ??
              5,
          },
          predictions: (
            body.letter.predictions_attributes ||
            body.letter.predictions ||
            []
          ).map((p: { category: string; prediction: string }) => ({
            category: p.category,
            prediction: p.prediction,
          })),
        }
      : body;

    if (!input.title || !input.content || !input.email || !input.scheduledAt) {
      return NextResponse.json(
        {
          error:
            "Missing required letter fields (title, content, email, scheduledAt)",
        },
        { status: 422 },
      );
    }

    const created = mockApiStore.create(input);
    return NextResponse.json(created, { status: 201 });
  } catch (error) {
    console.error("[API /letters POST] Error:", error);
    return NextResponse.json(
      { error: "Failed to create letter" },
      { status: 500 },
    );
  }
}
