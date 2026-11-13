import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import Dirty from '../../../../../../../../../../../subject_repositories/node-dirty/lib/dirty/dirty.js';

describe('Dirty drain event when write stream drains', () => {
  it('emits drain after the write stream drains and all writes are complete', (done) => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'dirty-test-'));
    const dbPath = path.join(dir, 'db');

    const db = new Dirty(dbPath);

    let loadDone = false;
    let drainCount = 0;

    db.on('error', (err: Error) => {
      try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) {}
      done(err);
    });

    db.on('load', () => {
      loadDone = true;
      // Write a large amount of data to force the write stream to return false
      // (backpressure), so that the 'drain' handler on the write stream fires.
      const bigValue = 'x'.repeat(1024 * 1024);
      let pending = 0;
      const total = 20;

      for (let i = 0; i < total; i++) {
        pending++;
        db.set('key' + i, bigValue, (err?: Error) => {
          if (err) {
            try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) {}
            return done(err);
          }
          pending--;
          if (pending === 0) {
            // All writes persisted; now wait for the drain event that should be
            // emitted once the write stream drains and no writes are in flight.
            db.once('drain', () => {
              drainCount++;
              // Verify all data is present.
              for (let j = 0; j < total; j++) {
                expect(db.get('key' + j)).toBe(bigValue);
              }
              expect(loadDone).toBe(true);
              expect(drainCount).toBeGreaterThanOrEqual(1);
              db.close();
              try { fs.rmSync(dir, { recursive: true, force: true }); } catch (e) {}
              done();
            });
          }
        });
      }
    });
  }, 30000);
});