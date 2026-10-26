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
    title: "Reflexiones sobre una nueva etapa: El cruce del umbral",
    content: `Querido yo del porvenir:

Hoy tomo la pluma en una tarde de otoño silenciosa. Hay un eco extraño en la casa vacía, esa sensación suspendida entre lo que dejamos atrás y lo que todavía no tiene nombre. 

Te escribo porque temo que con el tiempo olvides la razón por la que te atreviste a dar este salto: no fue por la certeza del triunfo, sino por la necesidad urgente de no quedarte dormido en la orilla de lo cómodo.

Si estás leyendo estas líneas con el sello carmesí recién quebrado, dime: ¿pudiste mantener encendida la curiosidad? ¿Fuiste compasivo contigo en los días grises? Espero que al mirar hacia atrás sonrías con la serenidad de quien honró sus promesas silenciosas.

Con afecto incondicional desde el pasado,
Tu antiguo yo.`,
    email: "yo.del.futuro@timeecho.internal",
    scheduledAt: "2024-03-27T10:00:00.000Z",
    deliveredAt: "2024-03-27T10:00:00.000Z",
    openedAt: null,
    queuedAt: "2024-03-27T09:59:00.000Z",
    status: "delivered",
    language: "es",
    timezone: "America/Bogota",
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
          "Estaré viviendo en Kioto o trabajando en remoto para un equipo global.",
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
          "Liderar mi propio equipo creativo o trabajar en proyectos independientes con propósito.",
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
          "Completar mi primera media maratón y mantener la práctica matinal de escritura.",
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
    title: "Promesas silenciosas bajo la lluvia de primavera",
    content: `A quien habitará este cuerpo y mente dentro de un año:

Te escribo en una tarde de lluvia tranquila, mientras el café aún humea sobre la mesa de madera.

Hay proyectos que aún son bocetos en tinta tenue y decisiones que requieren coraje. Te envío estas palabras para que no olvides que la paciencia es el arte de confiar en el propio paso. 

No abras esta carta hasta que llegue el día convenido. Cuida la salud, respira hondo y abraza a los que tienes cerca.`,
    email: "yo.del.futuro@timeecho.internal",
    scheduledAt: "2027-03-29T12:00:00.000Z",
    deliveredAt: null,
    openedAt: null,
    queuedAt: null,
    status: "pending",
    language: "es",
    timezone: "America/Bogota",
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
          "Alcanzar plena estabilidad financiera ahorrando metódicamente cada mes.",
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
          "Preservar los almuerzos de domingo y viajar juntos a la costa.",
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
    title: "Dos años después del salto: Recordar por qué empecé",
    content: `Si estás leyendo esto, han pasado dos años desde aquella tarde en la que decidiste cambiar de rumbo. Tenías miedo de dejar la estabilidad, preguntándote si tendrías la valentía de construir algo propio.

Espero que hayas aprendido a preocuparte menos por los plazos y más por estar presente. No olvides que te prometiste cuidar los pequeños rituales: el café sin prisas por las mañanas, adoptar a ese perro cuando tuvieras terraza y dedicarle tiempo a quienes quieres.

Siéntete orgulloso de dónde estás. Trabajamos muy duro para traerte hasta aquí.`,
    email: "yo.del.futuro@timeecho.internal",
    scheduledAt: "2022-09-15T09:00:00.000Z",
    deliveredAt: "2022-09-15T09:00:00.000Z",
    openedAt: "2022-09-16T18:30:00.000Z",
    queuedAt: "2022-09-15T08:59:00.000Z",
    status: "archived",
    language: "es",
    timezone: "America/Bogota",
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
          "Trabajar como Lead Designer en un estudio o fundar mi propio equipo.",
        reality: "VP de Diseño en un colectivo indie con clientes globales.",
        matched: true,
        outcome: "fulfilled",
        createdAt: "2022-09-15T08:00:00.000Z",
        updatedAt: "2022-09-16T19:00:00.000Z",
      },
      {
        id: "pred-302",
        letterId: "capsule-archived-2022",
        category: "city",
        prediction: "Mudarme a un estudio con balcón soleado para escribir.",
        reality: "Encontré un ático con terraza iluminada y vistas al parque.",
        matched: true,
        outcome: "fulfilled",
        createdAt: "2022-09-15T08:00:00.000Z",
        updatedAt: "2022-09-16T19:00:00.000Z",
      },
      {
        id: "pred-303",
        letterId: "capsule-archived-2022",
        category: "achievement",
        prediction: "Correr el maratón completo de 42K de Chicago.",
        reality: "Completé mi primer medio maratón 21K en Bogotá.",
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
        reality: "Completed my first 21K half marathon in Bogotá.",
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
