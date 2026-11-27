import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const currentDir = dirname(fileURLToPath(import.meta.url));
const enDict = JSON.parse(
  readFileSync(resolve(currentDir, "../../../../lib/i18n/en.json"), "utf8"),
) as Record<string, unknown>;
const esDict = JSON.parse(
  readFileSync(resolve(currentDir, "../../../../lib/i18n/es.json"), "utf8"),
) as Record<string, unknown>;

function resolveKeyPath(
  dict: Record<string, unknown>,
  keyPath: string,
): unknown {
  return keyPath.split(".").reduce<unknown>((acc, segment) => {
    if (acc && typeof acc === "object" && segment in acc) {
      return (acc as Record<string, unknown>)[segment];
    }
    return undefined;
  }, dict);
}

describe("inspireMe i18n UI keys parity", () => {
  it("resolves every inspireMe UI chrome key to non-empty strings in both en and es", () => {
    const uiKeys = [
      "inspireMe.buttonLabel",
      "inspireMe.buttonAria",
      "inspireMe.activePromptLabel",
      "inspireMe.removePrompt",
    ];

    for (const key of uiKeys) {
      const enVal = resolveKeyPath(enDict, key);
      const esVal = resolveKeyPath(esDict, key);
      assert.equal(typeof enVal, "string", `Missing EN key: ${key}`);
      assert.equal(typeof esVal, "string", `Missing ES key: ${key}`);
      assert.ok((enVal as string).trim().length > 0);
      assert.ok((esVal as string).trim().length > 0);
    }
  });

  it("does not hardcode prompt categories in frontend i18n bundles", () => {
    assert.equal(resolveKeyPath(enDict, "inspireMe.categories"), undefined);
    assert.equal(resolveKeyPath(esDict, "inspireMe.categories"), undefined);
  });
});
