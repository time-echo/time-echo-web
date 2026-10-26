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
  HourglassStamp,
  AirmailBiplaneStamp,
  VintageQuillStamp,
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
  description: string;
  component: React.ComponentType<{ className?: string }>;
}

export const STAMP_CATEGORIES: { id: StampCategory; label: string }[] = [
  { id: "small-things", label: "Pequeñas cosas" },
  { id: "places-i-inhabit", label: "Lugares que habito" },
  { id: "stored-thoughts", label: "Pensamientos guardados" },
  { id: "passage-of-time", label: "El paso del tiempo" },
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
    name: "El café de la mañana",
    category: "small-things",
    denomination: "TIME ECHO • 10¢",
    primaryColor: "#A0522D",
    accentColor: "#5C2C16",
    description: "Una taza de café sobre una mesa iluminada por el sol",
    component: MorningCoffeeStamp,
  },
  {
    id: "today-song",
    name: "La canción de hoy",
    category: "small-things",
    denomination: "STEREO • 12¢",
    primaryColor: "#2C485E",
    accentColor: "#1A2E3D",
    description: "Audífonos y un reproductor de música o casete",
    component: TodaySongStamp,
  },
  {
    id: "home-cooked-meal",
    name: "Lo de siempre",
    category: "small-things",
    denomination: "SABOR • 15¢",
    primaryColor: "#B45309",
    accentColor: "#78350F",
    description: "Un plato de comida casera sobre una mesa",
    component: HomeCookedMealStamp,
  },
  {
    id: "todays-steps",
    name: "Mis pasos de hoy",
    category: "small-things",
    denomination: "PASOS • 08¢",
    primaryColor: "#706D53",
    accentColor: "#464433",
    description: "Unas zapatillas junto a la puerta",
    component: TodaysStepsStamp,
  },
  {
    id: "five-more-minutes",
    name: "Cinco minutos más",
    category: "small-things",
    denomination: "ALBA • 05¢",
    primaryColor: "#3B5266",
    accentColor: "#233340",
    description: "Un reloj despertador junto a unas pantuflas",
    component: FiveMoreMinutesStamp,
  },
  {
    id: "todays-list",
    name: "La lista de hoy",
    category: "small-things",
    denomination: "NOTAS • 06¢",
    primaryColor: "#4B5563",
    accentColor: "#1F2937",
    description: "Una lista de compras escrita a mano y un lápiz",
    component: TodaysListStamp,
  },
  {
    id: "little-home",
    name: "Mi pequeño hogar",
    category: "places-i-inhabit",
    denomination: "HOGAR • 20¢",
    primaryColor: "#9E4736",
    accentColor: "#612A1F",
    description: "Una casa con plantas y ropa secándose al sol",
    component: LittleHomeStamp,
  },
  {
    id: "neighborhood-corner",
    name: "Mi lugar de siempre",
    category: "places-i-inhabit",
    denomination: "BARRIO • 18¢",
    primaryColor: "#556B2F",
    accentColor: "#33411B",
    description: "Una bicicleta junto a una tienda de barrio",
    component: NeighborhoodCornerStamp,
  },
  {
    id: "way-home",
    name: "Camino a casa",
    category: "places-i-inhabit",
    denomination: "RUTA • 22¢",
    primaryColor: "#2F4858",
    accentColor: "#172730",
    description: "Una parada de autobús en una calle cotidiana",
    component: WayHomeStamp,
  },
  {
    id: "favorite-spot",
    name: "Mi lugar favorito",
    category: "places-i-inhabit",
    denomination: "CAFÉ • 25¢",
    primaryColor: "#8D5B4C",
    accentColor: "#57342A",
    description: "Una cafetería o panadería de barrio",
    component: FavoriteSpotStamp,
  },
  {
    id: "rainy-afternoon",
    name: "Una tarde lluviosa",
    category: "stored-thoughts",
    denomination: "LLUVIA • 14¢",
    primaryColor: "#46637F",
    accentColor: "#273A4D",
    description: "Gotas de lluvia en una ventana y un interior acogedor",
    component: RainyAfternoonStamp,
  },
  {
    id: "personal-journal",
    name: "Mi diario personal",
    category: "stored-thoughts",
    denomination: "MEMORIA • 25¢",
    primaryColor: "#4D5638",
    accentColor: "#2D3320",
    description: "Un cuaderno abierto, un bolígrafo y una flor seca",
    component: PersonalJournalStamp,
  },
  {
    id: "ordinary-day",
    name: "Un día cualquiera",
    category: "stored-thoughts",
    denomination: "FOTO • 19¢",
    primaryColor: "#646762",
    accentColor: "#3B3D3A",
    description: "Una cámara instantánea con pequeñas fotografías",
    component: OrdinaryDayStamp,
  },
  {
    id: "work-in-progress",
    name: "En lo que estoy trabajando",
    category: "stored-thoughts",
    denomination: "TALLER • 30¢",
    primaryColor: "#34495E",
    accentColor: "#1B2836",
    description: "Un escritorio con portátil, libreta y lámpara",
    component: WorkInProgressStamp,
  },
  {
    id: "something-growing",
    name: "Algo está creciendo",
    category: "passage-of-time",
    denomination: "BROTE • 15¢",
    primaryColor: "#3F6338",
    accentColor: "#253D20",
    description: "Una planta en una maceta con una hoja nueva",
    component: SomethingGrowingStamp,
  },
  {
    id: "first-key",
    name: "Mi primera llave",
    category: "passage-of-time",
    denomination: "LLAVE • 28¢",
    primaryColor: "#B47228",
    accentColor: "#693E10",
    description: "Una llave doméstica sobre una superficie de madera",
    component: FirstKeyStamp,
  },
  {
    id: "one-more-year",
    name: "Un año más",
    category: "passage-of-time",
    denomination: "AÑOS • 35¢",
    primaryColor: "#8E2818",
    accentColor: "#5E180D",
    description: "Una pequeña torta de cumpleaños con una vela",
    component: OneMoreYearStamp,
  },
  {
    id: "little-companion",
    name: "Mi pequeño compañero",
    category: "passage-of-time",
    denomination: "CALMA • 16¢",
    primaryColor: "#446B55",
    accentColor: "#254032",
    description:
      "Una planta o un pequeño objeto que represente la compañía cotidiana",
    component: LittleCompanionStamp,
  },
];

