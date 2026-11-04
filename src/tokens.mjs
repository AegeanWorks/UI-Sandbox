export const ACCENT_IDS = ["aurora", "ember", "forest", "mono"];
export const DEFAULT_RADIUS = 18;
export const MIN_RADIUS = 4;
export const MAX_RADIUS = 28;
export const DEFAULT_TOKENS = Object.freeze({
  accent: "aurora",
  radius: DEFAULT_RADIUS,
  compact: false,
});

export function normalizeRadius(value) {
  const numeric = typeof value === "string" && value.trim() !== "" ? Number(value) : value;
  if (typeof numeric !== "number" || !Number.isFinite(numeric)) {
    return DEFAULT_TOKENS.radius;
  }
  const rounded = Math.round(numeric);
  if (rounded < MIN_RADIUS || rounded > MAX_RADIUS) {
    return DEFAULT_TOKENS.radius;
  }
  return rounded;
}

export function normalizeTokens(stored) {
  if (!stored || typeof stored !== "object" || Array.isArray(stored)) {
    return { ...DEFAULT_TOKENS };
  }
  return {
    accent: ACCENT_IDS.includes(stored.accent) ? stored.accent : DEFAULT_TOKENS.accent,
    radius:
      Number.isInteger(stored.radius) &&
      stored.radius >= MIN_RADIUS &&
      stored.radius <= MAX_RADIUS
        ? stored.radius
        : DEFAULT_TOKENS.radius,
    compact: typeof stored.compact === "boolean" ? stored.compact : DEFAULT_TOKENS.compact,
  };
}
