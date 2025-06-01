import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const templatesDir = path.join(process.cwd(), 'backup-templates');

    // Check if the folder exists
    if (!fs.existsSync(templatesDir)) {
      return NextResponse.json({ templates: [] });
    }

    // Read all files in the directory
    const files = fs.readdirSync(templatesDir).filter(file => file.endsWith('.json'));

    const templates = [];

    for (const file of files) {
      const filePath = path.join(templatesDir, file);
      try {
        const content = fs.readFileSync(filePath, 'utf-8');
        const json = JSON.parse(content);
        if (json?.name) {
          templates.push(json);
        } else {
          console.warn(`Skipping ${file} — missing "name" key`);
        }
      } catch (err) {
        console.warn(`Error reading ${file}:`, err);
      }
    }

    return NextResponse.json({ templates });
  } catch (error) {
    console.error('Failed to load backup templates:', error);
    return NextResponse.json({ error: 'Failed to load templates' }, { status: 500 });
  }
}
