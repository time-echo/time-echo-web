import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  insertPromptIntoDraft,
  hasPromptInDraft,
  removePromptFromDraft,
} from "../insertPromptIntoDraft";

describe("insertPromptIntoDraft", () => {
  it("inserts a prompt cleanly into an empty draft", () => {
    const result = insertPromptIntoDraft(
      "",
      "What kind of person do you hope to become?",
    );
    assert.equal(result.exceedsMaxLength, false);
    assert.equal(
      result.content,
      "What kind of person do you hope to become?\n\n",
    );
    assert.equal(result.caretPosition, result.content.length);
  });

  it("treats a whitespace-only draft as empty", () => {
    const result = insertPromptIntoDraft(
      "   \n  ",
      "What moment do you never want to forget?",
    );
    assert.equal(result.exceedsMaxLength, false);
    assert.equal(
      result.content,
      "What moment do you never want to forget?\n\n",
    );
  });

  it("appends non-destructively after existing draft content", () => {
    const result = insertPromptIntoDraft(
      "Dear future self, today was a good day.",
      "What little things make you happy right now?",
    );
    assert.equal(result.exceedsMaxLength, false);
    assert.equal(
      result.content,
      "Dear future self, today was a good day.\n\nWhat little things make you happy right now?\n\n",
    );
  });

  it("avoids triple newlines when draft already ends with newlines", () => {
    const singleNewline = insertPromptIntoDraft("Hello\n", "Prompt?");
    assert.equal(singleNewline.content, "Hello\n\nPrompt?\n\n");

    const doubleNewline = insertPromptIntoDraft("Hello\n\n", "Prompt?");
    assert.equal(doubleNewline.content, "Hello\n\nPrompt?\n\n");
  });

  it("does not mutate draft when insertion would exceed maxLength", () => {
    const longDraft = "a".repeat(1990);
    const result = insertPromptIntoDraft(
      longDraft,
      "What advice would you give your future self?",
      2000,
    );
    assert.equal(result.exceedsMaxLength, true);
    assert.equal(result.content, longDraft);
    assert.equal(result.caretPosition, longDraft.length);
  });
});

describe("hasPromptInDraft & removePromptFromDraft", () => {
  it("detects whether an applied prompt is still present in the draft", () => {
    const prompt = "What kind of person do you hope to become?";
    assert.equal(
      hasPromptInDraft(`${prompt}\n\nI want to be kinder.`, prompt),
      true,
    );
    assert.equal(hasPromptInDraft("I erased the prompt.", prompt), false);
    assert.equal(hasPromptInDraft("Some draft", null), false);
  });

  it("removes only the inserted prompt while preserving user writing", () => {
    const prompt = "What little things make you happy right now?";
    const draft = `Dear future me,\n\n${prompt}\n\nMorning coffee and quiet walks.`;
    assert.equal(
      removePromptFromDraft(draft, prompt),
      "Dear future me,\n\nMorning coffee and quiet walks.",
    );
  });

  it("leaves an empty string when the prompt was the only content", () => {
    const prompt = "What moment do you never want to forget?";
    assert.equal(removePromptFromDraft(`${prompt}\n\n`, prompt), "");
  });
});
