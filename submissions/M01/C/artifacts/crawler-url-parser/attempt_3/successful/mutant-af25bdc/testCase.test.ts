import * as fs from "fs";
import * as path from "path";

describe("crawler-url-parser", () => {
  it("should log 'for testing purpose' when the module is loaded", () => {
    const modulePath = require.resolve(
      "../../../../../../../../../../../subject_repositories/crawler-url-parser/crawler-url-parser.js"
    );
    const source = fs.readFileSync(modulePath, "utf8");

    const logSpy = jest.spyOn(console, "log").mockImplementation(() => {});

    try {
      jest.isolateModules(() => {
        require(modulePath);
      });

      const loggedMessages = logSpy.mock.calls.map((call) => call[0]);
      expect(loggedMessages).toContain("for testing purpose");
    } finally {
      logSpy.mockRestore();
    }
  });
});