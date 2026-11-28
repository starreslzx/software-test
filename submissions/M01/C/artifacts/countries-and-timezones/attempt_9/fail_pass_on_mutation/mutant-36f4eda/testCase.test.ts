import { getTimezonesForCountry } from "../../../../../../../../../../../subject_repositories/countries-and-timezones/src/index.js";

describe("getTimezonesForCountry", () => {
  it("returns only valid timezone objects for a country with timezones", () => {
    const result = getTimezonesForCountry("US");
    expect(result).not.toBeNull();
    // Every entry must resolve to a real timezone object (not null).
    // With the mutation, the placeholder "Stryker was here" resolves to null.
    expect(result!.every((tz) => tz !== null && tz !== undefined)).toBe(true);
  });
});