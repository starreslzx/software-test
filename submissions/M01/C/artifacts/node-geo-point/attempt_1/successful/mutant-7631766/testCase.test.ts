import { GeoPoint } from "../../../../../../../../../../../subject_repositories/node-geo-point/src/geo-point.ts";

describe("GeoPoint.fromObject", () => {
  it("throws a TypeError when the object is missing latitude or longitude", () => {
    expect(() => GeoPoint.fromObject({ longitude: 10 } as any)).toThrow(
      new TypeError("Object must have latitude and longitude"),
    );
    expect(() => GeoPoint.fromObject({ latitude: 10 } as any)).toThrow(
      new TypeError("Object must have latitude and longitude"),
    );
  });
});