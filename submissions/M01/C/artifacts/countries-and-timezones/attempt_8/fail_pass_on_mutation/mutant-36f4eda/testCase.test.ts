import { getTimezonesForCountry } from "../../../../../../../../../../../subject_repositories/countries-and-timezones/src/index.js";

describe("getTimezonesForCountry", () => {
  it("returns results whose length matches the country's timezone count and excludes the placeholder", () => {
    const result = getTimezonesForCountry("US");
    expect(result).not.toBeNull();
    // The placeholder string "Stryker was here" is not a real timezone name.
    expect(result!.some((tz) => tz && tz.name === "Stryker was here")).toBe(false);
    // Every returned entry must be a real timezone object with a name.
    expect(result!.every((tz) => tz && typeof tz.name === "string")).toBe(true);
    // The count must match the number of US timezones (not one extra from the placeholder).
    expect(result!.length).toBe(29);
  });
});