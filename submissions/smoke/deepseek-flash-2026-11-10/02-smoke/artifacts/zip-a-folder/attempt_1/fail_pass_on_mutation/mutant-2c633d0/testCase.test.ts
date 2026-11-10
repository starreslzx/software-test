import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { ZipAFolder, COMPRESSION_LEVEL } from '../../../../../../../../../../../../docker_output/subject_repositories/zip-a-folder/lib/ZipAFolder';

describe('ZipAFolder.tar default compression', () => {
    it('produces a gzipped tar (not plain tar) when no options are provided', async () => {
        const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'zipafolder-test-'));
        const srcDir = path.join(tmpDir, 'src');
        fs.mkdirSync(srcDir);
        fs.writeFileSync(path.join(srcDir, 'file.txt'), 'hello world '.repeat(1000));

        const tarPath = path.join(tmpDir, 'out.tar');

        try {
            await ZipAFolder.tar(srcDir, tarPath);

            const buffer = fs.readFileSync(tarPath);
            expect(buffer.length).toBeGreaterThan(0);
            // A gzipped tar starts with the gzip magic bytes 0x1f 0x8b.
            expect(buffer[0]).toBe(0x1f);
            expect(buffer[1]).toBe(0x8b);
        } finally {
            fs.rmSync(tmpDir, { recursive: true, force: true });
        }
    });
});