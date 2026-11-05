import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import test from "node:test";
import { contrastRatio, luminance, parseColor } from "../src/contrast.mjs";

const appSource = readFileSync(new URL("../src/App.jsx", import.meta.url), "utf8");

test("black on white is the maximum 21:1 proof", () => {
  assert.equal(contrastRatio("#000000", "#ffffff"), 21);
  assert.equal(contrastRatio("#fff", "rgb(0, 0, 0)"), 21);
});

test("identical colors have no contrast", () => {
  assert.equal(contrastRatio("#2456d8", "#2456d8"), 1);
});

test("pure red on white is about 4:1, below the AA bar", () => {
  const ratio = contrastRatio("#ff0000", "#ffffff");
  assert.ok(Math.abs(ratio - 4.0) < 0.01, `expected ~4.0, got ${ratio}`);
});

test("unparseable tokens yield an unknown proof instead of a number", () => {
  assert.equal(contrastRatio("var(--text)", "#ffffff"), null);
  assert.equal(contrastRatio("", "#ffffff"), null);
  assert.equal(contrastRatio("#ffffff", "transparent"), null);
});

test("out-of-range channels clamp so the ratio never exceeds 21:1", () => {
  assert.deepEqual(parseColor("rgb(999, -5, 0)"), [1, 0, 0]);
  const ratio = contrastRatio("rgb(999, 999, 999)", "#000000");
  assert.ok(ratio <= 21, `expected <= 21, got ${ratio}`);
});

test("luminance follows the WCAG linearization", () => {
  assert.equal(luminance([0, 0, 0]), 0);
  assert.equal(luminance([1, 1, 1]), 1);
  assert.deepEqual(parseColor("#fff"), [1, 1, 1]);
});

test("the app delegates the proof to the contrast module", () => {
  assert.ok(!appSource.includes("function parseColor"), "no local parseColor copy");
  assert.ok(!appSource.includes("function luminance"), "no local luminance copy");
  assert.ok(appSource.includes('from "./contrast.mjs"'), "imports the contrast module");
});
