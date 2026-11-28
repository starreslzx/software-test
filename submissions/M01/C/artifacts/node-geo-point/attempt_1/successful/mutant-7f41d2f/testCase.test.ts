import { GeoPoint } from "../../../../../../../../../../../subject_repositories/node-geo-point/src/geo-point.ts";

describe("GeoPoint.calculateDestination", () => {
  it("computes the correct destination longitude when moving east from a mid-latitude point", () => {
    const start = new GeoPoint(45, 0);
    const destination = GeoPoint.calculateDestination(start, 100000, 90);

    // Moving 100 km due east from (45, 0) should land near longitude ~1.27 degrees
    // and latitude ~45 degrees. The mutated sign in the x term produces a
    // noticeably different longitude.
    expect(destination.latitude).toBeCloseTo(45, 1);
    expect(destination.longitude).toBeCloseTo(1.2715, 2);
  });
});