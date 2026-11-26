import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import {
  INSPIRATION_CATEGORIES,
  getInspirationPromptById,
} from "../inspirationPrompts";

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

describe("INSPIRATION_CATEGORIES catalog & i18n parity", () => {
  it("defines 8 unique categories with at least 5 unique prompts each", () => {
    assert.equal(INSPIRATION_CATEGORIES.length, 8);
    const categoryIds = new Set<string>();
    const promptIds = new Set<string>();

    for (const category of INSPIRATION_CATEGORIES) {
      assert.equal(categoryIds.has(category.id), false);
      categoryIds.add(category.id);
      assert.ok(category.prompts.length >= 5);

      for (const prompt of category.prompts) {
        assert.equal(promptIds.has(prompt.id), false);
        promptIds.add(prompt.id);
        assert.equal(prompt.categoryId, category.id);
      }
    }
  });

  it("looks up prompts by ID and returns undefined for unknown or empty IDs", () => {
    const found = getInspirationPromptById("futureReflections.personToBecome");
    assert.ok(found);
    assert.equal(found.categoryId, "futureReflections");
    assert.equal(
      found.textKey,
      "inspireMe.categories.futureReflections.prompts.personToBecome",
    );
    assert.equal(getInspirationPromptById("unknown.id"), undefined);
    assert.equal(getInspirationPromptById(null), undefined);
    assert.equal(getInspirationPromptById(undefined), undefined);
  });

  it("resolves every category and prompt key to non-empty strings in both en and es", () => {
    const uiKeys = [
      "inspireMe.buttonLabel",
      "inspireMe.buttonAria",
      "inspireMe.activePromptLabel",
      "inspireMe.drawerTitle",
      "inspireMe.drawerSubtitle",
      "inspireMe.categoriesAria",
      "inspireMe.close",
      "inspireMe.usePrompt",
      "inspireMe.selected",
      "inspireMe.removePrompt",
      "inspireMe.onePromptLimit",
      "inspireMe.emptyCategory",
    ];

    for (const key of uiKeys) {
      const enVal = resolveKeyPath(enDict, key);
      const esVal = resolveKeyPath(esDict, key);
      assert.equal(typeof enVal, "string", `Missing EN key: ${key}`);
      assert.equal(typeof esVal, "string", `Missing ES key: ${key}`);
      assert.ok((enVal as string).trim().length > 0);
      assert.ok((esVal as string).trim().length > 0);
    }

    for (const category of INSPIRATION_CATEGORIES) {
      for (const key of [category.nameKey, category.descriptionKey]) {
        const enVal = resolveKeyPath(enDict, key);
        const esVal = resolveKeyPath(esDict, key);
        assert.equal(typeof enVal, "string", `Missing EN key: ${key}`);
        assert.equal(typeof esVal, "string", `Missing ES key: ${key}`);
        assert.ok((enVal as string).trim().length > 0);
        assert.ok((esVal as string).trim().length > 0);
      }

      for (const prompt of category.prompts) {
        const enVal = resolveKeyPath(enDict, prompt.textKey);
        const esVal = resolveKeyPath(esDict, prompt.textKey);
        assert.equal(
          typeof enVal,
          "string",
          `Missing EN key: ${prompt.textKey}`,
        );
        assert.equal(
          typeof esVal,
          "string",
          `Missing ES key: ${prompt.textKey}`,
        );
        assert.ok((enVal as string).trim().length > 0);
        assert.ok((esVal as string).trim().length > 0);
      }
    }
  });
});
