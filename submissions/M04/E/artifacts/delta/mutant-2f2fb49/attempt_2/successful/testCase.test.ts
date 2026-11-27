const modulePatterns = [
  "subject_repositories/delta/src/AttributeMap.ts",
  "subject_repositories/delta/src/AttributeMap",
  "repositories/delta/src/AttributeMap.ts",
  "repositories/delta/src/AttributeMap",
  "delta/src/AttributeMap.ts",
  "delta/src/AttributeMap",
  "subject_repositories/delta/AttributeMap.ts",
  "subject_repositories/delta/AttributeMap",
  "delta/AttributeMap.ts",
  "delta/AttributeMap",
];

async function loadAttributeMap(): Promise<any> {
  for (let depth = 1; depth <= 15; depth += 1) {
    const prefix = "../".repeat(depth);
    for (const pattern of modulePatterns) {
      try {
        const imported = await import(prefix + pattern);
        const candidate = imported && imported.default ? imported.default : imported;
        if (
          candidate &&
          typeof candidate.compose === "function" &&
          typeof candidate.diff === "function" &&
          typeof candidate.invert === "function" &&
          typeof candidate.transform === "function"
        ) {
          return candidate;
        }
      } catch (e) {
        // Try the next candidate.
      }
    }
  }
  throw new Error("Could not locate the AttributeMap module");
}

describe("AttributeMap.compose", () => {
  it("treats a non-object second argument as an empty attribute map", async () => {
    const AttributeMap = await loadAttributeMap();
    expect(AttributeMap.compose(undefined, "not-an-attribute-map")).toBeUndefined();
  });
});