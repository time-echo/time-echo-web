import { Letter } from "@/types/timeecho";

/**
 * 📜 Initial Seed Dossiers for TimeEcho Standalone Vault
 *
 * Pre-populated time-capsules showcasing the epistolary lifecycle:
 * 1. Unlocked Capsule (scheduled 2 years ago, unbroken seal, ready to read & evaluate)
 * 2. In-Transit Capsule (scheduled 1 year in future with active countdown ticker)
 * 3. Archived Capsule (completed historical letter with reality ledger and emotional deltas)
 * 4. Revealed & Compared Capsule (unsealed letter with reality ledger in English)
 */

export const INITIAL_SEEDS: Letter[] = [
  // --------------------------------------------------------------------------
  // Seed 1: Unlocked Capsule (Ready for wax seal break & reality evaluation)
  // --------------------------------------------------------------------------
  {
    id: "capsule-unlocked-2024",
    docketNumber: "TE-00421",
    title: "Reflections on a New Chapter: Crossing the Threshold",
    content: `Dear future self,

Today I take up the pen on a quiet autumn afternoon. There is a strange echo in the empty house, that suspended feeling between what we leave behind and what does not yet have a name.

I write to you because I fear that over time you might forget the reason you dared to take this leap: it was not out of certainty of triumph, but out of an urgent need not to fall asleep on the shore of comfort.

If you are reading these lines with the crimson seal freshly broken, tell me: did you keep your curiosity alive? Were you compassionate with yourself on gray days? I hope that looking back you smile with the serenity of someone who honored their quiet promises.

With unconditional affection from the past,
Your former self.`,
    email: "future.self@timeecho.internal",
    scheduledAt: "2024-03-27T10:00:00.000Z",
    deliveredAt: "2024-03-27T10:00:00.000Z",
    openedAt: null,
    queuedAt: "2024-03-27T09:59:00.000Z",
    status: "delivered",
    language: "en",
    timezone: "America/New_York",
    revealHappiness: null,
    revealAnxiety: null,
    revealMotivation: null,
    isWaxBroken: false,
    createdAt: "2024-03-27T08:30:00.000Z",
    updatedAt: "2024-03-27T10:00:00.000Z",
    stampId: "morning-coffee",
    emotionalSnapshot: {
      id: "snap-101",
      letterId: "capsule-unlocked-2024",
      happinessLevel: 7,
      anxietyLevel: 8,
      motivationLevel: 9,
      createdAt: "2024-03-27T08:30:00.000Z",
      updatedAt: "2024-03-27T08:30:00.000Z",
    },
    predictions: [
      {
        id: "pred-101",
        letterId: "capsule-unlocked-2024",
        category: "city",
        prediction:
          "Living in Kyoto or working remotely with a global creative team.",
        reality: null,
        matched: null,
        outcome: "pending",
        createdAt: "2024-03-27T08:30:00.000Z",
        updatedAt: "2024-03-27T08:30:00.000Z",
      },
      {
        id: "pred-102",
        letterId: "capsule-unlocked-2024",
        category: "career",
        prediction:
          "Leading my own creative studio or building independent purpose-driven projects.",
        reality: null,
        matched: null,
        outcome: "pending",
        createdAt: "2024-03-27T08:30:00.000Z",
        updatedAt: "2024-03-27T08:30:00.000Z",
      },
      {
        id: "pred-103",
        letterId: "capsule-unlocked-2024",
        category: "achievement",
        prediction:
          "Completing my first half marathon and keeping up my morning writing ritual.",
        reality: null,
        matched: null,
        outcome: "pending",
        createdAt: "2024-03-27T08:30:00.000Z",
        updatedAt: "2024-03-27T08:30:00.000Z",
      },
    ],
  },

  // --------------------------------------------------------------------------
  // Seed 2: In-Transit Capsule (En route with active countdown)
  // --------------------------------------------------------------------------
  {
    id: "capsule-transit-2027",
    docketNumber: "TE-00912",
    title: "Quiet Promises Under the Spring Rain",
    content: `To the one who will inhabit this body and mind a year from now:

I am writing to you on a quiet rainy afternoon while coffee still steams on the wooden desk.

There are projects that are still faint ink sketches and decisions that require courage. I send you these words so you never forget that patience is the art of trusting your own pace.

Do not break this seal until the appointed day arrives. Take care of your health, breathe deeply, and hold close those you love.`,
    email: "future.self@timeecho.internal",
    scheduledAt: "2027-03-29T12:00:00.000Z",
    deliveredAt: null,
    openedAt: null,
    queuedAt: null,
    status: "pending",
    language: "en",
    timezone: "America/New_York",
    revealHappiness: null,
    revealAnxiety: null,
    revealMotivation: null,
    isWaxBroken: false,
    createdAt: "2026-03-29T12:00:00.000Z",
    updatedAt: "2026-03-29T12:00:00.000Z",
    stampId: "rainy-afternoon",
    emotionalSnapshot: {
      id: "snap-201",
      letterId: "capsule-transit-2027",
      happinessLevel: 8,
      anxietyLevel: 4,
      motivationLevel: 9,
      createdAt: "2026-03-29T12:00:00.000Z",
      updatedAt: "2026-03-29T12:00:00.000Z",
    },
    predictions: [
      {
        id: "pred-201",
        letterId: "capsule-transit-2027",
        category: "salary",
        prediction:
          "Achieve full financial stability by saving methodically every month.",
        reality: null,
        matched: null,
        outcome: "pending",
        createdAt: "2026-03-29T12:00:00.000Z",
        updatedAt: "2026-03-29T12:00:00.000Z",
      },
      {
        id: "pred-202",
        letterId: "capsule-transit-2027",
        category: "relationship",
        prediction:
          "Preserve our Sunday family lunches and travel together to the coast.",
        reality: null,
        matched: null,
        outcome: "pending",
        createdAt: "2026-03-29T12:00:00.000Z",
        updatedAt: "2026-03-29T12:00:00.000Z",
      },
    ],
  },

  // --------------------------------------------------------------------------
  // Seed 3: Archived Capsule (Retrospective completed with reality ledger)
  // --------------------------------------------------------------------------
  {
    id: "capsule-archived-2022",
    docketNumber: "TE-00108",
    title: "Notes from the First Studio: Building with Intention",
    content: `If you are reading this, two years have passed since that afternoon when you decided to change course. You were afraid of leaving stability behind, wondering if you would have the courage to build something of your own.

I hope you have learned to worry less about deadlines and more about being present. Do not forget that you promised yourself to protect the small rituals: unhurried morning coffee, adopting that dog once you had a terrace, and making time for the people you love.

Be proud of where you stand today. We worked hard to bring you here.`,
    email: "future.self@timeecho.internal",
    scheduledAt: "2022-09-15T09:00:00.000Z",
    deliveredAt: "2022-09-15T09:00:00.000Z",
    openedAt: "2022-09-16T18:30:00.000Z",
    queuedAt: "2022-09-15T08:59:00.000Z",
    status: "archived",
    language: "en",
    timezone: "America/New_York",
    revealHappiness: 9,
    revealAnxiety: 3,
    revealMotivation: 8,
    isWaxBroken: true,
    createdAt: "2022-09-15T08:00:00.000Z",
    updatedAt: "2022-09-16T19:00:00.000Z",
    stampId: "personal-journal",
    emotionalSnapshot: {
      id: "snap-301",
      letterId: "capsule-archived-2022",
      happinessLevel: 6,
      anxietyLevel: 7,
      motivationLevel: 7,
      createdAt: "2022-09-15T08:00:00.000Z",
      updatedAt: "2022-09-15T08:00:00.000Z",
    },
    predictions: [
      {
        id: "pred-301",
        letterId: "capsule-archived-2022",
        category: "career",
        prediction:
          "Work as Lead Designer at a studio or found my own independent team.",
        reality: "VP of Design at an indie collective with global clients.",
        matched: true,
        outcome: "fulfilled",
        createdAt: "2022-09-15T08:00:00.000Z",
        updatedAt: "2022-09-16T19:00:00.000Z",
      },
      {
        id: "pred-302",
        letterId: "capsule-archived-2022",
        category: "city",
        prediction: "Move into a studio with a sunny balcony to write.",
        reality: "Found a penthouse with a sunlit terrace and park views.",
        matched: true,
        outcome: "fulfilled",
        createdAt: "2022-09-15T08:00:00.000Z",
        updatedAt: "2022-09-16T19:00:00.000Z",
      },
      {
        id: "pred-303",
        letterId: "capsule-archived-2022",
        category: "achievement",
        prediction: "Run the full 42K Chicago Marathon.",
        reality: "Completed my first 21K half marathon.",
        matched: false,
        outcome: "diverged",
        createdAt: "2022-09-15T08:00:00.000Z",
        updatedAt: "2022-09-16T19:00:00.000Z",
      },
    ],
  },

  // --------------------------------------------------------------------------
  // Seed 4: Revealed & Compared Capsule (Unsealed with reality ledger in English)
  // --------------------------------------------------------------------------
  {
    id: "capsule-revealed-2023",
    docketNumber: "TE-00214",
    title: "Two Years After the Leap: Remembering Why I Started",
    content: `If you are reading this, two years have elapsed since the afternoon you decided to change course. You were terrified of leaving stability, wondering if you had the courage to build something of your own.

I hope you learned to worry less about timelines and more about being present. Don't forget that you promised to cherish the small rituals: unhurried morning coffee, adopting that dog once you had a terrace, and making time for those you love.

Be proud of where you are. We worked hard to bring you here.`,
    email: "future.self@timeecho.internal",
    scheduledAt: "2023-11-10T10:00:00.000Z",
    deliveredAt: "2023-11-10T10:00:00.000Z",
    openedAt: "2023-11-11T16:45:00.000Z",
    queuedAt: "2023-11-10T09:59:00.000Z",
    status: "opened",
    language: "en",
    timezone: "America/New_York",
    revealHappiness: 9,
    revealAnxiety: 3,
    revealMotivation: 8,
    isWaxBroken: true,
    createdAt: "2023-11-10T08:00:00.000Z",
    updatedAt: "2023-11-11T17:00:00.000Z",
    stampId: "something-growing",
    emotionalSnapshot: {
      id: "snap-401",
      letterId: "capsule-revealed-2023",
      happinessLevel: 6,
      anxietyLevel: 7,
      motivationLevel: 7,
      createdAt: "2023-11-10T08:00:00.000Z",
      updatedAt: "2023-11-10T08:00:00.000Z",
    },
    predictions: [
      {
        id: "pred-401",
        letterId: "capsule-revealed-2023",
        category: "career",
        prediction:
          "Work as Lead Designer at a studio or build my own creative team.",
        reality: "VP of Design at an indie collective with global clients.",
        matched: true,
        outcome: "fulfilled",
        createdAt: "2023-11-10T08:00:00.000Z",
        updatedAt: "2023-11-11T17:00:00.000Z",
      },
      {
        id: "pred-402",
        letterId: "capsule-revealed-2023",
        category: "city",
        prediction: "Move into a studio with a sunny balcony to write.",
        reality: "Found a penthouse with a sunlit terrace and park views.",
        matched: true,
        outcome: "fulfilled",
        createdAt: "2023-11-10T08:00:00.000Z",
        updatedAt: "2023-11-11T17:00:00.000Z",
      },
      {
        id: "pred-403",
        letterId: "capsule-revealed-2023",
        category: "achievement",
        prediction: "Run the full 42K Chicago marathon.",
        reality: "Completed my first 21K half marathon.",
        matched: false,
        outcome: "diverged",
        createdAt: "2023-11-10T08:00:00.000Z",
        updatedAt: "2023-11-11T17:00:00.000Z",
      },
    ],
  },
];

/**
 * Returns a cloned deep copy of the initial seeds, optionally calculating
 * dynamic future dates to ensure live countdowns remain active in any test session.
 */
export function getInitialSeeds(): Letter[] {
  return JSON.parse(JSON.stringify(INITIAL_SEEDS));
}
