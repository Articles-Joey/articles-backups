import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Helper to get all backup details from a given directory
function getBackupDetailsFromDir(backupsDir) {
  if (!fs.existsSync(backupsDir)) return [];
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
          json.directDetailsPath = path.join(backupsDir, subfolder, timestamp, 'details.json');
          json.directPath = path.join(backupsDir, subfolder, timestamp);
          detailsList.push(json);
        } catch (err) {
          console.warn(`Failed to parse details.json in ${subfolder}/${timestamp}:`, err);
        }
      }
    }
  }
  return detailsList;
}

export async function POST(req) {
  try {
    const { storageLocations } = await req.json();
    // Always include the default /backups directory
    const defaultBackupsDir = path.join(process.cwd(), 'backups');
    let allLocations = Array.isArray(storageLocations) ? [...storageLocations] : [];
    if (!allLocations.includes(defaultBackupsDir)) {
      allLocations.push(defaultBackupsDir);
    }
    // Remove duplicates
    allLocations = Array.from(new Set(allLocations));
    let allDetails = [];
    for (const dir of allLocations) {
      allDetails = allDetails.concat(getBackupDetailsFromDir(dir));
    }
    return NextResponse.json({ backups: allDetails.sort((a, b) => new Date(b.date) - new Date(a.date)) });
  } catch (error) {
    console.error('Error reading backup details:', error);
    return NextResponse.json({ error: 'Failed to list backup details' }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const { searchParams } = req.nextUrl;
    let storageLocations = [];
    if (searchParams.has('storageLocations')) {
      try {
        storageLocations = JSON.parse(searchParams.get('storageLocations'));
      } catch (e) {
        storageLocations = [];
      }
    }
    const defaultBackupsDir = path.join(process.cwd(), 'backups');
    let allLocations = Array.isArray(storageLocations) ? [...storageLocations] : [];
    if (!allLocations.includes(defaultBackupsDir)) {
      allLocations.push(defaultBackupsDir);
    }
    allLocations = Array.from(new Set(allLocations));
    let allDetails = [];
    for (const dir of allLocations) {
      allDetails = allDetails.concat(getBackupDetailsFromDir(dir));
    }
    return NextResponse.json({ backups: allDetails.sort((a, b) => new Date(b.date) - new Date(a.date)) });
  } catch (error) {
    console.error('Error reading backup details:', error);
    return NextResponse.json({ error: 'Failed to list backup details' }, { status: 500 });
  }
}
