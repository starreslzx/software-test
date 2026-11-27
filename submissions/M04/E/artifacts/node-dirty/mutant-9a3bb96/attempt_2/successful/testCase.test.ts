import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';

function loadDirtyModule(): any {
  const segments = ['subject_repositories', 'node-dirty', 'lib', 'dirty', 'dirty.js'];
  let current = __dirname;

  for (let depth = 0; depth < 30; depth++) {
    const candidate = path.join(current, ...segments);
    if (fs.existsSync(candidate)) {
      return require(candidate);
    }

    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }

  throw new Error('Could not locate the node-dirty library');
}

const Dirty = loadDirtyModule();

describe('Dirty close', () => {
  it('waits for buffered/queued writes to be persisted before closing', async () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), 'dirty-close-'));
    const dbPath = path.join(directory, 'data.db');

    const db = new Dirty(dbPath);
    await new Promise<void>((resolve) => db.once('load', () => resolve()));

    // Keep the write stream from producing unhandled error noise; the
    // observable behaviour we assert on is which rows actually reach disk.
    db._writeStream.on('error', () => {});

    const persisted: string[] = [];
    const largeValue = 'x'.repeat(2 * 1024 * 1024);

    db.set('large', largeValue, () => persisted.push('large'));
    db.set('small', 'small-value', () => persisted.push('small'));

    await new Promise<void>((resolve) => {
      db.once('write_close', () => resolve());
      db.close();
    });

    expect(persisted).toEqual(expect.arrayContaining(['large', 'small']));

    const keys = fs.readFileSync(dbPath, 'utf8')
        .split('\n')
        .filter((line) => line.trim().length > 0)
        .map((line) => JSON.parse(line).key);

    expect(keys).toEqual(expect.arrayContaining(['large', 'small']));

    try {
      (fs as any).rmSync(directory, {recursive: true, force: true});
    } catch (e) {
      // ignore cleanup failures
    }
  });
});