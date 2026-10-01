import { Letter } from "@/types/timeecho";

/**
 * 📜 Initial Seed Dossiers for TimeEcho Standalone Vault
 *
 * Pre-populated time-capsules showcasing the epistolary lifecycle:
 * 1. Unlocked Capsule (scheduled 2 years ago, unbroken seal, ready to read & evaluate)
 * 2. In-Transit Capsule (scheduled 1 year in future with active countdown ticker)
 * 3. Archived Capsule (completed historical letter with reality ledger and emotional deltas)
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
          "Lanzar TimeEcho al mundo y consolidar una arquitectura postal autónoma.",
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

Este pliego viaja protegido bajo bóveda postal cifrada. En este momento exacto, la lluvia golpea el cristal de la ventana y el café humea sobre la mesa de madera.

Hay proyectos que aún son bocetos en tinta tenue y decisiones que requieren coraje. Te envío este testimonio para que no olvides que la paciencia es el arte de confiar en el propio paso. 

No abras este sello hasta que el reloj marque el día convenido. Cuida la salud, respira hondo y abraza a los que tienes cerca.`,
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
    title: "Cuaderno de bitácora: La primera chispa de la idea",
    content: `Para el expediente histórico de TimeEcho:

Este folio representa el momento germinal. Aquella noche donde anoté por primera vez en un papel manila: "¿Y si pudiéramos enviar cartas al futuro con lacre físico y verificación de realidad?".

Todo parecía desmedido y complejo, pero decidí confiar en la belleza de la palabra escrita y el peso del tiempo.`,
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
          "Construir una arquitectura limpia basada en el patrón Adapter.",
        reality:
          "Completada e implementada en Next.js con soporte offline y tipado estricto.",
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
        prediction: "Publicar una novela epistolar en formato tradicional.",
        reality:
          "El proyecto evolucionó hacia TimeEcho en formato de cartas digitales selladas.",
        matched: false,
        outcome: "diverged",
        createdAt: "2022-09-15T08:00:00.000Z",
        updatedAt: "2022-09-16T19:00:00.000Z",
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
