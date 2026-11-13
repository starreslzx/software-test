import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import Dirty from '../../../../../../../../../../../subject_repositories/node-dirty/lib/dirty/dirty.js';

describe('Dirty resumes flushing queued writes after write stream drain', () => {
  it('persists all queued writes to disk after backpressure is relieved', (done) => {
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'dirty-test-'));
    const dbPath = path.join(tmpDir, 'db.json');

    const db = new Dirty(dbPath);

    db.on('error', (err) => {
      fs.rmSync(tmpDir, { recursive: true, force: true });
      done(err);
    });

    db.on('load', () => {
      // Write a large value first to trigger backpressure on the write stream.
      const largeValue = 'x'.repeat(2 * 1024 * 1024);
      db.set('big', largeValue);

      // While the write stream is under backpressure, queue additional writes.
      // These will not be flushed immediately; they must be flushed after
      // the write stream emits 'drain'.
      db.set('a', 1);
      db.set('b', 2);
      db.set('c', 3);

      // Wait for the final drain to fire once everything is written.
      db.once('drain', () => {
        // Give the OS a moment to flush the file to disk.
        setTimeout(() => {
          const contents = fs.readFileSync(dbPath, 'utf-8');
          const lines = contents.split('\n').filter((l) => l.length > 0);
          const keys = lines.map((l) => JSON.parse(l).key);

          // All four keys must have been persisted. If the mutation is present,
          // the queued writes ('a', 'b', 'c') are never flushed after the
          // initial backpressure write completes.
          expect(keys).toContain('big');
          expect(keys).toContain('a');
          expect(keys).toContain('b');
          expect(keys).toContain('c');

          fs.rmSync(tmpDir, { recursive: true, force: true });
          done();
        }, 200);
      });
    });
  }, 20000);
});