import { exec } from 'child_process';
import { promisify } from 'util';
import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

const execAsync = promisify(exec);

function getFolderSize(folderPath: string): number {
  let totalSize = 0;

  function walk(dir: string) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const fullPath = path.join(dir, file);
      const stat = fs.statSync(fullPath);
      if (stat.isDirectory()) {
        walk(fullPath);
      } else {
        totalSize += stat.size;
      }
    }
  }

  walk(folderPath);
  return totalSize;
}

export async function POST(req: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 });
  }

  try {
    const { folderPath } = await req.json();

    if (!folderPath || typeof folderPath !== 'string') {
      return NextResponse.json({ error: 'Invalid folder path' }, { status: 400 });
    }

    const baseDir = process.cwd();
    const resolvedPath = path.resolve(baseDir, folderPath);
    const dataDir = path.join(resolvedPath, 'data');
    const detailsPath = path.join(resolvedPath, 'details.json');
    const encryptedVolumePath = path.join(resolvedPath, 'encrypted.vc');
    const sizeMB = 50; // Customize volume size if needed

    if (!resolvedPath.startsWith(baseDir)) {
      return NextResponse.json({ error: 'Path is outside the project directory' }, { status: 400 });
    }

    if (!fs.existsSync(resolvedPath) || !fs.lstatSync(resolvedPath).isDirectory()) {
      return NextResponse.json({ error: 'Folder does not exist' }, { status: 404 });
    }

    let details: Record<string, any> = {};
    if (fs.existsSync(detailsPath)) {
      try {
        details = JSON.parse(fs.readFileSync(detailsPath, 'utf-8'));
      } catch (err) {
        console.warn('Failed to parse details.json:', err);
      }
    }

    const isEncrypted = !!details.encrypted;

    if (isEncrypted) {
      return NextResponse.json({ success: true, action: 'Already encrypted' });
    }

    const veracryptDir = 'C:\\Program Files\\VeraCrypt'; // adjust if different
    const veracryptExe = '.\\VeraCrypt Format.exe';

    // Create encrypted VeraCrypt volume
    // const createCommand = `VeraCrypt /create "${encryptedVolumePath}" /size ${sizeMB}M /password test /encryption AES /hash SHA-512 /filesystem exFAT /volumeType normal /quick /silent`;

    // const createCommand = `cd "${veracryptDir}" && ${veracryptExe} /create "${encryptedVolumePath}" /size ${sizeMB}M /password test /encryption AES /hash SHA-512 /filesystem exFAT /volumeType normal /quick /silent`;

    const veracryptFormat = `"C:\\Program Files\\VeraCrypt\\VeraCrypt Format.exe"`;
    const veracryptLocation = `"F:\\My Documents\\Sites\\articles-backups\\backups\\My Documents\\2025-06-03_20-08-48"`;
    const createCommand = `${veracryptFormat} /create ${veracryptLocation} /size "200M" /password test /encryption AES /hash sha-512 /filesystem exFAT /pim 0 /silent /force`

    await execAsync(createCommand);

    // Mark as encrypted
    details.encrypted = true;
    fs.writeFileSync(detailsPath, JSON.stringify(details, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      action: 'Encrypted with VeraCrypt',
      volume: encryptedVolumePath
    });

  } catch (err: any) {
    console.error('Encryption error:', err);
    return NextResponse.json({ error: 'Failed to encrypt folder' }, { status: 500 });
  }
}
