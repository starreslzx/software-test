import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import { ZipAFolder, COMPRESSION_LEVEL } from '../../../../../../../../../../subject_repositories/zip-a-folder/lib/ZipAFolder';

describe('ZipAFolder.tar default compression', () => {
    it('produces a gzipped tar (not a plain tar) when no options are provided', async () => {
        const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'zipafolder-tar-'));
        const srcDir = path.join(tmpDir, 'src');
        fs.mkdirSync(srcDir);
        fs.writeFileSync(path.join(srcDir, 'file.txt'), 'hello world content that should be compressed');

        const tarFilePath = path.join(tmpDir, 'out.tar');

        try {
            await ZipAFolder.tar(srcDir, tarFilePath);

            const buffer = fs.readFileSync(tarFilePath);
            expect(buffer.length).toBeGreaterThan(0);

            // A gzipped tar starts with the gzip magic bytes 0x1f 0x8b.
            // A plain (uncompressed) tar would not.
            expect(buffer[0]).toBe(0x1f);
            expect(buffer[1]).toBe(0x8b);
        } finally {
            fs.rmSync(tmpDir, { recursive: true, force: true });
        }
    });
});