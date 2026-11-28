import * as fs from 'fs';
import * as os from 'os';
import * as path from 'path';
import { COMPRESSION_LEVEL, zip } from '../../../../../../../../../../../../subject_repositories/zip-a-folder/lib/ZipAFolder.ts';

describe('ZipAFolder.zip with uncompressed compression level', () => {
    it('stores the entries without deflate compression', async () => {
        const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'zipafolder-'));
        const srcDir = path.join(tmpDir, 'src');
        const outFile = path.join(tmpDir, 'archive.zip');
        const fileName = 'payload_probe.txt';
        const fileContent = 'STORE_MARKER_ABCDEFGHIJKLMNOPQRSTUVWXYZ_0123456789';

        try {
            fs.mkdirSync(srcDir, { recursive: true });
            fs.writeFileSync(path.join(srcDir, fileName), fileContent);

            await zip(srcDir, outFile, { compression: COMPRESSION_LEVEL.uncompressed });

            const archive = fs.readFileSync(outFile);
            const nameIndex = archive.indexOf(Buffer.from(fileName));

            expect(nameIndex).toBeGreaterThanOrEqual(30);

            const localHeaderOffset = nameIndex - 30;
            const compressionMethod = archive.readUInt16LE(localHeaderOffset + 8);

            expect(compressionMethod).toBe(0);
        } finally {
            fs.rmSync(tmpDir, { recursive: true, force: true });
        }
    });
});