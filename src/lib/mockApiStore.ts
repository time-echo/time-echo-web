import {
  Letter,
  CreateLetterInput,
  UpdateRealityInput,
  LetterStatus,
  Prediction,
} from "@/types/timeecho";
import { getInitialSeeds } from "./initialSeeds";

/**
 * 📮 In-Memory Mock Store for Next.js REST Route Handlers
 *
 * Simulates a persistent database in the Next.js runtime environment,
 * pre-seeded with initial archival dossiers.
 */
class MockApiStore {
  private letters: Letter[] = [];

  constructor() {
    this.reset();
  }

  public reset(): void {
    this.letters = getInitialSeeds();
  }

  private reconcileDeliveryStatuses(): void {
    const now = new Date();
    this.letters = this.letters.map((letter) => {
      if (letter.status === "pending") {
        const scheduledTime = new Date(letter.scheduledAt);
        if (scheduledTime <= now) {
          return {
            ...letter,
            status: "delivered" as LetterStatus,
            deliveredAt: letter.deliveredAt || scheduledTime.toISOString(),
            updatedAt: now.toISOString(),
          };
        }
      }
      return letter;
    });
  }

  private generateDocketNumber(): string {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    return `TE-${randomNum}`;
  }

  public getAll(): Letter[] {
    this.reconcileDeliveryStatuses();
    return [...this.letters].sort(
      (a, b) =>
        new Date(b.scheduledAt).getTime() - new Date(a.scheduledAt).getTime(),
    );
  }

  public getById(id: string): Letter | null {
    this.reconcileDeliveryStatuses();
    const found = this.letters.find((item) => item.id === id);
    return found ? { ...found } : null;
  }

  public create(input: CreateLetterInput): Letter {
    const now = new Date();
    const scheduledDate = new Date(input.scheduledAt);
    const isImmediate = scheduledDate <= now;

    const capsuleId = `capsule-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const docketNumber = this.generateDocketNumber();

    const newPredictions: Prediction[] = input.predictions.map((p, index) => ({
      id: `pred-${Date.now()}-${index + 1}`,
      letterId: capsuleId,
      category: p.category,
      prediction: p.prediction,
      reality: null,
      matched: null,
      outcome: "pending",
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
    }));

    const newLetter: Letter = {
      id: capsuleId,
      docketNumber,
      title: input.title.trim(),
      content: input.content.trim(),
      email: input.email.trim(),
      scheduledAt: scheduledDate.toISOString(),
      deliveredAt: isImmediate ? now.toISOString() : null,
      openedAt: null,
      queuedAt: now.toISOString(),
      status: isImmediate ? "delivered" : "pending",
      language: input.language || "es",
      timezone:
        input.timezone ||
        Intl.DateTimeFormat().resolvedOptions().timeZone ||
        "UTC",
      revealHappiness: null,
      revealAnxiety: null,
      revealMotivation: null,
      isWaxBroken: false,
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      emotionalSnapshot: {
        id: `snap-${Date.now()}`,
        letterId: capsuleId,
        happinessLevel: input.emotionalSnapshot.happinessLevel,
        anxietyLevel: input.emotionalSnapshot.anxietyLevel,
        motivationLevel: input.emotionalSnapshot.motivationLevel,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
      },
      predictions: newPredictions,
      stampId: input.stampId || null,
    };

    this.letters.unshift(newLetter);
    return newLetter;
  }

  public updateReality(input: UpdateRealityInput): Letter {
    const index = this.letters.findIndex((item) => item.id === input.id);
    if (index === -1) {
      throw new Error(`Capsule with id "${input.id}" not found.`);
    }

    const current = this.letters[index];
    const now = new Date().toISOString();

    const updatedPredictions = current.predictions.map((pred) => {
      const patch = input.predictions?.find((p) => p.id === pred.id);
      if (!patch) return pred;

      let outcome = patch.outcome;
      if (!outcome && patch.matched !== undefined && patch.matched !== null) {
        outcome = patch.matched ? "fulfilled" : "diverged";
      }

      return {
        ...pred,
        reality: patch.reality,
        matched: patch.matched !== undefined ? patch.matched : pred.matched,
        outcome: outcome || pred.outcome,
        updatedAt: now,
      };
    });

    const isWaxBroken =
      input.isWaxBroken !== undefined ? input.isWaxBroken : current.isWaxBroken;
    const openedAt =
      input.openedAt ||
      (isWaxBroken && !current.openedAt ? now : current.openedAt);

    let status: LetterStatus = current.status;
    if (status === "delivered" && (isWaxBroken || openedAt)) {
      status = "opened";
    }

    const updated: Letter = {
      ...current,
      revealHappiness:
        input.revealHappiness !== undefined
          ? input.revealHappiness
          : current.revealHappiness,
      revealAnxiety:
        input.revealAnxiety !== undefined
          ? input.revealAnxiety
          : current.revealAnxiety,
      revealMotivation:
        input.revealMotivation !== undefined
          ? input.revealMotivation
          : current.revealMotivation,
      isWaxBroken,
      openedAt,
      status,
      predictions: updatedPredictions,
      updatedAt: now,
    };

    this.letters[index] = updated;
    return updated;
  }

  public archive(id: string): Letter {
    const index = this.letters.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error(`Capsule with id "${id}" not found.`);
    }

    const updated: Letter = {
      ...this.letters[index],
      status: "archived",
      updatedAt: new Date().toISOString(),
    };

    this.letters[index] = updated;
    return updated;
  }

  public restore(id: string): Letter {
    const index = this.letters.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error(`Capsule with id "${id}" not found.`);
    }

    const current = this.letters[index];
    const now = new Date();
    const isPastSchedule = new Date(current.scheduledAt) <= now;

    let restoredStatus: LetterStatus = "pending";
    if (current.openedAt || current.isWaxBroken) {
      restoredStatus = "opened";
    } else if (current.deliveredAt || isPastSchedule) {
      restoredStatus = "delivered";
    }

    const updated: Letter = {
      ...current,
      status: restoredStatus,
      updatedAt: now.toISOString(),
    };

    this.letters[index] = updated;
    return updated;
  }

  public delete(id: string): void {
    const index = this.letters.findIndex((item) => item.id === id);
    if (index === -1) {
      throw new Error(`Capsule with id "${id}" not found.`);
    }

    if (this.letters[index].status !== "archived") {
      throw new Error(
        `Cannot delete letter with id "${id}" because it is not archived.`,
      );
    }

    this.letters.splice(index, 1);
  }
}

// Global singleton to persist state across hot reloads in development
const globalForMockStore = globalThis as unknown as {
  mockStore?: MockApiStore;
};
export const mockApiStore = globalForMockStore.mockStore || new MockApiStore();
if (process.env.NODE_ENV !== "production") {
  globalForMockStore.mockStore = mockApiStore;
}
