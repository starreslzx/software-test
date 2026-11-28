import { GeoPoint } from "../../../../../../../../../../../../subject_repositories/node-geo-point/src/geo-point.ts";

describe("GeoPoint.fromGeoJSON", () => {
  it("throws a TypeError when the GeoJSON type is not 'Point'", () => {
    const notAPoint = {
      type: "LineString",
      coordinates: [13.404954, 52.520008],
    } as any;

    expect(() => GeoPoint.fromGeoJSON(notAPoint)).toThrow(TypeError);
  });
});