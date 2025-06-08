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

const PASSWORD = process.env.ENCRYPTION_PLAINTEXT_PASSWORD;
const ALGORITHM = 'aes-256-cbc';
const KEYLEN = 32; // 256 bits
const IVLEN = 16; // 128 bits

export async function POST(req) {
    try {
        const { filePath } = await req.json();
        if (!filePath) {
            return NextResponse.json({ error: 'Missing file or folder path' }, { status: 400 });
        }
        let pathsToProcess = [];
        if (isDirectory(filePath)) {
            // Only process data.zip or files inside a data folder
            const allFiles = getAllFiles(filePath);
            pathsToProcess = allFiles.filter(f => {
                const lower = f.toLowerCase();
                // Only encrypt data.zip or files inside a data folder, never details.json
                return (
                    (lower.endsWith('data.zip')) ||
                    (lower.includes(`${path.sep}data${path.sep}`) && !lower.endsWith('details.json'))
                );
            });
        } else {
            pathsToProcess = [filePath];
        }
        const results = [];
        for (const plainFile of pathsToProcess) {
            if (!hasExtension(plainFile)) continue;
            const encryptedPath = plainFile + '.enc';
            const key = crypto.scryptSync(PASSWORD, 'salt', KEYLEN);
            const iv = crypto.randomBytes(IVLEN);
            const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
            const input = fs.createReadStream(plainFile);
            const output = fs.createWriteStream(encryptedPath);
            output.write(iv);
            await new Promise((resolve, reject) => {
                input.pipe(cipher).pipe(output);
                output.on('finish', resolve);
                output.on('error', reject);
            });
            fs.unlinkSync(plainFile);
            results.push({ encryptedPath });
        }
        // Update details.json if present in the root of the provided folder
        if (isDirectory(filePath)) {
            const detailsPath = path.join(filePath, 'details.json');
            if (fs.existsSync(detailsPath)) {
                try {
                    const details = JSON.parse(fs.readFileSync(detailsPath, 'utf-8'));
                    details.encrypted = true;
                    details.encryption_method = 'aes-256-cbc';
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
