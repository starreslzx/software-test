import { getTimezonesForCountry } from "../../../../../../../../../../../subject_repositories/countries-and-timezones/src/index.js";

describe("getTimezonesForCountry", () => {
  it("does not return a placeholder timezone for a country with timezones", () => {
    const result = getTimezonesForCountry("US");
    expect(result).not.toBeNull();
    expect(result!.some((tz) => tz && tz.name === "Stryker was here")).toBe(false);
  });
});