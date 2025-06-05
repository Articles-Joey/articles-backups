import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function POST(req: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 });
  }

  try {
    const { fileName } = await req.json();

    if (!fileName || typeof fileName !== 'string') {
      return NextResponse.json({ error: 'Invalid file name' }, { status: 400 });
    }

    const templatesDir = path.join(process.cwd(), 'backup-templates');
    const filePath = path.join(templatesDir, fileName);

    // Security check: Ensure the file is within the allowed directory
    if (!filePath.startsWith(templatesDir)) {
      return NextResponse.json({ error: 'Invalid file path' }, { status: 400 });
    }

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'File does not exist' }, { status: 404 });
    }

    fs.unlinkSync(filePath);

    return NextResponse.json({ success: true, deleted: fileName });
  } catch (err: any) {
    console.error('Delete file error:', err);
    return NextResponse.json({ error: 'Failed to delete file' }, { status: 500 });
  }
}
