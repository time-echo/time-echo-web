export interface InsertPromptResult {
  content: string;
  caretPosition: number;
  exceedsMaxLength: boolean;
}

export function hasPromptInDraft(
  currentContent: string,
  promptText: string | null | undefined,
): boolean {
  const normalizedPrompt = promptText?.trim();
  if (!normalizedPrompt) return false;
  return currentContent.includes(normalizedPrompt);
}

export function insertPromptIntoDraft(
  currentContent: string,
  promptText: string,
  maxLength = 2000,
): InsertPromptResult {
  const normalizedPrompt = promptText.trim();
  if (!normalizedPrompt) {
    return {
      content: currentContent,
      caretPosition: currentContent.length,
      exceedsMaxLength: false,
    };
  }

  let nextContent: string;

  if (currentContent.trim().length === 0) {
    nextContent = `${normalizedPrompt}\n\n`;
  } else if (currentContent.endsWith("\n\n")) {
    nextContent = `${currentContent}${normalizedPrompt}\n\n`;
  } else if (currentContent.endsWith("\n")) {
    nextContent = `${currentContent}\n${normalizedPrompt}\n\n`;
  } else {
    nextContent = `${currentContent}\n\n${normalizedPrompt}\n\n`;
  }

  if (nextContent.length > maxLength) {
    return {
      content: currentContent,
      caretPosition: currentContent.length,
      exceedsMaxLength: true,
    };
  }

  return {
    content: nextContent,
    caretPosition: nextContent.length,
    exceedsMaxLength: false,
  };
}

export function removePromptFromDraft(
  currentContent: string,
  promptText: string,
): string {
  const normalizedPrompt = promptText.trim();
  if (!normalizedPrompt) return currentContent;

  const index = currentContent.indexOf(normalizedPrompt);
  if (index === -1) return currentContent;

  const before = currentContent.slice(0, index);
  const after = currentContent.slice(index + normalizedPrompt.length);

  const trimmedBefore = before.replace(/\n+$/, "");
  const trimmedAfter = after.replace(/^\n+/, "");

  if (!trimmedBefore) return trimmedAfter;
  if (!trimmedAfter) return trimmedBefore;
  return `${trimmedBefore}\n\n${trimmedAfter}`;
}
