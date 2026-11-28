import { GeoPoint } from "../../../../../../../../../../../subject_repositories/node-geo-point/src/geo-point.ts";

describe("GeoPoint.fromGeoJSON", () => {
  it("throws a TypeError when the type is not 'Point'", () => {
    const invalidGeoJSON = {
      type: "Polygon",
      coordinates: [10, 20],
    } as any;

    expect(() => GeoPoint.fromGeoJSON(invalidGeoJSON)).toThrow(TypeError);
    expect(() => GeoPoint.fromGeoJSON(invalidGeoJSON)).toThrow(
      "The value of type should be 'Point'"
    );
  });
});