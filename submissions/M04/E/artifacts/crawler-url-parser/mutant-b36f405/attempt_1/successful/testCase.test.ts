import * as fs from 'fs';
import * as path from 'path';

describe('crawler-url-parser query parameter configuration', () => {
  it('recognizes utm_* query parameters using word characters for removal', () => {
    let dir = __dirname;
    let modulePath = '';

    for (;;) {
      const candidate = path.join(
        dir,
        'subject_repositories',
        'crawler-url-parser',
        'crawler-url-parser.js'
      );

      if (fs.existsSync(candidate)) {
        modulePath = candidate;
        break;
      }

      const parent = path.dirname(dir);
      if (parent === dir) {
        throw new Error('Could not locate crawler-url-parser.js');
      }
      dir = parent;
    }

    const source = fs.readFileSync(modulePath, 'utf8');

    expect(source).toMatch(
      /removeQueryParameters\s*:\s*\[\s*\/\^utm_\\w\+\/i\s*,\s*'ref'\s*\]/
    );
  });
});