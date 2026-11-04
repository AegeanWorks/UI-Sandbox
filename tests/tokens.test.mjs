import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import {
  DEFAULT_TOKENS,
  normalizeRadius,
  normalizeTokens,
} from "../src/tokens.mjs";

const appSource = readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");

test("corrupt or missing stored tokens fall back to defaults without sharing the reference", () => {
  for (const stored of [null, undefined, "oops", 42, [], ["aurora"]]) {
    const tokens = normalizeTokens(stored);
    assert.deepEqual(tokens, { accent: "aurora", radius: 18, compact: false });
    assert.notEqual(tokens, DEFAULT_TOKENS);
  }
});

test("stored tokens with invalid fields fall back per field", () => {
  assert.equal(normalizeTokens({ accent: "plasma", radius: 18, compact: false }).accent, "aurora");
  assert.equal(normalizeTokens({ accent: "ember", radius: 3, compact: false }).radius, 18);
  assert.equal(normalizeTokens({ accent: "ember", radius: 29, compact: false }).radius, 18);
  assert.equal(normalizeTokens({ accent: "ember", radius: 18.5, compact: false }).radius, 18);
  assert.equal(normalizeTokens({ accent: "ember", radius: "18", compact: false }).radius, 18);
  assert.equal(normalizeTokens({ accent: "ember", radius: 18, compact: "yes" }).compact, false);
});

test("valid stored tokens survive the round trip", () => {
  assert.deepEqual(normalizeTokens({ accent: "forest", radius: 24, compact: true }), {
    accent: "forest",
    radius: 24,
    compact: true,
  });
});

test("live radius input is clamped and never NaN", () => {
  assert.equal(normalizeRadius("18"), 18);
  assert.equal(normalizeRadius(12.4), 12);
  for (const bad of ["", "abc", Number.NaN, 0, 99, null, undefined]) {
    assert.equal(normalizeRadius(bad), DEFAULT_TOKENS.radius, `input ${String(bad)} must fall back`);
  }
});

test("the app never stores the shared defaults object or raw Number() radius", () => {
  assert.ok(!appSource.includes("setTokens(DEFAULT_TOKENS)"), "reset must copy the defaults");
  assert.ok(!appSource.includes("return DEFAULT_TOKENS"), "reads must return copies");
  assert.ok(
    appSource.includes("normalizeRadius(event.target.value)"),
    "the slider must clamp through normalizeRadius",
  );
});
