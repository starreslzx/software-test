import { GeoPoint } from "../../../../../../../../../../../../subject_repositories/node-geo-point/src/geo-point.ts";

describe("GeoPoint longitude validation", () => {
  it("throws a RangeError with a descriptive message when longitude is out of range", () => {
    expect(() => new GeoPoint(0, 181)).toThrow(RangeError);
    expect(() => new GeoPoint(0, 181)).toThrow("bad longitude value");
    expect(() => new GeoPoint(45, -181)).toThrow("bad longitude value");
  });
});