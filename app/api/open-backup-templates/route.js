import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';

export async function GET() {
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json({ error: 'Only allowed in development' }, { status: 403 });
  }

  const folderPath = path.join(process.cwd(), 'backup-templates');

  // Platform-specific command
  const openCommand = process.platform === 'win32'
    ? `start "" "${folderPath}"`
    : process.platform === 'darwin'
    ? `open "${folderPath}"`
    : `xdg-open "${folderPath}"`; // Linux

  exec(openCommand, (err) => {
    if (err) {
      console.error('Failed to open folder:', err);
    }
  });

  return NextResponse.json({ success: true, opened: folderPath });
}