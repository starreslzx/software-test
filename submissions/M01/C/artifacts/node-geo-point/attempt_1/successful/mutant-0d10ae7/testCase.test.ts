import { GeoPoint } from "../../../../../../../../../../../subject_repositories/node-geo-point/src/geo-point.ts";

describe("GeoPoint constructor longitude boundary", () => {
  it("accepts longitude of -180 as a valid coordinate", () => {
    const point = new GeoPoint(0, -180);
    expect(point.longitude).toBe(-180);
    expect(point.latitude).toBe(0);
  });
});