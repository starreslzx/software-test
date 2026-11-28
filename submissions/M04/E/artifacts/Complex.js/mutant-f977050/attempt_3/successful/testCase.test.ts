// @ts-nocheck
const fs = require('fs');
const path = require('path');
const vm = require('vm');

function isFile(candidate: string): boolean {
  try {
    return fs.statSync(candidate).isFile();
  } catch (e) {
    return false;
  }
}

function searchUpward(relativePaths: string[], maxLevels: number): string | null {
  let dir = __dirname;
  for (let level = 0; level < maxLevels; level++) {
    for (const relativePath of relativePaths) {
      const candidate = path.join(dir, relativePath);
      if (isFile(candidate)) {
        return candidate;
      }
    }
    const parent = path.dirname(dir);
    if (parent === dir) {
      break;
    }
    dir = parent;
  }
  return null;
}

function locateComplexSource(): string {
  const found =
    searchUpward([path.join('subject_repositories', 'Complex.js', 'complex.js')], 30) ||
    searchUpward([path.join('Complex.js', 'complex.js')], 30) ||
    searchUpward(['complex.js'], 30);
  if (!found) {
    throw new Error('Unable to locate the Complex.js source file');
  }
  return found;
}

function loadComplexConstructor() {
  const file = locateComplexSource();
  try {
    const loaded = require(file);
    return loaded && (loaded.default || loaded.Complex || loaded);
  } catch (e) {
    const source = fs.readFileSync(file, 'utf8');
    const moduleObj = { exports: {} };
    const sandbox = { module: moduleObj, exports: moduleObj.exports };
    vm.createContext(sandbox);
    vm.runInContext(source, sandbox, { filename: file });
    const loaded = sandbox.module.exports;
    return loaded && (loaded.default || loaded.Complex || loaded);
  }
}

const Complex = loadComplexConstructor();

describe('Complex.acosh', () => {
  it('returns a real value close to the inverse hyperbolic cosine for a real argument greater than one', () => {
    const result = new Complex(2, 0).acosh();

    expect(Number.isNaN(result.im)).toBe(false);
    expect(result.im).toBeCloseTo(0, 12);
    expect(result.re).toBeCloseTo(Math.log(2 + Math.sqrt(3)), 10);
  });
});