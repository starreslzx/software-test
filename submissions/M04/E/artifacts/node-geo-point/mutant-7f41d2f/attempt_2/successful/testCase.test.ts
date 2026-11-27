import { GeoPoint } from "../../../../../../../../../../../../subject_repositories/node-geo-point/src/geo-point.ts";

describe('GeoPoint.calculateDestination', () => {
  it('should compute the correct destination longitude when travelling east from 45°N', () => {
    // Start at 45°N, 0°E, travel 1000 km due east (bearing 90°).
    // With the correct formula the longitude works out to roughly +12.615°.
    const destination = GeoPoint.calculateDestination(
      { latitude: 45, longitude: 0 },
      1000000,
      90,
    );

    expect(destination.longitude).toBeCloseTo(12.615, 2);
  });
});