const LEGACY_STAMPS: Record<string, StampDefinition> = {
  hourglass: {
    id: "hourglass",
    name: "Reloj de Arena",
    category: "passage-of-time",
    denomination: "TIME ECHO • 10¢",
    primaryColor: "#D97706",
    accentColor: "#78350F",
    description: "Arenas doradas y resplandor cósmico",
    component: HourglassStamp,
  },
  "airmail-biplane": {
    id: "airmail-biplane",
    name: "Biplano Postal",
    category: "places-i-inhabit",
    denomination: "POR AVIÓN • 40¢",
    primaryColor: "#1E3A8A",
    accentColor: "#DC2626",
    description: "Clásico avión de correo sobrevolando nubes",
    component: AirmailBiplaneStamp,
  },
  "vintage-quill": {
    id: "vintage-quill",
    name: "Pluma de Caligrafía",
    category: "stored-thoughts",
    denomination: "ESCRITURA • 10¢",
    primaryColor: "#2C485E",
    accentColor: "#1E293B",
    description: "Pluma sumergiéndose en tintero antiguo",
    component: VintageQuillStamp,
  },
  "sprout-seedling": {
    id: "sprout-seedling",
    name: "Primer Brote",
    category: "passage-of-time",
    denomination: "NUEVA ERA • 12¢",
    primaryColor: "#15803D",
    accentColor: "#14532D",
    description: "Pequeño retoño naciendo de tierra fértil",
    component: SomethingGrowingStamp,
  },
};

export const DEFAULT_STAMP_ID = "morning-coffee";

export function getStampById(id: string): StampDefinition | undefined {
  const found = STAMPS_CATALOG.find((stamp) => stamp.id === id);
  if (found) return found;
  return LEGACY_STAMPS[id] || STAMPS_CATALOG[0];
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
  const localizedDesc = t(`stamps.items.${stamp.id}.description`);
  const localizedDenom = t(`stamps.items.${stamp.id}.denomination`);

  return {
    ...stamp,
    name:
      localizedName && !localizedName.startsWith("stamps.items.")
        ? localizedName
        : stamp.name,
    description:
      localizedDesc && !localizedDesc.startsWith("stamps.items.")
        ? localizedDesc
        : stamp.description,
    denomination:
      localizedDenom && !localizedDenom.startsWith("stamps.items.")
        ? localizedDenom
        : stamp.denomination,
  };
}
