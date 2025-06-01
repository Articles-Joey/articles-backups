import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req) {
  // Restrict to development mode
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 });
  }

  try {
    const { filePath } = await req.json();

    if (!filePath || typeof filePath !== 'string' || !filePath.endsWith('.json')) {
      return NextResponse.json({ error: 'Invalid file path' }, { status: 400 });
    }

    const baseDir = process.cwd();
    const resolvedPath = path.resolve(baseDir, filePath);

    if (!resolvedPath.startsWith(baseDir)) {
      return NextResponse.json({ error: 'Path is outside the project directory' }, { status: 400 });
    }

    if (!fs.existsSync(resolvedPath)) {
      return NextResponse.json({ error: 'File does not exist' }, { status: 404 });
    }

    const content = fs.readFileSync(resolvedPath, 'utf-8');
    const json = JSON.parse(content);

    json.favorite = !json.favorite;

    fs.writeFileSync(resolvedPath, JSON.stringify(json, null, 2), 'utf-8');

    return NextResponse.json({ success: true, favorite: json.favorite });
  } catch (err) {
    console.error('Error toggling favorite:', err);
    return NextResponse.json({ error: 'Failed to toggle favorite' }, { status: 500 });
  }
}