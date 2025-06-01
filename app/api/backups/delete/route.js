import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req) {
  // Block in production
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 });
  }

  try {
    const { folderPath } = await req.json();

    if (!folderPath || typeof folderPath !== 'string') {
      return NextResponse.json({ error: 'Invalid folder path' }, { status: 400 });
    }

    // Prevent accessing outside the project directory
    const baseDir = path.join(process.cwd(), 'backups');
    const resolvedPath = path.resolve(baseDir, folderPath);

    console.log("resolvedPath", resolvedPath)

    if (!resolvedPath.startsWith(baseDir)) {
      return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
    }

    // Ensure folder exists
    if (!fs.existsSync(resolvedPath) || !fs.lstatSync(resolvedPath).isDirectory()) {
      return NextResponse.json({ error: 'Folder does not exist' }, { status: 404 });
    }

    // Recursively delete
    fs.rmSync(resolvedPath, { recursive: true, force: true });

    return NextResponse.json({ success: true, deleted: resolvedPath });
  } catch (err) {
    console.error('Delete folder error:', err);
    return NextResponse.json({ error: 'Failed to delete folder' }, { status: 500 });
  }
}
