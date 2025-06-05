import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';

export async function POST(req: Request) {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Not allowed in production' }, { status: 403 });
  }

  try {
    const { name } = await req.json();

    if (!name || typeof name !== 'string') {
      return NextResponse.json({ error: 'Invalid name' }, { status: 400 });
    }

    const templatesDir = path.join(process.cwd(), 'backup-templates');
    const filePath = path.join(templatesDir, `${name}.json`);

    // Ensure directory exists
    if (!fs.existsSync(templatesDir)) {
      fs.mkdirSync(templatesDir, { recursive: true });
    }

    // Check if file already exists
    if (fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'Template already exists' }, { status: 409 });
    }

    const jsonContent = {
      name,
      locations: []
    };

    fs.writeFileSync(filePath, JSON.stringify(jsonContent, null, 2), 'utf-8');

    return NextResponse.json({ success: true, file: `${name}.json` });
  } catch (err: any) {
    console.error('Template creation error:', err);
    return NextResponse.json({ error: 'Failed to create template' }, { status: 500 });
  }
}
