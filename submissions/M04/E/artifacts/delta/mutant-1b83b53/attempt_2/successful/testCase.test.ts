import * as fs from 'fs';
import * as path from 'path';

type TestEmbed = { value: string };

const loadDelta = (): any => {
  let dir = __dirname;
  for (;;) {
    const candidate = path.join(
      dir,
      'subject_repositories',
      'delta',
      'src',
      'Delta.ts',
    );
    if (fs.existsSync(candidate)) {
      const loaded = require(candidate);
      return loaded && loaded.default ? loaded.default : loaded;
    }
    const parent = path.dirname(dir);
    if (parent === dir) {
      break;
    }
    dir = parent;
  }
  throw new Error('Unable to locate subject_repositories/delta/src/Delta.ts');
};

const Delta = loadDelta();

describe('Delta.compose embed composition', () => {
  it('passes keepNull=true when composing two retained embeds', () => {
    let keepNullSeen: boolean | undefined;

    Delta.registerEmbed<TestEmbed>('test-embed', {
      compose: (a: TestEmbed, b: TestEmbed, keepNull: boolean): TestEmbed => {
        keepNullSeen = keepNull;
        return { value: `${a.value}+${b.value}${keepNull ? ':keep' : ':drop'}` };
      },
      invert: (a: TestEmbed): TestEmbed => a,
      transform: (a: TestEmbed, b: TestEmbed, priority: boolean): TestEmbed =>
        priority ? a : b,
    });

    const left = new Delta([{ retain: { 'test-embed': { value: 'left' } } }]);
    const right = new Delta([{ retain: { 'test-embed': { value: 'right' } } }]);

    const composed = left.compose(right);

    expect(keepNullSeen).toBe(true);
    expect(composed.ops).toEqual([
      { retain: { 'test-embed': { value: 'left+right:keep' } } },
    ]);

    Delta.unregisterEmbed('test-embed');
  });
});