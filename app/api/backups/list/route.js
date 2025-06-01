import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  try {
    const backupsDir = path.join(process.cwd(), 'backups');

    if (!fs.existsSync(backupsDir)) {
      return NextResponse.json({ backups: [] });
    }

    const detailsList = [];

    const topFolders = fs.readdirSync(backupsDir);

    for (const subfolder of topFolders) {
      const subfolderPath = path.join(backupsDir, subfolder);

      if (!fs.lstatSync(subfolderPath).isDirectory()) continue;

      const timestampFolders = fs.readdirSync(subfolderPath);

      for (const timestamp of timestampFolders) {
        const timestampPath = path.join(subfolderPath, timestamp);

        if (!fs.lstatSync(timestampPath).isDirectory()) continue;

        const detailsPath = path.join(timestampPath, 'details.json');

        if (fs.existsSync(detailsPath)) {
          try {
            const content = fs.readFileSync(detailsPath, 'utf-8');
            const json = JSON.parse(content);

            // Create relative path from `backups/`
            json.directDetailsPath = path.join('backups', subfolder, timestamp, 'details.json');

            detailsList.push(json);
          } catch (err) {
            console.warn(`Failed to parse details.json in ${subfolder}/${timestamp}:`, err);
          }
        }
      }
    }

    return NextResponse.json({ backups: detailsList });
  } catch (error) {
    console.error('Error reading backup details:', error);
    return NextResponse.json({ error: 'Failed to list backup details' }, { status: 500 });
  }
}
