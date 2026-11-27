import { getTimezonesForCountry } from "../../../../../../../../../../../../subject_repositories/countries-and-timezones/src/index.js";

jest.mock(
  "../../../../../../../../../../../../subject_repositories/countries-and-timezones/src/build-country.js",
  () => ({
    __esModule: true,
    default: () => ({
      id: "XX",
      name: "Test Land",
      timezones: undefined,
      allTimezones: undefined,
    }),
  })
);

jest.mock(
  "../../../../../../../../../../../../subject_repositories/countries-and-timezones/src/build-timezone.js",
  () => ({
    __esModule: true,
    default: (_data: unknown, name: string) => ({ name, countries: [] }),
  })
);

describe("getTimezonesForCountry", () => {
  it("returns an empty array for a country without any timezones", () => {
    expect(getTimezonesForCountry("XX")).toEqual([]);
  });
});