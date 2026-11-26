export type InspirationCategoryId =
  | "futureReflections"
  | "dreamsGoals"
  | "relationships"
  | "everydayLife"
  | "personalGrowth"
  | "gratitude"
  | "predictions"
  | "justBecause";

export interface InspirationPrompt {
  id: string;
  categoryId: InspirationCategoryId;
  textKey: string;
}

export interface InspirationCategory {
  id: InspirationCategoryId;
  nameKey: string;
  descriptionKey: string;
  prompts: InspirationPrompt[];
}

export const INSPIRATION_CATEGORIES: readonly InspirationCategory[] = [
  {
    id: "futureReflections",
    nameKey: "inspireMe.categories.futureReflections.name",
    descriptionKey: "inspireMe.categories.futureReflections.description",
    prompts: [
      {
        id: "futureReflections.personToBecome",
        categoryId: "futureReflections",
        textKey:
          "inspireMe.categories.futureReflections.prompts.personToBecome",
      },
      {
        id: "futureReflections.adviceToFuture",
        categoryId: "futureReflections",
        textKey:
          "inspireMe.categories.futureReflections.prompts.adviceToFuture",
      },
      {
        id: "futureReflections.hopeNeverChanges",
        categoryId: "futureReflections",
        textKey:
          "inspireMe.categories.futureReflections.prompts.hopeNeverChanges",
      },
      {
        id: "futureReflections.proudToHear",
        categoryId: "futureReflections",
        textKey: "inspireMe.categories.futureReflections.prompts.proudToHear",
      },
      {
        id: "futureReflections.letterToRemember",
        categoryId: "futureReflections",
        textKey:
          "inspireMe.categories.futureReflections.prompts.letterToRemember",
      },
    ],
  },
  {
    id: "dreamsGoals",
    nameKey: "inspireMe.categories.dreamsGoals.name",
    descriptionKey: "inspireMe.categories.dreamsGoals.description",
    prompts: [
      {
        id: "dreamsGoals.threeAccomplishments",
        categoryId: "dreamsGoals",
        textKey:
          "inspireMe.categories.dreamsGoals.prompts.threeAccomplishments",
      },
      {
        id: "dreamsGoals.dreamTooBig",
        categoryId: "dreamsGoals",
        textKey: "inspireMe.categories.dreamsGoals.prompts.dreamTooBig",
      },
      {
        id: "dreamsGoals.nextChapter",
        categoryId: "dreamsGoals",
        textKey: "inspireMe.categories.dreamsGoals.prompts.nextChapter",
      },
      {
        id: "dreamsGoals.skillToMaster",
        categoryId: "dreamsGoals",
        textKey: "inspireMe.categories.dreamsGoals.prompts.skillToMaster",
      },
      {
        id: "dreamsGoals.courageousStep",
        categoryId: "dreamsGoals",
        textKey: "inspireMe.categories.dreamsGoals.prompts.courageousStep",
      },
    ],
  },
  {
    id: "relationships",
    nameKey: "inspireMe.categories.relationships.name",
    descriptionKey: "inspireMe.categories.relationships.description",
    prompts: [
      {
        id: "relationships.peopleWhoMatter",
        categoryId: "relationships",
        textKey: "inspireMe.categories.relationships.prompts.peopleWhoMatter",
      },
      {
        id: "relationships.unsaidThankYou",
        categoryId: "relationships",
        textKey: "inspireMe.categories.relationships.prompts.unsaidThankYou",
      },
      {
        id: "relationships.hopeStillClose",
        categoryId: "relationships",
        textKey: "inspireMe.categories.relationships.prompts.hopeStillClose",
      },
      {
        id: "relationships.favoriteConversation",
        categoryId: "relationships",
        textKey:
          "inspireMe.categories.relationships.prompts.favoriteConversation",
      },
      {
        id: "relationships.howYouLove",
        categoryId: "relationships",
        textKey: "inspireMe.categories.relationships.prompts.howYouLove",
      },
    ],
  },
  {
    id: "everydayLife",
    nameKey: "inspireMe.categories.everydayLife.name",
    descriptionKey: "inspireMe.categories.everydayLife.description",
    prompts: [
      {
        id: "everydayLife.littleThingsHappy",
        categoryId: "everydayLife",
        textKey: "inspireMe.categories.everydayLife.prompts.littleThingsHappy",
      },
      {
        id: "everydayLife.ordinaryDay",
        categoryId: "everydayLife",
        textKey: "inspireMe.categories.everydayLife.prompts.ordinaryDay",
      },
      {
        id: "everydayLife.currentFavorites",
        categoryId: "everydayLife",
        textKey: "inspireMe.categories.everydayLife.prompts.currentFavorites",
      },
      {
        id: "everydayLife.homeAndSpace",
        categoryId: "everydayLife",
        textKey: "inspireMe.categories.everydayLife.prompts.homeAndSpace",
      },
      {
        id: "everydayLife.currentRoutine",
        categoryId: "everydayLife",
        textKey: "inspireMe.categories.everydayLife.prompts.currentRoutine",
      },
    ],
  },
  {
    id: "personalGrowth",
    nameKey: "inspireMe.categories.personalGrowth.name",
    descriptionKey: "inspireMe.categories.personalGrowth.description",
    prompts: [
      {
        id: "personalGrowth.hardestLesson",
        categoryId: "personalGrowth",
        textKey: "inspireMe.categories.personalGrowth.prompts.hardestLesson",
      },
      {
        id: "personalGrowth.currentChallenge",
        categoryId: "personalGrowth",
        textKey: "inspireMe.categories.personalGrowth.prompts.currentChallenge",
      },
      {
        id: "personalGrowth.fearToOutgrow",
        categoryId: "personalGrowth",
        textKey: "inspireMe.categories.personalGrowth.prompts.fearToOutgrow",
      },
      {
        id: "personalGrowth.proudOfOvercoming",
        categoryId: "personalGrowth",
        textKey:
          "inspireMe.categories.personalGrowth.prompts.proudOfOvercoming",
      },
      {
        id: "personalGrowth.lettingGo",
        categoryId: "personalGrowth",
        textKey: "inspireMe.categories.personalGrowth.prompts.lettingGo",
      },
    ],
  },
  {
    id: "gratitude",
    nameKey: "inspireMe.categories.gratitude.name",
    descriptionKey: "inspireMe.categories.gratitude.description",
    prompts: [
      {
        id: "gratitude.momentNeverForget",
        categoryId: "gratitude",
        textKey: "inspireMe.categories.gratitude.prompts.momentNeverForget",
      },
      {
        id: "gratitude.quietBlessing",
        categoryId: "gratitude",
        textKey: "inspireMe.categories.gratitude.prompts.quietBlessing",
      },
      {
        id: "gratitude.unexpectedKindness",
        categoryId: "gratitude",
        textKey: "inspireMe.categories.gratitude.prompts.unexpectedKindness",
      },
      {
        id: "gratitude.pastSelfThankYou",
        categoryId: "gratitude",
        textKey: "inspireMe.categories.gratitude.prompts.pastSelfThankYou",
      },
      {
        id: "gratitude.simpleJoy",
        categoryId: "gratitude",
        textKey: "inspireMe.categories.gratitude.prompts.simpleJoy",
      },
    ],
  },
  {
    id: "predictions",
    nameKey: "inspireMe.categories.predictions.name",
    descriptionKey: "inspireMe.categories.predictions.description",
    prompts: [
      {
        id: "predictions.whereLiving",
        categoryId: "predictions",
        textKey: "inspireMe.categories.predictions.prompts.whereLiving",
      },
      {
        id: "predictions.biggestSurprise",
        categoryId: "predictions",
        textKey: "inspireMe.categories.predictions.prompts.biggestSurprise",
      },
      {
        id: "predictions.workAndPurpose",
        categoryId: "predictions",
        textKey: "inspireMe.categories.predictions.prompts.workAndPurpose",
      },
      {
        id: "predictions.worriesThatFade",
        categoryId: "predictions",
        textKey: "inspireMe.categories.predictions.prompts.worriesThatFade",
      },
      {
        id: "predictions.worldAroundYou",
        categoryId: "predictions",
        textKey: "inspireMe.categories.predictions.prompts.worldAroundYou",
      },
    ],
  },
  {
    id: "justBecause",
    nameKey: "inspireMe.categories.justBecause.name",
    descriptionKey: "inspireMe.categories.justBecause.description",
    prompts: [
      {
        id: "justBecause.rightNowSnapshot",
        categoryId: "justBecause",
        textKey: "inspireMe.categories.justBecause.prompts.rightNowSnapshot",
      },
      {
        id: "justBecause.honestCheckIn",
        categoryId: "justBecause",
        textKey: "inspireMe.categories.justBecause.prompts.honestCheckIn",
      },
      {
        id: "justBecause.weirdlySpecific",
        categoryId: "justBecause",
        textKey: "inspireMe.categories.justBecause.prompts.weirdlySpecific",
      },
      {
        id: "justBecause.letterWithoutPlan",
        categoryId: "justBecause",
        textKey: "inspireMe.categories.justBecause.prompts.letterWithoutPlan",
      },
      {
        id: "justBecause.questionForFuture",
        categoryId: "justBecause",
        textKey: "inspireMe.categories.justBecause.prompts.questionForFuture",
      },
    ],
  },
];

export const DEFAULT_INSPIRATION_CATEGORY_ID: InspirationCategoryId =
  "futureReflections";

export function getInspirationCategory(
  categoryId: InspirationCategoryId,
): InspirationCategory {
  return (
    INSPIRATION_CATEGORIES.find((category) => category.id === categoryId) ??
    INSPIRATION_CATEGORIES[0]
  );
}
