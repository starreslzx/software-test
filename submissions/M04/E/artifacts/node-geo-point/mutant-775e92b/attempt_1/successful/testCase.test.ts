import { GeoPoint } from "../../../../../../../../../../../../subject_repositories/node-geo-point/src/geo-point.ts";

describe('GeoPoint.fromGeoJSON', () => {
  it('rejects callable values that carry point-like properties instead of treating them as objects', () => {
    const fakePoint = Object.assign(() => undefined, {
      type: 'Point',
      coordinates: [13.405, 52.52],
    });

    expect(() => GeoPoint.fromGeoJSON(fakePoint as any)).toThrow('GeoPoint: Argument must be an object');
  });
});