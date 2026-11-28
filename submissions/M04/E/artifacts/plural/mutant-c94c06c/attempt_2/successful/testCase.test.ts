const fs = require("fs");
const path = require("path");

function loadPlural() {
  let current = __dirname;

  for (;;) {
    const candidate = path.join(current, "subject_repositories", "plural", "index.js");
    if (fs.existsSync(candidate)) {
      const relative = path.relative(__dirname, candidate).replace(/\\/g, "/");
      return require(relative.startsWith(".") ? relative : "./" + relative);
    }

    const parent = path.dirname(current);
    if (parent === current) {
      break;
    }
    current = parent;
  }

  throw new Error("Unable to locate subject_repositories/plural/index.js");
}

describe("plural", () => {
  it("pluralizes 'roof' as 'roofs' rather than 'rooves'", () => {
    const plural = loadPlural();
    expect(plural("roof")).toBe("roofs");
  });
});