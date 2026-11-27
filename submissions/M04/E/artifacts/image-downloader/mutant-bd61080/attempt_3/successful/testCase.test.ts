const os = require("os");
const path = require("path");
const nock = require("nock");

function loadRequestModule() {
  for (let depth = 4; depth <= 20; depth++) {
    const candidate =
      "../".repeat(depth) +
      "subject_repositories/image-downloader/lib/request.js";
    let resolved: string | undefined;
    try {
      resolved = require.resolve(candidate);
    } catch (e) {
      resolved = undefined;
    }
    if (resolved) {
      return require(resolved);
    }
  }
  throw new Error("Unable to locate subject request module");
}

const request = loadRequestModule();

describe("request", () => {
  afterEach(() => {
    nock.cleanAll();
    nock.enableNetConnect();
  });

  it("rejects with a message that includes the HTTP status code for non-200 responses", async () => {
    nock.disableNetConnect();

    nock("http://example.com")
      .get("/image.jpg")
      .reply(404, "Not Found");

    const dest = path.join(os.tmpdir(), "image-downloader-status-test.jpg");

    await expect(
      request({ url: "http://example.com/image.jpg", dest })
    ).rejects.toThrow("Status Code: 404");
  });
});