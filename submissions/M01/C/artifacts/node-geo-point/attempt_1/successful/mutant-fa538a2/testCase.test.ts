import { GeoPoint } from "../../../../../../../../../../../subject_repositories/node-geo-point/src/geo-point.ts";

describe("GeoPoint constructor longitude validation", () => {
  it("throws a RangeError with the message 'bad longitude value' for out-of-range longitude", () => {
    expect(() => new GeoPoint(0, 181)).toThrow(RangeError);
    expect(() => new GeoPoint(0, 181)).toThrow("bad longitude value");
    expect(() => new GeoPoint(0, -181)).toThrow(RangeError);
    expect(() => new GeoPoint(0, -181)).toThrow("bad longitude value");
  });
});