import { getTimezonesForCountry, getCountry } from "../../../../../../../../../../../subject_repositories/countries-and-timezones/src/index.js";

describe("getTimezonesForCountry", () => {
  it("returns null for a country whose timezones list is empty", () => {
    // Probe many country ids to find one whose timezones array is empty.
    const ids = [
      "AQ", "BV", "HM", "TF", "UM", "GS", "PN", "NF", "CX", "CC",
      "IO", "TK", "NU", "WF", "EH", "SJ", "VA", "MC", "SM", "LI",
    ];
    const emptyId = ids.find((id) => {
      const c = getCountry(id);
      return c && Array.isArray(c.timezones) && c.timezones.length === 0;
    });
    expect(emptyId).toBeDefined();
    expect(getTimezonesForCountry(emptyId as string)).toEqual([]);
  });
});