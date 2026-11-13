import { getTimezonesForCountry, getCountry } from "../../../../../../../../../../../subject_repositories/countries-and-timezones/src/index.js";

describe("getTimezonesForCountry", () => {
  it("returns timezone objects for a country with timezones", () => {
    const country = getCountry("US");
    const result = getTimezonesForCountry("US");
    expect(result).not.toBeNull();
    expect(result!.length).toBe(country!.timezones.length);
    expect(result!.every((tz) => tz && typeof tz.name === "string")).toBe(true);
    expect(result!.map((tz) => tz.name)).toEqual(country!.timezones);
  });
});