import confetti from "canvas-confetti";

const PALETTE = ["#8E2818", "#2C485E", "#D8D2C2", "#FAF9F5"];

const fired = new Set<string>();

export function celebrate(key: string): void {
  if (typeof window === "undefined") return;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  if (fired.has(key)) return;
  fired.add(key);

  try {
    confetti({
      particleCount: 75,
      spread: 65,
      origin: { y: 0.6 },
      colors: PALETTE,
    });
  } catch {
    // Confetti is decorative; failures are silent.
  }
}
