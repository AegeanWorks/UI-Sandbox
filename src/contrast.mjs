export function parseColor(value) {
  const text = String(value).trim();
  const hex = text.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i);
  if (hex) {
    const expanded =
      hex[1].length === 3
        ? hex[1].split("").map((part) => part + part).join("")
        : hex[1];
    return [0, 2, 4].map((offset) => parseInt(expanded.slice(offset, offset + 2), 16) / 255);
  }
  const rgb = text.match(/^rgba?\(([^)]+)\)$/i);
  if (rgb) {
    const parts = rgb[1].split(",").map((part) => Number.parseFloat(part));
    if (parts.length >= 3 && parts.slice(0, 3).every(Number.isFinite)) {
      // Clamp wild channels (e.g. "rgb(999, -5, 0)") so the proof can never
      // report a ratio above the 21:1 physical maximum.
      return parts
        .slice(0, 3)
        .map((part) => Math.min(255, Math.max(0, part)) / 255);
    }
  }
  return null;
}

export function luminance(rgb) {
  const [r, g, b] = rgb.map((part) =>
    part <= 0.03928 ? part / 12.92 : ((part + 0.055) / 1.055) ** 2.4,
  );
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(foreground, background) {
  const fg = parseColor(foreground);
  const bg = parseColor(background);
  if (!fg || !bg) {
    return null;
  }
  const lighter = Math.max(luminance(fg), luminance(bg));
  const darker = Math.min(luminance(fg), luminance(bg));
  return (lighter + 0.05) / (darker + 0.05);
}
