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
    const zipPath = path.join(resolvedPath, 'data.zip');
    const detailsPath = path.join(resolvedPath, 'details.json');

    if (!resolvedPath.startsWith(baseDir)) {
      return NextResponse.json({ error: 'Path is outside the project directory' }, { status: 400 });
    }

    if (!fs.existsSync(resolvedPath) || !fs.lstatSync(resolvedPath).isDirectory()) {
      return NextResponse.json({ error: 'Folder does not exist' }, { status: 404 });
    }

    // Only check for dataDir if compressing, not uncompressing
    let details: Record<string, any> = {};
    if (fs.existsSync(detailsPath)) {
      try {
        details = JSON.parse(fs.readFileSync(detailsPath, 'utf-8'));
      } catch (err) {
        console.warn('Failed to parse details.json:', err);
      }
    }

    const isCompressed = !!details.compressed;

    if (isCompressed) {
      // Uncompress: extract data.zip to data folder, remove compressionSize
      if (fs.existsSync(zipPath)) {
      // Ensure the data folder does not exist before extraction
      if (fs.existsSync(dataDir)) {
        fs.rmSync(dataDir, { recursive: true, force: true });
      }
      // Use PowerShell to extract the zip
      const extractCommand = `powershell -Command "Expand-Archive -Path '${zipPath}' -DestinationPath '${dataDir}' -Force"`;
      await execAsync(extractCommand);
      fs.unlinkSync(zipPath);
      }

      details.compressed = false;
      delete details.compressionSize;
      fs.writeFileSync(detailsPath, JSON.stringify(details, null, 2), 'utf-8');

      return NextResponse.json({ success: true, action: 'uncompressed' });
    }

    // Only check for dataDir if compressing
    if (!fs.existsSync(dataDir) || !fs.lstatSync(dataDir).isDirectory()) {
      return NextResponse.json({ error: 'Missing data/ folder to compress' }, { status: 400 });
    }

    const preSize = getFolderSize(dataDir);
    details.preCompressionSize = preSize;
    fs.writeFileSync(detailsPath, JSON.stringify(details, null, 2), 'utf-8');

    const command = `powershell -Command "Compress-Archive -Path '${dataDir}\\*' -DestinationPath '${zipPath}' -Force"`;
    await execAsync(command);

    // Remove the data folder after compression
    fs.rmSync(dataDir, { recursive: true, force: true });

    const zipStats = fs.statSync(zipPath);
    details.compressed = true;
    details.compressionSize = zipStats.size;

    fs.writeFileSync(detailsPath, JSON.stringify(details, null, 2), 'utf-8');

    return NextResponse.json({
      success: true,
      action: 'compressed',
      zipPath,
      compressionSize: zipStats.size,
      preCompressionSize: preSize,
    });
  } catch (err: any) {
    console.error('Compression error:', err);
    return NextResponse.json({ error: 'Failed to toggle compression' }, { status: 500 });
  }
}
