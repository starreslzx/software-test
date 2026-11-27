declare function require(name: string): any;

const fs = require("fs");
const path = require("path");

function locateQ(): any {
  let dir: string = __dirname;
  for (let i = 0; i < 40; i++) {
    const candidates = [
      path.join(dir, "subject_repositories", "q", "q.js"),
      path.join(dir, "subject_repositories", "q.js"),
    ];
    for (let j = 0; j < candidates.length; j++) {
      if (fs.existsSync(candidates[j])) {
        return require(candidates[j]);
      }
    }
    const parent = path.dirname(dir);
    if (parent === dir) {
      break;
    }
    dir = parent;
  }
  throw new Error("Unable to locate the Q library source file");
}

const Q = locateQ();

describe("Q long stack trace filtering", () => {
  it("preserves the 'From previous event:' marker in a rejected promise's stack", () => {
    Q.longStackSupport = true;

    const deferred = Q.defer();
    const error = new Error("boom");
    deferred.reject(error);

    return Q(deferred.promise).then(
      () => {
        throw new Error("Expected the promise to be rejected");
      },
      (caught: any) => {
        expect(caught).toBe(error);
        expect(typeof caught.stack).toBe("string");
        expect(caught.stack).toContain("From previous event:");
      }
    );
  });
});