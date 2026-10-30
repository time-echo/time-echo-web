import React from "react";
import {
  MorningCoffeeStamp,
  TodaySongStamp,
  HomeCookedMealStamp,
  TodaysStepsStamp,
  FiveMoreMinutesStamp,
  TodaysListStamp,
  LittleHomeStamp,
  NeighborhoodCornerStamp,
  WayHomeStamp,
  FavoriteSpotStamp,
  RainyAfternoonStamp,
  PersonalJournalStamp,
  OrdinaryDayStamp,
  WorkInProgressStamp,
  SomethingGrowingStamp,
  FirstKeyStamp,
  OneMoreYearStamp,
  LittleCompanionStamp,
} from "./icons";

export type StampCategory =
  "small-things" | "places-i-inhabit" | "stored-thoughts" | "passage-of-time";

export interface StampDefinition {
  id: string;
  name: string;
  category: StampCategory;
  denomination: string;
  primaryColor: string;
  accentColor: string;
  description?: string;
  component: React.ComponentType<{ className?: string }>;
}

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

export const STAMPS_CATALOG: StampDefinition[] = [
  {
    id: "morning-coffee",
    name: "Morning Coffee",
    category: "small-things",
    denomination: "TIME ECHO • 10¢",
    primaryColor: "#A0522D",
    accentColor: "#5C2C16",
    component: MorningCoffeeStamp,
  },
  {
    id: "today-song",
    name: "Today's Song",
    category: "small-things",
    denomination: "STEREO • 12¢",
    primaryColor: "#2C485E",
    accentColor: "#1A2E3D",
    component: TodaySongStamp,
  },
  {
    id: "home-cooked-meal",
    name: "The Usual",
    category: "small-things",
    denomination: "FLAVOR • 15¢",
    primaryColor: "#B45309",
    accentColor: "#78350F",
    component: HomeCookedMealStamp,
  },
  {
    id: "todays-steps",
    name: "Today's Steps",
    category: "small-things",
    denomination: "STEPS • 08¢",
    primaryColor: "#706D53",
    accentColor: "#464433",
    component: TodaysStepsStamp,
  },
  {
    id: "five-more-minutes",
    name: "Five More Minutes",
    category: "small-things",
    denomination: "DAWN • 05¢",
    primaryColor: "#3B5266",
    accentColor: "#233340",
    component: FiveMoreMinutesStamp,
  },
  {
    id: "todays-list",
    name: "Today's List",
    category: "small-things",
    denomination: "NOTES • 06¢",
    primaryColor: "#4B5563",
    accentColor: "#1F2937",
    component: TodaysListStamp,
  },
  {
    id: "little-home",
    name: "My Little Home",
    category: "places-i-inhabit",
    denomination: "HOME • 20¢",
    primaryColor: "#9E4736",
    accentColor: "#612A1F",
    component: LittleHomeStamp,
  },
  {
    id: "neighborhood-corner",
    name: "My Usual Corner",
    category: "places-i-inhabit",
    denomination: "DISTRICT • 18¢",
    primaryColor: "#556B2F",
    accentColor: "#33411B",
    component: NeighborhoodCornerStamp,
  },
  {
    id: "way-home",
    name: "The Way Home",
    category: "places-i-inhabit",
    denomination: "ROUTE • 22¢",
    primaryColor: "#2F4858",
    accentColor: "#172730",
    component: WayHomeStamp,
  },
  {
    id: "favorite-spot",
    name: "My Favorite Spot",
    category: "places-i-inhabit",
    denomination: "CAFE • 25¢",
    primaryColor: "#8D5B4C",
    accentColor: "#57342A",
    component: FavoriteSpotStamp,
  },
  {
    id: "rainy-afternoon",
    name: "A Rainy Afternoon",
    category: "stored-thoughts",
    denomination: "RAIN • 14¢",
    primaryColor: "#46637F",
    accentColor: "#273A4D",
    component: RainyAfternoonStamp,
  },
  {
    id: "personal-journal",
    name: "My Personal Journal",
    category: "stored-thoughts",
    denomination: "MEMORY • 25¢",
    primaryColor: "#4D5638",
    accentColor: "#2D3320",
    component: PersonalJournalStamp,
  },
  {
    id: "ordinary-day",
    name: "An Ordinary Day",
    category: "stored-thoughts",
    denomination: "PHOTO • 19¢",
    primaryColor: "#646762",
    accentColor: "#3B3D3A",
    component: OrdinaryDayStamp,
  },
  {
    id: "work-in-progress",
    name: "What I'm Working On",
    category: "stored-thoughts",
    denomination: "STUDIO • 30¢",
    primaryColor: "#34495E",
    accentColor: "#1B2836",
    component: WorkInProgressStamp,
  },
  {
    id: "something-growing",
    name: "Something Is Growing",
    category: "passage-of-time",
    denomination: "SPROUT • 15¢",
    primaryColor: "#3F6338",
    accentColor: "#253D20",
    component: SomethingGrowingStamp,
  },
  {
    id: "first-key",
    name: "My First Key",
    category: "passage-of-time",
    denomination: "KEY • 28¢",
    primaryColor: "#B47228",
    accentColor: "#693E10",
    component: FirstKeyStamp,
  },
  {
    id: "one-more-year",
    name: "One More Year",
    category: "passage-of-time",
    denomination: "YEARS • 35¢",
    primaryColor: "#8E2818",
    accentColor: "#5E180D",
    component: OneMoreYearStamp,
  },
  {
    id: "little-companion",
    name: "My Little Companion",
    category: "passage-of-time",
    denomination: "CALM • 16¢",
    primaryColor: "#446B55",
    accentColor: "#254032",
    component: LittleCompanionStamp,
  },
];

export const DEFAULT_STAMP_ID = "morning-coffee";

export function getStampById(id: string): StampDefinition | undefined {
  return STAMPS_CATALOG.find((stamp) => stamp.id === id) || STAMPS_CATALOG[0];
}

export function getStampsByCategory(
  category: StampCategory,
): StampDefinition[] {
  return STAMPS_CATALOG.filter((stamp) => stamp.category === category);
}

export function getLocalizedStamp(
  id: string,
  t: (keyPath: string) => string,
): StampDefinition | undefined {
  const stamp = getStampById(id);
  if (!stamp) return undefined;

  const localizedName = t(`stamps.items.${stamp.id}.name`);
  const localizedDenom = t(`stamps.items.${stamp.id}.denomination`);

  return {
    ...stamp,
    name:
      localizedName && !localizedName.startsWith("stamps.items.")
        ? localizedName
        : stamp.name,
    denomination:
      localizedDenom && !localizedDenom.startsWith("stamps.items.")
        ? localizedDenom
        : stamp.denomination,
  };
}
