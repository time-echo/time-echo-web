export type StampCategory =
  "small-things" | "places-i-inhabit" | "stored-thoughts" | "passage-of-time";

export const STAMP_CATEGORIES: { id: StampCategory; label: string }[] = [
  { id: "small-things", label: "Small Things" },
  { id: "places-i-inhabit", label: "Places I Inhabit" },
  { id: "stored-thoughts", label: "Stored Thoughts" },
  { id: "passage-of-time", label: "Passage of Time" },
];

export const INITIAL_UNLOCKED_STAMP_IDS: string[] = [
  "morning-coffee",
  "today-song",
  "home-cooked-meal",
  "todays-steps",
  "five-more-minutes",
  "todays-list",
  "little-home",
  "neighborhood-corner",
  "way-home",
  "favorite-spot",
  "rainy-afternoon",
  "personal-journal",
  "ordinary-day",
  "work-in-progress",
  "something-growing",
  "first-key",
  "one-more-year",
  "little-companion",
];

export const DEFAULT_STAMP_ID = "morning-coffee";
