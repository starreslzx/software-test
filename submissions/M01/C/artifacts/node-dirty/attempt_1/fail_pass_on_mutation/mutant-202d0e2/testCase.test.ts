import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import Dirty from '../../../../../../../../../../../subject_repositories/node-dirty/lib/dirty/dirty.js';

describe('Dirty drain after write stream drain event', () => {
  it('emits drain when queued writes are flushed after backpressure is relieved', (done) => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dirty-test-'));
    const dbPath = path.join(tmpDir, 'db.json');

    const db = new Dirty(dbPath);

    db.on('load', () => {
      // Write a large value to trigger backpressure on the write stream.
      const largeValue = 'x'.repeat(1024 * 1024);
      db.set('big', largeValue, () => {
        // After the first write completes, queue another write.
        db.set('small', 'value', () => {
          // Both writes persisted; now close and verify.
          db.close();
        });
      });

      // The 'drain' event must eventually fire so close() can proceed.
      db.once('drain', () => {
        // Verify data was persisted by reading the file.
        const contents = fs.readFileSync(dbPath, 'utf-8');
        const lines = contents.split('\n').filter((l) => l.length > 0);
        expect(lines.length).toBeGreaterThanOrEqual(1);

        // Clean up.
        fs.rmSync(tmpDir, { recursive: true, force: true });
        done();
      });
    });

    db.on('error', (err) => {
      fs.rmSync(tmpDir, { recursive: true, force: true });
      done(err);
    });
  }, 15000);
});