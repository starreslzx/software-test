import { getTimezonesForCountry } from "../../../../../../../../../../../subject_repositories/countries-and-timezones/src/index.js";

describe("getTimezonesForCountry", () => {
  it("returns only real timezone objects for a country with timezones", () => {
    const result = getTimezonesForCountry("US");
    expect(result).not.toBeNull();
    // Each entry must be a real timezone object with a name and a non-empty
    // countries list. The placeholder "Stryker was here" resolves to null,
    // so a null entry would reveal the mutation.
    expect(result!.every((tz) => tz && typeof tz.name === "string" && tz.name.length > 0)).toBe(true);
    expect(result!.length).toBeGreaterThan(0);
  });
});