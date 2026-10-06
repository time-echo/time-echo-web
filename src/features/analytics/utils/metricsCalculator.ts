import { AnalyticsMetrics, Letter, PredictionCategory } from "@/types/timeecho";

export interface CategoryMetricBreakdown {
  category: PredictionCategory;
  total: number;
  matched: number;
  accuracyRate: number;
}

export interface DetailedAnalyticsResult extends AnalyticsMetrics {
  categoryBreakdown: CategoryMetricBreakdown[];
}

export function calculateAnalyticsMetrics(
  letters: Letter[],
): DetailedAnalyticsResult {
  const totalLetters = letters.length;

  let inTransitCount = 0;
  let deliveredCount = 0;
  let openedCount = 0;
  let archivedCount = 0;

  let totalPredictionsCount = 0;
  let evaluatedPredictionsCount = 0;
  let matchedPredictionsCount = 0;
  let unmatchedPredictionsCount = 0;

  const categoryMap: Record<string, { total: number; matched: number }> = {};

  let sumBaseHappiness = 0;
  let sumBaseAnxiety = 0;
  let sumBaseMotivation = 0;
  let baselineCount = 0;

  let sumRevealHappiness = 0;
  let sumRevealAnxiety = 0;
  let sumRevealMotivation = 0;
  let revealCount = 0;

  for (const letter of letters) {
    switch (letter.status) {
      case "pending":
        inTransitCount++;
        break;
      case "delivered":
        deliveredCount++;
        break;
      case "opened":
        openedCount++;
        break;
      case "archived":
        archivedCount++;
        break;
    }

    if (letter.emotionalSnapshot) {
      sumBaseHappiness += letter.emotionalSnapshot.happinessLevel;
      sumBaseAnxiety += letter.emotionalSnapshot.anxietyLevel;
      sumBaseMotivation += letter.emotionalSnapshot.motivationLevel;
      baselineCount++;
    }

    if (
      letter.revealHappiness !== null &&
      letter.revealHappiness !== undefined &&
      letter.revealAnxiety !== null &&
      letter.revealAnxiety !== undefined &&
      letter.revealMotivation !== null &&
      letter.revealMotivation !== undefined
    ) {
      sumRevealHappiness += letter.revealHappiness;
      sumRevealAnxiety += letter.revealAnxiety;
      sumRevealMotivation += letter.revealMotivation;
      revealCount++;
    }

    for (const pred of letter.predictions || []) {
      totalPredictionsCount++;

      if (!categoryMap[pred.category]) {
        categoryMap[pred.category] = { total: 0, matched: 0 };
      }
      categoryMap[pred.category].total++;

      if (pred.outcome === "fulfilled" || pred.matched === true) {
        evaluatedPredictionsCount++;
        matchedPredictionsCount++;
        categoryMap[pred.category].matched++;
      } else if (
        pred.outcome === "diverged" ||
        pred.outcome === "unfulfilled" ||
        pred.matched === false
      ) {
        evaluatedPredictionsCount++;
        unmatchedPredictionsCount++;
      }
    }
  }

  const round1 = (val: number) => Number(val.toFixed(1));

  const avgBaseHappiness =
    baselineCount > 0 ? round1(sumBaseHappiness / baselineCount) : 0;
  const avgBaseAnxiety =
    baselineCount > 0 ? round1(sumBaseAnxiety / baselineCount) : 0;
  const avgBaseMotivation =
    baselineCount > 0 ? round1(sumBaseMotivation / baselineCount) : 0;

  const avgRevealHappiness =
    revealCount > 0 ? round1(sumRevealHappiness / revealCount) : 0;
  const avgRevealAnxiety =
    revealCount > 0 ? round1(sumRevealAnxiety / revealCount) : 0;
  const avgRevealMotivation =
    revealCount > 0 ? round1(sumRevealMotivation / revealCount) : 0;

  const deltaHappiness =
    revealCount > 0 ? round1(avgRevealHappiness - avgBaseHappiness) : 0;
  const deltaAnxiety =
    revealCount > 0 ? round1(avgRevealAnxiety - avgBaseAnxiety) : 0;
  const deltaMotivation =
    revealCount > 0 ? round1(avgRevealMotivation - avgBaseMotivation) : 0;

  const predictionsAccuracyRate =
    evaluatedPredictionsCount > 0
      ? Math.round((matchedPredictionsCount / evaluatedPredictionsCount) * 100)
      : 0;

  const categoryBreakdown: CategoryMetricBreakdown[] = Object.entries(
    categoryMap,
  ).map(([category, data]) => ({
    category: category as PredictionCategory,
    total: data.total,
    matched: data.matched,
    accuracyRate:
      data.total > 0 ? Math.round((data.matched / data.total) * 100) : 0,
  }));

  return {
    totalLetters,
    inTransitCount,
    deliveredCount,
    openedCount,
    archivedCount,
    predictionsAccuracyRate,
    totalPredictionsCount,
    evaluatedPredictionsCount,
    matchedPredictionsCount,
    unmatchedPredictionsCount,
    emotionalAverages: {
      baseline: {
        happiness: avgBaseHappiness,
        anxiety: avgBaseAnxiety,
        motivation: avgBaseMotivation,
      },
      reveal: {
        happiness: avgRevealHappiness,
        anxiety: avgRevealAnxiety,
        motivation: avgRevealMotivation,
      },
      delta: {
        happiness: deltaHappiness,
        anxiety: deltaAnxiety,
        motivation: deltaMotivation,
      },
    },
    categoryBreakdown,
  };
}
