import { registerHooks } from "node:module";
import { existsSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const rootSrcDir = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "../../../",
);

function tryResolveTsFile(candidateBase) {
  for (const suffix of [".ts", ".tsx", "/index.ts", "/index.tsx", ".js"]) {
    const full = `${candidateBase}${suffix}`;
    if (existsSync(full)) {
      return pathToFileURL(full).href;
    }
  }
  return null;
}

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (specifier.startsWith("@/")) {
      const target = resolve(rootSrcDir, specifier.slice(2));
      const resolved = tryResolveTsFile(target);
      if (resolved) {
        return { url: resolved, shortCircuit: true };
      }
    }

    if (
      (specifier.startsWith("./") || specifier.startsWith("../")) &&
      context.parentURL
    ) {
      const parentDir = dirname(fileURLToPath(context.parentURL));
      const target = resolve(parentDir, specifier);
      const resolved = tryResolveTsFile(target);
      if (resolved) {
        return { url: resolved, shortCircuit: true };
      }
    }

    return nextResolve(specifier, context);
  },
});
