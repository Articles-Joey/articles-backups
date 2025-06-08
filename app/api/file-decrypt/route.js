import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

function hasExtension(filePath) {
    return path.extname(filePath) !== '';
}

function isDirectory(p) {
    try {
        return fs.lstatSync(p).isDirectory();
    } catch {
        return false;
    }
}

function getAllFiles(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.lstatSync(filePath);
        if (stat && stat.isDirectory()) {
            results = results.concat(getAllFiles(filePath));
        } else {
            results.push(filePath);
        }
    });
    return results;
}

const PASSWORD = 'test';
const ALGORITHM = 'aes-256-cbc';
const KEYLEN = 32; // 256 bits
const IVLEN = 16; // 128 bits

export async function POST(req) {
    try {
        const { filePath } = await req.json();
        // const filePath = "F:\\My Documents\\Sites\articles-backups\backups\My Documents\2025-06-03_20-08-48";
        if (!filePath) {
            return NextResponse.json({ error: 'Missing file or folder path' }, { status: 400 });
        }
        let pathsToProcess = [];
        if (isDirectory(filePath)) {
            // Only process data.zip.enc or files inside a data folder
            const allFiles = getAllFiles(filePath);
            pathsToProcess = allFiles.filter(f => {
                const lower = f.toLowerCase();
                // Only decrypt .enc files that are data.zip.enc or inside a data folder
                return (
                    (lower.endsWith('data.zip.enc')) ||
                    (lower.includes(`${path.sep}data${path.sep}`) && lower.endsWith('.enc'))
                );
            });
        } else {
            pathsToProcess = [filePath];
        }
        const results = [];
        for (const encFile of pathsToProcess) {
            if (!encFile.endsWith('.enc')) continue;
            let decryptedPath = encFile.replace(/\.enc$/, '');
            if (decryptedPath === encFile) {
                decryptedPath = encFile + '.dec';
            }
            const key = crypto.scryptSync(PASSWORD, 'salt', KEYLEN);
            const input = fs.createReadStream(encFile, { start: IVLEN });
            const iv = Buffer.alloc(IVLEN);
            const fd = fs.openSync(encFile, 'r');
            fs.readSync(fd, iv, 0, IVLEN, 0);
            fs.closeSync(fd);
            const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
            const output = fs.createWriteStream(decryptedPath);
            await new Promise((resolve, reject) => {
                input.pipe(decipher).pipe(output);
                output.on('finish', resolve);
                output.on('error', reject);
            });
            fs.unlinkSync(encFile);
            results.push({ decryptedPath });
        }
        // Update details.json if present in the root of the provided folder
        if (isDirectory(filePath)) {
            const detailsPath = path.join(filePath, 'details.json');
            if (fs.existsSync(detailsPath)) {
                try {
                    const details = JSON.parse(fs.readFileSync(detailsPath, 'utf-8'));
                    details.encrypted = false;
                    details.encryption_method = false;
                    fs.writeFileSync(detailsPath, JSON.stringify(details, null, 2));
                } catch (e) {
                    // Optionally log or ignore
                }
            }
        }
        return NextResponse.json({ success: true, results });
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
