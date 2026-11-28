import { getTimezonesForCountry } from "../../../../../../../../../../../subject_repositories/countries-and-timezones/src/index.js";

describe("getTimezonesForCountry", () => {
  it("returns null for an unknown country id", () => {
    expect(getTimezonesForCountry("XX")).toBeNull();
  });
});