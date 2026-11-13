import { GeoPoint } from "../../../../../../../../../../../subject_repositories/node-geo-point/src/geo-point.ts";

describe("GeoPoint.fromObject", () => {
  it("throws a specific TypeError message when passed a primitive number", () => {
    expect(() => GeoPoint.fromObject(42 as any)).toThrow("GeoPoint: Argument must be an object");
  });
});