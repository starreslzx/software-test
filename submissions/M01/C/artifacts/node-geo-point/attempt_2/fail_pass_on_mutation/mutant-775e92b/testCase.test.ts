import { GeoPoint } from "../../../../../../../../../../../subject_repositories/node-geo-point/src/geo-point.ts";

describe("GeoPoint.fromObject", () => {
  it("throws a TypeError when the argument is a primitive value", () => {
    expect(() => GeoPoint.fromObject(42 as any)).toThrow(TypeError);
  });
});