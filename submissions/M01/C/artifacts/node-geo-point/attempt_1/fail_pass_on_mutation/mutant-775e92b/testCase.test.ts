import { GeoPoint } from "../../../../../../../../../../../subject_repositories/node-geo-point/src/geo-point.ts";

describe("GeoPoint.fromObject", () => {
  it("throws a TypeError when the argument is not an object", () => {
    expect(() => GeoPoint.fromObject(42 as any)).toThrow(TypeError);
    expect(() => GeoPoint.fromObject("not an object" as any)).toThrow(TypeError);
    expect(() => GeoPoint.fromObject(true as any)).toThrow(TypeError);
  });
});