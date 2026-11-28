const Q: any = require("../../../../../../../../../../../../subject_repositories/q/q.js");

function parseStackFileName(line: string): string | undefined {
  const named = /at .+ \((.+):(\d+):(?:\d+)\)$/.exec(line);
  if (named) return named[1];
  const anonymous = /at ([^ ]+):(\d+):(?:\d+)$/.exec(line);
  if (anonymous) return anonymous[1];
  const firefox = /.*@(.+):(\d+)$/.exec(line);
  if (firefox) return firefox[1];
  return undefined;
}

function getQFileName(): Promise<string> {
  Q.longStackSupport = false;
  return new Promise((resolve, reject) => {
    Q.fcall(function () {
      throw new Error("probe");
    }).then(null, function (error: any) {
      const lines = String(error.stack).split("\n");
      for (const line of lines) {
        const fileName = parseStackFileName(line);
        if (fileName && /q\.js$/.test(fileName)) {
          resolve(fileName);
          return;
        }
      }
      reject(new Error("could not locate q.js frame"));
    });
  });
}

describe("Q long stack trace filtering", () => {
  it("keeps a frame that is before the Q source range", async () => {
    const qFileName = await getQFileName();

    Q.longStackSupport = true;
    const deferred = Q.defer();
    const fake = new Error("fake");
    fake.stack = "Error: fake\n    at fakeFrame (" + qFileName + ":1:1)";
    deferred.reject(fake);

    const filtered = await new Promise<any>((resolve) => {
      deferred.promise.then(null, function (error: any) {
        resolve(error);
      });
    });

    expect(String(filtered.stack)).toContain(qFileName + ":1:1");
  });
});