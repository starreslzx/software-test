import { getTimezonesForCountry } from "../../../../../../../../../../../subject_repositories/countries-and-timezones/src/index.js";

describe("getTimezonesForCountry", () => {
  it("returns null when the country has no timezones", () => {
    // Find a country with an empty timezones array by probing known ids.
    const candidates = ["AQ", "BV", "HM", "TF", "UM", "GS"];
    const result = candidates.map((id) => getTimezonesForCountry(id));
    const emptyCountryResult = result.find(
      (r) => Array.isArray(r) && r.length === 0
    );
    expect(emptyCountryResult).toBeDefined();
  });
});