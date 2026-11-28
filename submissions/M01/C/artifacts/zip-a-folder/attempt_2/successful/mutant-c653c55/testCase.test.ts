import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { ZipAFolder, COMPRESSION_LEVEL } from "../../../../../../../../../../../subject_repositories/zip-a-folder/lib/ZipAFolder.ts";

describe("ZipAFolder.zip with uncompressed compression level", () => {
    it("should store entries without deflate compression when COMPRESSION_LEVEL.uncompressed is used", async () => {
        const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "zipafolder-test-"));
        const srcDir = path.join(tmpDir, "src");
        const zipFilePath = path.join(tmpDir, "out.zip");

        try {
            fs.mkdirSync(srcDir);
            // Highly compressible content: with deflate it shrinks dramatically,
            // with store (no compression) the entry is stored at full size.
            const content = "A".repeat(100000);
            fs.writeFileSync(path.join(srcDir, "file.txt"), content);

            await ZipAFolder.zip(srcDir, zipFilePath, {
                compression: COMPRESSION_LEVEL.uncompressed,
            });

            const zipBuffer = fs.readFileSync(zipFilePath);

            // Locate the central directory file header signature (PK\x01\x02).
            const centralSig = Buffer.from([0x50, 0x4b, 0x01, 0x02]);
            const headerIndex = zipBuffer.indexOf(centralSig);
            expect(headerIndex).toBeGreaterThanOrEqual(0);

            // Compression method field is at offset 10 within the central directory header.
            const compressionMethod = zipBuffer.readUInt16LE(headerIndex + 10);
            // 0 = stored (no compression), 8 = deflate
            expect(compressionMethod).toBe(0);

            // Compressed size field at offset 20 in the central directory header.
            const compressedSize = zipBuffer.readUInt32LE(headerIndex + 20);
            expect(compressedSize).toBe(content.length);
        } finally {
            fs.rmSync(tmpDir, { recursive: true, force: true });
        }
    });
});