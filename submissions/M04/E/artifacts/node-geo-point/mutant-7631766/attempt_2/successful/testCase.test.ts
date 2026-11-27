import * as fs from "fs";
import * as path from "path";

function locateModuleBase(startDirectory: string): string | null {
  let current = startDirectory;
  const repoNames = ["node-geo-point", "geo-point"];

  for (let depth = 0; depth < 25; depth++) {
    for (const repoName of repoNames) {
      const base = path.join(
        current,
        "subject_repositories",
        repoName,
        "src",
        "geo-point",
      );

      if (fs.existsSync(`${base}.ts`) || fs.existsSync(`${base}.js`)) {
        return base;
      }
    }

    const parent = path.dirname(current);
    if (parent === current) {
      return null;
    }
    current = parent;
  }

  return null;
}

const moduleBase =
  locateModuleBase(__dirname) ?? locateModuleBase(process.cwd());

if (!moduleBase) {
  throw new Error("Unable to locate the GeoPoint module");
}

const relativeSpecifier = path
  .relative(__dirname, moduleBase)
  .split(path.sep)
  .join("/");

const { GeoPoint } = require(relativeSpecifier);

describe("GeoPoint.fromObject", () => {
  it("throws a TypeError when the latitude or longitude property is missing", () => {
    expect(() => GeoPoint.fromObject({ longitude: 13.405 })).toThrow(TypeError);
    expect(() => GeoPoint.fromObject({ latitude: 52.52 })).toThrow(TypeError);
  });
});