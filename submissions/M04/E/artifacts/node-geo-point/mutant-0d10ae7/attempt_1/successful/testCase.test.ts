import { GeoPoint } from "../../../../../../../../../../../../subject_repositories/node-geo-point/src/geo-point.ts";

describe("GeoPoint longitude boundary validation", () => {
  it("should accept a longitude of exactly -180 degrees", () => {
    const point = new GeoPoint(0, -180);

    expect(point.latitude).toBe(0);
    expect(point.longitude).toBe(-180);
    expect(point.toLngLatArray()).toEqual([-180, 0]);
  });
});