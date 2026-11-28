import { getTimezonesForCountry } from "../../../../../../../../../../../subject_repositories/countries-and-timezones/src/index.js";

describe("getTimezonesForCountry", () => {
  it("returns timezone data for a known country", () => {
    const result = getTimezonesForCountry("US");
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBeGreaterThan(0);
    expect(result.every((tz) => typeof tz.name === "string")).toBe(true);
  });
});