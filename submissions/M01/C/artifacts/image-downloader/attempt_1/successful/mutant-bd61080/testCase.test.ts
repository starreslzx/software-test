import * as path from "path";
import * as os from "os";
import * as fs from "fs";
import nock from "nock";
import request from "../../../../../../../../../../../subject_repositories/image-downloader/lib/request.js";

describe("request", () => {
  it("includes the status code in the error message when the response is not 200", async () => {
    const dest = path.join(os.tmpdir(), `image-downloader-test-${Date.now()}.bin`);

    nock("https://example.com")
      .get("/not-found")
      .reply(404, "Not Found");

    let error: Error | undefined;
    try {
      await request({ url: "https://example.com/not-found", dest });
    } catch (e) {
      error = e as Error;
    }

    expect(error).toBeInstanceOf(Error);
    expect(error!.message).toContain("Status Code: 404");

    if (fs.existsSync(dest)) {
      fs.unlinkSync(dest);
    }
  });
});